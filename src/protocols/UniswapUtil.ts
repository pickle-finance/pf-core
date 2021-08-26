import { PickleModel } from "..";
import { ONE_YEAR_SECONDS } from "../behavior/JarBehaviorResolver";
import { Provider as MulticallProvider, Contract as MulticallContract} from 'ethers-multicall';
import { BigNumber, Contract, ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { formatEther } from "ethers/lib/utils";
import { AssetProtocol, JarDefinition, PickleAsset } from "../model/PickleModelJson";
import stakingRewardsAbi from '../Contracts/ABIs/staking-rewards.json';
import erc20Abi from '../Contracts/ABIs/erc20.json';
import { protocolToSubgraphUrl, readQueryFromGraph } from "../graph/TheGraph";
import { getGenericPairData, IGenericPairData } from "./ProtocolUtil";


export const MIRROR_MIR_UST_STAKING_REWARDS   = "0x5d447Fc0F8965cED158BAB42414Af10139Edf0AF";
export const MIRROR_MTSLA_UST_STAKING_REWARDS = "0x43DFb87a26BA812b0988eBdf44e3e341144722Ab";
export const MIRROR_MAAPL_UST_STAKING_REWARDS = "0x735659C8576d88A2Eb5C810415Ea51cB06931696";
export const MIRROR_MQQQ_UST_STAKING_REWARDS  = "0xc1d2ca26A59E201814bF6aF633C3b3478180E91F";
export const MIRROR_MSLV_UST_STAKING_REWARDS  = "0xDB278fb5f7d4A7C3b83F80D18198d872Bbf7b923";
export const MIRROR_MBABA_UST_STAKING_REWARDS = "0x769325E8498bF2C2c3cFd6464A60fA213f26afcc";

export async function calculateMirAPY(rewardsAddress: string, jar: JarDefinition, 
    model: PickleModel, resolver: Provider | Signer) {

    const multicallProvider = new MulticallProvider((resolver as Signer).provider === undefined ? (resolver as Provider) : (resolver as Signer).provider);
    await multicallProvider.init();
    
    const multicallUniStakingRewards = 
        new MulticallContract(rewardsAddress, stakingRewardsAbi);

      const [
        rewardRateBN,
        totalSupplyBN,
      ] = await multicallProvider.all([
        multicallUniStakingRewards.rewardRate(),
        multicallUniStakingRewards.totalSupply(),
      ]);

      const totalSupply = parseFloat(formatEther(totalSupplyBN));
      const mirRewardRate = parseFloat(formatEther(rewardRateBN));

      const { pricePerToken } = await getUniPairData(jar, model, resolver);

      const mirRewardsPerYear = mirRewardRate * ONE_YEAR_SECONDS;
      const valueRewardedPerYear = await model.priceOf("mir") * mirRewardsPerYear;

      const totalValueStaked = totalSupply * pricePerToken;
      const mirAPY = valueRewardedPerYear / totalValueStaked;

      return mirAPY * 100;
}


export async function getUniPairData(jar: JarDefinition, model: PickleModel, 
    _resolver: Provider|Signer) : Promise<IGenericPairData> {
        return getGenericPairData(jar, model, 18);
  };


export const UNI_PAIR_DATA_CACHE_KEY = "uniswap.pair.data.cache.key";

export async function runUniswapPairDataQueryOnce(allDepositTokens: string[]) {
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
      return readQueryFromGraph(query, protocolToSubgraphUrl.get(AssetProtocol.UNISWAP));
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

export async function getOrLoadAllUniSwapPairDataIntoCache(model: PickleModel) : Promise<any> {
    if( model.resourceCache.get(UNI_PAIR_DATA_CACHE_KEY))
        return model.resourceCache.get(UNI_PAIR_DATA_CACHE_KEY);
    
    const jars : PickleAsset[] = model.getAllAssets().filter((x)=>x.protocol=== AssetProtocol.UNISWAP);
    const allDepositTokens : string[] = jars.map((x)=>x.depositToken.addr.toLowerCase());
    let missing : string[] = [].concat(allDepositTokens);
    const maxLoops = 3;
    let result;
    for( let loop = 0; loop < maxLoops && missing.length > 0; loop++ ) {
        const tmp = await runUniswapPairDataQueryOnce(missing);
        if( !result ) {
            result = tmp;
        } else {
            result.data.pairDayDatas = result.data.pairDayDatas.concat(tmp.data.pairDayDatas);
        }
        missing = findMissingPairDayDatas(allDepositTokens, result);
    }

    model.resourceCache.set(UNI_PAIR_DATA_CACHE_KEY, result);
    return result;
}

export async function getUniSwapPairData(model:PickleModel, pairToken: string): Promise<any> {
    const result : any = await getOrLoadAllUniSwapPairDataIntoCache(model);
    if( result.data.pairDayDatas) {
        for( let i = 0; i < result.data.pairDayDatas.length; i++ ) {
            if( result.data.pairDayDatas[i].pairAddress === pairToken.toLowerCase()) {
                return result.data.pairDayDatas[i];
            }
        }
    }
    return undefined;
}
  export async function calculateUniswapLpApr(model: PickleModel, pair: string) {
    const pairData = await getUniSwapPairData(model, pair);
    if( pairData ) {
        const apy =
        (pairData.dailyVolumeUSD / pairData.reserveUSD) * 0.003 * 360 * 100;
        return apy;
    }
    return 0;
}