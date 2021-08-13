import { BigNumber, ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { JarDefinition } from '../model/PickleModelJson';
import { PriceCache } from '../price/PriceCache';
import { AbstractJarHarvestResolver } from './JarHarvestResolver';
import {feiAbi} from '../Contracts/ABIs/fei-reward.abi';

export class FoxEth extends AbstractJarHarvestResolver {
  private rewardAddress = '0xdd80e21669a664bce83e3ad9a0d74f8dad5d9e72';
  async getHarvestableUSD( jar: JarDefinition, prices: PriceCache, resolver: Signer | Provider): Promise<number> {
    const rewards = new ethers.Contract(this.rewardAddress, feiAbi, resolver);
    const [fox, foxPrice] = await Promise.all<BigNumber, number>([
      rewards.earned(jar.details.strategyAddr),
      this.priceOf(prices, 'shapeshift-fox-token'),
    ]);
    const harvestable = fox.mul(foxPrice.toFixed());
    return parseFloat(ethers.utils.formatEther(harvestable));
  }
}
