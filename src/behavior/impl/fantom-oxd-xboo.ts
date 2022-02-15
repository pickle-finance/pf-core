import { PickleModel } from "../..";
import { JarDefinition } from "../../model/PickleModelJson";
import { OxdJar } from "./fantom-oxd-jar";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import {
  Provider as MulticallProvider,
  Contract as MulticallContract,
} from "ethers-multicall";

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
