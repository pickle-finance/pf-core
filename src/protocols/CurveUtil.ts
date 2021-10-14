import { Contract as MulticallContract } from "ethers-multicall";
import { formatEther } from "ethers/lib/utils";
import CurvePoolABI from "../Contracts/ABIs/pool.json";
import { ChainNetwork, PickleModel } from "..";
import { JarDefinition } from "../model/PickleModelJson";
import { BigNumber } from "ethers";

const swap_abi = ["function balances(uint256) view returns(uint256)"];
export async function getCurveLpPriceData(
  tokenAddress: string,
  model: PickleModel,
  chain: ChainNetwork,
): Promise<number> {
  const multicallProvider = model.multicallProviderFor(chain);
  await multicallProvider.init();

  const multicallPoolContract = new MulticallContract(
    tokenAddress,
    CurvePoolABI,
  );

  const [pricePerToken] = (
    await multicallProvider.all([multicallPoolContract.get_virtual_price()])
  ).map((x) => parseFloat(formatEther(x)));

  return pricePerToken;
}

export async function calculateCurveApyArbitrum(
  jar: JarDefinition,
  model: PickleModel,
  swapAddress: string,
  _gauge: string,
  tokens: string[],
) {
  const multicallProvider = model.multicallProviderFor(jar.chain);
  const swap = new MulticallContract(swapAddress, swap_abi);
  const balances: BigNumber[] = await multicallProvider.all(
    Array.from(Array(tokens.length).keys()).map((x) => swap.balances(x)),
  );

  // TODO This is the fail
  const decimals: number[] = tokens.map((x) =>
    model.tokenDecimals(x, jar.chain),
  );
  const prices: number[] = tokens.map((x) => model.priceOfSync(x));
  let totalStakedUsd = 0;
  for (let i = 0; i < tokens.length; i++) {
    const oneEdec =
      "1" +
      Array.from(Array(decimals[i]).keys())
        .map((_x) => "0")
        .join(""); // this is retarded
    const scaleBal = balances[i].div(oneEdec).toNumber() * prices[i];
    totalStakedUsd = totalStakedUsd += scaleBal;
  }
  const crvPrice = model.priceOfSync("crv");
  const crvRewardsAmount = crvPrice * 3500761; // Approximation of CRV emissions
  const crvAPY = crvRewardsAmount / totalStakedUsd;
  return crvAPY;
}
