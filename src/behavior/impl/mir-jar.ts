import { ethers, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import { AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { mirRewardAbi } from "../../Contracts/ABIs/mir-reward.abi";
import { PickleModel } from "../../model/PickleModel";
import { calculateUniswapLpApr } from "../../protocols/UniswapUtil";
import { formatEther } from "ethers/lib/utils";
import { ONE_YEAR_SECONDS } from "../JarBehaviorResolver";
import stakingRewardsAbi from "../../Contracts/ABIs/staking-rewards.json";
import { Contract as MulticallContract } from "ethers-multicall";
import { getLivePairDataFromContracts } from "../../protocols/GenericSwapUtil";

export const MIRROR_MIR_UST_STAKING_REWARDS =
  "0x5d447Fc0F8965cED158BAB42414Af10139Edf0AF";
export const MIRROR_MTSLA_UST_STAKING_REWARDS =
  "0x43DFb87a26BA812b0988eBdf44e3e341144722Ab";
export const MIRROR_MAAPL_UST_STAKING_REWARDS =
  "0x735659C8576d88A2Eb5C810415Ea51cB06931696";
export const MIRROR_MQQQ_UST_STAKING_REWARDS =
  "0xc1d2ca26A59E201814bF6aF633C3b3478180E91F";
export const MIRROR_MSLV_UST_STAKING_REWARDS =
  "0xDB278fb5f7d4A7C3b83F80D18198d872Bbf7b923";
export const MIRROR_MBABA_UST_STAKING_REWARDS =
  "0x769325E8498bF2C2c3cFd6464A60fA213f26afcc";
export abstract class MirJar extends AbstractJarBehavior {
  private rewardAddress: string;

  constructor(rewardAddress: string) {
    super();
    this.rewardAddress = rewardAddress;
  }

  async calculateMirAPY(
    rewardsAddress: string,
    jar: JarDefinition,
    model: PickleModel,
  ) {
    const multicallProvider = model.multicallProviderFor(jar.chain);
    await multicallProvider.init();

    const multicallUniStakingRewards = new MulticallContract(
      rewardsAddress,
      stakingRewardsAbi,
    );

    const [rewardRateBN, totalSupplyBN] = await multicallProvider.all([
      multicallUniStakingRewards.rewardRate(),
      multicallUniStakingRewards.totalSupply(),
    ]);

    const totalSupply = parseFloat(formatEther(totalSupplyBN));
    const mirRewardRate = parseFloat(formatEther(rewardRateBN));

    const { pricePerToken } = await getLivePairDataFromContracts(
      jar,
      model,
      18,
    );

    const mirRewardsPerYear = mirRewardRate * ONE_YEAR_SECONDS;
    const valueRewardedPerYear =
      (model.priceOfSync("mir", jar.chain)) * mirRewardsPerYear;

    const totalValueStaked = totalSupply * pricePerToken;
    const mirAPY = valueRewardedPerYear / totalValueStaked;

    return mirAPY * 100;
  }

  async getProjectedAprStats(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const mir: number = await this.calculateMirAPY(
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
      this.createAprComponent("mir", mir, true),
    ]);
  }

  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
    resolver: Signer | Provider,
  ): Promise<number> {
    const rewards = new ethers.Contract(
      this.rewardAddress,
      mirRewardAbi,
      resolver,
    );
    const [mir, mirPrice] = await Promise.all([
      rewards.earned(jar.details.strategyAddr),
      model.priceOfSync("mirror-protocol", jar.chain),
    ]);
    const harvestable = mir.mul(mirPrice.toFixed());
    return parseFloat(ethers.utils.formatEther(harvestable));
  }
}
