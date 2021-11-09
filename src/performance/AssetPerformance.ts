import { JarDefinition } from "../model/PickleModelJson";
import { readQueryFromGraphProtocol } from "../graph/TheGraph";

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

// Unused TODO remove this shit
export async function getProtocolPerformance(
  asset: JarDefinition,
): Promise<PerformanceData> {
  if (!asset.protocol) return undefined;
  switch (asset.protocol) {
    case "uniswap":
    case "sushiswap":
    case "comethswap":
      return await getSwapPerformance(asset);
    default:
      return undefined;
  }
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
