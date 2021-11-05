import { PoolId } from "./ProtocolUtil";
import { Contract as MulticallContract } from "ethers-multicall";
import { AssetAprComponent, JarDefinition } from "../model/PickleModelJson";
import { PickleModel } from "..";
import erc20Abi from "../Contracts/ABIs/erc20.json";
import sushiMiniChefAbi from "../Contracts/ABIs/sushi-minichef.json";
import sushiComplexRewarderAbi from "../Contracts/ABIs/sushi-complex-rewarder.json";
import { formatEther, defaultAbiCoder } from "ethers/lib/utils";
import { ONE_YEAR_IN_SECONDS } from "../behavior/AbstractJarBehavior";
import { getLivePairDataFromContracts } from "./GenericSwapUtil";
import { SushiPolyPairManager } from "./SushiSwapUtil";

export const SUSHI_MINICHEF = "0x0769fd68dFb93167989C6f7254cd0D766Fb2841F";
export const MATIC_COMPLEX_REWARDER =
  "0xa3378Ca78633B3b9b2255EAa26748770211163AE";

const polySushiPoolIds: PoolId = {
  "0x57602582eB5e82a197baE4E8b6B80E39abFC94EB": 37,
  "0xc2755915a85c6f6c1c0f3a86ac8c058f11caa9c9": 2,
  "0xc4e595acdd7d12fec385e5da5d43160e8a0bac0e": 0,
};

export async function calculatePolySushiAPY(
  jar: JarDefinition,
  model: PickleModel,
): Promise<AssetAprComponent[]> {
  const multicallProvider = model.multicallProviderFor(jar.chain);
  try {
    await multicallProvider.init();
  } catch (e) {
    console.log("calculatePolySushiAPY: " + e);
  }

  const poolId = polySushiPoolIds[jar.depositToken.addr];
  const multicallsushiMinichef = new MulticallContract(
    SUSHI_MINICHEF,
    sushiMiniChefAbi,
  );
  const lpToken = new MulticallContract(jar.depositToken.addr, erc20Abi);

  const [sushiPerSecondBN, totalAllocPointBN, poolInfo, totalSupplyBN] =
    await multicallProvider.all([
      multicallsushiMinichef.sushiPerSecond(),
      multicallsushiMinichef.totalAllocPoint(),
      multicallsushiMinichef.poolInfo(poolId),
      lpToken.balanceOf(SUSHI_MINICHEF),
    ]);

  const totalSupply = parseFloat(formatEther(totalSupplyBN));
  const sushiRewardsPerSecond =
    (parseFloat(formatEther(sushiPerSecondBN)) *
      poolInfo.allocPoint.toNumber()) /
    totalAllocPointBN.toNumber();

  const { pricePerToken } = await getLivePairDataFromContracts(jar, model, 18);

  const sushiRewardsPerYear = sushiRewardsPerSecond * ONE_YEAR_IN_SECONDS;
  const valueRewardedPerYear =
    (await model.priceOf("sushi")) * sushiRewardsPerYear;

  const totalValueStaked = totalSupply * pricePerToken;
  const sushiAPY = (valueRewardedPerYear / totalValueStaked) * 100;

  // Getting MATIC rewards
  const provider = model.providerFor(jar.chain);
  const totalAllocPointCREncoded = await provider.getStorageAt(MATIC_COMPLEX_REWARDER, 5);
    const [
        poolInfoCR,
        maticPerSecondBN,
    ] = await multicallProvider.all([
        new MulticallContract(MATIC_COMPLEX_REWARDER, sushiComplexRewarderAbi).poolInfo(poolId),
        new MulticallContract(MATIC_COMPLEX_REWARDER, sushiComplexRewarderAbi).rewardPerSecond(),
    ]);

    const totalAllocPointCR = defaultAbiCoder.decode(
        ["uint256"],
        totalAllocPointCREncoded,
    );

    const maticRewardsPerSecond =
        (parseFloat(formatEther(maticPerSecondBN)) *
          poolInfoCR.allocPoint.toNumber()) /
        totalAllocPointCR[0].toNumber();

   const maticRewardsPerYear = maticRewardsPerSecond * (365 * 24 * 60 * 60);
   const maticValueRewardedPerYear = model.priceOfSync("matic") * maticRewardsPerYear;
   const maticAPY = (maticValueRewardedPerYear / totalValueStaked) * 100;


  const lpApr: number = await new SushiPolyPairManager().calculateLpApr(
    model,
    jar.depositToken.addr,
  );
  return [
    { name: "sushi", apr: sushiAPY, compoundable: true },
    { name: "matic", apr: maticAPY, compoundable: true },
    { name: "lp", apr: lpApr, compoundable: false },
  ];
}
