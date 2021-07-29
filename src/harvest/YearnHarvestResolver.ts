import { Contract, ethers } from 'ethers';
import { JAR_USDC } from '../model/JarsAndFarms';
import { PriceCache } from '../price/PriceCache';
import {AbstractJarHarvestResolver, JarHarvestStats } from './JarHarvestResolver';

export class YearnHarvestResolver extends AbstractJarHarvestResolver {
  async getJarHarvestStats(jar: Contract, _depositToken: string, _strategy: Contract, balance: ethers.BigNumber, 
    available: ethers.BigNumber, _pricesUSD: PriceCache): Promise<JarHarvestStats> {
    const underlyingUSDPerToken = 1;
    const isUSDCJar = jar.address.toLowerCase() === JAR_USDC.contract.toLowerCase();
    const balanceUSD = parseFloat(ethers.utils.formatUnits(balance, isUSDCJar ? 6 : 18)) * underlyingUSDPerToken;
    const earnableUSD = parseFloat(ethers.utils.formatUnits(available, isUSDCJar ? 6 : 18)) * underlyingUSDPerToken;
  
      return {
        balanceUSD,
        earnableUSD,
        harvestableUSD: 0
      };
  }
}