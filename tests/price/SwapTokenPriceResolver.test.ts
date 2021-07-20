import { PROTOCOL_TYPE_UNISWAP, PROTOCOL_TYPE_SUSHISWAP, PROTOCOL_TYPE_SUSHISWAP_POLYGON, PROTOCOL_TYPE_COMETHSWAP, PROTOCOL_TYPE_QUICKSWAP_POLYGON } from "../../src/graph/TheGraph";
import { SwapTokenPriceResolver } from "../../src/price/SwapTokenPriceResolver";

describe('Swap Token Price Resolver', () => {

  test('Get a uniswap LP contract price', async () => {    
    const fromLP : number = await new SwapTokenPriceResolver().getTokenPriceFromGraph(PROTOCOL_TYPE_UNISWAP, "0x87da823b6fc8eb8575a235a824690fda94674c88");
    expect(fromLP).toBeDefined();
    expect(fromLP).toBeGreaterThan(0);
  });


  test('Get a sushiswap LP contract price', async () => {
    const fromLP : number = await new SwapTokenPriceResolver().getTokenPriceFromGraph(PROTOCOL_TYPE_SUSHISWAP, "0x397ff1542f962076d0bfe58ea045ffa2d347aca0");
    expect(fromLP).toBeDefined();
    expect(fromLP).toBeGreaterThan(0);
  });

  test('Get a sushiswap_polygon LP contract price', async () => {    
    jest.setTimeout(100000);
    const fromLP : number = await new SwapTokenPriceResolver().getTokenPriceFromGraph(PROTOCOL_TYPE_SUSHISWAP_POLYGON, "0xc2755915a85C6f6c1C0F3a86ac8C058F11Caa9C9");
    expect(fromLP).toBeDefined();
    expect(fromLP).toBeGreaterThan(0);
  });

  test('Get a comethswap LP contract price', async () => {    
    const fromLP : number = await new SwapTokenPriceResolver().getTokenPriceFromGraph(PROTOCOL_TYPE_COMETHSWAP, "0x1edb2d8f791d2a51d56979bf3a25673d6e783232");
    expect(fromLP).toBeDefined();
    expect(fromLP).toBeGreaterThan(0);
  });

  test('Get a quickswap_polygon LP contract price', async () => {    
    const fromLP : number = await new SwapTokenPriceResolver().getTokenPriceFromGraph(PROTOCOL_TYPE_QUICKSWAP_POLYGON, "0x160532d2536175d65c03b97b0630a9802c274dad");
    expect(fromLP).toBeDefined();
    expect(fromLP).toBeGreaterThan(0);
  });
});
