import { ChainNetwork } from ".";
import { ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { ALL_ASSETS } from "./model/JarsAndFarms";
import { PickleModel } from "./model/PickleModel";
// This is an example of the code you'd want to run in dashboard
async function generateFullApi() {
  const map : Map<ChainNetwork, Provider | Signer> = new Map();
  map.set(ChainNetwork.Ethereum, new ethers.providers.InfuraProvider());
  map.set(ChainNetwork.Polygon, new ethers.providers.JsonRpcProvider('https://matic-mainnet.chainstacklabs.com/'));
  
  const model : PickleModel = new PickleModel(ALL_ASSETS, map);
  const result = await model.generateFullApi();
  const resultString = JSON.stringify(result, null, 2);
  process.stdout.write(resultString);
}

generateFullApi();
