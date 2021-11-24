import { Provider } from "@ethersproject/abstract-provider";
import { Signer } from "@ethersproject/abstract-signer";
import { BigNumber, Contract } from "ethers";
import { Chains, JarHarvestStats, PickleModel } from "../..";
import { AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import { getPosition } from "../../protocols/UniV3";
import jarAbi from "../../Contracts/ABIs/jar.json";
import { AbstractJarBehavior, ONE_YEAR_IN_SECONDS } from "../AbstractJarBehavior";
import { oneEParam } from "../../util/BnUtil";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import { formatEther } from "ethers/lib/utils";

export class Uni3FraxDai extends AbstractJarBehavior {
  async getDepositTokenPrice(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    const resolver: Provider | Signer = model.providerFor(definition.chain);
    const position = await getPosition(definition, resolver);
    const amount0 = +position.amount0.toExact();
    const amount1 = +position.amount1.toExact();

    // Let's override some lower-level data for univ3
    // Since the NFT is really unique, let's make our underlying
    // match us exactly.
    definition.depositToken.componentTokens[0] = amount0;
    definition.depositToken.componentTokens[1] = amount1;
    definition.depositToken.totalSupply = definition.details.tokenBalance;

    const pJarUSD =
      model.priceOfSync("dai") * +position.amount0.toExact() +
      model.priceOfSync("frax") * +position.amount1.toExact();
    const perDepositToken = pJarUSD / definition.details.tokenBalance;
    return perDepositToken;
  }

  async getHarvestableUSD(
    _jar: JarDefinition,
    _model: PickleModel,
    _resolver: Signer | Provider,
  ): Promise<number> {
    // Do not implement.
    return 0;
  }
  async getAssetHarvestData(
    definition: JarDefinition,
    model: PickleModel,
    _balance: BigNumber,
    _available: BigNumber,
    resolver: Signer | Provider,
  ): Promise<JarHarvestStats> {
    // to refactor this into a nicer place, once univ3 stuff set in stone
    const LOCKER = "0xd639C2eA4eEFfAD39b599410d00252E6c80008DF";

    const FRAX_DAI_UNIV3_FARM = "0xF22471AC2156B489CC4a59092c56713F813ff53e";
    const fraxUniv3Farm = new Contract(
      FRAX_DAI_UNIV3_FARM,
      FRAX_UNIV3_INTERFACE,
      resolver,
    );
    const rewardTokens: BigNumber = await fraxUniv3Farm.earned(LOCKER);
    const decimals: number = model.tokenDecimals("fxs", definition.chain);
    const fxsPrice: number = model.priceOfSync("fxs");
    const harvestable =
      BigNumber.from((fxsPrice * 1e4).toFixed())
        .mul(rewardTokens)
        .div(oneEParam(decimals))
        .toNumber() / 1e4;

    // Earnable
    const daiContract = new Contract(
      model.address("dai", definition.chain),
      erc20Abi,
      resolver,
    );
    const fraxContract = new Contract(
      model.address("frax", definition.chain),
      erc20Abi,
      resolver,
    );
    const [daiBal, fraxBal] = await Promise.all([
      daiContract.balanceOf(definition.contract),
      fraxContract.balanceOf(definition.contract),
    ]);
    const earnableDai = daiBal.mul(model.priceOfSync("dai").toFixed());
    const earnableFrax = fraxBal.mul(model.priceOfSync("frax").toFixed());

    return {
      balanceUSD:
        definition.details.tokenBalance * definition.depositToken.price,
      earnableUSD: earnableDai.add(earnableFrax).toNumber(),
      harvestableUSD: harvestable,
    };
  }

  // To generalize into a frax univ3-specific function
  async getProjectedAprStats(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const resolver: Provider | Signer = model.providerFor(jar.chain);
    const fraxUniv3Farm = new Contract(
      FRAX_DAI_UNIV3_FARM,
      FRAX_UNIV3_INTERFACE,
      resolver,
    );

    const jarV3 = new Contract(jar.contract, jarAbi, resolver);

    const [fxsRateBN, totalLiquidityBN] = await Promise.all([
      fraxUniv3Farm.rewardRate0(),
      fraxUniv3Farm.totalLiquidityLocked(),
    ]);

    const valueRewardedPerYear =
    model.priceOfSync("fxs")* parseFloat(formatEther(fxsRateBN)) * ONE_YEAR_IN_SECONDS;

    const [numDai, numFrax] = await jarV3.getAmountsForLiquidity(
      totalLiquidityBN,
    );

    const totalValueStaked =
      parseFloat(formatEther(numDai)) * model.priceOfSync("dai") +
      parseFloat(formatEther(numFrax)) * model.priceOfSync("frax");
    const fxsAPY = valueRewardedPerYear / totalValueStaked;

    return super.aprComponentsToProjectedApr([
      this.createAprComponent("fxs", fxsAPY, true),
    ]);
  }
}

const FRAX_DAI_UNIV3_FARM = "0xF22471AC2156B489CC4a59092c56713F813ff53e";

const FRAX_UNIV3_INTERFACE = [
  "function rewardRate0() view returns(uint256)",
  "function totalLiquidityLocked() view returns(uint256)",
  "function earned() view returns(uint256)",
];
