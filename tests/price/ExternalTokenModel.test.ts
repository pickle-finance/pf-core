import { ChainNetwork, Chains } from "../../src/chain/Chains";
import { IExternalToken } from "../../src/model/PickleModelJson";
import { CoinGeckoPriceResolver } from "../../src/price/CoinGeckoPriceResolver";
import {
  ExternalTokenFetchStyle,
  ExternalTokenModelSingleton,
} from "../../src/price/ExternalTokenModel";
import { PriceCache } from "../../src/price/PriceCache";

describe("Coingecko and external token integration", () => {
  test("Ether token test", async () => {
    const pm: PriceCache = new PriceCache();
    const arr: string[] = ExternalTokenModelSingleton.getTokens(
      ChainNetwork.Ethereum,
    )
      .filter((val) => val.fetchType != ExternalTokenFetchStyle.NONE)
      .map((a) => a.coingeckoId);
    const ret: Map<string, number> = await pm.getPrices(
      arr,
      new CoinGeckoPriceResolver(ExternalTokenModelSingleton),
    );
    expect(ret).toBeDefined();
    const err: string[] = [];
    for (const i of arr) {
      if (ret.get(i) === undefined) {
        err.push("Coin " + i + " not found in CoinGecko result: eth");
      }
    }

    const polyArr: string[] = ExternalTokenModelSingleton.getTokens(
      ChainNetwork.Polygon,
    ).map((a) => a.coingeckoId);
    const polyRet: Map<string, number> = await pm.getPrices(
      polyArr,
      new CoinGeckoPriceResolver(ExternalTokenModelSingleton),
    );
    for (const i of polyArr) {
      if (polyRet.get(i) === undefined) {
        err.push("Coin " + i + " not found in CoinGecko result: poly");
      }
    }

    if (err.length > 0) {
      throw new Error(err.join("\n"));
    }

    expect(ret.size).toBeGreaterThanOrEqual(arr.length);
    expect(polyRet.size).toBeGreaterThanOrEqual(polyArr.length);

    for (let i = 0; i < arr.length; i++) {
      expect(ret.get(arr[i])).toBeDefined();
    }
    for (let i = 0; i < polyArr.length; i++) {
      expect(polyRet.get(polyArr[i])).toBeDefined();
    }
  }, 8000);

  test("Simple gets", async () => {
    const daiEth = ExternalTokenModelSingleton.getToken(
      "dai",
      ChainNetwork.Ethereum,
    );
    const daiPoly = ExternalTokenModelSingleton.getToken(
      "dai",
      ChainNetwork.Polygon,
    );

    const mustEth = ExternalTokenModelSingleton.getToken(
      "must",
      ChainNetwork.Ethereum,
    );
    const mustPoly = ExternalTokenModelSingleton.getToken(
      "must",
      ChainNetwork.Polygon,
    );

    expect(daiEth).not.toBeNull();
    expect(daiPoly).not.toBeNull();
    expect(mustPoly).not.toBeNull();
    expect(mustEth).toBeFalsy();
  });

  test("Each external token contract maps to a single token", async () => {
    const tokens: IExternalToken[] =
      ExternalTokenModelSingleton.getAllTokensOutput();
    const errors = [];
    const chains: ChainNetwork[] = Chains.list();
    for (let z = 0; z < chains.length; z++) {
      const seen = [];
      const chainTokens: IExternalToken[] = tokens.filter(
        (x) => x.chain === chains[z],
      );
      for (let i = 0; i < chainTokens.length; i++) {
        if (seen.includes(chainTokens[i].contractAddr.toLowerCase())) {
          errors.push(
            "Contract " +
              chainTokens[i].contractAddr.toLowerCase() +
              " used by more than 1 token on chain " +
              chains[z],
          );
        } else {
          seen.push(chainTokens[i].contractAddr.toLowerCase());
        }
      }
    }
    console.log(JSON.stringify(errors));
    expect(errors.length).toBe(0);
  });
});
