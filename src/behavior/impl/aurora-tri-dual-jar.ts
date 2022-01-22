import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import { AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import { PickleModel } from "../../model/PickleModel";
import {
  calculateTriFarmsAPY,
  triPoolV2Ids,
  TRI_V2_FARMS,
} from "../../protocols/TrisolarisUtil";
import { AuroraMultistepHarvestJar } from "./aurora-multistep-harvest-jar";

export abstract class AuroraTriDualJar extends AuroraMultistepHarvestJar {
  strategyAbi: any;
  constructor(strategyAbi: any, numSteps: number, toTreasury: number) {
    super(numSteps, toTreasury);
    this.strategyAbi = strategyAbi;
  }
  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
    resolver: Signer | Provider,
  ): Promise<number> {
    const harvestable =
      (await this.getHarvestableUSDDefaultImplementation(
        jar,
        model,
        resolver,
        ["tri", "aurora"],
        this.strategyAbi,
      )) ||
      (await this.getHarvestableUSDMasterchefImplementation(
        jar,
        model,
        resolver,
        ["tri"],
        TRI_V2_FARMS,
        "pendingTri",
        triPoolV2Ids[jar.depositToken.addr].poolId,
      ));

    return harvestable;
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
