import { sushiStrategyAbi } from "../../Contracts/ABIs/sushi-strategy.abi";
import {
  AssetProjectedApr,
  AssetProtocol,
  JarDefinition,
} from "../../model/PickleModelJson";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { PickleModel } from "../../model/PickleModel";
import { readQueryFromGraphDetails } from "../../graph/TheGraph";
import { ChainNetwork, Chains } from "../..";
import { formatEther } from "ethers/lib/utils";
import { ONE_YEAR_SECONDS } from "../JarBehaviorResolver";
import { Contract } from "ethers-multiprovider";

const LOOKS_STAKING = "0xbcd7254a1d759efa08ec7c3291b2e85c5dcc12ce";
const LOOKS_DISTRIBUTOR = "0x465a790b428268196865a3ae2648481ad7e0d3b1";
const distributorAbi = [
  "function rewardPerBlockForStaking() external view returns (uint256)",
  "function userInfo(address user) external view returns (uint256, uint256)",
];

export class pLooks extends AbstractJarBehavior {
  protected strategyAbi: any;

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
      ["weth"],
      this.strategyAbi,
    );
  }

  async getTotalValueStaked(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    const multiProvider = model.multiproviderFor(jar.chain);
    const distributor = new Contract(LOOKS_DISTRIBUTOR, distributorAbi);
    const [[totalLooksStaked]] = await multiProvider.all([
      distributor.userInfo(LOOKS_STAKING),
    ]);
    return (
      +formatEther(totalLooksStaked) * model.priceOfSync("looks", jar.chain)
    );
  }

  async getProjectedAprStats(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const wethApy: number = await this.calculateWethRewardsApy(jar, model);
    const looksApy: number = await this.calculateLooksApy(jar, model);

    return this.aprComponentsToProjectedApr([
      this.createAprComponent("weth fee sharing", wethApy, true),
      this.createAprComponent("looks", looksApy, true, 1),
    ]);
  }

  async calculateWethRewardsApy(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    const query = `{
        rewardPeriods(first: 1, orderBy:block, orderDirection: desc) {
          id
          block
          numberBlocks
          reward
        }
      }`;

    const res = await readQueryFromGraphDetails(
      query,
      AssetProtocol.LOOKS,
      ChainNetwork.Ethereum,
    );
    const wethLast24h = res?.data?.rewardPeriods[0]?.reward;
    if (wethLast24h) {
      const totalValueStaked = await this.getTotalValueStaked(jar, model);
      const wethApy =
        (wethLast24h * model.priceOfSync("weth", jar.chain) * 365) /
        totalValueStaked;
      return wethApy * 100;
    }
    return 0;
  }

  async calculateLooksApy(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    const multiProvider = model.multiproviderFor(jar.chain);
    const distributor = new Contract(LOOKS_DISTRIBUTOR, distributorAbi);
    const [rewardPerBlock] = await multiProvider.all([
      distributor.rewardPerBlockForStaking(),
    ]);
    const lookRewardsPerYear =
      (+formatEther(rewardPerBlock) *
        ONE_YEAR_SECONDS *
        model.priceOfSync("looks", jar.chain)) /
      Chains.get(jar.chain).secondsPerBlock;
    const valueStaked = await this.getTotalValueStaked(jar, model);

    return (lookRewardsPerYear * 100) / valueStaked;
  }
}
