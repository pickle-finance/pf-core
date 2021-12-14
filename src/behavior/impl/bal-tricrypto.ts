import { PickleModel } from "../..";
import { AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import { calculateBalPoolAPRs, getPoolData, PoolData } from "../../protocols/BalancerUtil";
import { BalancerJar } from "./balancer-jar";

export class BalTricrypto extends BalancerJar {
  poolData: PoolData | undefined;

  async getDepositTokenPrice(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    if (!this.poolData) this.poolData = await getPoolData(jar, model);
    return this.poolData.pricePerToken;
  }

  async getProjectedAprStats(
      jar: JarDefinition,
      model: PickleModel,
  ): Promise<AssetProjectedApr> {
      if (!this.poolData) this.poolData = await getPoolData(jar, model);
      const res = await calculateBalPoolAPRs(jar.depositToken.addr, model, this.poolData);
      const aprsPostFee = res.map((component) =>
        this.createAprComponent(
          component.name,
          component.apr,
          component.compoundable,
        ),
      );
      return this.aprComponentsToProjectedApr(aprsPostFee);
  }
}
