import {
  AssetAprComponent,
  AssetProtocol,
  JarDefinition,
} from "../model/PickleModelJson";
import erc20Abi from "../Contracts/ABIs/erc20.json";
import triFarmsAbi from "../Contracts/ABIs/tri-farms.json";
import triv2FarmsAbi from "../Contracts/ABIs/triv2-farms.json";
import sushiComplexRewarderAbi from "../Contracts/ABIs/sushi-complex-rewarder.json";
import { PickleModel } from "../model/PickleModel";
import { Contract as MulticallContract } from "ethers-multicall";
import { Chains } from "../chain/Chains";
import { formatEther } from "ethers/lib/utils";
import { PoolId } from "./ProtocolUtil";
import { GenericSwapUtility, IExtendedPairData } from "./GenericSwapUtil";
import { ethers } from "ethers";
import {
  createAprComponentImpl,
  ONE_YEAR_IN_SECONDS,
} from "../behavior/AbstractJarBehavior";

export const TRI_FARMS = "0x1f1Ed214bef5E83D8f5d0eB5D7011EB965D0D79B";
export const TRI_V2_FARMS = "0x3838956710bcc9D122Dd23863a0549ca8D5675D6";

export const triPoolIds: PoolId = {
  "0x63da4DB6Ef4e7C62168aB03982399F9588fCd198": 0,
  "0x20F8AeFB5697B77E0BB835A8518BE70775cdA1b0": 1,
  "0x03B666f3488a7992b2385B12dF7f35156d7b29cD": 2,
  "0x2fe064B6c7D274082aa5d2624709bC9AE7D16C77": 3,
  "0xbc8A244e8fb683ec1Fd6f88F3cc6E565082174Eb": 4,
  "0x84b123875F0F36B966d0B6Ca14b31121bd9676AD": 5,
};

export const triPoolV2Ids = {
  "0x5eeC60F348cB1D661E4A5122CF4638c7DB7A886e": {
    poolId: 0,
    rewarder: "0x94669d7a170bfe62FAc297061663e0B48C63B9B5",
  },
  "0xd1654a7713617d41A8C9530Fb9B948d00e162194": {
    poolId: 1,
    rewarder: "0x78EdEeFdF8c3ad827228d07018578E89Cf159Df1",
  },
  "0x436C525D536adC447c7775575f88D357634734C1": {
    poolId: 2,
    rewarder: ""
  },
  "0xa9eded3E339b9cd92bB6DEF5c5379d678131fF90": {
    poolId: 3,
    rewarder: ""
  }
};

export async function calculateTriFarmsAPY(
  jar: JarDefinition,
  model: PickleModel,
): Promise<AssetAprComponent[]> {
  const multicallProvider = model.multicallProviderFor(jar.chain);
  await multicallProvider.init();

  const pricePerToken = await model.priceOf(jar.depositToken.addr);

  let triPerBlockBN,
    totalAllocPointBN,
    poolInfo,
    totalSupplyBN,
    auroraAPY = 0,
    rewardsPerYear;
  if (Number.isInteger(triPoolIds[jar.depositToken.addr])) {
    const poolId = triPoolIds[jar.depositToken.addr];
    const multicallTriFarms = new MulticallContract(TRI_FARMS, triFarmsAbi);
    const lpToken = new MulticallContract(jar.depositToken.addr, erc20Abi);

    [triPerBlockBN, totalAllocPointBN, poolInfo, totalSupplyBN] =
      await multicallProvider.all([
        multicallTriFarms.triPerBlock(),
        multicallTriFarms.totalAllocPoint(),
        multicallTriFarms.poolInfo(poolId),
        lpToken.balanceOf(TRI_FARMS),
      ]);
  } else if (Number.isInteger(triPoolV2Ids[jar.depositToken.addr]?.poolId)) {
    const poolId = triPoolV2Ids[jar.depositToken.addr]?.poolId;
    const multicallTriV2Farms = new MulticallContract(
      TRI_V2_FARMS,
      triv2FarmsAbi,
    );
    const lpToken = new MulticallContract(jar.depositToken.addr, erc20Abi);

    // First get TRI APY
    [triPerBlockBN, totalAllocPointBN, poolInfo, totalSupplyBN] =
      await multicallProvider.all([
        multicallTriV2Farms.triPerBlock(),
        multicallTriV2Farms.totalAllocPoint(),
        multicallTriV2Farms.poolInfo(poolId),
        lpToken.balanceOf(TRI_V2_FARMS),
      ]);

    // Get AURORA APY
    const rewarderContract = new ethers.Contract(
      triPoolV2Ids[jar.depositToken.addr]?.rewarder,
      sushiComplexRewarderAbi,
      model.providerFor(jar.chain),
    );

    const auroraPerBlock = await rewarderContract.tokenPerBlock();

    const auroraRewardsPerYear =
      (parseFloat(formatEther(auroraPerBlock)) *
        ONE_YEAR_IN_SECONDS *
        (await model.priceOf("aurora"))) /
      Chains.get(jar.chain).secondsPerBlock;

    const totalSupply = parseFloat(formatEther(totalSupplyBN));

    auroraAPY = auroraRewardsPerYear / (totalSupply * pricePerToken);
  }

  const rewardsPerBlock =
    (parseFloat(formatEther(triPerBlockBN)) * poolInfo.allocPoint.toNumber()) /
    totalAllocPointBN.toNumber();
  rewardsPerYear =
    rewardsPerBlock *
    (ONE_YEAR_IN_SECONDS / Chains.get(jar.chain).secondsPerBlock);

  const totalSupply = parseFloat(formatEther(totalSupplyBN));
  const triRewardedPerYear = (await model.priceOf("tri")) * rewardsPerYear;
  const totalValueStaked = totalSupply * pricePerToken;
  const triAPY = triRewardedPerYear / totalValueStaked;

  return [
    createAprComponentImpl("tri", triAPY * 100, true, 0.9),
    ...(auroraAPY > 0
      ? [createAprComponentImpl("aurora", auroraAPY * 100, true, 0.9)]
      : []),
  ];
}

const TRI_PAIR_CACHE_KEY = "triswap.pair.data.cache.key";

const TRI_QUERY_KEYS: string[] = [
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

export class TriswapPairManager extends GenericSwapUtility {
  constructor() {
    super(
      TRI_PAIR_CACHE_KEY,
      "pairAddress",
      TRI_QUERY_KEYS,
      AssetProtocol.TRISOLARIS,
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
