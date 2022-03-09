import { Chains } from "../chain/Chains";
import { PickleModel } from "../model/PickleModel";
import { AssetAprComponent, JarDefinition } from "../model/PickleModelJson";
import { Contract as MultiContract } from "ethers-multicall";
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

  const controller = new MultiContract(controllerAddr, controllerAbi);
  const strategyAddr = await model.comMan.call(
    () => controller.strategies(jar.depositToken.addr),
    jar.chain,
  );
  const strategyContract = new MultiContract(strategyAddr, strategyAbi);
  const [masterchefAddress, poolId, rewardTokenAddress] =
    await model.comMan.call(
      [
        () => strategyContract.masterChef(),
        () => strategyContract.poolId(),
        () => strategyContract.rewardToken(),
      ],
      jar.chain,
    );

  const multicallMasterchef = new MultiContract(
    masterchefAddress,
    MasterchefAbi,
  );

  const lpToken = new MultiContract(jar.depositToken.addr, erc20Abi);

  const [sushiPerBlockBN, totalAllocPointBN, poolInfo, totalSupplyBN] =
    await model.comMan.call(
      [
        () => multicallMasterchef.rewardPerBlock(),
        () => multicallMasterchef.totalAllocPoint(),
        () => multicallMasterchef.poolInfo(poolId),
        () => lpToken.balanceOf(masterchefAddress),
      ],
      jar.chain,
    );

  const totalSupply = parseFloat(formatEther(totalSupplyBN));
  const rewardsPerBlock =
    (parseFloat(formatEther(sushiPerBlockBN)) *
      0.9 *
      poolInfo.allocPoint.toNumber()) /
    totalAllocPointBN.toNumber();

  const { pricePerToken } = await getLivePairDataFromContracts(jar, model, 18);

  // TODO move average block time to the chain??
  const avgBlockTime = Chains.get(jar.chain).secondsPerBlock;
  const rewardsPerYear = rewardsPerBlock * (ONE_YEAR_IN_SECONDS / avgBlockTime);
  const rewardTokenPrice = model.priceOfSync(rewardTokenAddress, jar.chain);
  let rewardTokenName =
    ExternalTokenModelSingleton.findTokenFromContract(rewardTokenAddress)?.id;
  if (rewardTokenName === undefined) rewardTokenName = "Reward-Token";
  const valueRewardedPerYear = rewardTokenPrice * rewardsPerYear;

  const totalValueStaked = totalSupply * pricePerToken;
  const rewardAPR = (100 * valueRewardedPerYear) / totalValueStaked;
  return { name: rewardTokenName, apr: rewardAPR, compoundable: true };
}
