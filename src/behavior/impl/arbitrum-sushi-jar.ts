import { BigNumber, ethers, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import { AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import { ChainNetwork } from "../../chain/Chains";
import { PickleModel } from "../../model/PickleModel";
import { multiSushiStrategyAbi } from "../../Contracts/ABIs/multi-sushi-strategy.abi";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import {
  calculateMCv2ApyArbitrum,
  calculateSushiApyArbitrum,
  SushiArbPairManager,
} from "../../protocols/SushiSwapUtil";

export abstract class ArbitrumSushiJar extends AbstractJarBehavior {
  protected rewardToken: string;

  constructor(rewardToken: string) {
    super();
    this.rewardToken = rewardToken;
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
      ["sushi", this.rewardToken],
      multiSushiStrategyAbi,
    );
  }

  async getProjectedAprStats(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const [sushiApy, rewardApy] = await Promise.all([
      calculateSushiApyArbitrum(definition, model),
      calculateMCv2ApyArbitrum(definition, model, this.rewardToken),
    ]);

    const lp: number = await calculateSushiswapLpApr(
      model,
      definition.depositToken.addr,
    );

    return this.aprComponentsToProjectedApr([
      this.createAprComponent("lp", lp, false),
      this.createAprComponent("sushi", sushiApy * 100, true),
      this.createAprComponent(this.rewardToken, rewardApy * 100, true),
    ]);
  }
}

async function calculateSushiswapLpApr(
  model: PickleModel,
  addr: string,
): Promise<number> {
  return await new SushiArbPairManager().calculateLpApr(model, addr);
}
