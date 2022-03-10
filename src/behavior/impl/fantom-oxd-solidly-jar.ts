import { Chains, PickleModel } from "../..";
import { JarDefinition, AssetProjectedApr, AssetAprComponent } from "../../model/PickleModelJson";
import strategyABI from "../../Contracts/ABIs/strategy-dual.json";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { SolidlyPairManager } from "../../protocols/SolidUtil";
import { Multicall } from "@uniswap/v3-sdk";
import { multicallContract } from "../../protocols/BalancerUtil/config";
import { formatEther } from "ethers/lib/utils";
import { Contract as MultiContract } from "ethers-multicall";
import oxdLensAbi from "../../../src/Contracts/ABIs/oxd-lens.json";
import oxdMultiRewards from "../../../src/Contracts/ABIs/oxd-multirewards.json"
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import {
  createAprComponentImpl,
  ONE_YEAR_IN_SECONDS,
} from "../../behavior/AbstractJarBehavior";

const OXD_LENS = "0xDA00137c79B30bfE06d04733349d98Cf06320e69";

export async function calculateOxdFarmsAPY(
  jar: JarDefinition,
  model: PickleModel,
): Promise<AssetAprComponent> {
  const multicallOxdFarms = new MultiContract(OXD_LENS, oxdLensAbi);
  const oxdPool = multicallOxdFarms.oxdPoolBySolidPool(jar.depositToken.addr);

  const multicallOxdMultiRewards = new MultiContract(oxdPool, oxdMultiRewards);

  const [oxdToken, solidToken] = await model.callMulti(
    [
      () => multicallOxdMultiRewards.rewardTokens()[0],
      () => multicallOxdMultiRewards.rewardTokens()[1]
    ],
    jar.chain
  );

  // Duration is one week measured in seconds.
  const [oxdRewardsDuration, solidRewardsDuration] = await model.callMulti(
    [
      () => multicallOxdMultiRewards.rewardData(oxdToken)[1],
      () => multicallOxdMultiRewards.rewardData(solidToken)[1],
    ],
    jar.chain
  );

  // Result is a big number that must be converted to Ether from Wei.
  const [oxdPerDurationBN, solidPerDurationBN] = await model.callMulti(
    [
      () => multicallOxdMultiRewards.getRewardForDuration(oxdToken),
      () => multicallOxdMultiRewards.getRewardForDuration(solidToken),
    ],
    jar.chain
  );

  // Oxd Rewards in Ether per second.
  const oxdPerSec = (parseFloat(formatEther(oxdPerDurationBN)) / oxdRewardsDuration);

  // Solid Rewards in Ether per second.
  const solidPerSec = (parseFloat(formatEther(solidPerDurationBN)) / solidRewardsDuration);

  // OXD Rewards paid out in one year at current rate.
  const oxdRewardedPerYear = model.priceOfSync("oxd", jar.chain) * oxdPerSec * ONE_YEAR_IN_SECONDS;

  // SOLID Rewards paid out in one year at current rate.
  const solidRewardedPerYear = model.priceOfSync("solid", jar.chain) * solidPerSec * ONE_YEAR_IN_SECONDS;

  // Total supply of LP tokens staked in contract measured in Wei.
  const totalSupplyBN = multicallOxdMultiRewards.totalSupply();

  // Total supply of LP tokens staked in contract measured in Ether.
  const totalSupply = (parseFloat(formatEther(totalSupplyBN)));

  // Price of LP token.
  const pricePerToken = model.priceOfSync(jar.depositToken.addr, jar.chain);

  // Total value of LP tokens staked in rewards contract.
  const totalValueStaked = totalSupply * pricePerToken;

  // Annual rewards rates for OXD and SOLID rewards.
  const oxdAPY = oxdRewardedPerYear / totalValueStaked;
  const solidAPY = solidRewardedPerYear / totalValueStaked;

  // Return APY components to be passed into Jar Class
  return [
    createAprComponentImpl("oxd", oxdAPY * 100, true, 1 - Chains.get(jar.chain).defaultPerformanceFee),
    createAprComponentImpl("solid", solidAPY * 100, true, 1 - Chains.get(jar.chain).defaultPerformanceFee)
  ];
}

export class OxdSolidlyJar extends AbstractJarBehavior {
  protected strategyAbi: any;

  constructor() {
    super();
    this.strategyAbi = strategyABI;
  }

  async getDepositTokenPrice(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    return super.getDepositTokenPrice(definition, model);
  }

  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    return this.getHarvestableUSDCommsMgrImplementation(
      jar,
      model,
      ["solid", "oxd"],
      this.strategyAbi,
    );
  }

  async getProjectedAprStats(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const lp = await new SolidlyPairManager().calculateLpApr(
      model,
      jar.depositToken.addr,
    );

    return this.aprComponentsToProjectedApr([
      await calculateOxdFarmsAPY(jar, model),
      this.createAprComponent("lp", lp, false),
    ]);
  }
}
