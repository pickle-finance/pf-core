import { Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { AssetProjectedApr, JarDefinition } from '../../model/PickleModelJson';
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { PickleModel } from '../../model/PickleModel';
import { calculateYearnAPY } from '../../protocols/YearnUtil';
import { JAR_CRV_IB, JAR_fraxCRV, JAR_lusdCRV, JAR_USDC } from '../../model/JarsAndFarms';
import { getStableswapPrice } from '../../price/DepositTokenPriceUtility';

export class YearnJar extends AbstractJarBehavior {
  constructor() {
    super();
  }

  async getDepositTokenPrice(definition: JarDefinition, model: PickleModel): Promise<number> {
    const depTokenAddr = definition.depositToken.addr;
    // Remember to break this up / move out if these jars get their own class
    if( depTokenAddr === JAR_USDC.depositToken.addr) {
      return model.priceOfSync(depTokenAddr);
    } 
    if( depTokenAddr === JAR_CRV_IB.depositToken.addr) {
      return 1;
    }

    if( depTokenAddr === JAR_lusdCRV.depositToken.addr || 
      depTokenAddr === JAR_fraxCRV.depositToken.addr) {
      return getStableswapPrice(definition, model);
    }
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
