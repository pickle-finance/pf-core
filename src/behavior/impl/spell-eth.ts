import {
  AssetAprComponent,
  AssetProjectedApr,
  JarDefinition,
} from "../../model/PickleModelJson";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { PickleModel } from "../../model/PickleModel";
import { calculateAbradabraApy } from "../../protocols/AbraCadabraUtil";
import { SushiEthPairManager } from "../../protocols/SushiSwapUtil";

export class SpellEth extends AbstractJarBehavior {
  async getProjectedAprStats(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const [abraApr, lpApr] = await Promise.all([
      calculateAbradabraApy(definition, model),
      new SushiEthPairManager().calculateLpApr(
        model,
        definition.depositToken.addr,
      ),
    ]);

    const abraComp: AssetAprComponent = this.createAprComponent(
      "spell",
      abraApr,
      true,
    );
    const lpComp: AssetAprComponent = this.createAprComponent(
      "lp",
      lpApr,
      false,
    );
    return this.aprComponentsToProjectedApr([abraComp, lpComp]);
  }

  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    return this.getHarvestableUSDMasterchefCommsMgrImplementation(
      jar,
      model,
      ["spell"],
      "0xf43480afe9863da4acbd4419a47d9cc7d25a647f",
      "pendingIce",
      0,
    );
  }
}
