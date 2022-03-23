import { ethers } from "ethers";
import { AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { mirRewardAbi } from "../../Contracts/ABIs/mir-reward.abi";
import { PickleModel } from "../../model/PickleModel";
import { formatEther } from "ethers/lib/utils";
import { ONE_YEAR_SECONDS } from "../JarBehaviorResolver";
import stakingRewardsAbi from "../../Contracts/ABIs/staking-rewards.json";
import { Contract as MultiContract } from "ethers-multicall";
import {
  getLivePairDataFromContracts,
  IPairData,
} from "../../protocols/GenericSwapUtil";

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
  ): Promise<number> {
    const multicallUniStakingRewards = new MultiContract(
      rewardsAddress,
      stakingRewardsAbi,
    );

    const promises1: Promise<any> = model.callMulti(
      [
        () => multicallUniStakingRewards.rewardRate(),
        () => multicallUniStakingRewards.totalSupply(),
      ],
      jar.chain,
    );
    const promises2: Promise<IPairData> = getLivePairDataFromContracts(
      jar,
      model,
      18,
    );
    const { pricePerToken } = await promises2;
    const [rewardRateBN, totalSupplyBN] = await promises1;

    const totalSupply = parseFloat(formatEther(totalSupplyBN));
    const mirRewardRate = parseFloat(formatEther(rewardRateBN));

    const mirRewardsPerYear = mirRewardRate * ONE_YEAR_SECONDS;
    const valueRewardedPerYear =
      model.priceOfSync("mir", jar.chain) * mirRewardsPerYear;

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

    return this.aprComponentsToProjectedApr([
      this.createAprComponent("mir", mir, true),
    ]);
  }

  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    const rewards = new MultiContract(this.rewardAddress, mirRewardAbi);
    const mir = await model.callMulti(
      () => rewards.earned(jar.details.strategyAddr),
      jar.chain,
    );
    const mirPrice = model.priceOfSync("mirror-protocol", jar.chain);
    const harvestable = mir.mul(mirPrice.toFixed());
    return parseFloat(ethers.utils.formatEther(harvestable));
  }
}
