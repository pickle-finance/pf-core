import { PriceCache, RESOLVER_DEPOSIT_TOKEN } from '../price/PriceCache';
import { ExternalTokenModelSingleton } from '../price/ExternalTokenModel';
import { BigNumber, ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import strategyAbi from "../Contracts/ABIs/strategy.json";
import strategyDual from "../Contracts/ABIs/strategy-dual.json";
import { JarDefinition } from '../model/PickleModelJson';
import { isCvxJar, isLqtyJar } from './JarHarvestResolverDiscovery';
import { ChainNetwork } from '../chain/Chains';

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
    async getJarHarvestData(definition: JarDefinition, priceCache: PriceCache, 
        balance: BigNumber, available: BigNumber, resolver: Signer | Provider) : Promise<JarHarvestData> {

        const balanceWithAvailable = balance.add(available);
        const depositTokenDecimals = (definition.depositToken.decimals ? definition.depositToken.decimals : 18);
        const depositTokenPrice : number = await priceCache.getPrice(definition.depositToken.addr, RESOLVER_DEPOSIT_TOKEN);
        const balanceUSD : number = parseFloat(ethers.utils.formatUnits(balanceWithAvailable, depositTokenDecimals)) * depositTokenPrice;
        const availUSD : number = parseFloat(ethers.utils.formatUnits(available, depositTokenDecimals)) * depositTokenPrice;

        const harvestableUSD : number = await this.getHarvestableUSD(definition, priceCache, resolver);
        return {
            name: definition.id,
            jarAddr: definition.contract,
            strategyName: definition.details.strategyName,
            strategyAddr: definition.details.strategyAddr,
            stats: {
               balanceUSD: balanceUSD,
               earnableUSD: availUSD,
               harvestableUSD: harvestableUSD 
            }
        };
    }
    addr(name: string) : string {
        const t1 = ExternalTokenModelSingleton.getToken(name, ChainNetwork.Ethereum)?.contractAddr;
        if( t1 !== undefined )
            return t1;
        return ExternalTokenModelSingleton.getToken(name, ChainNetwork.Polygon)?.contractAddr;
    }
    address(id: string, chain: ChainNetwork) {
        return ExternalTokenModelSingleton.getToken(id,chain)?.contractAddr;
    }
    priceOf(cache: PriceCache, id: string) : number {
        return cache.get(id);
    }
    getStrategyAbi(definition: JarDefinition) : any {
        if (isCvxJar(definition.contract) || isLqtyJar(definition.contract)) 
            return strategyDual;
        return strategyAbi;
    }

    abstract getHarvestableUSD( jar: JarDefinition, prices: PriceCache, resolver: Signer | Provider): Promise<number>;
  }
  export interface JarHarvestResolver {
      getJarHarvestData(definition: JarDefinition, priceCache: PriceCache, 
        balance: BigNumber, available: BigNumber,
        resolver: Signer | Provider) : Promise<JarHarvestData>;
  }

