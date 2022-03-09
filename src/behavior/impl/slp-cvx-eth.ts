import { multiSushiStrategyAbi } from "../../Contracts/ABIs/multi-sushi-strategy.abi";
import { AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import { PickleModel } from "../../model/PickleModel";
import { SushiJar } from "./sushi-jar";

export class SlpCvxEth extends SushiJar {
  constructor() {
    super(multiSushiStrategyAbi);
  }

  async getProjectedAprStats(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    return await this.chefV2AprStats(definition, model, "cvx");
  }

  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    return this.getHarvestableUSDComManImplementation(
      jar,
      model,
      ["sushi", "cvx"],
      this.strategyAbi,
    );
  }
}
