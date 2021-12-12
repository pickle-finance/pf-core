import { ChainNetwork } from "../chain/Chains";
import { IPriceResolver } from "./IPriceResolver";

export class PriceCache {
  private cache: Map<string, number> = new Map<string, number>();
  constructor(prices?: any) {
    if( prices ) {
      this.cache = new Map(Object.entries(prices));
    }
  }
  get(id: string): number {
    return this.cache.get(id);
  }

  put(id: string, val: number) {
    this.cache.set(id, val);
  }

  clear(): void {
    this.cache.clear();
  }

  getCache(): Map<string, number> {
    return new Map<string, number>(this.cache);
  }

  priceOf(token: string): number {
    const t1 = this.cache.get(token);
    return t1 ? t1 : this.cache.get(token.toLowerCase());
  }

  /**
   * Return the requested prices, or a superset of the requested prices, or undefined
   * if the prices you sought could not be found.
   * @param tokens
   * @returns
   */
  async getPrices(
    tokens: string[],
    resolver: IPriceResolver,
    chain: ChainNetwork | null = null
  ): Promise<Map<string, number>> {
    if (resolver === undefined) {
      return undefined;
    }
    const fromCache: Map<string, number> = resolver.getFromCache(tokens, this);
    if (fromCache !== null && fromCache !== undefined) {
      return fromCache;
    }
    const tmp: Map<string, number> = await resolver.getOrResolve(tokens, this, chain);

    if (tmp === undefined || tmp === null) return undefined;
    this.cache = new Map([
      ...Array.from(this.cache.entries()),
      ...Array.from(tmp.entries()),
    ]);
    return this.cache;
  }
  
  areAllCached(tokens: string[]): boolean {
    for (const s of tokens) {
      if (this.cache.get(s) === undefined) {
        return false;
      }
    }
    return true;
  }
}
