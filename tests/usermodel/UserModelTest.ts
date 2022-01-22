import { ethers, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import { ChainNetwork, PickleModelJson } from "../../src";
import { UserModel } from "../../src/client/UserModel";
import fetch from "cross-fetch";

describe("Testing user model", () => {
  test("Ensure user model actually returns", async () => {
    const core = await fetch(
      "https://api.pickle.finance/prod/protocol/pfcore",
    ).then((response) => response.json());
    const map: Map<ChainNetwork, Provider | Signer> = new Map();
    map.set(ChainNetwork.Ethereum, new ethers.providers.InfuraProvider());
    map.set(
      ChainNetwork.Polygon,
      new ethers.providers.JsonRpcProvider(
        "https://matic-mainnet.chainstacklabs.com/",
      ),
    );
    const userModel: UserModel = new UserModel(
      core as PickleModelJson.PickleModelJson,
      "0x9d074e37d408542fd38be78848e8814afb38db17",
      map,
    );
    const earnings = await userModel.generateUserModel();
    expect(earnings).toBeDefined();
  }, 15000);
});
