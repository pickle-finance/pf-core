import { AssetEnablement, AssetType, DillDetails, ExternalAssetDefinition, HarvestStyle, JarDefinition, PickleAsset, PickleModelJson, StandaloneFarmDefinition } from "./PickleModelJson";
import { BigNumber, ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { Provider as MulticallProvider, Contract as MulticallContract} from 'ethers-multicall';
import controllerAbi from "../Contracts/ABIs/controller.json";
import strategyAbi from "../Contracts/ABIs/strategy.json";
import jarAbi from "../Contracts/ABIs/jar.json";
import erc20Abi from '../Contracts/ABIs/erc20.json';
import stabilityPool from '../Contracts/ABIs/stability-pool.json';
import { ChainNetwork, Chains } from "../chain/Chains";
import { PriceCache, RESOLVER_COINGECKO, RESOLVER_DEPOSIT_TOKEN } from "../price/PriceCache";
import { ExternalTokenFetchStyle, ExternalTokenModelSingleton } from "../price/ExternalTokenModel";
import { CoinGeckoPriceResolver } from "../price/CoinGeckoPriceResolver";
import { getDillDetails, getWeeklyDistribution } from "../dill/DillUtility";
import { DepositTokenPriceResolver } from "../price/DepositTokenPriceResolver";
import { ASSET_PBAMM, JAR_LQTY, JAR_steCRV } from "./JarsAndFarms";
import { JarBehaviorDiscovery } from "../behavior/JarBehaviorDiscovery";
import { JarBehavior, JarHarvestData } from "../behavior/JarBehaviorResolver";

export const CONTROLLER_ETH = "0x6847259b2B3A4c17e7c43C54409810aF48bA5210";
export const CONTROLLER_POLYGON = "0x83074F0aB8EDD2c1508D3F657CeB5F27f6092d09";
export class PickleModel {
    private allAssets : PickleAsset[];
    private prices : PriceCache;
    private dillDetails: DillDetails;

    // This can be used to cache any object with a key that might be shared
    // by a few different classes. 
    resourceCache: Map<string, any>;

    constructor( allAssets: PickleAsset[], etherResolver: Signer|Provider, polygonResolver: Signer|Provider) {
        this.allAssets = JSON.parse(JSON.stringify(allAssets));
        this.initializeChains(etherResolver, polygonResolver);
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
    async generateFullApi() : Promise<PickleModelJson> {
        await this.ensurePriceCacheLoaded();
        await this.ensureStrategyDataLoaded();
        await this.ensureRatiosLoaded();

        // load protocol-specific data
        //await getOrLoadAllSushiSwapPairDataIntoCache(this);

        await this.ensureDepositTokenPriceLoaded();
        await this.ensureHarvestDataLoaded();
        //await this.ensureHistoricalApyLoaded();

        await this.ensureStandaloneFarmsBalanceLoaded();
        await this.ensureExternalAssetBalanceLoaded();
        await this.loadApyComponents();

        this.dillDetails = await getDillDetails(getWeeklyDistribution(this.getJars()), 
                this.prices, Chains.getResolver(ChainNetwork.Ethereum));
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
            platform: {
                platformTVL: this.calculatePlatformTVL()
            }
        }
    }

    initializePriceCache() {
        if( this.prices === undefined ) {
            const tmp : PriceCache = new PriceCache();
            tmp.addResolver(RESOLVER_COINGECKO, new CoinGeckoPriceResolver(ExternalTokenModelSingleton));
            tmp.addResolver(RESOLVER_DEPOSIT_TOKEN, new DepositTokenPriceResolver(this));
            this.prices = tmp;
        }
    }
    initializeChains(etherResolver: Signer|Provider, polygonResolver: Signer|Provider) {
        if( etherResolver ) {
            const isSigner : boolean = (etherResolver as Signer).provider !== undefined;
            const ethSigner : Signer = isSigner ? (etherResolver as Signer) : undefined;
            const ethProvider : Provider = isSigner ? (etherResolver as Signer).provider : (etherResolver as Provider);
            if( ethSigner ) 
                Chains.get(ChainNetwork.Ethereum).setSigner(ethSigner);
            if( ethProvider) 
                Chains.get(ChainNetwork.Ethereum).setPreferredWeb3Provider(ethProvider);
        }

        if( polygonResolver ) {
            const isSigner : boolean = (polygonResolver as Signer).provider !== undefined;
            const polySigner : Signer = isSigner ? (polygonResolver as Signer) : undefined;
            const polyProvider : Provider = isSigner ? (polygonResolver as Signer).provider : (polygonResolver as Provider);
            if( polySigner ) 
                Chains.get(ChainNetwork.Polygon).setSigner(polySigner);
            if( polyProvider) 
                Chains.get(ChainNetwork.Polygon).setPreferredWeb3Provider(polyProvider);
        }
    }

/*
    async ensureHistoricalApyLoaded(jars: JarDefinition[]) {
        for( let jar of jars ) {
            if( jar.details && jar.details.apiKey ) {
             const perfData : PerformanceData = await getProtocolPerformance(jar);
             const farmEntry : FarmDatabaseEntry = await getFarmDatabaseEntry(jar);
             const jarData : AssetDatabaseEntry[] = await getJarAssetData(jar);
             const result : JarFarmPerformanceData = await getJarFarmPerformanceData(
                 perfData, farmEntry === undefined ? undefined : farmEntry.apy*100, jarData);

             jar.details.oneDayApy = result.oneDay;
             jar.details.threeDayApy = result.threeDay;
             jar.details.sevenDayApy = result.sevenDay;
             jar.details.thirtyDayApy = result.thirtyDay;
             if( jar.farm ) {
                 jar.farm.details = {};
                 if( farmEntry !== undefined ) {
                    jar.farm.details.allocShare= farmEntry.allocShare;
                    jar.farm.details.tokenBalance= farmEntry.tokenBalance;
                    jar.farm.details.valueBalance= farmEntry.valueBalance;
                    jar.farm.details.picklePerBlock= farmEntry.picklePerBlock;
                    jar.farm.details.picklePerDay= farmEntry.picklePerDay;
                 }
                 if( result !== undefined ) {
                    jar.farm.details.oneDayApy= result.oneDayFarm;
                    jar.farm.details.threeDayApy= result.threeDayFarm;
                    jar.farm.details.sevenDayApy= result.sevenDayFarm;
                    jar.farm.details.thirtyDayApy= result.thirtyDayFarm;
                 }
             }
           }
        }
    }
    */
   
    async ensurePriceCacheLoaded() {
        if( this.prices && this.prices.getCache() && this.prices.getCache().size === 0 ) {
            const arr: string[] = ExternalTokenModelSingleton.getTokens(ChainNetwork.Ethereum).filter(val => val.fetchType != ExternalTokenFetchStyle.NONE).map(a => a.coingeckoId);
            await this.prices.getPrices(arr, RESOLVER_COINGECKO);
            const arr2: string[] = ExternalTokenModelSingleton.getTokens(ChainNetwork.Polygon).filter(val => val.fetchType != ExternalTokenFetchStyle.NONE).map(a => a.coingeckoId);
            await this.prices.getPrices(arr2, RESOLVER_COINGECKO);
        }
        return this.prices;
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

    async loadStrategyData() {
        const jars : JarDefinition[] = this.getJars();
        const ethJars = jars.filter(x => x.chain === ChainNetwork.Ethereum && x.details?.controller === undefined);
        const polyJars = jars.filter(x => x.chain === ChainNetwork.Polygon && x.details?.controller === undefined);
        if( ethJars.length > 0 )
            await this.addJarStrategies(ethJars, CONTROLLER_ETH, Chains.getResolver(ChainNetwork.Ethereum));
        if( polyJars.length > 0 )
            await this.addJarStrategies(polyJars, CONTROLLER_POLYGON, Chains.getResolver(ChainNetwork.Polygon));

        // Now handle jars with custom controllers
        const customControllerJars = jars.filter(x => x.details?.controller !== undefined);

        for( let i = 0; i < customControllerJars.length; i++ ) {
            await this.addJarStrategies([customControllerJars[i]], 
                customControllerJars[i].details.controller, 
                Chains.getResolver(customControllerJars[i].chain));
        }
    }


    async ensureRatiosLoaded() {
        const jars : JarDefinition[] = this.getJars();
        for( let i = 0; i < jars.length; i++ ) {
            if( jars[i].details.ratio === undefined ) {
                await this.loadRatiosData(jars);
                return;
            }
        }
    }


    async ensureDepositTokenPriceLoaded() {
        let notPermDisabled : JarDefinition[] = this.getJars().filter((jar)=>{return jar.enablement !== AssetEnablement.PERMANENTLY_DISABLED});
        const depositTokens: string[] = notPermDisabled.map((entry)=>{return entry.depositToken.addr});
        const results : Map<string,number> = await this.prices.getPrices(depositTokens, RESOLVER_DEPOSIT_TOKEN);
        for( let i = 0; i < notPermDisabled.length; i++ ) {
            const needle = notPermDisabled[i].depositToken.addr;
            notPermDisabled[i].depositToken.price = results.get(needle);
        }

        let farmNotPermDisabled : StandaloneFarmDefinition[] = this.getStandaloneFarms().filter((farm)=>{return farm.enablement !== AssetEnablement.PERMANENTLY_DISABLED});
        const farmDepositTokens: string[] = farmNotPermDisabled.map((entry)=>{return entry.depositToken.addr});
        const farmResults : Map<string,number> = await this.prices.getPrices(farmDepositTokens, RESOLVER_DEPOSIT_TOKEN);
        for( let i = 0; i < farmNotPermDisabled.length; i++ ) {
            const needle = farmNotPermDisabled[i].depositToken.addr;
            farmNotPermDisabled[i].depositToken.price = farmResults.get(needle);
        }


        let externalNotPermDisabled : ExternalAssetDefinition[] = this.getExternalAssets().filter((asset)=>{return asset.enablement !== AssetEnablement.PERMANENTLY_DISABLED});
        const externalDepositTokens: string[] = externalNotPermDisabled.map((entry)=>{return entry.depositToken.addr});
        const externalResults : Map<string,number> = await this.prices.getPrices(externalDepositTokens, RESOLVER_DEPOSIT_TOKEN);
        for( let i = 0; i < externalNotPermDisabled.length; i++ ) {
            const needle = externalNotPermDisabled[i].depositToken.addr;
            externalNotPermDisabled[i].depositToken.price = externalResults.get(needle);
        }

    }

    async loadRatiosData(jars: JarDefinition[]) {
        const ethJars = jars.filter(x => x.chain === ChainNetwork.Ethereum 
            && x.enablement !== AssetEnablement.PERMANENTLY_DISABLED && x.details.controller === undefined);
        const polyJars = jars.filter(x => x.chain === ChainNetwork.Polygon 
            && x.enablement !== AssetEnablement.PERMANENTLY_DISABLED && x.details.controller === undefined);
        if( ethJars.length > 0 )
            await this.addJarRatios(ethJars, CONTROLLER_ETH, Chains.getResolver(ChainNetwork.Ethereum));
        if( polyJars.length > 0 )
            await this.addJarRatios(polyJars, CONTROLLER_POLYGON, Chains.getResolver(ChainNetwork.Polygon));



        // Now handle jars with custom controllers
        const customControllerJars = this.getJars().filter(x => x.details?.controller !== undefined);
        for( let i = 0; i < customControllerJars.length; i++ ) {
            await this.addJarRatios([customControllerJars[i]], 
                customControllerJars[i].details.controller, 
                Chains.getResolver(customControllerJars[i].chain));
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

    async addJarRatios(jars: JarDefinition[], _controllerAddr: string, resolver: Signer | Provider) {
        // debug
        /*
        for( let i = 0; i < jars.length; i++ ) {
            const ethcallProvider3 = new MulticallProvider((resolver as Signer).provider === undefined ? (resolver as Provider) : (resolver as Signer).provider);
            await ethcallProvider3.init();
            const arr : JarDefinition[] = [jars[i]];
            console.log(jars[i].id);
            try {
                await ethcallProvider3.all<string[]>(
                    arr.map((oneJar) => new MulticallContract(oneJar.contract, jarAbi).getRatio())
                ).then((response) => {
                    console.log(response);
                });
            } catch(error) {
                console.log(error);
            }
        }
        */
        const ethcallProvider = new MulticallProvider((resolver as Signer).provider === undefined ? (resolver as Provider) : (resolver as Signer).provider);
        await ethcallProvider.init();

        const ratios : string[] = await ethcallProvider.all<string[]>(
            jars.map((oneJar) => new MulticallContract(oneJar.contract, jarAbi).getRatio())
          );
        for( let i = 0; i < jars.length; i++ ) {
            jars[i].details.ratio = parseFloat(ethers.utils.formatUnits(ratios[i]));
        }
    }

    async ensureHarvestDataLoaded() {
        const ethJars = this.getJars().filter(x => x.chain === ChainNetwork.Ethereum);
        const missingEth : JarDefinition[] = [];
        for( let i = 0; i < ethJars.length; i++ ) {
            if( ethJars[i].details.harvestStats === undefined && ethJars[i].enablement !== AssetEnablement.PERMANENTLY_DISABLED) {
                missingEth.push(ethJars[i]);
            }
        }
        await this.loadHarvestData(missingEth, ChainNetwork.Ethereum);


        const polyJars = this.getJars().filter(x => x.chain === ChainNetwork.Polygon);
        const missingPoly : JarDefinition[] = [];
        for( let i = 0; i < polyJars.length; i++ ) {
            if( polyJars[i].details.harvestStats === undefined && polyJars[i].enablement !== AssetEnablement.PERMANENTLY_DISABLED) {
                missingPoly.push(polyJars[i]);
            }
        }
        await this.loadHarvestData(missingPoly, ChainNetwork.Polygon);

    }

    async loadHarvestData(jars: JarDefinition[], chain: ChainNetwork) {
        if( jars.length === 0) {
            return;
        }

        const signer : Provider = Chains.get(chain).getPreferredWeb3Provider();

        // Load balances as a group
        const multicallProvider = new MulticallProvider(signer);
        await multicallProvider.init();
        const balanceOf = await multicallProvider.all<BigNumber[]>(
            jars.map((oneJar) => new MulticallContract(oneJar.details.strategyAddr, strategyAbi).balanceOf()));
        
        // Load available as a group
        const multicallProvider2 = new MulticallProvider(signer);
        await multicallProvider2.init();
        const available = await multicallProvider2.all<BigNumber[]>(
        jars.map((oneJar) => new MulticallContract(oneJar.contract, jarAbi).available()));
    
        const discovery : JarBehaviorDiscovery = new JarBehaviorDiscovery();
        for( let i = 0; i < jars.length; i++ ) {
            try {
                const resolver = Chains.getResolver(jars[i].chain);
                const harvestResolver : JarBehavior = discovery.findAssetBehavior(jars[i]);
                if( harvestResolver !== undefined && harvestResolver !== null ) {
                    const harvestData : JarHarvestData = await harvestResolver.getJarHarvestData(jars[i], this, 
                        balanceOf[i], available[i], resolver);
                    jars[i].details.harvestStats = harvestData?.stats;
                }
            } catch( e ) {
                console.log("Error loading harvest data for jar " + jars[i].id + ":  " + e);
            }
        }
    }

    async ensureStandaloneFarmsBalanceLoaded() {
        const farms : StandaloneFarmDefinition[] = this.getStandaloneFarms();
        for( let i = 0; i < farms.length; i++ ) {
            const depositTokenContract = new ethers.Contract(farms[i].depositToken.addr, 
                erc20Abi, Chains.getResolver(farms[i].chain));
            const tokens = await depositTokenContract.balanceOf(farms[i].contract);
            const results : number = await this.prices.getPrice(farms[i].depositToken.addr, RESOLVER_DEPOSIT_TOKEN);
            const tokenBalance = parseFloat(ethers.utils.formatEther(tokens));
            const valueBalance = tokenBalance * results;
            if( farms[i].details === undefined ) {
                farms[i].details = {};
            }
            farms[i].details.tokenBalance = tokenBalance;
            farms[i].details.valueBalance = valueBalance;
        }
    }


    async ensureExternalAssetBalanceLoaded() {
        // This needs to be separated out and unified, seriously. 
        const external : ExternalAssetDefinition[] = this.getExternalAssets();
        for( let i = 0; i < external.length; i++ ) {
            if( external[i].id === ASSET_PBAMM.id) {
                const stabilityPoolAddr = "0x66017D22b0f8556afDd19FC67041899Eb65a21bb";
                const pBAMM = "0x54bC9113f1f55cdBDf221daf798dc73614f6D972";
                const pLQTY = "0x65B2532474f717D5A8ba38078B78106D56118bbb";

                // 1) how many lusd in stability pool for us
                const stabilityPoolContract = new ethers.Contract(stabilityPoolAddr,
                stabilityPool, Chains.getResolver(external[i].chain));
                const lusdInStabilityPool = await stabilityPoolContract.getCompoundedLUSDDeposit(pBAMM);
                const lusdPrice = await this.prices.getPrice("lusd", RESOLVER_COINGECKO);
                const lusdValue = parseFloat(ethers.utils.formatEther(lusdInStabilityPool)) * lusdPrice;
          

                const pLqtyContract = new ethers.Contract(pLQTY,
                    erc20Abi, Chains.getResolver(external[i].chain));
                const pLqtyTokens = await pLqtyContract.balanceOf(pBAMM);
                const lqtyPrice = await this.prices.getPrice("lqty", RESOLVER_COINGECKO);
                const ratio = (this.findAsset(JAR_LQTY.id) as JarDefinition).details.ratio;
                const lqtyValue = parseFloat(ethers.utils.formatEther(pLqtyTokens)) * lqtyPrice * ratio;

                external[i].details.valueBalance = lusdValue + lqtyValue;
            }
        }
    }

    async loadApyComponents() {
        for( let i = 0; i < this.allAssets.length; i++ ) {
            const asset : PickleAsset = this.allAssets[i];
            const discovery : JarBehaviorDiscovery = new JarBehaviorDiscovery();
            const beh : JarBehavior = discovery.findAssetBehavior(asset);
            if( beh !== undefined ) {
                const ret = await beh.getProjectedAprStats(asset as JarDefinition, this);
                if( ret ) {
                    this.allAssets[i].aprStats = ret;
                }
            }
        }
    }
    findAsset(id: string) : PickleAsset {
        for( let i = 0; i < this.allAssets.length; i++ ) {
            if( this.allAssets[i].id === id) 
                return this.allAssets[i];
        }
        return undefined;
    }

    calculatePlatformTVL() : number {
        const farms : StandaloneFarmDefinition[] = this.getStandaloneFarms();
        let tvl = 0;
        for( let i = 0; i < farms.length; i++ ) {
            if( farms[i].details?.valueBalance) {
                tvl += farms[i].details?.valueBalance;
            }
        }
        const jars : JarDefinition[] = this.getJars();
        for( let i = 0; i < jars.length; i++ ) {
            if( jars[i].details?.harvestStats?.balanceUSD) {
                tvl += jars[i].details?.harvestStats?.balanceUSD;
            }
        }
        return tvl;
    }
}


