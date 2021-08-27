import { BigNumber, ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { AssetProjectedApr, JarDefinition } from '../../model/PickleModelJson';
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import erc20Abi from '../../Contracts/ABIs/erc20.json';
import {dinoRewardAbi} from '../../Contracts/ABIs/dino-reward.abi';
import { PickleModel } from '../../model/PickleModel';
import { calculateFossilFarmsAPY } from '../../protocols/DinoUtil';
import { SushiPolyPairManager } from '../../protocols/SushiSwapUtil';

export const FOSSIL_FARMS = "0x1948abc5400aa1d72223882958da3bec643fb4e5";

export class DinoUsdc extends AbstractJarBehavior {
  private rewardAddress = '0x1948abC5400Aa1d72223882958Da3bec643fb4E5';
  private poolId = 10;

  async getHarvestableUSD( jar: JarDefinition, model: PickleModel, resolver: Signer | Provider): Promise<number> {
    const rewards = new ethers.Contract(this.rewardAddress, dinoRewardAbi, resolver);
    const dinoToken = new ethers.Contract(model.addr("dino"), erc20Abi, resolver);

    const [dino, dinoPrice, dinoBal] = await Promise.all([
      rewards.pendingDino(this.poolId, jar.details.strategyAddr),
      await model.priceOf('dinoswap'),
      dinoToken.balanceOf(jar.details.strategyAddr),
    ]);

    const harvestable = dino
      .add(dinoBal)
      .mul(BigNumber.from((dinoPrice * 1e18).toFixed()))
      .div((1e18).toFixed());
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
