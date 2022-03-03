import { Contract as MulticallContract } from "ethers-multicall";
import { formatEther } from "ethers/lib/utils";
import CurvePoolABI from "../Contracts/ABIs/pool.json";
import { ChainNetwork, PickleModel } from "..";
import { HistoricalYield, JarDefinition } from "../model/PickleModelJson";
import { BigNumber } from "ethers";
import { fetch } from "cross-fetch";

const swap_abi = ["function balances(uint256) view returns(uint256)"];

const cacheKeyPrefix = "curve.data.cache.key.";

// ADD_CHAIN_PROTOCOL
export const curveApi = "https://stats.curve.fi/raw-stats/apys.json";
export const curveApiPoly =
  "https://stats.curve.fi/raw-stats-polygon/apys.json";
export const curveApiArbitrum =
  "https://stats.curve.fi/raw-stats-arbitrum/apys.json";
export const apiUrls = new Map<string, string>();
apiUrls.set(ChainNetwork.Ethereum, curveApi);
apiUrls.set(ChainNetwork.Polygon, curveApiPoly);
apiUrls.set(ChainNetwork.Arbitrum, curveApiArbitrum);

// Map between our jar/farm 'api' keys used in our db and the names provided by curve api
const apyMapping = {
  "3poolCRV": "3pool",
  renBTCCRV: "ren2",
  sCRV: "susd",
  steCRV: "steth",
  lusdCRV: "lusd",
  am3CRV: "aave",
  CrvTricrypto: "tricrypto",
  // Mim2CRV: "",  //metapool
};

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
  const prices: number[] = tokens.map((x) => model.priceOfSync(x, jar.chain));
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
  const crvPrice = model.priceOfSync("crv", jar.chain);
  const crvRewardsAmount = crvPrice * 3500761; // Approximation of CRV emissions
  const crvAPY = crvRewardsAmount / totalStakedUsd;
  return crvAPY * 100;
}

export async function getCurvePerformance(
  asset: JarDefinition,
  model: PickleModel,
): Promise<HistoricalYield> {
  const curveData = await getCurveData(model, asset.chain);
  if (curveData === undefined) return undefined;

  // Metapools APYs are not registered in Curve's API
  const isMetapool = !apyMapping[asset.details.apiKey];

  if (isMetapool)
    return {
      d1: 0,
      d3: 0,
      d7: 0,
      d30: 0,
    };

  const oneDayVal = curveData.apy.day[apyMapping[asset.details.apiKey]] * 100;
  const weekVal = curveData.apy.week[apyMapping[asset.details.apiKey]] * 100;
  const thirtyDay = curveData.apy.month[apyMapping[asset.details.apiKey]] * 100;

  return {
    d1: oneDayVal,
    d3: oneDayVal,
    d7: weekVal,
    d30: thirtyDay,
  };
}

export async function getCurveData(
  model: PickleModel,
  chain: ChainNetwork,
): Promise<any> {
  const key = cacheKeyPrefix + chain.toString();
  if (model.resourceCache.get(key)) return model.resourceCache.get(key);

  const url = apiUrls.get(chain);
  if (url === undefined) return undefined;

  const result = await fetch(url)
    .then((response) => response.json())
    .catch(() => {
      return undefined;
    });
  if (!result) {
    model.resourceCache.delete(key);
  } else {
    model.resourceCache.set(key, result);
  }
  return result;
}
