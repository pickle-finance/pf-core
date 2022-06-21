import { ethers } from "ethers";
import { PickleModel } from "../..";
import {
  JarDefinition,
  AssetProjectedApr,
  AssetAprComponent,
} from "../../model/PickleModelJson";
import { CurveJar } from "./curve-jar";
import { formatEther } from "ethers/lib/utils";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import { calculateCurveApyArbitrum } from "../../protocols/CurveUtil";
import { Contract } from "ethers-multiprovider";
import { fetch } from "cross-fetch";
import { ErrorSeverity } from "../../core/platform/PlatformInterfaces";
import { toError } from "../../model/PickleModel";

export class CrvTricrypto extends CurveJar {
  swapAddress: string;
  constructor() {
    super("0x555766f3da968ecbefa690ffd49a2ac02f47aa5f");
    this.swapAddress = "0x960ea3e3C7FB317332d990873d354E18d7645590";
  }

  async getDepositTokenPrice(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    const curvePoolAbi = [
      {
        name: "balances",
        outputs: [{ type: "uint256", name: "" }],
        inputs: [{ type: "uint256", name: "arg0" }],
        stateMutability: "view",
        type: "function",
        gas: "2310",
      },
      {
        name: "get_virtual_price",
        outputs: [{ type: "uint256", name: "" }],
        inputs: [],
        stateMutability: "view",
        type: "function",
      },
    ];
    const triPool = "0x960ea3e3C7FB317332d990873d354E18d7645590";
    const triTokenAddress = "0x8e0b8c8bb9db49a46697f3a5bb8a308e744821d2";
    const pool = new Contract(triPool, curvePoolAbi);
    const multiProvider = model.multiproviderFor(definition.chain);
    const triToken = new Contract(triTokenAddress, erc20Abi);

    const [balance0, balance1, balance2, supply, virtualPrice] =
      await multiProvider.all([
        pool.balances(0),
        pool.balances(1),
        pool.balances(2),
        triToken.totalSupply(),
        pool.get_virtual_price(),
      ]);

    const wbtcPrice = model.priceOfSync("wbtc", definition.chain);
    const ethPrice = model.priceOfSync("weth", definition.chain);

    const scaledBalance0 = balance0 / 1e6;
    const scaledBalance1 = (balance1 / 1e8) * wbtcPrice;
    const scaledBalance2 = (balance2 / 1e18) * ethPrice;
    const totalStakedUsd =
      (scaledBalance0 + scaledBalance1 + scaledBalance2) *
      +formatEther(virtualPrice);
    const price = totalStakedUsd / +formatEther(supply);
    return price;
  }

  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    // changed stateMutability to view to allow calling the function as constant
    const curveThirdPartyGaugeAbi = [
      {
        stateMutability: "view",
        type: "function",
        name: "claimable_tokens",
        inputs: [{ name: "addr", type: "address" }],
        outputs: [{ name: "", type: "uint256" }],
      },
    ];

    const gauge = new Contract(this.gaugeAddress, curveThirdPartyGaugeAbi);
    const multiProvider = model.multiproviderFor(jar.chain);

    const [claimableTokensBN] = await multiProvider.all([
      gauge.claimable_tokens(jar.details.strategyAddr),
    ]);

    const crvPrice = model.priceOfSync("curve-dao-token", jar.chain);
    const harvestable = claimableTokensBN.mul(crvPrice.toFixed());
    return parseFloat(ethers.utils.formatEther(harvestable));
  }

  async getProjectedAprStats(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const aprComponents: AssetAprComponent[] = [];

    try {
      const apr = await calculateCurveApyArbitrum(
        jar,
        model,
        this.swapAddress,
        this.gaugeAddress,
        3,
      );
      aprComponents.push(this.createAprComponent("crv", apr, true));
    } catch (error) {
      model.logPlatformError(toError(301102, jar.chain, jar.details.apiKey, "getProjectedAprStats", 'error calling calculateCurveApyArbitrum', ''+error, ErrorSeverity.ERROR_3));
    }

    // Get LP APY from API
    try {
      const curveApi = "https://api.curve.fi/api/getSubgraphData/arbitrum";
      const response = await fetch(curveApi).then((x) => x.json());
      const poolData = response.data.poolList.find(
        (pool) => pool.address.toLowerCase() === this.swapAddress.toLowerCase(),
      );
      const lpApy = Math.max(poolData.latestDailyApy, poolData.latestWeeklyApy);
      aprComponents.push(this.createAprComponent("lp", lpApy ?? 0, false));
    } catch (error) {
      model.logPlatformError(toError(301102, jar.chain, jar.details.apiKey, "getProjectedAprStats", 'Error loading lp apy from curve endpoint', ''+error, ErrorSeverity.ERROR_3));
    }

    return this.aprComponentsToProjectedApr(aprComponents);
  }
}
