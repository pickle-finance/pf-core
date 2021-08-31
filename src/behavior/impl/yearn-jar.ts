import { BigNumber, ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import erc20Abi from '../../Contracts/ABIs/erc20.json';
import { AssetAprComponent, AssetProjectedApr, JarDefinition } from '../../model/PickleModelJson';
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { ChainNetwork, Chains } from '../../chain/Chains';
import { PickleModel } from '../../model/PickleModel';
import { calculateMCv2SushiRewards, calculateMCv2TokenRewards, calculateSushiRewardApr, SushiEthPairManager } from '../../protocols/SushiSwapUtil';
import { calculateYearnAPY } from '../../protocols/YearnUtil';

export class YearnJar extends AbstractJarBehavior {
  constructor() {
    super();
  }
  async getHarvestableUSD( _jar: JarDefinition, _model: PickleModel, _resolver: Signer | Provider): Promise<number> {
    return 0;
  }
  async getProjectedAprStats(definition: JarDefinition, model: PickleModel) : Promise<AssetProjectedApr> {
    const apr : number = await calculateYearnAPY(model, definition.depositToken.addr);
    return this.aprComponentsToProjectedApr(
      [this.createAprComponent("yearn", apr, false)]
    );
  }
}
