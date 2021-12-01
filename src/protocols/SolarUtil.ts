import { AssetProtocol, JarDefinition } from "../model/PickleModelJson";
import erc20Abi from "../Contracts/ABIs/erc20.json";
import solarFarmsAbi from "../Contracts/ABIs/solar-farms.json";
import { PickleModel } from "../model/PickleModel";
import { Contract as MulticallContract } from "ethers-multicall";
import { Chains } from "../chain/Chains";
import { formatEther } from "ethers/lib/utils";
import { PoolId } from "./ProtocolUtil";
import { GenericSwapUtility, IExtendedPairData } from "./GenericSwapUtil";

export const SOLAR_FARMS = "0xf03b75831397D4695a6b9dDdEEA0E578faa30907";
export const solarPoolIds: PoolId = {
  "0x7eDA899b3522683636746a2f3a7814e6fFca75e1": 0,
  "0xf9b7495b833804e4d894fC5f7B39c10016e0a911": 3,
  "0x0acDB54E610dAbC82b8FA454b21AD425ae460DF9": 4,
  "0xe537f70a8b62204832b8ba91940b77d3f79aeb81": 6,
  "0xdb66BE1005f5Fe1d2f486E75cE3C50B52535F886": 7,
  "0xFE1b71BDAEE495dCA331D28F5779E87bd32FbE53": 8,
  "0x384704557F73fBFAE6e9297FD1E6075FC340dbe5": 9, 
  "0xA0D8DFB2CC9dFe6905eDd5B71c56BA92AD09A3dC": 10,
  "0xfb1d0D6141Fc3305C63f189E39Cc2f2F7E58f4c2": 11,
  "0x83d7a3fc841038E8c8F46e6192BBcCA8b19Ee4e7": 12,
  "0x2a44696DDc050f14429bd8a4A05c750C6582bF3b": 13,
  "0xb9a61ac826196AbC69A3C66ad77c563D6C5bdD7b": 15,
  "0x9e0d90ebB44c22303Ee3d331c0e4a19667012433": 16,
  "0x55Ee073B38BF1069D5F1Ed0AA6858062bA42F5A9": 17,
  "0x1eebed8F28A6865a76D91189FD6FC45F4F774d67": 18,
  "0x9051fB701d6D880800e397e5B5d46FdDfAdc7056": 19,
  "0x9f9a7a3f8F56AFB1a2059daE1E978165816cea44": 20,
};

export const solarPoolV2Ids: PoolId = {
  "0x0d171b55fC8d3BDDF17E376FdB2d90485f900888": 1,
}

export async function calculateSolarFarmsAPY(
  jar: JarDefinition,
  model: PickleModel,
) {
  const multicallProvider = model.multicallProviderFor(jar.chain);
  await multicallProvider.init();
  const multicallSolarFarms = new MulticallContract(SOLAR_FARMS, solarFarmsAbi);
  const lpToken = new MulticallContract(jar.depositToken.addr, erc20Abi);
  const [solarPerBlockBN, totalAllocPointBN, poolInfo, totalSupplyBN] =
    await multicallProvider.all([
      multicallSolarFarms.solarPerBlock(),
      multicallSolarFarms.totalAllocPoint(),
      multicallSolarFarms.poolInfo(solarPoolIds[jar.depositToken.addr]),
      lpToken.balanceOf(SOLAR_FARMS),
    ]);

  const totalSupply = parseFloat(formatEther(totalSupplyBN));
  const rewardsPerBlock =
    (parseFloat(formatEther(solarPerBlockBN)) *
      poolInfo.allocPoint.toNumber()) /
    totalAllocPointBN.toNumber();

  const pricePerToken = await model.priceOf(jar.depositToken.addr);

  const rewardsPerYear =
    rewardsPerBlock *
    ((360 * 24 * 60 * 60) / Chains.get(jar.chain).secondsPerBlock);
  const solarRewardedPerYear = (await model.priceOf("solar")) * rewardsPerYear;
  const totalValueStaked = totalSupply * pricePerToken;
  const solarAPY = solarRewardedPerYear / totalValueStaked;
  return { name: "solar", apr: solarAPY * 100, compoundable: true };
}

const SOLARSWAP_PAIR_CACHE_KEY = "solarswap.pair.data.cache.key";

const SOLARSWAP_QUERY_KEYS: string[] = [
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
export class SolarswapPairManager extends GenericSwapUtility {
  constructor() {
    super(
      SOLARSWAP_PAIR_CACHE_KEY,
      "pairAddress",
      SOLARSWAP_QUERY_KEYS,
      AssetProtocol.SOLARSWAP,
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
