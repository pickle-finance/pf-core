import { ChainNetwork } from ".";
import { ethers, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import { ALL_ASSETS } from "./model/JarsAndFarms";
import { PfDataStore, PickleModel } from "./model/PickleModel";
import fs from "fs";
import { AssetProtocol } from "./model/PickleModelJson";

// This is an example of the code you'd want to run in a client
async function generateFullApi() {
  const map: Map<ChainNetwork, Provider | Signer> = new Map();
  map.set(ChainNetwork.Ethereum, new ethers.providers.InfuraProvider());
  map.set(
    ChainNetwork.Polygon,
    new ethers.providers.JsonRpcProvider("https://polygon-rpc.com/"),
  );

  const model: PickleModel = new PickleModel(ALL_ASSETS.filter(x => x.protocol === AssetProtocol.OXD), map);
  // const store = new LocalPersistedDataStore();
  // store.load();
  // model.setDataStore(store);
  const result = await model.generateFullApi();
  //const result = await PFCore.createPickleModelAndUserModelForSingleAsset(JAR_SUSHI_ETH_ALCX.details.apiKey, walletPublicKey, map);
  const resultString = JSON.stringify(result, null, 2);
  process.stdout.write(resultString);
}

export interface PersistedData {
  key: string;
  value: string;
}

export class LocalPersistedDataStore implements PfDataStore {
  private persistedObj: PersistedData[];
  constructor() {
    // empty
  }

  async load(): Promise<void> {
    let persistedFile: string = undefined;
    try {
      persistedFile = fs.readFileSync(
        "./persistent_data_store_no_commit.json",
        "utf8",
      );
    } catch (err) {
      persistedFile = "[]";
    }
    try {
      this.persistedObj = JSON.parse(persistedFile);
    } catch (err) {
      console.log(err);
      this.persistedObj = [];
    }
  }

  async readData(key: string): Promise<string | undefined> {
    const row = this.persistedObj.find((x) => x.key === key);
    return row === undefined ? undefined : row.value;
  }
  async writeData(key: string, value: string): Promise<void> {
    this.persistedObj = this.persistedObj.filter((x) => x.key !== key);
    this.persistedObj.push({ key: key, value: value });
    try {
      fs.writeFileSync(
        "./persistent_data_store_no_commit.json",
        JSON.stringify(this.persistedObj),
      );
    } catch (err) {
      console.log(err);
    }
  }
}

generateFullApi();
