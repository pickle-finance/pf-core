import { JAR_USDC, JAR_lusdCRV, JAR_fraxCRV, JAR_SADDLE_D4, JAR_ALETH, JAR_steCRV, JAR_AM3CRV, JAR_MIM3CRV, JAR_CRV_IB } from "../model/JarsAndFarms";
import { PickleModel } from "../model/PickleModel";
import { AssetProtocol, PickleAsset } from "../model/PickleModelJson";
import { ComethPairManager } from "../protocols/ComethUtil";
import { GenericSwapUtility, getLivePairDataFromContracts, IExtendedPairData } from "../protocols/GenericSwapUtil";
import { QuickswapPairManager } from "../protocols/QuickswapUtil";
import { SushiEthPairManager, SushiPolyPairManager } from "../protocols/SushiSwapUtil";
import { UniPairManager } from "../protocols/UniswapUtil";
import { IPriceComponents, IPriceResolver } from "./IPriceResolver";
import { PriceCache } from "./PriceCache";

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
        return this.getOrResolve([id], cache).then((x) => x.get(id));
    }

    async getOrResolve(ids: string[], cache: PriceCache): Promise<Map<string, number>> {
        const fromCache = cache.getCache();
        const jobs : Promise<void>[] = [];
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
                jobs.push(
                    this.getTokenPriceForProtocol(protocol, ids[i], this.model).then((x)=>{
                        if( x !== undefined ) 
                            ret.set(ids[i], x);
                    })
                );
            }
        }
        await Promise.all(jobs);
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

    isGenericSwapProtocol(protocol: string) : boolean {
        return [
            AssetProtocol.SUSHISWAP.toString(),
            AssetProtocol.SUSHISWAP_POLYGON.toString(),
            AssetProtocol.UNISWAP.toString(),
            AssetProtocol.COMETHSWAP.toString(),
            AssetProtocol.QUICKSWAP_POLYGON.toString(),
        ].includes(protocol);
    }
    /*
    A lot of this is wrong. Don't know which repo I copied it from.
    */
    async getTokenPriceForProtocol(protocol: string, token: string, model: PickleModel): Promise<number> {
        const isSwapUtil : boolean = this.isGenericSwapProtocol(protocol);
        
        if( isSwapUtil ) {
            const match : PickleAsset[] = this.model.getAllAssets().filter((x)=>x.depositToken.addr.toLowerCase() === token.toLowerCase());
            if( match && match.length > 0)
                return (await getLivePairDataFromContracts(match[0], this.model, 18)).pricePerToken;
            return -1;
        }

        if( protocol === AssetProtocol.TOKENPRICE )
            return this.getContractPrice(token, model);

        if( protocol === AssetProtocol.YEARN ) {
            if( token === JAR_USDC.depositToken.addr) {
                return this.getContractPrice(token, model)
            } else if( token === JAR_lusdCRV.depositToken.addr || 
                token === JAR_fraxCRV.depositToken.addr ||
                token === JAR_CRV_IB.depositToken.addr ) {
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
        }
        return undefined;
    }

    protected async getZeroSafePairPrice(innerPair: IExtendedPairData, model: PickleModel): Promise<number> {
        let token0Price = await this.getContractPrice(innerPair.token0Id, model);
        let token1Price = await this.getContractPrice(innerPair.token1Id, model);

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

    protected async getContractPrice(id: string, model: PickleModel): Promise<number> {
        try {
            return (await model.priceOf(id.toLowerCase()));
        } catch (e) {
            return undefined;
        }
    }


    /**
     * // TODO an interesting idea that is not yet developed
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