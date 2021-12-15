import { AbstractPriceResolver, NeedleAliases } from "./AbstractPriceResolver";
import { IPriceResolver } from "./IPriceResolver";
import { ChainNetwork, Chains } from "../chain/Chains";
import { ethers, Contract, BigNumber } from "ethers";
import v2PoolABI from "../Contracts/ABIs/uniswapv2-pair.json";
import erc20Abi from "../Contracts/ABIs/erc20.json";
import { formatEther } from "@ethersproject/units";

export class SwapPriceResolver
  extends AbstractPriceResolver
  implements IPriceResolver
{
  protected async fetchPricesBySwapPairs(
    searchNeedles: NeedleAliases[],
    chain: ChainNetwork,
  ): Promise<Map<string, number>> {
    const provider = Chains.get(chain).getPreferredWeb3Provider();

    const ret: Map<string, number> = new Map<string, number>();
    for (const alias of searchNeedles) {
      const swapPairs = alias.swapPairs;
      const targetTokenAddr = alias.aliases
        .filter((x) => x.includes("0x"))[0]
        .toLowerCase();

      const pairReserves = [];
      for (const pair of swapPairs) {
        const poolContract = new ethers.Contract(pair, v2PoolABI, provider);
        const { token0, token1, reserves } = await getPairReserves(
          poolContract,
        );
        pairReserves.push({ [token0]: reserves[0], [token1]: reserves[1] });
      }

      // Last token is a stablecoin
      let numeratorToken, denomToken: string;
      const ratios: BigNumber[] = [];

      for (let i = 0; i < pairReserves.length; i++) {
        // If we're at the last pair, stablecoin is numerator
        // Price is ratio of USD/token
        if (i === pairReserves.length - 1) {
          const tokens = Object.keys(pairReserves[i]);
          // if only 1 swap pair, then the denomintor is the target token, and contained in the alias
          denomToken =
            numeratorToken ||
            alias.aliases.find(
              (x) =>
                x.toLowerCase() === tokens[0] || x.toLowerCase() === tokens[1],
            );
          numeratorToken = Object.keys(pairReserves[i]).filter(
            (x) => x != denomToken,
          )[0];
        } else {
          // To start, numerator is the target token
          if (i == 0) {
            numeratorToken = targetTokenAddr;
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
          .mul(
            BigNumber.from((Math.pow(10, 18 - numDecimals) * 1e6).toString()),
          )
          .div((1e6).toString());

        const denominator = pairReserves[i][denomToken]
          .mul(
            BigNumber.from((Math.pow(10, 18 - denomDecimals) * 1e6).toString()),
          )
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

      ret.set(alias.needle, +formatEther(priceBN));
    }
    return ret;
  }

  protected async fetchPricesBySearchId(
    _contractIds: string[],
  ): Promise<Map<string, number>> {
    return new Map<string, number>();
  }

  protected async fetchPricesByContracts(
    _contractIds: string[],
  ): Promise<Map<string, number>> {
    return new Map<string, number>();
  }
}

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
