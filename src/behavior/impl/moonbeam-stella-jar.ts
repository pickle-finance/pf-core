import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import { sushiStrategyAbi } from "../../Contracts/ABIs/sushi-strategy.abi";
import { AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import stellaFarmsAbi from "../../Contracts/ABIs/stella-farms.json";
import { Contract as MulticallContract } from "ethers-multicall";
import {
  AbstractJarBehavior,
  ONE_YEAR_IN_SECONDS,
} from "../AbstractJarBehavior";
import { PickleModel } from "../../model/PickleModel";
import { PoolId } from "../../protocols/ProtocolUtil";
import { formatEther } from "ethers/lib/utils";
import { Chains } from "../..";

const STELLA_FARMS = "0xEDFB330F5FA216C9D2039B99C8cE9dA85Ea91c1E";

const stellaPoolIds: PoolId = {
  "0x7F5Ac0FC127bcf1eAf54E3cd01b00300a0861a62": 0,
};

export abstract class MoonbeamStellaJar extends AbstractJarBehavior {
  strategyAbi: any;
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
      ["stella"],
      this.strategyAbi,
    );
  }

  async getProjectedAprStats(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const stellaApr: number = await this.calculateStellaFarmsAPY(jar, model);

    return this.aprComponentsToProjectedApr([
      this.createAprComponent("stella", stellaApr, true),
    ]);
  }

  async calculateStellaFarmsAPY(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    const pricePerToken = await model.priceOf(jar.depositToken.addr);
    const multicallProvider = model.multicallProviderFor(jar.chain);
    await multicallProvider.init();
    const poolId = stellaPoolIds[jar.depositToken.addr];
    const multicallStellaFarms = new MulticallContract(
      STELLA_FARMS,
      stellaFarmsAbi,
    );
    const lpToken = new MulticallContract(jar.depositToken.addr, erc20Abi);

    const [stellaPerBlockBn, totalAllocPointBN, poolInfo, totalSupplyBN] =
      await multicallProvider.all([
        multicallStellaFarms.stellaPerBlock(),
        multicallStellaFarms.totalAllocPoint(),
        multicallStellaFarms.poolInfo(poolId),
        lpToken.balanceOf(STELLA_FARMS),
      ]);

    const rewardsPerYear =
      (parseFloat(formatEther(stellaPerBlockBn)) *
        poolInfo.allocPoint.toNumber() *
        ONE_YEAR_IN_SECONDS) /
      (totalAllocPointBN.toNumber() * Chains.get(jar.chain).secondsPerBlock);

    const totalSupply = parseFloat(formatEther(totalSupplyBN));
    const stellaRewardedPerYear =
      (await model.priceOf("stella")) * rewardsPerYear;
    const totalValueStaked = totalSupply * pricePerToken;
    const stellaAPY = stellaRewardedPerYear / totalValueStaked;

    return stellaAPY * 100;
  }
}
