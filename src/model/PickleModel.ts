import { AssetEnablement, DillDetails, HarvestStyle, JarDefinition, PickleModelJson, StandaloneFarmDefinition } from "./PickleModelJson";
import { BigNumber, ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { Provider as MulticallProvider, Contract as MulticallContract} from 'ethers-multicall';
import controllerAbi from "../Contracts/ABIs/controller.json";
import strategyAbi from "../Contracts/ABIs/strategy.json";
import jarAbi from "../Contracts/ABIs/jar.json";
import { ChainNetwork, Chains } from "../chain/Chains";
import { PriceCache, RESOLVER_COINGECKO, RESOLVER_DEPOSIT_TOKEN } from "../price/PriceCache";
import { ExternalTokenFetchStyle, ExternalTokenModelSingleton } from "../price/ExternalTokenModel";
import { CoinGeckoPriceResolver } from "../price/CoinGeckoPriceResolver";
import { JarHarvestResolverDiscovery } from "../harvest/JarHarvestResolverDiscovery";
import { JarHarvestData, JarHarvestResolver } from "../harvest/JarHarvestResolver";
import { getDillDetails, getWeeklyDistribution } from "../dill/DillUtility";
import { DepositTokenPriceResolver } from "../price/DepositTokenPriceResolver";

export const CONTROLLER_ETH = "0x6847259b2B3A4c17e7c43C54409810aF48bA5210";
export const CONTROLLER_POLYGON = "0x83074F0aB8EDD2c1508D3F657CeB5F27f6092d09";
export class PickleModel {
    jars: JarDefinition[];
    standaloneFarms: StandaloneFarmDefinition[];
    prices : PriceCache;
    dillDetails: DillDetails;

    constructor( jars: JarDefinition[], standaloneFarms: StandaloneFarmDefinition[],
        etherResolver: Signer|Provider, polygonResolver: Signer|Provider) {
        this.jars = JSON.parse(JSON.stringify(jars));
        this.standaloneFarms = JSON.parse(JSON.stringify(standaloneFarms));
        this.initializeChains(etherResolver, polygonResolver);
    }

    async generateFullApi() : Promise<PickleModelJson> {
        await this.ensurePriceCacheLoaded();
        await this.ensureStrategyDataLoaded();
        await this.ensureRatiosLoaded();
        await this.ensureDepositTokenPriceLoaded();
        await this.ensureHarvestDataLoaded();
        //await this.ensureHistoricalApyLoaded();
        this.dillDetails = await getDillDetails(getWeeklyDistribution(this.jars), 
                this.prices, Chains.getResolver(ChainNetwork.Ethereum));
        return this.toJson();
    }

    toJson() : PickleModelJson {
        return {
            jarsAndFarms: {
                jars: this.jars,
                standaloneFarms: this.standaloneFarms
            },
            dill: this.dillDetails,
            prices: Object.fromEntries(this.prices.getCache())
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
        if( this.prices === undefined ) {
            const tmp : PriceCache = new PriceCache();
            tmp.addResolver(RESOLVER_COINGECKO, new CoinGeckoPriceResolver(ExternalTokenModelSingleton));
            tmp.addResolver(RESOLVER_DEPOSIT_TOKEN, new DepositTokenPriceResolver(this.jars));
            
        
            const arr: string[] = ExternalTokenModelSingleton.getTokens(ChainNetwork.Ethereum).filter(val => val.fetchType != ExternalTokenFetchStyle.NONE).map(a => a.coingeckoId);
            await tmp.getPrices(arr, RESOLVER_COINGECKO);
            const arr2: string[] = ExternalTokenModelSingleton.getTokens(ChainNetwork.Polygon).filter(val => val.fetchType != ExternalTokenFetchStyle.NONE).map(a => a.coingeckoId);
            await tmp.getPrices(arr2, RESOLVER_COINGECKO);
            this.prices = tmp;
        }
        return this.prices;
    }

    async ensureStrategyDataLoaded() {
        for( let i = 0; i < this.jars.length; i++ ) {
            if( this.jars[i].details.strategyAddr === undefined || this.jars[i].details.strategyName === undefined ) {
                await this.loadStrategyData();
                return;
            }
        }
    }

    async loadStrategyData() {
        const ethJars = this.jars.filter(x => x.chain === ChainNetwork.Ethereum);
        const polyJars = this.jars.filter(x => x.chain === ChainNetwork.Polygon);
        if( ethJars.length > 0 )
            await this.addJarStrategies(ethJars, CONTROLLER_ETH, Chains.getResolver(ChainNetwork.Ethereum));
        if( polyJars.length > 0 )
            await this.addJarStrategies(polyJars, CONTROLLER_POLYGON, Chains.getResolver(ChainNetwork.Polygon));
    }


    async ensureRatiosLoaded() {
        for( let i = 0; i < this.jars.length; i++ ) {
            if( this.jars[i].details.ratio === undefined ) {
                await this.loadRatiosData(this.jars);
                return;
            }
        }
    }


    async ensureDepositTokenPriceLoaded() {
        let notPermDisabled : JarDefinition[] = this.jars.filter((jar)=>{return jar.enablement !== AssetEnablement.PERMANENTLY_DISABLED});
        const depositTokens: string[] = notPermDisabled.map((entry)=>{return entry.depositToken.addr});
        const results : Map<string,number> = await this.prices.getPrices(depositTokens, RESOLVER_DEPOSIT_TOKEN);
        for( let i = 0; i < notPermDisabled.length; i++ ) {
            const needle = notPermDisabled[i].depositToken.addr;
            notPermDisabled[i].depositToken.price = results.get(needle);
        }
    }

    async loadRatiosData(jars: JarDefinition[]) {
        const ethJars = jars.filter(x => x.chain === ChainNetwork.Ethereum && x.enablement !== AssetEnablement.PERMANENTLY_DISABLED);
        const polyJars = jars.filter(x => x.chain === ChainNetwork.Polygon && x.enablement !== AssetEnablement.PERMANENTLY_DISABLED);
        if( ethJars.length > 0 )
            await this.addJarRatios(ethJars, CONTROLLER_ETH, Chains.getResolver(ChainNetwork.Ethereum));
        if( polyJars.length > 0 )
            await this.addJarRatios(polyJars, CONTROLLER_POLYGON, Chains.getResolver(ChainNetwork.Polygon));
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
            x.details.strategyAddr !== "0x0000000000000000000000000000000000000000" && x.enablement !== AssetEnablement.DISABLED);

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
        const ethJars = this.jars.filter(x => x.chain === ChainNetwork.Ethereum);
        const missingEth : JarDefinition[] = [];
        for( let i = 0; i < ethJars.length; i++ ) {
            if( ethJars[i].details.harvestStats === undefined && ethJars[i].enablement !== AssetEnablement.PERMANENTLY_DISABLED) {
                missingEth.push(ethJars[i]);
            }
        }
        await this.loadHarvestData(missingEth, ChainNetwork.Ethereum);


        const polyJars = this.jars.filter(x => x.chain === ChainNetwork.Polygon);
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
    
        const discovery : JarHarvestResolverDiscovery = new JarHarvestResolverDiscovery();
        for( let i = 0; i < jars.length; i++ ) {
            try {
                const resolver = Chains.getResolver(jars[i].chain);
                const harvestResolver : JarHarvestResolver = discovery.findHarvestResolver(jars[i]);
                if( harvestResolver !== undefined && harvestResolver !== null ) {
                    const harvestData : JarHarvestData = await harvestResolver.getJarHarvestData(jars[i], this.prices, 
                        balanceOf[i], available[i], resolver);
                    jars[i].details.harvestStats = harvestData?.stats;
                }
            } catch( e ) {
                console.log("Error loading harvest data for jar " + jars[i].id + ":  " + e);
            }
        }
    }
}


