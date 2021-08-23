import { PriceCache } from '../price/PriceCache';
import { BigNumber, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { AssetProjectedApr, JarDefinition } from '../model/PickleModelJson';
import { PickleModel } from '..';

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

  export interface JarHarvestData {
      name: string,
      jarAddr: string,
      strategyName: string,
      strategyAddr: string,
      stats: JarHarvestStats | ActiveJarHarvestStats
  }
  export const ONE_YEAR_SECONDS = 360*24*60*60;
  export interface JarBehavior {
    getProjectedAprStats(definition: JarDefinition, model: PickleModel) : Promise<AssetProjectedApr>;

    getDepositTokenPrice(definition: JarDefinition, model: PickleModel): Promise<number>;
    
    getJarHarvestData(definition: JarDefinition, model: PickleModel, 
      balance: BigNumber, available: BigNumber,
      resolver: Signer | Provider) : Promise<JarHarvestData>;
  }


