import { ChainNetwork } from "../chain/Chains";
import { AssetProtocol } from "../model/PickleModelJson";
import { GenericSwapUtility, IExtendedPairData } from "./GenericSwapUtil";


const SPIRIT_CACHE_KEY = "spirit.pair.data.cache.key";

const SPIRIT_QUERY_KEYS: string[] = [
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

export class SpiritPairManager extends GenericSwapUtility {
  constructor() {
    super(
      SPIRIT_CACHE_KEY,
      "pairAddress",
      SPIRIT_QUERY_KEYS,
      AssetProtocol.SPIRITSWAP,
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