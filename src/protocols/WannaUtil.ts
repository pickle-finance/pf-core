import {
  AssetAprComponent,
  AssetProtocol,
  JarDefinition,
} from "../model/PickleModelJson";
import erc20Abi from "../Contracts/ABIs/erc20.json";
import wannaChefAbi from "../Contracts/ABIs/wanna-farms.json";
import wannaV2FarmsAbi from "../Contracts/ABIs/wanna-v2-farms.json";
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
import sushiComplexRewarderAbi from "../Contracts/ABIs/sushi-complex-rewarder.json";

export const WANNA_FARMS = "0x2B2e72C232685fC4D350Eaa92f39f6f8AD2e1593";
export const WANNA_V2_FARMS = "0xC574bf5Dd3635Bf839D737CfB214993521D57d32";

export const wannaPoolIds: PoolId = {
  "0xbf9Eef63139b67fd0ABf22bD5504ACB0519a4212": 0,
  "0xBf560771B6002a58477EFBCDD6774A5a1947587B": 1,
  "0x2e02Bea8e9118f7d2ccadA1d402286Cc6d54bd67": 2,
  "0x3502eaC6Fa27bEebDC5cd3615B7CB0784B0Ce48f": 3,
  "0x256d03607eeE0156b8A2aB84da1D5B283219Fe97": 4,
  "0xf56997948d4235514Dcc50fC0EA7C0e110EC255d": 5,
  "0xbF58062D23f869a90c6Eb04B9655f0dfCA345947": 6,
  "0xE6c47B036f6Fd0684B109B484aC46094e633aF2e": 7,
  "0x7E9EA10E5984a09D19D05F31ca3cB65BB7df359d": 8,
  "0x523faE29D7ff6FD38842c8F271eDf2ebd3150435": 9,
  "0xcA461686C711AeaaDf0B516f9C2ad9d9B645a940": 10,
  "0x24f6c59747e4AcEB3DBA365df77D68c2A3aA4fB1": 12,
  "0x436C525D536adC447c7775575f88D357634734C1": 13,
  "0xddCcf2F096fa400ce90ba0568908233e6A950961": 16,
};

export const wannaPoolV2Ids = {
  "0xE22606659ec950E0328Aa96c7f616aDC4907cBe3": {
    poolId: 2,
    rewarder: "0x7856aD9B2133302685C112557ED295974E1acc93",
    reward: "meta",
  },
};

export async function calculateWannaFarmsAPY(
  jar: JarDefinition,
  model: PickleModel,
): Promise<AssetAprComponent[]> {
  const pricePerToken = model.priceOfSync(jar.depositToken.addr, jar.chain);

  let wannaPerBlockBN,
    totalAllocPointBN,
    poolInfo,
    totalSupplyBN,
    rewarder,
    extraRewardAPY = 0;

  const multiProvider = model.multiproviderFor(jar.chain);
  if (Number.isInteger(wannaPoolIds[jar.depositToken.addr])) {
    const poolId = wannaPoolIds[jar.depositToken.addr];
    const multicallWannaFarms = new Contract(WANNA_FARMS, wannaChefAbi);
    const lpToken = new Contract(jar.depositToken.addr, erc20Abi);

    [wannaPerBlockBN, totalAllocPointBN, poolInfo, totalSupplyBN] =
      await multiProvider.all([
        multicallWannaFarms.wannaPerBlock(),
        multicallWannaFarms.totalAllocPoint(),
        multicallWannaFarms.poolInfo(poolId),
        lpToken.balanceOf(WANNA_FARMS),
      ]);
  } else if (Number.isInteger(wannaPoolV2Ids[jar.depositToken.addr]?.poolId)) {
    const poolId = wannaPoolV2Ids[jar.depositToken.addr]?.poolId;
    const multicallWannaV2Farms = new Contract(WANNA_V2_FARMS, wannaV2FarmsAbi);
    const lpToken = new Contract(jar.depositToken.addr, erc20Abi);

    [wannaPerBlockBN, totalAllocPointBN, poolInfo, totalSupplyBN, rewarder] =
      await multiProvider.all([
        multicallWannaV2Farms.wannaPerBlock(),
        multicallWannaV2Farms.totalAllocPoint(),
        multicallWannaV2Farms.poolInfo(poolId),
        lpToken.balanceOf(WANNA_V2_FARMS),
        multicallWannaV2Farms.rewarder(poolId),
      ]);

    if (!wannaPoolV2Ids[jar.depositToken.addr]?.rewarder) {
      extraRewardAPY = 0;
    } else {
      const rewarderContract = new Contract(
        wannaPoolV2Ids[jar.depositToken.addr]?.rewarder,
        sushiComplexRewarderAbi,
      );

      const [extraRewardPerBlock] = await multiProvider.all([
        rewarderContract.rewardPerBlock(),
      ]);

      const rewardId = wannaPoolV2Ids[jar.depositToken.addr]?.reward;
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
    (parseFloat(formatEther(wannaPerBlockBN)) *
      poolInfo.allocPoint.toNumber()) /
    totalAllocPointBN.toNumber();

  const rewardsPerYear =
    rewardsPerBlock *
    (ONE_YEAR_IN_SECONDS / (await Chains.getAccurateSecondsPerBlock(jar.chain, model)));

  const totalSupply = parseFloat(formatEther(totalSupplyBN));
  const wannaRewardedPerYear =
    model.priceOfSync("wanna", jar.chain) * rewardsPerYear;
  const totalValueStaked = totalSupply * pricePerToken;
  const wannaAPY = wannaRewardedPerYear / totalValueStaked;

  return [
    createAprComponentImpl("wanna", wannaAPY * 100, true, 0.9),
    ...(extraRewardAPY > 0
      ? [
          createAprComponentImpl(
            wannaPoolV2Ids[jar.depositToken.addr]?.reward,
            extraRewardAPY * 100,
            true,
            0.9,
          ),
        ]
      : []),
  ];
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
