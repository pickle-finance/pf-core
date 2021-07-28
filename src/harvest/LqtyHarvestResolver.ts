import { Contract, ethers } from 'ethers';
import { PriceCache } from '../price/PriceCache';
import {AbstractJarHarvestResolver, JarHarvestStats } from './JarHarvestResolver';
import uniswapV2PairAbi from '../Contracts/ABIs/uniswapv2-pair.json';

export class LqtyHarvestResolver extends AbstractJarHarvestResolver {
  async getJarHarvestStats(_jar: Contract, _depositToken: string, strategy: Contract, 
    balance: ethers.BigNumber, available: ethers.BigNumber, pricesUSD: PriceCache): Promise<JarHarvestStats> {
    const WEth = new ethers.Contract(this.getTokenContract("weth"), uniswapV2PairAbi, strategy.provider);
    const LqtyToken = new ethers.Contract(this.getTokenContract("lqty"), uniswapV2PairAbi, strategy.provider);
  
    const [
      harvestable,
      wethBalance,
      lqtyBalance,
    ] = await Promise.all([
      strategy.getHarvestable().catch(() => ethers.BigNumber.from(0)),
      WEth.balanceOf(strategy.address),
      LqtyToken.balanceOf(strategy.address),
    ]);
  
    const harvestableUSD =
      parseFloat(ethers.utils.formatEther(harvestable[0].add(wethBalance))) *
      this.getTokenPrice(pricesUSD, "sushi") + parseFloat(ethers.utils.formatEther(harvestable[1].add(lqtyBalance))) *
      this.getTokenPrice(pricesUSD, "cvx");
  
  
    const earnableUSD = this.getTokenPrice(pricesUSD, "lqty") * +ethers.utils.formatEther(available)
    return {
      balanceUSD: +ethers.utils.formatEther(balance) * this.getTokenPrice(pricesUSD, "lqty"),
      earnableUSD,
      harvestableUSD
    };
  }
}