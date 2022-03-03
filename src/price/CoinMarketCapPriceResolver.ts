import fetch from "cross-fetch";
import { ExternalTokenFetchStyle, ExternalTokenModelSingleton } from "./ExternalTokenModel";

export const setAllCoinMarketCapPricesOnTokens = async(): Promise<void> => {
  const all = ExternalTokenModelSingleton.getAllTokens();
  const filtered = all.filter(
    (val) => val.fetchType === ExternalTokenFetchStyle.COIN_MARKET_CAP,
  );
  const ret = await fetchCoinmarketCapPricesBySearchIdImpl(filtered.map((x) => x.coingeckoId));
  for( let i = 0; i < filtered.length; i++ ) {
    if( ret.get(filtered[i].coingeckoId)) {
      filtered[i].price = ret.get(filtered[i].coingeckoId);
    }
  }
}

const fetchCoinmarketCapPricesBySearchIdImpl = async(
  searchNames: string[],
): Promise<Map<string, number>> => {
  if( searchNames === undefined || searchNames.length === 0 ) {
    return new Map<string, number>();
  }

  const joined = searchNames.join(",");
  const url =
    "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?CMC_PRO_API_KEY=2ba4867e-b50f-44d7-806d-c0c5fde1a8db&slug=" +
    joined;
  const url2 =
    "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?CMC_PRO_API_KEY=2b734062-7f54-4850-883b-eea8eadbbd51&slug=" +
    joined;
  const res = await fetch(url).then((x) => x.json());
  let data = res.data;
  if (!data) {
    // failsafe in case the first api key monthly limit is reached
    const res = await fetch(url2).then((x) => x.json());
    data = res.data;
  }
  const ret = new Map<string, number>();
  for (let i = 0; i < searchNames.length; i++) {
    const keys = Object.keys(data);
    const found = keys.find(
      (x) =>
        data[x].name === searchNames[i] || data[x].slug === searchNames[i],
    );
    if (found) {
      const price = data[found]?.quote?.USD?.price;
      if (price) ret.set(searchNames[i], price);
    }
  }
  return ret;
}
