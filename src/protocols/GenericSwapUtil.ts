import { PickleModel } from "..";
import { Provider as MulticallProvider, Contract as MulticallContract} from 'ethers-multicall';
import { AssetProtocol, PickleAsset } from "../model/PickleModelJson";
import erc20Abi from '../Contracts/ABIs/erc20.json';
import { protocolToSubgraphUrl, readQueryFromGraph } from "../graph/TheGraph";
import { Chains } from "../chain/Chains";
import { JAR_POLY_SUSHI_ETH_USDT } from "../model/JarsAndFarms";

export abstract class GenericSwapUtility {
    cacheKey:string;
    whereKey:string;
    queryFields: string[];
    protocol: AssetProtocol;
    lpFee: number;
    constructor(cacheKey: string, whereKey: string, queryFields: string[], 
        protocol: AssetProtocol, lpFee: number) {
        this.cacheKey = cacheKey;
        this.whereKey = whereKey;
        this.queryFields = queryFields;
        this.protocol = protocol;
        this.lpFee = lpFee;
    }


    async runPairDataQueryOnce(allDepositTokens: string[]) {
        const asString = "\"" + allDepositTokens.join('\",\"') + "\"";
        const qFields = this.queryFields.join("\n");
        // Better to request a few extra rows to avoid having to make an additional request
        const numResults = allDepositTokens.length < 10 ? 10 : allDepositTokens.length;
        const query = `{
            pairDayDatas(first: ${numResults}, orderBy: date, orderDirection: desc, 
            where: {
                ${this.whereKey}_in: [${asString}]
            }
            ) {
                ${qFields}
            }
        }`;
        return await readQueryFromGraph(query, protocolToSubgraphUrl.get(this.protocol));
    }

    findMissingPairDayDatas(allDepositTokens: string[], result: any) : string[] {
        const missing: string[] = [];
        if( !result || !result.data || !result.data.pairDayDatas) 
            return allDepositTokens;

        for( let i = 0; i < allDepositTokens.length; i++ ) {
            let found = false;
            for( let j = 0; j < result.data.pairDayDatas.length; j++ ) {
                const t1 = this.pairAddressFromDayData(result.data.pairDayDatas[j]);
                const t2 = allDepositTokens[i].toLowerCase();
                if( t1 === t2) {
                    found = true;
                }
            }
            if( !found ) {
                missing.push(allDepositTokens[i]);
            }
        }
        return missing;
    }


    async getOrLoadAllPairDataIntoCache(model: PickleModel) : Promise<any> {
        if( model.getResourceCache().get(this.cacheKey))
            return model.getResourceCache().get(this.cacheKey);
        
        const jars : PickleAsset[] = model.getAllAssets().filter((x)=>x.protocol=== this.protocol);
        const allDepositTokens : string[] = jars.map((x)=>x.depositToken.addr.toLowerCase());
        let missing : string[] = [].concat(allDepositTokens);
        const maxLoops = 3;
        let result;
        for( let loop = 0; loop < maxLoops && missing.length > 0; loop++ ) {
            const tmp = await this.runPairDataQueryOnce(missing);

            if( !result && tmp && tmp.data && tmp.data.pairDayDatas) {
                result = tmp;
            } else if( result ) {
                if( result && result.data && result.data.pairDayDatas 
                    && tmp && tmp.data && tmp.data.pairDayDatas ) {
                    result.data.pairDayDatas = result.data.pairDayDatas.concat(tmp.data.pairDayDatas);
                }
            }
            missing = this.findMissingPairDayDatas(allDepositTokens, result);
        }
    
        model.getResourceCache().set(this.cacheKey, result);
        return result;
    }

    async getPairData(model:PickleModel, pairToken: string): Promise<IExtendedPairData> {
        const result : any = await this.getOrLoadAllPairDataIntoCache(model);
        if( result?.data?.pairDayDatas) {
            for( let i = 0; i < result.data.pairDayDatas.length; i++ ) {
                if( this.pairAddressFromDayData(result.data.pairDayDatas[i]) === pairToken.toLowerCase()) {
                    return this.toExtendedPairData(result.data.pairDayDatas[i]);
                }
            }
        }
        return undefined;
    }

    async calculateLpApr(model: PickleModel, pair: string) : Promise<number> {
        const pairData : IExtendedPairData = await this.getPairData(model, pair);
        if( pairData ) {
            const apy =
            (pairData.dailyVolumeUSD / pairData.reserveUSD) * this.lpFee * 360 * 100;
            return apy;
        }
        return 0;
    }
    
    abstract pairAddressFromDayData(dayData: any) : string;
    abstract toExtendedPairData(pair: any) : IExtendedPairData;
}

export interface IPairData {
    reserveUSD: number,
    totalSupply: number,
    pricePerToken: number
  }
  
  export interface IExtendedPairData extends IPairData {
    pairAddress: string;
    reserveUSD: number;
    dailyVolumeUSD: number;
    reserve0:number;
    reserve1:number;
    token0Id:string;
    token1Id:string;
    totalSupply:number;
    pricePerToken: number
  }

  export async function getLivePairDataFromContracts(jar: PickleAsset, model: PickleModel,
    depositTokenDecimals: number) : Promise<IPairData> {
    const multicallProvider = new MulticallProvider(Chains.get(jar.chain).getPreferredWeb3Provider());
    await multicallProvider.init();
    const pairAddress:string = jar.depositToken.addr;

    const componentA = jar.depositToken.components[0];
    const componentB = jar.depositToken.components[1];
    const addressA = model.address(componentA, jar.chain);
    const addressB = model.address(componentB, jar.chain);
    
    // setup contracts
    const tokenA = new MulticallContract(addressA, erc20Abi);
    const tokenB = new MulticallContract(addressB, erc20Abi);
    const pair = new MulticallContract(pairAddress, erc20Abi);
  
    const [
      numAInPairBN,
      numBInPairBN,
      totalSupplyBN,
    ] = await multicallProvider?.all([
      tokenA.balanceOf(pairAddress),
      tokenB.balanceOf(pairAddress),
      pair.totalSupply(),
    ]);
    // get num of tokens
    const numAInPair = numAInPairBN / Math.pow(10, model.tokenDecimals(componentA, jar.chain));
    const numBInPair = numBInPairBN / Math.pow(10, model.tokenDecimals(componentB, jar.chain));
  
    // get prices
    const priceA = model.priceOfSync(componentA);
    const priceB = model.priceOfSync(componentB);
  
    let reserveUSD;
    // In case price one token is not listed on coingecko
    if( priceA && priceB ) {
        reserveUSD = priceA * numAInPair + priceB * numBInPair;
    } else if (priceA) {
        reserveUSD = 2 * priceA * numAInPair;
    } else {
        reserveUSD = 2 * priceB * numBInPair;
    }
  
    const totalSupply = totalSupplyBN / Math.pow(10, depositTokenDecimals);
    const pricePerToken = reserveUSD / totalSupply;
  
    return { reserveUSD, totalSupply, pricePerToken };
  };


