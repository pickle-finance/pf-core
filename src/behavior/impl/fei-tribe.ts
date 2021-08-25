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
import { calculateUniswapLpApr, getUniPairData } from '../../protocols/UniswapUtil';

export class FeiTribe extends AbstractJarBehavior {
  private rewardAddress = '0x18305DaAe09Ea2F4D51fAa33318be5978D251aBd';

  async getHarvestableUSD( jar: JarDefinition, model: PickleModel, resolver: Signer | Provider): Promise<number> {
    const rewards = new ethers.Contract(this.rewardAddress, feiAbi, resolver);
    const [tribe, tribePrice] = await Promise.all([rewards.earned(jar.details.strategyAddr), model.prices.get('tribe-2')]);
    const harvestable = tribe.mul(tribePrice.toFixed());
    return parseFloat(ethers.utils.formatEther(harvestable));
  }

  async getProjectedAprStats(definition: JarDefinition, model: PickleModel) : Promise<AssetProjectedApr> {
    const tribe : number = await this.calculateFeiAPY(this.rewardAddress, definition, model);
    const lp : number = await calculateUniswapLpApr(model, definition.depositToken.addr);

    return this.aprComponentsToProjectedApr([
      this.createAprComponent("lp", lp, false),
      this.createAprComponent("tribe", tribe, true)
    ]);
  }

  async calculateFeiAPY(rewardsAddress: string, jar:JarDefinition, model:PickleModel) : Promise<number> {
    const multicallProvider = new MulticallProvider(Chains.get(jar.chain).getPreferredWeb3Provider());
    await multicallProvider.init();

    const multicallUniStakingRewards = new MulticallContract(rewardsAddress, stakingRewardsAbi);
    const [
      rewardRateBN,
      totalSupplyBN,
    ] = await multicallProvider.all([
      multicallUniStakingRewards.rewardRate(),
      multicallUniStakingRewards.totalSupply(),
    ]);

    const totalSupply = parseFloat(formatEther(totalSupplyBN));
    const tribeRewardRate = parseFloat(formatEther(rewardRateBN));

    const { pricePerToken } = await getUniPairData(jar, model, Chains.get(jar.chain).getPreferredWeb3Provider());

    const tribeRewardsPerYear = tribeRewardRate * ONE_YEAR_SECONDS;
    const valueRewardedPerYear = model.prices.get("tribe") * tribeRewardsPerYear;

    const totalValueStaked = totalSupply * pricePerToken;
    const tribeAPY = valueRewardedPerYear / totalValueStaked;
    return tribeAPY * 100;
  };
}
