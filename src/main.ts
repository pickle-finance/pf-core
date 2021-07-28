import { getDefaultProvider } from "@ethersproject/providers";
import { Chain } from "./chain/ChainModel";
import { JarHarvestData } from "./harvest/JarHarvestResolver";
import { SaddleD4HarvestResolver } from "./harvest/SaddleD4HarvestResolver";
import { JAR_SADDLE_D4 } from "./model/PickleModel";
import { CoinGeckpPriceResolver } from "./price/CoinGeckoPriceResolver";
import { ExternalTokenFetchStyle, ExternalTokenModelSingleton } from "./price/ExternalTokenModel";
import { PriceCache } from "./price/PriceCache";

async function doStuff() {
  const d4Resolver : SaddleD4HarvestResolver = new SaddleD4HarvestResolver();
  const prices : PriceCache = new PriceCache();
  const arr: string[] = ExternalTokenModelSingleton.getTokens(Chain.Ethereum).filter(val => val.fetchType != ExternalTokenFetchStyle.NONE).map(a => a.coingeckoId);
  await prices.getPrices(arr, new CoinGeckpPriceResolver(ExternalTokenModelSingleton));
  console.log("Got Prices");
  const result : JarHarvestData = await d4Resolver.getJarHarvestData(JAR_SADDLE_D4, prices, getDefaultProvider("homestead"));
  console.log(result);
}

doStuff();