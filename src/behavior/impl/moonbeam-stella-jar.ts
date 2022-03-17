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
  "0x8BC3CceeF43392B315dDD92ba30b435F79b66b9e": 2,
  "0x5Ced2f8DD70dc25cbA10ad18c7543Ad9ad5AEeDD": 3,
  "0xAc2657ba28768FE5F09052f07A9B7ea867A4608f": 4,
  "0x555B74dAFC4Ef3A5A1640041e3244460Dc7610d1": 5,
  "0x81e11a9374033d11Cc7e7485A7192AE37D0795D6": 6,
  "0x49a1cC58dCf28D0139dAEa9c18A3ca23108E78B3": 7,
  "0x367c36dAE9ba198A4FEe295c22bC98cB72f77Fe1": 8,
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
    const pricePerToken = model.priceOfSync(jar.depositToken.addr, jar.chain);
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
      model.priceOfSync("stella", jar.chain) * rewardsPerYear;
    const totalValueStaked = totalSupply * pricePerToken;
    const stellaAPY = stellaRewardedPerYear / totalValueStaked;

    return stellaAPY * 100;
  }
}
