import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import { sushiStrategyAbi } from "../../Contracts/ABIs/sushi-strategy.abi";
import { AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import flareFarmsAbi from "../../Contracts/ABIs/flare-farms.json";
import { Contract as MulticallContract } from "ethers-multicall";
import {
  AbstractJarBehavior,
  ONE_YEAR_IN_SECONDS,
} from "../AbstractJarBehavior";
import { PickleModel } from "../../model/PickleModel";
import { PoolId } from "../../protocols/ProtocolUtil";
import { formatEther } from "ethers/lib/utils";
import { Chains } from "../..";

const FLARE_FARMS = "0x995da7dfB96B4dd1e2bd954bE384A1e66cBB4b8c";

const flarePoolIds: PoolId = {
  "0x26A2abD79583155EA5d34443b62399879D42748A": 0,
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
    resolver: Signer | Provider,
  ): Promise<number> {
    return this.getHarvestableUSDDefaultImplementation(
      jar,
      model,
      resolver,
      ["flare"],
      this.strategyAbi,
    );
  }

  async getProjectedAprStats(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const flareApr: number = await this.calculateFlareFarmsAPY(jar, model);

    return this.aprComponentsToProjectedApr([
      this.createAprComponent("flare", flareApr, true),
    ]);
  }

  async calculateFlareFarmsAPY(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    const pricePerToken = await model.priceOf(jar.depositToken.addr);
    const multicallProvider = model.multicallProviderFor(jar.chain);
    await multicallProvider.init();
    const poolId = flarePoolIds[jar.depositToken.addr];
    const multicallFlareFarms = new MulticallContract(
      FLARE_FARMS,
      flareFarmsAbi,
    );
    const lpToken = new MulticallContract(jar.depositToken.addr, erc20Abi);

    const [flarePerSecBn, totalAllocPointBN, poolInfo, totalSupplyBN] =
      await multicallProvider.all([
        multicallFlareFarms.flarePerBlock(),
        multicallFlareFarms.totalAllocPoint(),
        multicallFlareFarms.poolInfo(poolId),
        lpToken.balanceOf(FLARE_FARMS),
      ]);

    const rewardsPerYear =
      (parseFloat(formatEther(flarePerSecBn)) *
        poolInfo.allocPoint.toNumber() *
        ONE_YEAR_IN_SECONDS) /
      totalAllocPointBN.toNumber();

    const totalSupply = parseFloat(formatEther(totalSupplyBN));
    const flareRewardedPerYear =
      (await model.priceOf("flare")) * rewardsPerYear;
    const totalValueStaked = totalSupply * pricePerToken;
    const flareAPY = flareRewardedPerYear / totalValueStaked;

    return flareAPY * 100;
  }
}
