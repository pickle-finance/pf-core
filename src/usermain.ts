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

/*
if( process.argv.length !== 3) {
  console.log("Please pass a wallet");
  exit(1);
}
generateUserData(process.argv[2]);
*/
generateUserData('0xc3B08DdFA64d82A24db69DD662ecE6d77E88A96c');