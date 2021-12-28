import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import {
  AssetAprComponent,
  AssetProjectedApr,
  JarDefinition,
  PickleAsset,
} from "../../model/PickleModelJson";
import { AbstractJarBehavior, aprComponentsToProjectedAprImpl, createAprComponentImpl } from "../AbstractJarBehavior";
import { Chains } from "../../chain/Chains";
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
    resolver: Signer | Provider,
  ): Promise<number> {
    return this.getHarvestableUSDDefaultImplementation(jar, model, resolver, 
      ["sushi"], this.strategyAbi);
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

    const lpApr: number = await new SushiEthPairManager().calculateLpApr(
      model,
      definition.depositToken.addr,
    );
    const lpComp: AssetAprComponent = this.createAprComponent(
      "lp",
      lpApr,
      false,
    );
    return super.aprComponentsToProjectedApr([apr1Comp, lpComp]);
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
  const aprSushiRewards: number = await calculateMCv2SushiRewards(
    definition.depositToken.addr,
    model,
    definition.chain,
  );
  const aprSushiComp: AssetAprComponent = createAprComponentImpl(
    "sushi",
    aprSushiRewards,
    true,
  );

  const aprTokenRewards: number = await calculateMCv2TokenRewards(
    definition.depositToken.addr,
    rewardToken,
    model,
    Chains.get(definition.chain).getProviderOrSigner(),
    definition.chain,
  );
  const tokenAprComp: AssetAprComponent = createAprComponentImpl(
    rewardToken,
    aprTokenRewards,
    true,
  );

  const lpApr: number = await new SushiEthPairManager().calculateLpApr(
    model,
    definition.depositToken.addr,
  );
  const lpComp: AssetAprComponent = createAprComponentImpl(
    "lp",
    lpApr,
    false,
  );

  return aprComponentsToProjectedAprImpl([
    aprSushiComp,
    tokenAprComp,
    lpComp,
  ]);
}