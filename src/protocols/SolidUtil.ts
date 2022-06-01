import { ChainNetwork } from "../chain/Chains";
import { PickleModel } from "../model/PickleModel";
import { AssetProtocol } from "../model/PickleModelJson";
import { GenericSwapUtility, IExtendedPairData } from "./GenericSwapUtil";

const SOLIDLY_CACHE_KEY = "solidly.pair.data.cache.key";

const SOLIDLY_QUERY_KEYS: string[] = [
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

export class SolidlyPairManager extends GenericSwapUtility {
  constructor() {
    super(
      SOLIDLY_CACHE_KEY,
      "pairAddress",
      SOLIDLY_QUERY_KEYS,
      AssetProtocol.SOLID,
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

  async calculateLpApr(_model: PickleModel, _pair: string): Promise<number> {
    /* 
      Swap fees for Solidly gauges do not go to LP providers.
      No point displaying LP APR
    */
    return 0;
  }
}
