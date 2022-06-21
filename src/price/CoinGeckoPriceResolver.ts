import CoinGecko from "coingecko-api";
import fetch from "cross-fetch";
import { ChainNetwork } from "..";
import { DEBUG_OUT } from "../model/PickleModel";
import {
  isCgFetchType,
  isCgFetchTypeContract,
} from "../model/PriceCacheLoader";
import { timeout } from "../util/PromiseTimeout";
import {
  ExternalToken,
  ExternalTokenFetchStyle,
  ExternalTokenModelSingleton,
} from "./ExternalTokenModel";

export const fetchCoingeckoPricesByContractNtimes = async (
  contractIds: string[],
  times: number,
): Promise<Map<string, number>> => {
  for (let i = 0; i < times; i++) {
    try {
      const promise1 = await timeout(
        fetchCoingeckoPricesByContractOnce(contractIds),
        4000,
        new Error("PfCoreTimeoutError_fetchCoingeckoPricesByContractNtimes"),
      );
      return promise1;
    } catch (err) {
      const joined = contractIds.join("%2C");
      const url = `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${joined}&vs_currencies=usd`;

      console.log("Timeout fetching cg prices: " + url);
      // Do nothing
    }
  }
  // We still haven't returned, so we have no prices :|
  throw new Error(
    "Cannot load prices for various contracts after several retries",
  );
};

export const fetchCoingeckoPricesByContractOnce = async (
  contractIds: string[],
): Promise<Map<string, number>> => {
  if (!contractIds || contractIds.length === 0) {
    return new Map<string, number>();
  }

  const joined = contractIds.join("%2C");
  const url = `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${joined}&vs_currencies=usd`;
  try {
    const contractPrice = await fetch(url);
    const retMap: Map<string, number> = new Map();
    const resp = await contractPrice.json();
    Object.keys(resp).map((key) => {
      retMap.set(key, resp[key].usd);
    });
    return retMap;
  } catch (e) {
    console.log("error");
    console.log(e);
    return null;
  }
};

export const fetchCoinGeckoPricesBySearchId = async (
  geckoNames: string[],
): Promise<Map<string, number>> => {
  const obj = {
    ids: geckoNames,
    vs_currencies: ["usd"],
  };
  const response: any = await new CoinGecko().simple.price(obj);
  const data = response.data;
  const returnMap: Map<string, number> = new Map<string, number>();
  for (const key in data) {
    returnMap.set(key, data[key].usd);
  }
  return returnMap;
};

export async function fetchHistoricalPriceSeries(options: { from: Date }) {
  const coinGecko = new CoinGecko();

  const toDate = new Date();
  /**
   * Fetching more than 90 days gives us daily data points (instead of hourly)
   * resulting in a much smaller payload.
   */
  const fromDate =
    getDayDiff(options.from, toDate) > 90
      ? options.from
      : new Date(toDate.getTime() - 91 * 24 * 60 * 60 * 1000);
  const response: any = await coinGecko.coins.fetchMarketChartRange(
    "pickle-finance",
    {
      vs_currency: "usd",
      from: Math.round(fromDate.getTime() / 1000),
      to: Math.round(toDate.getTime() / 1000),
    },
  );

  return response.data.prices;
}

// TODO move to better location
export const getDayDiff = (date1: Date, date2: Date): number => {
  return Math.ceil((date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24));
};

export const setCoingeckoPricesOnTokens = async (
  chain: ChainNetwork,
): Promise<void> => {
  DEBUG_OUT("Begin setCoingeckoPricesOnTokens for chain " + chain);
  const start = Date.now();

  const tokens: ExternalToken[] = ExternalTokenModelSingleton.getTokens(
    chain,
  ).filter((val) => isCgFetchType(val));
  const withContractIds = tokens.filter((x) => isCgFetchTypeContract(x));
  const contractIds = withContractIds.map((x) => x.contractAddr);
  const result = await fetchCoingeckoPricesByContractNtimes(contractIds, 5);
  for (let j = 0; j < withContractIds.length; j++) {
    const price = result.get(withContractIds[j].contractAddr);
    if (price) withContractIds[j].price = price;
  }

  // Now do ids
  const withCoinGeckoIds = tokens.filter(
    (x) => x.fetchType === ExternalTokenFetchStyle.ID,
  );
  const cgIds = withCoinGeckoIds.map((x) => x.coingeckoId);
  const idResult = await fetchCoinGeckoPricesBySearchId(cgIds);
  for (let j = 0; j < withCoinGeckoIds.length; j++) {
    const price = idResult.get(withCoinGeckoIds[j].coingeckoId);
    if (price) withCoinGeckoIds[j].price = price;
  }
  DEBUG_OUT(
    "End setCoingeckoPricesOnTokens for chain " +
      chain +
      ": " +
      (Date.now() - start),
  );
  //const missing = withContractIds.filter((x) => result.get(x.contractAddr) === undefined);
  //const missingIds = withCoinGeckoIds.filter((x) => idResult.get(x.coingeckoId) === undefined);
  // console.log(`${chain} contractids requests ${contractIds.length} and got ${result.size}`);
  // console.log(JSON.stringify(missing, null, 2));

  // console.log(`${chain} cgIds requests ${withCoinGeckoIds.length} and got ${idResult.size}`);
  // console.log(JSON.stringify(missingIds, null, 2));
};
