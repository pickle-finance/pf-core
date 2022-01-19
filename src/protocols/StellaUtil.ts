import {
  AssetAprComponent,
  AssetProtocol,
  JarDefinition,
} from "../model/PickleModelJson";
import erc20Abi from "../Contracts/ABIs/erc20.json";
import stellaChefAbi from "../Contracts/ABIs/stella.json";
import { PickleModel } from "../model/PickleModel";
import { Contract as MulticallContract } from "ethers-multicall";
import { ChainNetwork } from "../chain/Chains";
import { formatEther } from "ethers/lib/utils";
import { PoolId } from "./ProtocolUtil";
import { GenericSwapUtility, IExtendedPairData } from "./GenericSwapUtil";
import {
  createAprComponentImpl,
  ONE_YEAR_IN_SECONDS,
} from "../behavior/AbstractJarBehavior";

export const STELLA_FARMS = "0x54A8fB8c634dED694D270b78Cb931cA6bF241E21";

export const stellaPoolIds: PoolId = {
  "0x7F5Ac0FC127bcf1eAf54E3cd01b00300a0861a62": 0,
  "0x8BC3CceeF43392B315dDD92ba30b435F79b66b9e": 2,
  "0x5Ced2f8DD70dc25cbA10ad18c7543Ad9ad5AEeDD": 3,
  "0xAc2657ba28768FE5F09052f07A9B7ea867A4608f": 4,
  "0x555B74dAFC4Ef3A5A1640041e3244460Dc7610d1": 5,
  "0x81e11a9374033d11Cc7e7485A7192AE37D0795D6": 6,
  "0x49a1cC58dCf28D0139dAEa9c18A3ca23108E78B3": 7,
  "0x367c36dAE9ba198A4FEe295c22bC98cB72f77Fe1": 8
};

export async function calculateStellaFarmsAPY(
  jar: JarDefinition,
  model: PickleModel,
): Promise<AssetAprComponent> {
  const multicallProvider = model.multicallProviderFor(jar.chain);
  await multicallProvider.init();

  const pricePerToken = await model.priceOf(jar.depositToken.addr);

  const poolId = stellaPoolIds[jar.depositToken.addr];
  const multicallStellaFarms = new MulticallContract(
    STELLA_FARMS,
    stellaChefAbi,
  );
  const lpToken = new MulticallContract(jar.depositToken.addr, erc20Abi);

  const [stellaPerSecBn, totalAllocPointBN, poolInfo, totalSupplyBN] =
    await multicallProvider.all([
      multicallStellaFarms.stellaPerSecond(),
      multicallStellaFarms.totalAllocPoint(),
      multicallStellaFarms.poolInfo(poolId),
      lpToken.balanceOf(STELLA_FARMS),
    ]);

  const rewardsPerYear =
    (parseFloat(formatEther(stellaPerSecBn)) *
      poolInfo.allocPoint.toNumber() *
      ONE_YEAR_IN_SECONDS) /
    totalAllocPointBN.toNumber();

  const totalSupply = parseFloat(formatEther(totalSupplyBN));
  const stellaRewardedPerYear =
    (await model.priceOf("stella")) * rewardsPerYear;
  const totalValueStaked = totalSupply * pricePerToken;
  const stellaAPY = stellaRewardedPerYear / totalValueStaked;

  return createAprComponentImpl("stella", stellaAPY * 100, true, 0.9);
}

const STELLA_CACHE_KEY = "stella.pair.data.cache.key";

const STELLA_QUERY_KEYS: string[] = [
  "pairAddress",
  "date",
  "reserveUSD",
  "dailyVolumeUSD",
  "reserve0",
  "reserve1",
  "token0{id}",
  "token1{id}",
  "totalSupply",
];

export class StellaswapPairManager extends GenericSwapUtility {
  constructor() {
    super(
      STELLA_CACHE_KEY,
      "pairAddress",
      STELLA_QUERY_KEYS,
      AssetProtocol.STELLASWAP,
      ChainNetwork.Moonbeam,
      0.002,
    );
  }
  pairAddressFromDayData(dayData: any): string {
    return dayData.pairAddress;
  }

  toExtendedPairData(pair: any): IExtendedPairData {
    return {
      pairAddress: pair.pairAddress,
      reserveUSD: pair.reserveUSD,
      dailyVolumeUSD: pair.dailyVolumeUSD,
      reserve0: pair.reserve0,
      reserve1: pair.reserve1,
      token0Id: pair.token0.id,
      token1Id: pair.token1.id,
      totalSupply: pair.totalSupply,
      pricePerToken: pair.reserveUSD / pair.totalSupply,
    };
  }
}