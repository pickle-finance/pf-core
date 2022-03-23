import { PickleModel } from "../..";
import { JarDefinition, AssetProjectedApr } from "../../model/PickleModelJson";
import { multiSushiStrategyAbi } from "../../Contracts/ABIs/multi-sushi-strategy.abi";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import {
  calculateMCv2ApyArbitrum,
  calculateSushiApyArbitrum,
  SushiArbPairManager,
} from "../../protocols/SushiSwapUtil";

export class ArbitrumMimEth extends AbstractJarBehavior {
  protected strategyAbi: any;

  constructor() {
    super();
    this.strategyAbi = multiSushiStrategyAbi;
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
    return this.getHarvestableUSDCommsMgrImplementation(
      jar,
      model,
      ["sushi", "spell"],
      this.strategyAbi,
    );
  }

  async getProjectedAprStats(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const [sushiMimEthApy, spellMimEthApy, lpApr] = await Promise.all([
      calculateSushiApyArbitrum(jar, model),
      calculateMCv2ApyArbitrum(jar, model, "spell"),
      new SushiArbPairManager().calculateLpApr(model, jar.depositToken.addr),
    ]);

    return this.aprComponentsToProjectedApr([
      this.createAprComponent("lp", lpApr, false),
      this.createAprComponent("sushi", sushiMimEthApy * 100, true),
      this.createAprComponent("spell", spellMimEthApy * 100, true),
    ]);
  }
}
