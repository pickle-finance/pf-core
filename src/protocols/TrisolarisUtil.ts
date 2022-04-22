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
import { Contract as MultiContract } from "ethers-multicall";
import { ChainNetwork, Chains } from "../chain/Chains";
import { formatEther, formatUnits } from "ethers/lib/utils";
import { PoolId } from "./ProtocolUtil";
import { GenericSwapUtility, IExtendedPairData } from "./GenericSwapUtil";
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
    reward: "aurora",
  },
  "0xd1654a7713617d41A8C9530Fb9B948d00e162194": {
    poolId: 1,
    rewarder: "0x78EdEeFdF8c3ad827228d07018578E89Cf159Df1",
    reward: "aurora",
  },
  "0xdF8CbF89ad9b7dAFdd3e37acEc539eEcC8c47914": {
    poolId: 2,
    rewarder: "",
    reward: "",
  },
  "0xa9eded3E339b9cd92bB6DEF5c5379d678131fF90": {
    poolId: 3,
    rewarder: "",
    reward: "",
  },
  "0x61C9E05d1Cdb1b70856c7a2c53fA9c220830633c": {
    poolId: 4,
    rewarder: "",
    reward: "",
  },
  "0x6443532841a5279cb04420E61Cf855cBEb70dc8C": {
    poolId: 5,
    rewarder: "",
    reward: "",
  },
  "0x3dC236Ea01459F57EFc737A12BA3Bb5F3BFfD071": {
    poolId: 7,
    rewarder: "",
    reward: "",
  },
  "0x48887cEEA1b8AD328d5254BeF774Be91B90FaA09": {
    poolId: 8,
    rewarder: "0x42b950FB4dd822ef04C4388450726EFbF1C3CF63",
    reward: "flx",
  },
  "0x5913f644A10d98c79F2e0b609988640187256373": {
    poolId: 11,
    rewarder: "0x7B9e31BbEdbfdc99e3CC8b879b9a3B1e379Ce530",
    reward: "meta",
  },
  "0x47924Ae4968832984F4091EEC537dfF5c38948a4": {
    poolId: 12,
    rewarder: "0xf267212F1D8888e0eD20BbB0c7C87A089cDe6E88",
    reward: "meta",
  },
  "0x6277f94a69Df5df0Bc58b25917B9ECEFBf1b846A": {
    poolId: 16,
    rewarder: "0x170431D69544a1BC97855C6564E8460d39508844",
    reward: "near",
  },
  "0xBBf3D4281F10E537d5b13CA80bE22362310b2bf9": {
    poolId: 23,
    rewarder: "0xDc6d09f5CC085E29972d192cB3AdCDFA6495a741",
    reward: "bstn",
  },
};

export async function calculateTriFarmsAPY(
  jar: JarDefinition,
  model: PickleModel,
): Promise<AssetAprComponent[]> {
  const pricePerToken = model.priceOfSync(jar.depositToken.addr, jar.chain);

  let triPerBlockBN,
    totalAllocPointBN,
    poolInfo,
    totalSupplyBN,
    rewarder,
    extraRewardAPY = 0;
  if (Number.isInteger(triPoolIds[jar.depositToken.addr])) {
    const poolId = triPoolIds[jar.depositToken.addr];
    const multicallTriFarms = new MultiContract(TRI_FARMS, triFarmsAbi);
    const lpToken = new MultiContract(jar.depositToken.addr, erc20Abi);

    [triPerBlockBN, totalAllocPointBN, poolInfo, totalSupplyBN] =
      await model.callMulti(
        [
          () => multicallTriFarms.triPerBlock(),
          () => multicallTriFarms.totalAllocPoint(),
          () => multicallTriFarms.poolInfo(poolId),
          () => lpToken.balanceOf(TRI_FARMS),
        ],
        jar.chain,
      );
  } else if (Number.isInteger(triPoolV2Ids[jar.depositToken.addr]?.poolId)) {
    const poolId = triPoolV2Ids[jar.depositToken.addr]?.poolId;
    const multicallTriV2Farms = new MultiContract(TRI_V2_FARMS, triv2FarmsAbi);
    const lpToken = new MultiContract(jar.depositToken.addr, erc20Abi);

    // First get TRI APY
    [triPerBlockBN, totalAllocPointBN, poolInfo, totalSupplyBN, rewarder] =
      await model.callMulti(
        [
          () => multicallTriV2Farms.triPerBlock(),
          () => multicallTriV2Farms.totalAllocPoint(),
          () => multicallTriV2Farms.poolInfo(poolId),
          () => lpToken.balanceOf(TRI_V2_FARMS),
          () => multicallTriV2Farms.rewarder(poolId),
        ],
        jar.chain,
      );
    if (rewarder != "0x0000000000000000000000000000000000000000") {
      //WIP
      const multicallRewarder = new MultiContract(
        rewarder,
        sushiComplexRewarderAbi,
      );
      // const extraReward = await model.callMulti([() => multicallRewarder.rewardToken()], jar.chain);
      //WIP
    }

    // Return extraReward APY of 0 if there's no rewarder
    if (!triPoolV2Ids[jar.depositToken.addr]?.rewarder) {
      extraRewardAPY = 0;
    } else {
      // Get extraReward APY
      const rewarderContract = new MultiContract(
        triPoolV2Ids[jar.depositToken.addr]?.rewarder,
        sushiComplexRewarderAbi,
      );

      const extraRewardPerBlock = await model.callMulti(
        () => rewarderContract.tokenPerBlock(),
        jar.chain,
      );

      // const extraReward = await model.callMulti(
      //   () => rewarderContract.pendingTokens(),
      //   jar.chain
      // );

      const rewardId = triPoolV2Ids[jar.depositToken.addr]?.reward;
      const extraRewardRewardsPerYear =
        (parseFloat(
          formatUnits(
            extraRewardPerBlock,
            model.tokenDecimals(rewardId, jar.chain),
          ),
        ) *
          ONE_YEAR_IN_SECONDS *
          model.priceOfSync(rewardId, jar.chain)) /
        Chains.get(jar.chain).secondsPerBlock;

      const totalSupply = parseFloat(formatEther(totalSupplyBN));

      extraRewardAPY =
        extraRewardRewardsPerYear / (totalSupply * pricePerToken);
    }
  }

  const rewardsPerBlock =
    (parseFloat(formatEther(triPerBlockBN)) * poolInfo.allocPoint.toNumber()) /
    totalAllocPointBN.toNumber();
  const rewardsPerYear =
    rewardsPerBlock *
    (ONE_YEAR_IN_SECONDS / Chains.get(jar.chain).secondsPerBlock);

  const totalSupply = parseFloat(formatEther(totalSupplyBN));
  const triRewardedPerYear =
    model.priceOfSync("tri", jar.chain) * rewardsPerYear;
  const totalValueStaked = totalSupply * pricePerToken;
  const triAPY = triRewardedPerYear / totalValueStaked;

  return [
    createAprComponentImpl("tri", triAPY * 100, true, 0.9),
    ...(extraRewardAPY > 0
      ? [
          createAprComponentImpl(
            triPoolV2Ids[jar.depositToken.addr]?.reward,
            extraRewardAPY * 100,
            true,
            0.9,
          ),
        ]
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
      ChainNetwork.Aurora,
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
