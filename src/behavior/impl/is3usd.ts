import { AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import {
  AbstractJarBehavior,
  ONE_YEAR_IN_SECONDS,
} from "../AbstractJarBehavior";
import { ironchefAbi } from "../../Contracts/ABIs/ironchef.abi";
import { PickleModel } from "../../model/PickleModel";
import { formatEther } from "ethers/lib/utils";
import controllerAbi from "../../Contracts/ABIs/controller.json";
import strategyAbi from "../../Contracts/ABIs/strategy.json";
import { Contract as MultiContract } from "ethers-multicall";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import { getStableswapPriceAddress } from "../../price/DepositTokenPriceUtility";

export class Is3Usd extends AbstractJarBehavior {
  async getDepositTokenPrice(
    asset: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    return getStableswapPriceAddress(
      "0x837503e8a8753ae17fb8c8151b8e6f586defcb57",
      asset,
      model,
    );
  }

  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    return this.getHarvestableUSDMasterchefComManImplementation(
      jar,
      model,
      ["ice"],
      "0x1fd1259fa8cdc60c6e8c86cfa592ca1b8403dfad",
      "pendingReward",
      0,
    );
  }
  async getProjectedAprStats(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    return this.aprComponentsToProjectedApr([
      this.createAprComponent(
        "ice",
        await this.calculateIronChefAPY(jar, model),
        true,
      ),
    ]);
  }
  async calculateIronChefAPY(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    const controllerAddr = model.controllerForJar(jar);
    if (!controllerAddr) {
      return undefined;
    }
    const controller = new MultiContract(controllerAddr, controllerAbi);

    const jarStrategy = await model.callMulti(
      () => controller.strategies(jar.depositToken.addr),
      jar.chain,
    );
    const strategyContract = new MultiContract(jarStrategy, strategyAbi);
    const [ironchefAddress, poolId] = await model.callMulti(
      [() => strategyContract.ironchef(), () => strategyContract.poolId()],
      jar.chain,
    );
    const pricePerToken = 1;

    const multicallIronchef = new MultiContract(ironchefAddress, ironchefAbi);
    const lpToken = new MultiContract(jar.depositToken.addr, erc20Abi);

    const [icePerSecondBN, totalAllocPointBN, poolInfo, totalSupplyBN] =
      await model.callMulti(
        [
          () => multicallIronchef.rewardPerSecond(),
          () => multicallIronchef.totalAllocPoint(),
          () => multicallIronchef.poolInfo(poolId),
          () => lpToken.balanceOf(ironchefAddress),
        ],
        jar.chain,
      );

    const totalSupply = parseFloat(formatEther(totalSupplyBN));
    const icePerSecond =
      (parseFloat(formatEther(icePerSecondBN)) *
        poolInfo.allocPoint.toNumber()) /
      totalAllocPointBN.toNumber();

    const iceRewardsPerYear = icePerSecond * ONE_YEAR_IN_SECONDS;
    const valueRewardedPerYear =
      model.priceOfSync("ice", jar.chain) * iceRewardsPerYear;

    const totalValueStaked = totalSupply * pricePerToken;
    const iceAPR = valueRewardedPerYear / totalValueStaked;
    return iceAPR * 100;
  }
}
