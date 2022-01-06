import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import { AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import { PickleModel } from "../../model/PickleModel";
import { calculateTriFarmsAPY, triPoolV2Ids } from "../../protocols/TrisolarisUtil";
import { triPoolIds, TRI_FARMS } from "../../protocols/TrisolarisUtil";
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
    resolver: Signer | Provider,
  ): Promise<number> {
    return this.getHarvestableUSDMasterchefImplementation(
      jar,
      model,
      resolver,
      ["tri"],
      TRI_FARMS,
      "pendingTri",
      triPoolIds[jar.depositToken.addr] || triPoolV2Ids[jar.depositToken.addr],
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
