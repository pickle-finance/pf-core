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
    return this.getHarvestableUSDCommsMgrImplementation(
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
    const promise1 = Promise.all([
      calculateSushiApyArbitrum(definition, model),
      calculateMCv2ApyArbitrum(definition, model, this.rewardToken),
    ]);

    const promise2 = calculateSushiswapLpApr(
      model,
      definition.depositToken.addr,
    );

    const [sushiApy, rewardApy] = await promise1;
    const lp: number = await promise2;

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
