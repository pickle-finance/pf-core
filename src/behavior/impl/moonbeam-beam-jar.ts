import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import { sushiStrategyAbi } from "../../Contracts/ABIs/sushi-strategy.abi";
import { AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import beamFarmsAbi from "../../Contracts/ABIs/beam-farms.json";
import { Contract as MulticallContract } from "ethers-multicall";
import {
  AbstractJarBehavior,
  ONE_YEAR_IN_SECONDS,
} from "../AbstractJarBehavior";
import { PickleModel } from "../../model/PickleModel";
import { PoolId } from "../../protocols/ProtocolUtil";
import { formatEther } from "ethers/lib/utils";
import { Chains } from "../..";

const BEAM_FARMS = "0xC6ca172FC8BDB803c5e12731109744fb0200587b";

const beamPoolIds: PoolId = {
  "0x99588867e817023162F4d4829995299054a5fC57": 0,
  "0xb929914B89584b4081C7966AC6287636F7EfD053": 1,
  "0xa0799832FB2b9F18Acf44B92FbbEDCfD6442DD5e": 2,
  "0x34A1F4AB3548A92C6B32cd778Eed310FcD9A340D": 3,
  "0x6BA3071760d46040FB4dc7B627C9f68efAca3000": 4,
  "0xfC422EB0A2C7a99bAd330377497FD9798c9B1001": 6,
  "0xA35B2c07Cb123EA5E1B9c7530d0812e7e03eC3c1": 7
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
    resolver: Signer | Provider,
  ): Promise<number> {
    return this.getHarvestableUSDDefaultImplementation(
      jar,
      model,
      resolver,
      ["beam"],
      this.strategyAbi,
    );
  }

  async getProjectedAprStats(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const beamApr: number = await this.calculateBeamFarmsAPY(jar, model);

    return this.aprComponentsToProjectedApr([
      this.createAprComponent("beam", beamApr, true),
    ]);
  }

  async calculateBeamFarmsAPY(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    const pricePerToken = await model.priceOf(jar.depositToken.addr);
    const multicallProvider = model.multicallProviderFor(jar.chain);
    await multicallProvider.init();
    const poolId = beamPoolIds[jar.depositToken.addr];
    const multicallBeamFarms = new MulticallContract(
      BEAM_FARMS,
      beamFarmsAbi,
    );
    const lpToken = new MulticallContract(jar.depositToken.addr, erc20Abi);

    const [beamPerBlockBn, totalAllocPointBN, poolInfo, totalSupplyBN] =
      await multicallProvider.all([
        multicallBeamFarms.beamPerBlock(),
        multicallBeamFarms.totalAllocPoint(),
        multicallBeamFarms.poolInfo(poolId),
        lpToken.balanceOf(BEAM_FARMS),
      ]);

    const rewardsPerYear =
      (parseFloat(formatEther(beamPerBlockBn)) *
        poolInfo.allocPoint.toNumber() *
        ONE_YEAR_IN_SECONDS) /
      (totalAllocPointBN.toNumber() * Chains.get(jar.chain).secondsPerBlock);

    const totalSupply = parseFloat(formatEther(totalSupplyBN));
    const beamRewardedPerYear =
      (await model.priceOf("beam")) * rewardsPerYear;
    const totalValueStaked = totalSupply * pricePerToken;
    const beamAPY = beamRewardedPerYear / totalValueStaked;

    return beamAPY * 100;
  }
}
