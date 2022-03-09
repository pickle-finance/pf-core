import { AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import { PickleModel } from "../../model/PickleModel";
import { multiSushiStrategyAbi } from "../../Contracts/ABIs/multi-sushi-strategy.abi";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import {
  calculateMCv2ApyArbitrum,
  calculateSushiApyArbitrum,
  SushiArbPairManager,
} from "../../protocols/SushiSwapUtil";

export abstract class ArbitrumSushiJar extends AbstractJarBehavior {
  protected rewardToken: string;
  protected strategyAbi: any;

  constructor(rewardToken: string) {
    super();
    this.rewardToken = rewardToken;
    this.strategyAbi = multiSushiStrategyAbi;
  }
  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    return this.getHarvestableUSDComManImplementation(
      jar,
      model,
      ["sushi", this.rewardToken],
      this.strategyAbi,
    );
  }

  async getProjectedAprStats(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const [sushiApy, rewardApy] = await Promise.all([
      calculateSushiApyArbitrum(definition, model),
      calculateMCv2ApyArbitrum(definition, model, this.rewardToken),
    ]);

    const lp: number = await calculateSushiswapLpApr(
      model,
      definition.depositToken.addr,
    );

    return this.aprComponentsToProjectedApr([
      this.createAprComponent("lp", lp, false),
      this.createAprComponent("sushi", sushiApy * 100, true),
      this.createAprComponent(this.rewardToken, rewardApy * 100, true),
    ]);
  }
}

async function calculateSushiswapLpApr(
  model: PickleModel,
  addr: string,
): Promise<number> {
  return await new SushiArbPairManager().calculateLpApr(model, addr);
}
