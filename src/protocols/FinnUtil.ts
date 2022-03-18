import { AssetProtocol, JarDefinition } from "../model/PickleModelJson";
import erc20Abi from "../Contracts/ABIs/erc20.json";
import finnFarmsAbi from "../Contracts/ABIs/finn-farms.json";
import { PickleModel } from "../model/PickleModel";
import { Contract as MulticallContract } from "ethers-multicall";
import { ChainNetwork } from "../chain/Chains";
import { formatEther } from "ethers/lib/utils";
import { PoolId } from "./ProtocolUtil";
import { GenericSwapUtility, IExtendedPairData } from "./GenericSwapUtil";
import { ONE_YEAR_IN_SECONDS } from "../behavior/AbstractJarBehavior";

export const FINN_FARMS = "0x1f4b7660b6AdC3943b5038e3426B33c1c0e343E6";

export const finnPoolIds: PoolId = {
  "0xbBe2f34367972Cb37ae8dea849aE168834440685": 4,
  "0xF09211fb5eD5019b072774cfD7Db0c9f4ccd5Be0": 7,
  "0x7128C61Da34c27eAD5419B8EB50c71CE0B15CD50": 28,
  "0x14BE4d09c5A8237403b83A8A410bAcE16E8667DC": 30,
  "0xd9e98aD7AE9E5612b90cd0bdcD82df4FA5b943b8": 31,
};

export async function calculateFinnFarmsAPY(
  jar: JarDefinition,
  model: PickleModel,
) {
  const multicallProvider = model.multicallProviderFor(jar.chain);
  await multicallProvider.init();
  const poolId = finnPoolIds[jar.depositToken.addr];
  const multicallFinnFarms = new MulticallContract(FINN_FARMS, finnFarmsAbi);
  const lpToken = new MulticallContract(jar.depositToken.addr, erc20Abi);
  const [finnPerSecBN, totalAllocPointBN, poolInfo, totalSupplyBN] =
    await multicallProvider.all([
      multicallFinnFarms.finnPerSecond(),
      multicallFinnFarms.totalAllocPoint(),
      multicallFinnFarms.poolInfo(poolId),
      lpToken.balanceOf(FINN_FARMS),
    ]);

  const rewardsPerSec =
    (parseFloat(formatEther(finnPerSecBN)) * poolInfo.allocPoint.toNumber()) /
    totalAllocPointBN.toNumber();

  const rewardsPerYear = rewardsPerSec * ONE_YEAR_IN_SECONDS;

  const totalSupply = parseFloat(formatEther(totalSupplyBN));

  const pricePerToken = model.priceOfSync(jar.depositToken.addr, jar.chain);

  const finnRewardedPerYear =
    model.priceOfSync("finn", jar.chain) * rewardsPerYear;
  const totalValueStaked = totalSupply * pricePerToken;
  const finnAPY = finnRewardedPerYear / totalValueStaked;
  return { name: "finn", apr: finnAPY * 100, compoundable: true };
}

const FINN_PAIR_CACHE_KEY = "finn.pair.data.cache.key";

const FINN_QUERY_KEYS: string[] = [
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
export class FinnPairManager extends GenericSwapUtility {
  constructor() {
    super(
      FINN_PAIR_CACHE_KEY,
      "pairAddress",
      FINN_QUERY_KEYS,
      AssetProtocol.FINN,
      ChainNetwork.Moonriver,
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
