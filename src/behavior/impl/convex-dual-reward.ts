import { AssetAprComponent, AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { PickleModel } from "../../model/PickleModel";
import { getProjectedConvexAprStats } from "../../protocols/ConvexUtility";
import { getCurvePoolData } from "../../protocols/CurveUtil";

const strategyAbi = ["function getHarvestable() view returns(uint256,uint256)"];

export class ConvexDualReward extends AbstractJarBehavior {
  async getLpApr(definition: JarDefinition, model: PickleModel): Promise<AssetAprComponent> {
    let lpApy = 0;
    const poolData = await getCurvePoolData(definition, model);
    if (poolData) {
      lpApy = poolData.lpApr ?? 0;
    }

    return this.createAprComponent("lp", lpApy, false);
  }

  async getProjectedAprStats(definition: JarDefinition, model: PickleModel): Promise<AssetProjectedApr> {
    return this.aprComponentsToProjectedApr([
      await this.getLpApr(definition, model),
      ...(await getProjectedConvexAprStats(definition, model)),
    ]);
  }

  async getHarvestableUSD(jar: JarDefinition, model: PickleModel): Promise<number> {
    return this.getHarvestableUSDDefaultImplementation(jar, model, ["crv", "cvx"], strategyAbi);
  }
}
