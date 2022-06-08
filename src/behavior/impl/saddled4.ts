import communalFarmAbi from "../../Contracts/ABIs/communal_farm.json";
import swapFlashLoanAbi from "../../Contracts/ABIs/swapflashloan.json";
import { saddleStrategyAbi } from "../../Contracts/ABIs/saddle-strategy.abi";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { PickleModel } from "../../model/PickleModel";
import { AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import { Contract } from "ethers-multiprovider";
import { formatEther } from "ethers/lib/utils";
import { ONE_YEAR_SECONDS } from "../JarBehaviorResolver";
import { getStableswapPriceAddress } from "../../price/DepositTokenPriceUtility";

export const COMMUNAL_FARM = "0x0639076265e9f88542C91DCdEda65127974A5CA5";
export class SaddleD4 extends AbstractJarBehavior {
  protected strategyAbi: any;

  constructor() {
    super();
    this.strategyAbi = saddleStrategyAbi;
  }

  async getDepositTokenPrice(
    asset: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    return getStableswapPriceAddress(
      "0xc69ddcd4dfef25d8a793241834d4cc4b3668ead6",
      asset,
      model,
    );
  }

  async getProjectedAprStats(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    return this.calculateSaddleD4APY(definition, model);
  }

  async calculateSaddleD4APY(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const swapFlashLoanAddress = "0xC69DDcd4DFeF25D8a793241834d4cc4b3668EAD6";
    const multiProvider = model.multiproviderFor(jar.chain);
    const multicallCommunalFarm = new Contract(COMMUNAL_FARM, communalFarmAbi);

    const [fxsRateBN, tribeRateBN, alcxRateBN, lqtyRateBN, totalValueLockedBN] =
      await multiProvider.all([
        multicallCommunalFarm.rewardRates(0),
        multicallCommunalFarm.rewardRates(1),
        multicallCommunalFarm.rewardRates(2),
        multicallCommunalFarm.rewardRates(3),
        multicallCommunalFarm.totalLiquidityLocked(),
      ]);

    const fxsValPerYear =
      model.priceOfSync("fxs", jar.chain) *
      parseFloat(formatEther(fxsRateBN)) *
      ONE_YEAR_SECONDS;
    const tribeValPerYear =
      model.priceOfSync("tribe", jar.chain) *
      parseFloat(formatEther(tribeRateBN)) *
      ONE_YEAR_SECONDS;
    const alcxValPerYear =
      model.priceOfSync("alcx", jar.chain) *
      parseFloat(formatEther(alcxRateBN)) *
      ONE_YEAR_SECONDS;
    const lqtyValPerYear =
      model.priceOfSync("lqty", jar.chain) *
      parseFloat(formatEther(lqtyRateBN)) *
      ONE_YEAR_SECONDS;

    const multicallSwapFlashLoan = new Contract(
      swapFlashLoanAddress,
      swapFlashLoanAbi,
    );

    const [virtualPrice] = await multiProvider.all([
      multicallSwapFlashLoan.getVirtualPrice(),
    ]);
    const priceOfSaddle = parseFloat(formatEther(virtualPrice));
    const totalValueStaked =
      parseFloat(formatEther(totalValueLockedBN)) * priceOfSaddle;

    const fxsApr = (fxsValPerYear / totalValueStaked) * 100;
    const tribeApr = (tribeValPerYear / totalValueStaked) * 100;
    const alcxApr = (alcxValPerYear / totalValueStaked) * 100;
    const lqtyApr = (lqtyValPerYear / totalValueStaked) * 100;

    return this.aprComponentsToProjectedApr([
      this.createAprComponent("FXS", fxsApr, true),
      this.createAprComponent("TRIBE", tribeApr, true),
      this.createAprComponent("ALCX", alcxApr, true),
      this.createAprComponent("LQTY", lqtyApr, true),
    ]);
  }

  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    return this.getHarvestableUSDDefaultImplementation(
      jar,
      model,
      ["fxs", "tribe", "alcx", "lqty"],
      this.strategyAbi,
    );
  }
}
