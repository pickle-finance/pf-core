import { AssetProtocol, JarDefinition } from "../model/PickleModelJson";
import erc20Abi from "../Contracts/ABIs/erc20.json";
import triFarmsAbi from "../Contracts/ABIs/tri-farms.json";
import { PickleModel } from "../model/PickleModel";
import { Contract as MulticallContract } from "ethers-multicall";
import { Chains } from "../chain/Chains";
import { formatEther } from "ethers/lib/utils";
import { PoolId } from "./ProtocolUtil";
import { GenericSwapUtility, IExtendedPairData } from "./GenericSwapUtil";

export const TRI_FARMS = "0x1f1Ed214bef5E83D8f5d0eB5D7011EB965D0D79B";

export const triPoolIds: PoolId = {
  "0x20F8AeFB5697B77E0BB835A8518BE70775cdA1b0": 1,
  "0x63da4DB6Ef4e7C62168aB03982399F9588fCd198": 0,
  "0x03B666f3488a7992b2385B12dF7f35156d7b29cD": 2,
  "0x84b123875F0F36B966d0B6Ca14b31121bd9676AD": 5,
  "0x2fe064B6c7D274082aa5d2624709bC9AE7D16C77": 3,
};

export async function calculateTriFarmsAPY(
  jar: JarDefinition,
  model: PickleModel,
) {
  const multicallProvider = model.multicallProviderFor(jar.chain);
  await multicallProvider.init();
  const poolId = triPoolIds[jar.depositToken.addr];
  const multicallTriFarms = new MulticallContract(TRI_FARMS, triFarmsAbi);
  const lpToken = new MulticallContract(jar.depositToken.addr, erc20Abi);
  const [triPerBlockBN, totalAllocPointBN, poolInfo, totalSupplyBN] =
    await multicallProvider.all([
      multicallTriFarms.triPerBlock(),
      multicallTriFarms.totalAllocPoint(),
      multicallTriFarms.poolInfo(poolId),
      lpToken.balanceOf(TRI_FARMS),
    ]);

  const rewardsPerBlock =
    (parseFloat(formatEther(triPerBlockBN)) * poolInfo.allocPoint.toNumber()) /
    totalAllocPointBN.toNumber();
  const rewardsPerYear =
    rewardsPerBlock *
    ((360 * 24 * 60 * 60) / Chains.get(jar.chain).secondsPerBlock);

  const totalSupply = parseFloat(formatEther(totalSupplyBN));

  const pricePerToken = await model.priceOf(jar.depositToken.addr);

  const triRewardedPerYear = (await model.priceOf("tri")) * rewardsPerYear;
  const totalValueStaked = totalSupply * pricePerToken;
  const triAPY = triRewardedPerYear / totalValueStaked;

  return { name: "tri", apr: triAPY * 100, compoundable: true };
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
