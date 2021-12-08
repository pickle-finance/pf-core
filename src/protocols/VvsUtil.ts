import { AssetProtocol, JarDefinition } from "../model/PickleModelJson";
import erc20Abi from "../Contracts/ABIs/erc20.json";
import vvsFarmsAbi from "../Contracts/ABIs/vvs-farms.json";
import { PickleModel } from "../model/PickleModel";
import { Contract as MulticallContract } from "ethers-multicall";
import { Chains } from "../chain/Chains";
import { formatEther } from "ethers/lib/utils";
import { PoolId } from "./ProtocolUtil";
import { GenericSwapUtility, IExtendedPairData } from "./GenericSwapUtil";

export const VVS_FARMS = "0xdccd6455ae04b03d785f12196b492b18129564bc";

export const vvsPoolIds: PoolId = {
  "0xA111C17f8B8303280d3EB01BBcd61000AA7F39F9": 1,
};

export async function calculateVvsFarmsAPY(
  jar: JarDefinition,
  model: PickleModel,
) {
  const multicallProvider = model.multicallProviderFor(jar.chain);
  await multicallProvider.init();
  const poolId = vvsPoolIds[jar.depositToken.addr];
  const multicallVvsFarms = new MulticallContract(VVS_FARMS, vvsFarmsAbi);
  const lpToken = new MulticallContract(jar.depositToken.addr, erc20Abi);
  const [vvsPerBlockBN, totalAllocPointBN, poolInfo, totalSupplyBN] =
    await multicallProvider.all([
      multicallVvsFarms.vvsPerBlock(),
      multicallVvsFarms.totalAllocPoint(),
      multicallVvsFarms.poolInfo(poolId),
      lpToken.balanceOf(VVS_FARMS),
    ]);

  const rewardsPerBlock =
    (parseFloat(formatEther(vvsPerBlockBN)) * poolInfo.allocPoint.toNumber()) /
    totalAllocPointBN.toNumber();

  const rewardsPerYear =
    rewardsPerBlock *
    ((360 * 24 * 60 * 60) / Chains.get(jar.chain).secondsPerBlock);

  const totalSupply = parseFloat(formatEther(totalSupplyBN));

  const pricePerToken = await model.priceOf(jar.depositToken.addr);

  const vvsRewardedPerYear = (await model.priceOf("vvs")) * rewardsPerYear;
  const totalValueStaked = totalSupply * pricePerToken;
  const vvsAPY = vvsRewardedPerYear / totalValueStaked;
  return { name: "vvs", apr: vvsAPY * 100, compoundable: true };
}

const VVS_PAIR_CACHE_KEY = "vvsswap.pair.data.cache.key";

const VVS_QUERY_KEYS: string[] = [
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

export class VvsswapPairManager extends GenericSwapUtility {
  constructor() {
    super(
      VVS_PAIR_CACHE_KEY,
      "pairAddress",
      VVS_QUERY_KEYS,
      AssetProtocol.VVS_CRONOS,
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
