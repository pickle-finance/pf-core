import CoinGecko from "coingecko-api";
import fetch from "cross-fetch";
import { AbstractPriceResolver } from "./AbstractPriceResolver";
import { ExternalTokenModel } from "./ExternalTokenModel";
import { IPriceResolver } from "./IPriceResolver";

/**
 * This class will enter all values in the cache using a contract key.
 * It will accept symbols (usdc), or contract addresses, as search keys.
 * The returned map should include the data in the form the user requested it.
 *
 * This class will only query for symbols that are defined in the ExternalTokenModel.
 */
export class CoinGeckoPriceResolver extends AbstractPriceResolver implements IPriceResolver {
  constructor(tokenModel: ExternalTokenModel) {
    super(tokenModel);
  }

  protected async fetchPricesBySearchId(
    geckoNames: string[],
  ): Promise<Map<string, number>> {
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
  }

  protected async fetchPricesByContracts(
    contractIds: string[],
  ): Promise<Map<string, number>> {
    const joined = contractIds.join("%2C");
    const url = `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${joined}&vs_currencies=usd`;
    try {
      const contractPrice = await fetch(url);
      // Debug
      /*  
            const contractPrice = await fetch(url).then(response => {
                if (response.ok) {
                  response.json().then((data) => {
                    console.log(data);
                  });  
                } else {
                    console.log("Something wrong");
                    throw 'There is something wrong';
                }
              }).
              catch(error => {
                  console.log(error);
              });
            console.log("After fetch");
              */
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
  }
}

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
