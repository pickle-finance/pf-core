import { getComethPair, getQuickswapPair, getSushiSwapPolyPair} from "../graph/TheGraph";
import { JAR_USDC, JAR_lusdCRV, JAR_fraxCRV, JAR_SADDLE_D4, JAR_ALETH, JAR_steCRV, JAR_AM3CRV, JAR_MIM3CRV } from "../model/JarsAndFarms";
import { PickleModel } from "../model/PickleModel";
import { AssetProtocol, PickleAsset } from "../model/PickleModelJson";
import {getSushiSwapPairData } from "../protocols/SushiSwapUtil";
import { getUniSwapPairData } from "../protocols/UniswapUtil";
import { IPriceComponents, IPriceResolver } from "./IPriceResolver";
import { PriceCache, RESOLVER_COINGECKO } from "./PriceCache";

export class DepositTokenPriceResolver implements IPriceResolver {
    model : PickleModel;
    constructor(model: PickleModel) {
        this.model = model;
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
                    // should we return null or just skip it? 
                    return null;
                }
                const price : number = await this.getTokenPriceForProtocol(protocol, ids[i], this.model);
                if( price !== undefined ) {
                    ret.set(ids[i], price);
                }
            }
        }
        return ret;
    }

    getProtocolFromDepositToken(token: string) : string {
        const matching : Set<string> = new Set<string>();
        const myAssets : PickleAsset[] = this.model.getAllAssets();
        for( let i = 0; i < myAssets.length; i++) {
            if( myAssets[i].depositToken.addr.toLowerCase() === token.toLowerCase()) {
                matching.add(myAssets[i].protocol);
            }
        }
        if( matching.size === 1 ) {
            return matching.values().next().value;
        }
        return undefined;
    }


    /*
    A lot of this is wrong. Don't know which repo I copied it from.
    */
    async getTokenPriceForProtocol(protocol: string, token: string, model: PickleModel, block?: number): Promise<number> {
        if (protocol === AssetProtocol.SUSHISWAP) {
            return await this.getZeroSafePairPrice(await getSushiSwapPairData(this.model, token.toLowerCase()), model);
        } else if (protocol === AssetProtocol.UNISWAP) {
            return this.getZeroSafePairPrice(await getUniSwapPairData(this.model, token.toLowerCase()), model);
        } else if (protocol === AssetProtocol.SUSHISWAP_POLYGON) {
            return this.getPriceFromStandardPair(await getSushiSwapPolyPair(protocol, token.toLowerCase(), block));
        } else if (protocol === AssetProtocol.COMETHSWAP) {
            return this.getPriceFromStandardPair(await getComethPair(protocol, token.toLowerCase(), block));
        } else if (protocol === AssetProtocol.QUICKSWAP_POLYGON) {
            return this.getPriceFromStandardPair(await getQuickswapPair(protocol, token.toLowerCase(), block));
        } else if( protocol === AssetProtocol.YEARN ) {
            if( token === JAR_USDC.depositToken.addr) {
                return this.getContractPrice(token, model)
            } else if( token === JAR_lusdCRV.depositToken.addr || token === JAR_fraxCRV.depositToken.addr ) {
                return 1;
            }
        } else if( protocol === AssetProtocol.SADDLE ) {
            if( token === JAR_SADDLE_D4.depositToken.addr) {
                return 1;
            } else if( token === JAR_ALETH.depositToken.addr ) {
                return this.getContractPrice("weth", model);
            }
        } else if( protocol === AssetProtocol.CURVE ) {
            if( token === JAR_steCRV.depositToken.addr) {
                return this.getContractPrice("weth", model);
            } else if( token === JAR_AM3CRV.depositToken.addr) {
                return 1;
            } else if( token === JAR_MIM3CRV.depositToken.addr) {
                return 1;
            }
            return this.getContractPrice(token, model);
        } else if( protocol === AssetProtocol.AAVE_POLYGON) {
            return 1;
        } else if( protocol === AssetProtocol.IRON_POLYGON) {
            return 1;
        } else if( protocol === AssetProtocol.TOKENPRICE ) {
            return this.getContractPrice(token, model);
        }
        return undefined;
    }

    protected async getZeroSafePairPrice(innerPair: any, model: PickleModel): Promise<number> {
        let token0Price = await this.getContractPrice(innerPair.token0.id, model);
        let token1Price = await this.getContractPrice(innerPair.token1.id, model);

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

    protected async getContractPrice(id: string, model: PickleModel): Promise<number> {
        try {
            return (await model.priceOf(id.toLowerCase()));
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