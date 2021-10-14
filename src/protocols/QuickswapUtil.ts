import { AssetProtocol } from "../model/PickleModelJson";
import { GenericSwapUtility, IExtendedPairData } from "./GenericSwapUtil";

const QUICKSWAP_PAIR_CACHE_KEY = "quickswap.pair.data.cache.key";

const QUICKSWAP_QUERY_KEYS: string[] = [
  "pairAddress",
  "reserveUSD",
  "dailyVolumeUSD",
  "reserve0",
  "reserve1",
  "token0{id}",
  "token1{id}",
  "totalSupply",
];
export class QuickswapPairManager extends GenericSwapUtility {
  constructor() {
    super(
      QUICKSWAP_PAIR_CACHE_KEY,
      "pairAddress",
      QUICKSWAP_QUERY_KEYS,
      AssetProtocol.QUICKSWAP_POLYGON,
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
