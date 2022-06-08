import { Chains } from "../chain/Chains";
import { PickleModel } from "../model/PickleModel";
import { AssetAprComponent, JarDefinition } from "../model/PickleModelJson";
import { Contract } from "ethers-multiprovider";
import controllerAbi from "../Contracts/ABIs/controller.json";
import erc20Abi from "../Contracts/ABIs/erc20.json";
import strategyAbi from "../Contracts/ABIs/strategy.json";
import MasterchefAbi from "../Contracts/ABIs/masterchef.json";
import { formatEther } from "ethers/lib/utils";
import { ONE_YEAR_IN_SECONDS } from "../behavior/AbstractJarBehavior";
import { getLivePairDataFromContracts } from "./GenericSwapUtil";
import { ExternalTokenModelSingleton } from "../price/ExternalTokenModel";

export async function calculateMasterChefRewardsAPR(
  jar: JarDefinition,
  model: PickleModel,
): Promise<AssetAprComponent> {
  const controllerAddr = model.controllerForJar(jar);
  if (!controllerAddr) {
    return undefined;
  }

  const pptPromise = getLivePairDataFromContracts(jar, model, 18);
  const multiProvider = model.multiproviderFor(jar.chain);
  const controller = new Contract(controllerAddr, controllerAbi);
  const [strategyAddr] = await multiProvider.all([
    controller.strategies(jar.depositToken.addr),
  ]);

  const strategyContract = new Contract(strategyAddr, strategyAbi);
  const [masterchefAddress, poolId, rewardTokenAddress] =
    await multiProvider.all([
      strategyContract.masterChef(),
      strategyContract.poolId(),
      strategyContract.rewardToken(),
    ]);

  const multicallMasterchef = new Contract(masterchefAddress, MasterchefAbi);

  const lpToken = new Contract(jar.depositToken.addr, erc20Abi);

  const [sushiPerBlockBN, totalAllocPointBN, poolInfo, totalSupplyBN] =
    await multiProvider.all([
      multicallMasterchef.rewardPerBlock(),
      multicallMasterchef.totalAllocPoint(),
      multicallMasterchef.poolInfo(poolId),
      lpToken.balanceOf(masterchefAddress),
    ]);

  const totalSupply = parseFloat(formatEther(totalSupplyBN));
  const rewardsPerBlock =
    (parseFloat(formatEther(sushiPerBlockBN)) *
      0.9 *
      poolInfo.allocPoint.toNumber()) /
    totalAllocPointBN.toNumber();

  // TODO move average block time to the chain??
  const avgBlockTime = Chains.get(jar.chain).secondsPerBlock;
  const rewardsPerYear = rewardsPerBlock * (ONE_YEAR_IN_SECONDS / avgBlockTime);
  const rewardTokenPrice = model.priceOfSync(rewardTokenAddress, jar.chain);
  let rewardTokenName =
    ExternalTokenModelSingleton.findTokenFromContract(rewardTokenAddress)?.id;
  if (rewardTokenName === undefined) rewardTokenName = "Reward-Token";
  const valueRewardedPerYear = rewardTokenPrice * rewardsPerYear;

  const { pricePerToken } = await pptPromise;
  const totalValueStaked = totalSupply * pricePerToken;
  const rewardAPR = (100 * valueRewardedPerYear) / totalValueStaked;
  return { name: rewardTokenName, apr: rewardAPR, compoundable: true };
}
