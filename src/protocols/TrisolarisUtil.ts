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
import { Contract } from "ethers-multiprovider";
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
  // "0x20F8AeFB5697B77E0BB835A8518BE70775cdA1b0": 1,
  // "0x03B666f3488a7992b2385B12dF7f35156d7b29cD": 2,
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
  "0xdDAdf88b007B95fEb42DDbd110034C9a8e9746F2": {
    poolId: 10,
    rewarder: "0xbbE41F699B0fB747cd4bA21067F6b27e0698Bc30",
    reward: "solace",
    eco: true,
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
  "0xb419ff9221039Bdca7bb92A131DD9CF7DEb9b8e5": {
    poolId: 13,
    rewarder: "0xb84293D04137c9061afe34118Dac9931df153826",
    reward: "xnl",
    eco: true,
  },
  "0xFBc4C42159A5575a772BebA7E3BF91DB508E127a": {
    poolId: 14,
    rewarder: "0x028Fbc4BB5787e340524EF41d95875Ac2C382101",
    reward: "xnl",
    eco: true,
  },
  "0x7B273238C6DD0453C160f305df35c350a123E505": {
    poolId: 15,
    rewarder: "0xDAc58A615E2A1a94D7fb726a96C273c057997D50",
    reward: "gba",
    eco: true,
  },
  "0x6277f94a69Df5df0Bc58b25917B9ECEFBf1b846A": {
    poolId: 16,
    rewarder: "0x170431D69544a1BC97855C6564E8460d39508844",
    reward: "near",
  },
  "0xadAbA7E2bf88Bd10ACb782302A568294566236dC": {
    poolId: 17,
    rewarder: "0xABE01A6b6922130C982E221681EB4C4aD07A21dA",
    reward: "bbt",
    eco: true,
  },
  "0x5E74D85311fe2409c341Ce49Ce432BB950D221DE": {
    poolId: 19,
    rewarder: "",
    reward: "",
  },
  "0xbe753E99D0dBd12FB39edF9b884eBF3B1B09f26C": {
    poolId: 20,
    rewarder: "0xfe9B7A3bf38cE0CA3D5fA25d371Ff5C6598663d4",
    reward: "rose",
  },
  "0xbC0e71aE3Ef51ae62103E003A9Be2ffDe8421700": {
    poolId: 21,
    rewarder: "0x87a03aFA70302a5a0F6156eBEd27f230ABF0e69C",
    reward: "rose",
  },
  "0xbceA13f9125b0E3B66e979FedBCbf7A4AfBa6fd1": {
    poolId: 22,
    rewarder: "0x1616B20534d1d1d731C31Ca325F4e909b8f3E0f0",
    reward: "linear",
  },
  "0xBBf3D4281F10E537d5b13CA80bE22362310b2bf9": {
    poolId: 23,
    rewarder: "0xDc6d09f5CC085E29972d192cB3AdCDFA6495a741",
    reward: "bstn",
  },
  "0x1e0e812FBcd3EB75D8562AD6F310Ed94D258D008": {
    poolId: 24,
    rewarder: "0x34c58E960b80217fA3e0323d37563c762a131AD9",
    reward: "aurora",
  },
  "0x20F8AeFB5697B77E0BB835A8518BE70775cdA1b0": {
    poolId: 25,
    rewarder: "0x84C8B673ddBF0F647c350dEd488787d3102ebfa3",
    reward: "aurora",
  },
  "0x03B666f3488a7992b2385B12dF7f35156d7b29cD": {
    poolId: 26,
    rewarder: "0x4e0152b260319e5131f853AeCB92c8f992AA0c97",
    reward: "aurora",
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
  const multiProvider = model.multiproviderFor(jar.chain);
  if (Number.isInteger(triPoolIds[jar.depositToken.addr])) {
    const poolId = triPoolIds[jar.depositToken.addr];
    const multicallTriFarms = new Contract(TRI_FARMS, triFarmsAbi);
    const lpToken = new Contract(jar.depositToken.addr, erc20Abi);

    [triPerBlockBN, totalAllocPointBN, poolInfo, totalSupplyBN] =
      await multiProvider.all([
        multicallTriFarms.triPerBlock(),
        multicallTriFarms.totalAllocPoint(),
        multicallTriFarms.poolInfo(poolId),
        lpToken.balanceOf(TRI_FARMS),
      ]);
  } else if (Number.isInteger(triPoolV2Ids[jar.depositToken.addr]?.poolId)) {
    const poolId = triPoolV2Ids[jar.depositToken.addr]?.poolId;
    const multicallTriV2Farms = new Contract(TRI_V2_FARMS, triv2FarmsAbi);
    const lpToken = new Contract(jar.depositToken.addr, erc20Abi);

    // First get TRI APY
    [triPerBlockBN, totalAllocPointBN, poolInfo, totalSupplyBN, rewarder] =
      await multiProvider.all([
        multicallTriV2Farms.triPerBlock(),
        multicallTriV2Farms.totalAllocPoint(),
        multicallTriV2Farms.poolInfo(poolId),
        lpToken.balanceOf(TRI_V2_FARMS),
        multicallTriV2Farms.rewarder(poolId),
      ]);

    // Return extraReward APY of 0 if there's no rewarder
    if (!triPoolV2Ids[jar.depositToken.addr]?.rewarder) {
      extraRewardAPY = 0;
    } else {
      // Get extraReward APY
      const rewarderContract = new Contract(
        triPoolV2Ids[jar.depositToken.addr]?.rewarder,
        sushiComplexRewarderAbi,
      );

      const [extraRewardPerBlock] = await multiProvider.all([
        rewarderContract.tokenPerBlock(),
      ]);

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
          (await Chains.getAccurateSecondsPerBlock(jar.chain, model));

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
    (ONE_YEAR_IN_SECONDS / (await Chains.getAccurateSecondsPerBlock(jar.chain, model)));

  const totalSupply = parseFloat(formatEther(totalSupplyBN));
  const triRewardedPerYear =
    model.priceOfSync("tri", jar.chain) * rewardsPerYear;
  const totalValueStaked = totalSupply * pricePerToken;
  const triAPY = triRewardedPerYear / totalValueStaked;

  if (triPoolV2Ids[jar.depositToken.addr]?.eco === true) {
    return [
      createAprComponentImpl(
        triPoolV2Ids[jar.depositToken.addr]?.reward,
        extraRewardAPY * 100,
        true,
        0.9,
      ),
    ];
  } else {
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
