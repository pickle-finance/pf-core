import { AssetProtocol, JarDefinition } from "../model/PickleModelJson";
import erc20Abi from "../Contracts/ABIs/erc20.json";
import solarFarmsAbi from "../Contracts/ABIs/solar-farms.json";
import { PickleModel } from "../model/PickleModel";
import { Contract as MulticallContract } from "ethers-multicall";
import { Chains } from "../chain/Chains";
import { formatEther } from "ethers/lib/utils";
import { PoolId } from "./ProtocolUtil";

export const SOLAR_FARMS = "0xf03b75831397D4695a6b9dDdEEA0E578faa30907";
export const solarPoolIds: PoolId = {
  "0x7eDA899b3522683636746a2f3a7814e6fFca75e1": 0,
  "0xFE1b71BDAEE495dCA331D28F5779E87bd32FbE53": 8
};

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
      0.9 *
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

import { GenericSwapUtility, IExtendedPairData } from "./GenericSwapUtil";

const SOLARSWAP_PAIR_CACHE_KEY = "solarswap.pair.data.cache.key";

const SOLARSWAP_QUERY_KEYS: string[] = [
  "pairAddress",
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
      0.005,
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
