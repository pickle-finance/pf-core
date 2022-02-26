import { OxdJar } from "./fantom-oxd-jar";
import { PickleModel } from "../..";
import { JarDefinition } from "../../model/PickleModelJson";

export class OxdXscream extends OxdJar {
  constructor() {
    super();
  }

  async getDepositTokenPrice(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    return await this.getXTokenPrice(definition, model, "scream");
  }
}
