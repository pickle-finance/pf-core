import { ethers } from "ethers";
import { Chain } from "./chain/ChainModel";
import { JAR_DEFINITIONS, STANDALONE_FARM_DEFINITIONS } from "./model/JarsAndFarms";
import { PickleModel } from "./model/PickleModel";

// This is an example of the code you'd want to run in dashboard
async function doStuff() {
  const model : PickleModel = new PickleModel(JAR_DEFINITIONS, STANDALONE_FARM_DEFINITIONS, 
    new ethers.providers.InfuraProvider(), new ethers.providers.JsonRpcProvider('https://rpc-mainnet.maticvigil.com/'));
  const provider = //ethers.getDefaultProvider('homestead');
    new ethers.providers.InfuraProvider();
  const result = await model.generateFullApi();
  console.log(JSON.stringify(result, null, 2));
}

doStuff();