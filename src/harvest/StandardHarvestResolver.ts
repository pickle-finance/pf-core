import { Contract, ethers } from 'ethers';
import { PriceCache } from '../price/PriceCache';
import {AbstractJarHarvestResolver, JarHarvestStats } from './JarHarvestResolver';
import uniswapV2PairAbi from '../Contracts/ABIs/uniswapv2-pair.json';

export class StandardHarvestResolver extends AbstractJarHarvestResolver {
  rewardToken : string;
  constructor(rewardToken: string) {
    super();
    this.rewardToken = rewardToken;
  }

  async getJarHarvestStats(_jar: Contract, depositToken: string, strategy: Contract, 
    balance: ethers.BigNumber, available: ethers.BigNumber, pricesUSD: PriceCache): Promise<JarHarvestStats> {
  // Uniswap
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

  const priceToken = this.getTokenPrice( pricesUSD, token0) ? token0 : token1;
  const priceTokenContract = new ethers.Contract(priceToken, uniswapV2PairAbi);

  const [
    _wethInPool,
    priceTokenInPool,
    priceTokenDec,
    harvestable
  ] = await Promise.all([
    WEth.balanceOf(uniPair),
    priceTokenContract.balanceOf(uniPair),
    priceTokenContract.decimals(),
    strategy.getHarvestable()
  ]);

  const dec18 = ethers.utils.parseEther("1");

  const priceTokenPerUni = priceTokenInPool.mul(dec18).div(totalUNI);

  const priceTokenBal = parseFloat(
    ethers.utils.formatUnits(
      priceTokenPerUni.mul(balance).div(dec18),
      priceTokenDec
    )
  );
  const balanceUSD = priceTokenBal * this.getTokenPrice(pricesUSD, priceToken) * 2;

  const otherTokenAvai = parseFloat(
    ethers.utils.formatUnits(
      priceTokenPerUni.mul(available).div(dec18),
      priceTokenDec
    )
  );
  const earnableUSD = otherTokenAvai * this.getTokenPrice(pricesUSD, priceToken) * 2;

  const harvestableUSD =
    parseFloat(ethers.utils.formatEther(harvestable)) * pricesUSD.get(this.rewardToken);

  return {
    balanceUSD,
    earnableUSD,
    harvestableUSD
  };

  }
}