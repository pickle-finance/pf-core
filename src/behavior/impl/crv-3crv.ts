import { PickleModel } from '../..';
import { JarDefinition, AssetProjectedApr, AssetAprComponent } from '../../model/PickleModelJson';
import { CurveJar, getCurveRawStats } from './curve-jar';

export const THREE_GAUGE_ADDR = "0xbFcF63294aD7105dEa65aA58F8AE5BE2D9d0952A";
export const THREE_POOL_ADDR = "0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7";
export class ThreeCrv extends CurveJar {

  constructor() {
    super(THREE_GAUGE_ADDR);
  }

  async getProjectedAprStats(definition: JarDefinition, model: PickleModel) : Promise<AssetProjectedApr> {
    let crvApy:AssetAprComponent = await this.getCurveCrvAPY(definition, model, 
      await model.priceOf("usdc"), THREE_GAUGE_ADDR, THREE_POOL_ADDR);
    const curveRawStats : any = await getCurveRawStats(model, definition.chain);
    let lp : AssetAprComponent = this.createAprComponent("lp", curveRawStats ? curveRawStats["3pool"] : 0, false);
    return this.aprComponentsToProjectedApr([lp, crvApy]);
  }
}
