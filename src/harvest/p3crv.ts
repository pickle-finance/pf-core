import { ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { curveThirdPartyGaugeAbi } from '../Contracts/ABIs/curve-external-gauge.abi';
import { JarDefinition } from '../model/PickleModelJson';
import { PriceCache } from '../price/PriceCache';
import { AbstractJarHarvestResolver } from './JarHarvestResolver';
import { ChainNetwork } from '../chain/Chains';

export class PThreeCrv extends AbstractJarHarvestResolver {
  constructor() {
    super();
  }

  async getHarvestableUSD( jar: JarDefinition, prices: PriceCache, resolver: Signer | Provider): Promise<number> {
    const gauge = new ethers.Contract(
      '0x19793B454D3AfC7b454F206Ffe95aDE26cA6912c',
      curveThirdPartyGaugeAbi,
      resolver,
    );
    const [matic, maticPrice, crv, crvPrice] = await Promise.all([
      gauge.claimable_reward(jar.details.strategyAddr, this.address("matic", ChainNetwork.Polygon)),
      this.priceOf(prices, 'matic'),
      gauge.claimable_reward(jar.details.strategyAddr, this.address("crv", ChainNetwork.Polygon)),
      this.priceOf(prices, 'crv'),
    ]);

    const harvestable = matic.mul(maticPrice.toFixed()).add(crv.mul(crvPrice.toFixed()));
    return parseFloat(ethers.utils.formatEther(harvestable));
  }
}
