import { RoseJar } from "./rose-jar";
import { PickleModel } from "../../model/PickleModel";
import { JarDefinition } from "../../model/PickleModelJson";
import { getStableswapPriceAddress } from "../../price/DepositTokenPriceUtility";

const rewarderAddress = "0x9286d58C1c8d434Be809221923Cf4575f7A4d058";
const poolAddress = "0x79B0a67a4045A7a8DC04b17456F4fe15339cBA34";

export class RoseRusdpool extends RoseJar {
  constructor() {
    super(rewarderAddress);
  }

  async getDepositTokenPrice(
    asset: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    return getStableswapPriceAddress(poolAddress, asset, model);
  }
}
