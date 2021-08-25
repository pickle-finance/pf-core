import { BigNumber, ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import erc20Abi from '../../Contracts/ABIs/erc20.json';
import { multiSushiStrategyAbi } from '../../Contracts/ABIs/multi-sushi-strategy.abi';
import { AssetProjectedApr, JarDefinition } from '../../model/PickleModelJson';
import { PriceCache } from '../../price/PriceCache';
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { PickleModel } from '../../model/PickleModel';
import { SushiJar } from './sushi-jar';

export class SlpCvxEth extends SushiJar {
  constructor() {
    super(multiSushiStrategyAbi);
  }
  
  async getProjectedAprStats(definition: JarDefinition, model: PickleModel) : Promise<AssetProjectedApr> {
    return await this.chefV2AprStats(definition, model, "cvx");
  }


  async getHarvestableUSD( jar: JarDefinition, model: PickleModel, resolver: Signer | Provider): Promise<number> {
    const strategy = new ethers.Contract(jar.details.strategyAddr, multiSushiStrategyAbi, resolver);
    const cvxToken = new ethers.Contract(model.addr("cvx"), erc20Abi, resolver);
    const [res, cvxWallet, cvxPrice, sushiPrice]: [BigNumber[], BigNumber, number, number] = await Promise.all([
      strategy.getHarvestable().catch(() => BigNumber.from('0')),
      cvxToken.balanceOf(jar.details.strategyAddr).catch(() => BigNumber.from('0')),
      model.prices.get("cvx"),
      model.prices.get("sushi"),
    ]);

    const sushiValue = res[0].mul(sushiPrice.toFixed());
    const cvxValue = res[1].add(cvxWallet).mul(cvxPrice.toFixed());
    const harvestable = cvxValue.add(sushiValue);
    return parseFloat(ethers.utils.formatEther(harvestable));
  }
}
