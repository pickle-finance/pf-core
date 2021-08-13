import { BigNumber, ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import erc20Abi from '../Contracts/ABIs/erc20.json';
import { JarDefinition } from '../model/PickleModelJson';
import { PriceCache } from '../price/PriceCache';
import { AbstractJarHarvestResolver } from './JarHarvestResolver';
import { parseUnits } from 'ethers/lib/utils';
import { multiSushiStrategyAbi } from '../Contracts/ABIs/multi-sushi-strategy.abi';

export class SlpTruEth extends AbstractJarHarvestResolver {
  async getHarvestableUSD( jar: JarDefinition, prices: PriceCache, resolver: Signer | Provider): Promise<number> {
    const strategy = new ethers.Contract(jar.details.strategyAddr, multiSushiStrategyAbi, resolver);
    const truToken = new ethers.Contract(this.addr("tru"), erc20Abi, resolver);
    const [res, truWallet, truPrice, sushiPrice]: [BigNumber[], BigNumber, number, number] = await Promise.all([
      strategy.getHarvestable().catch(() => BigNumber.from('0')),
      truToken.balanceOf(jar.details.strategyAddr).catch(() => BigNumber.from('0')),
      this.priceOf(prices, "tru"),
      this.priceOf(prices, "sushi")
    ]);

    const sushiValue = res[0].mul(sushiPrice.toFixed());
    const truValue = parseUnits(res[1].add(truWallet).toString(), 10).mul(truPrice.toFixed());
    const harvestable = truValue.add(sushiValue);
    return parseFloat(ethers.utils.formatEther(harvestable));
  }
}
