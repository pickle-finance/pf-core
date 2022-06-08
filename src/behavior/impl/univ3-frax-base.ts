import { Provider } from "@ethersproject/abstract-provider";
import { Signer } from "@ethersproject/abstract-signer";
import { BigNumber, ethers } from "ethers";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import { Chains, JarHarvestStats, PickleModel } from "../..";
import { AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import {
  getUniV3,
  queryUniswapTicks,
  queryVolume24H,
} from "../../protocols/Univ3/UniV3";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import strategyABI from "../../Contracts/ABIs/strategy.json";
import gaugeABI from "../../Contracts/ABIs/frax-univ3-gauge.json";
import {
  calculateFee,
  getLiquidityForAmounts,
  getSqrtPriceX96,
  getTickFromPrice,
  getTokenAmountsFromDepositAmounts,
} from "../../protocols/Univ3/LiquidityMath";
import { Contract } from "ethers-multiprovider";
import { ONE_YEAR_SECONDS } from "../JarBehaviorResolver";

const lockerAddress = "0xd639C2eA4eEFfAD39b599410d00252E6c80008DF";

export abstract class Univ3FraxBase extends AbstractJarBehavior {
  gaugeAddress: any;
  constructor(_gaugeAddress: string) {
    super();
    this.gaugeAddress = _gaugeAddress;
  }

  async getDepositTokenPrice(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    const { position } = await getUniV3(definition, model);

    const jarAmount0 = +position.amount0.toExact();
    const jarAmount1 = +position.amount1.toExact();

    definition.depositToken.componentTokens[0] = jarAmount0;
    definition.depositToken.componentTokens[1] = jarAmount1;
    definition.depositToken.totalSupply = definition.details.tokenBalance;

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
    _model: PickleModel,
    _balance: BigNumber,
    _available: BigNumber,
  ): Promise<JarHarvestStats> {
    const jarV3Abi = [
      {
        inputs: [],
        name: "liquidityOfThis",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
    ];
    const multiProvider = _model.multiproviderFor(definition.chain);
    const strategy = new Contract(definition.details.strategyAddr, strategyABI);
    const jar = new Contract(definition.contract, jarV3Abi);
    const gaugeContract = new Contract(this.gaugeAddress, gaugeABI);
    const fxsToken = new Contract(
      _model.address("fxs", definition.chain),
      erc20Abi,
    );

    const promises = [];
    promises.push(
      multiProvider
        .all([strategy.getHarvestable()])
        .then((x: BigNumber[]) => parseFloat(ethers.utils.formatEther(x[0]))),
    );

    promises.push(
      multiProvider
        .all([fxsToken.balanceOf(definition.details.strategyAddr)])
        .then((x: BigNumber[]) => parseFloat(ethers.utils.formatEther(x[0]))),
    );

    promises.push(
      multiProvider
        .all([jar.liquidityOfThis()])
        .then((x: BigNumber[]) =>
          parseFloat(ethers.utils.formatUnits(x[0], 18)),
        ),
    );
    promises.push(
      multiProvider
        .all([gaugeContract.veFXSMultiplier(lockerAddress)])
        .then((x: BigNumber[]) => parseFloat(ethers.utils.formatEther(x[0]))),
    );
    const [harvestable, fxsBalance, liquidity, mult] = await Promise.all(
      promises,
    );

    return {
      balanceUSD:
        definition.details.tokenBalance * definition.depositToken.price,
      earnableUSD: liquidity * definition.depositToken.price, // This jar is always earned on user deposit
      harvestableUSD:
        (harvestable + fxsBalance) *
        _model.priceOfSync("fxs", definition.chain),
      multiplier: mult,
    };
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

    //FXS APR

    const multiProvider = model.multiproviderFor(definition.chain);
    const gaugeContract = new Contract(this.gaugeAddress, gaugeABI);

    const [totalCombinedWeight, rewardRate, multiplier] =
      await multiProvider.all([
        gaugeContract.totalCombinedWeight(),
        gaugeContract.rewardRate0(),
        gaugeContract.veFXSMultiplier(lockerAddress),
      ]);

    const fxsValuePerYearBN = rewardRate
      .mul(
        BigNumber.from(
          (model.priceOfSync("fxs", definition.chain) * 1e6).toFixed(),
        ),
      )
      .mul(ONE_YEAR_SECONDS.toFixed())
      .div((1e18).toFixed())
      .div((1e6).toFixed());

    const numerator = multiplier
      .add((1e18).toString())
      .mul(fxsValuePerYearBN)
      .mul((1e10).toFixed());

    const denominator = totalCombinedWeight.mul(
      (definition.depositToken.price * 1e6).toFixed(),
    );
    const aprBN = numerator.div(denominator);

    return super.aprComponentsToProjectedApr([
      this.createAprComponent("lp", lpApr, true),
      this.createAprComponent("fxs", parseFloat(aprBN.toString()) / 100, true),
    ]);
  }
}
