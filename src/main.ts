import { ethers } from "ethers";
import { JAR_DEFINITIONS,STANDALONE_FARM_DEFINITIONS } from "./model/JarsAndFarms";
import { PickleModel } from "./model/PickleModel";

// This is an example of the code you'd want to run in dashboard
async function generateFullApi() {

  const model : PickleModel = new PickleModel(JAR_DEFINITIONS, STANDALONE_FARM_DEFINITIONS, 
    new ethers.providers.InfuraProvider(), new ethers.providers.JsonRpcProvider('https://rpc-mainnet.maticvigil.com/'));
  const result = await model.generateFullApi();
  const resultString = JSON.stringify(result, null, 2);
  process.stdout.write(resultString);
/**

  const result1 : AssetDatabaseEntry[] = await getJarAssetData(JAR_SUSHI_ETH_ALCX);
 
  console.log("First: ");
  console.log(result1[0]);
  console.log("Last: " );
  console.log(result1[result1.length-1]);
  
  console.log("\n\n\n");
  console.log("Single row 1");
  const singleRow1 : AssetDatabaseEntry = await getJarAssetSingleDataSingle(JAR_SUSHI_ETH_ALCX, 0);
  console.log(singleRow1);
  console.log("Single row 2");
  const before = singleRow1[0].timestamp;
  console.log("Before is " + before);
  const singleRow2 : AssetDatabaseEntry = await getJarAssetSingleDataSingle(JAR_SUSHI_ETH_ALCX, singleRow1[0].timestamp);
  console.log(singleRow2);
  const a1 = singleRow2[0].timestamp;
  const a2 = singleRow2[1].timestamp;
  const a3 = singleRow2[2].timestamp;
  const a4 = singleRow2[3].timestamp;
  console.log(a4-a3);
  console.log(a3-a2);
  console.log(a2-a1);
  */
  
}

generateFullApi();
