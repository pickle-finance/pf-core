import { AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import { PickleModel } from "../../model/PickleModel";
import {
  calculateWannaFarmsAPY,
  wannaPoolIds,
  WANNA_FARMS,
} from "../../protocols/WannaUtil";
import { AuroraMultistepHarvestJar } from "./aurora-multistep-harvest-jar";

export abstract class AuroraWannaJar extends AuroraMultistepHarvestJar {
  strategyAbi: any;
  constructor(strategyAbi: any) {
    super(5, 1);
    this.strategyAbi = strategyAbi;
  }
  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    return this.getHarvestableUSDMasterchefCommsMgrImplementation(
      jar,
      model,
      ["wanna"],
      WANNA_FARMS,
      "pendingWanna",
      wannaPoolIds[jar.depositToken.addr],
    );
  }

  async getProjectedAprStats(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    return this.aprComponentsToProjectedApr(
      await calculateWannaFarmsAPY(definition, model),
    );
  }
}
