import { BigNumber, ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import erc20Abi from '../../Contracts/ABIs/erc20.json';
import {saddleStrategyAbi}  from '../../Contracts/ABIs/saddle-strategy.abi';
import { JarDefinition } from '../../model/PickleModelJson';
import { PriceCache } from '../../price/PriceCache';
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { PickleModel } from '../../model/PickleModel';

export class SaddleD4 extends AbstractJarBehavior {
  constructor() {
    super();
  }

  async getHarvestableUSD( jar: JarDefinition, model: PickleModel, resolver: Signer | Provider): Promise<number> {
    const strategy = new ethers.Contract(jar.details.strategyAddr, saddleStrategyAbi, resolver);
    const fxsToken = new ethers.Contract(model.addr("fxs"), erc20Abi, resolver);
    const tribeToken = new ethers.Contract(model.addr("tribe"), erc20Abi, resolver);
    const alcxToken = new ethers.Contract(model.addr("alcx"), erc20Abi, resolver);
    const lqtyToken = new ethers.Contract(model.addr("lqty"), erc20Abi, resolver);

    const [harvestableArr, fxsPrice, tribePrice, alcxPrice, lqtyPrice, fxsBal, tribeBal, alcxBal, lqtyBal] =
      await Promise.all([
        strategy.getHarvestable(),
        model.prices.get('fxs'),
        model.prices.get('tribe'),
        model.prices.get('alcx'),
        model.prices.get('lqty'),
        fxsToken.balanceOf(jar.details.strategyAddr),
        tribeToken.balanceOf(jar.details.strategyAddr),
        alcxToken.balanceOf(jar.details.strategyAddr),
        lqtyToken.balanceOf(jar.details.strategyAddr),
      ]);
    const harvestable = harvestableArr[0]
      .add(fxsBal)
      .mul(fxsPrice.toFixed())
      .add(harvestableArr[1].add(tribeBal).mul(tribePrice.toFixed()))
      .add(harvestableArr[2].add(alcxBal).mul(alcxPrice.toFixed()))
      .add(harvestableArr[3].add(lqtyBal).mul(lqtyPrice.toFixed()));
    return parseFloat(ethers.utils.formatEther(harvestable));
  }
}
