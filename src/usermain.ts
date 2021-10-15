import { PickleModelJson } from ".";
import fetch from 'cross-fetch';
import { UserModel } from "./client/UserModel";

async function generateUserData(walletId: string) {
  const core = await fetch(
    "https://api.pickle.finance/prod/protocol/pfcore",
  ).then((response) => response.json());
  const userModel : UserModel = new UserModel(core as PickleModelJson.PickleModelJson, walletId);
  const earnings = await userModel.generateUserModel();
  if( earnings) {
    const resultString = JSON.stringify(earnings, null, 2);
    process.stdout.write(resultString);
  }
}

if( process.argv.length !== 3) {
  console.log("Please pass a wallet");
} else {
  generateUserData(process.argv[2]);
}
//generateUserData('0x...');