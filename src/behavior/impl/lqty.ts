import { multiSushiStrategyAbi } from "../../Contracts/ABIs/multi-sushi-strategy.abi";
import {
  AssetAprComponent,
  AssetProjectedApr,
  JarDefinition,
} from "../../model/PickleModelJson";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { PickleModel } from "../../model/PickleModel";
import { getOrLoadYearnDataFromDune } from "../../protocols/DuneDataUtility";

export class pLqty extends AbstractJarBehavior {
  protected strategyAbi: any;

  constructor() {
    super();
    this.strategyAbi = multiSushiStrategyAbi;
  }

  async getDepositTokenPrice(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    return model.priceOfSync(definition.depositToken.addr, definition.chain);
  }

  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    return this.getHarvestableUSDDefaultImplementation(
      jar,
      model,
      ["lusd", "weth"],
      this.strategyAbi,
    );
  }

  async getProjectedAprStats(
    _definition: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const apr1: number = await this.calculateLqtyStakingAPY(model);
    const apr1Comp: AssetAprComponent = this.createAprComponent(
      "auto-compounded ETH and LUSD fees",
      apr1,
      true,
    );
    return super.aprComponentsToProjectedApr([apr1Comp]);
  }
  async calculateLqtyStakingAPY(model: PickleModel) {
    const duneData = await getOrLoadYearnDataFromDune(model);
    if (duneData) {
      let lqtyApy = 0;
      lqtyApy = duneData?.data?.get_result_by_result_id[0].data?.apr / 100;
      return lqtyApy * 100;
    }
    return 0;
  }
}
