import { PickleModel } from "../..";
import { JarDefinition, AssetProjectedApr, AssetAprComponent } from "../../model/PickleModelJson";
import { getStableswapPriceAddress } from "../../price/DepositTokenPriceUtility";
import { Contract } from "ethers-multiprovider";
import { CurveJar } from "./curve-jar";
import { ethers } from "ethers";
import { toError } from "../../model/PickleModel";
import { ErrorSeverity } from "../../core/platform/PlatformInterfaces";

const curveGaugeAbi = ["function claimable_tokens(address addr) view returns(uint256)"];
const RENBTC_GAUGE_ADDR = "0xB1F2cdeC61db658F091671F5f199635aEF202CAC";
const RENBTC_POOL_ADDR = "0x93054188d876f558f4a66B2EF1d97d16eDf0895B";

export class RenBtcCRV extends CurveJar {
  constructor() {
    super(RENBTC_GAUGE_ADDR);
  }

  async getDepositTokenPrice(jar: JarDefinition, model: PickleModel): Promise<number> {
    let tokenPrice: number;

    try {
      tokenPrice = await super.getDepositTokenPrice(jar, model);
    } catch {
      // ignore
    }
    if (tokenPrice !== undefined) return tokenPrice;

    tokenPrice = (await getStableswapPriceAddress(RENBTC_POOL_ADDR, jar, model)) * model.priceOfSync("wbtc", jar.chain);

    return tokenPrice;
  }

  async getHarvestableUSD(jar: JarDefinition, model: PickleModel): Promise<number> {
    const multiProvider = model.multiproviderFor(jar.chain);
    const gauge = new Contract(this.gaugeAddress, curveGaugeAbi);
    const [crv] = await multiProvider.all([gauge.claimable_tokens(jar.details.strategyAddr)]);
    const crvPrice = model.priceOfSync("curve-dao-token", jar.chain);
    const harvestable = crv.mul(crvPrice.toFixed());
    return parseFloat(ethers.utils.formatEther(harvestable));
  }

  async getProjectedAprStats(jar: JarDefinition, model: PickleModel): Promise<AssetProjectedApr> {
    let projectedApr: AssetProjectedApr;

    // Try to get all APR stats from Curve API
    try {
      projectedApr = await super.getProjectedAprStats(jar, model);
    } catch (error) {
      // prettier-ignore
      model.logPlatformError(toError(305000, jar.chain, jar.details.apiKey, "RenBtcCRV/getProjectedAprStats", 'failed fetching APR stats from Curve API' , '', ErrorSeverity.ERROR_3));
    }
    if (projectedApr) return projectedApr;

    // If Curve API fails, at lease get CRV APR
    const crvAprComponent: AssetAprComponent = await this.getCrvAprMainnetImpl(
      jar,
      model,
      model.priceOfSync("wbtc", jar.chain),
      RENBTC_GAUGE_ADDR,
      RENBTC_POOL_ADDR,
    );

    return this.aprComponentsToProjectedApr([crvAprComponent]);
  }
}
