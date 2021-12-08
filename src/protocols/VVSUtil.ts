import { AssetProtocol, JarDefinition } from "../model/PickleModelJson";
import erc20Abi from "../Contracts/ABIs/erc20.json";
import vvsFarmsAbi from "../Contracts/ABIs/vvs-farms.json";
import { PickleModel } from "../model/PickleModel";
import { Contract as MulticallContract } from "ethers-multicall";
import { Chains } from "../chain/Chains";
import { formatEther } from "ethers/lib/utils";
import { PoolId } from "./ProtocolUtil";

export const VVS_FARMS = "0xf03b75831397D4695a6b9dDdEEA0E578faa30907";
export const vvsPoolIds: PoolId = {
  "0xA111C17f8B8303280d3EB01BBcd61000AA7F39F9": 1,
  "0x8F09fFf247B8fDB80461E5Cf5E82dD1aE2EBd6d7": 2,
  "0xe61Db569E231B3f5530168Aa2C9D50246525b6d6": 3,
  "0xbf62c67eA509E86F07c8c69d0286C0636C50270b": 4,
  "0x814920D1b8007207db6cB5a2dD92bF0b082BDBa1": 5,
  "0x39cC0E14795A8e6e9D02A21091b81FE0d61D82f9": 6,
  "0x280aCAD550B2d3Ba63C8cbff51b503Ea41a1c61B": 7,
  "0xc9eA98736dbC94FAA91AbF9F4aD1eb41e7fb40f4": 8,
  "0x3d2180DB9E1B909f35C398BC39EF36108C0FC8c3": 9,
  "0x3Eb9FF92e19b73235A393000C176c8bb150F1B20": 10,
  "0x1803E360393A472beC6E1A688BDF7048d3076b1A": 11,
};

export async function calculateVVSFarmsAPY(
  jar: JarDefinition,
  model: PickleModel,
) {
  const multicallProvider = model.multicallProviderFor(jar.chain);
  await multicallProvider.init();
  const multicallVVSFarms = new MulticallContract(VVS_FARMS, vvsFarmsAbi);
  const lpToken = new MulticallContract(jar.depositToken.addr, erc20Abi);
  const [vvsPerBlockBN, totalAllocPointBN, poolInfo, totalSupplyBN] =
    await multicallProvider.all([
      multicallVVSFarms.vvsPerBlock(),
      multicallVVSFarms.totalAllocPoint(),
      multicallVVSFarms.poolInfo(vvsPoolIds[jar.depositToken.addr]),
      lpToken.balanceOf(VVS_FARMS),
    ]);

  const totalSupply = parseFloat(formatEther(totalSupplyBN));
  const rewardsPerBlock =
    (parseFloat(formatEther(vvsPerBlockBN)) *
      0.9 *
      poolInfo.allocPoint.toNumber()) /
    totalAllocPointBN.toNumber();

  const pricePerToken = await model.priceOf(jar.depositToken.addr);

  const rewardsPerYear =
    rewardsPerBlock *
    ((360 * 24 * 60 * 60) / Chains.get(jar.chain).secondsPerBlock);
  const vvsRewardedPerYear = (await model.priceOf("vvs")) * rewardsPerYear;
  const totalValueStaked = totalSupply * pricePerToken;
  const vvsAPY = vvsRewardedPerYear / totalValueStaked;
  return { name: "vvs", apr: vvsAPY * 100, compoundable: true };
}

import { GenericSwapUtility, IExtendedPairData } from "./GenericSwapUtil";

const VVSSWAP_PAIR_CACHE_KEY = "vvsswap.pair.data.cache.key";

const VVSSWAP_QUERY_KEYS: string[] = [
  "pairAddress",
  "reserveUSD",
  "dailyVolumeUSD",
  "reserve0",
  "reserve1",
  "token0{id}",
  "token1{id}",
  "totalSupply",
];
export class VVSswapPairManager extends GenericSwapUtility {
  constructor() {
    super(
      VVSSWAP_PAIR_CACHE_KEY,
      "pairAddress",
      VVSSWAP_QUERY_KEYS,
      AssetProtocol.VVSSWAP,
      0.005,
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
