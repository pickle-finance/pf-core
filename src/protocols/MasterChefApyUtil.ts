import { ChainNetwork, Chains } from "../chain/Chains";
import { PickleModel } from "../model/PickleModel";
import { AssetAprComponent, JarDefinition } from "../model/PickleModelJson";
import { Contract } from 'ethers';
import { Provider as MulticallProvider, Contract as MulticallContract} from 'ethers-multicall';
import controllerAbi from '../Contracts/ABIs/controller.json';
import erc20Abi from '../Contracts/ABIs/erc20.json';
import strategyAbi from "../Contracts/ABIs/strategy.json";
import MasterchefAbi from '../Contracts/ABIs/masterchef.json';
import { Provider } from '@ethersproject/providers';
import { formatEther } from "ethers/lib/utils";
import { AVERAGE_BLOCK_TIME, AVERAGE_BLOCK_TIME_POLYGON } from "../behavior/JarBehaviorResolver";
import { ONE_YEAR_IN_SECONDS } from "../behavior/AbstractJarBehavior";
import { getLivePairDataFromContracts } from "./GenericSwapUtil";
import { ExternalTokenModelSingleton } from "../price/ExternalTokenModel";

export async function calculateMasterChefRewardsAPR(jar: JarDefinition, 
  model: PickleModel) : Promise<AssetAprComponent> {
    let controllerAddr = model.controllerForJar(jar);
    if( !controllerAddr ) {
        return undefined;    
    }

    const resolver: Provider = Chains.get(jar.chain).getPreferredWeb3Provider();
    const controller = new Contract(controllerAddr, controllerAbi, resolver);
    const jarStrategy = await controller.strategies(jar.depositToken.addr);
    const strategyContract = new Contract(jarStrategy, strategyAbi, resolver);
    const masterchefAddress = await strategyContract.masterChef();
    const poolId = await strategyContract.poolId();
    const rewardTokenAddress = await strategyContract.rewardToken();


    const multicallProvider = model.multicallProviderFor(jar.chain);
    await multicallProvider.init();


    const multicallMasterchef = new MulticallContract(
        masterchefAddress,MasterchefAbi);

    const lpToken = new MulticallContract(jar.depositToken.addr,erc20Abi);

    const [
      sushiPerBlockBN,
      totalAllocPointBN,
      poolInfo,
      totalSupplyBN,
    ] = await multicallProvider.all([
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

    const { pricePerToken } = await getLivePairDataFromContracts(jar, model, 18);

    // TODO move average block time to the chain??
    const avgBlockTime = jar.chain === ChainNetwork.Ethereum ? AVERAGE_BLOCK_TIME : AVERAGE_BLOCK_TIME_POLYGON;
    const rewardsPerYear =
        rewardsPerBlock * (ONE_YEAR_IN_SECONDS / avgBlockTime);
    const rewardTokenPrice = await model.priceOf(rewardTokenAddress);
    let rewardTokenName = ExternalTokenModelSingleton.findTokenFromContract(rewardTokenAddress)?.id;
    if( rewardTokenName === undefined ) 
      rewardTokenName = "Reward-Token";
    const valueRewardedPerYear = rewardTokenPrice * rewardsPerYear;

    const totalValueStaked = totalSupply * pricePerToken;
    const rewardAPR = 100*valueRewardedPerYear / totalValueStaked;
    return {name: rewardTokenName, apr: rewardAPR, compoundable: true};
};
