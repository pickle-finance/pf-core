import { BigNumber, ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { AssetProjectedApr, JarDefinition } from '../../model/PickleModelJson';
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import erc20Abi from '../../Contracts/ABIs/erc20.json';
import {dinoRewardAbi} from '../../Contracts/ABIs/dino-reward.abi';
import { PickleModel } from '../../model/PickleModel';
import { calculateFossilFarmsAPY, dinoPoolIds, FOSSIL_FARMS } from '../../protocols/DinoUtil';
import { SushiPolyPairManager } from '../../protocols/SushiSwapUtil';

export class PSlpWorkUsdc extends AbstractJarBehavior {

  async getHarvestableUSD( jar: JarDefinition, model: PickleModel, resolver: Signer | Provider): Promise<number> {
    const rewards = new ethers.Contract(FOSSIL_FARMS, dinoRewardAbi, resolver);
    const dinoToken = new ethers.Contract(model.addr("dino"), erc20Abi, resolver);

    const [dino, dinoPrice, dinoBal] = await Promise.all([
      rewards.pendingDino(dinoPoolIds[jar.depositToken.addr], jar.details.strategyAddr),
      model.priceOfSync('dinoswap'),
      dinoToken.balanceOf(jar.details.strategyAddr),
    ]);

    const harvestable = dino
      .add(dinoBal)
      .mul(BigNumber.from((dinoPrice * 1e10).toFixed()))
      .div((1e10).toFixed());
    return parseFloat(ethers.utils.formatEther(harvestable));
  }


  async getProjectedAprStats(definition: JarDefinition, model: PickleModel) : Promise<AssetProjectedApr>  {
    const lpApr : number = await new SushiPolyPairManager().calculateLpApr(model, definition.depositToken.addr);
    const dinoApr : number = await calculateFossilFarmsAPY(definition, model);
    return this.aprComponentsToProjectedApr([
      this.createAprComponent("lp", lpApr, false),
      this.createAprComponent("dino", dinoApr, true),
    ]);
  }


}
