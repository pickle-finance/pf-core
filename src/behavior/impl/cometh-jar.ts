import { AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import {
  AbstractJarBehavior,
  ONE_YEAR_IN_SECONDS,
} from "../AbstractJarBehavior";
import stakingRewardsAbi from "../../Contracts/ABIs/staking-rewards.json";
import { PickleModel } from "../../model/PickleModel";
import { Contract } from "ethers-multiprovider";
import { formatEther } from "ethers/lib/utils";
import {
  getLivePairDataFromContracts,
  IPairData,
} from "../../protocols/GenericSwapUtil";
import { ComethPairManager } from "../../protocols/ComethUtil";

export abstract class ComethJar extends AbstractJarBehavior {
  strategyAbi: any;
  rewardAddress: string;
  constructor(strategyAbi: any, rewardAddress: string) {
    super();
    this.strategyAbi = strategyAbi;
    this.rewardAddress = rewardAddress;
  }

  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    return this.getHarvestableUSDDefaultImplementation(
      jar,
      model,
      ["must"],
      this.strategyAbi,
    );
  }

  async getProjectedAprStats(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const must: number = await this.calculateComethAPY(
      this.rewardAddress,
      definition,
      model,
    );
    const lp: number = await calculateComethswapLpApr(
      model,
      definition.depositToken.addr,
    );
    return this.aprComponentsToProjectedApr([
      this.createAprComponent("lp", lp, false),
      this.createAprComponent("must", must, true),
    ]);
  }

  async calculateComethAPY(
    rewardsAddress: string,
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    const multiProvider = model.multiproviderFor(jar.chain);
    const multicallStakingRewards = new Contract(
      rewardsAddress,
      stakingRewardsAbi,
    );

    const [rewardsDurationBN, rewardsForDurationBN, totalSupplyBN] =
      await multiProvider.all([
        multicallStakingRewards.rewardsDuration(),
        multicallStakingRewards.getRewardForDuration(),
        multicallStakingRewards.totalSupply(),
      ]);

    const totalSupply = parseFloat(formatEther(totalSupplyBN));
    const rewardsDuration = rewardsDurationBN.toNumber(); //epoch
    const rewardsForDuration = parseFloat(formatEther(rewardsForDurationBN));

    const { pricePerToken } = await this.getComethPairData(jar, model);

    const rewardsPerYear =
      rewardsForDuration * (ONE_YEAR_IN_SECONDS / rewardsDuration);
    const valueRewardedPerYear =
      model.priceOfSync("must", jar.chain) * rewardsPerYear;

    const totalValueStaked = totalSupply * pricePerToken;
    const apy = valueRewardedPerYear / totalValueStaked;
    return apy * 100;
  }

  async getComethPairData(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<IPairData> {
    return getLivePairDataFromContracts(jar, model, 18);
  }
}
async function calculateComethswapLpApr(
  model: PickleModel,
  addr: string,
): Promise<number> {
  return await new ComethPairManager().calculateLpApr(model, addr);
}
