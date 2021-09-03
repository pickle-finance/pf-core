
import { BigNumber, Contract, ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { AssetProjectedApr, JarDefinition } from '../../model/PickleModelJson';
import { AbstractJarBehavior, ONE_YEAR_IN_SECONDS } from "../AbstractJarBehavior";
import {ironchefAbi} from '../../Contracts/ABIs/ironchef.abi';
import { CONTROLLER_ETH, CONTROLLER_POLYGON, PickleModel } from '../../model/PickleModel';
import { formatEther } from 'ethers/lib/utils';
import { ChainNetwork } from '../..';
import { Chains } from '../../chain/Chains';
import controllerAbi from '../../Contracts/ABIs/controller.json';
import strategyAbi from "../../Contracts/ABIs/strategy.json";
import { Provider as MulticallProvider, Contract as MulticallContract} from 'ethers-multicall';
import erc20Abi from '../../Contracts/ABIs/erc20.json';

export class Is3Usd extends AbstractJarBehavior {
  async getHarvestableUSD( jar: JarDefinition, model: PickleModel, resolver: Signer | Provider): Promise<number> {
    const ironchef = new ethers.Contract('0x1fd1259fa8cdc60c6e8c86cfa592ca1b8403dfad', ironchefAbi, resolver);
    const [ice, icePrice] = await Promise.all([
      ironchef.pendingReward(0, jar.details.strategyAddr),
      await model.priceOf('iron-finance'),
    ]);

    const harvestable = ice.mul(BigNumber.from((icePrice * 1e18).toFixed())).div((1e18).toFixed());
    return parseFloat(ethers.utils.formatEther(harvestable)); 
  }
  async getProjectedAprStats(jar: JarDefinition, model: PickleModel) : Promise<AssetProjectedApr> {
    return this.aprComponentsToProjectedApr([
      this.createAprComponent("ice", await this.calculateIronChefAPY(jar, model), true)
    ]);
  }
  async calculateIronChefAPY(jar: JarDefinition, model: PickleModel) : Promise<number> {
    let controllerAddr = jar.details.controller ? jar.details.controller :
    jar.chain === ChainNetwork.Ethereum ? CONTROLLER_ETH : 
    jar.chain === ChainNetwork.Polygon ? CONTROLLER_POLYGON :
    undefined;


    if( !controllerAddr ) {
        return undefined;    
    }
    const resolver: Provider = Chains.get(jar.chain).getPreferredWeb3Provider();
    const controller = new Contract(controllerAddr, controllerAbi, resolver);

    const multicallProvider = new MulticallProvider(resolver);
    await multicallProvider.init();

    const jarStrategy = await controller.strategies(jar.depositToken.addr);
    const strategyContract = new Contract(jarStrategy, strategyAbi, resolver);
    const ironchefAddress = await strategyContract.ironchef();
    const poolId = await strategyContract.poolId();
    const pricePerToken = 1;

    const multicallIronchef = new MulticallContract(
      ironchefAddress,ironchefAbi);
    const lpToken = new MulticallContract(jar.depositToken.addr,erc20Abi);

    const [
        icePerSecondBN,
        totalAllocPointBN,
        poolInfo,
        totalSupplyBN,
    ] = await multicallProvider.all([
        multicallIronchef.rewardPerSecond(),
        multicallIronchef.totalAllocPoint(),
        multicallIronchef.poolInfo(poolId),
        lpToken.balanceOf(ironchefAddress),
    ]);

    const totalSupply = parseFloat(formatEther(totalSupplyBN));
    const icePerSecond =
        (parseFloat(formatEther(icePerSecondBN)) *
        poolInfo.allocPoint.toNumber()) /
        totalAllocPointBN.toNumber();


    const iceRewardsPerYear = icePerSecond * ONE_YEAR_IN_SECONDS;
    const valueRewardedPerYear = (await model.priceOf("ice")) * iceRewardsPerYear;

    const totalValueStaked = totalSupply * pricePerToken;
    const iceAPR = valueRewardedPerYear / totalValueStaked;
    return iceAPR * 100;
  }
}
