import { ChainNetwork } from "..";
import { setCoingeckoPricesOnTokens } from "../price/CoinGeckoPriceResolver";
import { setAllCoinMarketCapPricesOnTokens } from "../price/CoinMarketCapPriceResolver";
import { ExternalToken, ExternalTokenFetchStyle } from "../price/ExternalTokenModel";
import { calculateSwapTokenPrices } from "../price/SwapPriceResolver";

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

export const setAllPricesOnTokens = async (chains: ChainNetwork[]): Promise<void> => {
  let promises = [];
  promises = promises.concat(chains.map((x) => setCoingeckoPricesOnTokens(x)));
  promises.push(setAllCoinMarketCapPricesOnTokens(chains));
  promises.push(calculateSwapTokenPrices(chains));
  try {
    await Promise.all(promises);
  } catch(error) {
    console.log("Error loading prices: " + error);
  }
}