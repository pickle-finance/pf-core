import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import { AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import { multiSushiStrategyAbi } from "../../Contracts/ABIs/multi-sushi-strategy.abi";
import { PickleModel } from "../../model/PickleModel";
import { SushiJar } from "./sushi-jar";

export class SlpTruEth extends SushiJar {
  constructor() {
    super(multiSushiStrategyAbi);
  }
  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
    resolver: Signer | Provider,
  ): Promise<number> {
    return this.getHarvestableUSDDefaultImplementation(jar, model, resolver, 
        ["sushi","tru"], multiSushiStrategyAbi);
  }
  
  async getProjectedAprStats(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    return await this.chefV2AprStats(definition, model, "tru");
  }
}
