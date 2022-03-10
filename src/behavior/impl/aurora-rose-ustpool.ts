import { RoseJar } from "./rose-jar";
import { PickleModel } from "../../model/PickleModel";
import { JarDefinition } from "../../model/PickleModelJson";
import { getStableswapPrice } from "../../price/DepositTokenPriceUtility";


export class RoseUstpool extends RoseJar {
  constructor() {
    super("0x56DE5E2c25828040330CEF45258F3FFBc090777C", "0x8fe44f5cce02D5BE44e3446bBc2e8132958d22B8");
  }

  // async getDepositTokenPrice(
  //   asset: JarDefinition,
  //   model: PickleModel,
  // ): Promise<number> {
  //   return getStableswapPrice(asset, model);
  // }
}
