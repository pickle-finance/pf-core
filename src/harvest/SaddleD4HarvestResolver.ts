import { Contract, ethers } from 'ethers';
import { PriceCache } from '../price/PriceCache';
import {AbstractJarHarvestResolver, JarHarvestStats } from './JarHarvestResolver';
import erc20Abi from '../Contracts/ABIs/erc20.json';
import { saddleStrategyAbi } from '../Contracts/ABIs/saddle-strategy.abi';
import { JarDefinition } from '../model/PickleModelJson';

export class SaddleD4HarvestResolver extends AbstractJarHarvestResolver {

  getStrategyAbi(_definition: JarDefinition) : any {
    return saddleStrategyAbi;
  }

  async getJarHarvestStats(_jar: Contract, _depositToken: string, strategy: Contract, 
    balance: ethers.BigNumber, available: ethers.BigNumber, pricesUSD: PriceCache): Promise<JarHarvestStats> {
    
    const strategyAddress : string = strategy.address;
    const alcxContract = new ethers.Contract(this.getTokenContract("alcx"), erc20Abi, strategy.provider);
    const lqtyContract = new ethers.Contract(this.getTokenContract("lqty"), erc20Abi, strategy.provider);
    const tribeContract = new ethers.Contract(this.getTokenContract("tribe"), erc20Abi, strategy.provider);
    const fraxContract = new ethers.Contract(this.getTokenContract("fxs"), erc20Abi, strategy.provider);
    const alcxPrice = pricesUSD.get("alcx");
    const lqtyPrice = pricesUSD.get("lqty");
    const tribePrice = pricesUSD.get("tribe");
    const fxsPrice = pricesUSD.get("fxs");


    const [
      alcxBal,
      lqtyBal,
      tribeBal,
      fxsBal,
      harvestableArr
    ] = await Promise.all([
      alcxContract.balanceOf(strategyAddress),
      lqtyContract.balanceOf(strategyAddress),
      tribeContract.balanceOf(strategyAddress),
      fraxContract.balanceOf(strategyAddress),
      strategy.getHarvestable()
    ]);

    
    const harvestable = harvestableArr[0]
      .add(fxsBal).mul(fxsPrice.toFixed())
      .add(harvestableArr[1].add(tribeBal).mul(tribePrice.toFixed()))
      .add(harvestableArr[2].add(alcxBal).mul(alcxPrice.toFixed()))
      .add(harvestableArr[3].add(lqtyBal).mul(lqtyPrice.toFixed()));
    
    return {
      balanceUSD: parseFloat(ethers.utils.formatEther(balance)),
      earnableUSD: parseFloat(ethers.utils.formatEther(available)),
      harvestableUSD: parseFloat(ethers.utils.formatEther(harvestable))
    };
  }
}