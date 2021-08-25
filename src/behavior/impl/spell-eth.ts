import { BigNumber, ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { sorbettiereAbi } from '../../Contracts/ABIs/sorbettiere.abi';
import { AssetAprComponent, AssetProjectedApr, JarDefinition } from '../../model/PickleModelJson';
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { PickleModel } from '../../model/PickleModel';
import { calculateAbradabraApy } from '../../protocols/AbraCadabraUtil';
import { Chains } from '../../chain/Chains';
import { calculateSushiLpApr } from '../../protocols/SushiSwapUtil';

export class SpellEth extends AbstractJarBehavior {

  async getProjectedAprStats(definition: JarDefinition, model: PickleModel) : Promise<AssetProjectedApr> {
    const abraApr : number = await calculateAbradabraApy(definition, model, Chains.get(definition.chain).getProviderOrSigner());
    const abraComp : AssetAprComponent = this.createAprComponent("spell", abraApr, true);

    const lpApr : number = await calculateSushiLpApr(definition.depositToken.addr,model);
    const lpComp : AssetAprComponent = this.createAprComponent("lp", lpApr, false);

    return this.aprComponentsToProjectedApr([abraComp,lpComp]);
  }


  async getHarvestableUSD( jar: JarDefinition, model: PickleModel, resolver: Signer | Provider): Promise<number> {
    const sorbettiere = new ethers.Contract(
      '0xf43480afe9863da4acbd4419a47d9cc7d25a647f',
      sorbettiereAbi,
      resolver,
    );
    const [spell, spellPrice] = await Promise.all([
      sorbettiere.pendingIce(0, jar.details.strategyAddr),
      model.prices.get('spell-token'),
    ]);

    const harvestable = spell.mul(BigNumber.from((spellPrice * 1e18).toFixed())).div((1e18).toFixed());
    return parseFloat(ethers.utils.formatEther(harvestable));
  }
}
