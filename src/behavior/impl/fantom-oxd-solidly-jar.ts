import { Chains, PickleModel } from "../..";
import { JarDefinition, AssetProjectedApr, AssetAprComponent } from "../../model/PickleModelJson";
import strategyABI from "../../Contracts/ABIs/strategy-dual.json";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { SolidlyPairManager } from "../../protocols/SolidUtil";
import { Multicall } from "@uniswap/v3-sdk";
import { multicallContract } from "../../protocols/BalancerUtil/config";
import { formatEther } from "ethers/lib/utils";


// export async function calculateOxdFarmsAPY(
//   jar: JarDefinition,
//   model: PickleModel,
// ): Promise<AssetAprComponent> {
//   const pricePerToken = model.priceOfSync(jar.depositToken.addr, jar.chain);

//   const mutlicallOxdFarms = new multicallContract(OXD_FARMS, oxdAbi);
//   const lpToken = new multicallContract(jar.depositToken.addr, erc20Abi);

//   const [oxdPerSecondBN, solidPerSecondBN] = await model.callMulti(
//     [
//       () => mutlicallOxdFarms.stakingPoolsPositions()
//     ],
//     jar.chain
//   );

//   const oxdPerYear =
//     (parseFloat(formatEther(oxdPerSecondBN)) *
//       poolInfo.allocPoint.toNumber() *
//       ONE_YEAR_IN_SECONDS) /
//     totalAllocPointBN.toNumber();

//   const solidPerYear = (parseFloat(formatEther(oxdPerSecondBN)) *
//     poolInfo.allocPoint.toNumber() *
//     ONE_YEAR_IN_SECONDS) /
//     totalAllocPointBN.toNumber();

//   const totalSupplyOxd = parseFloat(formatEther(4210608415733614050356293));
//   const totalSupplySolid = 100000000;

//   const oxdRewardedPerYear = model.priceOfSync("oxd", jar.chain) * oxdPerYear;

// }

export class OxdSolidlyJar extends AbstractJarBehavior {
  protected strategyAbi: any;

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
    const lp = await new SolidlyPairManager().calculateLpApr(
      model,
      jar.depositToken.addr,
    );

    return this.aprComponentsToProjectedApr([
      // await calculateSpookyFarmsAPY(jar, model),
      this.createAprComponent("lp", lp, false),
    ]);
  }
}
