import { PickleModel } from '../..';
import { JarDefinition, AssetProjectedApr, AssetAprComponent } from '../../model/PickleModelJson';
import { CurveJar } from './curve-jar';

export const RENBTC_GAUGE_ADDR = "0xB1F2cdeC61db658F091671F5f199635aEF202CAC";
export const RENBTC_POOL_ADDR = "0x93054188d876f558f4a66B2EF1d97d16eDf0895B";

export class RenBtcCRV extends CurveJar {
  constructor() {
    super(RENBTC_GAUGE_ADDR);
  }

  async getProjectedAprStats(definition: JarDefinition, model: PickleModel) : Promise<AssetProjectedApr> {
    let crvApy:AssetAprComponent = await this.getCurveCrvAPY(definition, model, 
      model.prices.get("wbtc"), RENBTC_GAUGE_ADDR, RENBTC_POOL_ADDR);
    const curveRawStats : any = await this.getCurveRawStats(model, definition.chain);
    let lp : AssetAprComponent = this.createAprComponent("lp", curveRawStats ? curveRawStats["susd"] : 0, false);
    return this.aprComponentsToProjectedApr([lp, crvApy]);
  }

}
