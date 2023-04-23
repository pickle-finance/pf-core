import { AssetAprComponent, AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import { PickleModel, toError } from "../../model/PickleModel";
import { BigNumber } from "ethers";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import { formatEther } from "ethers/lib/utils";
import { Contract } from "ethers-multiprovider";
import { CurveJar } from "./curve-jar";
import { ErrorSeverity } from "../../core/platform/PlatformInterfaces";

const strategyAbi = ["function getHarvestable() view returns(uint256)"];
const pool = "0x3211C6cBeF1429da3D0d58494938299C92Ad5860";
const gauge = "0x95d16646311fDe101Eb9F897fE06AC881B7Db802";

export class CurveStgUsdc extends CurveJar {
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

    const multiProvider = model.multiproviderFor(jar.chain);
    const stgToken = new Contract(model.address("stg", jar.chain), erc20Abi);
    const poolToken = new Contract(jar.depositToken.addr, erc20Abi);
    const [poolCvx, totalSupply] = await multiProvider.all([stgToken.balanceOf(pool), poolToken.totalSupply()]);
    const stgPrice = model.priceOfSync("stg", jar.chain);

    const depositTokenPrice = poolCvx
      .mul(BigNumber.from((stgPrice * 1e6).toFixed()))
      .mul(2)
      .div(totalSupply)
      .mul((1e18).toFixed())
      .div((1e6).toFixed());

    tokenPrice = parseFloat(formatEther(depositTokenPrice));

    return tokenPrice;
  }

  async getHarvestableUSD(jar: JarDefinition, model: PickleModel): Promise<number> {
    return this.getHarvestableUSDDefaultImplementation(jar, model, ["stg"], strategyAbi);
  }

  async getProjectedAprStats(jar: JarDefinition, model: PickleModel): Promise<AssetProjectedApr> {
    let projectedApr: AssetProjectedApr;

    // Try to get all APR stats from Curve API
    try {
      projectedApr = await super.getProjectedAprStats(jar, model);
    } catch (error) {
      // prettier-ignore
      model.logPlatformError(toError(305000, jar.chain, jar.details.apiKey, "CurveStgUsdc/getProjectedAprStats", 'failed fetching APR stats from Curve API' , '', ErrorSeverity.ERROR_3));
    }
    if (projectedApr) return projectedApr;

    // If Curve API fails, at lease get CRV APR
    const crvAprComponent: AssetAprComponent = await this.getCrvAprMainnetImpl(
      jar,
      model,
      model.priceOfSync(jar.depositToken.addr, jar.chain),
      gauge,
      pool,
    );

    return this.aprComponentsToProjectedApr([crvAprComponent]);
  }
}
