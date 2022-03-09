import { AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { PickleModel } from "../../model/PickleModel";
import {
  calculateFossilFarmsAPY,
  dinoPoolIds,
  FOSSIL_FARMS,
} from "../../protocols/DinoUtil";
import { SushiPolyPairManager } from "../../protocols/SushiSwapUtil";

export class DinoUsdc extends AbstractJarBehavior {
  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    return this.getHarvestableUSDMasterchefComManImplementation(
      jar,
      model,
      ["dino"],
      FOSSIL_FARMS,
      "pendingDino",
      dinoPoolIds[jar.depositToken.addr],
    );
  }

  async getProjectedAprStats(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const lpApr: number = await new SushiPolyPairManager().calculateLpApr(
      model,
      definition.depositToken.addr,
    );
    const dinoApr: number = await calculateFossilFarmsAPY(definition, model);
    return this.aprComponentsToProjectedApr([
      this.createAprComponent("lp", lpApr, false),
      this.createAprComponent("dino", dinoApr, true),
    ]);
  }
}
