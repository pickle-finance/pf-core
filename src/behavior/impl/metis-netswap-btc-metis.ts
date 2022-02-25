import { NetswapJar } from "./metis-netswap-jar";
import { Provider } from "@ethersproject/providers";
import { Signer } from "ethers";
import { PickleModel } from "../..";
import { JarDefinition } from "../../model/PickleModelJson";
import { multiSushiStrategyAbi } from "../../Contracts/ABIs/multi-sushi-strategy.abi";



export class NetswapBtcMetis extends NetswapJar {
  constructor() {
    super();
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
      ["nett", "metis"],
      multiSushiStrategyAbi,
    );
  }
}
