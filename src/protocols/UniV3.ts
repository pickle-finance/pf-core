import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";import { ethers, Contract } from "ethers";
import v3PoolABI from '../Contracts/ABIs/univ3Pool.json';

import univ3prices from '@thanpolas/univ3prices';
import erc20Abi from '../Contracts/ABIs/erc20.json';
import { ChainNetwork, Chains, PickleModel } from "..";
import { ONE_YEAR_IN_SECONDS } from "../behavior/AbstractJarBehavior";
import { JarDefinition } from "../model/PickleModelJson";


export interface UniV3PoolData {
  token: number,
  symbol: string,
  weth: number,
  tvl: number,
  tick: number,
  spacing: number,
  liquidity: string
}
export interface AprNamePair {
  id: string,
  apr: number,
}

  // UniV3 Incentives
  const uniV3Info: any = {
    // RBN-ETH
    "0x94981F69F7483AF3ae218CbfE65233cC3c60d93a": {
      incentiveKey: [
        "0x6123B0049F904d730dB3C36a31167D9d4121fA6B",
        "0x94981F69F7483AF3ae218CbfE65233cC3c60d93a",
        1633694400,
        1638878400,
        "0xDAEada3d210D2f45874724BeEa03C7d4BBD41674",
      ],
      emissions: 10000000,
      rewardName: "rbn",
    },
  };


// Fetches TVL of a XXX/ETH pool and returns prices
export const getPoolData = async (pool: string, token: string, provider: Provider|Signer) : Promise<UniV3PoolData> => {
  const weth = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';

  const wethPrice = await getWETHPrice(provider);
  const poolContract = new ethers.Contract(pool, v3PoolABI, provider);

  const token0 = await poolContract.token0();
  const data = await poolContract.slot0();

  const spacing = await poolContract.tickSpacing();
  const liquidity = await poolContract.liquidity();
  const ratio = univ3prices([18, 18], data.sqrtPriceX96).toAuto();

  const tokenPrice = token0 === weth ? wethPrice * ratio : wethPrice / ratio;

  const wethContract = new ethers.Contract(weth, erc20Abi, provider)
  const wethBalance = ethers.utils.formatUnits(
    await wethContract.balanceOf(pool),
    18
  );

  const tokenContract = new ethers.Contract(token, erc20Abi, provider)
  const symbol = await tokenContract.symbol()
  const tokenBalance = ethers.utils.formatUnits(
    await tokenContract.balanceOf(pool),
    18
  );

  const tvl : number = parseFloat(tokenBalance) * tokenPrice + wethPrice * parseFloat(wethBalance);
  return {
    token: tokenPrice,
    symbol: symbol,
    weth: wethPrice,
    tvl: tvl,
    tick: data.tick,
    spacing: spacing,
    liquidity: liquidity.toString()
  }
}

export const getWETHPrice = async (provider) => {
  const weth_usdc = '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640'
  const poolContract = new ethers.Contract(weth_usdc, v3PoolABI, provider)
  const data = await poolContract.slot0()
  const ratio = univ3prices([6, 18], data.sqrtPriceX96).toAuto() // [] token decimals
  return ratio
}

export const calculateUniV3Apy = async (poolTokenAddress: string, chain: ChainNetwork) : Promise<AprNamePair> => {
  const provider : Provider|Signer = Chains.get(chain).getProviderOrSigner();
  
  const { incentiveKey, emissions, rewardName } = uniV3Info[
    poolTokenAddress
  ];
  const data = await getPoolData(incentiveKey[1], incentiveKey[0], provider);
  const emissionsPerSecond =
    emissions / (incentiveKey[3] - incentiveKey[2]);
  const apr =
    (emissionsPerSecond * data.token * ONE_YEAR_IN_SECONDS) / data.tvl;
  return { id: rewardName, apr: apr * 100 }
};