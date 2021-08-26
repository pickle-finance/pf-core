import { PickleModel } from "..";
import { readQueryFromGraph, protocolToSubgraphUrl } from "../graph/TheGraph";
import { AssetProtocol, PickleAsset } from "../model/PickleModelJson";

export const COMETH_PAIR_DATA_CACHE_KEY = "comethswap.pair.data.cache.key";

export async function runComethswapPairDataQueryOnce(allDepositTokens: string[]) {
    const asString = "\"" + allDepositTokens.join('\",\"') + "\"";

    const query = `{
        pairDayDatas(first: ${allDepositTokens.length}, orderBy: date, orderDirection: desc, 
        where: {
            pairAddress_in: [${asString}]
        }
        ) {
          pairAddress
          reserveUSD
          dailyVolumeUSD
          reserve0
          reserve1
          token0{id}
          token1{id}
          totalSupply
          }
      }`;
      return readQueryFromGraph(query, protocolToSubgraphUrl.get(AssetProtocol.COMETHSWAP));
}

export function findMissingPairDayDatas(allDepositTokens: string[], result: any) : string[] {

    const missing: string[] = [];
    for( let i = 0; i < allDepositTokens.length; i++ ) {
        let found = false;
        for( let j = 0; j < result.data.pairDayDatas.length; j++ ) {
            if( result.data.pairDayDatas[j].pairAddress === allDepositTokens[i].toLowerCase()) {
                found = true;
            }
        }
        if( !found ) {
            missing.push(allDepositTokens[i]);
        }
    }
    return missing;
}

export async function getOrLoadAllComethSwapPairDataIntoCache(model: PickleModel) : Promise<any> {
    if( model.resourceCache.get(COMETH_PAIR_DATA_CACHE_KEY))
        return model.resourceCache.get(COMETH_PAIR_DATA_CACHE_KEY);
    
    const jars : PickleAsset[] = model.getAllAssets().filter((x)=>x.protocol=== AssetProtocol.COMETHSWAP);
    const allDepositTokens : string[] = jars.map((x)=>x.depositToken.addr.toLowerCase());
    let missing : string[] = [].concat(allDepositTokens);
    const maxLoops = 3;
    let result;
    for( let loop = 0; loop < maxLoops && missing.length > 0; loop++ ) {
        const tmp = await runComethswapPairDataQueryOnce(missing);
        if( !result ) {
            result = tmp;
        } else {
            result.data.pairDayDatas = result.data.pairDayDatas.concat(tmp.data.pairDayDatas);
        }
        missing = findMissingPairDayDatas(allDepositTokens, result);
    }

    model.resourceCache.set(COMETH_PAIR_DATA_CACHE_KEY, result);
    return result;
}

export async function getComethSwapPairData(model:PickleModel, pairToken: string): Promise<any> {
    const result : any = await getOrLoadAllComethSwapPairDataIntoCache(model);
    if( result.data.pairDayDatas) {
        for( let i = 0; i < result.data.pairDayDatas.length; i++ ) {
            if( result.data.pairDayDatas[i].pairAddress === pairToken.toLowerCase()) {
                return result.data.pairDayDatas[i];
            }
        }
    }
    return undefined;
}