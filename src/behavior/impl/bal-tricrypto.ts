import { PickleModel } from "../..";
import { AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import {
  calculateBalPoolAPRs,
  getPoolData,
} from "../../protocols/BalancerUtil";
import { BalancerJar } from "./balancer-jar";

export class BalTricrypto extends BalancerJar {
  async getDepositTokenPrice(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    const { pricePerToken } = await getPoolData(jar.depositToken.addr, model);
    return pricePerToken;
  }

  async getProjectedAprStats(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const res = await calculateBalPoolAPRs(jar.depositToken.addr, model);
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
