import { ChainNetwork, Chains } from "../chain/Chains";
import { PickleModel } from "../model/PickleModel";
import {
  AssetAprComponent,
  AssetProtocol,
  JarDefinition,
} from "../model/PickleModelJson";
import { GenericSwapUtility, IExtendedPairData } from "./GenericSwapUtil";
import gaugeAbi from "../Contracts/ABIs/gauge.json";
import erc20Abi from "../Contracts/ABIs/erc20.json";
import { Contract } from "ethers-multiprovider";
import { formatEther } from "ethers/lib/utils";
import {
  createAprComponentImpl,
  ONE_YEAR_IN_SECONDS,
} from "../behavior/AbstractJarBehavior";

const spiritGauge = {
  "0x30748322B6E34545DBe0788C421886AEB5297789":
    "0xEFe02cB895b6E061FA227de683C04F3Ce19f3A62", // FTM-SPIRIT
  "0x2cEfF1982591c8B0a73b36D2A6C2A6964Da0E869":
    "0x27829EAaB2972fD49eE753abFc67cC3EaC9c7397", // FTM-TREEB
  "0x51Eb93ECfEFFbB2f6fE6106c4491B5a0B944E8bd":
    "0x27Dc7cc7175F8Ac26dc7421a3a92DAcdc1a9EF0D", // FTM-MAI
  "0x4Fe6f19031239F105F753D1DF8A0d24857D0cAA2":
    "0x717BDE1AA46a0Fcd937af339f95361331412C74C", // FTM-LQDR
  "0x7ed0cdDB9BB6c6dfEa6fB63E117c8305479B8D7D":
    "0x805f756d7B2592637725a1b797088c29c9D6A1F8", // FTM-FRAX
  "0x2599Eba5fD1e49F294C76D034557948034d6C96E":
    "0x7a91957097e85bb933828d4cC7db287F573D0B2f", // FTM-DEUS
  "0x459e7c947E04d73687e786E4A48815005dFBd49A":
    "0xDcD990038d9CBe98B84a6aD9dBc880e3d4b06599", // FTM-CRE8R
  "0xc28cf9aeBfe1A07A27B3A4d722C841310e504Fe3":
    "0x356169Bea8c58C3B59e83C650A1608FC54D0c44A", // FTM-BIFI
  "0x8e38543d4c764DBd8f8b98C73407457a3D3b4999":
    "0x9d0f4A1165dDB957a855A6C64e4e4730272f0399", // GSCARAB-SCARAB
};

export async function calculateSpiritFarmsAPY(
  jar: JarDefinition,
  model: PickleModel,
): Promise<AssetAprComponent> {
  const gaugeAddr = spiritGauge[jar.depositToken.addr];
  const multicallGauge = new Contract(gaugeAddr, gaugeAbi);

  const multiProvider = model.multiproviderFor(jar.chain);
  const lpToken = new Contract(jar.depositToken.addr, erc20Abi);
  const pricePerToken = model.priceOfSync(jar.depositToken.addr, jar.chain);

  const [rewardRateBN, totalSupplyBN] = await multiProvider.all([
    multicallGauge.rewardRate(),
    lpToken.balanceOf(gaugeAddr),
  ]);

  // multiply the rewardRate by 0.4 for no boost
  const rewardsPerYear =
    parseFloat(formatEther(rewardRateBN)) * ONE_YEAR_IN_SECONDS * 0.4;

  const totalSupply = parseFloat(formatEther(totalSupplyBN));
  const spiritRewardedPerYear =
    (await model.priceOfSync("spirit", jar.chain)) * rewardsPerYear;
  const totalValueStaked = totalSupply * pricePerToken;
  const spiritAPY = spiritRewardedPerYear / totalValueStaked;

  return createAprComponentImpl(
    "spirit",
    spiritAPY * 100,
    true,
    1 - Chains.get(jar.chain).defaultPerformanceFee,
  );
}

const SPIRIT_CACHE_KEY = "spirit.pair.data.cache.key";

const SPIRIT_QUERY_KEYS: string[] = [
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

export class SpiritPairManager extends GenericSwapUtility {
  constructor() {
    super(
      SPIRIT_CACHE_KEY,
      "pairAddress",
      SPIRIT_QUERY_KEYS,
      AssetProtocol.SPIRITSWAP,
      ChainNetwork.Fantom,
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
