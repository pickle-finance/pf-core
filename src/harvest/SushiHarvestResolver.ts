import { BigNumber } from "@ethersproject/bignumber";
import { Contract } from "@ethersproject/contracts";
import { ethers } from "ethers";
import { PriceCache } from "../price/PriceCache";
import { AbstractJarHarvestResolver, JarHarvestStats } from "./JarHarvestResolver";
import uniswapV2PairAbi from '../Contracts/ABIs/uniswapv2-pair.json';

export class SushiHarvestResolver extends AbstractJarHarvestResolver {
    async getJarHarvestStats(_jar: Contract, depositToken: string, strategy: Contract, balance: BigNumber, 
        available: BigNumber, pricesUSD: PriceCache): Promise<JarHarvestStats> {
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

  const otherToken =
    token0.toLowerCase() === this.getTokenContract("weth").toLowerCase() ? token1 : token0;
  const OtherToken = new ethers.Contract(otherToken, uniswapV2PairAbi);
  const SushiToken = new ethers.Contract(this.getTokenContract("sushi"), uniswapV2PairAbi);

  const [
    wethInPool,
    _otherTokenInPool,
    _otherTokenDec,
    harvestable,
    sushiBalance
  ] = await Promise.all([
    WEth.balanceOf(uniPair),
    OtherToken.balanceOf(uniPair),
    OtherToken.decimals(),
    strategy.getHarvestable(),
    SushiToken.balanceOf(strategy.address)
  ]);

  const dec18 = ethers.utils.parseEther("1");

//  const _otherTokenPerUni = otherTokenInPool.mul(dec18).div(totalUNI);
  const wethPerUni = wethInPool.mul(dec18).div(totalUNI);

  const wethBal = parseFloat(
    ethers.utils.formatEther(wethPerUni.mul(balance).div(dec18))
  );
  const balanceUSD = wethBal * this.getTokenPrice(pricesUSD, "weth") * 2;

  /*
  const otherTokenBal = parseFloat(
    ethers.utils.formatUnits(
      otherTokenPerUni.mul(balance).div(dec18),
      otherTokenDec
    )
  );
  const otherTokenAvai = parseFloat(
    ethers.utils.formatUnits(
      otherTokenPerUni.mul(available).div(dec18),
      otherTokenDec
    )
  );
  */

  const wethAvai = parseFloat(
    ethers.utils.formatEther(wethPerUni.mul(available).div(dec18))
  );
  const earnableUSD = wethAvai * this.getTokenPrice(pricesUSD, "weth") * 2;

  const harvestableUSD =
    parseFloat(ethers.utils.formatEther(harvestable.add(sushiBalance))) *
    this.getTokenPrice(pricesUSD, "sushi");

  return {
    balanceUSD,
    earnableUSD,
    harvestableUSD
  };
    }
}
