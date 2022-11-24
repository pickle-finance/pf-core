import { AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import { PickleModel } from "../../model/PickleModel";
import { Contract } from "ethers-multiprovider";
import { CurveJar } from "./curve-jar";
import { getStableswapPriceAddress } from "../../price/DepositTokenPriceUtility";
import { utils } from "ethers";
import { Chains } from "../..";

const pool = "0x7A0e3b70b1dB0D6CA63Cac240895b2D21444A7b9";
const gauge = "0x8004216BED6B6A8E6653ACD0d45c570ed712A632";

const strategyABI = ["function getHarvestable() external returns (uint256)"];

export class CurveKava3pool extends CurveJar {
  constructor() {
    super(gauge);
  }

  async getDepositTokenPrice(
    asset: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    return getStableswapPriceAddress(pool, asset, model);
  }

  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    const multiProvider = model.multiproviderFor(jar.chain);
    const strategy = new Contract(
      jar.details.strategyAddr,
      strategyABI,
      multiProvider,
    );

    const harvestable = await strategy.callStatic.getHarvestable();
    const kavaPrice = model.priceOfSync("kava", jar.chain);
    const harvestableUSD = +utils.formatEther(harvestable) * kavaPrice;
    return harvestableUSD;
  }

  async getProjectedAprStats(
    definition: JarDefinition,
    _model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const curveRawStats: any = (
      await fetch("https://api.curve.fi/api/getFactoGauges/kava").then((x) =>
        x.json(),
      )
    )?.data;

    const kavaApy = curveRawStats?.gauges[0]?.extraRewards?.[0].apy;
    return this.aprComponentsToProjectedApr([
      this.createAprComponent(
        "kava",
        kavaApy,
        true,
        1 - Chains.get(definition.chain).defaultPerformanceFee,
      ),
    ]);
  }
}
