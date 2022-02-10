import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import { AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { PickleModel } from "../../model/PickleModel";
import { convexStrategyMim3CRVAbi } from "../../Contracts/ABIs/convex-strategy-mim3crv.abi";
import { getProjectedConvexAprStats } from "../../protocols/ConvexUtility";
import { getStableswapPrice } from "../../price/DepositTokenPriceUtility";

// TODO strategy being migrated to convex
export class Mim3Crv extends AbstractJarBehavior {
  protected strategyAbi: any;

  constructor() {
    super();
    this.strategyAbi = convexStrategyMim3CRVAbi;
  }

  async getDepositTokenPrice(
    asset: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    return getStableswapPrice(asset, model);
  }

  async getProjectedAprStats(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    return this.aprComponentsToProjectedApr(
      await getProjectedConvexAprStats(definition, model),
    );
  }

  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
    resolver: Signer | Provider,
  ): Promise<number> {
    return this.getHarvestableUSDDefaultImplementation(
      jar,
      model,
      resolver,
      ["crv", "cvx", "spell"],
      this.strategyAbi,
    );
  }
}
