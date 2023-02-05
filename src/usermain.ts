import { ChainNetwork, PickleModelJson, UserJarHistoryPnlGenerator } from ".";
import fetch from "cross-fetch";
import { IUserModelCallback, UserData, UserModel } from "./client/UserModel";
import { ethers, Signer } from "ethers";
import { UserTx, PnlTransactionWrapper, HistoryAssetType } from "./client/pnl/UserHistoryInterfaces";

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
    console.log(error);
  }
}


async function generateUserJarHistoryData(walletId: string) {
  const core = await fetch(
    "https://api.pickle.finance/prod/protocol/pfcore",
  ).then((response) => response.json());

  const userStuff = await fetch(
    "https://api.pickle.finance/prod/protocol/userhistory/" + walletId,
  ).then((response) => response.json());

  const item: UserTx[] = userStuff['QLP-MIMATIC'];
  const gen: UserJarHistoryPnlGenerator = new UserJarHistoryPnlGenerator(walletId, item, HistoryAssetType.JAR);
  const ret: PnlTransactionWrapper[] = gen.generatePnL();
  console.log(JSON.stringify(ret, null, 2));
}

//generateUserJarHistoryData('0xf696350F37cb8a1cc9C56EC5C8CfF00a5e01FD40');



if (process.argv.length !== 3) {
  console.log("Please pass a wallet");
} else {
  generateUserData(process.argv[2]);
}
// generateUserData('0x...');
