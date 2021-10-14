import { BigNumber, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import {
  AssetProjectedApr,
  ExternalAssetDefinition,
  JarDefinition,
  PickleAsset,
} from "../model/PickleModelJson";
import { PickleModel } from "..";

export const ONE_YEAR_SECONDS = 360 * 24 * 60 * 60;

export interface JarHarvestStats {
  balanceUSD: number;
  earnableUSD: number;
  harvestableUSD: number;
}

export interface ActiveJarHarvestStats extends JarHarvestStats {
  suppliedUSD: number;
  borrowedUSD: number;
  marketColFactor: number;
  currentColFactor: number;
  currentLeverage: number;
}

export interface AssetBehavior<T extends PickleAsset> {
  getProjectedAprStats(
    definition: T,
    model: PickleModel,
  ): Promise<AssetProjectedApr>;

  getDepositTokenPrice(definition: T, model: PickleModel): Promise<number>;

  getAssetHarvestData(
    definition: T,
    model: PickleModel,
    balance: BigNumber,
    available: BigNumber,
    resolver: Signer | Provider,
  ): Promise<JarHarvestStats>;
}
export type JarBehavior = AssetBehavior<JarDefinition>;
export type ExternalAssetBehavior = AssetBehavior<ExternalAssetDefinition>;
