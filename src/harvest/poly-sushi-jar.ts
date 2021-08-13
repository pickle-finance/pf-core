import { BigNumber, ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import erc20Abi from '../Contracts/ABIs/erc20.json';
import { JarDefinition } from '../model/PickleModelJson';
import { PriceCache } from '../price/PriceCache';
import { AbstractJarHarvestResolver } from './JarHarvestResolver';
import { ChainNetwork } from '../chain/Chains';

export abstract class PolySushiJar extends AbstractJarHarvestResolver {
  strategyAbi: any;
  constructor(strategyAbi: any) {
    super();
    this.strategyAbi = strategyAbi;
  }
  async getHarvestableUSD( jar: JarDefinition, prices: PriceCache, resolver: Signer | Provider): Promise<number> {
    const strategy = new ethers.Contract(jar.details.strategyAddr, this.strategyAbi, resolver);
    const sushiToken = new ethers.Contract(this.address("sushi", ChainNetwork.Polygon), erc20Abi, resolver);
    const maticToken = new ethers.Contract(this.address("matic", ChainNetwork.Polygon), erc20Abi, resolver);

    const [walletSushi, walletMatic, sushiPrice, maticPrice]: [BigNumber, BigNumber, number, number] =
      await Promise.all([
        sushiToken.balanceOf(jar.details.strategyAddr),
        maticToken.balanceOf(jar.details.strategyAddr),
        this.priceOf(prices, 'sushi'),
        this.priceOf(prices, 'matic'),
      ]);
    const res = await strategy.getHarvestable();
    const pendingSushi = res[0];
    const pendingMatic = res[1];

    const harvestable = pendingSushi
      .add(walletSushi)
      .mul(sushiPrice.toFixed())
      .add(pendingMatic.add(walletMatic).mul(maticPrice.toFixed()));
    return parseFloat(ethers.utils.formatEther(harvestable));
  }
}
