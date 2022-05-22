import {
  AssetProjectedApr,
  JarDefinition,
  AssetAprComponent,
} from "../../model/PickleModelJson";
import {
  AbstractJarBehavior,
  createAprComponentImpl,
} from "../AbstractJarBehavior";
import { PoolId } from "../../protocols/ProtocolUtil";
import { Contract as MultiContract } from "ethers-multicall";
import { PickleModel } from "../../model/PickleModel";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import sushiMiniChefAbi from "../../Contracts/ABIs/sushi-minichef.json";
import sushiComplexRewarderAbi from "../../Contracts/ABIs/sushi-complex-rewarder.json";
import { sushiStrategyAbi } from "../../Contracts/ABIs/sushi-strategy.abi";
import { formatEther, defaultAbiCoder } from "ethers/lib/utils";
import { ONE_YEAR_IN_SECONDS } from "../../behavior/AbstractJarBehavior";
import { Contract } from "ethers";
import { Chains } from "../../chain/Chains";

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

  const [
    sushiPerSecondBN,
    totalAllocPointBN,
    poolInfo,
    totalSupplyBN,
    rewarder,
  ] = await model.callMulti(
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
  const sushiRewardsPerSecond =
    (parseFloat(formatEther(sushiPerSecondBN)) *
      poolInfo.allocPoint.toNumber()) /
    totalAllocPointBN.toNumber();

  const pricePerToken = model.priceOfSync(jar.depositToken.addr, jar.chain);

  const sushiRewardsPerYear = sushiRewardsPerSecond * ONE_YEAR_IN_SECONDS;

  const valueRewardedPerYear =
    model.priceOfSync("sushi", jar.chain) * sushiRewardsPerYear;

  const totalValueStaked = totalSupply * pricePerToken;

  const sushiAPY = (valueRewardedPerYear / totalValueStaked) * 100;

  // Getting GNO rewards
  const provider = model.providerFor(jar.chain);

  const totalAllocPointCREncoded = await provider.getStorageAt(
    GNO_COMPLEX_REWARDER,
    5,
  );

  const rewarderContract = new MultiContract(
    GNO_COMPLEX_REWARDER,
    sushiComplexRewarderAbi,
  );

  const [poolInfoCR, gnoPerSecondBN] = await model.callMulti(
    [
      () => rewarderContract.poolInfo(poolId),
      () => rewarderContract.rewardPerSecond(),
    ],
    jar.chain,
  );

  const totalAllocPointCR = defaultAbiCoder.decode(
    ["uint256"],
    totalAllocPointCREncoded,
  );

  const gnoRewardsPerSecond =
    (parseFloat(formatEther(gnoPerSecondBN)) *
      poolInfoCR.allocPoint.toNumber()) /
    totalAllocPointCR[0].toNumber();

  const gnoRewardsPerYear = gnoRewardsPerSecond * (365 * 24 * 60 * 60);

  const gnoValueRewardedPerYear =
    model.priceOfSync("gno", jar.chain) * gnoRewardsPerYear;
  const gnoAPY = (gnoValueRewardedPerYear / totalValueStaked) * 100;

  return [
    createAprComponentImpl(
      "sushi",
      sushiAPY,
      true,
      1 - Chains.get(jar.chain).defaultPerformanceFee,
    ),
    createAprComponentImpl(
      "gno",
      gnoAPY,
      true,
      1 - Chains.get(jar.chain).defaultPerformanceFee,
    ),
  ];
}

export class GnosisSushiJar extends AbstractJarBehavior {
  protected strategyAbi: any;

  constructor() {
    super();
    this.strategyAbi = sushiStrategyAbi;
  }
  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    const chefAddress = SUSHI_MINICHEF;
    const poolId = gnosisSushiPoolIds[jar.depositToken.addr];
    let extraRewardsValue = 0;
    try {
      // Check if there is a rewarder for this pool, call can fail if no provider, so we use normal ethers provider
      const provider = model.providerFor(jar.chain);
      const mcContract = new Contract(chefAddress, sushiMiniChefAbi, provider);
      const rewarderAddr = await model.call(
        () => mcContract.rewarder(poolId),
        jar.chain,
        true,
      );
      const rewarderContract = new MultiContract(
        rewarderAddr,
        sushiComplexRewarderAbi,
      );
      const pendingGnoBN = await model.callMulti(
        () => rewarderContract.pendingToken(poolId, jar.details.strategyAddr),
        jar.chain,
      );
      const gnoPrice = model.priceOfSync("gno", jar.chain);
      const pendingGnoValue = gnoPrice * parseFloat(formatEther(pendingGnoBN));
      extraRewardsValue += pendingGnoValue;
    } catch (error) {
      // ignore, an error here means no rewarder found
    }
    const totalHarvestable =
      await this.getHarvestableUSDMasterchefCommsMgrImplementation(
        jar,
        model,
        ["sushi"],
        chefAddress,
        "pendingSushi",
        poolId,
      );

    return totalHarvestable + extraRewardsValue;
  }

  async getProjectedAprStats(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    return this.aprComponentsToProjectedApr(
      await calculateGnosisSushiAPY(definition, model),
    );
  }
}
