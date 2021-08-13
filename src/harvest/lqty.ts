import { BigNumber, ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import erc20Abi from '../Contracts/ABIs/erc20.json';
import { multiSushiStrategyAbi } from '../Contracts/ABIs/multi-sushi-strategy.abi';
import { JarDefinition } from '../model/PickleModelJson';
import { PriceCache } from '../price/PriceCache';
import { AbstractJarHarvestResolver } from './JarHarvestResolver';

export class pLqty extends AbstractJarHarvestResolver {
  async getHarvestableUSD( jar: JarDefinition, prices: PriceCache, resolver: Signer | Provider): Promise<number> {
    const strategy = new ethers.Contract(jar.details.strategyAddr, multiSushiStrategyAbi, resolver);
    const wethToken = new ethers.Contract(this.addr("weth"), erc20Abi, resolver);
    const lusdToken = new ethers.Contract(this.addr("lusd"), erc20Abi, resolver);
    const [res, wethWallet, lusdWallet, wethPrice, lusdPrice]: [BigNumber[], BigNumber, BigNumber, number, number] =
      await Promise.all([
        strategy.getHarvestable().catch(() => BigNumber.from('0')),
        wethToken.balanceOf(jar.details.strategyAddr).catch(() => BigNumber.from('0')),
        lusdToken.balanceOf(jar.details.strategyAddr).catch(() => BigNumber.from('0')),
        this.priceOf(prices,"weth"),
        this.priceOf(prices, "lusd"),
      ]);

    const wethValue = res[1].add(wethWallet).mul(wethPrice.toFixed());
    const lusdValue = res[0].add(lusdWallet).mul(lusdPrice.toFixed());
    const harvestable = wethValue.add(lusdValue);
    return parseFloat(ethers.utils.formatEther(harvestable));
  }
}
