import { RoseJar } from "./rose-jar";
import { PickleModel } from "../../model/PickleModel";
import { JarDefinition } from "../../model/PickleModelJson";
import { getStableswapPrice } from "../../price/DepositTokenPriceUtility";


export class RoseFraxpool extends RoseJar {
  constructor() {
    super("0xB9D873cDc15e462f5414CCdFe618a679a47831b4");
  }

  async getDepositTokenPrice(
    asset: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    return getStableswapPrice(asset, model);
  }
}
