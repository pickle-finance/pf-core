import { BigNumber, ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import erc20Abi from '../../Contracts/ABIs/erc20.json';
import { AssetAprComponent, AssetProjectedApr, JarDefinition } from '../../model/PickleModelJson';
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { ChainNetwork, Chains } from '../../chain/Chains';
import { PickleModel } from '../../model/PickleModel';
import { calculateMCv2SushiRewards, calculateMCv2TokenRewards, calculateSushiRewardApr, SushiEthPairManager } from '../../protocols/SushiSwapUtil';

export abstract class SushiJar extends AbstractJarBehavior {
  strategyAbi:any;
  constructor(strategyAbi: any) {
    super();
    this.strategyAbi = strategyAbi;
  }
  async getHarvestableUSD( jar: JarDefinition, model: PickleModel, resolver: Signer | Provider): Promise<number> {
    const strategy = new ethers.Contract(jar.details.strategyAddr, this.strategyAbi, resolver);
    const sushiToken = new ethers.Contract(model.address("sushi", ChainNetwork.Ethereum), erc20Abi, resolver);
    const [sushi, wallet, sushiPrice]: [BigNumber, BigNumber, number] = await Promise.all([
      strategy.getHarvestable().catch(() => BigNumber.from('0')),
      sushiToken.balanceOf(jar.details.strategyAddr),
      await model.priceOf('sushi'),
    ]);
    const harvestable = sushi.add(wallet).mul(sushiPrice.toFixed());
    return parseFloat(ethers.utils.formatEther(harvestable));
  }

  async getProjectedAprStats(definition: JarDefinition, model: PickleModel) : Promise<AssetProjectedApr> {
    return await this.chefV1AprStats(definition, model);
  }
  async chefV1AprStats(definition: JarDefinition, model: PickleModel) : Promise<AssetProjectedApr> {
    const apr1 : number = await calculateSushiRewardApr(definition.depositToken.addr,model, Chains.get(definition.chain).getProviderOrSigner());
    const apr1Comp : AssetAprComponent = this.createAprComponent("sushi", apr1, true);

    const lpApr : number = await new SushiEthPairManager().calculateLpApr(model, definition.depositToken.addr);
    const lpComp : AssetAprComponent = this.createAprComponent("lp", lpApr, false);
    return super.aprComponentsToProjectedApr([apr1Comp, lpComp]);
  }

  async chefV2AprStats(definition: JarDefinition, model: PickleModel, rewardToken: string) : Promise<AssetProjectedApr> {
    const aprSushiRewards : number = await calculateMCv2SushiRewards(definition.depositToken.addr, 
      model, Chains.get(definition.chain).getProviderOrSigner());
    const aprSushiComp : AssetAprComponent = this.createAprComponent("sushi", aprSushiRewards,true);

    const aprTokenRewards : number = await calculateMCv2TokenRewards(definition.depositToken.addr,rewardToken, 
      model, Chains.get(definition.chain).getProviderOrSigner());
    const tokenAprComp : AssetAprComponent = this.createAprComponent(rewardToken,aprTokenRewards, true);

    const lpApr : number = await new SushiEthPairManager().calculateLpApr(model, definition.depositToken.addr);
    const lpComp : AssetAprComponent = this.createAprComponent("lp", lpApr,false);
    
    return super.aprComponentsToProjectedApr([aprSushiComp, tokenAprComp, lpComp]);
  }

}
