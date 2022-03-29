import { mimaticStrategyAbi } from "../../Contracts/ABIs/mimatic-strategy.abi";
import {
  AssetAprComponent,
  AssetProjectedApr,
  JarDefinition,
} from "../../model/PickleModelJson";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { PickleModel } from "../../model/PickleModel";
import { calculateMasterChefRewardsAPR } from "../../protocols/MasterChefApyUtil";
import { QuickswapPairManager } from "../../protocols/QuickswapUtil";

export class MaticQi extends AbstractJarBehavior {
  protected strategyAbi: any;

  constructor() {
    super();
    this.strategyAbi = mimaticStrategyAbi;
  }

  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    return this.getHarvestableUSDCommsMgrImplementation(
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
    const chefPromise = calculateMasterChefRewardsAPR(definition, model);
    const lpPromise = new QuickswapPairManager().calculateLpApr(
      model,
      definition.depositToken.addr,
    );
    const chefComponent: AssetAprComponent = await chefPromise;
    const lpApr: number = await lpPromise;

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
