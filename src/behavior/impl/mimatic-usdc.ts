import { mimaticStrategyAbi } from "../../Contracts/ABIs/mimatic-strategy.abi";
import {
  AssetAprComponent,
  AssetProjectedApr,
  JarDefinition,
} from "../../model/PickleModelJson";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { PickleModel } from "../../model/PickleModel";
import { QuickswapPairManager } from "../../protocols/QuickswapUtil";
import { calculateMasterChefRewardsAPR } from "../../protocols/MasterChefApyUtil";

export class MimaticUSDC extends AbstractJarBehavior {
  protected strategyAbi: any;

  constructor() {
    super();
    this.strategyAbi = mimaticStrategyAbi;
  }

  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    return this.getHarvestableUSDDefaultImplementation(
      jar,
      model,
      ["qi"],
      this.strategyAbi,
    );
  }

  async getProjectedAprStats(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const chefComponent: AssetAprComponent =
      await calculateMasterChefRewardsAPR(definition, model);
    const lpApr: number = await new QuickswapPairManager().calculateLpApr(
      model,
      definition.depositToken.addr,
    );
    return this.aprComponentsToProjectedApr([
      this.createAprComponent("lp", lpApr, false),
      this.createAprComponent(
        chefComponent.name,
        chefComponent.apr,
        chefComponent.compoundable,
      ),
    ]);
  }
}
