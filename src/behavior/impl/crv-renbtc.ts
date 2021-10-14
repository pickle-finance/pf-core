import { PickleModel } from "../..";
import {
  JarDefinition,
  AssetProjectedApr,
  AssetAprComponent,
} from "../../model/PickleModelJson";
import { getStableswapPriceAddress } from "../../price/DepositTokenPriceUtility";
import { CurveJar, getCurveRawStats } from "./curve-jar";

export const RENBTC_GAUGE_ADDR = "0xB1F2cdeC61db658F091671F5f199635aEF202CAC";
export const RENBTC_POOL_ADDR = "0x93054188d876f558f4a66B2EF1d97d16eDf0895B";

export class RenBtcCRV extends CurveJar {
  constructor() {
    super(RENBTC_GAUGE_ADDR);
  }
  async getDepositTokenPrice(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    return (
      (await getStableswapPriceAddress(
        "0x93054188d876f558f4a66B2EF1d97d16eDf0895B",
        definition,
        model,
      )) * model.priceOfSync("wbtc")
    );
  }
  async getProjectedAprStats(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const crvApy: AssetAprComponent = await this.getCurveCrvAPY(
      definition,
      model,
      await model.priceOf("wbtc"),
      RENBTC_GAUGE_ADDR,
      RENBTC_POOL_ADDR,
    );
    const curveRawStats: any = await getCurveRawStats(model, definition.chain);
    const lp: AssetAprComponent = this.createAprComponent(
      "lp",
      curveRawStats ? curveRawStats["susd"] : 0,
      false,
    );
    return this.aprComponentsToProjectedApr([lp, crvApy]);
  }
}
