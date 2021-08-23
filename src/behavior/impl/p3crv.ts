import { ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { curveThirdPartyGaugeAbi } from '../../Contracts/ABIs/curve-external-gauge.abi';
import { JarDefinition } from '../../model/PickleModelJson';
import { PriceCache } from '../../price/PriceCache';
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { ChainNetwork } from '../../chain/Chains';
import { PickleModel } from '../../model/PickleModel';

export class PThreeCrv extends AbstractJarBehavior {
  constructor() {
    super();
  }

  async getHarvestableUSD( jar: JarDefinition, model: PickleModel, resolver: Signer | Provider): Promise<number> {
    const gauge = new ethers.Contract(
      '0x19793B454D3AfC7b454F206Ffe95aDE26cA6912c',
      curveThirdPartyGaugeAbi,
      resolver,
    );
    const [matic, maticPrice, crv, crvPrice] = await Promise.all([
      gauge.claimable_reward(jar.details.strategyAddr, model.address("matic", ChainNetwork.Polygon)),
      model.prices.get('matic'),
      gauge.claimable_reward(jar.details.strategyAddr, model.address("crv", ChainNetwork.Polygon)),
      model.prices.get('crv'),
    ]);

    const harvestable = matic.mul(maticPrice.toFixed()).add(crv.mul(crvPrice.toFixed()));
    return parseFloat(ethers.utils.formatEther(harvestable));
  }
}
