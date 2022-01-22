import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
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
    resolver: Signer | Provider,
  ): Promise<number> {
    return this.getHarvestableUSDDefaultImplementation(
      jar,
      model,
      resolver,
      ["sushi", "cvx"],
      this.strategyAbi,
    );
  }
}
