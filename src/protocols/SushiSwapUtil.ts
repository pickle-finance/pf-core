import { ChainNetwork, PickleModel } from "..";
import { AVERAGE_BLOCK_TIME, ONE_YEAR_SECONDS } from "../behavior/JarBehaviorResolver";
import { AssetProtocol, PickleAsset } from "../model/PickleModelJson";
import { PoolId } from "./ProtocolUtil";
import { Provider as MulticallProvider, Contract as MulticallContract} from 'ethers-multicall';
import erc20Abi from '../Contracts/ABIs/erc20.json';
import sushiChefAbi from '../Contracts/ABIs/sushi-chef.json';
import masterChefV2Abi from '../Contracts/ABIs/masterchefv2.json';
import rewarderAbi from '../Contracts/ABIs/rewarder.json';
import { formatEther, formatUnits } from "ethers/lib/utils";
import { Contract, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { GenericSwapUtility, IExtendedPairData } from "./GenericSwapUtil";


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
  


  const SUSHI_POLY_PAIR_DATA_CACHE_KEY = "sushiswap.poly.pair.data.cache.key";
  const SUSHI_POLY_PAIR_GRAPH_FIELDS : string[] = [
    "pair{id}",
    "reserveUSD",
    "volumeUSD",
    "reserve0",
    "reserve1",
    "token0{id}",
    "token1{id}",
    "totalSupply"
  ];
  export class SushiPolyPairManager extends GenericSwapUtility {
    constructor() {
      super(SUSHI_POLY_PAIR_DATA_CACHE_KEY, "pair", SUSHI_POLY_PAIR_GRAPH_FIELDS, 
      AssetProtocol.SUSHISWAP_POLYGON, .0025);
    }

    pairAddressFromDayData(dayData: any): string {
      return dayData.pair.id;
    }
    toExtendedPairData(pair: any): IExtendedPairData {
      return {
        pairAddress: pair.id,
        reserveUSD: pair.reserveUSD,
        dailyVolumeUSD: pair.volumeUSD,
        reserve0: pair.reserve0,
        reserve1: pair.reserve1,
        token0Id: pair.token0.id,
        token1Id: pair.token1.id,
        totalSupply: pair.totalSupply,
        pricePerToken: pair.reserveUSD / pair.totalSupply
    }
  }
}

const SUSHI_ETH_PAIR_DATA_CACHE_KEY = "sushiswap.eth.pair.data.cache.key";
const SUSHI_ETH_PAIR_GRAPH_FIELDS : string[] = [
  "pairAddress",
  "reserveUSD",
  "dailyVolumeUSD",
  "reserve0",
  "reserve1",
  "token0{id}",
  "token1{id}",
  "totalSupply",
];
export class SushiEthPairManager extends GenericSwapUtility {
  constructor() {
    super(SUSHI_ETH_PAIR_DATA_CACHE_KEY, "pairAddress", SUSHI_ETH_PAIR_GRAPH_FIELDS, 
    AssetProtocol.SUSHISWAP, .0025);
  }

  pairAddressFromDayData(dayData: any): string {
    return dayData.pairAddress;
  }
  toExtendedPairData(pair: any): IExtendedPairData {
    return {
      pairAddress: pair.pairAddress,
      reserveUSD: pair.reserveUSD,
      dailyVolumeUSD: pair.dailyVolumeUSD,
      reserve0: pair.reserve0,
      reserve1: pair.reserve1,
      token0Id: pair.token0.id,
      token1Id: pair.token1.id,
      totalSupply: pair.totalSupply,
      pricePerToken: pair.reserveUSD / pair.totalSupply
  }
}
}


export async function calculateSushiRewardApr(lpTokenAddress: string, 
    model: PickleModel, chain: ChainNetwork) : Promise<number> {

    const multicallProvider = model.multicallProviderFor(chain);
    await multicallProvider.init();

    
    const pairData = await new SushiEthPairManager().getPairData(model, lpTokenAddress);
    if( pairData && await model.priceOf("sushi")) {
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
        const valueRewardedPerYear = await model.priceOf("sushi") * sushiRewardsPerYear;
  
        const sushiAPY = valueRewardedPerYear / pairData.reserveUSD;
        return sushiAPY * 100;
      }
    return 0;
  };

  export async function calculateMCv2SushiRewards(lpTokenAddress: string, 
    model: PickleModel, chain: ChainNetwork) : Promise<number> {

      const multicallProvider = model.multicallProviderFor(chain);
      await multicallProvider.init();

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
      const valueRewardedPerYear = await model.priceOf("sushi") * sushiRewardsPerYear;
      const pricePerToken = await model.priceOf(lpTokenAddress);
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
      const valueRewardedPerYear = await model.priceOf(rewardToken) * rewardsPerYear;

      const pricePerToken = await model.priceOf(lpTokenAddress);
      const totalValueStaked = pricePerToken * supplyInMasterChef;
      const rewardAPR = valueRewardedPerYear / totalValueStaked;
      
      return rewardAPR * 100;
  };

