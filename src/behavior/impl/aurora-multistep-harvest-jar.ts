import { BigNumber, ethers } from "ethers";
import { TransactionResponse } from "@ethersproject/providers";
import { JarDefinition } from "../../model/PickleModelJson";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { PickleModel } from "../../model/PickleModel";
import { ICustomHarvester, PfCoreGasFlags } from "../JarBehaviorResolver";

export abstract class AuroraMultistepHarvestJar extends AbstractJarBehavior {
  protected harvestSteps: number;
  protected treasuryStep: number;
  /**
   *
   * @param harvestSteps
   * @param treasuryStep This is a human-indexed number, not a cs-indexed number.
   *                     Ex: harvestOne would be 1, not 0
   */
  constructor(harvestSteps: number, treasuryStep: number) {
    super();
    this.harvestSteps = harvestSteps;
    this.treasuryStep = treasuryStep;
  }

  getCustomHarvester(
    jar: JarDefinition,
    model: PickleModel,
    signer: ethers.Signer,
    properties: { [key: string]: string },
  ): ICustomHarvester | undefined {
    if (properties && properties.action === "harvest") {
      return this.customAuroraHarvestRunner(jar, model, signer);
    }
    return undefined;
  }

  customAuroraHarvestRunner(
    jar: JarDefinition,
    _model: PickleModel,
    signer: ethers.Signer,
  ): ICustomHarvester | undefined {
    const harvestStepsInternal = this.harvestSteps;
    const treasuryStepInternal = this.treasuryStep;
    return {
      async estimateGasToRun(): Promise<BigNumber | undefined> {
        const strategy = new ethers.Contract(
          jar.details.strategyAddr as string,
          MULTISTEP_HARVEST_ABI,
          signer,
        );
        const ret: BigNumber = await strategy.estimateGas.harvestOne();
        return ret ? ret.mul(harvestStepsInternal.toFixed()) : undefined;
      },
      async run(
        flags: PfCoreGasFlags,
      ): Promise<TransactionResponse | undefined> {
        console.log("[" + jar.details.apiKey + "] - Harvesting an Aurora jar");
        const strategy = new ethers.Contract(
          jar.details.strategyAddr as string,
          MULTISTEP_HARVEST_ABI,
          signer,
        );

        const responses: TransactionResponse[] = [];
        try {
          for (let i = 0; i < harvestStepsInternal; i++) {
            const funcName = multistepHarvestNames[i];
            console.log("[" + jar.details.apiKey + "] - Calling " + funcName);
            const result: TransactionResponse = await strategy[funcName](flags);
            await result.wait(3);
            responses.push(result);
          }
        } catch (error) {
          console.log(
            "Error harvesting jar " + jar.details.apiKey + " - " + error,
          );
        }
        const indexToReturn = treasuryStepInternal - 1;
        if (indexToReturn < responses.length) return responses[indexToReturn];
        return responses.length > 0 ? responses[0] : undefined;
      },
    };
  }
}

const MULTISTEP_HARVEST_ABI = [
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "harvestOne",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "harvestTwo",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "harvestThree",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "harvestFour",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "harvestFive",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "harvestSix",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "harvestSeven",
    inputs: [],
  },
];

// This is a list of function names we can call, in order.
// ie, harvestOne, harvestTwo, harvestThree
const multistepHarvestNames: string[] = MULTISTEP_HARVEST_ABI.map(
  (x) => x.name,
);
