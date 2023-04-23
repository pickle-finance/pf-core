import { ethers } from "ethers";
import { PickleModel } from "../..";
import { JarDefinition, AssetProjectedApr } from "../../model/PickleModelJson";
import { CurveJar } from "./curve-jar";
import { formatEther } from "ethers/lib/utils";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import { Contract } from "ethers-multiprovider";
import { ErrorSeverity } from "../../core/platform/PlatformInterfaces";
import { toError } from "../../model/PickleModel";

const curveGaugeAbi = ["function claimable_tokens(address addr) view returns(uint256)"];
const gauge = "0x555766f3da968ecbefa690ffd49a2ac02f47aa5f";
const pool = "0x960ea3e3C7FB317332d990873d354E18d7645590";

export class CrvTricrypto extends CurveJar {
  swapAddress: string;
  constructor() {
    super(gauge);
    this.swapAddress = pool;
  }

  async getDepositTokenPrice(jar: JarDefinition, model: PickleModel): Promise<number> {
    let tokenPrice: number;

    try {
      tokenPrice = await super.getDepositTokenPrice(jar, model);
    } catch {
      // ignore
    }
    if (tokenPrice !== undefined) return tokenPrice;

    const curvePoolAbi = [
      "function balances(uint256 arg0) view returns(uint256)",
      "function get_virtual_price() view returns(uint256)",
    ];
    const poolContract = new Contract(pool, curvePoolAbi);
    const multiProvider = model.multiproviderFor(jar.chain);
    const triToken = new Contract(jar.depositToken.addr, erc20Abi);

    const [balance0, balance1, balance2, supply, virtualPrice] = await multiProvider.all([
      poolContract.balances(0),
      poolContract.balances(1),
      poolContract.balances(2),
      triToken.totalSupply(),
      poolContract.get_virtual_price(),
    ]);

    const wbtcPrice = model.priceOfSync("wbtc", jar.chain);
    const ethPrice = model.priceOfSync("weth", jar.chain);

    const scaledBalance0 = balance0 / 1e6;
    const scaledBalance1 = (balance1 / 1e8) * wbtcPrice;
    const scaledBalance2 = (balance2 / 1e18) * ethPrice;
    const totalStakedUsd = (scaledBalance0 + scaledBalance1 + scaledBalance2) * +formatEther(virtualPrice);
    tokenPrice = totalStakedUsd / +formatEther(supply);

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
      model.logPlatformError(toError(305000, jar.chain, jar.details.apiKey, "CrvTricrypto/getProjectedAprStats", 'failed fetching APR stats from Curve API' , '', ErrorSeverity.ERROR_3));
    }
    if (projectedApr) return projectedApr;

    // If Curve API fails, at lease get CRV APR
    const crvAprComponent = await this.getCrvAprArbImpl(jar, model, this.swapAddress, this.gaugeAddress, 3);

    return this.aprComponentsToProjectedApr([crvAprComponent]);
  }
}
