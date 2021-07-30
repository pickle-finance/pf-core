import { AssetEnablement, DillDetails, JarDefinition, PickleModelJson, StandaloneFarmDefinition } from "./PickleModelJson";
import { Contract, ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { jars, standaloneFarms } from "./JarsAndFarms";
import controllerAbi from "../Contracts/ABIs/controller.json";
import strategyAbi from "../Contracts/ABIs/strategy.json";
import dillAbi from "../Contracts/ABIs/dill.json";
import { Chain } from "../chain/ChainModel";
import { PriceCache } from "../price/PriceCache";
import { ExternalTokenFetchStyle, ExternalTokenModelSingleton } from "../price/ExternalTokenModel";
import { CoinGeckpPriceResolver } from "../price/CoinGeckoPriceResolver";
import { JarHarvestResolverDiscovery } from "../harvest/JarHarvestResolverDiscovery";
import { JarHarvestData } from "../harvest/JarHarvestResolver";

export const CONTROLLER_ETH = "0x6847259b2B3A4c17e7c43C54409810aF48bA5210";
export const CONTROLLER_POLYGON = "0x83074F0aB8EDD2c1508D3F657CeB5F27f6092d09";
export class PickleModel {

    async run(chosenChain: Chain, resolver: Signer | Provider) : Promise<PickleModelJson> {
        const jarsToUse : JarDefinition[] = jars.filter(x => x.chain === chosenChain).filter(x => x.enablement === AssetEnablement.ENABLED);
        const farmsToUse : StandaloneFarmDefinition[] = standaloneFarms.filter(x => x.chain === chosenChain);

        const prices : PriceCache = new PriceCache();
        const arr: string[] = ExternalTokenModelSingleton.getTokens(chosenChain).filter(val => val.fetchType != ExternalTokenFetchStyle.NONE).map(a => a.coingeckoId);
        await prices.getPrices(arr, new CoinGeckpPriceResolver(ExternalTokenModelSingleton));

        const controller = (chosenChain === Chain.Ethereum ? CONTROLLER_ETH : CONTROLLER_POLYGON);
        await this.addJarStrategies(jarsToUse, controller, resolver);
        await this.addHarvestData(jarsToUse, prices, resolver);
        //const dillObject = await this.getDillDetails(resolver);
        return {
            jarsAndFarms: {
                jars: jarsToUse,
                standaloneFarms: farmsToUse
            },
            dill: undefined,
            prices: Object.fromEntries(prices.getCache())
        }
    }
    async addJarStrategies(jars: JarDefinition[], controllerAddr: string, resolver: Signer | Provider) {
        const controllerContract = new ethers.Contract(controllerAddr, controllerAbi, resolver);

        await Promise.all(jars.map(async oneJarDef => {
            try {
                const strategyAddr = await controllerContract.strategies(oneJarDef.depositToken);
                const strategyContract = new ethers.Contract(strategyAddr, strategyAbi, resolver);
                const strategyName = await strategyContract.getName();
                oneJarDef.jarDetails.strategyAddr = strategyAddr;
                oneJarDef.jarDetails.strategyName = strategyName;
            } catch(e) {
                console.log("Error loading jar " + oneJarDef.id + " - " + e);
            }
        }));
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

    async getDillDetails(resolver: Signer | Provider) : Promise<DillDetails> {
        try {
        const dillContractAddr = "0xbBCf169eE191A1Ba7371F30A1C344bFC498b29Cf";
        const dillContract : Contract = new ethers.Contract(dillContractAddr, dillAbi, resolver);
        const dec18 = ethers.utils.parseEther("1");
        const supply = (await(dillContract.supply())).mul(dec18);
        const supplyFloat = parseFloat(ethers.utils.formatEther(supply));

        const totalSupply = (await(dillContract.totalSupply())).mul(dec18);
        const totalSupplyFloat = parseFloat(ethers.utils.formatEther(totalSupply));

        return {
            pickleLocked: totalSupplyFloat,
            totalDill: supplyFloat
        }
    } catch( e ) {
        console.log(e);
        return undefined;
    }
    }
}

