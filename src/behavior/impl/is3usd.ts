
import { BigNumber, ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { JarDefinition } from '../../model/PickleModelJson';
import { PriceCache } from '../../price/PriceCache';
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import {ironchefAbi} from '../../Contracts/ABIs/ironchef.abi';
import { PickleModel } from '../../model/PickleModel';

export class Is3Usd extends AbstractJarBehavior {
  async getHarvestableUSD( jar: JarDefinition, model: PickleModel, resolver: Signer | Provider): Promise<number> {
    const ironchef = new ethers.Contract('0x1fd1259fa8cdc60c6e8c86cfa592ca1b8403dfad', ironchefAbi, resolver);
    const [ice, icePrice] = await Promise.all([
      ironchef.pendingReward(0, jar.details.strategyAddr),
      await model.priceOf('iron-finance'),
    ]);

    const harvestable = ice.mul(BigNumber.from((icePrice * 1e18).toFixed())).div((1e18).toFixed());
    return parseFloat(ethers.utils.formatEther(harvestable)); 
  }
}
