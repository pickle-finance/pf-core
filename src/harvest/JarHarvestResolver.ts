import { PriceCache } from '../price/PriceCache';
import { ExternalTokenModelSingleton } from '../price/ExternalTokenModel';
import { Chain } from '../chain/ChainModel';
import { ethers, Signer } from 'ethers';
import jarsAbi from "../Contracts/ABIs/jar.json";
import strategyAbi from "../Contracts/ABIs/strategy.json";
import { Provider } from '@ethersproject/providers';
import { JarDefinition } from '../model/PickleModelJson';

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

  export abstract class AbstractJarHarvestResolver implements JarHarvestResolver {
    async getJarHarvestData(definition: JarDefinition, priceCache: PriceCache, resolver: Signer | Provider) : Promise<JarHarvestData> {
        const strategy = new ethers.Contract(definition.jarDetails.strategyAddr, this.getStrategyAbi(), resolver);
        const jar = new ethers.Contract(definition.contract, jarsAbi, resolver);
        const [available, balance1 ] = await Promise.all([
            jar.available(),
            strategy.balanceOf()
          ]);
          const balance = balance1.add(available);
          let stats : JarHarvestStats;
          try {
              stats = await this.getJarHarvestStats(jar, definition.depositToken, strategy, balance, available, priceCache, resolver);
              return {
                name: definition.id,
                jarAddr: definition.contract,
                strategyName: definition.jarDetails.strategyName,
                strategyAddr: definition.jarDetails.strategyAddr,
                stats: stats
                };
              } catch( e ) {
              console.log("Error for part 6: " + definition.id + " " + e);
          }
          console.log("Part6");
          return {
            name: definition.id,
            jarAddr: definition.contract,
            strategyName: definition.jarDetails.strategyName,
            strategyAddr: definition.jarDetails.strategyAddr,
            stats: stats
        };
    }
    getTokenContract(name: string) : string {
        return ExternalTokenModelSingleton.getToken(name, Chain.Ethereum)?.contractAddr;
    }
    
    getTokenChainContract(name: string, chain: Chain) : string {
        return ExternalTokenModelSingleton.getToken(name, chain)?.contractAddr;
    }
    getTokenPrice(cache: PriceCache, id: string) : number {
        return cache.get(id);
    }
    findTokenContract(id: string, chain: Chain) {
          return ExternalTokenModelSingleton.getToken(id,chain)?.contractAddr;
    }
    getStrategyAbi() : any {
          return strategyAbi;
    }
    abstract getJarHarvestStats(  
        jar: ethers.Contract,
        depositToken: string,
        strategy: ethers.Contract,
        balance: ethers.BigNumber,
        available: ethers.BigNumber,
        pricesUSD: PriceCache,
        resolver: Signer | Provider): Promise<JarHarvestStats>;
  }
  export interface JarHarvestResolver {
      getJarHarvestData(definition: JarDefinition, priceCache: PriceCache, resolver: Signer | Provider) : Promise<JarHarvestData>;
  }

