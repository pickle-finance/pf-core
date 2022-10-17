import { PickleModel } from "../..";
import { multiSushiStrategyAbi } from "../../Contracts/ABIs/multi-sushi-strategy.abi";
import { AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import { AuroraTriDualJar } from "./aurora-tri-dual-jar";

export class TriSolaceNear extends AuroraTriDualJar {
  constructor() {
    super(multiSushiStrategyAbi, 4, 2);
  }

  async getProjectedAprStats(
    _definition: JarDefinition,
    _model: PickleModel,
  ): Promise<AssetProjectedApr> {
    return this.aprComponentsToProjectedApr([]);
  }
}
