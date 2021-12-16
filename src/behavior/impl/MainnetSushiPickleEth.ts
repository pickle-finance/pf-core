import { Provider } from "@ethersproject/abstract-provider";
import { Signer } from "@ethersproject/abstract-signer";
import { BigNumber } from "@ethersproject/bignumber";
import { PickleModel } from "../..";
import {
  JarDefinition,
  AssetProjectedApr,
  ExternalAssetDefinition,
  HistoricalYield,
} from "../../model/PickleModelJson";
import { ExternalAssetBehavior, ICustomHarvester, JarHarvestStats } from "../JarBehaviorResolver";
import { chefV2AprStatsStatic } from "./sushi-jar";
import { GenericSwapUtility } from "../../protocols/GenericSwapUtil";
import { getSwapUtilityForProtocol } from "../../protocols/ProtocolUtil";
import { getDepositTokenPrice } from "../../price/DepositTokenPriceUtility";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import { Contract } from "ethers";

export class MainnetSushiPickleEth implements ExternalAssetBehavior {
  getCustomHarvester(_definition: ExternalAssetDefinition, _model: PickleModel, _signer: Signer, _properties: any): ICustomHarvester {
    return undefined;
  }
  async getProtocolApy(definition: JarDefinition, _model: PickleModel): Promise<HistoricalYield> {
    const swap: GenericSwapUtility = getSwapUtilityForProtocol(definition);
    if (swap !== undefined) {
      const ret = await swap.runThirtyDaysSingleJar(
        definition.depositToken.addr,
      );
      return ret;
    }
}

  async getProjectedAprStats(
    definition: ExternalAssetDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    return await chefV2AprStatsStatic(definition, model, "pickle");
  }

  async getDepositTokenPrice(
    definition: ExternalAssetDefinition,
    model: PickleModel,
  ): Promise<number> {
    if (definition && definition.depositToken && definition.depositToken.addr) {
      return getDepositTokenPrice(definition, model);
    }
    return undefined;
  }
  async getAssetHarvestData(
    definition: ExternalAssetDefinition,
    model: PickleModel,
    _balance: BigNumber,
    _available: BigNumber,
    resolver: Signer | Provider,
  ): Promise<JarHarvestStats> {
    const depositToken = definition.depositToken.addr;
    const sushiMC = definition.contract;
    const bal : BigNumber = await new Contract(depositToken, erc20Abi, resolver).balanceOf(sushiMC);
    const ppt = (100*model.priceOfSync(depositToken)).toFixed();
    const finalBalance = bal.mul(ppt).div(1e9).div(1e9).div(1e2);
    return {
      balanceUSD: finalBalance.toNumber(),
      earnableUSD: 0,
      harvestableUSD: 0,
    };
  }
}