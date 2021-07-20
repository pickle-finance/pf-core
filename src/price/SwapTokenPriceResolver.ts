import { PROTOCOL_TYPE_SUSHISWAP, PROTOCOL_TYPE_UNISWAP, PROTOCOL_TYPE_SUSHISWAP_POLYGON, PROTOCOL_TYPE_COMETHSWAP, PROTOCOL_TYPE_QUICKSWAP_POLYGON, readQueryFromGraph, protocolToSubgraphUrl } from "../graph/TheGraph";
import { CoinGeckpPriceResolver } from "./CoinGeckoPriceResolver";
import { ExternalTokenModelSingleton } from "./ExternalTokenModel";
import { IPriceComponents, IPriceResolver } from "./IPriceResolver";
import { PriceCache, PRICE_CACHE_SINGLETON } from "./PriceCache";

export class SwapTokenPriceResolver implements IPriceResolver {
    getFromCache(ids: string[], cache: PriceCache): Map<string, number> {
        const fromCache = cache.getCache();
        for( let i = 0; i < ids.length; i++ ) {
            if( fromCache.get(ids[i]) === undefined ) {
                return undefined;
            }
        }
        return fromCache;
    }
    async getOrResolve(ids: string[], cache: PriceCache): Promise<Map<string, number>> {
        const fromCache = cache.getCache();
        const ret : Map<string,number> = new Map<string,number>();
        for( let i = 0; i < ids.length; i++ ) {
            if( fromCache.get(ids[i]) !== undefined ) {
                ret.set(ids[i], fromCache.get(ids[i]));
            } else {
                // TODO make this more efficient? Maybe group all together if possible?
                // Sushi might require many token lookups. 
                const protocol : string = this.getProtocolFromDepositToken(ids[i]);
                if( protocol === undefined ) {
                    return null;
                }
                ret.set(ids[i], await this.getTokenPriceFromGraph(protocol, ids[i]));
            }
        }
        return ret;
    }

    getProtocolFromDepositToken(token: string) : string {
        return token ? undefined : undefined; // TODO for when we have a jar model
    }


    async getTokenPriceFromGraph(protocol: string, token: string, block?: number): Promise<number> {
        if (protocol === PROTOCOL_TYPE_SUSHISWAP) {
            return await this.getPriceFromSushiPair(await this.getSushiSwapPair(protocol, token.toLowerCase(), block));
        } else if (protocol === PROTOCOL_TYPE_UNISWAP) {
            return this.getPriceFromStandardPair(await this.getUniswapPair(protocol, token.toLowerCase(), block));
        } else if (protocol === PROTOCOL_TYPE_SUSHISWAP_POLYGON) {
            return this.getPriceFromStandardPair(await this.getSushiSwapPolyPair(protocol, token.toLowerCase(), block));
        } else if (protocol === PROTOCOL_TYPE_COMETHSWAP) {
            return this.getPriceFromStandardPair(await this.getComethPair(protocol, token.toLowerCase(), block));
        } else if (protocol === PROTOCOL_TYPE_QUICKSWAP_POLYGON) {
            return this.getPriceFromStandardPair(await this.getQuickswapPair(protocol, token.toLowerCase(), block));
        }
        return undefined;
    }

    async getPriceFromSushiPair(pair: any): Promise<number> {
        const innerPair = pair.data.pair;
        let token0Price = await this.getContractPrice(innerPair.token0.id);
        let token1Price = await this.getContractPrice(innerPair.token1.id);

        if (token0Price === 0 && token1Price === 0) {
            return undefined;
        }

        if (token0Price === 0 || token1Price === 0) {
            if (token0Price) {
                token1Price = (token0Price * innerPair.reserve0) / innerPair.reserve1;
            } else {
                token0Price = (token1Price * innerPair.reserve1) / innerPair.reserve0;
            }
        }

        const ret = (((token0Price * innerPair.reserve0) + (token1Price * innerPair.reserve1))
            / innerPair.totalSupply);
        return ret;
    }

    protected getPriceFromStandardPair(pair: any): number {
        const reserveUSD = pair.data.pair.reserveUSD;
        const liquidityPrice = 1 / pair.data.pair.totalSupply;
        return reserveUSD * liquidityPrice;
    };

    protected async getSushiSwapPair(protocol: string, token: string, block?: number): Promise<any> {
        const query = `
            {
            pair(id: "${token.toLowerCase()}"${block ? `, block: {number: ${block}}` : ""
            }) {
                reserve0
                reserve1
                token0 {
                id
                }
                token1 {
                id
                }
                totalSupply
            }
            }
        `;
        return await readQueryFromGraph(query, protocolToSubgraphUrl.get(protocol));
    }

    protected async getSushiSwapPolyPair(protocol: string, token: string, block?: number): Promise<any> {
        const query = `
        {
            pair(id: "${token}"${block ? `, block: {number: ${block}}` : ""}) {
            reserveUSD
            totalSupply
            }
        }
        `;
        const pairReturn = await readQueryFromGraph(query, protocolToSubgraphUrl.get(protocol));
        return pairReturn;
    }

    protected async getUniswapPair(protocol: string, token: string, block?: number): Promise<any> {
        const query = `
            {
                pair(id: "${token}"${block ? `, block: {number: ${block}}` : ""}) {
                reserveUSD
                totalSupply
                }
            }
            `;
        return await readQueryFromGraph(query, protocolToSubgraphUrl.get(protocol));
    };

    protected async getComethPair(protocol: string, token: string, block?: number): Promise<any> {
        const query = `
            {
                pair(id: "${token}"${block ? `, block: {number: ${block}}` : ""}) {
                reserveUSD
                totalSupply
                }
            }
            `;
        return await readQueryFromGraph(query, protocolToSubgraphUrl.get(protocol));
    };

    protected async getQuickswapPair(protocol: string, token: string, block?: number): Promise<any> {
        const query = `
            {
                pair(id: "${token}"${block ? `, block: {number: ${block}}` : ""}) {
                reserveUSD
                totalSupply
                }
            }
            `;
        return await readQueryFromGraph(query, protocolToSubgraphUrl.get(protocol));
    };

    protected async getContractPrice(id: string): Promise<number> {
        try {
            const resolver: CoinGeckpPriceResolver = new CoinGeckpPriceResolver(ExternalTokenModelSingleton);
            return (await PRICE_CACHE_SINGLETON.getPrices([id], resolver)).get(id);
        } catch (e) {
            return undefined;
        }
    }


    /**
     * // TODO optimize this for sushi so sushi can return the sub-components and their prices
     * 
     * Get back the price of a given token as well as its components.
     * This resolver has no underlying components. 
     * @param ids 
     * @param cache 
     */
     async getPriceComponents(ids: string[], cache: PriceCache): Promise<Map<string,IPriceComponents>> {
        const prices : Map<string, number> = await this.getOrResolve(ids, cache);        
        const ret : Map<string,IPriceComponents> = new Map<string,IPriceComponents>();
        for (const key in prices.keys()) {
            ret.set(key, {tokenId: key, total: prices.get(key), components: []});
        }
        return ret;
    }

}