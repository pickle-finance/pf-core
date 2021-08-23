import { BigNumber, ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { JarDefinition } from '../../model/PickleModelJson';
import { PriceCache } from '../../price/PriceCache';
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import {feiAbi} from '../../Contracts/ABIs/fei-reward.abi';
import { PickleModel } from '../../model/PickleModel';

export class FoxEth extends AbstractJarBehavior {
  private rewardAddress = '0xdd80e21669a664bce83e3ad9a0d74f8dad5d9e72';
  async getHarvestableUSD( jar: JarDefinition, model: PickleModel, resolver: Signer | Provider): Promise<number> {
    const rewards = new ethers.Contract(this.rewardAddress, feiAbi, resolver);
    const [fox, foxPrice] = await Promise.all<BigNumber, number>([
      rewards.earned(jar.details.strategyAddr),
      model.prices.get('shapeshift-fox-token'),
    ]);
    const harvestable = fox.mul(foxPrice.toFixed());
    return parseFloat(ethers.utils.formatEther(harvestable));
  }
}
