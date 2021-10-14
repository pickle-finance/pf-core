import { ethers } from "ethers";
import { JarDefinition } from "../model/PickleModelJson";
import yearnRegistryABI from "../Contracts/ABIs/yearn-registry.json";
import { readQueryFromGraphProtocol } from "../graph/TheGraph";
import fetch from "cross-fetch";
import {
  AssetDatabaseEntry,
  CURRENT,
  ONE_DAY,
  ONE_YEAR_MS,
  SEVEN_DAYS,
  THIRTY_DAYS,
  THREE_DAYS,
} from "../database/DatabaseUtil";

export interface PerformanceData {
  oneDay: number;
  threeDay: number;
  sevenDay: number;
  thirtyDay: number;
}

export interface JarFarmPerformanceData {
  oneDay: number;
  threeDay: number;
  sevenDay: number;
  thirtyDay: number;
  oneDayFarm: number;
  threeDayFarm: number;
  sevenDayFarm: number;
  thirtyDayFarm: number;
}

// Unused
export async function getProtocolPerformance(
  asset: JarDefinition,
): Promise<PerformanceData> {
  if (!asset.protocol) return undefined;
  switch (asset.protocol) {
    case "curve":
      return await getCurvePerformance(asset);
    case "yearn":
      return await getYearnPerformance(asset);
    case "uniswap":
    case "sushiswap":
    case "comethswap":
      return await getSwapPerformance(asset);
    default:
      return undefined;
  }
}

export async function getCurvePerformance(
  asset: JarDefinition,
  network = "mainnet",
): Promise<PerformanceData> {
  const curveApi = "https://stats.curve.fi/raw-stats/apys.json";
  const curveApiPoly = "https://stats.curve.fi/raw-stats-polygon/apys.json";

  // Map between our jar/farm 'api' keys used in our db and the names provided by curve api
  const apyMapping = {
    "3poolCRV": "3pool",
    renBTCCRV: "ren2",
    sCRV: "susd",
    steCRV: "steth",
    lusdCRV: "lusd",
    am3CRV: "aave",
  };
  const api = network != "mainnet" ? curveApiPoly : curveApi;
  const curveData = await fetch(api).then((response) => response.json());
  const oneDayVal = curveData.apy.day[apyMapping[asset.details.apiKey]] * 100;
  const thirtyDay = curveData.apy.month[apyMapping[asset.details.apiKey]] * 100;
  return {
    oneDay: oneDayVal,
    threeDay: oneDayVal,
    sevenDay: oneDayVal,
    thirtyDay: thirtyDay,
  };
}

export async function getYearnPerformance(
  asset: JarDefinition,
): Promise<PerformanceData> {
  const yearnApi = "https://vaults.finance/all";
  const provider = new ethers.providers.JsonRpcProvider(
    "https://nodes.mewapi.io/rpc/eth",
  );
  const yearnRegistry = new ethers.Contract(
    "0x50c1a2ea0a861a967d9d0ffe2ae4012c2e053804",
    yearnRegistryABI,
    provider,
  );

  const vaultAddress = await yearnRegistry.latestVault(
    asset.depositToken.addr.toLowerCase(),
    { gasLimit: 1000000 },
  );
  const yearnData = await fetch(yearnApi).then((response) => response.json());
  const vaultData = yearnData.find(
    (vault) => vault.address.toLowerCase() == vaultAddress.toLowerCase(),
  );
  return {
    oneDay: vaultData.apy.data.netApy * 100,
    threeDay: vaultData.apy.data.netApy * 100,
    sevenDay: vaultData.apy.data.netApy * 100,
    thirtyDay: vaultData.apy.data.netApy * 100,
  };
}

export async function getSwapPerformance(
  asset: JarDefinition,
): Promise<PerformanceData> {
  const assetKey = asset.depositToken.addr.toLowerCase();
  const query = `
      {
        pairDayDatas(first: 30, orderBy: date, orderDirection: desc, where:{pairAddress: "${assetKey}"}) {
          reserveUSD
          dailyVolumeUSD
        }
      }
    `;
  const asJson = await readQueryFromGraphProtocol(query, asset.protocol);
  const pairDayResponse = asJson.data.pairDayDatas;

  const returnObj: PerformanceData = {
    oneDay: 0,
    threeDay: 0,
    sevenDay: 0,
    thirtyDay: 0,
  };
  let totalApy = 0;
  for (let i = 0; i < pairDayResponse.length; i++) {
    const volume = parseFloat(pairDayResponse[i].dailyVolumeUSD);
    const poolReserve = parseFloat(pairDayResponse[i].reserveUSD);
    const fees = volume * 0.003;
    totalApy += (fees / poolReserve) * 365 * 100;

    if (i === 0) returnObj.oneDay = totalApy / (i + 1);
    else if (i === 2) returnObj.threeDay = totalApy / (i + 1);
    else if (i === 6) returnObj.sevenDay = totalApy / (i + 1);
    else if (i === 29) returnObj.thirtyDay = totalApy / (i + 1);
  }
  return returnObj;
}

export async function getJarFarmPerformanceData(
  protocol: PerformanceData,
  farmPerformance: number,
  data: AssetDatabaseEntry[],
): Promise<JarFarmPerformanceData> {
  if (!data) {
    return undefined;
  }
  if (protocol === undefined) {
    protocol = {
      oneDay: 0,
      threeDay: 0,
      sevenDay: 0,
      thirtyDay: 0,
    };
  }
  const isAsset = data !== undefined; // TODO ?
  const farmApy = farmPerformance ? farmPerformance : 0;
  const oneDay =
    (isAsset ? getSamplePerformance(data, ONE_DAY) : 0) + protocol.oneDay;
  const threeDay =
    (isAsset ? getSamplePerformance(data, THREE_DAYS) : 0) + protocol.threeDay;
  const sevenDay =
    (isAsset ? getSamplePerformance(data, SEVEN_DAYS) : 0) + protocol.sevenDay;
  const thirtyDay =
    (isAsset ? getSamplePerformance(data, THIRTY_DAYS) : 0) +
    protocol.thirtyDay;
  return {
    oneDay: format(oneDay),
    threeDay: format(threeDay),
    sevenDay: format(sevenDay),
    thirtyDay: format(thirtyDay),
    oneDayFarm: format(oneDay + farmApy),
    threeDayFarm: format(threeDay + farmApy),
    sevenDayFarm: format(sevenDay + farmApy),
    thirtyDayFarm: format(thirtyDay + farmApy),
  };
}

// helper functions
const format = (value) => {
  if (isNaN(value)) {
    return 0;
  }
  if (!isFinite(value)) {
    return Number.MAX_SAFE_INTEGER;
  }
  return parseFloat(value.toFixed(2));
};

export function getRatio(data, offset): number {
  return data.length >= offset
    ? data[data.length - (offset + 1)].ratio
    : undefined;
}
export function getBlock(data, offset): number {
  return data.length >= offset
    ? data[data.length - (offset + 1)].height
    : undefined;
}

export function getTimestamp(data, offset): number {
  return data.length >= offset
    ? data[data.length - (offset + 1)].timestamp
    : undefined;
}

export function getPerformance(ratioDiff, blockDiff, timeDiff): number {
  const scalar = (ONE_YEAR_MS / timeDiff) * blockDiff;
  const slope = ratioDiff / blockDiff;
  return scalar * slope * 100;
}

export function getSamplePerformance(
  data: AssetDatabaseEntry[],
  offset: number,
): number {
  // get current values
  const currentRatio = getRatio(data, CURRENT);
  const currentBlock = getBlock(data, CURRENT);
  const currentTimestamp = getTimestamp(data, CURRENT);

  // get sampled ratios
  const sampledRatio = getRatio(data, offset);
  const sampledBlock = getBlock(data, offset);
  const sampledTimestamp = getTimestamp(data, offset);

  if (!sampledRatio || !sampledBlock || !sampledTimestamp) {
    return 0;
  }

  const ratioDiff = currentRatio - sampledRatio;
  const blockDiff = currentBlock - sampledBlock;
  const timestampDiff = currentTimestamp - sampledTimestamp;
  return getPerformance(ratioDiff, blockDiff, timestampDiff);
}
