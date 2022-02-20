import { Provider } from "@ethersproject/abstract-provider";
import { Signer } from "@ethersproject/abstract-signer";
import { ethers } from "ethers";
import { Chains, PickleModel } from "../..";
import { AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import {
  getUniV3,
  queryUniswapTicks,
  queryVolume24H,
} from "../../protocols/Univ3/UniV3";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import jarV3Abi from "../../Contracts/ABIs/jar-v3.json";
import strategyABI from "../../Contracts/ABIs/strategy.json";
import gaugeABI from "../../Contracts/ABIs/frax-gauge.json";
import {
  calculateFee,
  getLiquidityForAmounts,
  getSqrtPriceX96,
  getTickFromPrice,
  getTokenAmountsFromDepositAmounts,
} from "../../protocols/Univ3/LiquidityMath";

export class Univ3FraxBase extends AbstractJarBehavior {
  constructor() {
    super();
  }
  async getDepositTokenPrice(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    const provider: Provider | Signer = Chains.get(
      definition.chain,
    ).getProviderOrSigner();

    const jarV3 = new ethers.Contract(definition.contract, jarV3Abi, provider);

    const { position } = await getUniV3(jarV3, provider);

    const jarAmount0 = +position.amount0.toExact();
    const jarAmount1 = +position.amount1.toExact();

    definition.depositToken.componentTokens[0] = jarAmount0;
    definition.depositToken.componentTokens[1] = jarAmount1;
    definition.depositToken.totalSupply = definition.details.tokenBalance;

    const pJarUSD =
      model.priceOfSync(definition.depositToken.components[0]) * jarAmount0 +
      model.priceOfSync(definition.depositToken.components[1]) * jarAmount1;
    const perDepositToken = pJarUSD / definition.details.tokenBalance;
    return perDepositToken;
  }

  async getHarvestableUSD(
    _jar: JarDefinition,
    _model: PickleModel,
    _resolver: Signer | Provider,
  ): Promise<number> {
    return this.getHarvestableUSDDefaultImplementation(
      _jar,
      _model,
      _resolver,
      ["fxs"],
      strategyABI,
    );
  }

  async getProjectedAprStats(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    // Based off the math here:
    // https://bestofreactjs.com/repo/chunza2542-uniswapv3-calculator

    const provider: Provider | Signer = Chains.get(
      definition.chain,
    ).getProviderOrSigner();

    const token0Price = await model.priceOf(
      definition.depositToken.components[0],
    );
    const token1Price = await model.priceOf(
      definition.depositToken.components[1],
    );

    const liquidityValue = await model.priceOf(definition.depositToken.addr);
    const jarValue =
      definition.details.ratio *
      definition.details.tokenBalance *
      liquidityValue;
    const jarV3 = new ethers.Contract(definition.contract, jarV3Abi, provider);

    const { position, tokenA, tokenB, pool } = await getUniV3(jarV3, provider);

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

    //FXS APR

    const gaugeContract = new ethers.Contract(
      "0xF22471AC2156B489CC4a59092c56713F813ff53e",
      gaugeABI,
      provider,
    );

    const combinedWeightOf = await gaugeContract.combinedWeightOf(
      "0xd639C2eA4eEFfAD39b599410d00252E6c80008DF",
    );

    const totalCombinedWeight = await gaugeContract.totalCombinedWeight();
    const rewardRate = await gaugeContract.rewardRate0();
    const multiplier = await gaugeContract.veFXSMultiplier(
      "0xd639C2eA4eEFfAD39b599410d00252E6c80008DF",
    );

    const fxsApr =
      (rewardRate * 1e18 * 2) /* * 60 * 24 * 365 */ / totalCombinedWeight;

    return super.aprComponentsToProjectedApr([
      this.createAprComponent("lp", lpApr, true),
      this.createAprComponent("fxs", fxsApr, true),
    ]);
  }
}
