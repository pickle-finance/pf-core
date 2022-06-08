import { Chains, PickleModel } from "../..";
import {
  JarDefinition,
  AssetProjectedApr,
  AssetAprComponent,
} from "../../model/PickleModelJson";
import strategyABI from "../../Contracts/ABIs/strategy-dual.json";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { SolidlyPairManager } from "../../protocols/SolidUtil";
import { formatEther } from "ethers/lib/utils";
import { Contract } from "ethers-multiprovider";
import oxdLensAbi from "../../Contracts/ABIs/oxd-lens.json";
import oxdMultiRewardsAbi from "../../Contracts/ABIs/oxd-multirewards.json";
import {
  createAprComponentImpl,
  ONE_YEAR_IN_SECONDS,
} from "../../behavior/AbstractJarBehavior";

const OXD_LENS = "0xDA00137c79B30bfE06d04733349d98Cf06320e69";

export async function calculateOxdFarmsAPY(
  jar: JarDefinition,
  model: PickleModel,
): Promise<AssetAprComponent[]> {
  const multiProvider = model.multiproviderFor(jar.chain);
  const multicallOxdFarms = new Contract(OXD_LENS, oxdLensAbi);
  const [oxdPool] = await multiProvider.all([
    multicallOxdFarms.stakingRewardsBySolidPool(jar.depositToken.addr),
  ]);

  const multicallOxdMultiRewards = new Contract(oxdPool, oxdMultiRewardsAbi);

  const oxdToken = model.address("oxd", jar.chain);
  const solidToken = model.address("solid", jar.chain);

  const [
    oxdRewardsData,
    solidRewardsData,
    oxdPerDurationBN,
    solidPerDurationBN,
    totalSupplyBN,
  ] = await multiProvider.all([
    multicallOxdMultiRewards.rewardData(oxdToken),
    multicallOxdMultiRewards.rewardData(solidToken),
    multicallOxdMultiRewards.getRewardForDuration(oxdToken),
    multicallOxdMultiRewards.getRewardForDuration(solidToken),
    multicallOxdMultiRewards.totalSupply(),
  ]);

  // Duration is one week measured in seconds.
  const oxdRewardsDuration = oxdRewardsData[1];
  const solidRewardsDuration = solidRewardsData[1];

  // Oxd Rewards in Ether per second.
  const oxdPerSec =
    parseFloat(formatEther(oxdPerDurationBN)) / oxdRewardsDuration;

  // Solid Rewards in Ether per second.
  const solidPerSec =
    parseFloat(formatEther(solidPerDurationBN)) / solidRewardsDuration;

  // OXD Rewards paid out in one year at current rate.
  const oxdRewardedPerYear =
    model.priceOfSync("oxd", jar.chain) * oxdPerSec * ONE_YEAR_IN_SECONDS;

  // SOLID Rewards paid out in one year at current rate.
  const solidRewardedPerYear =
    model.priceOfSync("solid", jar.chain) * solidPerSec * ONE_YEAR_IN_SECONDS;

  // Total supply of LP tokens staked in contract measured in Ether.
  const totalSupply = parseFloat(formatEther(totalSupplyBN));

  // Price of LP token.
  const pricePerToken = jar.depositToken.price!;

  // Total value of LP tokens staked in rewards contract.
  const totalValueStaked = totalSupply * pricePerToken;

  // Annual rewards rates for OXD and SOLID rewards.
  const oxdAPY = oxdRewardedPerYear / totalValueStaked;
  const solidAPY = solidRewardedPerYear / totalValueStaked;

  // Return APY components to be passed into Jar Class
  return [
    createAprComponentImpl(
      "oxd",
      oxdAPY * 100,
      true,
      1 - Chains.get(jar.chain).defaultPerformanceFee,
    ),
    createAprComponentImpl(
      "solid",
      solidAPY * 100,
      true,
      1 - Chains.get(jar.chain).defaultPerformanceFee,
    ),
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
    return this.getHarvestableUSDDefaultImplementation(
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
    const lpPromise = new SolidlyPairManager().calculateLpApr(
      model,
      jar.depositToken.addr,
    );

    const lp = await lpPromise;

    return this.aprComponentsToProjectedApr([
      ...(await calculateOxdFarmsAPY(jar, model)),
      this.createAprComponent("lp", lp, false),
    ]);
  }
}
