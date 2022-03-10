import { RoseJar } from "./rose-jar";
import { PickleModel } from "../../model/PickleModel";
import { AssetAprComponent, JarDefinition } from "../../model/PickleModelJson";
import { Contract as MultiContract } from "ethers-multicall";
import roseFarmAbi from "../../Contracts/ABIs/rose-farm.json";
import poolAbi from "../../Contracts/ABIs/pool.json";
import { formatEther } from "ethers/lib/utils";
import { ethers } from "ethers";
import { ONE_YEAR_SECONDS } from "../JarBehaviorResolver";
import { createAprComponentImpl } from "../../behavior/AbstractJarBehavior";
import { getStableswapPriceAddress } from "../../price/DepositTokenPriceUtility";

const rewarderAddress = "0x56DE5E2c25828040330CEF45258F3FFBc090777C";
const poolAddress = "0x8fe44f5cce02D5BE44e3446bBc2e8132958d22B8";


export class RoseUstpool extends RoseJar {
  constructor() {
    super(rewarderAddress);
  }

  async getDepositTokenPrice(
    asset: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    return getStableswapPriceAddress(poolAddress, asset, model);;
  }

  async calculateRoseAPY(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<AssetAprComponent[]> {
    const multicallRosePool = new MultiContract(poolAddress, poolAbi);
    const pricePerToken = (
      await model.callMulti(
        [
          () => multicallRosePool.get_virtual_price()
        ],
        jar.chain,
      )
    ).map((x) => parseFloat(ethers.utils.formatUnits(x)))

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
    console.log("rewardData", rewardData)
    console.log("totalSupplyBN", totalSupplyBN);

    const totalSupply = parseFloat(formatEther(totalSupplyBN));
    console.log("totalSupply", totalSupply)

    const roseRewardsPerYear =
      parseFloat(formatEther(rewardData[3])) * ONE_YEAR_SECONDS;
    console.log("roseRewardsPerYear", roseRewardsPerYear);

    const valueRewardedPerYear =
      model.priceOfSync("rose", jar.chain) * roseRewardsPerYear;
    console.log("valueRewardedPerYear", valueRewardedPerYear);


    const totalValueStaked = (totalSupply * pricePerToken);
    console.log("totalValueStaked", totalValueStaked);
    const roseAPY = (valueRewardedPerYear / totalValueStaked);
    console.log("roseAPY", roseAPY);

    return [
      createAprComponentImpl(
        "rose",
        roseAPY * 100,
        true,
        0.9,
      ),
    ]
  }
}
