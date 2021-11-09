import { PickleAsset, AssetProtocol } from "../model/PickleModelJson";
import { ComethPairManager } from "./ComethUtil";
import { QuickswapPairManager } from "./QuickswapUtil";
import { SushiEthPairManager, SushiPolyPairManager, SushiArbPairManager } from "./SushiSwapUtil";
import { UniPairManager } from "./UniswapUtil";

export interface PoolId {
  [key: string]: number;
}

export interface PoolInfo {
  [key: string]: {
    poolId: number;
    tokenName: string;
    tokenPriceLookup: string;
    rewardName: string;
    rewardPriceLookup: string;
    rewarder?: string;
  };
}

// ADD_PROTOCOL
export function getSwapUtilityForProtocol(asset: PickleAsset) {
  if( asset.protocol === AssetProtocol.SUSHISWAP) 
    return new SushiEthPairManager();
  if( asset.protocol === AssetProtocol.SUSHISWAP_POLYGON) 
    return new SushiPolyPairManager();
  if( asset.protocol === AssetProtocol.SUSHISWAP_ARBITRUM) 
    return new SushiArbPairManager();
  if( asset.protocol === AssetProtocol.UNISWAP) 
    return new UniPairManager();
  if( asset.protocol === AssetProtocol.COMETHSWAP) 
    return new ComethPairManager();
  if( asset.protocol === AssetProtocol.QUICKSWAP_POLYGON) 
    return new QuickswapPairManager();

  // TODO
  if( asset.protocol === AssetProtocol.DODOSWAP) 
    return undefined;
  if( asset.protocol === AssetProtocol.CHERRYSWAP) 
    return undefined;
  if( asset.protocol === AssetProtocol.JSWAP) 
    return undefined;
}
