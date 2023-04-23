import { PickleModel } from "../..";
import { ErrorSeverity } from "../../core/platform/PlatformInterfaces";
import { toError } from "../../model/PickleModel";
import { JarDefinition, AssetProjectedApr, AssetAprComponent } from "../../model/PickleModelJson";
import { Contract } from "ethers-multiprovider";
import { CurveJar } from "./curve-jar";
import { ethers } from "ethers";

const curveGaugeAbi = ["function claimable_tokens(address addr) view returns(uint256)"];
const THREE_GAUGE_ADDR = "0xbFcF63294aD7105dEa65aA58F8AE5BE2D9d0952A";
const THREE_POOL_ADDR = "0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7";
export class ThreeCrv extends CurveJar {
  constructor() {
    super(THREE_GAUGE_ADDR);
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
      model.logPlatformError(toError(305000, jar.chain, jar.details.apiKey, "ThreeCrv/getProjectedAprStats", 'failed fetching APR stats from Curve API' , '', ErrorSeverity.ERROR_3));
    }
    if (projectedApr) return projectedApr;

    // If Curve API fails, at lease get CRV APR
    const crvAprComponent: AssetAprComponent = await this.getCrvAprMainnetImpl(
      jar,
      model,
      model.priceOfSync("usdc", jar.chain),
      THREE_GAUGE_ADDR,
      THREE_POOL_ADDR,
    );

    return this.aprComponentsToProjectedApr([crvAprComponent]);
  }
}
