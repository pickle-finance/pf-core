import { BigNumber, ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { sorbettiereAbi } from '../../Contracts/ABIs/sorbettiere.abi';
import { AssetAprComponent, AssetProjectedApr, JarDefinition } from '../../model/PickleModelJson';
import { PriceCache } from '../../price/PriceCache';
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import erc20Abi from '../../Contracts/ABIs/erc20.json';
import { PickleModel } from '../../model/PickleModel';
import { Chains } from '../../chain/Chains';
import { calculateAbradabraApy } from '../../protocols/AbraCadabraUtil';
import { SushiEthPairManager } from '../../protocols/SushiSwapUtil';

export class MimEth extends AbstractJarBehavior {
  constructor() {
    super();
  }

  async getProjectedAprStats(definition: JarDefinition, model: PickleModel) : Promise<AssetProjectedApr> {
    const abraApr : number = await calculateAbradabraApy(definition, model, Chains.get(definition.chain).getProviderOrSigner());
    const abraComp : AssetAprComponent = this.createAprComponent("spell", abraApr, true);

    const lpApr : number = await new SushiEthPairManager().calculateLpApr(model, definition.depositToken.addr);
    const lpComp : AssetAprComponent = this.createAprComponent("lp", lpApr, false);

    return this.aprComponentsToProjectedApr([abraComp,lpComp]);
  }
  async getHarvestableUSD( jar: JarDefinition, model: PickleModel, resolver: Signer | Provider): Promise<number> {
    const sorbettiere = new ethers.Contract(
      '0xf43480afe9863da4acbd4419a47d9cc7d25a647f',
      sorbettiereAbi,
      resolver,
    );
    const spellToken = new ethers.Contract(model.addr("spell"), erc20Abi, resolver);
    const [spell, spellPrice, spellBal] = await Promise.all([
      sorbettiere.pendingIce(2, jar.details.strategyAddr),
      await model.priceOf('spell'),
      spellToken.balanceOf(jar.details.strategyAddr),
    ]);
    const harvestable = spell.add(spellBal).mul(BigNumber.from((spellPrice * 1e18).toFixed())).div((1e18).toFixed());
    return parseFloat(ethers.utils.formatEther(harvestable));
  }
}
