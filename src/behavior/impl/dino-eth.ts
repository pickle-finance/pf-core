import { BigNumber, ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { JarDefinition } from '../../model/PickleModelJson';
import { PriceCache } from '../../price/PriceCache';
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import erc20Abi from '../../Contracts/ABIs/erc20.json';
import {dinoRewardAbi} from '../../Contracts/ABIs/dino-reward.abi';
import { PickleModel } from '../../model/PickleModel';

export class DinoEth extends AbstractJarBehavior {
  private rewardAddress = '0x1948abC5400Aa1d72223882958Da3bec643fb4E5';
  private poolId = 11;
  async getHarvestableUSD( jar: JarDefinition, model: PickleModel, resolver: Signer | Provider): Promise<number> {
    const rewards = new ethers.Contract(this.rewardAddress, dinoRewardAbi, resolver);
    const dinoToken = new ethers.Contract(model.addr("dino"), erc20Abi, resolver);

    const [dino, dinoPrice, dinoBal] = await Promise.all([
      rewards.pendingDino(this.poolId, jar.details.strategyAddr),
      model.prices.get('dino'),
      dinoToken.balanceOf(jar.details.strategyAddr),
    ]);

    const harvestable = dino
      .add(dinoBal)
      .mul(BigNumber.from((dinoPrice * 1e18).toFixed()))
      .div((1e18).toFixed());
    return parseFloat(ethers.utils.formatEther(harvestable));
  }
}
