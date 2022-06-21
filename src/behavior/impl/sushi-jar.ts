import {
  AssetAprComponent,
  AssetProjectedApr,
  JarDefinition,
  PickleAsset,
} from "../../model/PickleModelJson";
import {
  AbstractJarBehavior,
  aprComponentsToProjectedAprImpl,
  createAprComponentImpl,
  isDisabledOrWithdrawOnly,
} from "../AbstractJarBehavior";
import { PickleModel } from "../../model/PickleModel";
import {
  calculateMCv2SushiRewards,
  calculateMCv2TokenRewards,
  calculateSushiRewardApr,
  SushiEthPairManager,
} from "../../protocols/SushiSwapUtil";

export abstract class SushiJar extends AbstractJarBehavior {
  strategyAbi: any;
  constructor(strategyAbi: any) {
    super();
    this.strategyAbi = strategyAbi;
  }
  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    return this.getHarvestableUSDDefaultImplementation(
      jar,
      model,
      ["sushi"],
      this.strategyAbi,
    );
  }

  async getProjectedAprStats(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    return await this.chefV1AprStats(definition, model);
  }
  async chefV1AprStats(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const lpApr: number = await new SushiEthPairManager().calculateLpApr(
      model,
      definition.depositToken.addr,
    );
    const lpComp: AssetAprComponent = this.createAprComponent(
      "lp",
      lpApr,
      false,
    );
    const components = [lpComp];
    if (!isDisabledOrWithdrawOnly(definition)) {
      const apr1: number = await calculateSushiRewardApr(
        definition.depositToken.addr,
        model,
        definition.chain,
      );
      const apr1Comp: AssetAprComponent = this.createAprComponent(
        "sushi",
        apr1,
        true,
      );
      components.push(apr1Comp);
    }

    return super.aprComponentsToProjectedApr(components);
  }

  async chefV2AprStats(
    definition: JarDefinition,
    model: PickleModel,
    rewardToken: string,
  ): Promise<AssetProjectedApr> {
    return chefV2AprStatsStatic(definition, model, rewardToken);
  }
}
export const chefV2AprStatsStatic = async (
  definition: PickleAsset,
  model: PickleModel,
  rewardToken: string,
): Promise<AssetProjectedApr> => {
  if (isDisabledOrWithdrawOnly(definition)) {
    // duplicate code but easier to read
    const lpApr = await new SushiEthPairManager().calculateLpApr(
      model,
      definition.depositToken.addr,
    );
    const lpComp: AssetAprComponent = createAprComponentImpl(
      "lp",
      lpApr,
      false,
    );
    return aprComponentsToProjectedAprImpl([lpComp]);
  }

  // not disabled, show all components
  const aprSushiRewardsPromise = calculateMCv2SushiRewards(
    definition.depositToken.addr,
    model,
    definition.chain,
  );

  const aprTokenRewardsPromise = calculateMCv2TokenRewards(
    definition.depositToken.addr,
    rewardToken,
    model,
    definition.chain,
  );

  const lpAprPromise = new SushiEthPairManager().calculateLpApr(
    model,
    definition.depositToken.addr,
  );

  const lpApr: number = await lpAprPromise;
  const aprTokenRewards: number = await aprTokenRewardsPromise;
  const aprSushiRewards: number = await aprSushiRewardsPromise;
  const aprSushiComp: AssetAprComponent = createAprComponentImpl(
    "sushi",
    aprSushiRewards,
    true,
  );

  const tokenAprComp: AssetAprComponent = createAprComponentImpl(
    rewardToken,
    aprTokenRewards,
    true,
  );

  const lpComp: AssetAprComponent = createAprComponentImpl("lp", lpApr, false);

  return aprComponentsToProjectedAprImpl([aprSushiComp, tokenAprComp, lpComp]);
};
