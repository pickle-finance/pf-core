import { ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { AbstractJarHarvestResolver } from './JarHarvestResolver';
import { JarDefinition } from '../model/PickleModelJson';
import { PriceCache } from '../price/PriceCache';
import curveGaugeAbi from '../Contracts/ABIs/curve-gauge.json';

export abstract class CurveJar extends AbstractJarHarvestResolver {
  readonly gaugeAddress: string;

  constructor( gaugeAddress: string) {
    super();
    this.gaugeAddress = gaugeAddress;
  }

  async getHarvestableUSD( jar: JarDefinition, prices: PriceCache, resolver: Signer | Provider): Promise<number> {
    const gauge = new ethers.Contract(this.gaugeAddress, curveGaugeAbi, resolver);
    const [crv, crvPrice] = await Promise.all([
      gauge.callStatic.claimable_tokens(jar.details.strategyAddr),
      this.priceOf(prices,'curve-dao-token'),
    ]);
    const harvestable = crv.mul(crvPrice.toFixed());
    return parseFloat(ethers.utils.formatEther(harvestable));
  }
}
