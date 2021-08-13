import { BigNumber, ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { JarDefinition } from '../model/PickleModelJson';
import { PriceCache } from '../price/PriceCache';
import { AbstractJarHarvestResolver } from './JarHarvestResolver';
import {feiAbi} from '../Contracts/ABIs/fei-reward.abi';

export class FeiTribe extends AbstractJarHarvestResolver {
  private rewardAddress = '0x18305DaAe09Ea2F4D51fAa33318be5978D251aBd';

  async getHarvestableUSD( jar: JarDefinition, prices: PriceCache, resolver: Signer | Provider): Promise<number> {
    const rewards = new ethers.Contract(this.rewardAddress, feiAbi, resolver);
    const [tribe, tribePrice] = await Promise.all([rewards.earned(jar.details.strategyAddr), this.priceOf(prices, 'tribe-2')]);
    const harvestable = tribe.mul(tribePrice.toFixed());
    return parseFloat(ethers.utils.formatEther(harvestable));
  }
}
