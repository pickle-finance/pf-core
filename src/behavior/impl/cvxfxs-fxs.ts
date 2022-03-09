import { ethers } from "ethers";
import { AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { PickleModel } from "../../model/PickleModel";
import { convexStrategyMim3CRVAbi } from "../../Contracts/ABIs/convex-strategy-mim3crv.abi";
import { getProjectedConvexAprStats } from "../../protocols/ConvexUtility";
import fxsPoolABI from "../../Contracts/ABIs/fxs-pool.json";
import { Contract as MultiContract } from "ethers-multicall";

const FXS_POOL = "0xd658a338613198204dca1143ac3f01a722b5d94a";

// TODO strategy being migrated to convex
export class CvxfxsFxs extends AbstractJarBehavior {
  protected strategyAbi: any;

  constructor() {
    super();
    this.strategyAbi = convexStrategyMim3CRVAbi;
  }

  // FXS_POOL contract does not support multicalls
  async getDepositTokenPrice(
    asset: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    const resolver = model.providerFor(asset.chain);
    const pool = new ethers.Contract(FXS_POOL, fxsPoolABI, resolver);
    const [virtualPrice, lpPrice] = await Promise.all([
      pool.callStatic["get_virtual_price"](),
      pool.callStatic["lp_price"](),
    ]);

    const price =
      +ethers.utils.formatEther(virtualPrice) *
      +ethers.utils.formatEther(lpPrice) *
      model.priceOfSync("fxs", asset.chain);

    return price;
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
  ): Promise<number> {
    return this.getHarvestableUSDComManImplementation(
      jar,
      model,
      ["crv", "cvx", "fxs"],
      this.strategyAbi,
    );
  }
}
