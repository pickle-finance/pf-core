import { Provider } from "@ethersproject/abstract-provider";
import { Signer } from "@ethersproject/abstract-signer";
import { BigNumber } from "@ethersproject/bignumber";
import { Contract, ethers } from "ethers";
import { PickleModel } from "../..";
import { Chains } from "../../chain/Chains";
import { JAR_LQTY } from "../../model/JarsAndFarms";
import {
  JarDefinition,
  AssetProjectedApr,
  PickleAsset,
  ExternalAssetDefinition,
  HistoricalYield,
} from "../../model/PickleModelJson";
import {
  ExternalAssetBehavior,
  ICustomHarvester,
  JarHarvestStats,
} from "../JarBehaviorResolver";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import stabilityPool from "../../Contracts/ABIs/stability-pool.json";
import { formatEther } from "ethers/lib/utils";
import { getOrLoadYearnDataFromDune } from "../../protocols/DuneDataUtility";

const stabilityPoolAddr = "0x66017D22b0f8556afDd19FC67041899Eb65a21bb";
const pBAMM = "0x54bC9113f1f55cdBDf221daf798dc73614f6D972";
const pLQTY = "0x65B2532474f717D5A8ba38078B78106D56118bbb";

export class PBammAsset implements ExternalAssetBehavior {
  getCustomHarvester(
    _definition: ExternalAssetDefinition,
    _model: PickleModel,
    _signer: Signer,
    _properties: any,
  ): ICustomHarvester {
    return undefined;
  }
  getProtocolApy(
    _definition: JarDefinition,
    _model: PickleModel,
  ): Promise<HistoricalYield> {
    return undefined;
  }

  async getProjectedAprStats(
    definition: ExternalAssetDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    // LQTY APR calc
    const lusdContract = new Contract(
      model.addr("lusd"),
      erc20Abi,
      model.providerFor(definition.chain),
    );

    const remainingLQTY = 13344950;
    const lusdInSP = await lusdContract.balanceOf(stabilityPoolAddr);
    const lqtyApr =
      (remainingLQTY * model.priceOfSync("lqty")) /
      (+formatEther(lusdInSP) * model.priceOfSync("lusd"));
    const duneData = await getOrLoadYearnDataFromDune(model);
    const liquidationRate =
      duneData?.data?.get_result_by_result_id[0].data?.apr / 100;
    const liquidationYield = (liquidationRate * 0.8 * lqtyApr) / 2;
    const total = (lqtyApr + liquidationYield) * 100;

    return {
      components: [
        { name: "lqty", apr: lqtyApr * 100, compoundable: false },
        {
          name: "liquidation",
          apr: liquidationYield * 100,
          compoundable: false,
        },
      ],
      apr: total,
      apy: total,
    };
  }
  async getDepositTokenPrice(
    definition: ExternalAssetDefinition,
    model: PickleModel,
  ): Promise<number> {
    if (definition && definition.depositToken && definition.depositToken.addr) {
      return await model.priceOf(definition.depositToken.addr);
    }
    return undefined;
  }
  async getAssetHarvestData(
    definition: ExternalAssetDefinition,
    model: PickleModel,
    _balance: BigNumber,
    _available: BigNumber,
    _resolver: Signer | Provider,
  ): Promise<JarHarvestStats> {
    const bal = await getPBammBalance(definition, model);
    return {
      balanceUSD: bal,
      earnableUSD: 0,
      harvestableUSD: 0,
    };
  }
}

export async function getPBammBalance(asset: PickleAsset, model: PickleModel) {
  const stabilityPoolContract = new ethers.Contract(
    stabilityPoolAddr,
    stabilityPool,
    Chains.getResolver(asset.chain),
  );
  const lusdInStabilityPool =
    await stabilityPoolContract.getCompoundedLUSDDeposit(pBAMM);
  const lusdPrice = await model.priceOf("lusd");
  const lusdValue =
    parseFloat(ethers.utils.formatEther(lusdInStabilityPool)) * lusdPrice;

  const pLqtyContract = new ethers.Contract(
    pLQTY,
    erc20Abi,
    Chains.getResolver(asset.chain),
  );
  const pLqtyTokens = await pLqtyContract.balanceOf(pBAMM);
  const lqtyPrice = await model.priceOf("lqty");
  const ratio = (model.findAsset(JAR_LQTY.id) as JarDefinition).details.ratio;
  const lqtyValue =
    parseFloat(ethers.utils.formatEther(pLqtyTokens)) * lqtyPrice * ratio;

  return lusdValue + lqtyValue;
}
