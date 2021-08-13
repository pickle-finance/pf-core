import { ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { JarDefinition } from '../model/PickleModelJson';
import { PriceCache } from '../price/PriceCache';
import { AbstractJarHarvestResolver } from './JarHarvestResolver';
import {foldingStrategyAbi} from '../Contracts/ABIs/folding-strategy.abi';

export class DaiJar extends AbstractJarHarvestResolver {
   async getHarvestableUSD( jar: JarDefinition, prices: PriceCache, resolver: Signer | Provider): Promise<number> {
    const strategy = new ethers.Contract(jar.details.strategyAddr, foldingStrategyAbi, resolver);
    const [matic, maticPrice] = await Promise.all([strategy.getMaticAccrued(), this.priceOf(prices, 'matic')]);
    const harvestable = matic.mul(maticPrice.toFixed());
    return parseFloat(ethers.utils.formatEther(harvestable));
  }
}
