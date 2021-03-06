import strategyAbi from "../../Contracts/ABIs/strategy.json";
import {
  AssetAprComponent,
  AssetProjectedApr,
  JarDefinition,
} from "../../model/PickleModelJson";
import roseFarmAbi from "../../Contracts/ABIs/rose-farm.json";
import { PickleModel } from "../../model/PickleModel";
import { Contract } from "ethers-multiprovider";
import { formatEther } from "ethers/lib/utils";
import { ONE_YEAR_SECONDS } from "../JarBehaviorResolver";
import { createAprComponentImpl } from "../../behavior/AbstractJarBehavior";
import { AuroraMultistepHarvestJar } from "./aurora-multistep-harvest-jar";

export abstract class RoseJar extends AuroraMultistepHarvestJar {
  rewarderAddress: string;
  constructor(rewarderAddress: string) {
    super(4, 1);
    this.rewarderAddress = rewarderAddress;
  }

  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    return this.getHarvestableUSDDefaultImplementation(
      jar,
      model,
      ["rose"],
      strategyAbi,
    );
  }

  async getProjectedAprStats(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    return this.aprComponentsToProjectedApr(
      await this.calculateRoseAPY(definition, model),
    );
  }

  async calculateRoseAPY(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<AssetAprComponent[]> {
    const pricePerToken = model.priceOfSync(jar.depositToken.addr, jar.chain);
    const multiProvider = model.multiproviderFor(jar.chain);

    const multicallRoseRewards = new Contract(
      this.rewarderAddress,
      roseFarmAbi,
    );
    const [rewardData, totalSupplyBN] = await multiProvider.all([
      multicallRoseRewards.rewardData(model.address("rose", jar.chain)),
      multicallRoseRewards.totalSupply(),
    ]);

    const totalSupply = parseFloat(formatEther(totalSupplyBN));
    const roseRewardsPerYear =
      parseFloat(formatEther(rewardData[3])) * ONE_YEAR_SECONDS;

    const valueRewardedPerYear =
      model.priceOfSync("rose", jar.chain) * roseRewardsPerYear;

    const totalValueStaked = totalSupply * pricePerToken;
    const roseAPY = 100 * (valueRewardedPerYear / totalValueStaked);
    return [createAprComponentImpl("rose", roseAPY, true, 0.9)];
  }
}
