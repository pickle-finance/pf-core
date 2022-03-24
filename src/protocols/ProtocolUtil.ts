import { ChainNetwork } from "..";
import { PickleAsset, AssetProtocol } from "../model/PickleModelJson";
import { ComethPairManager } from "./ComethUtil";
import { GenericSwapUtility } from "./GenericSwapUtil";
import { QuickswapPairManager } from "./QuickswapUtil";
import {
  SushiEthPairManager,
  SushiPolyPairManager,
  SushiArbPairManager,
} from "./SushiSwapUtil";
import { UniPairManager } from "./UniswapUtil";

export interface PoolId {
  [key: string]: number;
}

export interface PoolInfo {
  [key: string]: SinglePoolInfo;
}
export interface SinglePoolInfo {
  poolId: number;
  tokenName: string;
  tokenPriceLookup: string;
  rewardName: string;
  rewardPriceLookup: string;
  rewarder?: string;
  extraReward?: string;
  extraRewardPriceLookup?: string;
}

export function getSwapUtilityForAsset(
  asset: PickleAsset,
): GenericSwapUtility | undefined {
  const chain: ChainNetwork = asset.chain;
  if (
    asset.protocol === AssetProtocol.SUSHISWAP &&
    chain === ChainNetwork.Ethereum
  )
    return new SushiEthPairManager();
  if (
    asset.protocol === AssetProtocol.SUSHISWAP &&
    chain === ChainNetwork.Polygon
  )
    return new SushiPolyPairManager();
  if (
    asset.protocol === AssetProtocol.SUSHISWAP &&
    chain === ChainNetwork.Arbitrum
  )
    return new SushiArbPairManager();
  if (asset.protocol === AssetProtocol.UNISWAP) return new UniPairManager();
  if (asset.protocol === AssetProtocol.COMETHSWAP)
    return new ComethPairManager();
  if (asset.protocol === AssetProtocol.QUICKSWAP)
    return new QuickswapPairManager();
  // ADD_PROTOCOL
  return undefined;
}
