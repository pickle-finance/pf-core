import { IPriceResolver } from "./IPriceResolver";

export const RESOLVER_COINGECKO = 'resolver_gecko';
export const RESOLVER_DEPOSIT_TOKEN = 'resolver_deposit_token';

export class PriceCache {
  private resolverMap : Map<string,IPriceResolver> = new Map<string,IPriceResolver>();
  private cache : Map<string,number> = new Map<string,number>();
  constructor() {
  }

  addResolver(id: string, resolver: IPriceResolver){
    this.resolverMap.set(id, resolver);
  }

  getResolver(id: string) : IPriceResolver {
    return this.resolverMap.get(id);
  }

  get(id: string) : number  {
    return this.cache.get(id);
  }
  
  put(id: string, val: number) {
    this.cache.set(id,val);
  }

  clear() : void {
    this.cache.clear();
  }

  getCache() : Map<string,number> {
    return new Map<string,number>(this.cache);
  }

  async priceOf(token: string) : Promise<number> {
    if( this.cache.get(token)) {
      return this.cache.get(token);
    }
    
    let keys: string[] = [].concat(Array.from( this.resolverMap.keys()));
    for( let i = 0; i < keys.length; i++ ) {
      const map : Map<string,number> = await this.getPrices([token], keys[i]);
      if( map !== undefined && map.get(token) !== undefined ) {
        return map.get(token);
      }
    }
    return undefined;
  }

  /**
   * Return a single price. 
   * Not super efficient but handy when you know the cache is already loaded. 
   * 
   * @param token 
   * @param resolverKey 
   * @returns 
   */
  async getPrice(token: string, resolverKey: string ) : Promise<number> {
    const map : Map<string,number> = await this.getPrices([token], resolverKey);
    if( map === undefined )
      return undefined;
    return map.get(token);
  }

  /**
   * Return the requested prices, or a superset of the requested prices, or undefined 
   * if the prices you sought could not be found. 
   * @param tokens 
   * @param resolver 
   * @returns 
   */
  async getPrices(tokens: string[], resolverKey: string ) : Promise<Map<string,number>> {
    const resolver : IPriceResolver = this.getResolver(resolverKey);
    if( resolver === undefined ) {
      return undefined;
    }
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