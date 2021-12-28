import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import {
  AssetProjectedApr,
  JarDefinition,
} from "../../model/PickleModelJson";
import { PickleModel } from "../../model/PickleModel";
import { calculateTriFarmsAPY } from "../../protocols/TrisolarisUtil";
import { AuroraMultistepHarvestJar } from "./aurora-multistep-harvest-jar";

export abstract class AuroraTriDualJar extends AuroraMultistepHarvestJar {
  strategyAbi: any;
  constructor(strategyAbi: any, numSteps:number, toTreasury:number) {
    super(numSteps, toTreasury);
    this.strategyAbi = strategyAbi;
  }
  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
    resolver: Signer | Provider,
  ): Promise<number> {    
    return this.getHarvestableUSDDefaultImplementation(jar, model, resolver, 
    ["tri","aurora"], this.strategyAbi);
  }

  async getProjectedAprStats(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    return this.aprComponentsToProjectedApr(
      await calculateTriFarmsAPY(definition, model),
    );
  }
}
