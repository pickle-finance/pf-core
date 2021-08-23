import { ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { JarDefinition } from '../../model/PickleModelJson';
import { PriceCache } from '../../price/PriceCache';
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { mirRewardAbi } from '../../Contracts/ABIs/mir-reward.abi';
import { PickleModel } from '../../model/PickleModel';

export abstract class MirJar extends AbstractJarBehavior {
  private rewardAddress: string;

  constructor( rewardAddress: string ) {
    super();
    this.rewardAddress = rewardAddress;
  }

  async getHarvestableUSD( jar: JarDefinition, model: PickleModel, resolver: Signer | Provider): Promise<number> {
    const rewards = new ethers.Contract(this.rewardAddress, mirRewardAbi, resolver);
    const [mir, mirPrice] = await Promise.all([rewards.earned(jar.details.strategyAddr), model.prices.get('mirror-protocol')]);
    const harvestable = mir.mul(mirPrice.toFixed());
    return parseFloat(ethers.utils.formatEther(harvestable));
  }
}
