import { AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import feiChefAbi from "../../Contracts/ABIs/feichef.json";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import { PickleModel } from "../../model/PickleModel";
import { Contract } from "ethers-multiprovider";
import { Chains } from "../../chain/Chains";
import { formatEther } from "ethers/lib/utils";
import { ONE_YEAR_SECONDS } from "../JarBehaviorResolver";
import { getLivePairDataFromContracts } from "../../protocols/GenericSwapUtil";
import { calculateUniswapLpApr } from "../../protocols/UniswapUtil";
import { BigNumber, ethers } from "ethers";

export const FEI_MASTERCHEF = "0x9e1076cC0d19F9B0b8019F384B0a29E48Ee46f7f";

// This jar doesn't get rewards anymore, it is currently set to "withdraw_only"
export class FeiTribe extends AbstractJarBehavior {
  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    // changing to this because calling "pendingRewards" on fei masterchef
    // & "getHarvestable" on the strategy result in errors
    // last harvest txn was on 04-Jan-22 and the strategy's been holding 0 tribe since
    const multiProvider = model.multiproviderFor(jar.chain);
    const tribeContract = new Contract(
      model.address("tribe", jar.chain),
      erc20Abi,
    );

    const [strategyBalanceBN]: BigNumber[] = await multiProvider
      .all([tribeContract.balanceOf(jar.details.strategyAddr)])
      .catch(() => [BigNumber.from("0")]);
    const tribePrice = model.priceOfSync("tribe", jar.chain);
    const strategyBalance = parseFloat(
      ethers.utils.formatUnits(
        strategyBalanceBN,
        model.tokenDecimals("tribe", jar.chain),
      ),
    );
    const total = strategyBalance * tribePrice;

    return total;
  }

  async getProjectedAprStats(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const tribe: number = await this.calculateFeiAPY(definition, model);
    const lp: number = await calculateUniswapLpApr(
      model,
      definition.depositToken.addr,
    );

    return this.aprComponentsToProjectedApr([
      this.createAprComponent("lp", lp, false),
      this.createAprComponent("tribe", tribe, true),
    ]);
  }

  async calculateFeiAPY(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    const multiProvider = model.multiproviderFor(jar.chain);
    const multicallFeichef = new Contract(FEI_MASTERCHEF, feiChefAbi);
    const multicallLp = new Contract(jar.depositToken.addr, erc20Abi);
    const [tribePerBlockBN, totalAllocPointBN, poolInfo, totalSupplyBN] =
      await multiProvider.all([
        multicallFeichef.tribePerBlock(),
        multicallFeichef.totalAllocPoint(),
        multicallFeichef.poolInfo(0), // poolId for FEI-TRIBE
        multicallLp.balanceOf(FEI_MASTERCHEF),
      ]);

    const totalSupply = parseFloat(formatEther(totalSupplyBN));
    const tribeRewardsPerBlock =
      (parseFloat(formatEther(tribePerBlockBN)) *
        0.9 *
        poolInfo.allocPoint.toNumber()) /
      totalAllocPointBN.toNumber();

    const { pricePerToken } = await getLivePairDataFromContracts(
      jar,
      model,
      18,
    );

    const tribeRewardsPerYear =
      tribeRewardsPerBlock *
      (ONE_YEAR_SECONDS / Chains.get(jar.chain).secondsPerBlock);
    const valueRewardedPerYear =
      model.priceOfSync("tribe", jar.chain) * tribeRewardsPerYear;

    const totalValueStaked = totalSupply * pricePerToken;
    const tribeAPY = 100 * (valueRewardedPerYear / totalValueStaked);
    return tribeAPY;
  }
}
