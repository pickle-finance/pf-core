import { BigNumber } from "@ethersproject/bignumber";
import { Contract } from "@ethersproject/contracts";
import { ethers } from "ethers";
import { PriceCache } from "../price/PriceCache";
import { AbstractJarHarvestResolver, JarHarvestStats } from "./JarHarvestResolver";
import uniswapV2PairAbi from '../Contracts/ABIs/uniswapv2-pair.json';
import stakingRewardsAbi from '../Contracts/ABIs/staking-rewards.json';

export class MithHarvestResolver extends AbstractJarHarvestResolver {
    async getJarHarvestStats(_jar: Contract, depositToken: string, strategy: Contract, balance: BigNumber, 
        available: BigNumber, pricesUSD: PriceCache): Promise<JarHarvestStats> {
  // Uniswap
  const uniPair = depositToken;
  // Calculate value in terms of ETH
  const UniPair = new ethers.Contract(uniPair, uniswapV2PairAbi, strategy.provider);
  const [totalUNI, token0, token1] = await Promise.all([
    UniPair.totalSupply(),
    UniPair.token0(),
    UniPair.token1()
  ]);

  // Its always a pair of DAI <> OtherToken
  const Usdt = new ethers.Contract(this.getTokenContract("usdt"), uniswapV2PairAbi, strategy.provider);

  const otherToken =
    token0.toLowerCase() === this.getTokenContract("weth").toLowerCase() ? token1 : token0;
  const OtherToken = new ethers.Contract(otherToken, uniswapV2PairAbi, strategy.provider);

  const [
    usdtInPool,
    otherTokenInPool,
    otherTokenDec,
    rewards
  ] = await Promise.all([
    Usdt.balanceOf(uniPair),
    OtherToken.balanceOf(uniPair),
    OtherToken.decimals(),
    strategy.rewards()
  ]);

  const otherTokenPrice =
    otherToken.toLowerCase() === this.getTokenContract("mic") ? this.getTokenPrice(pricesUSD, "mic") : this.getTokenPrice(pricesUSD, "mis");

  const dec18 = ethers.utils.parseEther("1");

  const otherTokenPerUni = otherTokenInPool.mul(dec18).div(totalUNI);
  const usdtPerUni = usdtInPool.mul(dec18).div(totalUNI);

  const otherTokenBal = parseFloat(
    ethers.utils.formatUnits(
      otherTokenPerUni.mul(balance).div(dec18),
      otherTokenDec
    )
  );
  const usdtBal = parseFloat(
    ethers.utils.formatUnits(usdtPerUni.mul(balance).div(dec18), 6)
  );
  const balanceUSD = otherTokenBal * otherTokenPrice + usdtBal * 1;

  const otherTokenAvai = parseFloat(
    ethers.utils.formatUnits(
      otherTokenPerUni.mul(available).div(dec18),
      otherTokenDec
    )
  );
  const usdtAvai = parseFloat(
    ethers.utils.formatEther(usdtPerUni.mul(available).div(dec18))
  );
  const earnableUSD = otherTokenAvai * otherTokenPrice + usdtAvai;

  const StakingRewards = new ethers.Contract(rewards, stakingRewardsAbi, strategy.provider );

  // In MIS
  const harvestable = await StakingRewards.earned(strategy.address);

  const harvestableUSD =
    parseFloat(ethers.utils.formatEther(harvestable)) * this.getTokenPrice(pricesUSD, "mis");

  return {
    balanceUSD,
    earnableUSD,
    harvestableUSD
  };
    }
}
