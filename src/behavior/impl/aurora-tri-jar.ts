import { AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import { PickleModel } from "../../model/PickleModel";
import {
  triPoolIds,
  TRI_FARMS,
  calculateTriFarmsAPY,
  triPoolV2Ids,
  TRI_V2_FARMS,
} from "../../protocols/TrisolarisUtil";
import { AuroraMultistepHarvestJar } from "./aurora-multistep-harvest-jar";

export abstract class AuroraTriJar extends AuroraMultistepHarvestJar {
  strategyAbi: any;
  constructor(strategyAbi: any) {
    super(5, 1);
    this.strategyAbi = strategyAbi;
  }
  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    let chefAddress: string;
    let poolId: number;
    if (triPoolIds[jar.depositToken.addr] !== undefined) {
      chefAddress = TRI_FARMS;
      poolId = triPoolIds[jar.depositToken.addr];
    } else if (triPoolV2Ids[jar.depositToken.addr] !== undefined) {
      chefAddress = TRI_V2_FARMS;
      poolId = triPoolV2Ids[jar.depositToken.addr].poolId;
    } else {
      model.logError(
        `getHarvestableUSD [${jar.details.apiKey}]`,
        `Token ${jar.depositToken.addr} has no registered poolId`,
      );
    }

    // Some strategies' getHarvestable is broken, using default implementation is not possible
    return this.getHarvestableUSDMasterchefComManImplementation(
      jar,
      model,
      ["tri" /* "aurora" */], // Trisolaris Aurora bonus rewards has ended
      chefAddress,
      "pendingTri",
      poolId,
    );
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
