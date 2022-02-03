import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import {
  Provider as MulticallProvider,
  Contract as MulticallContract,
} from "ethers-multicall";
import { Chains, PickleModel } from "../..";
import { JarDefinition, AssetProjectedApr } from "../../model/PickleModelJson";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import mcdodoAbi from "../../Contracts/ABIs/mcdodo-rewards.json";
import { sushiStrategyAbi } from "../../Contracts/ABIs/sushi-strategy.abi";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { formatEther } from "ethers/lib/utils";
import { ONE_YEAR_SECONDS } from "../JarBehaviorResolver";

export class ArbitrumHndEth extends AbstractJarBehavior {
  protected strategyAbi: any;

  constructor() {
    super();
    this.strategyAbi = sushiStrategyAbi;
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
      ["dodo"],
      this.strategyAbi,
    );
  }

  async getProjectedAprStats(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const multicallProvider: MulticallProvider = model.multicallProviderFor(
      jar.chain,
    );
    const rewardsAddr = "0x23fFB3687d3800FDDde75E7e604392fEa15c8757"; // HND-ETH
    const mcDodoRewards = new MulticallContract(rewardsAddr, mcdodoAbi);

    const lpToken = new MulticallContract(jar.depositToken.addr, erc20Abi);
    const [dodoInfo, totalSupplyBN] = await multicallProvider.all([
      mcDodoRewards.rewardTokenInfos(0),
      lpToken.balanceOf(rewardsAddr),
    ]);

    const DODO_PER_BLOCK = +formatEther(dodoInfo.rewardPerBlock);
    const totalSupply = +formatEther(totalSupplyBN);
    const pricePerToken = model.priceOfSync(jar.depositToken.addr);

    const blocksPerYear =
      ONE_YEAR_SECONDS / Chains.get(jar.chain).secondsPerBlock;
    const dodoValueRewardedPerYear =
      model.priceOfSync("dodo") * DODO_PER_BLOCK * blocksPerYear;

    const totalValueStaked = totalSupply * pricePerToken;
    const dodoAPY = dodoValueRewardedPerYear / totalValueStaked;

    return this.aprComponentsToProjectedApr([
      this.createAprComponent("dodo", dodoAPY * 100, true),
    ]);
  }
}
