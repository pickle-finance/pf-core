import {
  AssetAprComponent,
  AssetProtocol,
  JarDefinition,
} from "../model/PickleModelJson";
import erc20Abi from "../Contracts/ABIs/erc20.json";
import brlChefAbi from "../Contracts/ABIs/brl-farms.json";
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

export const BRL_FARMS = "0x35CC71888DBb9FfB777337324a4A60fdBAA19DDE";

export const brlPoolIds: PoolId = {
  "0xbf9Eef63139b67fd0ABf22bD5504ACB0519a4212": 0,
  "0xc57eCc341aE4df32442Cf80F34f41Dc1782fE067": 1,
  "0xEc538fAfaFcBB625C394c35b11252cef732368cd": 2,
  "0x480A68bA97d70495e80e11e05D59f6C659749F27": 3,
  "0xF3DE9dc38f62608179c45fE8943a0cA34Ba9CEfc": 4,
  "0xe11A3f2BAB372d88D133b64487D1772847Eec4eA": 5,
  "0xcb8584360Dc7A4eAC4878b48fB857AA794E46Fa8": 6,
  "0x388D5EE199aC8dAD049B161b57487271Cd787941": 7,
  "0x729dB9dB6d3cA82EF7e4c886C352749758BaD0eb": 8,
  "0x314ab6AaeE15424ea8De07e2007646EcF3772357": 9,
  "0x1C393468D95ADF8960E64939bCDd6eE602DE221C": 10,
  "0x8F6e13B3D28B09535EB82BE539c1E4802B0c25B7": 11,
  "0x8298B8C863c2213B9698A08de009cC0aB0F87FEe": 12,
  "0x5BdAC608cd38C5C8738f5bE20813194A3150d4Ff": 13,
  "0xEfCF518CA36DC3362F539965807b42A77DC26Be0": 14,
  "0xDB0363ee28a5B40BDc2f4701e399c63E00f91Aa8": 15,
  "0x84567E7511E0d97DE676d236AEa7aE688221799e": 16
};

export async function calculateBrlFarmsAPY(
  jar: JarDefinition,
  model: PickleModel,
): Promise<AssetAprComponent[]> {
  const multicallProvider = model.multicallProviderFor(jar.chain);
  await multicallProvider.init();

  const pricePerToken = await model.priceOf(jar.depositToken.addr);

  const poolId = brlPoolIds[jar.depositToken.addr];
  const multicallBrlFarms = new MulticallContract(BRL_FARMS, brlChefAbi);
  const lpToken = new MulticallContract(jar.depositToken.addr, erc20Abi);

  const [brlPerBlockBN, totalAllocPointBN, poolInfo, totalSupplyBN] =
    await multicallProvider.all([
      multicallBrlFarms.BRLPerBlock(),
      multicallBrlFarms.totalAllocPoint(),
      multicallBrlFarms.poolInfo(poolId),
      lpToken.balanceOf(BRL_FARMS),
    ]);

  const rewardsPerBlock =
    (parseFloat(formatEther(brlPerBlockBN)) * poolInfo.allocPoint.toNumber()) /
    totalAllocPointBN.toNumber();

  const rewardsPerYear =
    rewardsPerBlock *
    (ONE_YEAR_IN_SECONDS / Chains.get(jar.chain).secondsPerBlock);

  const totalSupply = parseFloat(formatEther(totalSupplyBN));
  const brlRewardedPerYear = (await model.priceOf("brl")) * rewardsPerYear;
  const totalValueStaked = totalSupply * pricePerToken;
  const brlAPY = brlRewardedPerYear / totalValueStaked;

  return [createAprComponentImpl("brl", brlAPY * 100, true, 0.9)];
}

const BRL_PAIR_CACHE_KEY = "brl.pair.data.cache.key";

const BRL_QUERY_KEYS: string[] = [
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

export class BrlPairManager extends GenericSwapUtility {
  constructor() {
    super(
      BRL_PAIR_CACHE_KEY,
      "pairAddress",
      BRL_QUERY_KEYS,
      AssetProtocol.AURORASWAP,
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
