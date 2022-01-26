import { ChainNetwork } from "../chain/Chains";
import { PriceCache } from "./PriceCache";

export interface IPriceComponents {
  tokenId: string;
  total: number;
  components: IPriceComponent[];
}

export interface IPriceComponent {
  componentId: string;
  unitPrice: number;
  quantity: number;
  total: number;
  components?: IPriceComponent[];
}

export interface IPriceResolver {
  /**
   * Get from cache
   *   This method exists because some resolvers may be storing in cache
   *   with aliases or alternate ids. This tries to ensure all aliases are searched.
   *   Return undefined if not all are in cache currently
   *   Return null if this resolver knows it cannot fulfill the request
   */
  getFromCache(ids: string[], cache: PriceCache): Map<string, number> | null;
  /*
     * Get from cache or discover / resolve values via custom strategy
         Return as many values that could be found (with or without aliases)
     */
  getOrResolve(
    ids: string[],
    cache: PriceCache,
    chain: ChainNetwork | null,
  ): Promise<Map<string, number>> | null;

  /**
   * Get back the price of a given token as well as its components.
   * If there are no components below the given token id, then return null for the co
   * @param ids
   * @param cache
   */
  getPriceComponents(
    ids: string[],
    cache: PriceCache,
    chain: ChainNetwork,
  ): Promise<Map<string, IPriceComponents>>;
}
