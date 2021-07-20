import { Chain } from './chain/ChainModel';
import { CoinGeckpPriceResolver } from './price/CoinGeckoPriceResolver';
import { ExternalTokenModelSingleton } from './price/ExternalTokenModel';
import { PriceCache } from './price/PriceCache';

doStuff();

async function doStuff() {
    const arr: string[] = ExternalTokenModelSingleton.getTokens(Chain.Ethereum).map(a => a.coingeckoId);

    const ret : Map<string,number> = await new PriceCache().getPrices(
       arr, new CoinGeckpPriceResolver(ExternalTokenModelSingleton));
    console.log(ret);
}