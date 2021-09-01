import { Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { AssetProjectedApr, JarDefinition } from '../../model/PickleModelJson';
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { PickleModel } from '../../model/PickleModel';
import { calculateYearnAPY } from '../../protocols/YearnUtil';

export class YearnJar extends AbstractJarBehavior {
  constructor() {
    super();
  }
  async getHarvestableUSD( _jar: JarDefinition, _model: PickleModel, _resolver: Signer | Provider): Promise<number> {
    return 0;
  }
  async getProjectedAprStats(definition: JarDefinition, model: PickleModel) : Promise<AssetProjectedApr> {
    const apr : number = await calculateYearnAPY(model, definition.depositToken.addr);
    return this.aprComponentsToProjectedApr(
      [this.createAprComponent("yearn", apr, false)]
    );
  }
}
