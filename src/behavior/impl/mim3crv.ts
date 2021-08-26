import { BigNumber, ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { sorbettiereAbi } from '../../Contracts/ABIs/sorbettiere.abi';
import { AssetAprComponent, AssetProjectedApr, JarDefinition } from '../../model/PickleModelJson';
import { PriceCache } from '../../price/PriceCache';
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { PickleModel } from '../../model/PickleModel';
import { Chains } from '../../chain/Chains';
import { calculateAbradabraApy } from '../../protocols/AbraCadabraUtil';


// TODO strategy being migrated to convex
export class Mim3Crv extends AbstractJarBehavior {
  constructor() {
    super();
  }

  async getProjectedAprStats(definition: JarDefinition, model: PickleModel) : Promise<AssetProjectedApr> {
    const abraApr : number = await calculateAbradabraApy(definition, model, Chains.get(definition.chain).getProviderOrSigner());
    const abraComp : AssetAprComponent = this.createAprComponent("spell", abraApr, true);

    // TODO shouldn't there be curve fees here?!
    return this.aprComponentsToProjectedApr([abraComp]);
  }
  
  async getHarvestableUSD( jar: JarDefinition, model: PickleModel, resolver: Signer | Provider): Promise<number> {
    const sorbettiere = new ethers.Contract(
      '0xf43480afe9863da4acbd4419a47d9cc7d25a647f',
      sorbettiereAbi,
      resolver,
    );
    const [spell, spellPrice] = await Promise.all([
      sorbettiere.pendingIce(1, jar.details.strategyAddr),
      await model.priceOf('spell'),
    ]);

    const harvestable = spell.mul(BigNumber.from((spellPrice * 1e18).toFixed())).div((1e18).toFixed());
    return parseFloat(ethers.utils.formatEther(harvestable));
  }
}
