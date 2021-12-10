import { AbstractPriceResolver, NeedleAliases } from "./AbstractPriceResolver";
import { IPriceResolver } from "./IPriceResolver";
import { ChainNetwork, Chains } from "../chain/Chains";
import {
  Provider as MulticallProvider,
  Contract as MulticallContract,
} from "ethers-multicall";
import { ethers, Contract } from "ethers";
import v2PoolABI from "../Contracts/ABIs/uniswapv2-pair.json";

export class SwapPriceResolver
  extends AbstractPriceResolver
  implements IPriceResolver
{
  protected async fetchPricesBySwapPairs(
    searchNeedles: NeedleAliases[],
    chain: ChainNetwork,
  ): Promise<Map<string, number>> {
    const provider = Chains.get(chain).getPreferredWeb3Provider();

    const multicallProvider = new MulticallProvider(
      provider,
      Chains.get(chain).id,
    );

    const ret: Map<string, number> = new Map<string, number>();
    for (const alias of searchNeedles) {
      const swapPairs = alias.swapPairs;
      const targetTokenAddr = alias.aliases.filter((x) => x.includes("0x"))[0];

      const poolContract = new ethers.Contract(
        swapPairs[0],
        v2PoolABI,
        provider,
      );
      const { token0, token1, reserves } = await getPairReserves(poolContract);

      console.log({ token0, token1, reserves });
      ret.set(alias.needle, 1);
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

  console.log(token0, token1, reserves);
  return {
    token0,
    token1,
    reserves,
  };
}
