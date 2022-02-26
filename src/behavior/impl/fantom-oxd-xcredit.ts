import { OxdJar } from "./fantom-oxd-jar";
import { PickleModel } from "../..";
import { JarDefinition } from "../../model/PickleModelJson";

export class OxdXcredit extends OxdJar {
  constructor() {
    super();
  }

  async getDepositTokenPrice(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    return await this.getXTokenPrice(definition, model, "credit");
  }
}
