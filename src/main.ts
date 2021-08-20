import { ethers } from "ethers";
import { ALL_ASSETS } from "./model/JarsAndFarms";
import { PickleModel } from "./model/PickleModel";

// This is an example of the code you'd want to run in dashboard
async function generateFullApi() {
  const model : PickleModel = new PickleModel(ALL_ASSETS, new ethers.providers.InfuraProvider(), 
  new ethers.providers.JsonRpcProvider('https://rpc-mainnet.maticvigil.com/'));
  const result = await model.generateFullApi();
  const resultString = JSON.stringify(result, null, 2);
  process.stdout.write(resultString);
}

generateFullApi();
