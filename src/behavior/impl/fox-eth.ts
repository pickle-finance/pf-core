import { BigNumber, ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { AssetProjectedApr, JarDefinition } from '../../model/PickleModelJson';
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import {feiAbi} from '../../Contracts/ABIs/fei-reward.abi';
import { PickleModel } from '../../model/PickleModel';
import stakingRewardsAbi from '../../Contracts/ABIs/staking-rewards.json';
import { Provider as MulticallProvider, Contract as MulticallContract} from 'ethers-multicall';
import { Chains } from '../../chain/Chains';
import { formatEther } from 'ethers/lib/utils';
import { ONE_YEAR_SECONDS } from '../JarBehaviorResolver';
import { calculateUniswapLpApr } from '../../protocols/UniswapUtil';
import { getLivePairDataFromContracts } from '../../protocols/GenericSwapUtil';

export class FoxEth extends AbstractJarBehavior {
  private rewardAddress = '0xdd80e21669a664bce83e3ad9a0d74f8dad5d9e72';
  async getHarvestableUSD( jar: JarDefinition, model: PickleModel, resolver: Signer | Provider): Promise<number> {
    const rewards = new ethers.Contract(this.rewardAddress, feiAbi, resolver);
    const [fox, foxPrice] = await Promise.all<BigNumber, number>([
      rewards.earned(jar.details.strategyAddr),
      await model.priceOf('shapeshift-fox-token'),
    ]);
    const harvestable = fox.mul(foxPrice.toFixed());
    return parseFloat(ethers.utils.formatEther(harvestable));
  }

  async getProjectedAprStats(definition: JarDefinition, model: PickleModel) : Promise<AssetProjectedApr> {
    const fox : number = await this.calculateFoxAPY(this.rewardAddress, definition, model);
    const lp : number = await calculateUniswapLpApr(model, definition.depositToken.addr);

    return this.aprComponentsToProjectedApr([
      this.createAprComponent("lp", lp, false),
      this.createAprComponent("fox", fox, true)
    ]);
  }

  async calculateFoxAPY(rewardsAddress: string, jar:JarDefinition, model:PickleModel) : Promise<number> {
    const multicallProvider = model.multicallProviderFor(jar.chain);
    await multicallProvider.init();

    const multicallUniStakingRewards = new MulticallContract(rewardsAddress, stakingRewardsAbi,);

    const [
      rewardRateBN,
      totalSupplyBN,
    ] = await multicallProvider.all([
      multicallUniStakingRewards.rewardRate(),
      multicallUniStakingRewards.totalSupply(),
    ]);

    const totalSupply = parseFloat(formatEther(totalSupplyBN));
    const foxRewardRate = parseFloat(formatEther(rewardRateBN));

    const { pricePerToken } = await getLivePairDataFromContracts(jar, model, 18);

    const foxRewardsPerYear = foxRewardRate * ONE_YEAR_SECONDS;
    const valueRewardedPerYear = await model.priceOf("fox") * foxRewardsPerYear;

    const totalValueStaked = totalSupply * pricePerToken;
    const foxAPY = valueRewardedPerYear / totalValueStaked;
    return foxAPY * 100;
  }

}
