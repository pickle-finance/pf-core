import { JAR_ALETH, JAR_sCRV } from "../model/JarsAndFarms";
import { PickleModel, toError } from "../model/PickleModel";
import {
  AssetProtocol,
  PickleAsset,
  XYK_SWAP_PROTOCOLS,
} from "../model/PickleModelJson";
import { getLivePairDataFromContracts } from "../protocols/GenericSwapUtil";
import CurvePoolABI from "../Contracts/ABIs/curve-pool.json";
import MetaPoolABI from "../Contracts/ABIs/meta-pool.json";
import { ethers } from "ethers";
import { Contract } from "ethers-multiprovider";
import { ErrorSeverity } from "../core/platform/PlatformInterfaces";

/*
    Most of this class has been moved into the jar behavior classes directly.
    What remains are either generic functions that cover wide swaths of jars
    (sushi, uni, curve, etc) or the few leftovers with no home.
*/
function isGenericSwapProtocol(protocol: string): boolean {
  return (
    XYK_SWAP_PROTOCOLS.filter((x) => x.protocol.toString() === protocol)
      .length > 0
  );
}

export async function getDepositTokenPriceForSwap(
  asset: PickleAsset,
  model: PickleModel,
): Promise<number> {
  return (await getLivePairDataFromContracts(asset, model, 18)).pricePerToken;
}

/*
    Use the deposit token itself (instead of some staking location) as the stableswap address
*/
export async function getStableswapPrice(
  asset: PickleAsset,
  model: PickleModel,
): Promise<number> {
  return getStableswapPriceAddress(asset.depositToken.addr, asset, model);
}

/*
    This function only returns the virtual price!
    It is important for callers to multiply the result by the
    lowest value asset in the pool!

    ie, for eth-steth, you should multiply this result by min(weth, steth)
    and for crv/cvxcrv you should multiply this result by min(cvx, cvxcrv)
    and so on...
*/
export async function getStableswapPriceAddress(
  addr: string,
  asset: PickleAsset,
  model: PickleModel,
): Promise<number> {
  const curveStyle =
    asset.protocol === AssetProtocol.CURVE ||
    asset.protocol === AssetProtocol.YEARN ||
    asset.protocol === AssetProtocol.ROSE;
  const PoolABI = curveStyle ? CurvePoolABI : MetaPoolABI;

  const multiProvider = model.multiproviderFor(asset.chain);
  const pool = new Contract(addr, PoolABI);
  let virtualPrice = 0;
  try {
    [virtualPrice] = await (curveStyle
      ? multiProvider.all([pool.get_virtual_price()])
      : multiProvider.all([pool.getVirtualPrice()]));
  } catch (e) {
    model.logPlatformError(toError(200201, asset.chain, asset.details.apiKey, "getStableswapPriceAddress", 
    `Error loading stableswap price for asset`, ''+e, ErrorSeverity.ERROR_3));
  }
  return parseFloat(ethers.utils.formatEther(virtualPrice));
}

/*
     Most of this has been moved to the actual jar behavior classes.
     What remains here is mostly junk with no home or generic methods
     in use by many that I haven't had a chance to move yet.
    */
export async function getDepositTokenPrice(
  asset: PickleAsset,
  model: PickleModel,
): Promise<number> {
  // first, always check the cache or generic tokens for deposit
  const depTokenAddr = asset.depositToken.addr;
  const checkCache = model.priceOfSync(depTokenAddr, asset.chain);
  if (checkCache) return checkCache;

  // Next check if its a common swap utility
  const isSwapUtil: boolean = isGenericSwapProtocol(asset.protocol);
  if (isSwapUtil) {
    return getDepositTokenPriceForSwap(asset, model);
  }

  // The rest of this is leftover.
  // The jars below don't have a behavior class currently.
  if (depTokenAddr === JAR_sCRV.depositToken.addr) {
    return await getStableswapPriceAddress(
      "0xA5407eAE9Ba41422680e2e00537571bcC53efBfD",
      asset,
      model,
    );
  }

  if (depTokenAddr === JAR_ALETH.depositToken.addr) {
    return model.priceOfSync("weth", asset.chain);
  }

  return undefined;
}
