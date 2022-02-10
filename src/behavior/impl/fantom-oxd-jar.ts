import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import { Chains, PickleModel } from "../..";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import { JarDefinition, AssetProjectedApr } from "../../model/PickleModelJson";
import { Contract as MulticallContract } from "ethers-multicall";
import strategyABI from "../../Contracts/ABIs/strategy.json";
import oxdFarmsAbi from "../../Contracts/ABIs/oxd-farm.json";
import {
  AbstractJarBehavior,
  ONE_YEAR_IN_SECONDS,
} from "../AbstractJarBehavior";
import { PoolId } from "../../protocols/ProtocolUtil";
import { formatEther } from "ethers/lib/utils";

const OXD_FARMS = "0xa7821C3e9fC1bF961e280510c471031120716c3d";

const poolIds: PoolId = {
  "0xD5fa400a24EB2EA55BC5Bd29c989E70fbC626FfF": 0,
};

export class OxdJar extends AbstractJarBehavior {
  protected strategyAbi: any;

  constructor() {
    super();
    this.strategyAbi = strategyABI;
  }

  async getDepositTokenPrice(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    return super.getDepositTokenPrice(definition, model);
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
      ["oxd"],
      this.strategyAbi,
    );
  }

  async getProjectedAprStats(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const pricePerToken = await model.priceOf(jar.depositToken.addr);
    const multicallProvider = model.multicallProviderFor(jar.chain);
    await multicallProvider.init();
    const poolId = poolIds[jar.depositToken.addr];

    const multicallFarms = new MulticallContract(OXD_FARMS, oxdFarmsAbi);
    const lpToken = new MulticallContract(jar.depositToken.addr, erc20Abi);

    const [oxdPerSecondBN, totalAllocPointBN, poolInfo, totalSupplyBN] =
      await multicallProvider.all([
        multicallFarms.oxdPerSecond(),
        multicallFarms.totalAllocPoint(),
        multicallFarms.poolInfo(poolId),
        lpToken.balanceOf(OXD_FARMS),
      ]);
    const rewardsPerYear =
      (parseFloat(formatEther(oxdPerSecondBN.rewardsPerSec[0])) *
        ONE_YEAR_IN_SECONDS *
        poolInfo.allocPoint.toNumber()) /
      totalAllocPointBN.toNumber();

    const totalSupply = parseFloat(formatEther(totalSupplyBN));
    const oxdRewardedPerYear = (await model.priceOf("oxd")) * rewardsPerYear;
    const totalValueStaked = totalSupply * pricePerToken;
    const oxdAPY = oxdRewardedPerYear / totalValueStaked;

    return this.aprComponentsToProjectedApr([
      this.createAprComponent(
        "oxd",
        oxdAPY * 100,
        true,
        1 - Chains.get(jar.chain).defaultPerformanceFee,
      ),
    ]);
  }
}
