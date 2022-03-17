import { ChainNetwork, Chains } from "../chain/Chains";
import { ethers, Contract, BigNumber } from "ethers";
import v2PoolABI from "../Contracts/ABIs/uniswapv2-pair.json";
import erc20Abi from "../Contracts/ABIs/erc20.json";
import { formatEther } from "@ethersproject/units";
import {
  ExternalToken,
  ExternalTokenFetchStyle,
  ExternalTokenModelSingleton,
} from "./ExternalTokenModel";
import { DEBUG_OUT } from "../model/PickleModel";

/*
 * This file could benefit from multi-calls and possibly even a caching
 * so that the same contract doesn't get investigated twice in the same execution
 *
 */
async function getPairReserves(contract: Contract) {
  const [token0, token1, reserves] = await Promise.all([
    contract.token0(),
    contract.token1(),
    contract.getReserves(),
  ]);

  return {
    token0: token0.toLowerCase(),
    token1: token1.toLowerCase(),
    reserves,
  };
}

export const calculateSwapTokenPrices = async (
  chains: ChainNetwork[],
): Promise<void> => {
  const swapFiltered = ExternalTokenModelSingleton.getAllTokens()
    .filter((x) => chains.includes(x.chain))
    .filter((val) => val.fetchType === ExternalTokenFetchStyle.SWAP_PAIRS);
  await calculateSwapTokenPricesImpl(swapFiltered);
};

export const calculateSwapTokenPricesImpl = async (
  tokens: ExternalToken[],
): Promise<void> => {
  DEBUG_OUT("Begin calculateSwapTokenPricesImpl");
  const start = Date.now();
  const promises = [];
  for (let i = 0; i < tokens.length; i++) {
    promises.push(fetchSingleTokenSwapPairPriceAndSave(tokens[i]));
  }
  try {
    await Promise.all(promises);
  } catch (error) {
    console.log("Error loading SwapPrice resolver for tokens");
  }
  DEBUG_OUT("End calculateSwapTokenPricesImpl: " + (Date.now() - start));
};

export const fetchSingleTokenSwapPairPriceAndSave = async (
  token: ExternalToken,
): Promise<void> => {
  const provider = Chains.get(token.chain).getPreferredWeb3Provider();
  const pairReserves = [];
  for (const pair of token.swapPairs) {
    const poolContract = new ethers.Contract(pair, v2PoolABI, provider);
    const { token0, token1, reserves } = await getPairReserves(poolContract);
    pairReserves.push({ [token0]: reserves[0], [token1]: reserves[1] });
  }

  // Last token is a stablecoin
  let numeratorToken: string, denomToken: string;
  const ratios: BigNumber[] = [];

  for (let i = 0; i < pairReserves.length; i++) {
    // If we're at the last pair, stablecoin is numerator
    // Price is ratio of USD/token
    if (i === pairReserves.length - 1) {
      // const tokens = Object.keys(pairReserves[i]);
      // if only 1 swap pair, then the denomintor is the target token, and contained in the alias
      denomToken = numeratorToken || token.contractAddr;
      numeratorToken = Object.keys(pairReserves[i]).filter(
        (x) => x != denomToken,
      )[0];
    } else {
      // To start, numerator is the target token
      if (i == 0) {
        numeratorToken = token.contractAddr;
      }

      // This is the intermediate case where numerator was set as previous denominator
      denomToken = Object.keys(pairReserves[i]).filter(
        (x) => x != numeratorToken,
      )[0];
    }

    const numTokenContract = new ethers.Contract(
      numeratorToken,
      erc20Abi,
      provider,
    );
    const denomTokenContract = new ethers.Contract(
      denomToken,
      erc20Abi,
      provider,
    );

    const numDecimals = await numTokenContract.decimals();
    const denomDecimals = await denomTokenContract.decimals();

    // Get reserve values and normalize to 18 decimal places
    const numerator = pairReserves[i][numeratorToken]
      .mul(BigNumber.from((Math.pow(10, 18 - numDecimals) * 1e6).toString()))
      .div((1e6).toString());

    const denominator = pairReserves[i][denomToken]
      .mul(BigNumber.from((Math.pow(10, 18 - denomDecimals) * 1e6).toString()))
      .div((1e6).toString());

    const ratio = numerator.mul((1e18).toString()).div(denominator);
    ratios.push(ratio);

    // The next numerator is the previous denominator UNLESS the next pair is the last one
    numeratorToken = denomToken;
  }

  // Divide ratios in reverse order to obtain target token price
  const reversedRatios = ratios.reverse();
  const priceBN = reversedRatios.reduce(
    (acc, curr, idx) =>
      idx === 0 ? curr : acc.mul((1e18).toString()).div(curr),
    BigNumber.from("0"),
  );
  const price: number = +formatEther(priceBN);
  token.price = price;
  //console.log(`Token ${token.coingeckoId} on ${token.chain} has price of ${price}`);
};
