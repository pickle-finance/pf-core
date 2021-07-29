import { Contract, ethers } from 'ethers';
import { JAR_renCRV, JAR_steCRV, JAR_USDC } from '../model/JarsAndFarms';
import { PriceCache } from '../price/PriceCache';
import {AbstractJarHarvestResolver, JarHarvestStats } from './JarHarvestResolver';
import curveFiGaugeAbi from "../Contracts/ABIs/curve-fi-gauge.json";

export class CurveHarvestResolver extends AbstractJarHarvestResolver {
  async getJarHarvestStats(jar: Contract, _depositToken: string, strategy: Contract, balance: ethers.BigNumber, 
    available: ethers.BigNumber, pricesUSD: PriceCache): Promise<JarHarvestStats> {
    let underlyingUSDPerToken = 1;

    if( jar.address.toLowerCase() === JAR_renCRV.contract.toLowerCase()) {
          underlyingUSDPerToken = this.getTokenPrice(pricesUSD, "wbtc");
    }
  
    if ( jar.address.toLowerCase() === JAR_steCRV.contract.toLowerCase()) {
      underlyingUSDPerToken = this.getTokenPrice(pricesUSD, "eth");
    }
  
    const isUSDCJar =
      jar.address.toLowerCase() ===
      JAR_USDC.contract.toLowerCase();
  
    const balanceUSD = parseFloat(ethers.utils.formatUnits(balance, isUSDCJar ? 6 : 18)) * underlyingUSDPerToken;
    const earnableUSD = parseFloat(ethers.utils.formatUnits(available, isUSDCJar ? 6 : 18)) * underlyingUSDPerToken;
  
    // Get gauge
    const gauge = await strategy.gauge();
    const Gauge = new ethers.Contract(gauge, curveFiGaugeAbi as any, strategy.provider);
  
    const harvestableRewardsCrv = await Gauge.callStatic.claimable_tokens(
      strategy.address
    );
  
    let harvestableUSD;
    if ( jar.address.toLowerCase() === JAR_steCRV.contract.toLowerCase()) {
      const harvestableRewardsLdo = await Gauge.callStatic.claimable_reward(
        strategy.address,
        this.getTokenContract("ldo")
      );
  
      harvestableUSD =
        parseFloat(ethers.utils.formatEther(harvestableRewardsCrv)) *
          this.getTokenPrice(pricesUSD, "crv"); +
        parseFloat(ethers.utils.formatEther(harvestableRewardsLdo)) *
          this.getTokenPrice(pricesUSD, "ldo");
    } else {
      harvestableUSD =
        parseFloat(ethers.utils.formatEther(harvestableRewardsCrv)) *
        this.getTokenPrice(pricesUSD, "crv");
    }
  
    return {
      balanceUSD,
      earnableUSD,
      harvestableUSD
    };
  }
}