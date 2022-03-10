import strategyAbi from "../../Contracts/ABIs/strategy.json";
import { AssetAprComponent, AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import roseFarmAbi from "../../Contracts/ABIs/rose-farm.json";
import { PickleModel } from "../../model/PickleModel";
import { Contract as MultiContract } from "ethers-multicall";
import { formatEther } from "ethers/lib/utils";
import { ONE_YEAR_SECONDS } from "../JarBehaviorResolver";
import { getLivePairDataFromContracts } from "../../protocols/GenericSwapUtil";
import {
  createAprComponentImpl,
} from "../../behavior/AbstractJarBehavior";

export abstract class RoseJar extends AbstractJarBehavior {
  rewarderAddress: string;
  constructor(rewarderAddress: string) {
    super();
    this.rewarderAddress = rewarderAddress;
  }

  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    return this.getHarvestableUSDCommsMgrImplementation(
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
    const multicallRoseRewards = new MultiContract(
      this.rewarderAddress,
      roseFarmAbi,
    );

    const [rewardData, totalSupplyBN] = await model.callMulti(
      [
        () => multicallRoseRewards.rewardData(model.address("rose", jar.chain)),
        () => multicallRoseRewards.totalSupply(),
      ],
      jar.chain,
    );
    const totalSupply = parseFloat(formatEther(totalSupplyBN));
    const roseRewardsPerYear =
      parseFloat(formatEther(rewardData[3])) * ONE_YEAR_SECONDS;

    const { pricePerToken } = await getLivePairDataFromContracts(
      jar,
      model,
      18,
    );

    const valueRewardedPerYear =
      model.priceOfSync("rose", jar.chain) * roseRewardsPerYear;

    const totalValueStaked = totalSupply * pricePerToken;
    const roseAPY = 100 * (valueRewardedPerYear / totalValueStaked);
    return [
      createAprComponentImpl(
        "rose",
        roseAPY,
        true,
        0.9,
      ),
    ]
  }
}
