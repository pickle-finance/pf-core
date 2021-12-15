import {
  AssetAprComponent,
  AssetProtocol,
  JarDefinition,
} from "../model/PickleModelJson";
import erc20Abi from "../Contracts/ABIs/erc20.json";
import sushiChefAbi from "../Contracts/ABIs/sushi-chef.json";
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

export const PAD_FARMS = "0x2aeF68F92cfBAFA4b542F60044c7596e65612D20";

export const padPoolIds: PoolId = {
  "0xA188D79D6bdbc1120a662DE9eB72384E238AF104": 13,
};

export async function calculatePadFarmsAPY(
  jar: JarDefinition,
  model: PickleModel,
): Promise<AssetAprComponent[]> {
  const multicallProvider = model.multicallProviderFor(jar.chain);
  await multicallProvider.init();

  const pricePerToken = await model.priceOf(jar.depositToken.addr);

  const poolId = padPoolIds[jar.depositToken.addr];
  const multicallPadFarms = new MulticallContract(PAD_FARMS, sushiChefAbi);
  const lpToken = new MulticallContract(jar.depositToken.addr, erc20Abi);

  const [padPerBlockBN, totalAllocPointBN, poolInfo, totalSupplyBN] =
    await multicallProvider.all([
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
    (ONE_YEAR_IN_SECONDS / Chains.get(jar.chain).secondsPerBlock);

  const totalSupply = parseFloat(formatEther(totalSupplyBN));
  const padRewardedPerYear = (await model.priceOf("nearpad")) * rewardsPerYear;
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
