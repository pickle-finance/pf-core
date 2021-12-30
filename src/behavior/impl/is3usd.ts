import { Contract, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import { AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import {
  AbstractJarBehavior,
  ONE_YEAR_IN_SECONDS,
} from "../AbstractJarBehavior";
import { ironchefAbi } from "../../Contracts/ABIs/ironchef.abi";
import { PickleModel } from "../../model/PickleModel";
import { formatEther } from "ethers/lib/utils";
import { Chains } from "../../chain/Chains";
import controllerAbi from "../../Contracts/ABIs/controller.json";
import strategyAbi from "../../Contracts/ABIs/strategy.json";
import { Contract as MulticallContract } from "ethers-multicall";
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
    resolver: Signer | Provider,
  ): Promise<number> {
    return this.getHarvestableUSDMasterchefImplementation(
      jar,
      model,
      resolver,
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
    const resolver: Provider = Chains.get(jar.chain).getPreferredWeb3Provider();
    const controller = new Contract(controllerAddr, controllerAbi, resolver);

    const multicallProvider = model.multicallProviderFor(jar.chain);
    await multicallProvider.init();

    const jarStrategy = await controller.strategies(jar.depositToken.addr);
    const strategyContract = new Contract(jarStrategy, strategyAbi, resolver);
    const ironchefAddress = await strategyContract.ironchef();
    const poolId = await strategyContract.poolId();
    const pricePerToken = 1;

    const multicallIronchef = new MulticallContract(
      ironchefAddress,
      ironchefAbi,
    );
    const lpToken = new MulticallContract(jar.depositToken.addr, erc20Abi);

    const [icePerSecondBN, totalAllocPointBN, poolInfo, totalSupplyBN] =
      await multicallProvider.all([
        multicallIronchef.rewardPerSecond(),
        multicallIronchef.totalAllocPoint(),
        multicallIronchef.poolInfo(poolId),
        lpToken.balanceOf(ironchefAddress),
      ]);

    const totalSupply = parseFloat(formatEther(totalSupplyBN));
    const icePerSecond =
      (parseFloat(formatEther(icePerSecondBN)) *
        poolInfo.allocPoint.toNumber()) /
      totalAllocPointBN.toNumber();

    const iceRewardsPerYear = icePerSecond * ONE_YEAR_IN_SECONDS;
    const valueRewardedPerYear =
      (await model.priceOf("ice")) * iceRewardsPerYear;

    const totalValueStaked = totalSupply * pricePerToken;
    const iceAPR = valueRewardedPerYear / totalValueStaked;
    return iceAPR * 100;
  }
}
