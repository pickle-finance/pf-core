import { AssetEnablement, HarvestStyle, JarDefinition, PickleModelJson, StandaloneFarmDefinition } from "./PickleModelJson";
import { ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { Provider as MulticallProvider, Contract as MulticallContract} from 'ethers-multicall';
import controllerAbi from "../Contracts/ABIs/controller.json";
import strategyAbi from "../Contracts/ABIs/strategy.json";
import jarAbi from "../Contracts/ABIs/jar.json";
import { Chain } from "../chain/ChainModel";
import { PriceCache, RESOLVER_COINGECKO } from "../price/PriceCache";
import { ExternalTokenFetchStyle, ExternalTokenModelSingleton } from "../price/ExternalTokenModel";
import { CoinGeckoPriceResolver } from "../price/CoinGeckoPriceResolver";
import { JarHarvestResolverDiscovery } from "../harvest/JarHarvestResolverDiscovery";
import { JarHarvestData, JarHarvestResolver } from "../harvest/JarHarvestResolver";
import { getDillDetails } from "../dill/DillUtility";
import { FarmDatabaseEntry, getFarmDatabaseEntry, AssetDatabaseEntry, getJarAssetData } from "../database/DatabaseUtil";
import { PerformanceData, getProtocolPerformance, JarFarmPerformanceData, getJarFarmPerformanceData } from "../performance/AssetPerformance";

export const CONTROLLER_ETH = "0x6847259b2B3A4c17e7c43C54409810aF48bA5210";
export const CONTROLLER_POLYGON = "0x83074F0aB8EDD2c1508D3F657CeB5F27f6092d09";
export class PickleModel {
    jars: JarDefinition[];
    standaloneFarms: StandaloneFarmDefinition[];
    etherResolver: Signer|Provider;
    polyResolver: Signer|Provider;
    prices : PriceCache;

    constructor( jars: JarDefinition[], standaloneFarms: StandaloneFarmDefinition[],
        etherResolver: Signer|Provider, polygonResolver: Signer|Provider) {
        this.jars = jars;
        this.standaloneFarms = standaloneFarms;
        this.etherResolver = etherResolver;
        this.polyResolver = polygonResolver;
    }

    async generateFullApi() : Promise<PickleModelJson> {
        await this.ensurePriceCacheLoaded();
        await this.ensureStrategyDataLoaded(this.jars);
        await this.ensureRatiosLoaded(this.jars);
        await this.ensureHarvestDataLoaded(this.jars);
        await this.ensureApyLoaded(this.jars);
        const dillObject = await getDillDetails(0, this.prices, this.etherResolver);

        return {
            jarsAndFarms: {
                jars: this.jars,
                standaloneFarms: this.standaloneFarms
            },
            dill: dillObject,
            prices: Object.fromEntries(this.prices.getCache())
        }
    }


    async ensureApyLoaded(jars: JarDefinition[]) {
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
    async ensurePriceCacheLoaded() {
        if( this.prices === undefined ) {
            const tmp : PriceCache = new PriceCache();
            tmp.addResolver(RESOLVER_COINGECKO, new CoinGeckoPriceResolver(ExternalTokenModelSingleton));
            const arr: string[] = ExternalTokenModelSingleton.getTokens(Chain.Ethereum).filter(val => val.fetchType != ExternalTokenFetchStyle.NONE).map(a => a.coingeckoId);
            await tmp.getPrices(arr, RESOLVER_COINGECKO);
            const arr2: string[] = ExternalTokenModelSingleton.getTokens(Chain.Polygon).filter(val => val.fetchType != ExternalTokenFetchStyle.NONE).map(a => a.coingeckoId);
            await tmp.getPrices(arr2, RESOLVER_COINGECKO);
            this.prices = tmp;
        }
        return this.prices;
    }

    async ensureStrategyDataLoaded(jars: JarDefinition[]) {
        for( let i = 0; i < jars.length; i++ ) {
            if( jars[i].details.strategyAddr === undefined || jars[i].details.strategyName === undefined ) {
                await this.loadStrategyData(jars);
                return;
            }
        }
    }

    async loadStrategyData(jars: JarDefinition[]) {
        const ethJars = jars.filter(x => x.chain === Chain.Ethereum);
        const polyJars = jars.filter(x => x.chain === Chain.Polygon);
        if( ethJars.length > 0 )
            await this.addJarStrategies(ethJars, CONTROLLER_ETH, this.etherResolver);
            // TODO
//        if( polyJars.length > 0 )
//            await this.addJarStrategies(polyJars, CONTROLLER_POLYGON, this.polyResolver);
    }


    async ensureRatiosLoaded(jars: JarDefinition[]) {
        for( let i = 0; i < jars.length; i++ ) {
            if( jars[i].details.ratio === undefined ) {
                await this.loadRatiosData(jars);
                return;
            }
        }
    }

    async loadRatiosData(jars: JarDefinition[]) {
        const ethJars = jars.filter(x => x.chain === Chain.Ethereum && x.enablement !== AssetEnablement.PERMANENTLY_DISABLED);
//        const polyJars = jars.filter(x => x.chain === Chain.Polygon);
        if( ethJars.length > 0 )
            await this.addJarRatios(ethJars, CONTROLLER_ETH, this.etherResolver);
//        if( polyJars.length > 0 )
//            await this.addJarRatios(polyJars, CONTROLLER_POLYGON, this.polyResolver);
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
        const ethcallProvider = new MulticallProvider((resolver as Signer).provider === undefined ? (resolver as Provider) : (resolver as Signer).provider);
        await ethcallProvider.init();

        // debug
        /*
        for( let i = 0; i < jars.length; i++ ) {
            const ethcallProvider3 = new MulticallProvider((resolver as Signer).provider === undefined ? (resolver as Provider) : (resolver as Signer).provider);
            await ethcallProvider3.init();
            const arr : JarDefinition[] = [jars[i]];
            await ethcallProvider3.all<string[]>(
                arr.map((oneJar) => new MulticallContract(oneJar.contract, jarAbi).getRatio())
            ).then((response) => {
                console.log(response);
            });
        }
        */

        const ratios : string[] = await ethcallProvider.all<string[]>(
            jars.map((oneJar) => new MulticallContract(oneJar.contract, jarAbi).getRatio())
          );
        for( let i = 0; i < jars.length; i++ ) {
            jars[i].details.ratio = parseFloat(ethers.utils.formatUnits(ratios[i]));
        }
    }

    async ensureHarvestDataLoaded(jars: JarDefinition[]) {
        const ethJars = jars.filter(x => x.chain === Chain.Ethereum);
        for( let i = 0; i < ethJars.length; i++ ) {
            if( ethJars[i].details.harvestStats === undefined ) {
                await this.loadHarvestData([ethJars[i]]);
            }
        }
    }

    async loadHarvestData(jars: JarDefinition[]) {
        const discovery : JarHarvestResolverDiscovery = new JarHarvestResolverDiscovery();
        for( let i = 0; i < jars.length; i++ ) {
            try {
                const resolver = (jars[i].chain === Chain.Ethereum ? this.etherResolver : this.polyResolver);
                const harvestResolver : JarHarvestResolver = discovery.findHarvestResolver(jars[i]);
                if( harvestResolver === undefined || harvestResolver === null ) {
                    console.log("cant find harvest resolver for jar " + jars[i].id);
                } else {
                    const harvestData : JarHarvestData = await harvestResolver.getJarHarvestData(jars[i], this.prices, resolver);
                    jars[i].details.harvestStats = harvestData?.stats;
                }
            } catch( e ) {
                console.log("Error loading harvest data for jar " + jars[i].id + ":  " + e);
            }
        }
    }
}


