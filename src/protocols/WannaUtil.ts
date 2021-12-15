import {
    AssetAprComponent,
    AssetProtocol,
    JarDefinition,
  } from "../model/PickleModelJson";
  import erc20Abi from "../Contracts/ABIs/erc20.json";
  import wannaChefAbi from "../Contracts/ABIs/wanna-farms.json";
  import { PickleModel } from "../model/PickleModel";
  import { Contract as MulticallContract } from "ethers-multicall";
  import { Chains } from "../chain/Chains";
  import { formatEther } from "ethers/lib/utils";
  import { PoolId } from "./ProtocolUtil";
  import { GenericSwapUtility, IExtendedPairData } from "./GenericSwapUtil";
  import {
    createAprComponentImpl,
    ONE_YEAR_IN_SECONDS,
  } from "../behavior/AbstractJarBehavior";
  
  export const WANNA_FARMS = "0x2B2e72C232685fC4D350Eaa92f39f6f8AD2e1593";
  
  export const wannaPoolIds: PoolId = {
    "0xbf9Eef63139b67fd0ABf22bD5504ACB0519a4212": 0,
  };
  
  export async function calculateWannaFarmsAPY(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<AssetAprComponent[]> {
    const multicallProvider = model.multicallProviderFor(jar.chain);
    await multicallProvider.init();
  
    const pricePerToken = await model.priceOf(jar.depositToken.addr);
  
    const poolId = wannaPoolIds[jar.depositToken.addr];
    const multicallWannaFarms = new MulticallContract(WANNA_FARMS, wannaChefAbi);
    const lpToken = new MulticallContract(jar.depositToken.addr, erc20Abi);
  
    const [wannaPerBlockBN, totalAllocPointBN, poolInfo, totalSupplyBN] =
      await multicallProvider.all([
        multicallWannaFarms.wannaPerBlock(),
        multicallWannaFarms.totalAllocPoint(),
        multicallWannaFarms.poolInfo(poolId),
        lpToken.balanceOf(WANNA_FARMS),
      ]);
  
    const rewardsPerBlock =
      (parseFloat(formatEther(wannaPerBlockBN)) * poolInfo.allocPoint.toNumber()) /
      totalAllocPointBN.toNumber();
  
    const rewardsPerYear =
      rewardsPerBlock *
      (ONE_YEAR_IN_SECONDS / Chains.get(jar.chain).secondsPerBlock);
  
    const totalSupply = parseFloat(formatEther(totalSupplyBN));
    const wannaRewardedPerYear = (await model.priceOf("wanna")) * rewardsPerYear;
    const totalValueStaked = totalSupply * pricePerToken;
    const wannaAPY = wannaRewardedPerYear / totalValueStaked;
  
    return [createAprComponentImpl("wanna", wannaAPY * 100, true, 0.9)];
  }
  
  const WANNA_PAIR_CACHE_KEY = "wanna.pair.data.cache.key";
  
  const WANNA_QUERY_KEYS: string[] = [
    "pairAddress",
    "date",
    "reserveUSD",
    "dailyVolumeUSD",
    "reserve0",
    "reserve1",
    "token0{id}",
    "token1{id}",
    "totalSupply",
  ];
  
  export class WannaPairManager extends GenericSwapUtility {
    constructor() {
      super(
        WANNA_PAIR_CACHE_KEY,
        "pairAddress",
        WANNA_QUERY_KEYS,
        AssetProtocol.WANNASWAP,
        0.002,
      );
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
        pricePerToken: pair.reserveUSD / pair.totalSupply,
      };
    }
  }
  