import {
  AssetAprComponent,
  AssetProtocol,
  JarDefinition,
} from "../model/PickleModelJson";
import erc20Abi from "../Contracts/ABIs/erc20.json";
import wannaChefAbi from "../Contracts/ABIs/wanna-farms.json";
import { PickleModel } from "../model/PickleModel";
import { Contract as MulticallContract } from "ethers-multicall";
import { ChainNetwork, Chains } from "../chain/Chains";
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

export async function calculateWannaFarmsAPY(
  jar: JarDefinition,
  model: PickleModel,
): Promise<AssetAprComponent[]> {
  const multicallProvider = model.multicallProviderFor(jar.chain);
  await multicallProvider.init();

  const pricePerToken = model.priceOfSync(jar.depositToken.addr, jar.chain);

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
    (parseFloat(formatEther(wannaPerBlockBN)) *
      poolInfo.allocPoint.toNumber()) /
    totalAllocPointBN.toNumber();

  const rewardsPerYear =
    rewardsPerBlock *
    (ONE_YEAR_IN_SECONDS / Chains.get(jar.chain).secondsPerBlock);

  const totalSupply = parseFloat(formatEther(totalSupplyBN));
  const wannaRewardedPerYear = (model.priceOfSync("wanna", jar.chain)) * rewardsPerYear;
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
