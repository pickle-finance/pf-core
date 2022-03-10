import { PoolId } from "./ProtocolUtil";
import { Contract as MultiContract } from "ethers-multicall";
import { AssetAprComponent, JarDefinition } from "../model/PickleModelJson";
import { PickleModel } from "..";
import erc20Abi from "../Contracts/ABIs/erc20.json";
import sushiMiniChefAbi from "../Contracts/ABIs/sushi-minichef.json";
import sushiComplexRewarderAbi from "../Contracts/ABIs/sushi-complex-rewarder.json";
import { formatEther, defaultAbiCoder } from "ethers/lib/utils";
import { ONE_YEAR_IN_SECONDS } from "../behavior/AbstractJarBehavior";
import { getLivePairDataFromContracts } from "./GenericSwapUtil";
import { SushiPolyPairManager } from "./SushiSwapUtil";

// Should combine this with the Polygon Sushi utils later...

export const SUSHI_MINICHEF = "0x67dA5f2FfaDDfF067AB9d5F025F8810634d84287";
export const ONE_COMPLEX_REWARDER =
  "0x25836011Bbc0d5B6db96b20361A474CbC5245b45";

const harmonySushiPoolIds: PoolId = {
  "0xeb049F1eD546F8efC3AD57f6c7D22F081CcC7375": 3,
  "0x39bE7c95276954a6f7070F9BAa38db2123691Ed0": 10,
  "0xc5B8129B411EF5f5BE22e74De6fE86C3b69e641d": 15,
};

export async function calculateHarmonySushiAPY(
  jar: JarDefinition,
  model: PickleModel,
): Promise<AssetAprComponent[]> {
  const poolId = harmonySushiPoolIds[jar.depositToken.addr];
  const multicallsushiMinichef = new MultiContract(
    SUSHI_MINICHEF,
    sushiMiniChefAbi,
  );
  const lpToken = new MultiContract(jar.depositToken.addr, erc20Abi);

  const [sushiPerSecondBN, totalAllocPointBN, poolInfo, totalSupplyBN] =
    await model.callMulti(
      [
        () => multicallsushiMinichef.sushiPerSecond(),
        () => multicallsushiMinichef.totalAllocPoint(),
        () => multicallsushiMinichef.poolInfo(poolId),
        () => lpToken.balanceOf(SUSHI_MINICHEF),
      ],
      jar.chain,
    );

  const totalSupply = parseFloat(formatEther(totalSupplyBN));
  const sushiRewardsPerSecond =
    (parseFloat(formatEther(sushiPerSecondBN)) *
      poolInfo.allocPoint.toNumber()) /
    totalAllocPointBN.toNumber();

  const { pricePerToken } = await getLivePairDataFromContracts(jar, model, 18);

  const sushiRewardsPerYear = sushiRewardsPerSecond * ONE_YEAR_IN_SECONDS;
  const valueRewardedPerYear =
    model.priceOfSync("sushi", jar.chain) * sushiRewardsPerYear;

  const totalValueStaked = totalSupply * pricePerToken;
  const sushiAPY = (valueRewardedPerYear / totalValueStaked) * 100;

  // Getting ONE rewards
  const provider = model.providerFor(jar.chain);
  const totalAllocPointCREncoded = await provider.getStorageAt(
    ONE_COMPLEX_REWARDER,
    5,
  );
  const [poolInfoCR, onePerSecondBN] = await model.callMulti(
    [
      () =>
        new MultiContract(
          ONE_COMPLEX_REWARDER,
          sushiComplexRewarderAbi,
        ).poolInfo(poolId),
      () =>
        new MultiContract(
          ONE_COMPLEX_REWARDER,
          sushiComplexRewarderAbi,
        ).rewardPerSecond(),
    ],
    jar.chain,
  );

  const totalAllocPointCR = defaultAbiCoder.decode(
    ["uint256"],
    totalAllocPointCREncoded,
  );

  const oneRewardsPerSecond =
    (parseFloat(formatEther(onePerSecondBN)) *
      poolInfoCR.allocPoint.toNumber()) /
    totalAllocPointCR[0].toNumber();

  const oneRewardsPerYear = oneRewardsPerSecond * (365 * 24 * 60 * 60);
  const oneValueRewardedPerYear =
    model.priceOfSync("one", jar.chain) * oneRewardsPerYear;
  const oneAPY = (oneValueRewardedPerYear / totalValueStaked) * 100;

  const lpApr: number = await new SushiPolyPairManager().calculateLpApr(
    model,
    jar.depositToken.addr,
  );
  return [
    { name: "sushi", apr: sushiAPY, compoundable: true },
    { name: "gno", apr: oneAPY, compoundable: true },
    { name: "lp", apr: lpApr, compoundable: false },
  ];
}
