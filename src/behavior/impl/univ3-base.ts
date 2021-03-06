import { BigNumber, ethers } from "ethers";
import { Contract } from "ethers-multiprovider";
import { JarHarvestStats, PickleModel } from "../..";
import { AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import {
  getUniV3,
  queryUniswapTicks,
  queryVolume24H,
} from "../../protocols/Univ3/UniV3";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import {
  calculateFee,
  getLiquidityForAmounts,
  getSqrtPriceX96,
  getTickFromPrice,
  getTokenAmountsFromDepositAmounts,
} from "../../protocols/Univ3/LiquidityMath";
import { univ3StrategyABI } from "../../Contracts/ABIs/univ3Strategy.abi";

export class Univ3Base extends AbstractJarBehavior {
  constructor() {
    super();
  }
  async getDepositTokenPrice(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    const { position, proportion } = await getUniV3(definition, model);

    const jarAmount0 = +position.amount0.toExact();
    const jarAmount1 = +position.amount1.toExact();

    definition.depositToken.componentTokens[0] = jarAmount0;
    definition.depositToken.componentTokens[1] = jarAmount1;
    definition.depositToken.totalSupply = definition.details.tokenBalance;
    definition.depositToken.proportion = proportion.toString();

    const pJarUSD =
      model.priceOfSync(
        definition.depositToken.components[0],
        definition.chain,
      ) *
        jarAmount0 +
      model.priceOfSync(
        definition.depositToken.components[1],
        definition.chain,
      ) *
        jarAmount1;
    const perDepositToken = pJarUSD / definition.details.tokenBalance;
    return perDepositToken;
  }

  async getHarvestableUSD(
    _jar: JarDefinition,
    _model: PickleModel,
  ): Promise<number> {
    // Do not implement.
    return 0;
  }
  async getAssetHarvestData(
    definition: JarDefinition,
    model: PickleModel,
    _balance: BigNumber,
    _available: BigNumber,
  ): Promise<JarHarvestStats> {
    const multiProvider = model.multiproviderFor(definition.chain);
    const strategy = new Contract(
      definition.details.strategyAddr,
      univ3StrategyABI,
      multiProvider,
    );

    const [bal0, bal1] = await strategy.callStatic.getHarvestable({
      from: "0x0f571d2625b503bb7c1d2b5655b483a2fa696fef",
    }); // This is Tsuke

    const decimals0: number = model.tokenDecimals(
      definition.depositToken.components[0],
      definition.chain,
    );
    const decimals1: number = model.tokenDecimals(
      definition.depositToken.components[1],
      definition.chain,
    );

    const harvestableUSD =
      model.priceOfSync(
        definition.depositToken.components[0],
        definition.chain,
      ) *
        parseFloat(ethers.utils.formatUnits(bal0, decimals0)) +
      model.priceOfSync(
        definition.depositToken.components[1],
        definition.chain,
      ) *
        parseFloat(ethers.utils.formatUnits(bal1, decimals1));

    return {
      balanceUSD:
        definition.details.tokenBalance * definition.depositToken.price,
      earnableUSD: 0, // This jar is always earned on user deposit
      harvestableUSD: harvestableUSD,
    };
  }
  async getProjectedAprStats(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    // Based off the math here:
    // https://bestofreactjs.com/repo/chunza2542-uniswapv3-calculator

    const token0Price = model.priceOfSync(
      definition.depositToken.components[0],
      definition.chain,
    );
    const token1Price = model.priceOfSync(
      definition.depositToken.components[1],
      definition.chain,
    );

    const liquidityValue = model.priceOfSync(
      definition.depositToken.addr,
      definition.chain,
    );
    const jarValue =
      definition.details.ratio *
      definition.details.tokenBalance *
      liquidityValue;
    const { position, tokenA, tokenB, pool } = await getUniV3(
      definition,
      model,
    );

    // Get lower and upper tick quotes in terms of USD
    const lowerTickPrice = +position.token0PriceUpper.invert().toFixed();
    const upperTickPrice = +position.token0PriceLower.invert().toFixed();

    const { amount0, amount1 } = getTokenAmountsFromDepositAmounts(
      token1Price,
      lowerTickPrice,
      upperTickPrice,
      token1Price,
      token0Price,
      jarValue,
    );

    const sqrtRatioX96 = getSqrtPriceX96(
      token1Price,
      tokenA.decimals.toFixed() || "18",
      tokenB.decimals.toFixed() || "18",
    );
    const sqrtRatioAX96 = getSqrtPriceX96(
      lowerTickPrice,
      tokenA.decimals.toFixed() || "18",
      tokenB.decimals.toFixed() || "18",
    );
    const sqrtRatioBX96 = getSqrtPriceX96(
      upperTickPrice,
      tokenA.decimals.toFixed() || "18",
      tokenB.decimals.toFixed() || "18",
    );

    const deltaL = getLiquidityForAmounts(
      sqrtRatioX96,
      sqrtRatioAX96,
      sqrtRatioBX96,
      amount0,
      Number(tokenB.decimals.toFixed() || 18),
      amount1,
      Number(tokenA.decimals.toFixed() || 18),
    );
    const currentTick = getTickFromPrice(
      token1Price,
      tokenA.decimals.toFixed() || "18",
      tokenB.decimals.toFixed() || "18",
    );
    const ticks = await queryUniswapTicks(
      definition.depositToken.addr.toLowerCase(),
      definition.chain,
    );
    const liquidityFromPool = pool.liquidity.toString();

    const volume24H = await queryVolume24H(
      definition.depositToken.addr.toLowerCase(),
      definition.chain,
    );

    const feeTier = pool.fee.toString();

    const fee24H = calculateFee(deltaL, liquidityFromPool, volume24H, feeTier);
    const lpApr = (fee24H * 365 * 100) / jarValue;

    return super.aprComponentsToProjectedApr([
      this.createAprComponent("lp", lpApr, true),
    ]);
  }
}
