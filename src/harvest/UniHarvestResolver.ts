import { BigNumber } from "@ethersproject/bignumber";
import { Contract } from "@ethersproject/contracts";
import { ethers } from "ethers";
import { PriceCache } from "../price/PriceCache";
import { AbstractJarHarvestResolver, JarHarvestStats } from "./JarHarvestResolver";
import uniswapV2PairAbi from '../Contracts/ABIs/uniswapv2-pair.json';
import stakingRewardsAbi from '../Contracts/ABIs/staking-rewards.json';

export class UniHarvestResolver extends AbstractJarHarvestResolver {
    async getJarHarvestStats(_jar: Contract, depositToken: string, strategy: Contract, balance: BigNumber, 
        available: BigNumber, pricesUSD: PriceCache): Promise<JarHarvestStats> {
            const uniPair = depositToken;
            // Calculate value in terms of ETH
            const UniPair = new ethers.Contract(uniPair, uniswapV2PairAbi);
            const [totalUNI, token0, token1] = await Promise.all([
              UniPair.totalSupply(),
              UniPair.token0(),
              UniPair.token1()
            ]);
          
            // Its always a pair of ETH <> OtherToken
            const WEth = new ethers.Contract(this.getTokenContract("weth"), uniswapV2PairAbi);
          
            const otherToken =
              token0.toLowerCase() === this.getTokenContract("weth").toLowerCase() ? token1 : token0;
            const OtherToken = new ethers.Contract(otherToken, uniswapV2PairAbi);
          
            const [
              wethInPool,
              otherTokenInPool,
              otherTokenDec,
              rewards
            ] = await Promise.all([
              WEth.balanceOf(uniPair),
              OtherToken.balanceOf(uniPair),
              OtherToken.decimals(),
              strategy.rewards()
            ]);
          
            let otherTokenPrice = 1;
          
            if (otherToken.toLowerCase() === this.getTokenContract("wbtc")) {
              otherTokenPrice = this.getTokenPrice(pricesUSD, "wbtc");
            }
          
            const dec18 = ethers.utils.parseEther("1");
          
            const otherTokenPerUni = otherTokenInPool.mul(dec18).div(totalUNI);
            const wethPerUni = wethInPool.mul(dec18).div(totalUNI);
          
            const otherTokenBal = parseFloat(
              ethers.utils.formatUnits(
                otherTokenPerUni.mul(balance).div(dec18),
                otherTokenDec
              )
            );
            const wethBal = parseFloat(
              ethers.utils.formatEther(wethPerUni.mul(balance).div(dec18))
            );
            const balanceUSD = otherTokenBal * otherTokenPrice + wethBal * this.getTokenPrice(pricesUSD, "weth");
          
            const otherTokenAvai = parseFloat(
              ethers.utils.formatUnits(
                otherTokenPerUni.mul(available).div(dec18),
                otherTokenDec
              )
            );
            const wethAvai = parseFloat(
              ethers.utils.formatEther(wethPerUni.mul(available).div(dec18))
            );
            const earnableUSD =
              otherTokenAvai * otherTokenPrice + wethAvai * this.getTokenPrice(pricesUSD, "weth");
          
            const StakingRewards = new ethers.Contract(rewards, stakingRewardsAbi );
          
            // In UNI
            const harvestable = await StakingRewards.earned(strategy.address);
          
            const harvestableUSD =
              parseFloat(ethers.utils.formatEther(harvestable)) * this.getTokenPrice(pricesUSD, "uni");
          
            return {
              balanceUSD,
              earnableUSD,
              harvestableUSD
            };
    }
}
