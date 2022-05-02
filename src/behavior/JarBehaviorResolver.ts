import { BigNumber, Signer } from "ethers";
import {
  Provider,
  TransactionResponse,
} from "@ethersproject/abstract-provider";
import {
  AssetProjectedApr,
  BrineryDefinition,
  ExternalAssetDefinition,
  HistoricalYield,
  JarDefinition,
  PickleAsset,
} from "../model/PickleModelJson";
import { PickleModel } from "..";

export const ONE_YEAR_SECONDS = 360 * 24 * 60 * 60;

export interface JarHarvestStats {
  balanceUSD: number;
  earnableUSD: number;
  harvestableUSD: number;
  multiplier?: number;
}

export interface ActiveJarHarvestStats extends JarHarvestStats {
  suppliedUSD: number;
  borrowedUSD: number;
  marketColFactor: number;
  currentColFactor: number;
  currentLeverage: number;
}

export interface AssetBehavior<T extends PickleAsset> {
  getProtocolApy(
    _definition: T,
    _model: PickleModel,
  ): Promise<HistoricalYield>;

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
  ): Promise<JarHarvestStats | undefined>;

  getCustomHarvester(
    definition: T,
    model: PickleModel,
    signer: Signer,
    properties: any,
  ): ICustomHarvester | undefined;
}

export type JarBehavior = AssetBehavior<JarDefinition>;
export type ExternalAssetBehavior = AssetBehavior<ExternalAssetDefinition>;
export type BrineryBehavior = AssetBehavior<BrineryDefinition>;

// Duplicate of interface in tsuke.
export interface PfCoreGasFlags {
  gasPrice?: number;
  gasLimit?: BigNumber;
  maxFeePerGas?: number;
  maxPriorityFeePerGas?: BigNumber;
}

export interface ICustomHarvester {
  estimateGasToRun(): Promise<BigNumber | undefined>;
  run(flags: PfCoreGasFlags): Promise<TransactionResponse | undefined>;
}
