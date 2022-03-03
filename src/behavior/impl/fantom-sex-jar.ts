import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import { Chains, PickleModel } from "../..";
import { JarDefinition, AssetProjectedApr } from "../../model/PickleModelJson";
import strategyABI from "../../Contracts/ABIs/strategy-dual.json";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { SolidlyPairManager } from "../../protocols/SolidUtil";
import fetch from "cross-fetch";

const SOLIDEX_API = "https://api.solidexfinance.com/api/getLPDetails?v=fantom";

export class SexJar extends AbstractJarBehavior {
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
    resolver: Signer | Provider,
  ): Promise<number> {
    return this.getHarvestableUSDDefaultImplementation(
      jar,
      model,
      resolver,
      ["solid", "sex"],
      this.strategyAbi,
    );
  }

  async getProjectedAprStats(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const components = [];
    await this.getApiLpDetails(jar, model);
    if (SexJar.apiLpDetails) {
      const pool = SexJar.apiLpDetails.filter(
        (x) =>
          x.poolAddress.toLowerCase() === jar.depositToken.addr.toLowerCase(),
      )[0];
      const solidApr = pool?.solidexTVL?.realsolidAPR;
      const sexApr = pool?.solidexTVL?.realsexAPR;
      solidApr &&
        components.push(
          this.createAprComponent(
            "solid",
            solidApr,
            true,
            1 - Chains.get(jar.chain).defaultPerformanceFee,
          ),
        );
      sexApr &&
        components.push(
          this.createAprComponent(
            "sex",
            sexApr,
            true,
            1 - Chains.get(jar.chain).defaultPerformanceFee,
          ),
        );
    }
    const lp = await new SolidlyPairManager().calculateLpApr(
      model,
      jar.depositToken.addr,
    );
    components.push(this.createAprComponent("lp", lp, false));

    return this.aprComponentsToProjectedApr(components);
  }

  async getApiLpDetails(jar: JarDefinition, model: PickleModel): Promise<void> {
    if (!SexJar.apiLpDetails) {
      try {
        const resp = await fetch(SOLIDEX_API);
        const data = await resp.json();
        SexJar.apiLpDetails = data.data.poolDetailsAll;
      } catch (error) {
        model.logError("getApiLpDetails", error, jar.id);
      }
    }
  }
}
