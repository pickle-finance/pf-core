import { ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { JarDefinition } from '../model/PickleModelJson';
import { PriceCache } from '../price/PriceCache';
import { AbstractJarHarvestResolver } from './JarHarvestResolver';
import { mirRewardAbi } from '../Contracts/ABIs/mir-reward.abi';

export abstract class MirJar extends AbstractJarHarvestResolver {
  private rewardAddress: string;

  constructor( rewardAddress: string ) {
    super();
    this.rewardAddress = rewardAddress;
  }

  async getHarvestableUSD( jar: JarDefinition, prices: PriceCache, resolver: Signer | Provider): Promise<number> {
    const rewards = new ethers.Contract(this.rewardAddress, mirRewardAbi, resolver);
    const [mir, mirPrice] = await Promise.all([rewards.earned(jar.details.strategyAddr), this.priceOf(prices, 'mirror-protocol')]);
    const harvestable = mir.mul(mirPrice.toFixed());
    return parseFloat(ethers.utils.formatEther(harvestable));
  }
}
