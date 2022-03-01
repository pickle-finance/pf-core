import { PickleModel } from "../..";
import { JarDefinition } from "../../model/PickleModelJson";
import { OxdJar } from "./fantom-oxd-jar";

export class OxdXboo extends OxdJar {
  constructor() {
    super();
  }

  async getDepositTokenPrice(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    return await this.getXTokenPrice(definition, model, "boo");
  }
}
