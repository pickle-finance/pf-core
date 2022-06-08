import { sushiStrategyAbi } from "../../Contracts/ABIs/sushi-strategy.abi";
import { AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { PickleModel } from "../../model/PickleModel";
import stakingRewardsAbi from "../../Contracts/ABIs/staking-rewards.json";
import { Contract } from "ethers-multiprovider";
import { formatEther } from "ethers/lib/utils";
import { ONE_YEAR_SECONDS } from "../JarBehaviorResolver";
import { getLivePairDataFromContracts } from "../../protocols/GenericSwapUtil";
import { SushiEthPairManager } from "../../protocols/SushiSwapUtil";

export class NewoUsdc extends AbstractJarBehavior {
  protected strategyAbi: any;
  private rewardAddress = "0x9D4af0f08B300437b4f0d97A1C5c478F1e0A7D3C";

  constructor() {
    super();
    this.strategyAbi = sushiStrategyAbi;
  }

  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    return this.getHarvestableUSDDefaultImplementation(
      jar,
      model,
      ["newo"],
      this.strategyAbi,
    );
  }

  async getProjectedAprStats(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const newo: number = await this.calculateNewoAPY(
      this.rewardAddress,
      definition,
      model,
    );
    const lp: number = await new SushiEthPairManager().calculateLpApr(
      model,
      definition.depositToken.addr,
    );
    return this.aprComponentsToProjectedApr([
      this.createAprComponent("lp", lp, false),
      this.createAprComponent("newo", newo, true),
    ]);
  }

  async calculateNewoAPY(
    rewardsAddress: string,
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    const multiProvider = model.multiproviderFor(jar.chain);
    const multicallUniStakingRewards = new Contract(
      rewardsAddress,
      stakingRewardsAbi,
    );

    const [rewardRateBN, totalSupplyBN] = await multiProvider.all([
      multicallUniStakingRewards.rewardRate(),
      multicallUniStakingRewards.totalSupply(),
    ]);

    const totalSupply = parseFloat(formatEther(totalSupplyBN));
    const rewardRate = parseFloat(formatEther(rewardRateBN));

    const { pricePerToken } = await getLivePairDataFromContracts(
      jar,
      model,
      18,
    );

    const rewardsPerYear = rewardRate * ONE_YEAR_SECONDS;
    const valueRewardedPerYear =
      model.priceOfSync("newo", jar.chain) * rewardsPerYear;

    const totalValueStaked = totalSupply * pricePerToken;
    const newoAPY = valueRewardedPerYear / totalValueStaked;
    return newoAPY * 100;
  }
}
