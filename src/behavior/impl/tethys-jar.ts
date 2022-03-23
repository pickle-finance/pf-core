import { PickleModel } from "../..";
import { JarDefinition, AssetProjectedApr } from "../../model/PickleModelJson";
import strategyABI from "../../Contracts/ABIs/strategy.json";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import {
  calculateTethysFarmsAPY,
  TethysPairManager,
} from "../../protocols/TethysUtil";

export class TethysJar extends AbstractJarBehavior {
  protected strategyAbi: any;

  constructor() {
    super();
    this.strategyAbi = strategyABI;
  }

  async getDepositTokenPrice(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    return super.getDepositTokenPrice(definition, model);
  }

  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    return this.getHarvestableUSDCommsMgrImplementation(
      jar,
      model,
      ["tethys"],
      this.strategyAbi,
    );
  }

  async getProjectedAprStats(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const lp = await new TethysPairManager().calculateLpApr(
      model,
      jar.depositToken.addr,
    );
    return this.aprComponentsToProjectedApr([
      await calculateTethysFarmsAPY(jar, model),
      this.createAprComponent("lp", lp, false),
    ]);
  }
}
