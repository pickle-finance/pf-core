import { sushiStrategyAbi } from "../../Contracts/ABIs/sushi-strategy.abi";
import { AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import { Contract } from "ethers-multiprovider";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { PickleModel } from "../../model/PickleModel";
import { SushiPolyPairManager } from "../../protocols/SushiSwapUtil";
import raiderRewardsAbi from "../../Contracts/ABIs/raider-rewards.json";
import { formatEther } from "ethers/lib/utils";

export abstract class RaiderJar extends AbstractJarBehavior {
  rewardsAddress: string;
  constructor(rewards: string) {
    super();
    this.rewardsAddress = rewards;
  }

  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    return this.getHarvestableUSDDefaultImplementation(
      jar,
      model,
      ["raider"],
      sushiStrategyAbi,
    );
  }

  async getProjectedAprStats(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const lpApr: number = await new SushiPolyPairManager().calculateLpApr(
      model,
      definition.depositToken.addr,
    );
    const raiderAPY: number = await calculateRaiderAPY(
      this.rewardsAddress,
      definition,
      model,
    );
    return this.aprComponentsToProjectedApr([
      this.createAprComponent("lp", lpApr, false),
      this.createAprComponent("raider", raiderAPY, true),
    ]);
  }
}

async function calculateRaiderAPY(
  rewardsAddress: string,
  jar: JarDefinition,
  model: PickleModel,
): Promise<number> {
  const multiProvider = model.multiproviderFor(jar.chain);
  const multicallStakingRewards = new Contract(
    rewardsAddress,
    raiderRewardsAbi,
  );

  const [dailyRewardsBN, totalSupplyBN] = await multiProvider.all([
    multicallStakingRewards.dailyEmissionsRate(),
    multicallStakingRewards.totalStakedSupply(),
  ]);
  const totalSupply = parseFloat(formatEther(totalSupplyBN));
  const raiderRewardsPerYear = parseFloat(formatEther(dailyRewardsBN)) * 365;

  const raiderAPY =
    (raiderRewardsPerYear * model.priceOfSync("raider", jar.chain)) /
    (jar.depositToken.price * totalSupply);
  return raiderAPY * 100;
}
