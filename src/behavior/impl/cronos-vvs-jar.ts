import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import {
  AssetAprComponent,
  AssetProjectedApr,
  JarDefinition,
} from "../../model/PickleModelJson";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { PickleModel } from "../../model/PickleModel";
import {
  calculateVvsFarmsAPY,
  VvsswapPairManager,
} from "../../protocols/VvsUtil";
import { vvsPoolIds, VVS_FARMS } from "../../protocols/VvsUtil";

export abstract class CronosVvsJar extends AbstractJarBehavior {
  strategyAbi: any;
  constructor(strategyAbi: any) {
    super();
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
      ["vvs"],
      VVS_FARMS,
      "pendingVVS",
      vvsPoolIds[jar.depositToken.addr],
    );
  }

  async getProjectedAprStats(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const chefComponent: AssetAprComponent = await calculateVvsFarmsAPY(
      definition,
      model,
    );

    const lpApr: number = await new VvsswapPairManager().calculateLpApr(
      model,
      definition.depositToken.addr,
    );
    return this.aprComponentsToProjectedApr([
      this.createAprComponent("lp", lpApr, false),
      this.createAprComponent(
        chefComponent.name,
        chefComponent.apr,
        chefComponent.compoundable,
        0.9,
      ),
    ]);
  }
}
