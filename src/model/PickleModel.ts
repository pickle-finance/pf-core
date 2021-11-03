import { AssetEnablement, AssetProjectedApr, AssetProtocol, AssetType, DillDetails, ExternalAssetDefinition, HarvestStyle, JarDefinition, PickleAsset, PickleModelJson, PlatformData, StandaloneFarmDefinition } from "./PickleModelJson";
import { BigNumber, BigNumberish, ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { Provider as MulticallProvider, Contract as MulticallContract} from 'ethers-multicall';
import controllerAbi from "../Contracts/ABIs/controller.json";
import strategyAbi from "../Contracts/ABIs/strategy.json";
import jarAbi from "../Contracts/ABIs/jar.json";
import erc20Abi from '../Contracts/ABIs/erc20.json';
import univ3PoolAbi from "../Contracts/ABIs/univ3Pool.json";
import { ChainNetwork, Chains } from "../chain/Chains";
import { PriceCache } from "../price/PriceCache";
import { ExternalTokenFetchStyle, ExternalTokenModelSingleton } from "../price/ExternalTokenModel";
import { CoinGeckoPriceResolver } from "../price/CoinGeckoPriceResolver";
import { getDillDetails, getWeeklyDistribution } from "../dill/DillUtility";
import { JarBehaviorDiscovery } from "../behavior/JarBehaviorDiscovery";
import { JarBehavior, JarHarvestStats } from "../behavior/JarBehaviorResolver";
import { loadGaugeAprData } from "../farms/FarmUtil";
import { getDepositTokenPrice } from "../price/DepositTokenPriceUtility";

export const ADDRESSES = new Map([
    [ChainNetwork.Ethereum, {
        pickle: "0x429881672B9AE42b8EbA0E26cD9C73711b891Ca5",
        masterChef: "0xbD17B1ce622d73bD438b9E658acA5996dc394b0d",
        controller: "0x6847259b2B3A4c17e7c43C54409810aF48bA5210",
        dill: "0xbBCf169eE191A1Ba7371F30A1C344bFC498b29Cf",
        gaugeProxy: "0x2e57627ACf6c1812F99e274d0ac61B786c19E74f",
    }], 
    [ChainNetwork.Polygon, {
        pickle: "0x2b88ad57897a8b496595925f43048301c37615da",
        masterChef: "0x20B2a3fc7B13cA0cCf7AF81A68a14CB3116E8749",
        controller: "0x83074F0aB8EDD2c1508D3F657CeB5F27f6092d09",
        minichef: "0x20B2a3fc7B13cA0cCf7AF81A68a14CB3116E8749",
    }],
    [ChainNetwork.Arbitrum, {
        pickle: "0x965772e0E9c84b6f359c8597C891108DcF1c5B1A",
        masterChef: "0x7ecc7163469f37b777d7b8f45a667314030ace24",
        controller: "0x55d5bcef2bfd4921b8790525ff87919c2e26bd03",
        minichef: "0x7ecc7163469f37b777d7b8f45a667314030ace24",
      }],
    [ChainNetwork.OKEx, {
        pickle: "0x965772e0E9c84b6f359c8597C891108DcF1c5B1A",
        masterChef: "0x7ecc7163469f37b777d7b8f45a667314030ace24",
        controller: "0xcf05d96b4c6c5a87b73f5f274dce1085bc7fdcc4",
        minichef: "0x7446BF003b98B7B0D90CE84810AC12d6b8114B62",
      }],
]);
export const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
export const FICTIONAL_ADDRESS = "0x000FEED0BEEF000FEED0BEEF0000000000000000";

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

    // Results unpredictable if similar token on multiple chains. 
    // Please be specific, use address()
    addr(name: string): string {
        for( let i = 0; i < this.configuredChains.length; i++ ) {
            const t1 = ExternalTokenModelSingleton.getToken(name, this.configuredChains[i])?.contractAddr;
            if (t1 !== undefined)
            return t1;
        }
        return undefined;
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
        return this.prices.priceOf(token);
    }
    providerFor(network: ChainNetwork) : Provider {
        return Chains.get(network).getPreferredWeb3Provider();
    }
    multicallProviderFor(chain: ChainNetwork) : MulticallProvider {
        return new MulticallProvider(this.providerFor(chain), Chains.get(chain).id);
    }
    getResourceCache() : Map<string,any> {
        return this.resourceCache;
    }

    defaultControllerForChain(chain: ChainNetwork) {
        const addrObj = ADDRESSES.get(chain);
        return addrObj ? addrObj.controller : undefined;
    }

    controllerForJar(jar: JarDefinition) {
        return jar.details?.controller ? jar.details.controller 
            : this.defaultControllerForChain(jar.chain);
    }

    findAsset(id: string) : PickleAsset {
        for( let i = 0; i < this.allAssets.length; i++ ) {
            if( this.allAssets[i].id === id) 
                return this.allAssets[i];
        }
        return undefined;
    }

    async generateFullApi() : Promise<PickleModelJson> {
        await this.loadJarAndFarmData();
        this.dillDetails = await getDillDetails(getWeeklyDistribution(this.getJars()), 
                this.prices, this, ChainNetwork.Ethereum);
        this.platformData = this.loadPlatformData();
        return this.toJson();
    }
    async loadJarAndFarmData() : Promise<void> {

        await Promise.all([
            this.ensurePriceCacheLoaded(),
            this.loadStrategyData(),
            this.loadRatiosData(),
            this.loadJarTotalSupplyData(),
            this.loadDepositTokenTotalSupplyData(),
            this.loadJarBalanceData(),
            this.ensureComponentTokensLoaded(),
        ]);

        await this.ensureDepositTokenPriceLoaded();
        await this.ensureFarmsBalanceLoaded();

        await Promise.all([
            this.loadGaugeAprData(),
            this.ensureExternalAssetBalanceLoaded(),
            this.ensureHarvestDataLoaded(),
            this.loadApyComponents(),
        ]);
    }

    toJson() : PickleModelJson {
        const ret = {
            tokens: ExternalTokenModelSingleton.getAllTokensOutput(),
            prices: Object.fromEntries(this.prices.getCache()),
            dill: this.dillDetails,
            assets: {
                jars: this.getJars(),
                standaloneFarms: this.getStandaloneFarms(),
                external: this.getExternalAssets(),
            },
            platform: this.platformData,
            timestamp: Date.now(),
        }
        return ret;
    }

    initializePriceCache() {
        if( this.prices === undefined ) {
            this.prices = new PriceCache();
        }
    }

    initializeChains(chains: Map<ChainNetwork, Provider | Signer>) {
        const allChains : ChainNetwork[] = Chains.list();
        Chains.globalInitialize(chains);
        this.configuredChains = allChains;
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

    async loadStrategyData() : Promise<any> {
        const jars : JarDefinition[] = this.getJars();
        const promises : Promise<any>[] = [];
        for( let i = 0; i < this.configuredChains.length; i++ ) {
            const controller = this.defaultControllerForChain(this.configuredChains[i]);
            const chainJars = jars.filter(x => x.chain === this.configuredChains[i] && x.details?.controller === undefined);
            promises.push(this.addJarStrategies(chainJars, controller, this.configuredChains[i]));
        }

        // Now handle jars with custom controllers
        const customControllerJars = jars.filter(x => x.details?.controller !== undefined);
        for( let i = 0; i < customControllerJars.length; i++ ) {
            promises.push(this.addJarStrategies([customControllerJars[i]], 
                customControllerJars[i].details.controller, customControllerJars[i].chain));
        }
        try{
            return Promise.all(promises);
        } catch ( error ) { this.logError("loadStrategyData", error); }
    }


    async loadRatiosData() : Promise<any> {
        await Promise.all(this.configuredChains.map((x)=> 
                this.addJarRatios(this.semiActiveJars(x), x)));
    }

    async loadJarTotalSupplyData() : Promise<any>  {
        return Promise.all(this.configuredChains.map((x)=>
            this.addJarTotalSupply(this.semiActiveJars(x), x)));
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

        const ethcallProvider = this.multicallProviderFor(chain);
        await ethcallProvider.init();

        let results : string[] = undefined; 
        try {
            results = await ethcallProvider.all<string[]>(
                arr.map((oneArr) => new MulticallContract(oneArr.token, erc20Abi).balanceOf(oneArr.pool))
            );
        } catch ( error ) { this.logError("ensureComponentTokensLoadedForChain", error, chain); }

        for( let i = 0; results !== undefined && i < results.length; i++ ) {
            if( arr[i].asset.depositToken.componentTokens === undefined ) {
                arr[i].asset.depositToken.componentTokens = [];
            }
            const decimals = this.tokenDecimals(arr[i].token, arr[i].asset.chain);
            arr[i].asset.depositToken.componentTokens.push(
                parseFloat(ethers.utils.formatUnits(results[i], decimals)));
        }
    }

    async loadDepositTokenTotalSupplyData() : Promise<any>  {
        return Promise.all(this.configuredChains.map((x)=>
            this.addDepositTokenTotalSupply(this.semiActiveJars(x), x)));
    }

    async loadJarBalanceData() : Promise<any>  {
        return Promise.all(this.configuredChains.map((x)=>
            this.addDepositTokenBalance(this.semiActiveJars(x), x)));
    }


    // Could this be moved to the asset behaviors instead??
    async ensureDepositTokenPriceLoaded() {
        const jarBehaviorResolver = new JarBehaviorDiscovery();
        const notDisabled : PickleAsset[] = this.allAssets.filter((jar)=>{return jar.enablement !== AssetEnablement.PERMANENTLY_DISABLED});
        let prices : number[] = undefined;
        try {
            prices = await Promise.all(notDisabled.map((x)=>{
                const beh = jarBehaviorResolver.findAssetBehavior(x);
                return beh ? beh.getDepositTokenPrice(x, this) : getDepositTokenPrice(x, this);
            }));
        } catch ( error ) { this.logError("ensureDepositTokenPriceLoaded", error); }
        for( let i = 0; prices !== undefined && i < notDisabled.length; i++ ) {
            notDisabled[i].depositToken.price = prices[i];
            this.prices.put(notDisabled[i].depositToken.addr, prices[i]);
        }
    }

    // All jars called here must be on the same chain.
    async addJarStrategies(jars: JarDefinition[], controllerAddr: string, chain: ChainNetwork) {
        if( !jars || jars.length === 0 )
            return;
        const ethcallProvider = this.multicallProviderFor(chain);
        await ethcallProvider.init();
        const controllerContract = new MulticallContract(controllerAddr, controllerAbi);

        let strategyAddresses : string[] = undefined;
        try {
            strategyAddresses = await ethcallProvider.all<string[]>(
                jars.map((oneJar) => {
                    return controllerContract.strategies(oneJar.depositToken.addr)
                })
            );
        } catch(error) {
            this.logError("addJarStrategies: strategyAddresses", error, chain);
        }
        for( let i = 0; strategyAddresses !== undefined && i < jars.length; i++ ) {
            if( jars[i].details === undefined ) {
                jars[i].details = {
                    apiKey: undefined,
                    harvestStyle: HarvestStyle.PASSIVE
                };
            }
            jars[i].details.strategyAddr = strategyAddresses[i];
        }

        const ethcallProvider2 = this.multicallProviderFor(jars[0].chain);
        await ethcallProvider2.init();
        const withStrategyAddresses = jars.filter((x) => x.details.strategyAddr !== undefined 
            && x.details.strategyAddr !== NULL_ADDRESS
            && x.enablement !== AssetEnablement.PERMANENTLY_DISABLED);

        let strategyNames : string[] = undefined;
        try {
            strategyNames = await ethcallProvider2.all<string[]>(
                withStrategyAddresses.map((oneJar) => new MulticallContract(oneJar.details.strategyAddr, strategyAbi).getName())
            );
        } catch(error) {
            this.logError("addJarStrategies: strategyNames", error, chain);
        }
        for( let i = 0; strategyNames !== undefined && i < withStrategyAddresses.length; i++ ) {
            withStrategyAddresses[i].details.strategyName = strategyNames[i];
        }
    }

    // All jars must be on same chain
    async addJarRatios(jars: JarDefinition[], chain: ChainNetwork) {
        if( jars === undefined || jars.length === 0 ) 
            return;
        const ethcallProvider = this.multicallProviderFor(chain);
        await ethcallProvider.init();

        let ratios : string[] = undefined;
        try {
            ratios = await ethcallProvider.all<string[]>(
                jars.map((oneJar) => new MulticallContract(oneJar.contract, jarAbi).getRatio())
            );
        } catch ( error ) {this.logError("addJarRatios", error, chain); }  
        for( let i = 0; ratios !== undefined && i < jars.length; i++ ) {
            jars[i].details.ratio = parseFloat(ethers.utils.formatUnits(ratios[i]));
        }
    }

    // All jars must be on same chain
    async addJarTotalSupply(jars: JarDefinition[], chain: ChainNetwork) {
        if( jars === undefined || jars.length === 0 )
            return;

        const ethcallProvider = this.multicallProviderFor(chain);
        await ethcallProvider.init();

        let supply : string[] = undefined;
        try {
            supply = await ethcallProvider.all<string[]>(
                jars.map((oneJar) => new MulticallContract(oneJar.contract, jarAbi).totalSupply())
            );
        } catch ( error ) { console.log("Failed on addJarTotalSupply"); }
        for( let i = 0; supply !== undefined && i < jars.length; i++ ) {
            jars[i].details.totalSupply = parseFloat(ethers.utils.formatUnits(supply[i]));
        }
    }


    async addDepositTokenBalance(jars: JarDefinition[], chain: ChainNetwork) {
        if( jars === undefined || jars.length === 0 )
            return;

        const ethcallProvider = this.multicallProviderFor(chain);
        await ethcallProvider.init();

        let balance : string[] = undefined;
        try {
            balance = await ethcallProvider.all<string[]>(
                jars.map((oneJar) => 
                    oneJar.protocol === AssetProtocol.UNISWAP_V3 ? 
                    new MulticallContract(oneJar.contract, jarAbi).totalLiquidity() :
                    new MulticallContract(oneJar.contract, jarAbi).balance())
            );
        } catch ( error ) { this.logError("addDepositTokenBalance", error, chain); }
        for( let i = 0; balance !== undefined && i < jars.length; i++ ) {
            jars[i].details.tokenBalance = 
            parseFloat(ethers.utils.formatUnits(balance[i], 
                jars[i].details.decimals ? jars[i].details.decimals : 18));
        }
    }

    async addDepositTokenTotalSupply(jars: PickleAsset[], chain: ChainNetwork) {
        if( jars === undefined || jars.length === 0 )
            return;

        const ethcallProvider = this.multicallProviderFor(chain);
        await ethcallProvider.init();  // error being raised by this
        
        let supply : string[] = undefined;
        try {
            supply = await ethcallProvider.all<string[]>(
                jars.map((oneJar) => 
                    oneJar.protocol === AssetProtocol.UNISWAP_V3 ? 
                    new MulticallContract(oneJar.depositToken.addr, univ3PoolAbi).liquidity() :
                    new MulticallContract(oneJar.depositToken.addr, erc20Abi).totalSupply())
            );
            } catch ( error ) { console.log("Failed on addDepositTokenTotalSupply"); }
        for( let i = 0; supply !== undefined && i < jars.length; i++ ) {
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
                if( jars[j].details.harvestStats === undefined 
                    && jars[j].enablement !== AssetEnablement.PERMANENTLY_DISABLED
                    && jars[j].details.strategyAddr !== NULL_ADDRESS) {
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
        const univ3Jars : JarDefinition[] = jars.filter((x)=>x.protocol === AssetProtocol.UNISWAP_V3);
        const jarV1 : JarDefinition[] = jars.filter((x)=>x.protocol !== AssetProtocol.UNISWAP_V3);
        await Promise.all([
            this.loadHarvestDataJarAbi(jarV1, chain),
            this.loadHarvestDataCustom(univ3Jars, chain),
        ]);
    }
    async loadHarvestDataCustom(harvestableJars: JarDefinition[], chain: ChainNetwork) {
        // TODO share code between the two impls
        const resolver = Chains.getResolver(chain);
        const discovery : JarBehaviorDiscovery = new JarBehaviorDiscovery();
        const harvestArr: Promise<JarHarvestStats>[] = [];
        for( let i = 0; i < harvestableJars.length; i++ ) {
            const harvestResolver : JarBehavior = discovery.findAssetBehavior(harvestableJars[i]);
            harvestArr.push(harvestResolver.getAssetHarvestData(harvestableJars[i], this, 
                BigNumber.from(0),  BigNumber.from(0), resolver));
        }
        let results: JarHarvestStats[] = undefined;
        try {
            results = await Promise.all(harvestArr);
        } catch( e ) {
            console.log("Error loading harvest data for jar");
        }

        for( let j = 0; j < harvestableJars.length; j++ ) {
            if( results[j] ) {
                results[j].balanceUSD = toThreeDec(results[j].balanceUSD);
                results[j].earnableUSD = toThreeDec(results[j].earnableUSD);
                results[j].harvestableUSD = toThreeDec(results[j].harvestableUSD);
            }
            harvestableJars[j].details.harvestStats = results[j];
        }
    }

    async loadHarvestDataJarAbi(jars: JarDefinition[], chain: ChainNetwork) {
        if( !jars || jars.length === 0)
            return;
        
        const discovery : JarBehaviorDiscovery = new JarBehaviorDiscovery();
        const harvestableJars : JarDefinition[] = jars.filter((x)=>discovery.findAssetBehavior(x) !== null && discovery.findAssetBehavior(x) !== undefined)
        if( !harvestableJars || harvestableJars.length === 0)
            return;

        // Load balances as a group
        const multicallProvider = this.multicallProviderFor(chain);
        await multicallProvider.init();

        const multicallProvider2 = this.multicallProviderFor(chain);
        await multicallProvider2.init();

        let balanceOfProm : Promise<BigNumber[]> = undefined; 
        try {
            balanceOfProm = multicallProvider.all<BigNumber[]>(
                harvestableJars.map((oneJar) => new MulticallContract(oneJar.details.strategyAddr, strategyAbi).balanceOf())
            );
        } catch ( error ) { this.logError("loadHarvestDataJarAbi: balanceOfProm", error, chain); }

        // Just do the want.balanceOf(strategy) but protect against non-erc20 deposit tokens
        let strategyWantProm : Promise<BigNumber[]> = undefined;
        try {
            strategyWantProm = multicallProvider.all<BigNumber[]>(
                harvestableJars.map((oneJar) => {
                    const safe = getErc20SafeDepositTokenMulticall(oneJar);
                    if( safe )
                        return safe;
                    return new MulticallContract(oneJar.depositToken.addr, erc20Abi).balanceOf(oneJar.details.strategyAddr);
                }));
        } catch ( error ) { this.logError("loadHarvestDataJarAbi: strategyWantProm", error, chain); }


        // Load available as a group
        let availableProm : Promise<BigNumber[]> = undefined; 
        try {
            availableProm = multicallProvider2.all<BigNumber[]>(
                harvestableJars.map((oneJar) => new MulticallContract(oneJar.contract, jarAbi).available()));
        } catch ( error ) { this.logError("loadHarvestDataJarAbi: availableProm", error, chain)}

        let [balanceOf, available, strategyWant] = [undefined, undefined, undefined];
        try {
            [balanceOf, available, strategyWant] = await Promise.all([
                balanceOfProm, availableProm, strategyWantProm
            ]);
        } catch ( error ) { this.logError("loadHarvesDataJarAbi: [balanceOf, available, strategyWant]", error, chain); }
    
        const resolver = Chains.getResolver(chain);
        const harvestArr: Promise<JarHarvestStats>[] = [];
        for( let i = 0; i < harvestableJars.length; i++ ) {
            try {
                const harvestResolver : JarBehavior = discovery.findAssetBehavior(harvestableJars[i]);
                harvestArr.push(harvestResolver.getAssetHarvestData(harvestableJars[i], this, 
                    balanceOf[i], available[i].add(strategyWant[i]), resolver));
            } catch( e ) {
                console.log("Error loading harvest data for jar " + harvestableJars[i].id + ":  " + e);
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
            let dec = farms[i].depositToken.decimals ? farms[i].depositToken.decimals :
                this.tokenDecimals(farms[i].depositToken.addr, farms[i].chain);
            if( !dec ) {
                dec = 18;
            }
            const tokenBalance = parseFloat(ethers.utils.formatUnits(tokens, dec));
            const valueBalance = tokenBalance * depositTokenPrice;
            if( farms[i].details === undefined ) {
                farms[i].details = {};
            }
            farms[i].details.tokenBalance = tokenBalance;
            farms[i].details.valueBalance = valueBalance;
            farms[i].details.harvestStats = {
                balanceUSD: valueBalance,
                earnableUSD: 0,
                harvestableUSD: 0
            }
        }
    }

    ensureNestedFarmsBalanceLoaded(jarsWithFarms: JarDefinition[], balances: any[]) {
        for( let i = 0; i < jarsWithFarms.length; i++ ) {
            const ptokenPrice : number = jarsWithFarms[i].details.ratio * jarsWithFarms[i].depositToken.price;
            const ptokens = balances[i];
            const dec = jarsWithFarms[i].details.decimals ? jarsWithFarms[i].details.decimals : 18;
            const ptokenBalance = parseFloat(ethers.utils.formatUnits(ptokens, dec));
            const valueBalance = ptokenBalance * ptokenPrice;
            if( jarsWithFarms[i].farm.details === undefined ) {
                jarsWithFarms[i].farm.details = {};
            }
            jarsWithFarms[i].farm.details.tokenBalance = ptokenBalance;
            jarsWithFarms[i].farm.details.valueBalance = valueBalance;
        }
    }

    async ensureFarmsBalanceLoadedForProtocol(chain: ChainNetwork) {
        const ethcallProvider = this.multicallProviderFor(chain);
        await ethcallProvider.init();

        // Run on eth standalone farms
        const ethFarms : StandaloneFarmDefinition[] = this.getStandaloneFarms().filter((x)=>x.chain === chain);
        let ethFarmResults : string[] = undefined;
        try {
            ethFarmResults = await ethcallProvider.all<string[]>(
                ethFarms.map((oneFarm) => new MulticallContract(oneFarm.depositToken.addr, erc20Abi).balanceOf(oneFarm.contract))
            );
        } catch ( error ) { this.logError("ensureFarmsBalanceLoadedForProtocol", error, chain); }
        this.ensureStandaloneFarmsBalanceLoaded(ethFarms, ethFarmResults);


        const protocolJarsWithFarms : JarDefinition[] = this.semiActiveJars(chain).filter((x)=>{return x.farm !== undefined });
        let protocolJarsWithFarmResults : string[] = undefined;
        try {
            protocolJarsWithFarmResults = await ethcallProvider.all<string[]>(
                protocolJarsWithFarms.map((oneJar) => new MulticallContract(oneJar.contract, erc20Abi).balanceOf(oneJar.farm.farmAddress))
            );
        } catch ( error ) { this.logError("ensureFarmsBalanceLoadedForProtocol", error, chain); }
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
        let external : ExternalAssetDefinition[] = undefined;
        try { external = this.getExternalAssets(); } catch ( error ) {this.logError("ensureExternalAssetBalanceLoaded", error); }
        for( let i = 0; external !== undefined && i < external.length; i++ ) {
            const behavior = new JarBehaviorDiscovery().findAssetBehavior(external[i]);
            if( behavior ) {
                let bal = undefined;
                try {
                    bal = await behavior.getAssetHarvestData(external[i], this, null, null, null);
                } catch ( error ) { this.logError("ensureExternalAssetBalanceLoaded: bal", error); }
                if ( bal !== undefined) { external[i].details.harvestStats = bal; }
                
                let aprStats = undefined;
                try {
                    aprStats = await behavior.getProjectedAprStats(external[i], this);
                } catch ( error ) { this.logError("ensureExternalAssetBalanceLoaded: bal", error); }
                if ( aprStats !== undefined ) { external[i].aprStats = aprStats; }
            }
        }
    }

    async loadApyComponents() {
        const withBehaviors : PickleAsset[] = 
            this.allAssets.filter((x)=>new JarBehaviorDiscovery().findAssetBehavior(x) !== undefined);
        let aprStats: AssetProjectedApr[] = undefined;
        try {
            aprStats = await Promise.all(
                withBehaviors.map(async (x) => {
                    return new JarBehaviorDiscovery().findAssetBehavior(x)
                            .getProjectedAprStats(x as JarDefinition, this);
                })
            );
            } catch ( error ) { this.logError("loadApyComponents", error); }
        for( let i = 0; aprStats !== undefined && i < withBehaviors.length; i++ ) {
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
            platformBlendedRate: tvl === 0 ? 0 : (blendedRateSum/tvl),
            harvestPending: harvestPending
        };
    }

    logError(where: string, error: any, chain?: ChainNetwork) {
        // TODO store somewhere?
        console.log("ERROR: Failed at " + where + (chain !== undefined ? " on chain " + chain : "") + "\n" + error);
    }
}

/**
 * A safe call to get a zero return for non-erc20 calls when doing bulk multicalls
 * @param jar 
 * @returns 
 */
const getErc20SafeDepositTokenMulticall = (jar: JarDefinition) : Promise<any> => {
    if( jar.depositToken === undefined || 
        (jar.depositToken.style !== undefined 
        && jar.depositToken.style.erc20 !== undefined 
        && jar.depositToken.style.erc20 === false)) {
        // We need a safe multicall 
        const randomErc20Token : string = ExternalTokenModelSingleton.getTokens(jar.chain)[0].contractAddr;
        return new MulticallContract(randomErc20Token, erc20Abi).balanceOf(FICTIONAL_ADDRESS);
    } 
    return undefined;
}

const toThreeDec = function (param:number) {
    return Math.floor(param*1000)/1000;
  };


