import { ChainNetwork } from "..";
import { ErrorSeverity } from "../core/platform/PlatformInterfaces";
import { CoinGeckoPriceResolverSingleton } from "../price/CoinGeckoPriceResolver";
import { setAllCoinMarketCapPricesOnTokens } from "../price/CoinMarketCapPriceResolver";
import {
  ExternalToken,
  ExternalTokenFetchStyle,
} from "../price/ExternalTokenModel";
import { calculateSwapTokenPrices } from "../price/SwapPriceResolver";
import { PickleModel, toError } from "./PickleModel";

export const isCgFetchType = (token: ExternalToken): boolean => {
  return (
    token.fetchType === ExternalTokenFetchStyle.CONTRACT ||
    token.fetchType === ExternalTokenFetchStyle.ID ||
    token.fetchType === ExternalTokenFetchStyle.BOTH
  );
};
export const isCgFetchTypeContract = (token: ExternalToken): boolean => {
  return (
    token.fetchType === ExternalTokenFetchStyle.CONTRACT ||
    token.fetchType === ExternalTokenFetchStyle.BOTH
  );
};

export const setAllPricesOnTokens = async (
  chains: ChainNetwork[],
  model: PickleModel,
): Promise<void> => {
  const cgPricePromise: Promise<void>[] = chains.map((x) => CoinGeckoPriceResolverSingleton.setCoingeckoPricesOnTokens(x));
  const cmcPricePromise = setAllCoinMarketCapPricesOnTokens(chains);
  const swapPricePromise = calculateSwapTokenPrices(chains, model);

  try {
    await Promise.all(cgPricePromise);
  } catch( error ) {
    model.logPlatformError(toError(100135, undefined, "", "setAllPricesOnTokens/cgPricePromise",  `Unexpected Error`, ""+error, ErrorSeverity.SEVERE));
  }

  try {
    await cmcPricePromise;
  } catch( error ) {
    model.logPlatformError(toError(100136, undefined, "", "setAllPricesOnTokens/cmcPricePromise",  `Unexpected Error`, ""+error, ErrorSeverity.SEVERE));
  }

  try {
    await swapPricePromise;
  } catch( error ) {
    model.logPlatformError(toError(100137, undefined, "", "setAllPricesOnTokens/swapPricePromise",  `Unexpected Error`, ""+error, ErrorSeverity.SEVERE));
  }
};
