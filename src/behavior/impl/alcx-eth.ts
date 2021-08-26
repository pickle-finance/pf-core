import { BigNumber, ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { AssetProjectedApr, JarDefinition } from '../../model/PickleModelJson';
import { PriceCache } from '../../price/PriceCache';
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import erc20Abi from '../../Contracts/ABIs/erc20.json';
import {alcxStrategyAbi} from '../../Contracts/ABIs/alcx-strategy.abi';
import { PickleModel } from '../../model/PickleModel';
import { SushiJar } from './sushi-jar';

export class AlcxEth extends SushiJar {
  constructor() {
    super(alcxStrategyAbi);
  }
  async getHarvestableUSD( jar: JarDefinition, model: PickleModel, resolver: Signer | Provider): Promise<number> {
    const strategy = new ethers.Contract(jar.details.strategyAddr, alcxStrategyAbi, resolver);
    const alcxToken = new ethers.Contract(model.addr("alcx"), erc20Abi, resolver);
    const [alcx, sushi, alcxWallet, alcxPrice, sushiPrice]: [BigNumber, BigNumber, BigNumber, number, number] =
      await Promise.all([
        strategy.getHarvestableAlcx().catch(() => BigNumber.from('0')),
        strategy.getHarvestableSushi().catch(() => BigNumber.from('0')),
        alcxToken.balanceOf(jar.details.strategyAddr).catch(() => BigNumber.from('0')),
        await model.priceOf("alcx"),
        await model.priceOf("sushi"),
      ]);
    const alcxValue = alcx.add(alcxWallet).mul(alcxPrice.toFixed());
    const sushiValue = sushi.mul(sushiPrice.toFixed());
    const harvestable = alcxValue.add(sushiValue);
    return parseFloat(ethers.utils.formatEther(harvestable));
  }

  async getProjectedAprStats(definition: JarDefinition, model: PickleModel) : Promise<AssetProjectedApr> {
    return await this.chefV2AprStats(definition, model, "alcx");
  }

}
