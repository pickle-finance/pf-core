import { CoinGeckoPriceResolver } from "../../src/price/CoinGeckoPriceResolver";
import { ExternalTokenModelSingleton } from "../../src/price/ExternalTokenModel";
import { PriceCache, RESOLVER_COINGECKO} from "../../src/price/PriceCache";

describe('Testing coingecko', () => {

  async function getPrices(str: string[]) : Promise<Map<string,number>> {
    const pc : PriceCache = new PriceCache();
    pc.addResolver(RESOLVER_COINGECKO, new CoinGeckoPriceResolver(ExternalTokenModelSingleton));
    return await pc.getPrices(str, RESOLVER_COINGECKO);
  }

  test('Call get prices for single coin, short name', async () => {
    const lqtyStr : string[] = ["lqty"];
    const data : Map<string,number> = await getPrices(lqtyStr);
    expect(data).toBeDefined();
    expect(data.get("lqty")).toBeDefined();
    expect(data.get("lqty")).toBeGreaterThan(0);
    
  }); 
  test('Call get prices for single coin, gecko name', async () => {
    const lqtyStr : string[] = ["liquity"];
    const data : Map<string,number> = await getPrices(lqtyStr);
    expect(data).toBeDefined();
    expect(data.get("liquity")).toBeDefined();
    expect(data.get("liquity")).toBeGreaterThan(0);  
  });
  test('Call get prices for several coins, short name', async () => {
    const keys : string[] = ["liquity", "tribe-2", "mirrored-apple"];
    const data : Map<string,number> = await getPrices(keys);
    expect(data).toBeDefined();
    expect(data.size).toBeGreaterThanOrEqual(3);
    expect(data.get("liquity")).toBeDefined();
    expect(data.get("liquity")).not.toBe(null);
    expect(data.get("tribe-2")).toBeDefined();
    expect(data.get("tribe-2")).not.toBe(null);
    expect(data.get("mirrored-apple")).toBeDefined();
    expect(data.get("mirrored-apple")).not.toBe(null);
    expect(data.get("NotThere")).toBeUndefined();
  });

  test('Get coingecko prices by contract id', async() => {
    // sushi pair 0xc3d03e4f041fd4cd388c549ee2a29a9e5075882f has the following two contracts
    const contract1 = "0x6b175474e89094c44da98b954eedeac495271d0f";
    const contract2 = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
    const ret = await getPrices([contract1, contract2]);
    expect(ret).toBeDefined();
    expect(ret.get(contract1)).toBeDefined();
    expect(ret.get(contract2)).toBeDefined();

    // dollar coin
    expect(ret.get(contract1)).toBeGreaterThan(0.9);
    expect(ret.get(contract1)).toBeLessThan(1.1);
    // eth?
    expect(ret.get(contract2)).toBeGreaterThan(800);
    expect(ret.get(contract2)).toBeLessThan(1000000);
  });
});
