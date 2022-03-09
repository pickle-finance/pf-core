import { PickleModel } from "../..";
import { JarDefinition, AssetProjectedApr } from "../../model/PickleModelJson";
import strategyABI from "../../Contracts/ABIs/strategy.json";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import {
  calculateSpiritFarmsAPY,
  SpiritPairManager,
} from "../../protocols/SpiritUtil";

export class SpiritJar extends AbstractJarBehavior {
  protected strategyAbi = strategyABI;

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
    return this.getHarvestableUSDComManImplementation(
      jar,
      model,
      ["spirit"],
      this.strategyAbi,
    );
  }

  async getProjectedAprStats(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const components = [];
    const lp = await new SpiritPairManager().calculateLpApr(
      model,
      jar.depositToken.addr,
    );
    components.push(this.createAprComponent("lp", lp, false));
    try {
      const spiritComponent = await calculateSpiritFarmsAPY(jar, model);
      components.push(spiritComponent);
    } catch (error) {
      model.logError("getProjectedAprStats:spiritComponent", error, jar.id);
    }

    return this.aprComponentsToProjectedApr(components);
  }
}
