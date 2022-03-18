import { AssetProtocol, JarDefinition } from "../model/PickleModelJson";
import erc20Abi from "../Contracts/ABIs/erc20.json";
import vvsFarmsAbi from "../Contracts/ABIs/vvs-farms.json";
import { PickleModel } from "../model/PickleModel";
import { Contract as MulticallContract } from "ethers-multicall";
import { ChainNetwork, Chains } from "../chain/Chains";
import { formatEther } from "ethers/lib/utils";
import { PoolId } from "./ProtocolUtil";
import { GenericSwapUtility, IExtendedPairData } from "./GenericSwapUtil";

export const VVS_FARMS = "0xdccd6455ae04b03d785f12196b492b18129564bc";

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
  "0x2A560f2312CB56327AD5D65a03F1bfEC10b62075": 12, // VVS CRO/DOGE
  "0x9e5bd780dff875Dd85848a65549791445AE25De0": 13, // VVS CRO/ATOM
  "0x4B377121d968Bf7a62D51B96523d59506e7c2BF0": 16, // VVS CRO/TONIC
  "0x6f72a3f6dB6F486B50217f6e721f4388994B1FBe": 17, // VVS VVS/SINGLE
  "0x0fBAB8A90CAC61b481530AAd3a64fE17B322C25d": 18, // VVS USDC/SINGLE
  "0xA922530960A1F94828A7E132EC1BA95717ED1eab": 19, // VVS VVS/TONIC
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

  const pricePerToken = model.priceOfSync(jar.depositToken.addr, jar.chain);

  const vvsRewardedPerYear =
    model.priceOfSync("vvs", jar.chain) * rewardsPerYear;
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
      AssetProtocol.VVS,
      ChainNetwork.Cronos,
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
