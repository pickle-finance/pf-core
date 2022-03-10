import { Chains, PickleModel } from "../..";
import { JarDefinition, AssetProjectedApr } from "../../model/PickleModelJson";
import strategyABI from "../../Contracts/ABIs/strategy-dual.json";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { SolidlyPairManager } from "../../protocols/SolidUtil";
import fetch from "cross-fetch";

const SOLIDEX_API = "https://api.solidexfinance.com/api/getLPDetails?v=fantom";

export class OxdSolidlyJar extends AbstractJarBehavior {
  protected strategyAbi: any;
  static apiLpDetails: any;

  constructor() {
    super();
    this.strategyAbi = strategyABI;
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
      ["solid", "oxd"],
      this.strategyAbi,
    );
  }

  async getProjectedAprStats(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const lpPromise = new SolidlyPairManager().calculateLpApr(
      model,
      jar.depositToken.addr,
    );

    const components = [];
    await this.getApiLpDetails(jar, model);
    if (OxdSolidlyJar.apiLpDetails) {
      const pool = OxdSolidlyJar.apiLpDetails.filter(
        (x) =>
          x.poolAddress.toLowerCase() === jar.depositToken.addr.toLowerCase(),
      )[0];
      const solidApr = pool?.solidexTVL?.realsolidAPR;
      const oxdApr = pool?.solidexTVL?.realoxdAPR;
      solidApr &&
        components.push(
          this.createAprComponent(
            "solid",
            solidApr,
            true,
            1 - Chains.get(jar.chain).defaultPerformanceFee,
          ),
        );
      oxdApr &&
        components.push(
          this.createAprComponent(
            "oxd",
            oxdApr,
            true,
            1 - Chains.get(jar.chain).defaultPerformanceFee,
          ),
        );
    }

    const lp = await lpPromise;
    components.push(this.createAprComponent("lp", lp, false));

    return this.aprComponentsToProjectedApr(components);
  }

  async getApiLpDetails(jar: JarDefinition, model: PickleModel): Promise<void> {
    if (!OxdSolidlyJar.apiLpDetails) {
      try {
        const resp = await fetch(SOLIDEX_API);
        const data = await resp.json();
        OxdSolidlyJar.apiLpDetails = data.data.poolDetailsAll;
      } catch (error) {
        model.logError("getApiLpDetails", error, jar.id);
      }
    }
  }
}
