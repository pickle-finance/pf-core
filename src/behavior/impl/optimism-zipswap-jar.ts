import { sushiStrategyAbi } from "../../Contracts/ABIs/sushi-strategy.abi";
import { AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import zipFarms from "../../Contracts/ABIs/zip-farms.json";
import { Contract as MultiContract } from "ethers-multicall";
import {
  AbstractJarBehavior,
  ONE_YEAR_IN_SECONDS,
} from "../AbstractJarBehavior";
import { PickleModel } from "../../model/PickleModel";
import { PoolId } from "../../protocols/ProtocolUtil";
import { formatEther } from "ethers/lib/utils";

const ZIP_FARMS = "0x1e2F8e5f94f366eF5Dc041233c0738b1c1C2Cb0c";

const zipPoolIds: PoolId = {
  "0x1A981dAa7967C66C3356Ad044979BC82E4a478b9": 0,
  "0x53790B6C7023786659D11ed82eE03079F3bD6976": 1,
  "0x251de0f0368c472Bba2E1C8f5Db5aC7582B5f847": 2,
  "0xD7F6ECF4371eddBd60C1080BfAEc3d1d60D415d0": 3,
};

export abstract class ZipswapJar extends AbstractJarBehavior {
  strategyAbi: any;
  constructor() {
    super();
    this.strategyAbi = sushiStrategyAbi;
  }
  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    return this.getHarvestableUSDComManImplementation(
      jar,
      model,
      ["zip"],
      this.strategyAbi,
    );
  }

  async getProjectedAprStats(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const zipApr: number = await this.calculateZipFarmsAPY(jar, model);

    return this.aprComponentsToProjectedApr([
      this.createAprComponent("zip", zipApr, true),
    ]);
  }

  async calculateZipFarmsAPY(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    const pricePerToken = model.priceOfSync(jar.depositToken.addr, jar.chain);
    const poolId = zipPoolIds[jar.depositToken.addr];
    const multicallZipFarms = new MultiContract(ZIP_FARMS, zipFarms);
    const lpToken = new MultiContract(jar.depositToken.addr, erc20Abi);

    const [zipPerSecondBN, totalAllocPointBN, poolInfo, totalSupplyBN] =
      await model.callMulti(
        [
          () => multicallZipFarms.zipPerSecond(),
          () => multicallZipFarms.totalAllocPoint(),
          () => multicallZipFarms.poolInfo(poolId),
          () => lpToken.balanceOf(ZIP_FARMS),
        ],
        jar.chain,
      );

    const rewardsPerYear =
      (parseFloat(formatEther(zipPerSecondBN)) *
        poolInfo.allocPoint.toNumber() *
        ONE_YEAR_IN_SECONDS) /
      totalAllocPointBN.toNumber();

    const totalSupply = parseFloat(formatEther(totalSupplyBN));
    const zipRewardedPerYear =
      model.priceOfSync("zip", jar.chain) * rewardsPerYear;
    const totalValueStaked = totalSupply * pricePerToken;
    const zipAPY = zipRewardedPerYear / totalValueStaked;

    return zipAPY * 100;
  }
}
