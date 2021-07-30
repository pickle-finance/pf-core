import { ethers } from "ethers";
import { Chain } from "./chain/ChainModel";
import { PickleModel } from "./model/PickleModel";

async function doStuff() {
  const model : PickleModel = new PickleModel();
  const provider = ethers.getDefaultProvider('homestead');
  const result = await model.run(Chain.Ethereum, provider);
  console.log(JSON.stringify(result, null, 2));
  //console.log(result === undefined ? "" : "a");
}

doStuff();