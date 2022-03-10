import { AssetProjectedApr, JarDefinition, AssetAprComponent } from "../../model/PickleModelJson";
import { AbstractJarBehavior, createAprComponentImpl } from "../AbstractJarBehavior";
import { PoolId } from "../../protocols/ProtocolUtil";
import { Contract as MultiContract } from "ethers-multicall";
import { PickleModel } from "../../model/PickleModel";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import sushiMiniChefAbi from "../../Contracts/ABIs/sushi-minichef.json";
import sushiComplexRewarderAbi from "../../Contracts/ABIs/sushi-complex-rewarder.json";
import { formatEther, defaultAbiCoder } from "ethers/lib/utils";
import { ONE_YEAR_IN_SECONDS } from "../../behavior/AbstractJarBehavior";

export const SUSHI_MINICHEF = "0xdDCbf776dF3dE60163066A5ddDF2277cB445E0F3";
export const GNO_COMPLEX_REWARDER =
  "0x3f505B5CfF05d04F468Db65e27E72EC45A12645f";

const gnosisSushiPoolIds: PoolId = {
  "0xA227c72a4055A9DC949cAE24f54535fe890d3663": 0,
  "0xe21F631f47bFB2bC53ED134E83B8cff00e0EC054": 1,
  "0xc704050A17AF0caed763431b80e38e8d8FF15591": 2,
  "0x8C0C36c85192204c8d782F763fF5a30f5bA0192F": 3,
  "0xB320609F2Bf3ca98754c14Db717307c6d6794d8b": 4,
  "0x6685C047EAB042297e659bFAa7423E94b4A14b9E": 5,
  "0x74c2EFA722010Ad7C142476F525A051084dA2C42": 6,
  "0x0f9D54D9eE044220A3925f9b97509811924fD269": 7,
  "0xAA2770a8367d6B57d62837830ed6D42CC7740103": 8,
  "0x15f9EEdeEBD121FBb238a8A0caE38f4b4A07A585": 9,
  "0xF38c5b39F29600765849cA38712F302b1522C9B8": 10,
};

export async function calculateGnosisSushiAPY(
  jar: JarDefinition,
  model: PickleModel,
): Promise<AssetAprComponent[]> {
  const poolId = gnosisSushiPoolIds[jar.depositToken.addr];
  const multicallsushiMinichef = new MultiContract(
    SUSHI_MINICHEF,
    sushiMiniChefAbi,
  );
  const lpToken = new MultiContract(jar.depositToken.addr, erc20Abi);

  const [sushiPerSecondBN, totalAllocPointBN, poolInfo, totalSupplyBN, rewarder] =
    await model.callMulti(
      [
        () => multicallsushiMinichef.sushiPerSecond(),
        () => multicallsushiMinichef.totalAllocPoint(),
        () => multicallsushiMinichef.poolInfo(poolId),
        () => lpToken.balanceOf(SUSHI_MINICHEF),
        () => multicallsushiMinichef.rewarder(poolId),
      ],
      jar.chain,
    );

  const totalSupply = parseFloat(formatEther(totalSupplyBN));
  console.log("PING1")
  const sushiRewardsPerSecond =
    (parseFloat(formatEther(sushiPerSecondBN)) *
      poolInfo.allocPoint.toNumber()) /
    totalAllocPointBN.toNumber();
  console.log("PING2")

  const pricePerToken = model.priceOfSync(jar.depositToken.addr, jar.chain);
  console.log("PING3")

  const sushiRewardsPerYear = sushiRewardsPerSecond * ONE_YEAR_IN_SECONDS;
  console.log("PING4")

  const valueRewardedPerYear =
    model.priceOfSync("sushi", jar.chain) * sushiRewardsPerYear;
  console.log("PING5");

  const totalValueStaked = totalSupply * pricePerToken;
  console.log("PING7")

  const sushiAPY = (valueRewardedPerYear / totalValueStaked) * 100;
  console.log("PING8")


  // Getting GNO rewards
  const provider = model.providerFor(jar.chain);
  console.log("PING9")

  const totalAllocPointCREncoded = await provider.getStorageAt(
    GNO_COMPLEX_REWARDER,
    5,
  );
  console.log("PING10");

  const rewarderContract = new MultiContract(GNO_COMPLEX_REWARDER, sushiComplexRewarderAbi);
  console.log("PING11", rewarderContract);

  const [poolInfoCR, gnoPerSecondBN] = await model.callMulti(
    [
      () => rewarderContract.poolInfo(poolId),
      () => rewarderContract.rewardPerSecond()
    ],
    jar.chain,
  );
  console.log("PING12", poolInfoCR, gnoPerSecondBN);


  const totalAllocPointCR = defaultAbiCoder.decode(
    ["uint256"],
    totalAllocPointCREncoded,
  );
  console.log("PING13")


  const gnoRewardsPerSecond =
    (parseFloat(formatEther(gnoPerSecondBN)) *
      poolInfoCR.allocPoint.toNumber()) /
    totalAllocPointCR[0].toNumber();
  console.log("PING14")


  const gnoRewardsPerYear = gnoRewardsPerSecond * (365 * 24 * 60 * 60);
  console.log("PING15")

  const gnoValueRewardedPerYear =
    model.priceOfSync("gno", jar.chain) * gnoRewardsPerYear;
  const gnoAPY = (gnoValueRewardedPerYear / totalValueStaked) * 100;
  console.log("PING16")


  // const lpApr: number = await new SushiPolyPairManager().calculateLpApr(
  //   model,
  //   jar.depositToken.addr,
  // );
  console.log("PING17", sushiAPY, gnoAPY)

  return [
    createAprComponentImpl("sushi", sushiAPY, true, 0.958),
    createAprComponentImpl("gno", gnoAPY, true, 0.958),
  ];
}

export abstract class GnosisSushiJar extends AbstractJarBehavior {
  strategyAbi: any;
  constructor(strategyAbi: any) {
    super();
    this.strategyAbi = strategyAbi;
  }
  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    let chefAddress: string;
    let poolId: number;
    chefAddress = SUSHI_MINICHEF;
    poolId = gnosisSushiPoolIds[jar.depositToken.addr];
    console.log("DING")
    return this.getHarvestableUSDMasterchefCommsMgrImplementation(
      jar,
      model,
      ["sushi", "gno"],
      chefAddress,
      "pendingReward",
      poolId,
    );
  }

  async getProjectedAprStats(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    console.log("SING")
    return this.aprComponentsToProjectedApr(
      await calculateGnosisSushiAPY(definition, model),
    );
  }
}
