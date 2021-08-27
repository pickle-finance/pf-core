import { BigNumber, ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { AssetProjectedApr, JarDefinition } from '../../model/PickleModelJson';
import { AbstractJarBehavior, ONE_YEAR_IN_SECONDS } from "../AbstractJarBehavior";
import erc20Abi from '../../Contracts/ABIs/erc20.json';
import stakingRewardsAbi from '../../Contracts/ABIs/staking-rewards.json';
import { PickleModel } from '../../model/PickleModel';
import { Provider as MulticallProvider, Contract as MulticallContract} from 'ethers-multicall';
import { Chains } from '../../chain/Chains';
import { formatEther } from 'ethers/lib/utils';
import { getLivePairDataFromContracts, IPairData } from '../../protocols/GenericSwapUtil';
import { ComethPairManager } from '../../protocols/ComethUtil';

export abstract class ComethJar extends AbstractJarBehavior {
  strategyAbi : any;
  rewardAddress: string;
  constructor(strategyAbi : any, rewardAddress: string) {
    super();
    this.strategyAbi = strategyAbi;
    this.rewardAddress = rewardAddress;
  }

  async getHarvestableUSD( jar: JarDefinition, model: PickleModel, resolver: Signer | Provider): Promise<number> {
    const strategy = new ethers.Contract(jar.details.strategyAddr, this.strategyAbi, resolver);
    const mustToken = new ethers.Contract(model.addr("must"), erc20Abi, resolver);
    const [must, wallet, mustPrice]: [BigNumber, BigNumber, number] = await Promise.all([
      strategy.getHarvestable().catch(() => BigNumber.from('0')),
      mustToken.balanceOf(jar.details.strategyAddr),
      await model.priceOf('must'),
    ]);
    const harvestable = must.add(wallet).mul(mustPrice.toFixed());
    return parseFloat(ethers.utils.formatEther(harvestable));;
  }

  async getProjectedAprStats(definition: JarDefinition, model: PickleModel) : Promise<AssetProjectedApr> {
    const must : number = await this.calculateComethAPY(this.rewardAddress, definition, model);
    const lp : number = await calculateComethswapLpApr(model, definition.depositToken.addr);

    return this.aprComponentsToProjectedApr([
      this.createAprComponent("lp", lp, false),
      this.createAprComponent("must", must, true)
    ]);
  }

  async calculateComethAPY(rewardsAddress: string, jar: JarDefinition, model: PickleModel) : Promise<number> {
    const multicallProvider = new MulticallProvider(Chains.get(jar.chain).getPreferredWeb3Provider());
    await multicallProvider.init();
    const multicallStakingRewards = new MulticallContract(
      rewardsAddress,stakingRewardsAbi);

    const [
      rewardsDurationBN,
      rewardsForDurationBN,
      totalSupplyBN,
    ] = await multicallProvider.all([
      multicallStakingRewards.rewardsDuration(),
      multicallStakingRewards.getRewardForDuration(),
      multicallStakingRewards.totalSupply(),
    ]);

    const totalSupply = parseFloat(formatEther(totalSupplyBN));
    const rewardsDuration = rewardsDurationBN.toNumber(); //epoch
    const rewardsForDuration = parseFloat(formatEther(rewardsForDurationBN));

    const { pricePerToken } = await this.getComethPairData(jar, model);

    const rewardsPerYear = rewardsForDuration * ((ONE_YEAR_IN_SECONDS) / rewardsDuration);
    const valueRewardedPerYear = await model.priceOf("must") * rewardsPerYear;

    const totalValueStaked = totalSupply * pricePerToken;
    const apy = valueRewardedPerYear / totalValueStaked;
    return apy * 100;
  }

  async getComethPairData(jar: JarDefinition, model: PickleModel): Promise<IPairData>  {
    return getLivePairDataFromContracts(jar, model, 18);
  };

}
async function calculateComethswapLpApr(model: PickleModel, addr: string): Promise<number> {
  return await new ComethPairManager().calculateLpApr(model, addr);
}

