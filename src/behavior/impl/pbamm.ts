import { Signer } from "@ethersproject/abstract-signer";
import { BigNumber } from "@ethersproject/bignumber";
import { ethers } from "ethers";
import { PickleModel } from "../..";
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
import { formatEther } from "ethers/lib/utils";
import { getOrLoadYearnDataFromDune } from "../../protocols/DuneDataUtility";
import { Contract } from "ethers-multiprovider";

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
    const multiProvider = model.multiproviderFor(definition.chain);
    const lusdContract = new Contract(model.addr("lusd"), erc20Abi);

    const remainingLQTY = 13344950;
    const [lusdInSP] = await multiProvider.all([
      lusdContract.balanceOf(stabilityPoolAddr),
    ]);
    const lqtyApr =
      (remainingLQTY * model.priceOfSync("lqty", definition.chain)) /
      (+formatEther(lusdInSP) * model.priceOfSync("lusd", definition.chain));
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
      return model.priceOfSync(definition.depositToken.addr, definition.chain);
    }
    return undefined;
  }
  async getAssetHarvestData(
    definition: ExternalAssetDefinition,
    model: PickleModel,
    _balance: BigNumber,
    _available: BigNumber,
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
  const stabilityPoolAbi = [
    {
      inputs: [
        { internalType: "address", name: "_depositor", type: "address" },
      ],
      name: "getCompoundedLUSDDeposit",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
  ];
  const multiProvider = model.multiproviderFor(asset.chain);
  const stabilityPoolContract = new Contract(
    stabilityPoolAddr,
    stabilityPoolAbi,
  );
  const [lusdInStabilityPool] = await multiProvider.all([
    stabilityPoolContract.getCompoundedLUSDDeposit(pBAMM),
  ]);
  const lusdPrice = model.priceOfSync("lusd", asset.chain);
  const lusdValue =
    parseFloat(ethers.utils.formatEther(lusdInStabilityPool)) * lusdPrice;

  const pLqtyContract = new Contract(pLQTY, erc20Abi);
  const [pLqtyTokens] = await multiProvider.all([
    pLqtyContract.balanceOf(pBAMM),
  ]);
  const lqtyPrice = model.priceOfSync("lqty", asset.chain);
  const ratio = (model.findAsset(JAR_LQTY.id) as JarDefinition).details.ratio;
  const lqtyValue =
    parseFloat(ethers.utils.formatEther(pLqtyTokens)) * lqtyPrice * ratio;

  return lusdValue + lqtyValue;
}
