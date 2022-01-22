import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import { PickleModel } from "../..";
import { JarDefinition, AssetProjectedApr } from "../../model/PickleModelJson";
import { CurveJar } from "./curve-jar";
import strategyAbi from "../../Contracts/ABIs/strategy.json";
import { calculateAbracadabraApyArbitrum } from "../../protocols/AbraCadabraUtil";

export class Mim2Crv extends CurveJar {
  protected strategyAbi: any;

  constructor() {
    super("0x97E2768e8E73511cA874545DC5Ff8067eB19B787");
    this.strategyAbi = strategyAbi;
  }

  async getDepositTokenPrice(
    _definition: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    // TODO We can approximate the mim2crv token value
    // as mim itself bc mim is likely the weakest of the 3
    return model.priceOfSync("mim");
  }

  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
    resolver: Signer | Provider,
  ): Promise<number> {
    return this.getHarvestableUSDDefaultImplementation(
      jar,
      model,
      resolver,
      ["spell"],
      this.strategyAbi,
    );
  }

  async getProjectedAprStats(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const apy = await calculateAbracadabraApyArbitrum(jar, model);
    return this.aprComponentsToProjectedApr([
      this.createAprComponent("spell", apy * 100, true),
    ]);
  }
}
