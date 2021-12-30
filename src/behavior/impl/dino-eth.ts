import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import { AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { PickleModel } from "../../model/PickleModel";
import {
  calculateFossilFarmsAPY,
  dinoPoolIds,
  FOSSIL_FARMS,
} from "../../protocols/DinoUtil";
import { QuickswapPairManager } from "../../protocols/QuickswapUtil";

export class DinoEth extends AbstractJarBehavior {
  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
    resolver: Signer | Provider,
  ): Promise<number> {
    return this.getHarvestableUSDMasterchefImplementation(
      jar,
      model,
      resolver,
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
    const dinoApr: number = await calculateFossilFarmsAPY(definition, model);
    const lpApr: number = await new QuickswapPairManager().calculateLpApr(
      model,
      definition.depositToken.addr,
    );
    return this.aprComponentsToProjectedApr([
      this.createAprComponent("lp", lpApr, false),
      this.createAprComponent("dino", dinoApr, true),
    ]);
  }
}
