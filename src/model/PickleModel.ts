import { JarDefinition, PickleModelJson } from "./PickleModelJson";
import { ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { jars, standaloneFarms } from "./JarsAndFarms";
//import jarsAbi from "../Contracts/ABIs/jar.json";
import controllerAbi from "../Contracts/ABIs/controller.json";
import strategyAbi from "../Contracts/ABIs/strategy.json";

export class PickleModel {
    controllerAddr  = "0x6847259b2B3A4c17e7c43C54409810aF48bA5210";

    async run(resolver: Signer | Provider) : Promise<PickleModelJson> {
        await this.overrideJarStrategies(jars, resolver);
        return {
            jarsAndFarms: {
                jars: jars,
                standaloneFarms: standaloneFarms
            }
        }
    }
    async overrideJarStrategies(jars: JarDefinition[], resolver: Signer | Provider) {
        const controllerContract = await new ethers.Contract(this.controllerAddr, controllerAbi, resolver);
        Promise.all(jars.map(async oneJarDef => {
            const strategyAddr = await controllerContract.strategies(oneJarDef.depositToken);
            const strategyContract = new ethers.Contract(strategyAddr, strategyAbi, resolver);
            const strategyName = await strategyContract.getName();
            oneJarDef.jarDetails.strategyAddr = strategyAddr;
            oneJarDef.jarDetails.strategyName = strategyName;
        }));

    }
    
}

