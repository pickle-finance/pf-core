import { readQueryFromGraph, protocolToSubgraphUrl} from "../graph/TheGraph";
import { AssetDefinition, JAR_ALETH, JAR_AM3CRV, JAR_fraxCRV, JAR_lusdCRV, JAR_SADDLE_D4, JAR_steCRV, JAR_USDC,
    PROTOCOL_TYPE_SUSHISWAP, PROTOCOL_TYPE_UNISWAP, PROTOCOL_TYPE_SUSHISWAP_POLYGON, PROTOCOL_TYPE_COMETHSWAP, 
    PROTOCOL_TYPE_QUICKSWAP_POLYGON, PROTOCOL_TYPE_TOKENPRICE, 
    PROTOCOL_TYPE_YEARN, PROTOCOL_TYPE_SADDLE, PROTOCOL_TYPE_CURVE  } from "../model/PickleModel";
import { CoinGeckpPriceResolver } from "./CoinGeckoPriceResolver";
import { ExternalTokenModelSingleton } from "./ExternalTokenModel";
import { IPriceComponents, IPriceResolver } from "./IPriceResolver";
import { PriceCache } from "./PriceCache";

export class DepositTokenPriceResolver implements IPriceResolver {
    myAssets : AssetDefinition[];
    constructor(assets: AssetDefinition[]) {
        this.myAssets = assets;
    }

    getFromCache(ids: string[], cache: PriceCache): Map<string, number> {
        const fromCache = cache.getCache();
        for( let i = 0; i < ids.length; i++ ) {
            if( fromCache.get(ids[i]) === undefined ) {
                return undefined;
            }
        }
        return fromCache;
    }
    
    async getOrResolveSingle(id: string, cache: PriceCache): Promise<number> {
        return (await this.getOrResolve([id],cache)).get(id);
    }

    async getOrResolve(ids: string[], cache: PriceCache): Promise<Map<string, number>> {
        const fromCache = cache.getCache();
        const ret : Map<string,number> = new Map<string,number>();
        for( let i = 0; i < ids.length; i++ ) {
            if( fromCache.get(ids[i]) !== undefined ) {
                ret.set(ids[i], fromCache.get(ids[i]));
            } else if( ret.get(ids[i]) === undefined ) { 
                // TODO make this more efficient? Maybe group all together if possible?
                // Sushi might require many token lookups. 
                const protocol : string = this.getProtocolFromDepositToken(ids[i]);
                if( protocol === undefined ) {
                    return null;
                }
                ret.set(ids[i], await this.getTokenPriceFromGraph(protocol, ids[i], cache));
            }
        }
        return ret;
    }

    getProtocolFromDepositToken(token: string) : string {
        const matching : Set<string> = new Set<string>();
        for( let i = 0; i < this.myAssets.length; i++) {
            if( this.myAssets[i].depositToken.toLowerCase() === token.toLowerCase()) {
                matching.add(this.myAssets[i].protocol);
            }
        }
        if( matching.size === 1 ) {
            return matching.values().next().value;
        }
        return undefined;
    }


    async getTokenPriceFromGraph(protocol: string, token: string, cache: PriceCache, block?: number): Promise<number> {
        if (protocol === PROTOCOL_TYPE_SUSHISWAP) {
            return await this.getPriceFromSushiPair(await this.getSushiSwapPair(protocol, token.toLowerCase(), block), cache);
        } else if (protocol === PROTOCOL_TYPE_UNISWAP) {
            return this.getPriceFromStandardPair(await this.getUniswapPair(protocol, token.toLowerCase(), block));
        } else if (protocol === PROTOCOL_TYPE_SUSHISWAP_POLYGON) {
            return this.getPriceFromStandardPair(await this.getSushiSwapPolyPair(protocol, token.toLowerCase(), block));
        } else if (protocol === PROTOCOL_TYPE_COMETHSWAP) {
            return this.getPriceFromStandardPair(await this.getComethPair(protocol, token.toLowerCase(), block));
        } else if (protocol === PROTOCOL_TYPE_QUICKSWAP_POLYGON) {
            return this.getPriceFromStandardPair(await this.getQuickswapPair(protocol, token.toLowerCase(), block));
        } else if( protocol === PROTOCOL_TYPE_YEARN ) {
            if( token === JAR_USDC.depositToken) {
                return this.getContractPrice(token, cache)
            } else if( token === JAR_lusdCRV.depositToken || token === JAR_fraxCRV.depositToken ) {
                return 1;
            }
        } else if( protocol === PROTOCOL_TYPE_SADDLE ) {
            if( token === JAR_SADDLE_D4.depositToken) {
                return 1;
            } else if( token === JAR_ALETH.depositToken ) {
                return this.getContractPrice("eth", cache);
            }
        } else if( protocol === PROTOCOL_TYPE_CURVE ) {
            if( token === JAR_steCRV.depositToken) {
                return this.getContractPrice("eth", cache);
            } else if( token === JAR_AM3CRV.depositToken) {
                return 1;
            }
            return this.getContractPrice(token, cache);
        } else if( protocol === "aave_polygon" ) {
            return 1;
        } else if( protocol === PROTOCOL_TYPE_TOKENPRICE ) {
            return this.getContractPrice(token, cache);
        }
        return undefined;
    }

    protected async getPriceFromSushiPair(pair: any, cache: PriceCache): Promise<number> {
        const innerPair = pair.data.pair;
        let token0Price = await this.getContractPrice(innerPair.token0.id, cache);
        let token1Price = await this.getContractPrice(innerPair.token1.id, cache);

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
        if( pair.data.pair === undefined || pair.data.pair === null) {
            return undefined;
        }
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

    protected async getContractPrice(id: string, cache: PriceCache): Promise<number> {
        try {
            const resolver: CoinGeckpPriceResolver = new CoinGeckpPriceResolver(ExternalTokenModelSingleton);
            return (await cache.getPrices([id.toLowerCase()], resolver)).get(id.toLowerCase());
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