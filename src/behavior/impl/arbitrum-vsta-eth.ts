import { JarHarvestStats, PickleModel } from "../..";
import { AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import stakingRewardsAbi from "../../Contracts/ABIs/staking-rewards.json";
import { BalancerJar } from "./balancer-jar";
import { Contract as MultiContract } from "ethers-multicall";
import { formatEther } from "ethers/lib/utils";
import { ONE_YEAR_SECONDS } from "../JarBehaviorResolver";
import { BigNumber, ethers } from "ethers";
import { sushiStrategyAbi } from "../../Contracts/ABIs/sushi-strategy.abi";
import { getBalancerPoolDayAPY } from "../../protocols/BalancerUtil";

export class BalancerVstaEth extends BalancerJar {
  private rewardAddress = "0x65207da01293C692a37f59D1D9b1624F0f21177c";

  constructor() {
    super();
  }
  async getProjectedAprStats(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const lp = await getBalancerPoolDayAPY(jar, model);

    const multicallUniStakingRewards = new MultiContract(
      this.rewardAddress,
      stakingRewardsAbi,
    );

    const [rewardRateBN, totalSupplyBN] = await model.callMulti(
      [
        () => multicallUniStakingRewards.rewardRate(),
        () => multicallUniStakingRewards.totalStaked(),
      ],
      jar.chain,
    );

    const totalSupply = parseFloat(formatEther(totalSupplyBN));
    const rewardRate = parseFloat(formatEther(rewardRateBN));

    const pricePerToken = model.priceOfSync(jar.depositToken.addr, jar.chain);
    const rewardsPerYear = rewardRate * ONE_YEAR_SECONDS;

    const valueRewardedPerYear =
      model.priceOfSync("vsta", jar.chain) * rewardsPerYear;

    const totalValueStaked = totalSupply * pricePerToken;
    const vstaAPY = valueRewardedPerYear / totalValueStaked;
    return this.aprComponentsToProjectedApr([
      this.createAprComponent("lp", lp, false),
      this.createAprComponent("vsta", vstaAPY * 100, true),
    ]);
  }

  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    return this.getHarvestableUSDCommsMgrImplementation(
      jar,
      model,
      ["vsta"],
      sushiStrategyAbi,
    );
  }

  // AbstractJarBehavior's Implementation, since Balancer one is buggy
  async getAssetHarvestData(
    definition: JarDefinition,
    model: PickleModel,
    balance: BigNumber,
    available: BigNumber,
  ): Promise<JarHarvestStats> {
    const harvestableUSD: number = await this.getHarvestableUSD(
      definition,
      model,
    );
    const depositTokenDecimals = definition.depositToken.decimals
      ? definition.depositToken.decimals
      : 18;
    const depositTokenPrice: number = model.priceOfSync(
      definition.depositToken.addr,
      definition.chain,
    );
    const balanceUSD: number =
      parseFloat(ethers.utils.formatUnits(balance, depositTokenDecimals)) *
      depositTokenPrice;
    const availUSD: number =
      parseFloat(ethers.utils.formatUnits(available, depositTokenDecimals)) *
      depositTokenPrice;

    return {
      balanceUSD: balanceUSD,
      earnableUSD: availUSD,
      harvestableUSD: harvestableUSD,
    };
  }
}
