import { sushiStrategyAbi } from "../../Contracts/ABIs/sushi-strategy.abi";
import {
  AssetProjectedApr,
  AssetProtocol,
  JarDefinition,
} from "../../model/PickleModelJson";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import flareFarmsAbi from "../../Contracts/ABIs/flare-farms.json";
import { Contract as MultiContract } from "ethers-multicall";
import {
  AbstractJarBehavior,
  oneRewardSubtotal,
  ONE_YEAR_IN_SECONDS,
} from "../AbstractJarBehavior";
import { PickleModel } from "../../model/PickleModel";
import { PoolId } from "../../protocols/ProtocolUtil";
import { formatEther } from "ethers/lib/utils";
import {
  GenericSwapUtility,
  IExtendedPairData,
} from "../../protocols/GenericSwapUtil";
import { ChainNetwork } from "../..";

const FLARE_FARMS = "0x995da7dfB96B4dd1e2bd954bE384A1e66cBB4b8c";

const flarePoolIds: PoolId = {
  "0x26A2abD79583155EA5d34443b62399879D42748A": 0,
  "0xAb89eD43D10c7CE0f4D6F21616556AeCb71b9c5f": 1,
  "0xb521C0aCf67390C1364f1e940e44dB25828E5Ef9": 7,
  "0xa65949fa1053903fcc019ac21b0335aa4b4b1bfa": 9,
  "0x976888647affb4b2d7Ac1952cB12ca048cD67762": 12,
  "0xDF74D67a4Fe29d9D5e0bfAaB3516c65b21a5d7cf": 14,
};

export class MoonbeamFlareJar extends AbstractJarBehavior {
  strategyAbi: any;
  constructor() {
    super();
    this.strategyAbi = sushiStrategyAbi;
  }
  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    const poolId = flarePoolIds[jar.depositToken.addr];

    const multicallFlareFarms = new MultiContract(FLARE_FARMS, flareFarmsAbi);

    const mcFlareToken = new MultiContract(
      model.address("flare", jar.chain),
      erc20Abi,
    );

    const [pendingObj, walletFlare] = await model.callMulti(
      [
        () =>
          multicallFlareFarms.pendingTokens(poolId, jar.details.strategyAddr),
        () => mcFlareToken.balanceOf(jar.details.strategyAddr),
      ],
      jar.chain,
    );

    const harvestableUSD = oneRewardSubtotal(
      pendingObj.amounts[0],
      walletFlare,
      model.priceOfSync("flare", jar.chain),
      model.tokenDecimals("flare", jar.chain),
    );

    return harvestableUSD;
  }

  async getProjectedAprStats(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const flareApr: number = await this.calculateFlareFarmsAPY(jar, model);
    const lp = await new FlarePairManager().calculateLpApr(
      model,
      jar.depositToken.addr,
    );

    return this.aprComponentsToProjectedApr([
      this.createAprComponent("flare", flareApr, true),
      this.createAprComponent("lp", lp, false),
    ]);
  }

  async calculateFlareFarmsAPY(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    const pricePerToken = model.priceOfSync(jar.depositToken.addr, jar.chain);
    const poolId = flarePoolIds[jar.depositToken.addr];
    const multicallFlareFarms = new MultiContract(FLARE_FARMS, flareFarmsAbi);
    const lpToken = new MultiContract(jar.depositToken.addr, erc20Abi);

    const [flarePerSecBn, totalAllocPointBN, poolInfo, totalSupplyBN] =
      await model.callMulti(
        [
          () => multicallFlareFarms.flarePerSec(),
          () => multicallFlareFarms.totalAllocPoint(),
          () => multicallFlareFarms.poolInfo(poolId),
          () => lpToken.balanceOf(FLARE_FARMS),
        ],
        jar.chain,
      );

    const rewardsPerYear =
      (parseFloat(formatEther(flarePerSecBn)) *
        poolInfo.allocPoint.toNumber() *
        ONE_YEAR_IN_SECONDS) /
      totalAllocPointBN.toNumber();

    const totalSupply = parseFloat(formatEther(totalSupplyBN));
    const flareRewardedPerYear =
      model.priceOfSync("flare", jar.chain) * rewardsPerYear;
    const totalValueStaked = totalSupply * pricePerToken;
    const flareAPY = flareRewardedPerYear / totalValueStaked;

    return flareAPY * 100;
  }
}

const FLARE_CACHE_KEY = "flare.pair.data.cache.key";

const FLARE_QUERY_KEYS: string[] = [
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

export class FlarePairManager extends GenericSwapUtility {
  constructor() {
    super(
      FLARE_CACHE_KEY,
      "pairAddress",
      FLARE_QUERY_KEYS,
      AssetProtocol.FLARE,
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
