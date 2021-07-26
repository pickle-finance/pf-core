import CoinGecko from "coingecko-api";
import fetch from "node-fetch";
import { ExternalToken, ExternalTokenModel } from "./ExternalTokenModel";
import { IPriceComponents, IPriceResolver } from "./IPriceResolver";
import { PriceCache } from "./PriceCache";

interface NeedleAliases {
    needle : string;
    cgId: string;
    aliases: string[];
};


/**
 * This class will enter all values in the cache using a contract key. 
 * It will accept symbols (usdc), or contract addresses, as search keys. 
 * The returned map should include the data in the form the user requested it. 
 * 
 * This class will only query for symbols that are defined in the ExternalTokenModel. 
 */
export class CoinGeckpPriceResolver implements IPriceResolver {
    tokenModel: ExternalTokenModel;
    constructor(tokenModel: ExternalTokenModel) {
        this.tokenModel = tokenModel;
    }

    protected getAliases(needle: string) : NeedleAliases {
        const lower = needle.toLowerCase();
        if( lower.startsWith("0x")) {
            const token = this.tokenModel.findTokenFromContract(lower);
            if( token !== undefined ) {
                return {needle: needle, cgId: token.coingeckoId, aliases: [
                        needle, token.id, token.coingeckoId, token.contractAddr]};
            }
        } else {
            let tmp: ExternalToken[] = this.tokenModel.getTokensById(needle);
            if( tmp === undefined || tmp === null || tmp.length === 0 ) {
                tmp = this.tokenModel.findTokenByCoinGeckoName(needle);
            }
            if( tmp !== undefined && tmp !== null && tmp.length > 0 ) {
                const aliases : string[] = [];
                tmp.forEach((value) => {
                    aliases.push(needle);
                    aliases.push(value.id);
                    aliases.push(value.coingeckoId);
                    aliases.push(value.contractAddr);
                });
                return {needle: needle, cgId: tmp[0].coingeckoId, aliases: aliases};
            }
        }
        return undefined;
    }

    protected findAliases(needles: string[]) : NeedleAliases[] {
        const ret : NeedleAliases[] = [];
        for( let i = 0; i < needles.length; i++ ) {
            const oneStruct = this.getAliases(needles[i]);
            if( oneStruct !== undefined )
                ret.push(oneStruct);
        }
        return ret;
    }

    getFromCache(ids: string[], cache: PriceCache): Map<string, number> {
        const withAliases: NeedleAliases[] = this.findAliases(ids);
        return this.getFromCache2(withAliases, cache);
    }

    private getFromCache2(withAliases: NeedleAliases[], cache: PriceCache): Map<string, number> {
        // We didn't find any token definitions that we can process
        if( withAliases === undefined )
            return null;

        const collector = cache.getCache();
        // Since we store in the official cache using contract id only, we can just check for that. 
        for( let i = 0; i < withAliases.length; i++ ) {
            const cachedKey = this.getCachedKey(withAliases[i], cache);
            if(cachedKey === undefined ) {
                return undefined;
            }
            this.addToCollector(withAliases[i], collector.get(cachedKey), collector);
        }
        return collector;
    }

    private getCachedKey(withAliases:NeedleAliases, cache:PriceCache) : string {
        for( let i = 0; i < withAliases.aliases.length; i++ ) {
            if( cache.getCache().has(withAliases.aliases[i])) {
                return withAliases.aliases[i];
            }
        }
        return undefined;
    }
    async getOrResolve(ids: string[], cache: PriceCache): Promise<Map<string, number>> {
        const withAliases: NeedleAliases[] = this.findAliases(ids);
        const fromCache : Map<string,number> = this.getFromCache2(withAliases, cache);
        if( fromCache !== undefined )
            return fromCache;
        if( fromCache === null )
            return null;

        let contractNames : string[] = [];
        withAliases.map((value)=>{
            contractNames = contractNames.concat(this.findContracts(value.aliases));
        });
        const prices = await this.fetchPricesForContracts(contractNames);
        const collector : Map<string,number> = new Map<string,number>();
        const missingIds : string[] = [];
        for( const oneAsset of withAliases ) {
            const price = this.findContractPriceInResponse(oneAsset, prices);
            if( price === undefined ) {
                missingIds.push(oneAsset.cgId);
            } else {
                this.addToCollector(oneAsset, price, collector);
            }
        }

        if( missingIds.length > 0 ) {
            const missingPrices = await this.fetchPricesForGeckoNames(missingIds);
            for( const oneAsset of withAliases ) {
                if( missingPrices.has(oneAsset.cgId)) {
                    const price = missingPrices.get(oneAsset.cgId);
                    if( price !== undefined ) {
                        this.addToCollector(oneAsset, price, collector);
                    }
                }
            }
        }
        return collector;
    }
    private findContractPriceInResponse(na: NeedleAliases, prices: Map<string,number>) {
        for( let i = 0; i < na.aliases.length; i++ ) {
            if( na.aliases[i].startsWith("0x") && prices.has(na.aliases[i])) {
                return prices.get(na.aliases[i]);
            }
        }
        return undefined;
    }
    private findContracts(aliases: string[]) : string[] {
        return aliases.filter(str => str.startsWith("0x"));
    }
    private addToCollector(oneStruct: NeedleAliases, price: number, collector : Map<string,number>) {
        for( let j = 0; j < oneStruct.aliases.length; j++ ) {
            collector.set(oneStruct.aliases[j], price);
        }
    }

    private async fetchPricesForGeckoNames(geckoNames: string[]) : Promise<Map<string,number>> {
        const obj = {
        ids: geckoNames,
        vs_currencies: ["usd"],
        };
        const response : any = await new CoinGecko().simple.price(obj);
        const data = response.data;
        const returnMap : Map<string,number> = new Map<string,number>();
        for (const key in data) {
            returnMap.set(key, data[key].usd);
        }
        return returnMap;
    };

    private async fetchPricesForContracts(contractIds: string[]) : Promise<Map<string,number>> {
        const joined = contractIds.join("%2C");
        const contractPrice = await fetch(
            `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${joined}&vs_currencies=usd`
        );
        
        const resp = await contractPrice.json();
        const retMap : Map<string,number> = new Map();
        Object.keys(resp).map((key) => {
            retMap.set(key, resp[key].usd);
        });
        return retMap;
    };
    
    /**
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