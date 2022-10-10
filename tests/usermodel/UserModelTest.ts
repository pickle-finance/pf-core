import { ethers, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import { ChainNetwork, PickleModelJson } from "../../src";
import { UserModel } from "../../src/client/UserModel";
import fetch from "cross-fetch";

const enabled = false;
describe("Testing user model", () => {
  test("Ensure user model actually returns", async () => {
    if( !enabled ) {
      return;
    }
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
      "0xacfe4511ce883c14c4ea40563f176c3c09b4c47c",
      map,
    );
    const earnings = await userModel.generateUserModel();
    expect(earnings).toBeDefined();
  }, 25000);
});
