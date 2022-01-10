import { Provider } from "@ethersproject/abstract-provider";
import { Signer } from "@ethersproject/abstract-signer";
import { BigNumber, ethers } from "ethers";
import { Chains, JarHarvestStats, PickleModel } from "../..";
import { AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import { getPosition } from "../../protocols/UniV3";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import jarV3Abi from "../../Contracts/ABIs/jar-v3.json";
import { univ3StrategyABI } from "../../Contracts/ABIs/univ3Strategy.abi";
export class Uni3UsdcEth extends AbstractJarBehavior {
  async getDepositTokenPrice(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    const provider: Provider | Signer = Chains.get(
      definition.chain,
    ).getProviderOrSigner();

    const jarV3 = new ethers.Contract(definition.contract, jarV3Abi, provider);

    const positionData = await getPosition(jarV3, provider);

    const jarAmount0 = +positionData.amount0.toExact();
    const jarAmount1 = +positionData.amount1.toExact();

    definition.depositToken.componentTokens[0] = jarAmount0;
    definition.depositToken.componentTokens[1] = jarAmount1;
    definition.depositToken.totalSupply = definition.details.tokenBalance;

    const pJarUSD =
      model.priceOfSync("usdc") * jarAmount0 +
      model.priceOfSync("weth") * jarAmount1;
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
    _model: PickleModel,
    _balance: BigNumber,
    _available: BigNumber,
    _resolver: Signer | Provider,
  ): Promise<JarHarvestStats> {
    const strategy = new ethers.Contract(
      definition.details.strategyAddr,
      univ3StrategyABI,
      _resolver,
    );

    const [bal0, bal1] = await strategy.callStatic.getHarvestable({
      from: "0x0f571d2625b503bb7c1d2b5655b483a2fa696fef",
    }); // This is Tsuke

    const decimals0: number = _model.tokenDecimals("usdc", definition.chain);
    const decimals1: number = _model.tokenDecimals("weth", definition.chain);

    const harvestableUSD =
      _model.priceOfSync("usdc") *
        parseFloat(ethers.utils.formatUnits(bal0, decimals0)) +
      _model.priceOfSync("weth") *
        parseFloat(ethers.utils.formatUnits(bal1, decimals1));

    return {
      balanceUSD:
        definition.details.tokenBalance * definition.depositToken.price,
      earnableUSD: 0, // This jar is always earned on user deposit
      harvestableUSD: harvestableUSD,
    };
  }
  async getProjectedAprStats(
    _jar: JarDefinition,
    _model: PickleModel,
  ): Promise<AssetProjectedApr> {
    // TODO - need to implement this fancy way of calculating Uni V3 fees
    // https://bestofreactjs.com/repo/chunza2542-uniswapv3-calculator
    return super.aprComponentsToProjectedApr([]);
  }
}
