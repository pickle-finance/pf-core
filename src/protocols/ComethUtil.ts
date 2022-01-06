import { ChainNetwork } from "..";
import { AssetProtocol } from "../model/PickleModelJson";
import { GenericSwapUtility, IExtendedPairData } from "./GenericSwapUtil";

const COMETH_PAIR_DATA_CACHE_KEY = "comethswap.pair.data.cache.key";
const COMETH_PAIR_GRAPH_FIELDS: string[] = [
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
export class ComethPairManager extends GenericSwapUtility {
  constructor() {
    super(
      COMETH_PAIR_DATA_CACHE_KEY,
      "pairAddress",
      COMETH_PAIR_GRAPH_FIELDS,
      AssetProtocol.COMETHSWAP,
      ChainNetwork.Polygon,
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
