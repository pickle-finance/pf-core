import { ChainNetwork, PickleModelJson } from ".";
import fetch from "cross-fetch";
import { IUserModelCallback, UserData, UserModel } from "./client/UserModel";
import { ethers, Signer } from "ethers";

async function generateUserData(walletId: string) {
  const core = await fetch(
    "https://api.pickle.finance/prod/protocol/pfcore",
  ).then((response) => response.json());
  const map: Map<ChainNetwork, ethers.providers.Provider | Signer> = new Map();
  map.set(ChainNetwork.Ethereum, new ethers.providers.InfuraProvider());
  const callback: IUserModelCallback = {
    async modelUpdated(_newest: UserData): Promise<void> {
      console.log("Updated");
    },
    async modelFinished(_newest: UserData): Promise<void> {
      console.log("Finished");
    },
  };
  const userModel: UserModel = new UserModel(
    core as PickleModelJson.PickleModelJson,
    walletId,
    map,
    callback,
  );
  try {
    const earnings = await userModel.generateUserModel();
    if (earnings) {
      const resultString = JSON.stringify(earnings, null, 2);
      process.stdout.write(resultString);
    }
    
  } catch (error) {
    console.log(error)
  }
}

if (process.argv.length !== 3) {
  console.log("Please pass a wallet");
} else {
  generateUserData(process.argv[2]);
}
// generateUserData('0x...');
