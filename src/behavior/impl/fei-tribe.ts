import { BigNumber, ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { AssetProjectedApr, JarDefinition } from '../../model/PickleModelJson';
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import {feiAbi} from '../../Contracts/ABIs/fei-reward.abi';
import feiChefAbi from '../../Contracts/ABIs/feichef.json';
import erc20Abi from '../../Contracts/ABIs/erc20.json';
import { PickleModel } from '../../model/PickleModel';
import stakingRewardsAbi from '../../Contracts/ABIs/staking-rewards.json';
import { Provider as MulticallProvider, Contract as MulticallContract} from 'ethers-multicall';
import { Chains } from '../../chain/Chains';
import { formatEther } from 'ethers/lib/utils';
import { AVERAGE_BLOCK_TIME, ONE_YEAR_SECONDS } from '../JarBehaviorResolver';
import { getLivePairDataFromContracts } from '../../protocols/GenericSwapUtil';
import { calculateUniswapLpApr } from '../../protocols/UniswapUtil';

export const FEI_MASTERCHEF = "0x9e1076cC0d19F9B0b8019F384B0a29E48Ee46f7f";
export class FeiTribe extends AbstractJarBehavior {
  private rewardAddress = '0x18305DaAe09Ea2F4D51fAa33318be5978D251aBd';

  async getHarvestableUSD( jar: JarDefinition, model: PickleModel, resolver: Signer | Provider): Promise<number> {
    const rewards = new ethers.Contract(this.rewardAddress, feiAbi, resolver);
    const [tribe, tribePrice] = await Promise.all([rewards.earned(jar.details.strategyAddr), await model.priceOf('tribe-2')]);
    const harvestable = tribe.mul(tribePrice.toFixed());
    return parseFloat(ethers.utils.formatEther(harvestable));
  }

  async getProjectedAprStats(definition: JarDefinition, model: PickleModel) : Promise<AssetProjectedApr> {
    const tribe : number = await this.calculateFeiAPY(definition, model);
    const lp : number = await calculateUniswapLpApr(model, definition.depositToken.addr);

    return this.aprComponentsToProjectedApr([
      this.createAprComponent("lp", lp, false),
      this.createAprComponent("tribe", tribe, true)
    ]);
  }

  async calculateFeiAPY( jar:JarDefinition, model:PickleModel) : Promise<number> {
    const multicallProvider = new MulticallProvider(Chains.get(jar.chain).getPreferredWeb3Provider());
    await multicallProvider.init();

    const multicallFeichef = new MulticallContract(FEI_MASTERCHEF,feiChefAbi);
    const multicallLp = new MulticallContract(jar.depositToken.addr,erc20Abi);
  const [
      tribePerBlockBN,
      totalAllocPointBN,
      poolInfo,
      totalSupplyBN
    ] = await multicallProvider.all([
      multicallFeichef.tribePerBlock(),
      multicallFeichef.totalAllocPoint(),
      multicallFeichef.poolInfo(0), // poolId for FEI-TRIBE
      multicallLp.balanceOf(FEI_MASTERCHEF),
    ]);

    const totalSupply = parseFloat(formatEther(totalSupplyBN));
    const tribeRewardsPerBlock =
    (parseFloat(formatEther(tribePerBlockBN)) *
      0.9 *
      poolInfo.allocPoint.toNumber()) /
    totalAllocPointBN.toNumber();

    const { pricePerToken } = await getLivePairDataFromContracts(jar, model, 18);

    const tribeRewardsPerYear = tribeRewardsPerBlock * (ONE_YEAR_SECONDS / AVERAGE_BLOCK_TIME);
    const valueRewardedPerYear = model.priceOfSync("tribe") * tribeRewardsPerYear;

    const totalValueStaked = totalSupply * pricePerToken;
    const tribeAPY = 100*(valueRewardedPerYear / totalValueStaked);
    return tribeAPY;
  };
}
