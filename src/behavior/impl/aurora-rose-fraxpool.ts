import { RoseJar } from "./rose-jar";
import { PickleModel } from "../../model/PickleModel";
import { JarDefinition } from "../../model/PickleModelJson";
import { getStableswapPriceAddress } from "../../price/DepositTokenPriceUtility";

const rewarderAddress = "0xB9D873cDc15e462f5414CCdFe618a679a47831b4";
const poolAddress = "0xa34315F1ef49392387Dd143f4578083A9Bd33E94";


export class RoseFraxpool extends RoseJar {
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
