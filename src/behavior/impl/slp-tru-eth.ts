import { BigNumber, ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import erc20Abi from '../../Contracts/ABIs/erc20.json';
import { JarDefinition } from '../../model/PickleModelJson';
import { PriceCache } from '../../price/PriceCache';
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { parseUnits } from 'ethers/lib/utils';
import { multiSushiStrategyAbi } from '../../Contracts/ABIs/multi-sushi-strategy.abi';
import { PickleModel } from '../../model/PickleModel';

export class SlpTruEth extends AbstractJarBehavior {
  async getHarvestableUSD( jar: JarDefinition, model: PickleModel, resolver: Signer | Provider): Promise<number> {
    const strategy = new ethers.Contract(jar.details.strategyAddr, multiSushiStrategyAbi, resolver);
    const truToken = new ethers.Contract(model.addr("tru"), erc20Abi, resolver);
    const [res, truWallet, truPrice, sushiPrice]: [BigNumber[], BigNumber, number, number] = await Promise.all([
      strategy.getHarvestable().catch(() => BigNumber.from('0')),
      truToken.balanceOf(jar.details.strategyAddr).catch(() => BigNumber.from('0')),
      model.prices.get("tru"),
      model.prices.get("sushi")
    ]);

    const sushiValue = res[0].mul(sushiPrice.toFixed());
    const truValue = parseUnits(res[1].add(truWallet).toString(), 10).mul(truPrice.toFixed());
    const harvestable = truValue.add(sushiValue);
    return parseFloat(ethers.utils.formatEther(harvestable));
  }
}
