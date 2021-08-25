import { PickleModel } from "..";
import { AVERAGE_BLOCK_TIME, ONE_YEAR_SECONDS } from "../behavior/JarBehaviorResolver";
import { readQueryFromGraph } from "../graph/TheGraph";
import { AssetProtocol, PickleAsset } from "../model/PickleModelJson";
import { PoolId } from "./ProtocolUtil";
import { Provider as MulticallProvider, Contract as MulticallContract} from 'ethers-multicall';
import erc20Abi from '../Contracts/ABIs/erc20.json';
import sushiChefAbi from '../Contracts/ABIs/sushi-chef.json';
import masterChefV2Abi from '../Contracts/ABIs/masterchefv2.json';
import rewarderAbi from '../Contracts/ABIs/rewarder.json';
import { formatEther, formatUnits } from "ethers/lib/utils";
import { getCompoundingAPY } from "../behavior/AbstractJarBehavior";
import { BigNumber, Contract, ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';


export const SUSHI_GRAPH_URL = "https://api.thegraph.com/subgraphs/name/sushiswap/exchange";
export const SUSHI_PAIR_DATA_CACHE_KEY = "sushiswap.pair.data.cache.key";

export const SUSHI_CHEF_ADDR = "0xc2EdaD668740f1aA35E4D8f227fB8E17dcA888Cd";
export const MASTERCHEFV2_ADDR = "0xef0881ec094552b2e128cf945ef17a6752b4ec5d";


const sushiPoolIds: PoolId = {
    "0xC3D03e4F041Fd4cD388c549Ee2A29a9E5075882f": 2,
    "0x397FF1542f962076d0BFE58eA045FfA2d347ACa0": 1,
    "0x06da0fd433C1A5d7a4faa01111c044910A184553": 0,
    "0xCEfF51756c56CeFFCA006cD410B03FFC46dd3a58": 21,
    "0x088ee5007C98a9677165D78dD2109AE4a3D04d0C": 11,
    "0x10B47177E92Ef9D5C6059055d92DdF6290848991": 132,
    "0x795065dCc9f64b5614C407a6EFDC400DA6221FB0": 12,
    "0x9461173740D27311b176476FA27e94C681b1Ea6b": 230,
  };
  
  const sushiPoolV2Ids: PoolId = {
    "0xC3f279090a47e80990Fe3a9c30d24Cb117EF91a8": 0,
    "0x05767d9EF41dC40689678fFca0608878fb3dE906": 1,
    "0xfCEAAf9792139BF714a694f868A215493461446D": 8,
  };
  
export async function getSushiSwapPairData(model:PickleModel, pairToken: string): Promise<any> {
    const result : any = await getOrLoadAllSushiSwapPairDataIntoCache(model);
    if( result.data.pairDayDatas) {
        for( let i = 0; i < result.data.pairDayDatas.length; i++ ) {
            if( result.data.pairDayDatas[i].pair.id === pairToken.toLowerCase()) {
                return result.data.pairDayDatas[i];
            }
        }
    }
    return undefined;
}


export async function runSushiswapPairDataQueryOnce(allDepositTokens: string[]) {
  const asString = "\"" + allDepositTokens.join('\",\"') + "\"";

  const query = `{
    pairDayDatas(first: ${allDepositTokens.length}, orderBy: date, orderDirection: desc, 
    where: {
        pair_in: [${asString}]
    }
    ) {
      pair{id}
      reserveUSD
      volumeUSD
      reserve0
      reserve1
      token0{id}
      token1{id}
      totalSupply
      }
  }`;
    return readQueryFromGraph(query, SUSHI_GRAPH_URL);
}

export function findMissingPairDayDatas(allDepositTokens: string[], result: any) : string[] {
  const missing: string[] = [];
  for( let i = 0; i < allDepositTokens.length; i++ ) {
      let found = false;
      for( let j = 0; j < result.data.pairDayDatas.length; j++ ) {
          if( result.data.pairDayDatas[j].id === allDepositTokens[i].toLowerCase()) {
              found = true;
          }
      }
      if( !found ) {
          missing.push(allDepositTokens[i]);
      }
  }
  return missing;
}

export async function getOrLoadAllSushiSwapPairDataIntoCache(model: PickleModel) : Promise<any> {
    if( model.resourceCache.get(SUSHI_PAIR_DATA_CACHE_KEY))
        return model.resourceCache.get(SUSHI_PAIR_DATA_CACHE_KEY);
    
    const jars : PickleAsset[] = model.getAllAssets().filter((x)=>x.protocol=== AssetProtocol.SUSHISWAP);
    const allDepositTokens : string[] = jars.map((x)=>x.depositToken.addr.toLowerCase());

    let missing : string[] = [].concat(allDepositTokens);
    const maxLoops = 3;
    let result;
    for( let loop = 0; loop < maxLoops && missing.length > 0; loop++ ) {
      const tmp = await runSushiswapPairDataQueryOnce(missing);
      if( !result ) {
          result = tmp;
      } else {
          result.data.pairDayDatas = result.data.pairDayDatas.concat(tmp.data.pairDayDatas);
      }
      missing = findMissingPairDayDatas(allDepositTokens, result);
    }

    model.resourceCache.set(SUSHI_PAIR_DATA_CACHE_KEY, result);
    return result;
}

export async function calculateSushiLpApr(lpTokenAddress: string, model: PickleModel) {
    const pairData = await getSushiSwapPairData(model, lpTokenAddress);
    if( pairData ) {
        return (pairData.volumeUSD / pairData.reserveUSD) * 0.0025 * 360 * 100;
    }
    return 0;
}

export async function calculateSushiRewardApr(lpTokenAddress: string, 
    model: PickleModel, resolver : Signer | Provider) : Promise<number> {

    const multicallProvider = new MulticallProvider((resolver as Signer).provider === undefined ? (resolver as Provider) : (resolver as Signer).provider);
    await multicallProvider.init();

    const pairData = await getSushiSwapPairData(model, lpTokenAddress);
    if( pairData && model.prices.get("sushi")) {
        const poolId = sushiPoolIds[lpTokenAddress];
        const multicallSushiChef = new MulticallContract(
          SUSHI_CHEF_ADDR,
          sushiChefAbi,
        );
        const [
          sushiPerBlockBN,
          totalAllocPointBN,
          poolInfo,
        ] = await multicallProvider.all([
          multicallSushiChef.sushiPerBlock(),
          multicallSushiChef.totalAllocPoint(),
          multicallSushiChef.poolInfo(poolId),
        ]);
  
        const sushiRewardsPerBlock =
          (parseFloat(formatEther(sushiPerBlockBN)) *
            0.9 *
            poolInfo.allocPoint.toNumber()) /
          totalAllocPointBN.toNumber();
  
  
        const sushiRewardsPerYear =
          sushiRewardsPerBlock * (ONE_YEAR_SECONDS / AVERAGE_BLOCK_TIME);
        const valueRewardedPerYear = model.prices.get("sushi") * sushiRewardsPerYear;
  
        const totalValueStaked = pairData.reserveUSD;
        const sushiAPY = valueRewardedPerYear / totalValueStaked;
        return sushiAPY * 100;
      }
    return 0;
  };

  export async function calculateMCv2SushiRewards(lpTokenAddress: string, 
    model: PickleModel, resolver : Signer | Provider) : Promise<number> {

      const multicallProvider = new MulticallProvider((resolver as Signer).provider === undefined ? (resolver as Provider) : (resolver as Signer).provider);
      await multicallProvider.init();

      const pairData = await getSushiSwapPairData(model, lpTokenAddress);
      const poolId = sushiPoolV2Ids[lpTokenAddress];
      const multicallMasterChefV2 = new MulticallContract(
        MASTERCHEFV2_ADDR,masterChefV2Abi);
      const lpToken = new MulticallContract(lpTokenAddress, erc20Abi);

      const [
        sushiPerBlockBN,
        totalAllocPointBN,
        poolInfo,
        supplyInRewarderBN
      ] = await multicallProvider.all([
        multicallMasterChefV2.sushiPerBlock(),
        multicallMasterChefV2.totalAllocPoint(),
        multicallMasterChefV2.poolInfo(poolId),
        lpToken.balanceOf(MASTERCHEFV2_ADDR),
      ]);

      const supplyInRewarder = parseFloat(formatEther(supplyInRewarderBN));
      const sushiRewardsPerBlock =
        (parseFloat(formatEther(sushiPerBlockBN)) *
          0.9 *
          poolInfo.allocPoint.toNumber()) /
        totalAllocPointBN.toNumber();

      const sushiRewardsPerYear =
      sushiRewardsPerBlock * (ONE_YEAR_SECONDS / AVERAGE_BLOCK_TIME);
      const valueRewardedPerYear = model.prices.get("sushi") * sushiRewardsPerYear;
      const pricePerToken = pairData.reserveUSD/pairData.totalSupply;
      const totalValueStaked = supplyInRewarder * pricePerToken;
      const sushiAPY = valueRewardedPerYear / totalValueStaked;
      return sushiAPY * 100;
  }
/*
  export enum MASTERCHEF_V2_REWARD_RATE {

  }
  */
  export async function calculateMCv2TokenRewards(lpTokenAddress: string, rewardToken: string,
    model: PickleModel, resolver : Signer | Provider) : Promise<number> {
      const poolId = sushiPoolV2Ids[lpTokenAddress];
      const rewarder_addr = await new Contract(MASTERCHEFV2_ADDR, masterChefV2Abi, resolver).rewarder(poolId);
      const rewarder = new Contract(rewarder_addr, rewarderAbi, resolver);
      const lpToken = new Contract(lpTokenAddress, erc20Abi, resolver);
      const supplyInMasterChefBN = await lpToken.balanceOf(MASTERCHEFV2_ADDR);
      const supplyInMasterChef = parseFloat(formatEther(supplyInMasterChefBN));

      const pairData = await getSushiSwapPairData(model, lpTokenAddress);

      // TODO clean this mess up
      let rewardsPerYear = 0;
      if (rewardToken === "alcx") {
        const tokenPerBlockBN = await rewarder.tokenPerBlock();
        rewardsPerYear =
          (parseFloat(formatEther(tokenPerBlockBN)) * ONE_YEAR_SECONDS) /
          AVERAGE_BLOCK_TIME;
      } else if (rewardToken === "cvx") {
        const tokenPerSecondBN = await rewarder.rewardRate();
        rewardsPerYear =
          parseFloat(formatEther(tokenPerSecondBN)) * ONE_YEAR_SECONDS;
      } else if (rewardToken === "tru") {
        const tokenPerSecondBN = await rewarder.rewardPerSecond();
        rewardsPerYear =
          parseFloat(formatUnits(tokenPerSecondBN, 8)) * ONE_YEAR_SECONDS;
      }
      const valueRewardedPerYear = model.prices.get(rewardToken) * rewardsPerYear;

      const pricePerToken = pairData.reserveUSD/pairData.totalSupply;
      const totalValueStaked = pricePerToken * supplyInMasterChef;
      const rewardAPR = valueRewardedPerYear / totalValueStaked;
      
      return rewardAPR * 100;
  };
