import { BigNumber, ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import erc20Abi from '../Contracts/ABIs/erc20.json';
import { JarDefinition } from '../model/PickleModelJson';
import { PriceCache } from '../price/PriceCache';
import { AbstractJarHarvestResolver } from './JarHarvestResolver';
import { ChainNetwork } from '../chain/Chains';

export abstract class SushiJar extends AbstractJarHarvestResolver {
  strategyAbi:any;
  constructor(strategyAbi: any) {
    super();
    this.strategyAbi = strategyAbi;
  }
  async getHarvestableUSD( jar: JarDefinition, prices: PriceCache, resolver: Signer | Provider): Promise<number> {
    const strategy = new ethers.Contract(jar.details.strategyAddr, this.strategyAbi, resolver);
    const sushiToken = new ethers.Contract(this.address("sushi", ChainNetwork.Ethereum), erc20Abi, resolver);
    const [sushi, wallet, sushiPrice]: [BigNumber, BigNumber, number] = await Promise.all([
      strategy.getHarvestable().catch(() => BigNumber.from('0')),
      sushiToken.balanceOf(jar.details.strategyAddr),
      this.priceOf(prices, 'sushi'),
    ]);
    const harvestable = sushi.add(wallet).mul(sushiPrice.toFixed());
    return parseFloat(ethers.utils.formatEther(harvestable));
  }
}
