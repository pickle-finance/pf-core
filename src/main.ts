import { Chain } from "./chain/ChainModel";
import { jars } from "./model/PickleModel";
import { CoinGeckpPriceResolver } from "./price/CoinGeckoPriceResolver";
import { DepositTokenPriceResolver } from "./price/DepositTokenPriceResolver";
import { ExternalTokenFetchStyle, ExternalTokenModelSingleton } from "./price/ExternalTokenModel";
import { PriceCache } from "./price/PriceCache";

async function doStuff() {
  const arr: string[] = ExternalTokenModelSingleton.getTokens(Chain.Ethereum).filter(val => val.fetchType != ExternalTokenFetchStyle.NONE).map(a => a.coingeckoId);
  const cache : PriceCache = new PriceCache();
  await cache.getPrices(arr, new CoinGeckpPriceResolver(ExternalTokenModelSingleton));

  const depositTokenResolver : DepositTokenPriceResolver = new DepositTokenPriceResolver(jars);
  for( let i = 0; i < jars.length; i++ ) {
    const price : number = await depositTokenResolver.getOrResolveSingle(jars[i].depositToken, cache);
    console.log("Price for " + jars[i].id + "'s deposit token " + jars[i].depositToken + " is " + price);
  }
}

doStuff();