import { ChainNetwork, PickleModel } from "..";
import { JarDefinition } from "../model/PickleModelJson";
import { ethers } from "ethers";
import { fetch } from "cross-fetch";
import { toError } from "../model/PickleModel";
import { ErrorSeverity } from "../core/platform/PlatformInterfaces";

interface ExtraRewardData {
  tokenAddr: string;
  apy: number;
  rewardEnds: number;
}
interface CurvePoolData {
  lpApr: number; // daily
  lpApr7d: number; // weekly
  totalSupply: number;
  usdValue: number;
  price: number;
  crvApy: number; // Lowest range
  extraRewards: ExtraRewardData[];
}
interface ChainPoolsData {
  [poolAddr: string]: CurvePoolData;
}

// Curve have two types of pools: normal (stables) and crypto (variables)
// They also have two types of gauges: main (deployed by Curve) and factory (anyone can deploy)
const CURVE_API = "https://api.curve.fi/api";

// Maps LP token address to its pool address
const curvePoolsDict = new Map<ChainNetwork, { [lpAddr: string]: string }>();
// Caches pools data
const curvePoolsDataCache = new Map<ChainNetwork, ChainPoolsData>();

const fetchPoolsDataForChain = async (jar: JarDefinition, model: PickleModel) => {
  const chainPoolsDict: { [lpAddr: string]: string } = {};
  const chainPoolsData: ChainPoolsData = {};

  const chainStr = jar.chain === ChainNetwork.Ethereum ? "ethereum" : jar.chain.toString();

  // Most of the data we need are on Curve's getPools API endpoint
  const suffixes = ["main", "crypto", "factory", "factory-crypto"];
  const getPoolsUrls = suffixes.map((suf) => `${CURVE_API}/getPools/${chainStr}/${suf}`);
  for (const url of getPoolsUrls) {
    try {
      const resp = await fetch(url);
      const json = await resp.json();
      for (const poolData of json.data.poolData) {
        // Extract and cache the data we need
        const lpAddr: string = poolData.lpTokenAddress.toLowerCase();
        const poolAddr: string = poolData.address.toLowerCase();
        chainPoolsDict[lpAddr] = poolAddr;

        const totalSupply = parseFloat(ethers.utils.formatEther(poolData.totalSupply));
        const usdValue: number = poolData.usdTotal;
        const price: number = totalSupply ? usdValue / totalSupply : 0;
        const crvApy: number = poolData.gaugeCrvApy && poolData.gaugeCrvApy[0] ? poolData.gaugeCrvApy[0] : 0;
        const extraRewards: ExtraRewardData[] = [];
        if (poolData.gaugeRewards && poolData.gaugeRewards.length) {
          poolData.gaugeRewards.forEach((reward) => {
            const tokenAddr = reward.tokenAddress;
            const apy = reward.apy;
            const rewardEnds = reward.metaData && reward.metaData.periodFinish ? reward.metaData.periodFinish : 0;
            extraRewards.push({ tokenAddr, apy, rewardEnds });
          });
        }

        chainPoolsData[poolAddr] = { lpApr: 0, lpApr7d: 0, totalSupply, usdValue, price, crvApy, extraRewards };
      }
    } catch (error) {
      // prettier-ignore
      model.logPlatformError(toError(305000, jar.chain, jar.details.apiKey, "CurveUtil/fetchPoolsDataForChain/getPools", `error fetching ${url}` , ''+error, ErrorSeverity.ERROR_3));
    }
  }

  // LP APR is on Curve's getSubgraphData API endpoint
  const subgraphUrl = `${CURVE_API}/getSubgraphData/${chainStr}`;
  try {
    const resp = await fetch(subgraphUrl);
    const json = await resp.json();
    for (const pool of json.data.poolList) {
      const poolAddr = pool.address.toLowerCase();
      const apr1d = pool.latestDailyApy;
      const apr7d = pool.latestWeeklyApy;
      chainPoolsData[poolAddr].lpApr = apr1d;
      chainPoolsData[poolAddr].lpApr7d = apr7d;
    }
  } catch (error) {
    // prettier-ignore
    model.logPlatformError(toError(305000, jar.chain, jar.details.apiKey, "CurveUtil/fetchPoolsDataForChain/subgraph", `error fetching ${subgraphUrl}` , ''+error, ErrorSeverity.ERROR_3));
  }

  curvePoolsDict.set(jar.chain, chainPoolsDict);
  curvePoolsDataCache.set(jar.chain, chainPoolsData);
  return chainPoolsDict;
};

export async function getCurvePoolData(jar: JarDefinition, model: PickleModel): Promise<CurvePoolData> {
  let chainPools = curvePoolsDict.get(jar.chain);
  if (!chainPools) {
    chainPools = await fetchPoolsDataForChain(jar, model);
  }

  const chainPoolsData = curvePoolsDataCache.get(jar.chain);

  const poolAddr = chainPools[jar.depositToken.addr.toLowerCase()];
  const poolData = chainPoolsData[poolAddr];

  return poolData;
}
