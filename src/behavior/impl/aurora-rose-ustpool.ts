import { RoseJar } from "./rose-jar";
import { PickleModel } from "../../model/PickleModel";
import { AssetAprComponent, JarDefinition } from "../../model/PickleModelJson";
import { Contract } from "ethers-multiprovider";
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
    return getStableswapPriceAddress(poolAddress, asset, model);
  }

  async calculateRoseAPY(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<AssetAprComponent[]> {
    // TRI calcs first
    const multicallRosePool = new Contract(poolAddress, poolAbi);
    const multiProvider = model.multiproviderFor(jar.chain);
    const pricePerToken = (
      await multiProvider.all([multicallRosePool.get_virtual_price()])
    ).map((x) => parseFloat(ethers.utils.formatUnits(x)))[0];

    const multicallRoseRewards = new Contract(rewarderAddress, roseFarmAbi);
    const [roseRewardData, lunaRewardData, totalSupplyBN] =
      await multiProvider.all([
        multicallRoseRewards.rewardData(model.address("rose", jar.chain)),
        multicallRoseRewards.rewardData(model.address("luna", jar.chain)),
        multicallRoseRewards.totalSupply(),
      ]);

    const totalSupply = parseFloat(formatEther(totalSupplyBN));

    const roseRewardsPerYear =
      parseFloat(formatEther(roseRewardData[3])) * ONE_YEAR_SECONDS;
    const roseValueRewardedPerYear =
      model.priceOfSync("rose", jar.chain) * roseRewardsPerYear;

    const totalValueStaked = totalSupply * pricePerToken;
    const roseAPY = roseValueRewardedPerYear / totalValueStaked;

    //Then LUNA calcs
    const lunaRewardsPerYear =
      parseFloat(formatEther(lunaRewardData[3])) * ONE_YEAR_SECONDS;
    const lunaValueRewardedPerYear =
      model.priceOfSync("luna", jar.chain) * lunaRewardsPerYear;
    const lunaAPY = lunaValueRewardedPerYear / totalValueStaked;

    return [
      createAprComponentImpl("rose", roseAPY * 100, true, 0.9),
      createAprComponentImpl("luna", lunaAPY * 100, true, 0.9),
    ];
  }
}
