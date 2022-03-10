import { ethers } from "ethers";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import {
  AssetAprComponent,
  HistoricalYield,
  JarDefinition,
} from "../../model/PickleModelJson";
import curveFactoryGaugeAbi from "../../Contracts/ABIs/curve-factory-gauge.json";
import curveFactoryPoolAbi from "../../Contracts/ABIs/curve-factory-pool.json";
import curveFactoryAbi from "../../Contracts/ABIs/curve-factory.json";
import controllerAbi from "../../Contracts/ABIs/gauge-controller.json";
import { Contract as MultiContract } from "ethers-multicall";
import { PickleModel } from "../../model/PickleModel";
import { getCurvePerformance } from "../../protocols/CurveUtil";
import {
  createAprComponentImpl,
} from "../../behavior/AbstractJarBehavior";

export const GAUGE_CONTROLLER = "0x2F50D538606Fa9EDD2B11E2446BEb18C9D5846bB";
export const FACTORY = "0xF18056Bbd320E96A48e3Fbf8bC061322531aac99";

export const curveFactoryPools = {
  "0xdf55670e27bE5cDE7228dD0A6849181891c9ebA1": {
    name: "STG-USDC",
    poolId: 37,
    pool: "0x3211C6cBeF1429da3D0d58494938299C92Ad5860",
    gauge: "0x95d16646311fDe101Eb9F897fE06AC881B7Db802",
  }
}
export abstract class CurveFactoryJar extends AbstractJarBehavior {
  constructor() {
    super();
  }

  async getProtocolApy(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<HistoricalYield> {
    return await getCurvePerformance(definition, model);
  }

  async getCurveCrvAPY(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<AssetAprComponent[]> {
    const multicallFactory = new MultiContract(FACTORY, curveFactoryAbi);
    const multicallFactoryPool = new MultiContract(curveFactoryPools[jar.depositToken.addr].pool, curveFactoryPoolAbi);
    const multicallFactoryGauge = new MultiContract(curveFactoryPools[jar.depositToken.addr].gauge, curveFactoryGaugeAbi);

    const [virtualPrice, lpPrice, inflationRate, workingSupply] = (await model.callMulti(
      [
        () => multicallFactoryPool.get_virtual_price(),
        () => multicallFactoryPool.lp_price(),
        () => multicallFactoryGauge.inflation_rate(),
        () => multicallFactoryGauge.working_supply(),
      ],
      jar.chain,
    )
    ).map((x) => parseFloat(ethers.utils.formatUnits(x)));

    const controller = new MultiContract(GAUGE_CONTROLLER, controllerAbi);
    const weight = await model
      .callMulti(() => controller.gauge_relative_weight(curveFactoryPools[jar.depositToken.addr].gauge), jar.chain)
      .then((x) => parseFloat(ethers.utils.formatUnits(x)));

    const rate =
      (((inflationRate * weight * 31536000) / workingSupply) * 0.4) /
      (virtualPrice * lpPrice);

    const crvApy = rate * model.priceOfSync("crv", jar.chain) * 100;

    return [createAprComponentImpl("CRV", crvApy * 100, true, 0.8)]
  }

  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    const multicallFactoryGauge = new MultiContract(curveFactoryPools[jar.depositToken.addr].gauge, curveFactoryGaugeAbi);
    const crvReward = await model.callMulti(
      () => multicallFactoryGauge.claimable_reward(jar.details.strategyAddr),
      jar.chain,
    );
    const crvPrice = model.priceOfSync("curve-dao-token", jar.chain);
    const harvestable = crvReward.mul(crvPrice.toFixed());
    return parseFloat(ethers.utils.formatEther(harvestable));
  }
}
