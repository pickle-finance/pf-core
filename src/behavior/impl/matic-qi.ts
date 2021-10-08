import { BigNumber, ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import erc20Abi from '../../Contracts/ABIs/erc20.json';
import { mimaticStrategyAbi } from '../../Contracts/ABIs/mimatic-strategy.abi';
import { AssetAprComponent, AssetProjectedApr, JarDefinition } from '../../model/PickleModelJson';
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { ChainNetwork } from '../../chain/Chains';
import { PickleModel } from '../../model/PickleModel';
import { calculateMasterChefRewardsAPR } from '../../protocols/MasterChefApyUtil';
import { QuickswapPairManager } from '../../protocols/QuickswapUtil';

export class MaticQi extends AbstractJarBehavior {
  constructor() {
    super();
  }

  async getHarvestableUSD( jar: JarDefinition, model: PickleModel, resolver: Signer | Provider): Promise<number> {
    const strategy = new ethers.Contract(jar.details.strategyAddr, mimaticStrategyAbi, resolver);
    const qiToken = new ethers.Contract(model.address("qi", ChainNetwork.Polygon), erc20Abi, resolver);
    const [qi, wallet, qiPrice]: [BigNumber, BigNumber, number] = await Promise.all([
      strategy.getHarvestable().catch(() => BigNumber.from('0')),
      qiToken.balanceOf(jar.details.strategyAddr),
      model.priceOf('qi-dao'),
    ]);
    const harvestable = qi.add(wallet).mul((qiPrice*1e6).toFixed()).div(1e6);
    return parseFloat(ethers.utils.formatEther(harvestable));
  }

  async getProjectedAprStats(definition: JarDefinition, model: PickleModel) : Promise<AssetProjectedApr> {
    const chefComponent : AssetAprComponent = await calculateMasterChefRewardsAPR(definition, model);
    const lpApr : number = await new QuickswapPairManager().calculateLpApr(model, definition.depositToken.addr);
    return this.aprComponentsToProjectedApr([
      this.createAprComponent("lp", lpApr, false),
      chefComponent
    ]);
  }

}
