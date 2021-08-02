import { AssetEnablement, JarDefinition, PickleModelJson, StandaloneFarmDefinition } from "./PickleModelJson";
import { ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { Provider as MulticallProvider, Contract as MulticallContract} from 'ethers-multicall';
import controllerAbi from "../Contracts/ABIs/controller.json";
import strategyAbi from "../Contracts/ABIs/strategy.json";
import jarAbi from "../Contracts/ABIs/jar.json";
import { Chain } from "../chain/ChainModel";
import { PriceCache } from "../price/PriceCache";
import { ExternalTokenFetchStyle, ExternalTokenModelSingleton } from "../price/ExternalTokenModel";
import { CoinGeckpPriceResolver } from "../price/CoinGeckoPriceResolver";
import { JarHarvestResolverDiscovery } from "../harvest/JarHarvestResolverDiscovery";
import { JarHarvestData, JarHarvestResolver } from "../harvest/JarHarvestResolver";
import { getDillDetails } from "../dill/DillUtility";

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



    async ensurePriceCacheLoaded() {
        if( this.prices === undefined ) {
            const tmp : PriceCache = new PriceCache();
            const arr: string[] = ExternalTokenModelSingleton.getTokens(Chain.Ethereum).filter(val => val.fetchType != ExternalTokenFetchStyle.NONE).map(a => a.coingeckoId);
            await tmp.getPrices(arr, new CoinGeckpPriceResolver(ExternalTokenModelSingleton));
            const arr2: string[] = ExternalTokenModelSingleton.getTokens(Chain.Polygon).filter(val => val.fetchType != ExternalTokenFetchStyle.NONE).map(a => a.coingeckoId);
            await tmp.getPrices(arr2, new CoinGeckpPriceResolver(ExternalTokenModelSingleton));
            this.prices = tmp;
        }
        return this.prices;
    }

    async ensureStrategyDataLoaded(jars: JarDefinition[]) {
        for( let i = 0; i < jars.length; i++ ) {
            if( jars[i].jarDetails.strategyAddr === undefined || jars[i].jarDetails.strategyName === undefined ) {
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
//        if( polyJars.length > 0 )
//            await this.addJarStrategies(polyJars, CONTROLLER_POLYGON, this.polyResolver);
    }


    async ensureRatiosLoaded(jars: JarDefinition[]) {
        for( let i = 0; i < jars.length; i++ ) {
            if( jars[i].jarDetails.ratio === undefined ) {
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
            jars[i].jarDetails.strategyAddr = strategyAddresses[i];
        }

        const ethcallProvider2 = new MulticallProvider((resolver as Signer).provider === undefined ? (resolver as Provider) : (resolver as Signer).provider);
        await ethcallProvider2.init();
        const withStrategyAddresses = jars.filter((x) => x.jarDetails.strategyAddr !== undefined && 
            x.jarDetails.strategyAddr !== "0x0000000000000000000000000000000000000000" && x.enablement !== AssetEnablement.DISABLED);

/*
        // debug
        for( let i = 0; i < withStrategyAddresses.length; i++ ) {
            const ethcallProvider3 = new MulticallProvider((resolver as Signer).provider === undefined ? (resolver as Provider) : (resolver as Signer).provider);
            await ethcallProvider3.init();
            const arr : JarDefinition[] = [withStrategyAddresses[i]];
            await ethcallProvider3.all<string[]>(
                arr.map((oneJar) => new MulticallContract(oneJar.jarDetails.strategyAddr, strategyAbi).getName())
            ).then((response) => {
                console.log(response);
            });
        }
*/

        const strategyNames : string[] = await ethcallProvider2.all<string[]>(
            withStrategyAddresses.map((oneJar) => new MulticallContract(oneJar.jarDetails.strategyAddr, strategyAbi).getName())
        );
        for( let i = 0; i < withStrategyAddresses.length; i++ ) {
            withStrategyAddresses[i].jarDetails.strategyName = strategyNames[i];
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
            jars[i].jarDetails.ratio = parseFloat(ethers.utils.formatUnits(ratios[i]));
        }
    }

    async ensureHarvestDataLoaded(jars: JarDefinition[]) {
        const ethJars = jars.filter(x => x.chain === Chain.Ethereum);
        for( let i = 0; i < ethJars.length; i++ ) {
            if( ethJars[i].jarDetails.harvestStats === undefined ) {
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
                    jars[i].jarDetails.harvestStats = harvestData?.stats;
                }
            } catch( e ) {
                console.log("Error loading harvest data for jar " + jars[i].id + ":  " + e);
            }
        }
    }
}

