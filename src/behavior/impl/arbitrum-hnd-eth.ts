import { Contract } from "ethers-multiprovider";
import { ChainNetwork, Chains, PickleModel } from "../..";
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
  ): Promise<number> {
    return this.getHarvestableUSDDefaultImplementation(
      jar,
      model,
      ["dodo"],
      this.strategyAbi,
    );
  }

  async getProjectedAprStats(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const rewardsAddr = "0x23fFB3687d3800FDDde75E7e604392fEa15c8757"; // HND-ETH
    const mcDodoRewards = new Contract(rewardsAddr, mcdodoAbi);

    const multiProvider = model.multiproviderFor(jar.chain);
    const lpToken = new Contract(jar.depositToken.addr, erc20Abi);
    const [dodoInfo, totalSupplyBN] = await multiProvider.all([
      mcDodoRewards.rewardTokenInfos(0),
      lpToken.balanceOf(rewardsAddr),
    ]);

    let currentBlock: number;
    if (
      jar.chain === ChainNetwork.Arbitrum ||
      jar.chain === ChainNetwork.Optimism
    ) {
      currentBlock = await model
        .multiproviderFor(ChainNetwork.Ethereum)
        .getBlockNumber();
    } else {
      currentBlock = await multiProvider.getBlockNumber();
    }
    const rewardEndBlock = dodoInfo.endBlock.toNumber();

    if (rewardEndBlock > currentBlock) {
      const DODO_PER_BLOCK = +formatEther(dodoInfo.rewardPerBlock);
      const totalSupply = +formatEther(totalSupplyBN);
      const pricePerToken = model.priceOfSync(jar.depositToken.addr, jar.chain);

      const blocksPerYear =
        ONE_YEAR_SECONDS /
        (await Chains.getAccurateSecondsPerBlock(jar.chain, model));
      const dodoValueRewardedPerYear =
        model.priceOfSync("dodo", jar.chain) * DODO_PER_BLOCK * blocksPerYear;

      const totalValueStaked = totalSupply * pricePerToken;
      const dodoAPY = dodoValueRewardedPerYear / totalValueStaked;

      return this.aprComponentsToProjectedApr([
        this.createAprComponent("dodo", dodoAPY * 100, true),
      ]);
    } else {
      return this.aprComponentsToProjectedApr([
        this.createAprComponent("dodo", 0, true),
      ]);
    }
  }
}
