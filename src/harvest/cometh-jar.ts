import { BigNumber, ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { JarDefinition } from '../model/PickleModelJson';
import { PriceCache } from '../price/PriceCache';
import { AbstractJarHarvestResolver } from './JarHarvestResolver';
import erc20Abi from '../Contracts/ABIs/erc20.json';

export abstract class ComethJar extends AbstractJarHarvestResolver {
  strategyAbi : any;
  constructor(strategyAbi : any) {
    super();
    this.strategyAbi = strategyAbi;
  }

  async getHarvestableUSD( jar: JarDefinition, prices: PriceCache, resolver: Signer | Provider): Promise<number> {
    const strategy = new ethers.Contract(jar.details.strategyAddr, this.strategyAbi, resolver);
    const mustToken = new ethers.Contract(this.addr("must"), erc20Abi, resolver);
    const [must, wallet, mustPrice]: [BigNumber, BigNumber, number] = await Promise.all([
      strategy.getHarvestable().catch(() => BigNumber.from('0')),
      mustToken.balanceOf(jar.details.strategyAddr),
      this.priceOf(prices, 'must'),
    ]);
    const harvestable = must.add(wallet).mul(mustPrice.toFixed());
    return parseFloat(ethers.utils.formatEther(harvestable));;
  }
}
