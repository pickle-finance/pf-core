import { BigNumber, ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { AssetProjectedApr, JarDefinition } from '../../model/PickleModelJson';
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { rallyChefAbi } from '../../Contracts/ABIs/rally-chef.abi';
import rallyRewardPoolsAbi from '../../Contracts/ABIs/rally-reward-pools.json';
import erc20Abi from '../../Contracts/ABIs/erc20.json';
import { PickleModel } from '../../model/PickleModel';
import { formatEther } from 'ethers/lib/utils';
import { AVERAGE_BLOCK_TIME, ONE_YEAR_SECONDS } from '../JarBehaviorResolver';
import { calculateUniswapLpApr } from '../../protocols/UniswapUtil';
import { PoolId } from '../../protocols/ProtocolUtil';
import { Provider as MulticallProvider, Contract as MulticallContract} from 'ethers-multicall';
import { ChainNetwork } from '../..';
import { Chains } from '../../chain/Chains';

const rallyIds: PoolId = {
  "0x27fD0857F0EF224097001E87e61026E39e1B04d1": 0,
};
export const RALLY_REWARD_POOLS = "0x9cf178df8ddb65b9ea7d4c2f5d1610eb82927230";

export class RlyEth extends AbstractJarBehavior {
    
  async getHarvestableUSD( jar: JarDefinition, model: PickleModel, resolver: Signer | Provider): Promise<number> {

    const rallyChef = new ethers.Contract(
      '0x9CF178df8DDb65B9ea7d4C2f5d1610eB82927230', // rallyChef addy
      rallyChefAbi, resolver);
      

    const rlyToken = new ethers.Contract(model.address("rly", jar.chain), erc20Abi, resolver);
    const [rly, rlyPrice, rlyBal] = await Promise.all([
      rallyChef.pendingRally(0, jar.details.strategyAddr),
      model.priceOfSync("rly"),
      rlyToken.balanceOf(jar.details.strategyAddr),
    ]);

    const rlyDecimals = model.tokenDecimals("rly", jar.chain);
    const harvestable = parseFloat(ethers.utils.formatUnits(rly.add(rlyBal), rlyDecimals));
    return harvestable * rlyPrice;
  }

  async getProjectedAprStats(definition: JarDefinition, model: PickleModel) : Promise<AssetProjectedApr> {

    const lp : number = await calculateUniswapLpApr(model, definition.depositToken.addr);
    const rallyApy = await this.calculateRallyApy(definition, model);
    return this.aprComponentsToProjectedApr([
      this.createAprComponent("lp", lp, false),
      this.createAprComponent("rally", rallyApy, true)
    ]);
  }


  async calculateRallyApy(jar: JarDefinition, model: PickleModel) : Promise<number> {
    const multicallProvider = model.multicallProviderFor(jar.chain);
    await multicallProvider.init();
    const multicallRallyRewardPools = new MulticallContract(
      RALLY_REWARD_POOLS, rallyRewardPoolsAbi);
    const lpToken = new MulticallContract(jar.depositToken.addr, erc20Abi);

    const poolId = rallyIds[jar.depositToken.addr];
    const [
      rlyPerBlockBN,
      totalAllocPointBN,
      poolInfo,
      totalSupplyBN,
    ] = await multicallProvider.all([
      multicallRallyRewardPools.rallyPerBlock(),
      multicallRallyRewardPools.totalAllocPoint(),
      multicallRallyRewardPools.poolInfo(poolId),
      lpToken.balanceOf(multicallRallyRewardPools.address),
    ]);

    const totalSupply = parseFloat(formatEther(totalSupplyBN));
    const rlyPerBlock =
      (parseFloat(formatEther(rlyPerBlockBN)) * poolInfo.allocPoint) /
      totalAllocPointBN.toNumber();
    const pricePerToken = jar.depositToken.price;
    const rlyPrice = model.priceOfSync("rly");
    const rlyRewardsPerYear =
    rlyPerBlock * (ONE_YEAR_SECONDS / AVERAGE_BLOCK_TIME);
    const valueRewardedPerYear = rlyPrice * rlyRewardsPerYear;

    const totalValueStaked = totalSupply * pricePerToken;
    const rlyAPY = valueRewardedPerYear / totalValueStaked;
    return rlyAPY;
  };
}
