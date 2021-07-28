import { IPriceResolver } from "./IPriceResolver";

export class PriceCache {
  private cache : Map<string,number> = new Map<string,number>();

  put(id: string, val: number) {
    this.cache.set(id,val);
  }

  clear() : void {
    this.cache.clear();
  }

  getCache() : Map<string,number> {
    return new Map<string,number>(this.cache);
  }

  get(id: string) : number  {
    return this.cache.get(id);
  }
  
  /**
   * Return the requested prices, or a superset of the requested prices, or undefined 
   * if the prices you sought could not be found. 
   * @param tokens 
   * @param resolver 
   * @returns 
   */
  async getPrices(tokens: string[], resolver: IPriceResolver ) : Promise<Map<string,number>> {
    const fromCache :  Map<string,number> = resolver.getFromCache(tokens, this);
    if( fromCache !== null && fromCache !== undefined) {
      return fromCache;
    }
    const tmp : Map<string,number> = await resolver.getOrResolve(tokens, this);
    if( tmp === undefined || tmp === null )
      return undefined;
    this.cache = new Map([...Array.from(this.cache.entries()), ...Array.from(tmp.entries())]);
    return this.cache;
  }

  areAllCached(tokens: string[] ) : boolean {
    for( const s of tokens ) {
      if( this.cache.get(s) === undefined ) {
        return false;
      }
    }
    return true;
  }
}

export const PRICE_CACHE_SINGLETON : PriceCache = new PriceCache();