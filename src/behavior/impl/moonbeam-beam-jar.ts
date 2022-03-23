import { sushiStrategyAbi } from "../../Contracts/ABIs/sushi-strategy.abi";
import {
  AssetProjectedApr,
  AssetProtocol,
  JarDefinition,
} from "../../model/PickleModelJson";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import beamFarmsAbi from "../../Contracts/ABIs/beam-farms.json";
import { Contract as MultiContract } from "ethers-multicall";
import {
  AbstractJarBehavior,
  ONE_YEAR_IN_SECONDS,
} from "../AbstractJarBehavior";
import { PickleModel } from "../../model/PickleModel";
import { PoolId } from "../../protocols/ProtocolUtil";
import { formatEther } from "ethers/lib/utils";
import { ChainNetwork } from "../..";
import {
  GenericSwapUtility,
  IExtendedPairData,
} from "../../protocols/GenericSwapUtil";

const BEAM_FARMS = "0xC6ca172FC8BDB803c5e12731109744fb0200587b";

const beamPoolIds: PoolId = {
  "0x99588867e817023162F4d4829995299054a5fC57": 0,
  "0xb929914B89584b4081C7966AC6287636F7EfD053": 1,
  "0xa0799832FB2b9F18Acf44B92FbbEDCfD6442DD5e": 2,
  "0x34A1F4AB3548A92C6B32cd778Eed310FcD9A340D": 3,
  "0x6BA3071760d46040FB4dc7B627C9f68efAca3000": 4,
  "0xfC422EB0A2C7a99bAd330377497FD9798c9B1001": 6,
  "0xA35B2c07Cb123EA5E1B9c7530d0812e7e03eC3c1": 7,
};

export abstract class MoonbeamBeamJar extends AbstractJarBehavior {
  strategyAbi: any;
  constructor() {
    super();
    this.strategyAbi = sushiStrategyAbi;
  }
  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    return this.getHarvestableUSDCommsMgrImplementation(
      jar,
      model,
      ["glint"],
      this.strategyAbi,
    );
  }

  async getProjectedAprStats(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const beamApr: number = await this.calculateBeamFarmsAPY(jar, model);
    const lp = await new BeamswapPairManager().calculateLpApr(
      model,
      jar.depositToken.addr,
    );

    return this.aprComponentsToProjectedApr([
      this.createAprComponent("glint", beamApr, true),
      this.createAprComponent("lp", lp, false),
    ]);
  }

  async calculateBeamFarmsAPY(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    const pricePerToken = model.priceOfSync(jar.depositToken.addr, jar.chain);
    const poolId = beamPoolIds[jar.depositToken.addr];
    const multicallBeamFarms = new MultiContract(BEAM_FARMS, beamFarmsAbi);
    const lpToken = new MultiContract(jar.depositToken.addr, erc20Abi);

    const [beamPerSecBN, totalSupplyBN] = await model.callMulti(
      [
        () => multicallBeamFarms.poolRewardsPerSec(poolId),
        () => lpToken.balanceOf(BEAM_FARMS),
      ],
      jar.chain,
    );

    const rewardsPerYear =
      parseFloat(formatEther(beamPerSecBN.rewardsPerSec[0])) *
      ONE_YEAR_IN_SECONDS;

    const totalSupply = parseFloat(formatEther(totalSupplyBN));
    const beamRewardedPerYear =
      model.priceOfSync("glint", jar.chain) * rewardsPerYear;
    const totalValueStaked = totalSupply * pricePerToken;
    const beamAPY = beamRewardedPerYear / totalValueStaked;

    return beamAPY * 100;
  }
}

const BEAM_CACHE_KEY = "beam.pair.data.cache.key";

const BEAM_QUERY_KEYS: string[] = [
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

export class BeamswapPairManager extends GenericSwapUtility {
  constructor() {
    super(
      BEAM_CACHE_KEY,
      "pairAddress",
      BEAM_QUERY_KEYS,
      AssetProtocol.BEAM,
      ChainNetwork.Moonbeam,
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
