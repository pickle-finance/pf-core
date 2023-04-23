import { JarDefinition } from "../../model/PickleModelJson";
import { PickleModel } from "../../model/PickleModel";
import { Contract } from "ethers-multiprovider";
import { CurveJar } from "./curve-jar";
import { getStableswapPriceAddress } from "../../price/DepositTokenPriceUtility";
import { utils } from "ethers";

const strategyAbi = ["function getHarvestable() external returns (uint256)"];
const pool = "0x7A0e3b70b1dB0D6CA63Cac240895b2D21444A7b9";
const gauge = "0x8004216BED6B6A8E6653ACD0d45c570ed712A632";

export class CurveKava3pool extends CurveJar {
  constructor() {
    super(gauge);
  }

  async getDepositTokenPrice(jar: JarDefinition, model: PickleModel): Promise<number> {
    let tokenPrice: number;

    try {
      tokenPrice = await super.getDepositTokenPrice(jar, model);
    } catch {
      // ignore
    }
    if (tokenPrice !== undefined) return tokenPrice;

    tokenPrice = await getStableswapPriceAddress(pool, jar, model);
    return tokenPrice;
  }

  async getHarvestableUSD(jar: JarDefinition, model: PickleModel): Promise<number> {
    const multiProvider = model.multiproviderFor(jar.chain);
    const strategy = new Contract(jar.details.strategyAddr, strategyAbi, multiProvider);

    const harvestable = await strategy.callStatic.getHarvestable();
    const kavaPrice = model.priceOfSync("kava", jar.chain);
    const harvestableUSD = +utils.formatEther(harvestable) * kavaPrice;
    return harvestableUSD;
  }
}
