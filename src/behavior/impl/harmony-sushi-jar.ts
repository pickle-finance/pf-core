import { AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { PickleModel } from "../../model/PickleModel";
import { calculateHarmonySushiAPY } from "../../protocols/HarmonySushiUtil";

// Should combine this with the Polygon equivalent later...

export abstract class HarmonySushiJar extends AbstractJarBehavior {
  strategyAbi: any;
  constructor(strategyAbi: any) {
    super();
    this.strategyAbi = strategyAbi;
  }
  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    return this.getHarvestableUSDCommsMgrImplementation(
      jar,
      model,
      ["sushi", "wone"],
      this.strategyAbi,
    );
  }

  async getProjectedAprStats(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    return this.aprComponentsToProjectedApr(
      (await calculateHarmonySushiAPY(definition, model)).map((component) =>
        this.createAprComponent(
          component.name,
          component.apr,
          component.compoundable,
        ),
      ),
    );
  }
}
