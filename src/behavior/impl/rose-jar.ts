import strategyAbi from "../../Contracts/ABIs/strategy.json";
import { AssetAprComponent, AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import roseFarmAbi from "../../Contracts/ABIs/rose-farm.json";
import { PickleModel } from "../../model/PickleModel";
import { Contract as MultiContract } from "ethers-multicall";
import { formatEther } from "ethers/lib/utils";
import { ONE_YEAR_SECONDS } from "../JarBehaviorResolver";
import {
  createAprComponentImpl,
} from "../../behavior/AbstractJarBehavior";
import gaugeAbi from "../../Contracts/ABIs/curve-factory-gauge.json"
import { getStableswapPrice } from "../../price/DepositTokenPriceUtility";

const metaPoolIds = {
  "0x8fe44f5cce02D5BE44e3446bBc2e8132958d22B8": "ustpool",
}

export abstract class RoseJar extends AbstractJarBehavior {
  rewarderAddress: string;
  poolAddress: string;
  constructor(rewarderAddress: string, poolAddress: string = null) {
    super();
    this.rewarderAddress = rewarderAddress;
    this.poolAddress = poolAddress;
  }

  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    return this.getHarvestableUSDCommsMgrImplementation(
      jar,
      model,
      ["rose"],
      strategyAbi,
    );
  }

  async getProjectedAprStats(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    return this.aprComponentsToProjectedApr(
      await this.calculateRoseAPY(definition, model),
    );
  }

  async calculateRoseAPY(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<AssetAprComponent[]> {
    let pricePerToken;
    if (metaPoolIds[this.poolAddress].length > 0) {
      const multicallRosePool = new MultiContract(this.poolAddress, gaugeAbi);
      pricePerToken = await model.callMulti(
        () => multicallRosePool.get_virtual_price(),
        jar.chain
      );
    } else {
      pricePerToken = model.priceOfSync(jar.depositToken.addr, jar.chain);
    }

    // const pricePerToken = model.priceOfSync(jar.depositToken.addr, jar.chain);


    const multicallRoseRewards = new MultiContract(
      this.rewarderAddress,
      roseFarmAbi,
    );
    const [rewardData, totalSupplyBN] = await model.callMulti(
      [
        () => multicallRoseRewards.rewardData(model.address("rose", jar.chain)),
        () => multicallRoseRewards.totalSupply(),
      ],
      jar.chain,
    );

    const totalSupply = parseFloat(formatEther(totalSupplyBN));

    const roseRewardsPerYear =
      parseFloat(formatEther(rewardData[3])) * ONE_YEAR_SECONDS;

    const valueRewardedPerYear =
      model.priceOfSync("rose", jar.chain) * roseRewardsPerYear;



    const totalValueStaked = totalSupply * pricePerToken;
    const roseAPY = 100 * (valueRewardedPerYear / totalValueStaked);

    return [
      createAprComponentImpl(
        "rose",
        roseAPY,
        true,
        0.9,
      ),
    ]
  }
}
