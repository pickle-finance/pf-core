import { Chain } from "../../src/chain/ChainModel";

import { PriceCache, RESOLVER_COINGECKO } from "../../src/price/PriceCache";
import { DepositTokenPriceResolver } from "../../src/price/DepositTokenPriceResolver";
import { JAR_DEFINITIONS } from "../../src/model/JarsAndFarms";
import { PROTOCOL_TYPE_UNISWAP, PROTOCOL_TYPE_SUSHISWAP, PROTOCOL_TYPE_SUSHISWAP_POLYGON, PROTOCOL_TYPE_COMETHSWAP, PROTOCOL_TYPE_QUICKSWAP_POLYGON } from "../../src/model/PickleModelJson";
import { CoinGeckoPriceResolver } from "../../src/price/CoinGeckoPriceResolver";
import { ExternalTokenModelSingleton } from "../../src/price/ExternalTokenModel";

describe('Swap Token Price Resolver', () => {
  function getCleanPriceCache() : PriceCache {
    const pm : PriceCache = new PriceCache();
    pm.addResolver(RESOLVER_COINGECKO, new CoinGeckoPriceResolver(ExternalTokenModelSingleton));
    return pm;
  }
  test('Get a uniswap LP contract price', async () => {    
    const fromLP : number = await new DepositTokenPriceResolver(JAR_DEFINITIONS).getTokenPriceFromGraph(PROTOCOL_TYPE_UNISWAP, "0x87da823b6fc8eb8575a235a824690fda94674c88", getCleanPriceCache());
    expect(fromLP).toBeDefined();
    expect(fromLP).toBeGreaterThan(0);
  });


  test('Get a sushiswap LP contract price', async () => {
    const fromLP : number = await new DepositTokenPriceResolver(JAR_DEFINITIONS).getTokenPriceFromGraph(PROTOCOL_TYPE_SUSHISWAP, "0x397ff1542f962076d0bfe58ea045ffa2d347aca0", getCleanPriceCache());
    expect(fromLP).toBeDefined();
    expect(fromLP).toBeGreaterThan(0);
  });

  test('Get a sushiswap_polygon LP contract price', async () => {    
    const fromLP : number = await new DepositTokenPriceResolver(JAR_DEFINITIONS).getTokenPriceFromGraph(PROTOCOL_TYPE_SUSHISWAP_POLYGON, "0xc2755915a85C6f6c1C0F3a86ac8C058F11Caa9C9", getCleanPriceCache());
    expect(fromLP).toBeDefined();
    expect(fromLP).toBeGreaterThan(0);
  });

  test('Get a comethswap LP contract price', async () => {    
    const fromLP : number = await new DepositTokenPriceResolver(JAR_DEFINITIONS).getTokenPriceFromGraph(PROTOCOL_TYPE_COMETHSWAP, "0x1edb2d8f791d2a51d56979bf3a25673d6e783232", getCleanPriceCache());
    expect(fromLP).toBeDefined();
    expect(fromLP).toBeGreaterThan(0);
  });

  test('Get a quickswap_polygon LP contract price', async () => {    
    const fromLP : number = await new DepositTokenPriceResolver(JAR_DEFINITIONS).getTokenPriceFromGraph(PROTOCOL_TYPE_QUICKSWAP_POLYGON, "0x160532d2536175d65c03b97b0630a9802c274dad", getCleanPriceCache());
    expect(fromLP).toBeDefined();
    expect(fromLP).toBeGreaterThan(0);
  });

  test('Verify all jars and farms have a protocol', async () => {    
    const resolver : DepositTokenPriceResolver = new DepositTokenPriceResolver(JAR_DEFINITIONS);
    for( let i = 0; i < JAR_DEFINITIONS.length; i++ ) {
      expect(resolver.getProtocolFromDepositToken(JAR_DEFINITIONS[i].depositToken.addr)).toBeDefined();
    }
  });

  test('Verify all jars and farms on eth can have the price discovered', async () => {
    const resolver : DepositTokenPriceResolver = new DepositTokenPriceResolver(JAR_DEFINITIONS);
    const ethAssets = JAR_DEFINITIONS.filter(asset => asset.chain === Chain.Ethereum && asset.protocol !== 'compound');
    const cache : PriceCache = getCleanPriceCache();
    for( let i = 0; i < ethAssets.length; i++ ) {
      const result = await resolver.getOrResolve([JAR_DEFINITIONS[i].depositToken.addr], cache);
      expect(result).toBeDefined();
      expect(result).not.toBeNull();
    }
  },30000);


  test('Verify all jars and farms on polygon can have the price discovered', async () => {
    const resolver : DepositTokenPriceResolver = new DepositTokenPriceResolver(JAR_DEFINITIONS);
    const ethAssets = JAR_DEFINITIONS.filter(asset => asset.chain === Chain.Polygon);
    const cache : PriceCache = getCleanPriceCache();
    for( let i = 0; i < ethAssets.length; i++ ) {
      const result = await resolver.getOrResolve([JAR_DEFINITIONS[i].depositToken.addr], cache);
      expect(result).toBeDefined();
      expect(result).not.toBeNull();
    }
  },30000);

});
