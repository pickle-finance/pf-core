import { ChainNetwork, PickleModelJson } from ".";
import { ethers, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import { ALL_ASSETS } from "./model/JarsAndFarms";
import { PickleModel } from "./model/PickleModel";
import fetch from "cross-fetch";
import { UserModel } from "./client/UserModel";

// This is an example of the code you'd want to run in a client
async function generateFullApi() {
  return generatePlatformData();
  //await generateUserData(someWallet);
}

async function generatePlatformData() {
  const map: Map<ChainNetwork, Provider | Signer> = new Map();
  map.set(ChainNetwork.Ethereum, new ethers.providers.InfuraProvider());
  map.set(
    ChainNetwork.Polygon,
    new ethers.providers.JsonRpcProvider(
      "https://matic-mainnet.chainstacklabs.com/",
    ),
  );

  const model: PickleModel = new PickleModel(ALL_ASSETS, map);
  const result = await model.generateFullApi();
  const resultString = JSON.stringify(result, null, 2);
  process.stdout.write(resultString);
}

async function generateUserData(walletId: string) {
  const core = await fetch(
    "https://api.pickle.finance/prod/protocol/pfcore",
  ).then((response) => response.json());
  const userModel: UserModel = new UserModel(
    core as PickleModelJson.PickleModelJson,
    walletId,
  );
  const earnings = await userModel.getUserEarningsSummary();
  const resultString = JSON.stringify(earnings, null, 2);
  process.stdout.write(resultString);
}
generateFullApi();
