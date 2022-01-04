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
      ["hnd"],
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
    const rewardsAddr = "0x52C7B4aA3F67D3533aAf1153430758c702a3594b"; // HND-ETH
    const mcDodoRewards = new MulticallContract(rewardsAddr, mcdodoAbi);

    const lpToken = new MulticallContract(jar.depositToken.addr, erc20Abi);
    const [hndInfo, totalSupplyBN] = await multicallProvider.all([
      mcDodoRewards.rewardTokenInfos(0),
      lpToken.balanceOf(rewardsAddr),
    ]);

    const HND_PER_BLOCK = +formatEther(hndInfo.rewardPerBlock);
    const totalSupply = +formatEther(totalSupplyBN);
    const pricePerToken = model.priceOfSync(jar.depositToken.addr);

    const blocksPerYear =
      ONE_YEAR_SECONDS / Chains.get(jar.chain).secondsPerBlock;
    const hndValueRewardedPerYear =
      model.priceOfSync("hnd") * HND_PER_BLOCK * blocksPerYear;

    const totalValueStaked = totalSupply * pricePerToken;
    const hndAPY = hndValueRewardedPerYear / totalValueStaked;

    return this.aprComponentsToProjectedApr([
      this.createAprComponent("hnd", hndAPY * 100, true),
    ]);
  }
}
