import fetch from "cross-fetch";
import { ChainNetwork } from "..";
import { DEBUG_OUT } from "../model/PickleModel";
import { isCgFetchType, isCgFetchTypeContract } from "../model/PriceCacheLoader";
import { FuncsQueue, timeout } from "../util/PromiseTimeout";
import { ExternalToken, ExternalTokenFetchStyle, ExternalTokenModelSingleton } from "./ExternalTokenModel";
import dotenv from "dotenv";
dotenv.config();

export const fetchCoingeckoPricesByContractNtimes = async (
  contractIds: string[],
  times: number,
): Promise<Map<string, number>> => {
  for (let i = 0; i < times; i++) {
    try {
      const promise1 = await timeout(
        CoinGeckoPriceResolverSingleton.fetchPricesByContract(contractIds),
        4000,
        new Error("PfCoreTimeoutError_fetchCoingeckoPricesByContractNtimes"),
      );
      return promise1;
    } catch (err) {
      console.log("Timeout fetching cg prices: " + err);
      // Do nothing
    }
  }
  // We still haven't returned, so we have no prices :|
  throw new Error("Cannot load prices for various contracts after several retries");
};

export class CoinGeckoPriceResolver {
  apiKey: string;
  proUrl = "https://pro-api.coingecko.com/api/v3/";
  publicUrl = "https://api.coingecko.com/api/v3/";

  assetPlatforms = new Map<ChainNetwork, string>([
    [ChainNetwork.Ethereum, "ethereum"],
    [ChainNetwork.Polygon, "polygon-pos"],
    [ChainNetwork.Arbitrum, "arbitrum-one"],
    [ChainNetwork.OKEx, "okex-chain"],
    [ChainNetwork.Moonriver, "moonriver"],
    [ChainNetwork.Moonbeam, "moonbeam"],
    [ChainNetwork.Cronos, "cronos"],
    [ChainNetwork.Aurora, "aurora"],
    [ChainNetwork.Metis, "metis-andromeda"],
    [ChainNetwork.Optimism, "optimistic-ethereum"],
    [ChainNetwork.Fantom, "fantom"],
    [ChainNetwork.Gnosis, "xdai"],
    [ChainNetwork.Kava, "kava"],
  ]);

  pricesCache: { id: { [id: string]: number }; address: { [assetPlatform: string]: { [address: string]: number } } } = {
    id: {},
    address: {},
  };

  queuer = new FuncsQueue();

  constructor(proApiKey: string = undefined) {
    const key = proApiKey ?? process.env.COINGECKO_API_KEY;
    if (key) this.apiKey = "x_cg_pro_api_key=" + key;

    // Initialize prices cache
    this.assetPlatforms.forEach((x) => (this.pricesCache.address[x] = {}));
  }

  async fetchHistoricalPriceSeries(
    coinId: string,
    options: {
      from: Date;
    },
  ): Promise<[number, number][]> {
    const toDate = new Date();
    /**
     * Fetching more than 90 days gives us daily data points (instead of hourly)
     * resulting in a much smaller payload.
     */
    const fromDate =
      getDayDiff(options.from, toDate) > 90 ? options.from : new Date(toDate.getTime() - 91 * 24 * 60 * 60 * 1000);

    const fromUNIX = Math.round(fromDate.getTime() / 1000);
    const toUNIX = Math.round(toDate.getTime() / 1000);

    const api = this.appendFullUrl(`coins/${coinId}/market_chart/range?vs_currency=usd&from=${fromUNIX}&to=${toUNIX}`);
    try {
      const resp = await fetch(api);
      const json = await resp.json();
      return json.prices;
    } catch (err) {
      console.log("error");
      console.log(err);
      return null;
    }
  }

  async fetchPricesById(geckoNames: string[]): Promise<Map<string, number>> {
    // Calls get executed one at a time to prevent redundant calls (prioritize prices cache)
    return await this.queuer.queueDifferentResultsOneAtATime(async () => {
      return await this.fetchPricesByIdWrapper(geckoNames);
    }, "id");
  }

  async fetchPricesByIdWrapper(geckoNames: string[]): Promise<Map<string, number>> {
    const returnMap: Map<string, number> = new Map<string, number>();

    const missing: string[] = [];

    // From cache
    geckoNames.forEach((id) => {
      if (this.pricesCache.id[id]) {
        returnMap.set(id, this.pricesCache.id[id]);
      } else {
        missing.push(id);
      }
    });

    // Fetch missing
    if (missing.length) {
      const ids = missing.join("%2C");
      const api = this.appendFullUrl(`simple/price?ids=${ids}&vs_currencies=usd`);
      try {
        const contractPrice = await fetch(api);
        const resp = await contractPrice.json();
        Object.keys(resp).map((id) => {
          returnMap.set(id, resp[id].usd);
          this.pricesCache.id[id] = resp[id].usd;
        });
      } catch (err) {
        console.log("error");
        console.log(err);
        return null;
      }
    }

    return returnMap;
  }

  async fetchPricesByContract(
    contractIds: string[],
    chain: ChainNetwork = ChainNetwork.Ethereum,
  ): Promise<Map<string, number>> {
    return await this.queuer.queueDifferentResultsOneAtATime(async () => {
      return await this.fetchPricesByContractWrapper(contractIds, chain);
    }, chain);
  }

  async fetchPricesByContractWrapper(
    contractIds: string[],
    chain: ChainNetwork = ChainNetwork.Ethereum,
  ): Promise<Map<string, number>> {
    const returnMap: Map<string, number> = new Map<string, number>();

    const missing: string[] = [];

    const assetPlatform = this.assetPlatforms.get(chain);
    if (!assetPlatform) {
      throw new Error(`No registered assetPlatform ID is registered for ${chain} chain!`);
    }

    // From cache
    contractIds.forEach((id) => {
      if (this.pricesCache.address[assetPlatform][id]) {
        returnMap.set(id, this.pricesCache.address[assetPlatform][id]);
      } else {
        missing.push(id);
      }
    });

    // Fetch missing
    if (missing.length) {
      const ids = missing.join("%2C");
      const api = this.appendFullUrl(`simple/token_price/${assetPlatform}?contract_addresses=${ids}&vs_currencies=usd`);
      try {
        const resp = await fetch(api);
        const json = await resp.json();
        Object.keys(json).forEach((addr) => {
          returnMap.set(addr, json[addr].usd);
          this.pricesCache.address[assetPlatform][addr] = json[addr].usd;
        });
      } catch (err) {
        console.log("error");
        console.log(err);
        return null;
      }
    }

    return returnMap;
  }

  async setCoingeckoPricesOnTokens(chain: ChainNetwork): Promise<void> {
    DEBUG_OUT("Begin setCoingeckoPricesOnTokens for chain " + chain);
    const start = Date.now();

    const tokens: ExternalToken[] = ExternalTokenModelSingleton.getTokens(chain).filter((val) => isCgFetchType(val));
    const withContractIds = tokens.filter((x) => isCgFetchTypeContract(x));
    const contractIds = withContractIds.map((x) => x.contractAddr);
    const result = await this.fetchPricesByContract(contractIds, chain);
    for (let j = 0; j < withContractIds.length; j++) {
      const price = result.get(withContractIds[j].contractAddr);
      if (price) withContractIds[j].price = price;
    }

    // Now do ids
    const withCoinGeckoIds = tokens.filter((x) => x.fetchType === ExternalTokenFetchStyle.ID);
    const cgIds = withCoinGeckoIds.map((x) => x.coingeckoId);
    const idResult = await this.fetchPricesById(cgIds);
    for (let j = 0; j < withCoinGeckoIds.length; j++) {
      const price = idResult.get(withCoinGeckoIds[j].coingeckoId);
      if (price) withCoinGeckoIds[j].price = price;
    }
    DEBUG_OUT("End setCoingeckoPricesOnTokens for chain " + chain + ": " + (Date.now() - start));
    //const missing = withContractIds.filter((x) => result.get(x.contractAddr) === undefined);
    //const missingIds = withCoinGeckoIds.filter((x) => idResult.get(x.coingeckoId) === undefined);
    // console.log(`${chain} contractids requests ${contractIds.length} and got ${result.size}`);
    // console.log(JSON.stringify(missing, null, 2));

    // console.log(`${chain} cgIds requests ${withCoinGeckoIds.length} and got ${idResult.size}`);
    // console.log(JSON.stringify(missingIds, null, 2));
  }

  appendFullUrl(body: string): string {
    if (this.apiKey) return `${this.proUrl}${body}&${this.apiKey}`;
    return `${this.publicUrl}${body}`;
  }
}

// TODO move to better location
const getDayDiff = (date1: Date, date2: Date): number => {
  return Math.ceil((date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24));
};

export const CoinGeckoPriceResolverSingleton = new CoinGeckoPriceResolver();
