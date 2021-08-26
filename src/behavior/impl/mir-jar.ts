import { ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { AssetProjectedApr, JarDefinition } from '../../model/PickleModelJson';
import { PriceCache } from '../../price/PriceCache';
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { mirRewardAbi } from '../../Contracts/ABIs/mir-reward.abi';
import { PickleModel } from '../../model/PickleModel';
import { calculateMirAPY, calculateUniswapLpApr } from '../../protocols/UniswapUtil';
import { Chains } from '../../chain/Chains';

export abstract class MirJar extends AbstractJarBehavior {
  private rewardAddress: string;

  constructor( rewardAddress: string ) {
    super();
    this.rewardAddress = rewardAddress;
  }

  async getProjectedAprStats(definition: JarDefinition, model: PickleModel) : Promise<AssetProjectedApr> {
    const mir : number = await calculateMirAPY(this.rewardAddress, definition, model, Chains.get(definition.chain).getProviderOrSigner());
    const lp : number = await calculateUniswapLpApr(model, definition.depositToken.addr);

    return this.aprComponentsToProjectedApr([
      this.createAprComponent("lp", lp, false),
      this.createAprComponent("mir", mir, true)
    ]);
  }

  async getHarvestableUSD( jar: JarDefinition, model: PickleModel, resolver: Signer | Provider): Promise<number> {
    const rewards = new ethers.Contract(this.rewardAddress, mirRewardAbi, resolver);
    const [mir, mirPrice] = await Promise.all([rewards.earned(jar.details.strategyAddr), await model.priceOf('mirror-protocol')]);
    const harvestable = mir.mul(mirPrice.toFixed());
    return parseFloat(ethers.utils.formatEther(harvestable));
  }
}
