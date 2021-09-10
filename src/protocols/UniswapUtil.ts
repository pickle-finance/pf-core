import { PickleModel } from "..";
import { Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { AssetProtocol, JarDefinition, PickleAsset } from "../model/PickleModelJson";
import { protocolToSubgraphUrl, readQueryFromGraph } from "../graph/TheGraph";
import { GenericSwapUtility, IExtendedPairData } from "./GenericSwapUtil";


const UNI_PAIR_DATA_CACHE_KEY = "uniswap.pair.data.cache.key";
const UNI_PAIR_GRAPH_FIELDS : string[] = [
  "pairAddress",
  "reserveUSD",
  "dailyVolumeUSD",
  "reserve0",
  "reserve1",
  "token0{id}",
  "token1{id}",
  "totalSupply",
];
export class UniPairManager extends GenericSwapUtility {
  constructor() {
    super(UNI_PAIR_DATA_CACHE_KEY, "pairAddress", UNI_PAIR_GRAPH_FIELDS, 
    AssetProtocol.UNISWAP, .003);
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
      pricePerToken: pair.reserveUSD / pair.totalSupply
    }
  }
}


export async function calculateUniswapLpApr(model: PickleModel, addr: string): Promise<number> {
    return new UniPairManager().calculateLpApr(model, addr);
  }
  