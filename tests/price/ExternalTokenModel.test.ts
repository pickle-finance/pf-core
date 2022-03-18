import { ChainNetwork, Chains } from "../../src/chain/Chains";
import { IExternalToken } from "../../src/model/PickleModelJson";
import { ExternalTokenModelSingleton } from "../../src/price/ExternalTokenModel";

describe("Coingecko and external token integration", () => {
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
