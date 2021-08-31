import { BigNumber, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { AssetProjectedApr, JarDefinition } from '../model/PickleModelJson';
import { PickleModel } from '..';

export const ONE_YEAR_SECONDS = 360*24*60*60;
export const AVERAGE_BLOCK_TIME = 13.22;
export const AVERAGE_BLOCK_TIME_POLYGON = 2;


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

  export interface AssetBehavior {
    getProjectedAprStats(definition: JarDefinition, model: PickleModel) : Promise<AssetProjectedApr>;

    getDepositTokenPrice(definition: JarDefinition, model: PickleModel): Promise<number>;
    
    getAssetHarvestData(definition: JarDefinition, model: PickleModel, 
      balance: BigNumber, available: BigNumber,
      resolver: Signer | Provider) : Promise<JarHarvestStats>;
  }
  export interface JarBehavior extends AssetBehavior {
  }


