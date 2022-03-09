import { PickleModel } from "../..";
import { JarDefinition, AssetProjectedApr } from "../../model/PickleModelJson";
import { multiSushiStrategyAbi } from "../../Contracts/ABIs/multi-sushi-strategy.abi";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import {
  calculateMCv2ApyArbitrum,
  calculateSushiApyArbitrum,
  SushiArbPairManager,
} from "../../protocols/SushiSwapUtil";

export class ArbitrumSpellEth extends AbstractJarBehavior {
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
    return this.getHarvestableUSDComManImplementation(
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
    const [sushiSpellEthApy, spellEthApy] = await Promise.all([
      calculateSushiApyArbitrum(jar, model),
      calculateMCv2ApyArbitrum(jar, model, "spell"),
    ]);
    const lp: number = await calculateSushiswapLpApr(
      model,
      jar.depositToken.addr,
    );

    return this.aprComponentsToProjectedApr([
      this.createAprComponent("lp", lp, false),
      this.createAprComponent("sushi", sushiSpellEthApy * 100, true),
      this.createAprComponent("spell", spellEthApy * 100, true),
    ]);
  }
}
async function calculateSushiswapLpApr(
  model: PickleModel,
  addr: string,
): Promise<number> {
  return await new SushiArbPairManager().calculateLpApr(model, addr);
}
