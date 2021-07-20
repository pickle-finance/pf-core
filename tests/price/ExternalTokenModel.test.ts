import { Chain } from '../../src/chain/ChainModel';
import { CoinGeckpPriceResolver } from '../../src/price/CoinGeckoPriceResolver';
import { ExternalTokenFetchStyle, ExternalTokenModelSingleton } from '../../src/price/ExternalTokenModel';
import { PriceCache } from '../../src/price/PriceCache';

describe('Coingecko and external token integration', () => {

  test('Ether token test', async () => {
    const pm : PriceCache = new PriceCache();

    const arr: string[] = ExternalTokenModelSingleton.getTokens(Chain.Ethereum).filter(val => val.fetchType != ExternalTokenFetchStyle.NONE).map(a => a.coingeckoId);
    const ret : Map<string,number> = await pm.getPrices(arr, new CoinGeckpPriceResolver(ExternalTokenModelSingleton));
    expect(ret).toBeDefined();
    const err : string[] = [];
    for( const i of arr ) {
      if( ret.get(i) === undefined ) {
        err.push("Coin " + i + " not found in CoinGecko result: eth")
      }
    }

    const polyArr: string[] = ExternalTokenModelSingleton.getTokens(Chain.Polygon).map(a => a.coingeckoId);
    const polyRet : Map<string,number> = await pm.getPrices(polyArr, new CoinGeckpPriceResolver(ExternalTokenModelSingleton));
    for( const i of polyArr ) {
      if( polyRet.get(i) === undefined ) {
        err.push("Coin " + i + " not found in CoinGecko result: poly")
      }
    }

    if( err.length > 0 ) {
      throw new Error(err.join("\n"));
    }

    expect(ret.size).toBeGreaterThanOrEqual(arr.length);
    expect(polyRet.size).toBeGreaterThanOrEqual(polyArr.length);

    for( let i = 0; i < arr.length; i++ ) {
      expect(ret.get(arr[i])).toBeDefined();
    }
    for( let i = 0; i < polyArr.length; i++ ) {
      expect(polyRet.get(polyArr[i])).toBeDefined();
    }
  });

  test('Simple gets', async () => {
    const daiEth = ExternalTokenModelSingleton.getToken("dai", Chain.Ethereum);
    const daiPoly = ExternalTokenModelSingleton.getToken("dai", Chain.Polygon);

    const mustEth = ExternalTokenModelSingleton.getToken("must", Chain.Ethereum);
    const mustPoly = ExternalTokenModelSingleton.getToken("must", Chain.Polygon);

    expect(daiEth).not.toBeNull();
    expect(daiPoly).not.toBeNull();
    expect(mustPoly).not.toBeNull();
    expect(mustEth).not.toBeDefined();
  });

});