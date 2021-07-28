import { Contract, ethers } from 'ethers';
import { PriceCache } from '../price/PriceCache';
import {AbstractJarHarvestResolver, JarHarvestStats } from './JarHarvestResolver';
import erc20Abi from '../Contracts/ABIs/erc20.json';

export class SaddleD4HarvestResolver extends AbstractJarHarvestResolver {
  async getJarHarvestStats(_jar: Contract, _depositToken: string, strategy: Contract, 
    _balance: ethers.BigNumber, _available: ethers.BigNumber, pricesUSD: PriceCache): Promise<JarHarvestStats> {
    
    const strategyAddress : string = strategy.address;
    
    const alcxContract = new ethers.Contract(this.getTokenContract("alcx"), erc20Abi);
    const lqtyContract = new ethers.Contract(this.getTokenContract("lqty"), erc20Abi);
    const tribeContract = new ethers.Contract(this.getTokenContract("tribe"), erc20Abi);
    const fraxContract = new ethers.Contract(this.getTokenContract("frax"), erc20Abi);

    const [
      alcxInPool,
      lqtyInPool,
      tribeInPool,
      fraxInPool,
    ] = await Promise.all([
      alcxContract.balanceOf(strategyAddress),
      lqtyContract.balanceOf(strategyAddress),
      tribeContract.balanceOf(strategyAddress),
      fraxContract.balanceOf(strategyAddress),
    ]);

    const alcxPrice = pricesUSD.get("alcx");
    const lqtyPrice = pricesUSD.get("lqty");
    const tribePrice = pricesUSD.get("tribe");
    const fraxPrice = pricesUSD.get("frax");
    
    const harvestable = (alcxPrice * alcxInPool) + 
                        (lqtyPrice * lqtyInPool) + 
                        (tribePrice * tribeInPool) +
                        (fraxPrice * fraxInPool);
    
    
    return {
      balanceUSD: 0,
      earnableUSD: 0,
      harvestableUSD: harvestable
    };
  }
}