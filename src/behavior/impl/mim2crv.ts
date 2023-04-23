import { PickleModel } from "../..";
import { JarDefinition, AssetProjectedApr } from "../../model/PickleModelJson";
import { CurveJar } from "./curve-jar";
import { calculateAbracadabraApyArbitrum } from "../../protocols/AbraCadabraUtil";

const strategyAbi = ["function getHarvestable() view returns(uint256)"];
const gauge = "0x97E2768e8E73511cA874545DC5Ff8067eB19B787";

export class Mim2Crv extends CurveJar {
  constructor() {
    super(gauge);
  }

  async getDepositTokenPrice(jar: JarDefinition, model: PickleModel): Promise<number> {
    let tokenPrice: number;

    try {
      tokenPrice = await super.getDepositTokenPrice(jar, model);
    } catch {
      // ignore
    }
    if (tokenPrice !== undefined) return tokenPrice;

    // TODO We can approximate the mim2crv token value
    // as mim itself bc mim is likely the weakest of the 3
    tokenPrice = model.priceOfSync("mim", jar.chain);

    return tokenPrice;
  }

  async getHarvestableUSD(jar: JarDefinition, model: PickleModel): Promise<number> {
    return this.getHarvestableUSDDefaultImplementation(jar, model, ["spell"], strategyAbi);
  }

  async getProjectedAprStats(jar: JarDefinition, model: PickleModel): Promise<AssetProjectedApr> {
    const apy = await calculateAbracadabraApyArbitrum(jar, model);
    return this.aprComponentsToProjectedApr([this.createAprComponent("spell", apy * 100, true)]);
  }
}
