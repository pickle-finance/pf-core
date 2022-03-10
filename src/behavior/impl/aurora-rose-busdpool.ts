import { RoseJar } from "./rose-jar";
import { PickleModel } from "../../model/PickleModel";
import { JarDefinition } from "../../model/PickleModelJson";
import { getStableswapPriceAddress } from "../../price/DepositTokenPriceUtility";

const rewarderAddress = "0x18A6115150A060F22Bacf62628169ee9b231368f";
const poolAddress = "0xD6cb7Bb7D63f636d1cA72A1D3ed6f7F67678068a";


export class RoseBusdpool extends RoseJar {
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
