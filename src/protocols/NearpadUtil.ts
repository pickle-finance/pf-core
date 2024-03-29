import {
  AssetAprComponent,
  AssetProtocol,
  JarDefinition,
} from "../model/PickleModelJson";
import erc20Abi from "../Contracts/ABIs/erc20.json";
import sushiChefAbi from "../Contracts/ABIs/sushi-chef.json";
import { PickleModel } from "../model/PickleModel";
import { Contract } from "ethers-multiprovider";
import { ChainNetwork, Chains } from "../chain/Chains";
import { formatEther } from "ethers/lib/utils";
import { PoolId } from "./ProtocolUtil";
import { GenericSwapUtility, IExtendedPairData } from "./GenericSwapUtil";
import {
  createAprComponentImpl,
  ONE_YEAR_IN_SECONDS,
} from "../behavior/AbstractJarBehavior";

export const PAD_FARMS = "0x2aeF68F92cfBAFA4b542F60044c7596e65612D20";

export const padPoolIds: PoolId = {
  "0x1FD6CBBFC0363AA394bd77FC74F64009BF54A7e9": 0,
  "0x73155e476D6b857fE7722AEfeBAD50F9F8bd0b38": 1,
  "0xaf3f197Ce82bf524dAb0e9563089d443cB950048": 2,
  "0x63b4a0538CE8D90876B201af1020d13308a8B253": 3,
  "0xc374776Cf5C497Adeef6b505588b00cB298531FD": 5,
  "0x24886811d2d5E362FF69109aed0A6EE3EeEeC00B": 9,
  "0xFE28a27a95e51BB2604aBD65375411A059371616": 11,
  "0x50F63D48a52397C1a469Ccd057905CC8d2609B85": 12,
  "0xA188D79D6bdbc1120a662DE9eB72384E238AF104": 13,
  "0xB53bC2537e641C37c7B7A8D33aba1B30283CDA2f": 14,
  "0xC8F45738e2900fCaB9B72EA624F48aE2c222e248": 16,
};

export async function calculatePadFarmsAPY(
  jar: JarDefinition,
  model: PickleModel,
): Promise<AssetAprComponent[]> {
  const pricePerToken = model.priceOfSync(jar.depositToken.addr, jar.chain);

  const poolId = padPoolIds[jar.depositToken.addr];
  const multiProvider = model.multiproviderFor(jar.chain);
  const multicallPadFarms = new Contract(PAD_FARMS, sushiChefAbi);
  const lpToken = new Contract(jar.depositToken.addr, erc20Abi);

  const [padPerBlockBN, totalAllocPointBN, poolInfo, totalSupplyBN] =
    await multiProvider.all([
      multicallPadFarms.sushiPerBlock(),
      multicallPadFarms.totalAllocPoint(),
      multicallPadFarms.poolInfo(poolId),
      lpToken.balanceOf(PAD_FARMS),
    ]);

  const rewardsPerBlock =
    (parseFloat(formatEther(padPerBlockBN)) * poolInfo.allocPoint.toNumber()) /
    totalAllocPointBN.toNumber();

  const rewardsPerYear =
    rewardsPerBlock *
    (ONE_YEAR_IN_SECONDS / (await Chains.getAccurateSecondsPerBlock(jar.chain, model)));

  const totalSupply = parseFloat(formatEther(totalSupplyBN));
  const padRewardedPerYear =
    model.priceOfSync("pad", jar.chain) * rewardsPerYear;
  const totalValueStaked = totalSupply * pricePerToken;
  const padAPY = padRewardedPerYear / totalValueStaked;

  return [createAprComponentImpl("nearpad", padAPY * 100, true, 0.9)];
}

const PAD_PAIR_CACHE_KEY = "nearpad.pair.data.cache.key";

const PAD_QUERY_KEYS: string[] = [
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

export class NearpadPairManager extends GenericSwapUtility {
  constructor() {
    super(
      PAD_PAIR_CACHE_KEY,
      "pairAddress",
      PAD_QUERY_KEYS,
      AssetProtocol.NEARPAD,
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
