import {
  AssetAprComponent,
  AssetProtocol,
  JarDefinition,
} from "../model/PickleModelJson";
import erc20Abi from "../Contracts/ABIs/erc20.json";
import booChefAbi from "../Contracts/ABIs/boo-farm.json";
import { PickleModel } from "../model/PickleModel";
import { Contract as MulticallContract } from "ethers-multicall";
import { ChainNetwork, Chains } from "../chain/Chains";
import { formatEther } from "ethers/lib/utils";
import { PoolId } from "./ProtocolUtil";
import { GenericSwapUtility, IExtendedPairData } from "./GenericSwapUtil";
import {
  createAprComponentImpl,
  ONE_YEAR_IN_SECONDS,
} from "../behavior/AbstractJarBehavior";


export const BOO_FARMS = "0x2b2929E785374c651a81A63878Ab22742656DcDd";

export const booPoolIds: PoolId = {
  "0xEc7178F4C41f346b2721907F5cF7628E388A7a58": 0,
  "0x5965E53aa80a0bcF1CD6dbDd72e6A9b2AA047410": 1,
  "0x2b4C76d0dc16BE1C31D4C1DC53bF9B45987Fc75c": 2,
  "0xe120ffBDA0d14f3Bb6d6053E90E63c572A66a428": 3,
  "0xFdb9Ab8B9513Ad9E419Cf19530feE49d412C3Ee3": 4,
  "0xf0702249F4D3A25cD3DED7859a165693685Ab577": 5,
  "0x89d9bC2F2d091CfBFc31e333D6Dc555dDBc2fd29": 6,
  "0xf84E313B36E86315af7a06ff26C8b20e9EB443C3": 10,
  "0xB471Ac6eF617e952b84C6a9fF5de65A9da96C93B": 14,
  "0x623EE4a7F290d11C11315994dB70FB148b13021d": 17,
  "0x956DE13EA0FA5b577E4097Be837BF4aC80005820": 19,
  "0x5c021D9cfaD40aaFC57786b409A9ce571de375b4": 22,
  "0x6f86e65b255c9111109d2D2325ca2dFc82456efc": 24,
  "0x0845c0bFe75691B1e21b24351aAc581a7FB6b7Df": 26,
  "0xe8b72a866b8D59F5c13D2ADEF96E40A3EF5b3152": 34,
  "0xEc454EdA10accdD66209C57aF8C12924556F3aBD": 35,
  "0x78f82c16992932EfDd18d93f889141CcF326DBc2": 38,
  "0x5DF809e410d9CC577f0d01b4E623C567C7aD56c1": 52,
  "0x7051C6F0C1F1437498505521a3bD949654923fE1": 54,
};

export async function calculateSpookyFarmsAPY(
  jar: JarDefinition,
  model: PickleModel,
): Promise<AssetAprComponent> {
  const pricePerToken = await model.priceOf(jar.depositToken.addr);
  const multicallProvider = model.multicallProviderFor(jar.chain);
  await multicallProvider.init();
  const poolId = booPoolIds[jar.depositToken.addr];

  const multicallBooFarms = new MulticallContract(BOO_FARMS, booChefAbi);
  const lpToken = new MulticallContract(jar.depositToken.addr, erc20Abi);

  const [booPerSecondBN, totalAllocPointBN, poolInfo, totalSupplyBN] =
    await multicallProvider.all([
      multicallBooFarms.booPerSecond(),
      multicallBooFarms.totalAllocPoint(),
      multicallBooFarms.poolInfo(poolId),
      lpToken.balanceOf(BOO_FARMS),
    ]);

  const rewardsPerYear =
    (parseFloat(formatEther(booPerSecondBN)) *
      poolInfo.allocPoint.toNumber() *
      ONE_YEAR_IN_SECONDS) /
    totalAllocPointBN.toNumber();

  const totalSupply = parseFloat(formatEther(totalSupplyBN));
  const booRewardedPerYear = (await model.priceOf("boo")) * rewardsPerYear;
  const totalValueStaked = totalSupply * pricePerToken;
  const booAPY = booRewardedPerYear / totalValueStaked;

  return createAprComponentImpl(
    "boo",
    booAPY * 100,
    true,
    1 - Chains.get(jar.chain).defaultPerformanceFee,
  );
}

const SPOOKY_CACHE_KEY = "spooky.pair.data.cache.key";

const SPOOKY_QUERY_KEYS: string[] = [
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

export class SpookyPairManager extends GenericSwapUtility {
  constructor() {
    super(
      SPOOKY_CACHE_KEY,
      "pairAddress",
      SPOOKY_QUERY_KEYS,
      AssetProtocol.SPOOKYSWAP,
      ChainNetwork.Fantom,
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
