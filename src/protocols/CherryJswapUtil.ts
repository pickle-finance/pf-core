import erc20Abi from "../Contracts/ABIs/erc20.json";
import { Contract as MulticallContract } from "ethers-multicall";
import { formatEther } from "ethers/lib/utils";
import { Chains, PickleModel } from "..";
import { JarDefinition } from "../model/PickleModelJson";
import { PoolId } from "./ProtocolUtil";
import cherryChefAbi from "../Contracts/ABIs/cherrychef.json";
import jswapchefAbi from "../Contracts/ABIs/jswapchef.json";

export const CHERRYCHEF = "0x8cddB4CD757048C4380ae6A69Db8cD5597442f7b";
export const JSWAPCHEF = "0x83C35EA2C32293aFb24aeB62a14fFE920C2259ab";
const cherryPoolIds: PoolId = {
  "0x8E68C0216562BCEA5523b27ec6B9B6e1cCcBbf88": 1,
  "0x089dedbFD12F2aD990c55A2F1061b8Ad986bFF88": 2,
  "0x94E01843825eF85Ee183A711Fa7AE0C5701A731a": 4,
  "0x407F7a2F61E5bAB199F7b9de0Ca330527175Da93": 5, // Gone for now
  "0xF3098211d012fF5380A03D80f150Ac6E5753caA8": 3,
  "0xb6fCc8CE3389Aa239B2A5450283aE9ea5df9d1A9": 23, // Gone for now
};

const jswapPoolIds: PoolId = {
  "0x838a7a7f3e16117763c109d98c79ddcd69f6fd6e": 0,
  "0xeb02a695126b998e625394e43dfd26ca4a75ce2b": 1,
  "0x8009edebbbdeb4a3bb3003c79877fcd98ec7fb45": 4,
  "0xe9313b7dea9cbabd2df710c25bef44a748ab38a9": 29,
  "0xa25e1c05c58ede088159cc3cd24f49445d0be4b2": 42,
};

export async function calculateCherryAPY(
  jar: JarDefinition,
  model: PickleModel,
) {
  const multicallProvider = model.multicallProviderFor(jar.chain);
  await multicallProvider.init();
  const poolId = cherryPoolIds[jar.depositToken.addr];
  const multicallCherrychef = new MulticallContract(CHERRYCHEF, cherryChefAbi);
  const lpToken = new MulticallContract(jar.depositToken.addr, erc20Abi);
  const [
    cherryPerBlockBN,
    totalAllocPointBN,
    poolInfo,
    bonusMultiplierBN,
    totalSupplyBN,
  ] = await multicallProvider.all([
    multicallCherrychef.cherryPerBlock(),
    multicallCherrychef.totalAllocPoint(),
    multicallCherrychef.poolInfo(poolId),
    multicallCherrychef.BONUS_MULTIPLIER(),
    lpToken.balanceOf(CHERRYCHEF),
  ]);
  const totalSupply = parseFloat(formatEther(totalSupplyBN));
  const rewardsPerBlock =
    (parseFloat(formatEther(cherryPerBlockBN)) *
      poolInfo.allocPoint.toNumber() *
      parseFloat(bonusMultiplierBN.toString())) /
    totalAllocPointBN.toNumber();
  const pricePerToken = model.priceOfSync(jar.depositToken.addr, jar.chain);
  const rewardsPerYear =
    rewardsPerBlock *
    ((360 * 24 * 60 * 60) / Chains.get(jar.chain).secondsPerBlock);

  const valueRewardedPerYear = model.priceOfSync("cherry", jar.chain) * rewardsPerYear;

  const totalValueStaked = totalSupply * pricePerToken;
  const cherryAPY = valueRewardedPerYear / totalValueStaked;
  return [{ name: "cherry", apr: cherryAPY * 100, compoundable: true }];
}

export async function calculateJswapAPY(
  jar: JarDefinition,
  model: PickleModel,
) {
  const multicallProvider = model.multicallProviderFor(jar.chain);
  await multicallProvider.init();
  const poolId = jswapPoolIds[jar.depositToken.addr.toLowerCase()];
  const multicallJswapchef = new MulticallContract(JSWAPCHEF, jswapchefAbi);
  const lpToken = new MulticallContract(jar.depositToken.addr, erc20Abi);

  const [jfPerBlockBN, totalAllocPointBN, poolInfo, totalSupplyBN] =
    await multicallProvider.all([
      multicallJswapchef.jfPerBlock(),
      multicallJswapchef.totalAllocPoint(),
      multicallJswapchef.poolInfo(poolId),
      lpToken.balanceOf(JSWAPCHEF),
    ]);

  const totalSupply = parseFloat(formatEther(totalSupplyBN));
  const rewardsPerBlock =
    (parseFloat(formatEther(jfPerBlockBN)) * poolInfo.allocPoint.toNumber()) /
    totalAllocPointBN.toNumber();

  const pricePerToken = model.priceOfSync(jar.depositToken.addr, jar.chain);

  const rewardsPerYear =
    rewardsPerBlock *
    ((360 * 24 * 60 * 60) / Chains.get(jar.chain).secondsPerBlock);

  const valueRewardedPerYear = model.priceOfSync("jswap", jar.chain) * rewardsPerYear;

  const totalValueStaked = totalSupply * pricePerToken;

  // scaling factor applied to achieve same numbers on jswap's site
  const jswapAPY = (valueRewardedPerYear * 1.35) / totalValueStaked;

  return [{ name: "jswap", apr: jswapAPY * 100, compoundable: true }];
}
