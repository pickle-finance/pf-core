import { Chain } from "../../src/chain/ChainModel";

import { PriceCache } from "../../src/price/PriceCache";
import { DepositTokenPriceResolver } from "../../src/price/DepositTokenPriceResolver";
import { allAssets } from "../../src/model/JarsAndFarms";
import { PROTOCOL_TYPE_UNISWAP, PROTOCOL_TYPE_SUSHISWAP, PROTOCOL_TYPE_SUSHISWAP_POLYGON, PROTOCOL_TYPE_COMETHSWAP, PROTOCOL_TYPE_QUICKSWAP_POLYGON } from "../../src/model/PickleModelJson";

describe('Swap Token Price Resolver', () => {

  test('Get a uniswap LP contract price', async () => {    
    const fromLP : number = await new DepositTokenPriceResolver(allAssets).getTokenPriceFromGraph(PROTOCOL_TYPE_UNISWAP, "0x87da823b6fc8eb8575a235a824690fda94674c88", new PriceCache());
    expect(fromLP).toBeDefined();
    expect(fromLP).toBeGreaterThan(0);
  });


  test('Get a sushiswap LP contract price', async () => {
    const fromLP : number = await new DepositTokenPriceResolver(allAssets).getTokenPriceFromGraph(PROTOCOL_TYPE_SUSHISWAP, "0x397ff1542f962076d0bfe58ea045ffa2d347aca0", new PriceCache());
    expect(fromLP).toBeDefined();
    expect(fromLP).toBeGreaterThan(0);
  });

  test('Get a sushiswap_polygon LP contract price', async () => {    
    const fromLP : number = await new DepositTokenPriceResolver(allAssets).getTokenPriceFromGraph(PROTOCOL_TYPE_SUSHISWAP_POLYGON, "0xc2755915a85C6f6c1C0F3a86ac8C058F11Caa9C9", new PriceCache());
    expect(fromLP).toBeDefined();
    expect(fromLP).toBeGreaterThan(0);
  });

  test('Get a comethswap LP contract price', async () => {    
    const fromLP : number = await new DepositTokenPriceResolver(allAssets).getTokenPriceFromGraph(PROTOCOL_TYPE_COMETHSWAP, "0x1edb2d8f791d2a51d56979bf3a25673d6e783232", new PriceCache());
    expect(fromLP).toBeDefined();
    expect(fromLP).toBeGreaterThan(0);
  });

  test('Get a quickswap_polygon LP contract price', async () => {    
    const fromLP : number = await new DepositTokenPriceResolver(allAssets).getTokenPriceFromGraph(PROTOCOL_TYPE_QUICKSWAP_POLYGON, "0x160532d2536175d65c03b97b0630a9802c274dad", new PriceCache());
    expect(fromLP).toBeDefined();
    expect(fromLP).toBeGreaterThan(0);
  });

  test('Verify all jars and farms have a protocol', async () => {    
    const resolver : DepositTokenPriceResolver = new DepositTokenPriceResolver(allAssets);
    for( let i = 0; i < allAssets.length; i++ ) {
      expect(resolver.getProtocolFromDepositToken(allAssets[i].depositToken)).toBeDefined();
    }
  });

  test('Verify all jars and farms on eth can have the price discovered', async () => {
    const resolver : DepositTokenPriceResolver = new DepositTokenPriceResolver(allAssets);
    const ethAssets = allAssets.filter(asset => asset.chain === Chain.Ethereum && asset.protocol !== 'compound');
    const cache : PriceCache = new PriceCache();
    for( let i = 0; i < ethAssets.length; i++ ) {
      const result = await resolver.getOrResolve([allAssets[i].depositToken], cache);
      expect(result).toBeDefined();
      expect(result).not.toBeNull();
    }
  },30000);


  test('Verify all jars and farms on polygon can have the price discovered', async () => {
    const resolver : DepositTokenPriceResolver = new DepositTokenPriceResolver(allAssets);
    const ethAssets = allAssets.filter(asset => asset.chain === Chain.Polygon);
    const cache : PriceCache = new PriceCache();
    for( let i = 0; i < ethAssets.length; i++ ) {
      const result = await resolver.getOrResolve([allAssets[i].depositToken], cache);
      expect(result).toBeDefined();
      expect(result).not.toBeNull();
    }
  },30000);

});
