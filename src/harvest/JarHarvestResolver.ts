import { JarDefinition, jars} from '../model/PickleModel';
import { PriceCache } from '../price/PriceCache';
import { ExternalTokenModelSingleton } from '../price/ExternalTokenModel';
import { Chain } from '../chain/ChainModel';
import { ethers } from 'ethers';
import jarsAbi from "../Contracts/ABIs/jar.json";
import strategyAbi from "../Contracts/ABIs/strategy.json";
import { DepositTokenPriceResolver } from '../price/DepositTokenPriceResolver';

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
    async getJarHarvestData(definition: JarDefinition, priceCache: PriceCache) : Promise<JarHarvestData> {
        const strategy = new ethers.Contract(definition.jarDetails.strategyAddr, this.getStrategyAbi(), ethers.getDefaultProvider("homestead"));
        const jar = new ethers.Contract(definition.contract, jarsAbi, ethers.getDefaultProvider("homestead"));
        console.log("Before");
        const b = await strategy.balanceOf();
        console.log("part2");
        const a = await jar.available();
        console.log("After " + a + " " + b);
        const [available, balance1 ] = await Promise.all([
            jar.available(),
            strategy.balanceOf(),
            new DepositTokenPriceResolver(jars).getOrResolve([definition.depositToken], priceCache) // Really? Shouldn't be necessary
          ]);
        const balance = balance1.add(available);
        const stats : JarHarvestStats = await this.getJarHarvestStats(jar, definition.depositToken, strategy, balance, available, priceCache);
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
        pricesUSD: PriceCache): Promise<JarHarvestStats>;
  }
  export interface JarHarvestResolver {
      getJarHarvestData(definition: JarDefinition, priceCache: PriceCache, rewardToken?: string) : Promise<JarHarvestData>;
  }

