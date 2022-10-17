import { formatEther, formatUnits } from "ethers/lib/utils";
import { AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import {
  AbstractJarBehavior,
  createAprComponentImpl,
} from "../AbstractJarBehavior";

import UwuStrategyAbi from "../../Contracts/ABIs/uwu-strategy.json";
import AavePoolAbi from "../../Contracts/ABIs/aave-pool.json";

import { PickleModel } from "../../model/PickleModel";
import { Contract } from "ethers-multiprovider";
import { Chains } from "../../chain/Chains";
import fetch from "cross-fetch";

const UWU_LENDING_POOL = "0x2409aF0251DCB89EE3Dee572629291f9B087c668";
const UWU_REWARDS = "0x21953192664867e19F85E96E1D1Dd79dc31cCcdB";

export class UwuJar extends AbstractJarBehavior {
  async getDepositTokenPrice(
    asset: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    return super.getDepositTokenPrice(asset, model);
  }

  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    return this.getHarvestableUSDDefaultImplementation(
      jar,
      model,
      ["uwu"],
      UwuStrategyAbi,
    );
  }

  async getProjectedAprStats(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const multiProvider = model.multiproviderFor(definition.chain);
    const strategy = new Contract(
      definition.details.strategyAddr,
      UwuStrategyAbi,
    );
    const uwuLendingPool = new Contract(UWU_LENDING_POOL, AavePoolAbi);

    const [aToken, debtToken, leverageBN, reserveData] =
      await multiProvider.all([
        strategy.aToken(),
        strategy.variableDebtToken(),
        strategy.getCurrentLeverage(),
        uwuLendingPool.getReserveData(definition.depositToken.addr),
      ]);

    const leverage = +formatEther(leverageBN);
    const supplyRate = +formatUnits(reserveData.currentLiquidityRate, 27);
    const borrowRate = +formatUnits(reserveData.currentVariableBorrowRate, 27);

    const pools = await fetch(
      "https://api.uwulend.finance/lendingPoolRewards.json",
    ).then((response) => response.json());

    const uwuBorrowApr =
      pools?.data?.poolAPRs?.find(
        (pool) => pool.tokenAddress.toLowerCase() === debtToken.toLowerCase(),
      )?.apr *
        100 *
        +formatEther(leverageBN) || 0;

    const uwuSupplyApr =
      pools?.data?.poolAPRs?.find(
        (pool) => pool.tokenAddress.toLowerCase() === aToken.toLowerCase(),
      )?.apr *
        100 *
        +formatEther(leverageBN) || 0;

    const fee = 1 - Chains.get(definition.chain).defaultPerformanceFee;

    return this.aprComponentsToProjectedApr([
      createAprComponentImpl("uwu (supply)", uwuSupplyApr / 2, true, fee),
      createAprComponentImpl("uwu (borrow)", uwuBorrowApr / 2, true, fee),
      createAprComponentImpl(
        "borrow",
        -(borrowRate * leverage * 100),
        false,
        fee,
      ),
      createAprComponentImpl("supply", supplyRate * leverage * 100, false, fee),
    ]);
  }
}
