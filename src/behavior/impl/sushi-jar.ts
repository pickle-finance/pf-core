import { BigNumber, ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import erc20Abi from '../../Contracts/ABIs/erc20.json';
import { JarDefinition } from '../../model/PickleModelJson';
import { PriceCache } from '../../price/PriceCache';
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { ChainNetwork } from '../../chain/Chains';
import { PickleModel } from '../../model/PickleModel';

export abstract class SushiJar extends AbstractJarBehavior {
  strategyAbi:any;
  constructor(strategyAbi: any) {
    super();
    this.strategyAbi = strategyAbi;
  }
  async getHarvestableUSD( jar: JarDefinition, model: PickleModel, resolver: Signer | Provider): Promise<number> {
    const strategy = new ethers.Contract(jar.details.strategyAddr, this.strategyAbi, resolver);
    const sushiToken = new ethers.Contract(model.address("sushi", ChainNetwork.Ethereum), erc20Abi, resolver);
    const [sushi, wallet, sushiPrice]: [BigNumber, BigNumber, number] = await Promise.all([
      strategy.getHarvestable().catch(() => BigNumber.from('0')),
      sushiToken.balanceOf(jar.details.strategyAddr),
      model.prices.get('sushi'),
    ]);
    const harvestable = sushi.add(wallet).mul(sushiPrice.toFixed());
    return parseFloat(ethers.utils.formatEther(harvestable));
  }
}
