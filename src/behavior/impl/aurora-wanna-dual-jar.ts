import { AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import { PickleModel, toError } from "../../model/PickleModel";
import {
  calculateWannaFarmsAPY,
  wannaPoolIds,
  wannaPoolV2Ids,
  WANNA_FARMS,
  WANNA_V2_FARMS,
} from "../../protocols/WannaUtil";
import { AuroraMultistepHarvestJar } from "./aurora-multistep-harvest-jar";
import { ErrorSeverity } from "../../core/platform/PlatformInterfaces";

export abstract class AuroraWannaDualJar extends AuroraMultistepHarvestJar {
  strategyAbi: any;
  constructor(strategyAbi: any, numSteps: number, toTreasury: number) {
    super(numSteps, toTreasury);
    this.strategyAbi = strategyAbi;
  }
  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    let chefAddress: string;
    let poolId: number;
    if (wannaPoolIds[jar.depositToken.addr] !== undefined) {
      chefAddress = WANNA_FARMS;
      poolId = wannaPoolIds[jar.depositToken.addr];
    } else if (wannaPoolV2Ids[jar.depositToken.addr] !== undefined) {
      chefAddress = WANNA_V2_FARMS;
      poolId = wannaPoolV2Ids[jar.depositToken.addr].poolId;
    } else {
      model.logPlatformError(toError(301101, jar.chain, jar.details.apiKey, "getHarvestableUSD", `Token ${jar.depositToken.addr} has no registered poolId`, '', ErrorSeverity.ERROR_3));
    }
    return this.getHarvestableUSDMasterchefImplementation(
      jar,
      model,
      ["wanna"],
      chefAddress,
      "pendingWanna",
      poolId,
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
