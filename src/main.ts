import { ethers } from "ethers";
import { JAR_DEFINITIONS, STANDALONE_FARM_DEFINITIONS } from "./model/JarsAndFarms";
import { PickleModel } from "./model/PickleModel";

// This is an example of the code you'd want to run in dashboard
async function generateFullApi() {
  const model : PickleModel = new PickleModel(JAR_DEFINITIONS, STANDALONE_FARM_DEFINITIONS, 
    new ethers.providers.InfuraProvider(), new ethers.providers.JsonRpcProvider('https://rpc-mainnet.maticvigil.com/'));
  const result = await model.generateFullApi();
  console.log(JSON.stringify(result, null, 2));

  /*  TODO move this to test suite, verifying db data exists
 for( let jar of JAR_DEFINITIONS ) {
   if( jar.jarDetails.apiKey ) {
    console.log("getting " + jar.jarDetails.apiKey.toLowerCase());
    const result1 : any = await getAssetData("asset", jar.jarDetails.apiKey.toLowerCase(), 5);
    console.log(result1);
  } else {
    console.log("skipping " + jar.id);
  }
 }
 */
}

generateFullApi();