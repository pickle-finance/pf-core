import { sushiStrategyAbi } from "../../Contracts/ABIs/sushi-strategy.abi";
import { AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { PickleModel } from "../../model/PickleModel";
import { calculateUniswapLpApr } from "../../protocols/UniswapUtil";

export class LooksEth extends AbstractJarBehavior {
  protected strategyAbi: any;
  private rewardAddress = "0x2A70e7F51f6cd40C3E9956aa964137668cBfAdC5";

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
      ["looks"],
      this.strategyAbi,
    );
  }

  async getProjectedAprStats(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const looks: number = await this.calculateLooksAPY(
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
      this.createAprComponent("looks", looks, true),
    ]);
  }

  async calculateLooksAPY(
    _rewardsAddress: string,
    _jar: JarDefinition,
    _model: PickleModel,
  ): Promise<number> {
    // rewards are over. No point in modifying code to check
    // for 'endblock' or something, just return 0 instead.
    return 0;
    // const multicallRewards = new MultiContract(
    //   this.rewardAddress,
    //   masterchefAbi,
    // );
    // const multicallLp = new MultiContract(jar.depositToken.addr, erc20Abi);

    // const [rewardPerBlockBN, totalSupplyBN] = await model.callMulti(
    //   [
    //     () => multicallRewards.rewardPerBlock(),
    //     () => multicallLp.balanceOf(rewardsAddress),
    //   ],
    //   jar.chain,
    // );

    // const totalSupply = parseFloat(formatEther(totalSupplyBN));

    // const rewardPerBlock = parseFloat(formatEther(rewardPerBlockBN));

    // const { pricePerToken } = await getLivePairDataFromContracts(
    //   jar,
    //   model,
    //   18,
    // );

    // const rewardsPerYear =
    //   (rewardPerBlock * ONE_YEAR_SECONDS) /
    //   Chains.get(jar.chain).secondsPerBlock;
    // const valueRewardedPerYear =
    //   model.priceOfSync("looks", jar.chain) * rewardsPerYear;

    // const totalValueStaked = totalSupply * pricePerToken;
    // const looksAPY = valueRewardedPerYear / totalValueStaked;
    // return looksAPY * 100;
  }
}
