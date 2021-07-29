import { Contract, ethers } from 'ethers';
import { PriceCache } from '../price/PriceCache';
import {AbstractJarHarvestResolver, JarHarvestStats } from './JarHarvestResolver';
import erc20Abi from '../Contracts/ABIs/erc20.json';

export class SaddleD4HarvestResolver extends AbstractJarHarvestResolver {
  async getJarHarvestStats(_jar: Contract, _depositToken: string, strategy: Contract, 
    balance: ethers.BigNumber, available: ethers.BigNumber, pricesUSD: PriceCache): Promise<JarHarvestStats> {
    
    const strategyAddress : string = strategy.address;
    
    const alcxContract = new ethers.Contract(this.getTokenContract("alcx"), erc20Abi, strategy.provider);
    const lqtyContract = new ethers.Contract(this.getTokenContract("lqty"), erc20Abi, strategy.provider);
    const tribeContract = new ethers.Contract(this.getTokenContract("tribe"), erc20Abi, strategy.provider);
    const fraxContract = new ethers.Contract(this.getTokenContract("fxs"), erc20Abi, strategy.provider);

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
    const fraxPrice = pricesUSD.get("fxs");

    const total = (parseFloat(ethers.utils.formatEther(alcxInPool))*alcxPrice) +
                  (parseFloat(ethers.utils.formatEther(lqtyInPool))*lqtyPrice) +
                  (parseFloat(ethers.utils.formatEther(tribeInPool))*tribePrice) +
                  (parseFloat(ethers.utils.formatEther(fraxInPool))*fraxPrice);

    
    return {
      balanceUSD: parseFloat(ethers.utils.formatEther(balance)),
      earnableUSD: parseFloat(ethers.utils.formatEther(available)),
      harvestableUSD: total
    };
  }
}