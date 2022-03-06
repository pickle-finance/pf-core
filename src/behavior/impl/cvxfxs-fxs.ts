import { ethers, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import { AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { PickleModel } from "../../model/PickleModel";
import { convexStrategyMim3CRVAbi } from "../../Contracts/ABIs/convex-strategy-mim3crv.abi";
import { getProjectedConvexAprStats } from "../../protocols/ConvexUtility";
import { getStableswapPrice } from "../../price/DepositTokenPriceUtility";
import fxsPoolABI from "../../Contracts/ABIs/fxs-pool.json";

const FXS_POOL = "0xd658a338613198204dca1143ac3f01a722b5d94a";

// TODO strategy being migrated to convex
export class CvxfxsFxs extends AbstractJarBehavior {
  protected strategyAbi: any;

  constructor() {
    super();
    this.strategyAbi = convexStrategyMim3CRVAbi;
  }

  async getDepositTokenPrice(
    asset: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    const provider: Provider = model.providerFor(asset.chain);

    const pool = new ethers.Contract(FXS_POOL, fxsPoolABI, provider);
    const virtualPrice = await pool.get_virtual_price();
    const lpPrice = await pool.lp_price();

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
    resolver: Signer | Provider,
  ): Promise<number> {
    return this.getHarvestableUSDDefaultImplementation(
      jar,
      model,
      resolver,
      ["crv", "cvx", "fxs"],
      this.strategyAbi,
    );
  }
}
