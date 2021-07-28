import { Contract, ethers } from 'ethers';
import { PriceCache } from '../price/PriceCache';
import {AbstractJarHarvestResolver, ActiveJarHarvestStats, JarHarvestStats } from './JarHarvestResolver';
import erc20Abi from '../Contracts/ABIs/erc20.json';
import { formatEther } from "ethers/lib/utils";

export class CompoundDaiHarvestResolver extends AbstractJarHarvestResolver {
  async getJarHarvestStats(_jar: Contract, _depositToken: string, strategy: 
    Contract, balance: ethers.BigNumber, available: ethers.BigNumber, pricesUSD: 
    PriceCache): Promise<JarHarvestStats|ActiveJarHarvestStats> {
    const underlyingUSDPerToken = 1;

    const balanceUSD =
      parseFloat(ethers.utils.formatEther(balance)) * underlyingUSDPerToken;
    const earnableUSD =
      parseFloat(ethers.utils.formatEther(available)) * underlyingUSDPerToken;
  
    // Get Comp accured
    const harvestableRewardsComp = await strategy.callStatic.getCompAccrued();
  
    const COMP = new ethers.Contract(this.getTokenContract("comp"), erc20Abi, strategy.provider);
    const compBalance = await COMP.balanceOf(strategy.address);
  
    const compPrice = this.getTokenPrice(pricesUSD, "comp");
    const compBalanceUSD =
      parseFloat(ethers.utils.formatEther(compBalance)) * compPrice;
  
    const harvestableUSD =
      parseFloat(ethers.utils.formatEther(harvestableRewardsComp)) *
          compPrice + compBalanceUSD;
  
    // Get stats
    const [
      currentColFactor,
      currentLeverage,
      marketColFactor,
      suppliedUSD,
      borrowedUSD
    ] = (
      await Promise.all([
        strategy.callStatic.getColFactor().catch(() => ethers.constants.Zero),
        strategy.callStatic
          .getCurrentLeverage()
          .catch(() => ethers.constants.Zero),
        strategy.getMarketColFactor().catch(() => ethers.constants.Zero),
        strategy.callStatic.getSupplied().catch(() => ethers.constants.Zero),
        strategy.callStatic.getBorrowed().catch(() => ethers.constants.Zero)
      ])
    ).map(x => parseFloat(formatEther(x)));
  
    return {
      currentLeverage,
      currentColFactor,
      marketColFactor,
      suppliedUSD,
      borrowedUSD,
      balanceUSD,
      earnableUSD,
      harvestableUSD
    };
  
  }
}