import { PickleModel } from "../..";
import { JarDefinition, AssetProjectedApr } from "../../model/PickleModelJson";
import strategyABI from "../../Contracts/ABIs/strategy.json";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import {
  calculateSpiritFarmsAPY,
  SpiritPairManager,
} from "../../protocols/SpiritUtil";
import { ErrorSeverity } from "../../core/platform/PlatformInterfaces";
import { toError } from "../../model/PickleModel";

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
    return this.getHarvestableUSDDefaultImplementation(
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
    const lpPromise: Promise<number> = new SpiritPairManager().calculateLpApr(
      model,
      jar.depositToken.addr,
    );
    const spiritComponentPromise = calculateSpiritFarmsAPY(jar, model);

    try {
      const lp = await lpPromise;
      components.push(this.createAprComponent("lp", lp, false));
    } catch (error) {
      model.logPlatformError(toError(301102, jar.chain, jar.details.apiKey, "getProjectedAprStats", 'error calling SpiritPairManager calculateLpApr', ''+error, ErrorSeverity.ERROR_3));
    }
    try {
      const spiritComponent = await spiritComponentPromise;
      components.push(spiritComponent);
    } catch (error) {
      model.logPlatformError(toError(301102, jar.chain, jar.details.apiKey, "getProjectedAprStats", 'error calling SpiritPairManager calculateSpiritFarmsAPY', ''+error, ErrorSeverity.ERROR_3));
    }

    return this.aprComponentsToProjectedApr(components);
  }
}
