import { RoseJar } from "./rose-jar";
import { PickleModel } from "../../model/PickleModel";
import { AssetAprComponent, JarDefinition } from "../../model/PickleModelJson";
import { Contract as MultiContract } from "ethers-multicall";
import roseFarmAbi from "../../Contracts/ABIs/rose-farm.json";
import gaugeAbi from "../../Contracts/ABIs/curve-factory-gauge.json";
import { formatEther } from "ethers/lib/utils";
import { ONE_YEAR_SECONDS } from "../JarBehaviorResolver";
import { createAprComponentImpl } from "../../behavior/AbstractJarBehavior";
import { getStableswapPrice } from "../../price/DepositTokenPriceUtility";

const rewarderAddress = "0x56DE5E2c25828040330CEF45258F3FFBc090777C";
const poolAddress = "0x8fe44f5cce02D5BE44e3446bBc2e8132958d22B8";


export class RoseUstpool extends RoseJar {
  constructor() {
    super(rewarderAddress);
  }

  // async getDepositTokenPrice(
  //   asset: JarDefinition,
  //   model: PickleModel,
  // ): Promise<number> {
  //   return getStableswapPrice(asset, model);
  // }

  async calculateRoseAPY(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<AssetAprComponent[]> {
    const multicallRosePool = new MultiContract(poolAddress, gaugeAbi);
    console.log("PING", multicallRosePool)
    const pricePerToken = await model.callMulti(
      [
        () => multicallRosePool.get_virtual_price()
      ],
      jar.chain,
    );

    // const pricePerToken = model.priceOfSync(jar.depositToken.addr, jar.chain);


    const multicallRoseRewards = new MultiContract(
      rewarderAddress,
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
