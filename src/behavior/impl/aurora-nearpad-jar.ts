import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import {
  AssetProjectedApr,
  JarDefinition,
} from "../../model/PickleModelJson";
import { PickleModel } from "../../model/PickleModel";
import { calculatePadFarmsAPY, padPoolIds, PAD_FARMS } from "../../protocols/NearpadUtil";
import { AuroraMultistepHarvestJar } from "./aurora-multistep-harvest-jar";

export abstract class AuroraPadJar extends AuroraMultistepHarvestJar {
  strategyAbi: any;
  constructor(strategyAbi: any) {
    super(5,1);
    this.strategyAbi = strategyAbi;
  }
  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
    resolver: Signer | Provider,
  ): Promise<number> {
    return this.getHarvestableUSDMasterchefImplementation(
      jar,
      model,
      resolver,
      ["pad"],
      PAD_FARMS,
      "pendingSushi",
      padPoolIds[jar.depositToken.addr],
    );
  }

  async getProjectedAprStats(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    return this.aprComponentsToProjectedApr(
      await calculatePadFarmsAPY(definition, model),
    );
  }
}
