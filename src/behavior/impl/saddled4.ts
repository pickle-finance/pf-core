import { ethers, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import communalFarmAbi from "../../Contracts/ABIs/communal_farm.json";
import swapFlashLoanAbi from "../../Contracts/ABIs/swapflashloan.json";
import { saddleStrategyAbi } from "../../Contracts/ABIs/saddle-strategy.abi";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { PickleModel } from "../../model/PickleModel";
import { AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import { Contract as MulticallContract } from "ethers-multicall";
import { formatEther } from "ethers/lib/utils";
import { ONE_YEAR_SECONDS } from "../JarBehaviorResolver";
import { getStableswapPriceAddress } from "../../price/DepositTokenPriceUtility";

export const COMMUNAL_FARM = "0x0639076265e9f88542C91DCdEda65127974A5CA5";
export class SaddleD4 extends AbstractJarBehavior {
  constructor() {
    super();
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
    const multicallProvider = model.multicallProviderFor(jar.chain);
    await multicallProvider.init();
    const multicallCommunalFarm = new MulticallContract(
      COMMUNAL_FARM,
      communalFarmAbi,
    );

    const [fxsRateBN, tribeRateBN, alcxRateBN, lqtyRateBN, totalValueLockedBN] =
      await multicallProvider.all([
        multicallCommunalFarm.rewardRates(0),
        multicallCommunalFarm.rewardRates(1),
        multicallCommunalFarm.rewardRates(2),
        multicallCommunalFarm.rewardRates(3),
        multicallCommunalFarm.totalLiquidityLocked(),
      ]);

    const fxsValPerYear =
      (await model.priceOf("fxs")) *
      parseFloat(formatEther(fxsRateBN)) *
      ONE_YEAR_SECONDS;
    const tribeValPerYear =
      (await model.priceOf("tribe")) *
      parseFloat(formatEther(tribeRateBN)) *
      ONE_YEAR_SECONDS;
    const alcxValPerYear =
      (await model.priceOf("alcx")) *
      parseFloat(formatEther(alcxRateBN)) *
      ONE_YEAR_SECONDS;
    const lqtyValPerYear =
      (await model.priceOf("lqty")) *
      parseFloat(formatEther(lqtyRateBN)) *
      ONE_YEAR_SECONDS;

    const multicallSwapFlashLoan = new MulticallContract(
      swapFlashLoanAddress,
      swapFlashLoanAbi,
    );

    const [virtualPrice] = await multicallProvider.all([
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
    resolver: Signer | Provider,
  ): Promise<number> {
    const strategy = new ethers.Contract(
      jar.details.strategyAddr,
      saddleStrategyAbi,
      resolver,
    );
    const fxsToken = new ethers.Contract(model.addr("fxs"), erc20Abi, resolver);
    const tribeToken = new ethers.Contract(
      model.addr("tribe"),
      erc20Abi,
      resolver,
    );
    const alcxToken = new ethers.Contract(
      model.addr("alcx"),
      erc20Abi,
      resolver,
    );
    const lqtyToken = new ethers.Contract(
      model.addr("lqty"),
      erc20Abi,
      resolver,
    );

    const [
      harvestableArr,
      fxsPrice,
      tribePrice,
      alcxPrice,
      lqtyPrice,
      fxsBal,
      tribeBal,
      alcxBal,
      lqtyBal,
    ] = await Promise.all([
      strategy.getHarvestable(),
      await model.priceOf("fxs"),
      await model.priceOf("tribe"),
      await model.priceOf("alcx"),
      await model.priceOf("lqty"),
      fxsToken.balanceOf(jar.details.strategyAddr),
      tribeToken.balanceOf(jar.details.strategyAddr),
      alcxToken.balanceOf(jar.details.strategyAddr),
      lqtyToken.balanceOf(jar.details.strategyAddr),
    ]);
    const harvestable = harvestableArr[0]
      .add(fxsBal)
      .mul(fxsPrice.toFixed())
      .add(harvestableArr[1].add(tribeBal).mul(tribePrice.toFixed()))
      .add(harvestableArr[2].add(alcxBal).mul(alcxPrice.toFixed()))
      .add(harvestableArr[3].add(lqtyBal).mul(lqtyPrice.toFixed()));
    return parseFloat(ethers.utils.formatEther(harvestable));
  }
}
