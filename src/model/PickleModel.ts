import { AssetEnablement, AssetProjectedApr, AssetType, DillDetails, ExternalAssetDefinition, HarvestStyle, JarDefinition, PickleAsset, PickleModelJson, PlatformData, StandaloneFarmDefinition } from "./PickleModelJson";
import { BigNumber, BigNumberish, ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { Provider as MulticallProvider, Contract as MulticallContract} from 'ethers-multicall';
import controllerAbi from "../Contracts/ABIs/controller.json";
import strategyAbi from "../Contracts/ABIs/strategy.json";
import jarAbi from "../Contracts/ABIs/jar.json";
import erc20Abi from '../Contracts/ABIs/erc20.json';
import { ChainNetwork, Chains } from "../chain/Chains";
import { PriceCache } from "../price/PriceCache";
import { ExternalTokenFetchStyle, ExternalTokenModelSingleton } from "../price/ExternalTokenModel";
import { CoinGeckoPriceResolver } from "../price/CoinGeckoPriceResolver";
import { getDillDetails, getWeeklyDistribution } from "../dill/DillUtility";
import { ASSET_PBAMM } from "./JarsAndFarms";
import { JarBehaviorDiscovery } from "../behavior/JarBehaviorDiscovery";
import { JarBehavior, JarHarvestStats } from "../behavior/JarBehaviorResolver";
import { PBammAsset } from "../behavior/impl/pbamm";
import { loadGaugeAprData } from "../farms/FarmUtil";
import { getDepositTokenPrice } from "../price/DepositTokenPriceUtility";


export const ADDRESSES = {
    Ethereum: {
      pickle: "0x429881672B9AE42b8EbA0E26cD9C73711b891Ca5",
      masterChef: "0xbD17B1ce622d73bD438b9E658acA5996dc394b0d",
      controller: "0x6847259b2B3A4c17e7c43C54409810aF48bA5210",
      dill: "0xbBCf169eE191A1Ba7371F30A1C344bFC498b29Cf",
      gaugeProxy: "0x2e57627ACf6c1812F99e274d0ac61B786c19E74f",
    },
    Polygon: {
      pickle: "0x2b88ad57897a8b496595925f43048301c37615da",
      masterChef: "0x20B2a3fc7B13cA0cCf7AF81A68a14CB3116E8749",
      controller: "0x83074F0aB8EDD2c1508D3F657CeB5F27f6092d09",
      minichef: "0x20B2a3fc7B13cA0cCf7AF81A68a14CB3116E8749",
    },
};

export const CONTROLLER_ETH = ADDRESSES.Ethereum.controller;
export const CONTROLLER_POLYGON = ADDRESSES.Polygon.controller;
export class PickleModel {
    private allAssets : PickleAsset[];
    private prices : PriceCache;
    private dillDetails: DillDetails;
    private platformData: PlatformData;
    // This can be used to cache any object with a key that might be shared
    // by a few different classes. 
    resourceCache: Map<string, any>;
    private configuredChains: ChainNetwork[];

    constructor( allAssets: PickleAsset[], chains: Map<ChainNetwork, Provider | Signer>) {
        // Make a copy so the original definitions stay unchanged. 
        this.allAssets = JSON.parse(JSON.stringify(allAssets));
        this.initializeChains(chains);
        this.initializePriceCache();
        this.resourceCache = new Map<string,any>();
    }

    getJars() : JarDefinition[] {
        const arr : PickleAsset[] = this.allAssets.filter((x)=>x.type===AssetType.JAR);
        return arr as JarDefinition[];
    }

    getStandaloneFarms() : StandaloneFarmDefinition[] {
        const arr : PickleAsset[] = this.allAssets.filter((x)=>x.type===AssetType.STANDALONE_FARM);
        return arr as StandaloneFarmDefinition[];
    }

    getExternalAssets() : ExternalAssetDefinition[] {
        const arr : PickleAsset[] = this.allAssets.filter((x)=>x.type===AssetType.EXTERNAL);
        return arr as ExternalAssetDefinition[];
    }

    semiActiveJars(chain: ChainNetwork) : JarDefinition[] {
        return this.getJars().filter(x => x.chain === chain 
            && x.enablement !== AssetEnablement.PERMANENTLY_DISABLED);
    }

    semiActiveAssets(chain: ChainNetwork) : PickleAsset[] {
        return [].concat(this.getJars().filter(x => x.chain === chain 
                && x.enablement !== AssetEnablement.PERMANENTLY_DISABLED))
                .concat(this.getStandaloneFarms().filter(x => x.chain === chain 
                    && x.enablement !== AssetEnablement.PERMANENTLY_DISABLED));
    }

    getAllAssets() : PickleAsset[] {
        return this.allAssets;
    }

    addr(name: string): string {
        const t1 = ExternalTokenModelSingleton.getToken(name, ChainNetwork.Ethereum)?.contractAddr;
        if (t1 !== undefined)
            return t1;
        return ExternalTokenModelSingleton.getToken(name, ChainNetwork.Polygon)?.contractAddr;
    }
    address(id: string, chain: ChainNetwork) {
        return ExternalTokenModelSingleton.getToken(id, chain)?.contractAddr;
    }
    tokenDecimals(id: string, chain:ChainNetwork) {
        return ExternalTokenModelSingleton.getToken(id, chain)?.decimals;
    }
    async priceOf(token: string) : Promise<number> {
        return this.prices.priceOf(token);
    }
    priceOfSync(token: string) : number {
        return this.prices.get(token);
    }
    providerFor(network: ChainNetwork) : Provider {
        return Chains.get(network).getPreferredWeb3Provider();
    }
    getResourceCache() : Map<string,any> {
        return this.resourceCache;
    }

    defaultControllerForChain(chain: ChainNetwork) {
        if( chain === ChainNetwork.Ethereum ) 
            return CONTROLLER_ETH;
        if( chain === ChainNetwork.Polygon) {
            return CONTROLLER_POLYGON;
        }
        return undefined;
    }

    findAsset(id: string) : PickleAsset {
        for( let i = 0; i < this.allAssets.length; i++ ) {
            if( this.allAssets[i].id === id) 
                return this.allAssets[i];
        }
        return undefined;
    }

    async generateFullApi() : Promise<PickleModelJson> {
        const t1 = Date.now();
        await Promise.all([
            this.ensurePriceCacheLoaded(),
            this.ensureStrategyDataLoaded(),
            this.ensureRatiosLoaded(),
            this.ensureJarTotalSupplyLoaded(),
            this.ensureDepositTokenTotalSupplyLoaded(),
            this.ensureComponentTokensLoaded(),
        ]);
        const t2 = Date.now();


        await this.ensureDepositTokenPriceLoaded();
        const t3 = Date.now();
        await this.ensureFarmsBalanceLoaded();
        const t3a = Date.now();

        await Promise.all([
            this.loadGaugeAprData(),
            this.ensureExternalAssetBalanceLoaded(),
            this.ensureHarvestDataLoaded(),
            this.loadApyComponents(),
        ]);
        const t4 = Date.now();
        this.dillDetails = await getDillDetails(getWeeklyDistribution(this.getJars()), 
                this.prices, Chains.getResolver(ChainNetwork.Ethereum));
        const t5 = Date.now();
        this.platformData = this.loadPlatformData();
        /*
        console.log(t2-t1);
        console.log(t3-t2);
        console.log(t3a-t3);
        console.log(t4-t3);
        console.log(t5-t4);
*/        
        return this.toJson();
    }

    toJson() : PickleModelJson {
        return {
            assets: {
                jars: this.getJars(),
                standaloneFarms: this.getStandaloneFarms(),
                external: this.getExternalAssets(),
            },
            dill: this.dillDetails,
            prices: Object.fromEntries(this.prices.getCache()),
            platform: this.platformData,
        }
    }

    initializePriceCache() {
        if( this.prices === undefined ) {
            this.prices = new PriceCache();
        }
    }

    initializeChains(chains: Map<ChainNetwork, Provider | Signer>) {
        for(let key of chains.keys()) {
            const resolver = chains.get(key);
            const isSigner : boolean = (resolver as Signer).provider !== undefined;
            const signer : Signer = isSigner ? (resolver as Signer) : undefined;
            const provider : Provider = isSigner ? (resolver as Signer).provider : (resolver as Provider);
            if( signer ) 
                Chains.get(key).setSigner(signer);
            if( provider) 
                Chains.get(key).setPreferredWeb3Provider(provider);
        }
        this.configuredChains = Array.from(chains.keys());
    }

    async ensurePriceCacheLoaded() : Promise<any> {
        if( this.prices && this.prices.getCache() && this.prices.getCache().size === 0 ) {
            const cgResolver = new CoinGeckoPriceResolver(ExternalTokenModelSingleton);
            return Promise.all(
                this.configuredChains.map((x)=>this.prices.getPrices(
                    ExternalTokenModelSingleton.getTokens(x).filter(val => val.fetchType != ExternalTokenFetchStyle.NONE).map(a => a.coingeckoId),
                    cgResolver
                ))
            );
        }
    }

    async ensureStrategyDataLoaded() {
        const jars : JarDefinition[] = this.getJars();
        for( let i = 0; i < jars.length; i++ ) {
            if( jars[i].details.strategyAddr === undefined || jars[i].details.strategyName === undefined ) {
                await this.loadStrategyData();
                return;
            }
        }
    }

    async loadStrategyData() : Promise<any> {
        const jars : JarDefinition[] = this.getJars();
        const promises : Promise<any>[] = [];
        for( let i = 0; i < this.configuredChains.length; i++ ) {
            const controller = this.defaultControllerForChain(this.configuredChains[i]);
            const chainJars = jars.filter(x => x.chain === this.configuredChains[i] && x.details?.controller === undefined);
            promises.push(this.addJarStrategies(chainJars, controller, Chains.getResolver(this.configuredChains[i])));
        }

        // Now handle jars with custom controllers
        const customControllerJars = jars.filter(x => x.details?.controller !== undefined);
        for( let i = 0; i < customControllerJars.length; i++ ) {
            promises.push(this.addJarStrategies([customControllerJars[i]], 
                customControllerJars[i].details.controller, 
                Chains.getResolver(customControllerJars[i].chain)));
        }
        return Promise.all(promises);
    }



    async ensureRatiosLoaded() : Promise<any> {
        const jars : JarDefinition[] = this.getJars();
        for( let i = 0; i < jars.length; i++ ) {
            if( jars[i].details.ratio === undefined ) {
                return this.loadRatiosData();
            }
        }
    }

    async loadRatiosData() : Promise<any> {
        await Promise.all(this.configuredChains.map((x)=> 
                this.addJarRatios(this.semiActiveJars(x), Chains.getResolver(x))));
    }

    async ensureJarTotalSupplyLoaded() : Promise<any>  {
        const jars : JarDefinition[] = this.getJars();
        for( let i = 0; i < jars.length; i++ ) {
            if( jars[i].details.totalSupply === undefined ) {
                return this.loadJarTotalSupplyData();
            }
        }
    }
    async loadJarTotalSupplyData() : Promise<any>  {
        return Promise.all(this.configuredChains.map((x)=>
            this.addJarTotalSupply(this.semiActiveJars(x), Chains.getResolver(x))));
    }

    async ensureComponentTokensLoaded() : Promise<any> {
        return Promise.all(this.configuredChains.map((x)=>
            this.ensureComponentTokensLoadedForChain(x)));
    }

    async ensureComponentTokensLoadedForChain(chain: ChainNetwork) {
        interface requests {
            asset: PickleAsset,
            pool: string,
            token: string,
            tokenName: string,
            result?: BigNumberish
            
        };
        const arr : requests[] = [];
        const assets = this.getAllAssets().filter((x)=>x.chain === chain);
        for( let i = 0; i < assets.length; i++ ) {
            if( assets[i].depositToken && assets[i].depositToken.components 
                && assets[i].depositToken.components.length > 0) {
                for( let j = 0; j < assets[i].depositToken.components.length; j++ ) {
                    arr.push({
                        asset: assets[i],
                        pool: assets[i].depositToken.addr, 
                        tokenName: assets[i].depositToken.components[j],
                        token:  this.address(assets[i].depositToken.components[j], chain)})
                }
            }
        }

        const ethcallProvider = new MulticallProvider(Chains.get(chain).getPreferredWeb3Provider());
        await ethcallProvider.init();

        const results : string[] = await ethcallProvider.all<string[]>(
            arr.map((oneArr) => new MulticallContract(oneArr.token, erc20Abi).balanceOf(oneArr.pool))
        );

        for( let i = 0; i < results.length; i++ ) {
            if( arr[i].asset.depositToken.componentTokens === undefined ) {
                arr[i].asset.depositToken.componentTokens = [];
            }
            const decimals = this.tokenDecimals(arr[i].token, arr[i].asset.chain);
            arr[i].asset.depositToken.componentTokens.push(
                parseFloat(ethers.utils.formatUnits(results[i], decimals)));
        }
    }

    async ensureDepositTokenTotalSupplyLoaded() {
        const jars : JarDefinition[] = this.getJars();
        for( let i = 0; i < jars.length; i++ ) {
            if( jars[i].details.totalSupply === undefined ) {
                await this.loadDepositTokenTotalSupplyData();
                return;
            }
        }
    }

    async loadDepositTokenTotalSupplyData() : Promise<any>  {
        return Promise.all(this.configuredChains.map((x)=>
            this.addDepositTokenTotalSupply(this.semiActiveJars(x), Chains.getResolver(x))));
    }

    async ensureDepositTokenPriceLoaded() {
        let notDisabled : PickleAsset[] = this.allAssets.filter((jar)=>{return jar.enablement !== AssetEnablement.PERMANENTLY_DISABLED});
        let prices : number[] = await Promise.all(notDisabled.map((x)=>getDepositTokenPrice(x, this)));
        for( let i = 0; i < notDisabled.length; i++ ) {
            notDisabled[i].depositToken.price = prices[i];
            this.prices.put(notDisabled[i].depositToken.addr, prices[i]);
        }
    }

    async addJarStrategies(jars: JarDefinition[], controllerAddr: string, resolver: Signer | Provider) {
        const ethcallProvider = new MulticallProvider((resolver as Signer).provider === undefined ? (resolver as Provider) : (resolver as Signer).provider);
        await ethcallProvider.init();
        const controllerContract = new MulticallContract(controllerAddr, controllerAbi);

        const strategyAddresses : string[] = await ethcallProvider.all<string[]>(
            jars.map((oneJar) => controllerContract.strategies(oneJar.depositToken.addr))
          );
        for( let i = 0; i < jars.length; i++ ) {
            if( jars[i].details === undefined ) {
                jars[i].details = {
                    apiKey: undefined,
                    harvestStyle: HarvestStyle.PASSIVE
                };
            }
            jars[i].details.strategyAddr = strategyAddresses[i];
        }

        const ethcallProvider2 = new MulticallProvider((resolver as Signer).provider === undefined ? (resolver as Provider) : (resolver as Signer).provider);
        await ethcallProvider2.init();
        const withStrategyAddresses = jars.filter((x) => x.details.strategyAddr !== undefined && 
            x.details.strategyAddr !== "0x0000000000000000000000000000000000000000" && x.enablement !== AssetEnablement.PERMANENTLY_DISABLED);

/*
        // debug
        for( let i = 0; i < withStrategyAddresses.length; i++ ) {
            const ethcallProvider3 = new MulticallProvider((resolver as Signer).provider === undefined ? (resolver as Provider) : (resolver as Signer).provider);
            await ethcallProvider3.init();
            const arr : JarDefinition[] = [withStrategyAddresses[i]];
            await ethcallProvider3.all<string[]>(
                arr.map((oneJar) => new MulticallContract(oneJar.details.strategyAddr, strategyAbi).getName())
            ).then((response) => {
                console.log(response);
            });
        }
*/

        const strategyNames : string[] = await ethcallProvider2.all<string[]>(
            withStrategyAddresses.map((oneJar) => new MulticallContract(oneJar.details.strategyAddr, strategyAbi).getName())
        );
        for( let i = 0; i < withStrategyAddresses.length; i++ ) {
            withStrategyAddresses[i].details.strategyName = strategyNames[i];
        }
    }

    async addJarRatios(jars: JarDefinition[], resolver: Signer | Provider) {
        if( jars === undefined || jars.length === 0 ) 
            return;
        const ethcallProvider = new MulticallProvider((resolver as Signer).provider === undefined ? (resolver as Provider) : (resolver as Signer).provider);
        await ethcallProvider.init();

        const ratios : string[] = await ethcallProvider.all<string[]>(
            jars.map((oneJar) => new MulticallContract(oneJar.contract, jarAbi).getRatio())
          );
        for( let i = 0; i < jars.length; i++ ) {
            jars[i].details.ratio = parseFloat(ethers.utils.formatUnits(ratios[i]));
        }
    }

    async addJarTotalSupply(jars: JarDefinition[], resolver: Signer | Provider) {
        if( jars === undefined || jars.length === 0 )
            return;

        const ethcallProvider = new MulticallProvider((resolver as Signer).provider === undefined ? (resolver as Provider) : (resolver as Signer).provider);
        await ethcallProvider.init();

        const supply : string[] = await ethcallProvider.all<string[]>(
            jars.map((oneJar) => new MulticallContract(oneJar.contract, jarAbi).totalSupply())
          );
        for( let i = 0; i < jars.length; i++ ) {
            jars[i].details.totalSupply = parseFloat(ethers.utils.formatUnits(supply[i]));
        }
    }


    async addDepositTokenTotalSupply(jars: PickleAsset[], resolver: Signer | Provider) {
        if( jars === undefined || jars.length === 0 )
            return;

        const ethcallProvider = new MulticallProvider((resolver as Signer).provider === undefined ? (resolver as Provider) : (resolver as Signer).provider);
        await ethcallProvider.init();

        const supply : string[] = await ethcallProvider.all<string[]>(
            jars.map((oneJar) => new MulticallContract(oneJar.depositToken.addr, erc20Abi).totalSupply())
          );
        for( let i = 0; i < jars.length; i++ ) {
            jars[i].depositToken.totalSupply = 
            parseFloat(ethers.utils.formatUnits(supply[i], 
                this.tokenDecimals(jars[i].depositToken.addr, jars[i].chain)));
        }
    }


    async ensureHarvestDataLoaded() : Promise<any> {
        const map : Map<ChainNetwork, JarDefinition[]> = new Map();
        for( let i = 0; i < this.configuredChains.length; i++ ) {
            const missing : JarDefinition[] = [];
            const jars = this.getJars().filter(x => x.chain === this.configuredChains[i]);
            for( let j = 0; j < jars.length; j++ ) {
                if( jars[j].details.harvestStats === undefined && jars[j].enablement !== AssetEnablement.PERMANENTLY_DISABLED) {
                    missing.push(jars[j]);
                }
            }
            map.set(this.configuredChains[i], missing);
        }

        const promises : Promise<any>[] = [];
        for( let i = 0; i < this.configuredChains.length; i++ ) {
            promises.push(this.loadHarvestData(map.get(this.configuredChains[i]), this.configuredChains[i]));
        }
        return Promise.all(promises);
    }

    async loadHarvestData(jars: JarDefinition[], chain: ChainNetwork) {
        if( jars.length === 0) {
            return;
        }

        const signer : Provider = Chains.get(chain).getPreferredWeb3Provider();

        // Load balances as a group
        const multicallProvider = new MulticallProvider(signer);
        await multicallProvider.init();

        const multicallProvider2 = new MulticallProvider(signer);
        await multicallProvider2.init();

        const balanceOfProm : Promise<BigNumber[]> =  multicallProvider.all<BigNumber[]>(
            jars.map((oneJar) => new MulticallContract(oneJar.details.strategyAddr, strategyAbi).balanceOf()));

        // Load available as a group
        const availableProm : Promise<BigNumber[]> =  multicallProvider2.all<BigNumber[]>(
            jars.map((oneJar) => new MulticallContract(oneJar.contract, jarAbi).available()));

        const [balanceOf, available] = await Promise.all([
            balanceOfProm, availableProm
        ]);
        
    
        const harvestArr: Promise<JarHarvestStats>[] = [];
        const discovery : JarBehaviorDiscovery = new JarBehaviorDiscovery();
        const harvestableJars : JarDefinition[] = jars.filter((x)=>discovery.findAssetBehavior(x) !== null && discovery.findAssetBehavior(x) !== undefined)
        for( let i = 0; i < harvestableJars.length; i++ ) {
            try {
                const resolver = Chains.getResolver(harvestableJars[i].chain);
                const harvestResolver : JarBehavior = discovery.findAssetBehavior(harvestableJars[i]);
                harvestArr.push(harvestResolver.getAssetHarvestData(harvestableJars[i], this, 
                    balanceOf[i], available[i], resolver));
            } catch( e ) {
                console.log("Error loading harvest data for jar " + jars[i].id + ":  " + e);
            }
        }
        const results: JarHarvestStats[] = await Promise.all(harvestArr);
        for( let j = 0; j < harvestableJars.length; j++ ) {
            if( results[j] ) {
                results[j].balanceUSD = toThreeDec(results[j].balanceUSD);
                results[j].earnableUSD = toThreeDec(results[j].earnableUSD);
                results[j].harvestableUSD = toThreeDec(results[j].harvestableUSD);
            }
            harvestableJars[j].details.harvestStats = results[j];
            
        }
    }
    ensureStandaloneFarmsBalanceLoaded(farms: StandaloneFarmDefinition[], balances: any[]) {
        for( let i = 0; i < farms.length; i++ ) {
            const tokens = balances[i];
            const depositTokenPrice : number = farms[i].depositToken.price;
            const tokenBalance = parseFloat(ethers.utils.formatEther(tokens));
            const valueBalance = tokenBalance * depositTokenPrice;
            if( farms[i].details === undefined ) {
                farms[i].details = {};
            }
            farms[i].details.tokenBalance = tokenBalance;
            farms[i].details.valueBalance = valueBalance;
        }
    }

    ensureNestedFarmsBalanceLoaded(jarsWithFarms: JarDefinition[], balances: any[]) {
        for( let i = 0; i < jarsWithFarms.length; i++ ) {
            const ptokenPrice : number = jarsWithFarms[i].details.ratio * jarsWithFarms[i].depositToken.price;
            const ptokens = balances[i];
            const ptokenBalance = parseFloat(ethers.utils.formatEther(ptokens));
            const valueBalance = ptokenBalance * ptokenPrice;
            if( jarsWithFarms[i].farm.details === undefined ) {
                jarsWithFarms[i].farm.details = {};
            }
            jarsWithFarms[i].farm.details.tokenBalance = ptokenBalance;
            jarsWithFarms[i].farm.details.valueBalance = valueBalance;
        }
    }

    async ensureFarmsBalanceLoadedForProtocol(chain: ChainNetwork) {
        const ethcallProvider = new MulticallProvider(this.providerFor(chain));
        await ethcallProvider.init();

        // Run on eth standalone farms
        const ethFarms : StandaloneFarmDefinition[] = this.getStandaloneFarms().filter((x)=>x.chain === chain);
        const ethFarmResults : string[] = await ethcallProvider.all<string[]>(
            ethFarms.map((oneFarm) => new MulticallContract(oneFarm.depositToken.addr, erc20Abi).balanceOf(oneFarm.contract))
        );
        this.ensureStandaloneFarmsBalanceLoaded(ethFarms, ethFarmResults);


        const protocolJarsWithFarms : JarDefinition[] = this.semiActiveJars(chain).filter((x)=>{return x.farm !== undefined });
        const protocolJarsWithFarmResults : string[] = await ethcallProvider.all<string[]>(
            protocolJarsWithFarms.map((oneJar) => new MulticallContract(oneJar.contract, erc20Abi).balanceOf(oneJar.farm.farmAddress))
        );
        this.ensureNestedFarmsBalanceLoaded(protocolJarsWithFarms, protocolJarsWithFarmResults);
    }

    async loadGaugeAprData() : Promise<any> {
        return Promise.all(this.configuredChains.map((x)=> loadGaugeAprData(this, x)));
    }
    async ensureFarmsBalanceLoaded() : Promise<any> {
        return Promise.all(this.configuredChains.map((x)=>this.ensureFarmsBalanceLoadedForProtocol(x)));
    }


    async ensureExternalAssetBalanceLoaded() {
        // This needs to be separated out and unified, seriously. 
        const external : ExternalAssetDefinition[] = this.getExternalAssets();
        for( let i = 0; i < external.length; i++ ) {
            if( external[i].id === ASSET_PBAMM.id) {
                const asset = new PBammAsset();
                const bal = await asset.getAssetHarvestData(external[i], this, null, null, null);
                external[i].details.harvestStats = bal;

                const aprStats = await asset.getProjectedAprStats(external[i], this);
                external[i].aprStats = aprStats;
            }
        }
    }

    async loadApyComponents() {
        const withBehaviors : PickleAsset[] = 
            this.allAssets.filter((x)=>new JarBehaviorDiscovery().findAssetBehavior(x) !== undefined);
        const aprStats: AssetProjectedApr[] = await Promise.all(
            withBehaviors.map(async (x) => {
                return new JarBehaviorDiscovery().findAssetBehavior(x)
                        .getProjectedAprStats(x as JarDefinition, this);
            })
        );
        for( let i = 0; i < withBehaviors.length; i++ ) {
            withBehaviors[i].aprStats = this.cleanAprStats(aprStats[i]);
        }
    }

    cleanAprStats(stats: AssetProjectedApr) : AssetProjectedApr{
        if( stats ) {
            stats.apr = toThreeDec(stats.apr);
            stats.apy = toThreeDec(stats.apy);
            if( stats.components) {
                for( let i = 0; i < stats.components.length; i++ ) {
                    stats.components[i].apr = toThreeDec(stats.components[i].apr);
                    if( stats.components[i].maxApr)
                        stats.components[i].maxApr = toThreeDec(stats.components[i].maxApr);
                    
                }
            }
        }
        return stats;
    }

    loadPlatformData(): PlatformData {
        const farms : StandaloneFarmDefinition[] = this.getStandaloneFarms();
        let tvl = 0;
        let blendedRateSum = 0;
        let harvestPending = 0;
        for( let i = 0; i < farms.length; i++ ) {
            if( farms[i].details?.valueBalance) {
                tvl += farms[i].details?.valueBalance;
                // TODO standalone farms don't generate fees at all
                // They also don't increase AUM much at all other than emitted pickle
                //blendedRateSum += 0;
            }
        }
        const jars : JarDefinition[] = this.getJars();
        for( let i = 0; i < jars.length; i++ ) {
            if( jars[i].details?.harvestStats?.balanceUSD) {
                const jarApr = jars[i].aprStats?.apr ? jars[i].aprStats?.apr : 0;
                const bal = jars[i].details?.harvestStats?.balanceUSD ? jars[i].details.harvestStats.balanceUSD : 0;
                const pending = jars[i].details?.harvestStats?.harvestableUSD ? jars[i].details?.harvestStats?.harvestableUSD : 0;
                tvl += bal;
                blendedRateSum += (bal * jarApr);
                harvestPending += pending;
            }
        }
        return {
            platformTVL: tvl,
            platformBlendedRate: (blendedRateSum/tvl),
            harvestPending: harvestPending
        };
    }
}


const toThreeDec = function (param:number) {
    return Math.floor(param*1000)/1000;
  };


