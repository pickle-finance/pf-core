import { BigNumber, ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import erc20Abi from '../Contracts/ABIs/erc20.json';
import { mimaticStrategyAbi } from '../Contracts/ABIs/mimatic-strategy.abi';
import { JarDefinition } from '../model/PickleModelJson';
import { PriceCache } from '../price/PriceCache';
import { AbstractJarHarvestResolver } from './JarHarvestResolver';
import { ChainNetwork } from '..';

export class MimaticUSDC extends AbstractJarHarvestResolver {
  constructor() {
    super(); 
  }

  async getHarvestableUSD( jar: JarDefinition, prices: PriceCache, resolver: Signer | Provider): Promise<number> {
    const strategy = new ethers.Contract(jar.details.strategyAddr, mimaticStrategyAbi, resolver);
    const qiToken = new ethers.Contract(this.address("qi", ChainNetwork.Polygon), erc20Abi, resolver);
    const [qi, wallet, qiPrice]: [BigNumber, BigNumber, number] = await Promise.all([
      strategy.getHarvestable().catch(() => BigNumber.from('0')),
      qiToken.balanceOf(jar.details.strategyAddr),
      this.priceOf(prices, 'qi-dao'),
    ]);
    const harvestable = qi.add(wallet).mul(qiPrice.toFixed());
    return parseFloat(ethers.utils.formatEther(harvestable));
  }
}
