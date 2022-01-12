import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import { sushiStrategyAbi } from "../../Contracts/ABIs/sushi-strategy.abi";
import { AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { PickleModel } from "../../model/PickleModel";
import masterchefAbi from "../../Contracts/ABIs/masterchef.json";
import { Contract as MulticallContract } from "ethers-multicall";
import { formatEther } from "ethers/lib/utils";
import { ONE_YEAR_SECONDS } from "../JarBehaviorResolver";
import { getLivePairDataFromContracts } from "../../protocols/GenericSwapUtil";
import { calculateUniswapLpApr } from "../../protocols/UniswapUtil";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import { Chains } from "../..";

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
    resolver: Signer | Provider,
  ): Promise<number> {
    return this.getHarvestableUSDDefaultImplementation(
      jar,
      model,
      resolver,
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
    rewardsAddress: string,
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    const multicallProvider = model.multicallProviderFor(jar.chain);
    await multicallProvider.init();

    const multicallRewards = new MulticallContract(
      this.rewardAddress,
      masterchefAbi,
    );
    const multicallLp = new MulticallContract(jar.depositToken.addr, erc20Abi);

    const [rewardPerBlockBN, totalSupplyBN] = await multicallProvider.all([
      multicallRewards.rewardPerBlock(),
      multicallLp.balanceOf(rewardsAddress),
    ]);

    const totalSupply = parseFloat(formatEther(totalSupplyBN));

    const rewardPerBlock = parseFloat(formatEther(rewardPerBlockBN));

    const { pricePerToken } = await getLivePairDataFromContracts(
      jar,
      model,
      18,
    );

    const rewardsPerYear =
      (rewardPerBlock * ONE_YEAR_SECONDS) /
      Chains.get(jar.chain).secondsPerBlock;
    const valueRewardedPerYear =
      (await model.priceOf("looks")) * rewardsPerYear;

    const totalValueStaked = totalSupply * pricePerToken;
    const looksAPY = valueRewardedPerYear / totalValueStaked;
    return looksAPY * 100;
  }
}
