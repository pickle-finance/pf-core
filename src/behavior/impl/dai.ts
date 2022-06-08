import { ethers } from "ethers";
import { AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { foldingStrategyAbi } from "../../Contracts/ABIs/folding-strategy.abi";
import AaveStrategyAbi from "../../Contracts/ABIs/aave-strategy.json";
import { PickleModel } from "../../model/PickleModel";
import { Contract } from "ethers-multiprovider";
import { ChainNetwork } from "../../chain/Chains";
import fetch from "cross-fetch";

export class DaiJar extends AbstractJarBehavior {
  async getDepositTokenPrice(
    asset: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    // TODO is this correct? Is there no virtual price?
    return model.priceOfSync("dai", asset.chain);
  }

  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    const multiProvider = model.multiproviderFor(jar.chain);
    const strategy = new Contract(jar.details.strategyAddr, foldingStrategyAbi);
    const [matic] = await multiProvider.all([strategy.getMaticAccrued()]);
    const maticPrice = model.priceOfSync("matic", jar.chain);
    const harvestable = matic.mul(maticPrice.toFixed());
    return parseFloat(ethers.utils.formatEther(harvestable));
  }

  async getProjectedAprStats(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    return this.calculateAaveAPY(
      definition,
      model,
      model.address("dai", ChainNetwork.Polygon),
      "0x0b198b5EE64aB29c98A094380c867079d5a1682e",
    );
  }

  async calculateAaveAPY(
    jar: JarDefinition,
    model: PickleModel,
    assetAddress: string,
    strategyAddress: string,
  ): Promise<AssetProjectedApr> {
    const pools = await fetch(
      "https://aave-api-v2.aave.com/data/liquidity/v2?poolId=0xd05e3E715d945B59290df0ae8eF85c1BdB684744",
    ).then((response) => response.json());
    const pool = pools?.find(
      (pool) =>
        pool.underlyingAsset.toUpperCase() === assetAddress.toUpperCase(),
    );

    const maticPrice = model.priceOfSync("matic", jar.chain);
    if (!pool || !maticPrice)
      return super.aprComponentsToProjectedApr([
        super.createAprComponent("Error Loading APY", 0, false),
      ]);

    const multiProvider = model.multiproviderFor(jar.chain);
    const aaveStrategy = new Contract(strategyAddress, AaveStrategyAbi);
    const [supplied, borrowed, balance] = (
      await multiProvider.all([
        aaveStrategy.getSuppliedView(),
        aaveStrategy.getBorrowedView(),
        aaveStrategy.balanceOfPool(),
      ])
    ).map((x) => parseFloat(ethers.utils.formatEther(x)));

    let rawSupplyAPY = +pool["avg1DaysLiquidityRate"];
    let rawBorrowAPY = +pool["avg1DaysVariableBorrowRate"];
    if (isNaN(rawSupplyAPY)) {
      rawSupplyAPY = +pool["avg7DaysLiquidityRate"];
    }
    if (isNaN(rawBorrowAPY)) {
      rawBorrowAPY = +pool["avg7DaysLiquidityRate"];
    }

    const supplyMaticAPR =
      (+pool.aEmissionPerSecond * 365 * 3600 * 24 * maticPrice) /
      +pool["totalLiquidity"] /
      +pool["referenceItem"]["priceInUsd"];
    const borrowMaticAPR =
      (+pool.vEmissionPerSecond * 365 * 3600 * 24 * maticPrice) /
      +pool["totalDebt"] /
      +pool["referenceItem"]["priceInUsd"];

    const maticAPR =
      (supplied * supplyMaticAPR + borrowed * borrowMaticAPR) /
      (balance * 1e18);

    const rawAPY =
      (rawSupplyAPY * supplied - rawBorrowAPY * borrowed) / balance;

    return super.aprComponentsToProjectedApr([
      super.createAprComponent("lp", rawAPY * 100, false),
      super.createAprComponent("matic", maticAPR * 100, true),
    ]);
  }
}
