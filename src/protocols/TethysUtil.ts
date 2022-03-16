import {
  AssetAprComponent,
  AssetProtocol,
  JarDefinition,
} from "../model/PickleModelJson";
import erc20Abi from "../Contracts/ABIs/erc20.json";
import tethysChefAbi from "../Contracts/ABIs/tethys.json";
import { PickleModel } from "../model/PickleModel";
import { Contract as MulticallContract } from "ethers-multicall";
import { ChainNetwork } from "../chain/Chains";
import { formatEther } from "ethers/lib/utils";
import { PoolId } from "./ProtocolUtil";
import { GenericSwapUtility, IExtendedPairData } from "./GenericSwapUtil";
import {
  createAprComponentImpl,
  ONE_YEAR_IN_SECONDS,
} from "../behavior/AbstractJarBehavior";

export const TETHYS_FARMS = "0x54A8fB8c634dED694D270b78Cb931cA6bF241E21";

export const tethysPoolIds: PoolId = {
  "0xc9b290FF37fA53272e9D71A0B13a444010aF4497": 0,
  "0x8121113eB9952086deC3113690Af0538BB5506fd": 1,
  "0xDd7dF3522a49e6e1127bf1A1d3bAEa3bc100583B": 2,
  "0xEE5adB5b0DfC51029Aca5Ad4Bc684Ad676b307F7": 3,
  "0xA0081C6D591c53Ae651bD71B8d90C83C1F1106C2": 6,
};

export async function calculateTethysFarmsAPY(
  jar: JarDefinition,
  model: PickleModel,
): Promise<AssetAprComponent> {
  const multicallProvider = model.multicallProviderFor(jar.chain);
  await multicallProvider.init();

  const pricePerToken = model.priceOfSync(jar.depositToken.addr, jar.chain);

  const poolId = tethysPoolIds[jar.depositToken.addr];
  const multicallTethysFarms = new MulticallContract(
    TETHYS_FARMS,
    tethysChefAbi,
  );
  const lpToken = new MulticallContract(jar.depositToken.addr, erc20Abi);

  const [tethysPerSecBn, totalAllocPointBN, poolInfo, totalSupplyBN] =
    await multicallProvider.all([
      multicallTethysFarms.tethysPerSecond(),
      multicallTethysFarms.totalAllocPoint(),
      multicallTethysFarms.poolInfo(poolId),
      lpToken.balanceOf(TETHYS_FARMS),
    ]);

  const rewardsPerYear =
    (parseFloat(formatEther(tethysPerSecBn)) *
      poolInfo.allocPoint.toNumber() *
      ONE_YEAR_IN_SECONDS) /
    totalAllocPointBN.toNumber();

  const totalSupply = parseFloat(formatEther(totalSupplyBN));
  const tethysRewardedPerYear =
    model.priceOfSync("tethys", jar.chain) * rewardsPerYear;
  const totalValueStaked = totalSupply * pricePerToken;
  const tethysAPY = tethysRewardedPerYear / totalValueStaked;

  return createAprComponentImpl("tethys", tethysAPY * 100, true, 0.9);
}

const TETHYS_CACHE_KEY = "tethys.pair.data.cache.key";

const TETHYS_QUERY_KEYS: string[] = [
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

export class TethysPairManager extends GenericSwapUtility {
  constructor() {
    super(
      TETHYS_CACHE_KEY,
      "pairAddress",
      TETHYS_QUERY_KEYS,
      AssetProtocol.TETHYS,
      ChainNetwork.Metis,
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
