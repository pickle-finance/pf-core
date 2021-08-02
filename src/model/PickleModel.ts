import { AssetEnablement,  JarDefinition, PickleModelJson, StandaloneFarmDefinition } from "./PickleModelJson";
import { ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import {  Provider as MulticallProvider, Contract as MulticallContract} from 'ethers-multicall';
import controllerAbi from "../Contracts/ABIs/controller.json";
import strategyAbi from "../Contracts/ABIs/strategy.json";
import jarAbi from "../Contracts/ABIs/jar.json";
import { JAR_SADDLE_D4, standaloneFarms } from "./JarsAndFarms";
import { Chain } from "../chain/ChainModel";
import { PriceCache } from "../price/PriceCache";
import { ExternalTokenFetchStyle, ExternalTokenModelSingleton } from "../price/ExternalTokenModel";
import { CoinGeckpPriceResolver } from "../price/CoinGeckoPriceResolver";
import { JarHarvestResolverDiscovery } from "../harvest/JarHarvestResolverDiscovery";
import { JarHarvestData } from "../harvest/JarHarvestResolver";
import { getDillDetails } from "../dill/DillUtility";

export const CONTROLLER_ETH = "0x6847259b2B3A4c17e7c43C54409810aF48bA5210";
export const CONTROLLER_POLYGON = "0x83074F0aB8EDD2c1508D3F657CeB5F27f6092d09";
export class PickleModel {

    async run(chosenChain: Chain, resolver: Signer | Provider) : Promise<PickleModelJson> {
        const jarsToUse : JarDefinition[] = //jars.filter(x => x.chain === chosenChain).filter(x => x.enablement === AssetEnablement.ENABLED);
            [JAR_SADDLE_D4];
        const farmsToUse : StandaloneFarmDefinition[] = standaloneFarms.filter(x => x.chain === chosenChain);
        const prices : PriceCache = new PriceCache();
        const arr: string[] = ExternalTokenModelSingleton.getTokens(chosenChain).filter(val => val.fetchType != ExternalTokenFetchStyle.NONE).map(a => a.coingeckoId);
        await prices.getPrices(arr, new CoinGeckpPriceResolver(ExternalTokenModelSingleton));

        const controller = (chosenChain === Chain.Ethereum ? CONTROLLER_ETH : CONTROLLER_POLYGON);
        await this.addJarStrategies(jarsToUse, controller, resolver);
        await this.addJarRatios(jarsToUse, controller, resolver);
        
        await this.addHarvestData(jarsToUse, prices, resolver);
        const dillObject = await getDillDetails(0, prices, resolver); // TODO fix first arg

        return {
            jarsAndFarms: {
                jars: jarsToUse,
                standaloneFarms: farmsToUse
            },
            dill: dillObject,
            prices: Object.fromEntries(prices.getCache())
        }
    }

    async addJarStrategies(jars: JarDefinition[], controllerAddr: string, resolver: Signer | Provider) {

        const ethcallProvider = new MulticallProvider((resolver as Signer).provider === undefined ? (resolver as Provider) : (resolver as Signer).provider);
        await ethcallProvider.init();
        const controllerContract = new MulticallContract(controllerAddr, controllerAbi);
        const strategyAddresses : string[] = await ethcallProvider.all<string[]>(
            jars.map((oneJar) => controllerContract.strategies(oneJar.depositToken))
          );
        for( let i = 0; i < jars.length; i++ ) {
            jars[i].jarDetails.strategyAddr = strategyAddresses[i];
        }
        const strategyNames : string[] = await ethcallProvider.all<string[]>(
            jars.map((oneJar) => new MulticallContract(oneJar.jarDetails.strategyAddr, strategyAbi).getName())
          );
        for( let i = 0; i < jars.length; i++ ) {
            jars[i].jarDetails.strategyName = strategyNames[i];
        }
    }

    async addJarRatios(jars: JarDefinition[], _controllerAddr: string, resolver: Signer | Provider) {
        const ethcallProvider = new MulticallProvider((resolver as Signer).provider === undefined ? (resolver as Provider) : (resolver as Signer).provider);
        await ethcallProvider.init();
        const ratios : string[] = await ethcallProvider.all<string[]>(
            jars.map((oneJar) => new MulticallContract(oneJar.contract, jarAbi).getRatio())
          );
        for( let i = 0; i < jars.length; i++ ) {
            jars[i].jarDetails.ratio = parseFloat(ethers.utils.formatUnits(ratios[i]));
        }
    }

    async addHarvestData(jars: JarDefinition[], prices: PriceCache, resolver: Signer | Provider) {
        const discovery : JarHarvestResolverDiscovery = new JarHarvestResolverDiscovery();
        for( let i = 0; i < jars.length; i++ ) {
            try {
                const harvestData : JarHarvestData = await discovery.findHarvestResolver(jars[i]).getJarHarvestData(jars[i], prices, resolver);
                jars[i].jarDetails.harvestStats = harvestData?.stats;
            } catch( e ) {
                console.log("Error loading harvest data: " + e);
            }
        }
    }
}

