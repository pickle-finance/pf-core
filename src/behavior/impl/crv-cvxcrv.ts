import { JarDefinition } from "../../model/PickleModelJson";
import { PickleModel } from "../../model/PickleModel";
import { getStableswapPriceAddress } from "../../price/DepositTokenPriceUtility";
import { ConvexDualReward } from "./convex-dual-reward";

export class CurveCvxCrv extends ConvexDualReward {
  constructor() {
    super();
  }
  async getDepositTokenPrice(
    asset: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    const r =
      (await getStableswapPriceAddress(
        "0x9D0464996170c6B9e75eED71c68B99dDEDf279e8",
        asset,
        model,
      )) * model.priceOfSync("cvxcrv");
    return r;
  }
}
