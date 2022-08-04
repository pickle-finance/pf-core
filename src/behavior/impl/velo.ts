import { PickleModel, toError } from "../../model/PickleModel";
import { AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import strategyV2Abi from "../../Contracts/ABIs/strategy-v2.json";
import { ErrorSeverity } from "../../core/platform/PlatformInterfaces";
import { Chains } from "../../chain/Chains";
import fetch from "cross-fetch";


const VELODROME_API = "https://api.velodrome.finance/api/v1/pairs";

export class VeloJar extends AbstractJarBehavior {
  static apiLpDetails: any[];
  async getDepositTokenPrice(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    return super.getDepositTokenPrice(jar, model);
  }

  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
  ):Promise<number> {
    return this.getHarvestableUSDDefaultImplementationV2(
      jar,
      model,
      ["velo"],
      strategyV2Abi,
    );
  }


  async getProjectedAprStats(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    /*
      Velo jars do not benefit from LP fees
    */

    const components = [];
    await this.getApiLpDetails(jar, model);
    if (VeloJar.apiLpDetails) {
      const pool = VeloJar.apiLpDetails.find(
        (x) =>
          x.address.toLowerCase() === jar.depositToken.addr.toLowerCase(),
      );
      if(pool){
        const veloApr: number = pool.apr;
        veloApr && components.push(this.createAprComponent("velo", veloApr, true, 1-Chains.get(jar.chain).defaultPerformanceFee))
      }
    }

    return this.aprComponentsToProjectedApr(components);
  }

  async getApiLpDetails(jar: JarDefinition, model: PickleModel): Promise<void> {
    if (!VeloJar.apiLpDetails) {
      try {
        const resp = await fetch(VELODROME_API);
        const data = await resp.json();
        VeloJar.apiLpDetails = data.data;
      } catch (error) {
        model.logPlatformError(toError(301102, jar.chain, jar.details.apiKey, "getApiLpDetails", 'error fetching velodrome API', ''+error, ErrorSeverity.ERROR_3));
      }
    }
  }

}
