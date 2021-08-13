import { BigNumber, ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { JarDefinition } from '../model/PickleModelJson';
import { PriceCache } from '../price/PriceCache';
import { AbstractJarHarvestResolver } from './JarHarvestResolver';
import erc20Abi from '../Contracts/ABIs/erc20.json';
import {alcxStrategyAbi} from '../Contracts/ABIs/alcx-strategy.abi';

export class AlcxEth extends AbstractJarHarvestResolver {
  async getHarvestableUSD( jar: JarDefinition, prices: PriceCache, resolver: Signer | Provider): Promise<number> {
    const strategyAbi = alcxStrategyAbi;

    const strategy = new ethers.Contract(jar.details.strategyAddr, strategyAbi, resolver);
    const alcxToken = new ethers.Contract(this.addr("alcx"), erc20Abi, resolver);
    const [alcx, sushi, alcxWallet, alcxPrice, sushiPrice]: [BigNumber, BigNumber, BigNumber, number, number] =
      await Promise.all([
        strategy.getHarvestableAlcx().catch(() => BigNumber.from('0')),
        strategy.getHarvestableSushi().catch(() => BigNumber.from('0')),
        alcxToken.balanceOf(jar.details.strategyAddr).catch(() => BigNumber.from('0')),
        this.priceOf(prices, "alcx"),
        this.priceOf(prices, "sushi"),
      ]);
    const alcxValue = alcx.add(alcxWallet).mul(alcxPrice.toFixed());
    const sushiValue = sushi.mul(sushiPrice.toFixed());
    const harvestable = alcxValue.add(sushiValue);
    return parseFloat(ethers.utils.formatEther(harvestable));
  }
}
