import { BigNumber, ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { JarDefinition } from '../../model/PickleModelJson';
import { PriceCache } from '../../price/PriceCache';
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import erc20Abi from '../../Contracts/ABIs/erc20.json';
import { PickleModel } from '../../model/PickleModel';

export abstract class ComethJar extends AbstractJarBehavior {
  strategyAbi : any;
  constructor(strategyAbi : any) {
    super();
    this.strategyAbi = strategyAbi;
  }

  async getHarvestableUSD( jar: JarDefinition, model: PickleModel, resolver: Signer | Provider): Promise<number> {
    const strategy = new ethers.Contract(jar.details.strategyAddr, this.strategyAbi, resolver);
    const mustToken = new ethers.Contract(model.addr("must"), erc20Abi, resolver);
    const [must, wallet, mustPrice]: [BigNumber, BigNumber, number] = await Promise.all([
      strategy.getHarvestable().catch(() => BigNumber.from('0')),
      mustToken.balanceOf(jar.details.strategyAddr),
      model.prices.get('must'),
    ]);
    const harvestable = must.add(wallet).mul(mustPrice.toFixed());
    return parseFloat(ethers.utils.formatEther(harvestable));;
  }
}
