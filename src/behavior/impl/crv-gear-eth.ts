import fetch from "cross-fetch";
import { Chains, PickleModel } from "../..";
import { JarDefinition, AssetProjectedApr } from "../../model/PickleModelJson";
import { Contract } from "ethers-multiprovider";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import { CurveJar, getCurveRawStats } from "./curve-jar";
import { BigNumber, utils } from "ethers";
import { formatEther } from "ethers/lib/utils";

const strategyABI = [
  "function getHarvestable() external returns (uint256, uint256)",
];

export const GEAR_GAUGE_ADDR = "0x37Efc3f05D659B30A83cf0B07522C9d08513Ca9d";
export const GEAR_POOL_ADDR = "0x0E9B5B092caD6F1c5E6bc7f89Ffe1abb5c95F1C2";
export class CurveGearEth extends CurveJar {
  constructor() {
    super(GEAR_GAUGE_ADDR);
  }

  async getDepositTokenPrice(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    const multiProvider = model.multiproviderFor(definition.chain);
    const gearToken = new Contract(
      model.address("gear", definition.chain),
      erc20Abi,
    );
    const poolToken = new Contract(definition.depositToken.addr, erc20Abi);
    const [poolCvx, totalSupply] = await multiProvider.all([
      gearToken.balanceOf(GEAR_POOL_ADDR),
      poolToken.totalSupply(),
    ]);
    const gearPrice = model.priceOfSync("gear", definition.chain);

    const depositTokenPrice = poolCvx
      .mul(BigNumber.from((gearPrice * 1e8).toFixed()))
      .mul(2)
      .div(totalSupply)
      .mul((1e18).toFixed())
      .div((1e8).toFixed());

    return parseFloat(formatEther(depositTokenPrice));
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

    const [gearHarvestable, crvHarvestable] =
      await strategy.callStatic.getHarvestable();
    const gearPrice = model.priceOfSync("gear", jar.chain);
    const crvPrice = model.priceOfSync("crv", jar.chain);
    const harvestableUSD =
      +utils.formatEther(gearHarvestable) * gearPrice +
      +utils.formatEther(crvHarvestable) * crvPrice;
    return harvestableUSD;
  }

  async getProjectedAprStats(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const curveStats = (
      await fetch(
        "https://api.curve.fi/api/getPools/ethereum/factory-crypto",
      ).then((x) => x.json())
    )?.data;

    const gearPoolStats = curveStats?.poolData.find(
      (x) => x.address === GEAR_POOL_ADDR,
    );

    const crvApy = gearPoolStats.gaugeCrvApy?.[0];
    const gearApy = gearPoolStats.gaugeRewards?.[0].apy;

    const curveRawStats: any = await getCurveRawStats(
      model,
      definition.chain,
      true,
    );

    return this.aprComponentsToProjectedApr([
      this.createAprComponent(
        "gear",
        gearApy,
        true,
        1 - Chains.get(definition.chain).defaultPerformanceFee,
      ),
      this.createAprComponent(
        "crv",
        crvApy,
        true,
        1 - Chains.get(definition.chain).defaultPerformanceFee,
      ),
      this.createAprComponent(
        "lp",
        curveRawStats ? curveRawStats[GEAR_POOL_ADDR] : 0,
        true,
      ),
    ]);
  }
}
