import { Contract, ethers } from 'ethers';
import { PriceCache } from '../price/PriceCache';
import {AbstractJarHarvestResolver, JarHarvestStats } from './JarHarvestResolver';
import uniswapV2PairAbi from '../Contracts/ABIs/uniswapv2-pair.json';

export class CvxHarvestResolver extends AbstractJarHarvestResolver {
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
  const wethContractAddr = this.getTokenContract("weth");
  const WEth = new ethers.Contract(wethContractAddr, uniswapV2PairAbi);
  const sushiContractAddr = this.getTokenContract("sushi");
  const cvxContractAddr = this.getTokenContract("cvx");
  
  const otherToken =
    token0.toLowerCase() === wethContractAddr.toLowerCase() ? token1 : token0;
  const OtherToken = new ethers.Contract(otherToken, uniswapV2PairAbi);
  const SushiToken = new ethers.Contract(sushiContractAddr, uniswapV2PairAbi);
  const CvxToken = new ethers.Contract(cvxContractAddr, uniswapV2PairAbi);

  const [
    wethInPool,
    _otherTokenInPool,
    _otherTokenDec,
    harvestable,
    cvxBalance,
    sushiBalance,
  ] = await Promise.all([
    WEth.balanceOf(uniPair),
    OtherToken.balanceOf(uniPair),
    OtherToken.decimals(),
    strategy.getHarvestable().catch(() => ethers.BigNumber.from(0)),
    CvxToken.balanceOf(strategy.address),
    SushiToken.balanceOf(strategy.address),
  ]);

  const dec18 = ethers.utils.parseEther("1");

  //const _otherTokenPerUni = otherTokenInPool.mul(dec18).div(totalUNI);
  const wethPerUni = wethInPool.mul(dec18).div(totalUNI);

  const wethBal = parseFloat(
    ethers.utils.formatEther(wethPerUni.mul(balance).div(dec18))
  );
  const balanceUSD = wethBal * this.getTokenPrice(pricesUSD, "weth") * 2;

  const wethAvai = parseFloat(
    ethers.utils.formatEther(wethPerUni.mul(available).div(dec18))
  );
  const earnableUSD = wethAvai * this.getTokenPrice(pricesUSD, "weth") * 2;

  const harvestableUSD =
    parseFloat(ethers.utils.formatEther(harvestable[0].add(sushiBalance))) *
    this.getTokenPrice(pricesUSD,"sushi") + parseFloat(ethers.utils.formatEther(harvestable[1].add(cvxBalance))) *
    this.getTokenPrice(pricesUSD, "cvx");

  return {
    balanceUSD,
    earnableUSD,
    harvestableUSD
  };
  }
}