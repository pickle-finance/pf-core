import { CoinGeckoPriceResolver } from "../../src/price/CoinGeckoPriceResolver";
import { ExternalTokenModelSingleton } from "../../src/price/ExternalTokenModel";
import { PriceCache } from "../../src/price/PriceCache";

describe("PriceCache", () => {
  test("Call get prices for several coins, short name", async () => {
    const pm: PriceCache = new PriceCache();
    const cgResolver = new CoinGeckoPriceResolver(ExternalTokenModelSingleton);

    const keys: string[] = ["wbtc", "weth"];
    const ret1: Map<string, number> = await pm.getPrices(keys, cgResolver);
    expect(ret1.size).toBeGreaterThanOrEqual(2);

    const keys2: string[] = ["weth", "crv"];
    const ret2: Map<string, number> = await pm.getPrices(keys2, cgResolver);
    expect(ret2.size).toBeGreaterThanOrEqual(3);

    pm.clear();
    expect(pm.getCache().size).toBe(0);
    const all3WithDup = keys.concat(keys2);
    const ret3: Map<string, number> = await pm.getPrices(
      all3WithDup,
      cgResolver,
    );
    expect(ret3.size).toBeGreaterThanOrEqual(3);
  }, 7000);

  test("Second request, all are cached already", async () => {
    const pm: PriceCache = new PriceCache();
    const cgResolver = new CoinGeckoPriceResolver(ExternalTokenModelSingleton);

    const keys: string[] = ["wbtc", "weth"];
    const ret1: Map<string, number> = await pm.getPrices(keys, cgResolver);
    expect(ret1.size).toBeGreaterThanOrEqual(2);

    const keys2: string[] = ["weth"];
    const ret2: Map<string, number> = await pm.getPrices(keys2, cgResolver);
    expect(ret2.size).toBeGreaterThanOrEqual(2);
  }, 7000);

  test("Return cached id data when asking for contracts", async () => {
    const pm: PriceCache = new PriceCache();
    const cgResolver = new CoinGeckoPriceResolver(ExternalTokenModelSingleton);

    pm.put("dai", 4.52);
    pm.put("weth", 100);
    // sushi pair 0xc3d03e4f041fd4cd388c549ee2a29a9e5075882f has the following two contracts
    const contract1 = "0x6b175474e89094c44da98b954eedeac495271d0f";
    const contract2 = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";

    const ret1: Map<string, number> = await pm.getPrices(
      [contract1, contract2],
      cgResolver,
    );

    expect(ret1).toBeDefined();
    expect(ret1.get(contract1)).toBeDefined();
    expect(ret1.get(contract2)).toBeDefined();
    expect(ret1.get(contract1)).toBe(4.52);
    expect(ret1.get(contract2)).toBe(100);
  }, 7000);

  test("Return new data when asking for contracts if not all are in cache", async () => {
    const pm: PriceCache = new PriceCache();
    const cgResolver = new CoinGeckoPriceResolver(ExternalTokenModelSingleton);
    pm.put("dai", 4.52);

    // sushi pair 0xc3d03e4f041fd4cd388c549ee2a29a9e5075882f has the following two contracts
    const contract1 = "0x6b175474e89094c44da98b954eedeac495271d0f";
    const contract2 = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";

    const ret1: Map<string, number> = await pm.getPrices(
      [contract1, contract2],
      cgResolver,
    );
    expect(ret1).toBeDefined();
    expect(ret1.get(contract1)).toBeDefined();
    expect(ret1.get(contract2)).toBeDefined();
    expect(ret1.get(contract1)).toBeGreaterThan(0.9);
    expect(ret1.get(contract1)).toBeLessThan(1.1);
    expect(ret1.get(contract2)).toBeGreaterThan(200);
  }, 7000);
});
