import { sushiStrategyAbi } from "../../Contracts/ABIs/sushi-strategy.abi";
import { PickleModel } from "../..";
import {
  JarDefinition,
  AssetProjectedApr,
  AssetAprComponent,
} from "../../model/PickleModelJson";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import hadesFarmAbi from "../../Contracts/ABIs/hades-chef.json";
import {
  AbstractJarBehavior,
  createAprComponentImpl,
  ONE_YEAR_IN_SECONDS,
} from "../AbstractJarBehavior";
import { Contract } from "ethers-multiprovider";
import { TethysPairManager } from "../../protocols/TethysUtil";
import { formatEther } from "ethers/lib/utils";

const HADES_FARM = "0xcd66208ac05f75069C0f3a345ADf438FB3B53C1A";
const hadesPoolIds = {
  "0x586f616Bb811F1b0dFa953FBF6DE3569e7919752": 1,
  "0xCD1cc85DC7b4Deef34247CCB5d7C42A58039b1bA": 0,
};

export class HadesJar extends AbstractJarBehavior {
  protected strategyAbi: any;

  constructor() {
    super();
    this.strategyAbi = sushiStrategyAbi;
  }

  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    return this.getHarvestableUSDDefaultImplementation(
      jar,
      model,
      ["hellshare"],
      this.strategyAbi,
    );
  }

  async getProjectedAprStats(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const lp = await new TethysPairManager().calculateLpApr(
      model,
      jar.depositToken.addr,
    );
    return this.aprComponentsToProjectedApr([
      await this.calculateHadesFarmAPY(jar, model),
      this.createAprComponent("lp", lp, false),
    ]);
  }

  async calculateHadesFarmAPY(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<AssetAprComponent> {
    const pricePerToken = model.priceOfSync(jar.depositToken.addr, jar.chain);

    const poolId = hadesPoolIds[jar.depositToken.addr];
    const multiProvider = model.multiproviderFor(jar.chain);
    const multicallHadesFarms = new Contract(HADES_FARM, hadesFarmAbi);
    const lpToken = new Contract(jar.depositToken.addr, erc20Abi);

    const [hadesPerSecBn, totalAllocPointBN, poolInfo, totalSupplyBN] =
      await multiProvider.all([
        multicallHadesFarms.tSharePerSecond(),
        multicallHadesFarms.totalAllocPoint(),
        multicallHadesFarms.poolInfo(poolId),
        lpToken.balanceOf(HADES_FARM),
      ]);

    const rewardsPerYear =
      (parseFloat(formatEther(hadesPerSecBn)) *
        poolInfo.allocPoint.toNumber() *
        ONE_YEAR_IN_SECONDS) /
      totalAllocPointBN.toNumber();

    const totalSupply = parseFloat(formatEther(totalSupplyBN));
    const hadesRewardedPerYear =
      model.priceOfSync("hellshare", jar.chain) * rewardsPerYear;
    const totalValueStaked = totalSupply * pricePerToken;
    const hadesAPY = hadesRewardedPerYear / totalValueStaked;

    return createAprComponentImpl("hellshare", hadesAPY * 100, true, 0.9);
  }
}
