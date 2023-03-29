import fetch from "cross-fetch";
import { ChainNetwork } from ".";
import { ethers, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import { ALL_ASSETS } from "./model/JarsAndFarms";
import { PfDataStore, PickleModel } from "./model/PickleModel";
import fs from "fs";
import { ErrorLogger, PlatformError } from "./core/platform/PlatformInterfaces";

// This is an example of the code you'd want to run in a client
async function generateFullApi() {
  const map: Map<ChainNetwork, Provider | Signer> = new Map();
  map.set(ChainNetwork.Ethereum, new ethers.providers.InfuraProvider());
  map.set(
    ChainNetwork.Polygon,
    new ethers.providers.JsonRpcProvider("https://polygon-rpc.com/"),
  );

  // const model: PickleModel = new PickleModel(ALL_ASSETS.filter(x=>x.chain===ChainNetwork.Polygon), map);
  const model: PickleModel = new PickleModel(ALL_ASSETS, map);
  const errArr: PlatformError[] = [];
  const errLogger: ErrorLogger = {
    async logPlatformError(err: PlatformError): Promise<void> {
      errArr.push(err);
    },
  };

  let previousCore = undefined;
  try {
    previousCore = await fetch(
      "https://api.pickle.finance/prod/protocol/pfcore",
    ).then((response) => response.json());
  } catch (error) {
    console.log("Previous version load failed");
  }
  if (previousCore) {
    model.setPreviousPFCore(previousCore);
  }
  model.setErrorLogger(errLogger);
  // const store = new LocalPersistedDataStore();
  // store.load();
  // model.setDataStore(store);
  const result = await model.generateFullApi();
  const resultString = JSON.stringify(result, null, 2);
  const errString = JSON.stringify(errArr, null, 2);
  const finalString = resultString + "\n\n" + errString;
  process.stdout.write(finalString);
  process.exit(0);
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
