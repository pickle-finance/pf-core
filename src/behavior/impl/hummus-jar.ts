import { Contract } from "ethers-multiprovider";
import { PickleModel } from "../..";
import { JarDefinition, AssetProjectedApr } from "../../model/PickleModelJson";
import strategyAbi from "../../Contracts/ABIs/strategy.json";
import hummuschefAbi from "../../Contracts/ABIs/hummus-chef.json";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import {
  AbstractJarBehavior,
  ONE_YEAR_IN_SECONDS,
} from "../AbstractJarBehavior";
import { Chains } from "../../chain/Chains";
import { formatEther, formatUnits } from "ethers/lib/utils";

const HUM_REWARDS = "0x9cadd693cDb2B118F00252Bb3be4C6Df6A74d42C";

export class HummusJar extends AbstractJarBehavior {
  protected strategyAbi: any;

  async getDepositTokenPrice(
    _jar: JarDefinition,
    _model: PickleModel,
  ): Promise<number> {
    // pool tokens are nearly 1:1 with USDT/USDC/DAI, so assuming 1
    return 1;
  }

  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    return this.getHarvestableUSDDefaultImplementation(
      jar,
      model,
      ["hum"],
      strategyAbi,
    );
  }

  async getProjectedAprStats(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const pricePerToken = model.priceOfSync(jar.depositToken.addr, jar.chain);

    const multiProvider = model.multiproviderFor(jar.chain);
    const humchefMC = new Contract(HUM_REWARDS, hummuschefAbi);
    const strategyMC = new Contract(jar.details.strategyAddr, strategyAbi);
    const lpToken = new Contract(jar.depositToken.addr, erc20Abi);

    const [poolId] = await multiProvider.all([strategyMC._poolId()]);

    const [
      humPerSecBn,
      totalAllocPointBN,
      poolInfo,
      baseRewardsFactor,
      totalSupplyBN,
      decimals,
    ] = await multiProvider.all([
      humchefMC.humPerSec(),
      humchefMC.totalAdjustedAllocPoint(),
      humchefMC.poolInfo(poolId),
      humchefMC.dialutingRepartition(),
      lpToken.balanceOf(HUM_REWARDS),
      lpToken.decimals(),
    ]);

    // Factor given to farmers vs ve lockers
    const factor = baseRewardsFactor.toNumber() / 1000;

    const rewardsPerYear =
      (parseFloat(formatEther(humPerSecBn)) *
        parseFloat(formatEther(poolInfo.adjustedAllocPoint)) *
        ONE_YEAR_IN_SECONDS *
        factor) /
      parseFloat(formatEther(totalAllocPointBN));
    const totalSupply = parseFloat(formatUnits(totalSupplyBN, decimals));

    const humRewardedPerYear =
      model.priceOfSync("hum", jar.chain) * rewardsPerYear;
    const totalValueStaked = totalSupply * pricePerToken;
    const humApy = humRewardedPerYear / totalValueStaked;

    return this.aprComponentsToProjectedApr([
      this.createAprComponent(
        "hum",
        humApy * 100,
        true,
        1 - Chains.get(jar.chain).defaultPerformanceFee,
      ),
    ]);
  }
}
