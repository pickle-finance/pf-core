import { ethers } from "ethers";
import { PickleModel } from "./model/PickleModel";

async function doStuff() {
  const model : PickleModel = new PickleModel();
  const provider = ethers.getDefaultProvider('ropsten');
  const result = await model.run(provider);
  console.log(JSON.stringify(result, null, 2));
}

doStuff();