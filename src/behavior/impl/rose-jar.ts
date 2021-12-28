import { ethers, Signer } from "ethers";
import strategyAbi from "../../Contracts/ABIs/strategy.json";
import { Provider } from "@ethersproject/providers";
import { AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import roseFarmAbi from "../../Contracts/ABIs/rose-farm.json";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import { PickleModel } from "../../model/PickleModel";
import { Contract as MulticallContract } from "ethers-multicall";
import { Chains } from "../../chain/Chains";
import { formatEther } from "ethers/lib/utils";
import { ONE_YEAR_SECONDS } from "../JarBehaviorResolver";
import { getLivePairDataFromContracts } from "../../protocols/GenericSwapUtil";

export abstract class RoseJar extends AbstractJarBehavior {
  rewarderAddress: string;
  constructor(rewarderAddress: string) {
    super();
    this.rewarderAddress = rewarderAddress;
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
      ["rose"],
      strategyAbi,
    );
  }

  async getProjectedAprStats(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const rose: number = await this.calculateRoseAPY(definition, model);

    return this.aprComponentsToProjectedApr([
      this.createAprComponent("rose", rose, true),
    ]);
  }

  async calculateRoseAPY(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    const multicallProvider = model.multicallProviderFor(jar.chain);
    await multicallProvider.init();

    const multicallRoseRewards = new MulticallContract(
      this.rewarderAddress,
      roseFarmAbi,
    );

    const [rewardData, totalSupplyBN] = await multicallProvider.all([
      multicallRoseRewards.rewardData(model.address("rose", jar.chain)),
      multicallRoseRewards.totalSupply(),
    ]);
    const totalSupply = parseFloat(formatEther(totalSupplyBN));
    const roseRewardsPerYear =
      parseFloat(formatEther(rewardData[3])) * ONE_YEAR_SECONDS;

    const { pricePerToken } = await getLivePairDataFromContracts(
      jar,
      model,
      18,
    );

    const valueRewardedPerYear = model.priceOfSync("rose") * roseRewardsPerYear;

    const totalValueStaked = totalSupply * pricePerToken;
    const roseAPY = 100 * (valueRewardedPerYear / totalValueStaked);
    return roseAPY;
  }
}
