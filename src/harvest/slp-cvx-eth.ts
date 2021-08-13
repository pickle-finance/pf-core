import { BigNumber, ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import erc20Abi from '../Contracts/ABIs/erc20.json';
import { multiSushiStrategyAbi } from '../Contracts/ABIs/multi-sushi-strategy.abi';
import { JarDefinition } from '../model/PickleModelJson';
import { PriceCache } from '../price/PriceCache';
import { AbstractJarHarvestResolver } from './JarHarvestResolver';

export class SlpCvxEth extends AbstractJarHarvestResolver {
  constructor() {
    super();
  }

  async getHarvestableUSD( jar: JarDefinition, prices: PriceCache, resolver: Signer | Provider): Promise<number> {
    const strategy = new ethers.Contract(jar.details.strategyAddr, multiSushiStrategyAbi, resolver);
    const cvxToken = new ethers.Contract(this.addr("cvx"), erc20Abi, resolver);
    const [res, cvxWallet, cvxPrice, sushiPrice]: [BigNumber[], BigNumber, number, number] = await Promise.all([
      strategy.getHarvestable().catch(() => BigNumber.from('0')),
      cvxToken.balanceOf(jar.details.strategyAddr).catch(() => BigNumber.from('0')),
      this.priceOf(prices, "cvx"),
      this.priceOf(prices, "sushi"),
    ]);

    const sushiValue = res[0].mul(sushiPrice.toFixed());
    const cvxValue = res[1].add(cvxWallet).mul(cvxPrice.toFixed());
    const harvestable = cvxValue.add(sushiValue);
    return parseFloat(ethers.utils.formatEther(harvestable));
  }
}
