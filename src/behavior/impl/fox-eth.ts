import { BigNumber, ethers } from "ethers";
import { AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { feiAbi } from "../../Contracts/ABIs/fei-reward.abi";
import { PickleModel } from "../../model/PickleModel";
import stakingRewardsAbi from "../../Contracts/ABIs/staking-rewards.json";
import { Contract as MultiContract } from "ethers-multicall";
import { formatEther } from "ethers/lib/utils";
import { ONE_YEAR_SECONDS } from "../JarBehaviorResolver";
import { calculateUniswapLpApr } from "../../protocols/UniswapUtil";
import { getLivePairDataFromContracts } from "../../protocols/GenericSwapUtil";

export class FoxEth extends AbstractJarBehavior {
  private rewardAddress = "0xc54B9F82C1c54E9D4d274d633c7523f2299c42A0";
  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    const rewards = new MultiContract(this.rewardAddress, feiAbi);
    const fox: BigNumber = await model.callMulti(
      () => rewards.earned(jar.details.strategyAddr),
      jar.chain,
    );
    const foxPrice = model.priceOfSync("shapeshift-fox-token", jar.chain);
    const harvestable = fox.mul((1e8 * foxPrice).toFixed()).div(1e8);
    return parseFloat(ethers.utils.formatEther(harvestable));
  }

  async getProjectedAprStats(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const fox: number = await this.calculateFoxAPY(
      this.rewardAddress,
      definition,
      model,
    );
    const lp: number = await calculateUniswapLpApr(
      model,
      definition.depositToken.addr,
    );

    return this.aprComponentsToProjectedApr([
      this.createAprComponent("lp", lp, false),
      this.createAprComponent("fox", fox, true),
    ]);
  }

  async calculateFoxAPY(
    rewardsAddress: string,
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    const multicallUniStakingRewards = new MultiContract(
      rewardsAddress,
      stakingRewardsAbi,
    );

    const [rewardRateBN, totalSupplyBN] = await model.callMulti(
      [
        () => multicallUniStakingRewards.rewardRate(),
        () => multicallUniStakingRewards.totalSupply(),
      ],
      jar.chain,
    );

    const totalSupply = parseFloat(formatEther(totalSupplyBN));
    const foxRewardRate = parseFloat(formatEther(rewardRateBN));

    const { pricePerToken } = await getLivePairDataFromContracts(
      jar,
      model,
      18,
    );
    const foxPrice = model.priceOfSync("fox", jar.chain);
    const foxRewardsPerYear = foxRewardRate * ONE_YEAR_SECONDS;
    const valueRewardedPerYear = foxPrice * foxRewardsPerYear;

    const totalValueStaked = totalSupply * pricePerToken;
    const foxAPY = valueRewardedPerYear / totalValueStaked;
    return 0 // Rewards ended Feb 24;
  }
}
