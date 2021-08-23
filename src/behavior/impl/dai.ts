import { ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { JarDefinition } from '../../model/PickleModelJson';
import { PriceCache } from '../../price/PriceCache';
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import {foldingStrategyAbi} from '../../Contracts/ABIs/folding-strategy.abi';
import { PickleModel } from '../../model/PickleModel';

export class DaiJar extends AbstractJarBehavior {
   async getHarvestableUSD( jar: JarDefinition, model: PickleModel, resolver: Signer | Provider): Promise<number> {
    const strategy = new ethers.Contract(jar.details.strategyAddr, foldingStrategyAbi, resolver);
    const [matic, maticPrice] = await Promise.all([strategy.getMaticAccrued(), model.prices.get('matic')]);
    const harvestable = matic.mul(maticPrice.toFixed());
    return parseFloat(ethers.utils.formatEther(harvestable));
  }
}
