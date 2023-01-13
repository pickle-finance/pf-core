import { Contract } from "ethers-multiprovider";
import { formatEther } from "ethers/lib/utils";
import CurvePoolABI from "../Contracts/ABIs/pool.json";
import { ChainNetwork, PickleModel } from "..";
import { HistoricalYield, JarDefinition } from "../model/PickleModelJson";
import { BigNumber, ethers } from "ethers";
import { fetch } from "cross-fetch";
import { ONE_YEAR_IN_SECONDS } from "../behavior/AbstractJarBehavior";

const swap_abi = [
  "function balances(uint256) view returns(uint256)",
  "function get_virtual_price() view returns(uint256)",
  "function coins(uint256) view returns(address)",
];
const gaugeAbi = [
  "function working_supply() view returns(uint256)",
  "function inflation_rate() view returns(uint256)",
  "function inflation_rate(uint256) view returns(uint256)",
  "function integrate_inv_supply(uint256) view returns(uint256)",
];

const cacheKeyPrefix = "curve.data.cache.key.";

// ADD_CHAIN_PROTOCOL
export const curveApi = "https://stats.curve.fi/raw-stats/apys.json";
export const curveApiPoly =
  "https://stats.curve.fi/raw-stats-polygon/apys.json";
export const curveApiArbitrum =
  "https://stats.curve.fi/raw-stats-arbitrum/apys.json";
export const curveSubgraphArbitrum =
  "https://api.curve.fi/api/getSubgraphData/arbitrum";
export const curveApiXdai = "https://stats.curve.fi/raw-stats-xdai/apys.json";
export const apiUrls = new Map<string, string>();
apiUrls.set(ChainNetwork.Ethereum, curveApi);
apiUrls.set(ChainNetwork.Polygon, curveApiPoly);
apiUrls.set(ChainNetwork.Arbitrum, curveApiArbitrum);
apiUrls.set(ChainNetwork.Gnosis, curveApiXdai);

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
  const multiProvider = model.multiproviderFor(chain);
  const multicallPoolContract = new Contract(tokenAddress, CurvePoolABI);

  const pricePerToken = await multiProvider
    .all([multicallPoolContract.get_virtual_price()])
    .then((x) => parseFloat(formatEther(x[0])));

  return pricePerToken;
}

export async function calculateCurveApyArbitrum(
  jar: JarDefinition,
  model: PickleModel,
  swapAddress: string,
  _gauge: string,
  _tokensNo: number,
  _rewardTokenId = "crv",
): Promise<number> {
  // Get CRV emission rate
  const multiProvider = model.multiproviderFor(jar.chain);
  const swapContract = new Contract(swapAddress, swap_abi);
  const gaugeContract = new Contract(_gauge, gaugeAbi);

  const secondsInOneWeek = 60 * 60 * 24 * 7;
  const currentWeekEpoch = Math.floor(Date.now() / 1000 / secondsInOneWeek);

  const [workingSupply, gaugeRate]: BigNumber[] = await multiProvider.all([
    gaugeContract.working_supply(),
    _rewardTokenId == "crv"
      ? gaugeContract.inflation_rate(currentWeekEpoch)
      : gaugeContract.inflation_rate(),
  ]);

  // This assumes no reward boost
  const yearlyCrvRate = gaugeRate
    .mul(ONE_YEAR_IN_SECONDS)
    .div(workingSupply)
    .mul(40)
    .toNumber();

  const crvPrice = model.priceOfSync(_rewardTokenId, jar.chain);
  const crvValuePerYear = yearlyCrvRate * crvPrice * 100;
  console.log({ crvPrice, crvValuePerYear, gaugeRate, yearlyCrvRate });

  // Get total pool USD value
  const coinsProm: Promise<string[]> = multiProvider.all(
    Array.from(
      Array.from(Array(_tokensNo).keys()).map((x) => swapContract.coins(x)),
    ),
  );
  const balancesProm: Promise<BigNumber[]> = multiProvider.all(
    Array.from(
      Array.from(Array(_tokensNo).keys()).map((x) => swapContract.balances(x)),
    ),
  );

  const [tokenAddresses, balancesBN] = await Promise.all([
    coinsProm,
    balancesProm,
  ]);
  const decimals: number[] = tokenAddresses.map((x) =>
    model.tokenDecimals(x, jar.chain),
  );
  const prices: number[] = tokenAddresses.map((x) =>
    model.priceOfSync(x, jar.chain),
  );

  let totalStakedUsd = 0;
  tokenAddresses.forEach((_, i) => {
    const balance = parseFloat(
      ethers.utils.formatUnits(balancesBN[i], decimals[i]),
    );
    totalStakedUsd += balance * prices[i];
  });

  console.log(totalStakedUsd, crvValuePerYear);

  const crvAPY = (crvValuePerYear / totalStakedUsd) * 100;
  return crvAPY;
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
