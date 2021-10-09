import { BigNumber, ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { sorbettiereAbi } from '../../Contracts/ABIs/sorbettiere.abi';
import { AssetAprComponent, AssetProjectedApr, JarDefinition } from '../../model/PickleModelJson';
import { PriceCache } from '../../price/PriceCache';
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { PickleModel } from '../../model/PickleModel';
import { Chains } from '../../chain/Chains';
import { calculateAbradabraApy } from '../../protocols/AbraCadabraUtil';
import { convexStrategyMim3CRVAbi } from '../../Contracts/ABIs/convex-strategy-mim3crv.abi';
import erc20Abi from '../../Contracts/ABIs/erc20.json';
import { getProjectedConvexAprStats } from '../../protocols/ConvexUtility';
import { getStableswapPrice } from '../../price/DepositTokenPriceUtility';


// TODO strategy being migrated to convex
export class Mim3Crv extends AbstractJarBehavior {
  constructor() {
    super();
  }

  async getDepositTokenPrice(asset: JarDefinition, model: PickleModel): Promise<number> {
    return getStableswapPrice(asset, model);
  }

  async getProjectedAprStats(definition: JarDefinition, model: PickleModel) : Promise<AssetProjectedApr> {
    return this.aprComponentsToProjectedApr(await getProjectedConvexAprStats(definition, model));
  }
  
  async getHarvestableUSD( jar: JarDefinition, model: PickleModel, resolver: Signer | Provider): Promise<number> {
    const crv = new ethers.Contract(model.address("crv", jar.chain), erc20Abi, resolver);
    const spell = new ethers.Contract(model.address("spell", jar.chain), erc20Abi, resolver);
    const cvx = new ethers.Contract(model.address("cvx", jar.chain), erc20Abi, resolver);
    const strategy = new ethers.Contract(jar.details.strategyAddr, convexStrategyMim3CRVAbi, resolver);
    const [crvWallet, cvxWallet, spellWallet, crvPrice, cvxPrice, spellPrice, pending]: [
      BigNumber,
      BigNumber,
      BigNumber,
      number,
      number,
      number,
      BigNumber[],
    ] = await Promise.all([
      crv.balanceOf(jar.details.strategyAddr).catch(() => BigNumber.from('0')),
      cvx.balanceOf(jar.details.strategyAddr).catch(() => BigNumber.from('0')),
      spell.balanceOf(jar.details.strategyAddr).catch(() => BigNumber.from('0')),
      model.priceOfSync('crv'),
      model.priceOfSync('cvx'),
      model.priceOfSync('spell'),
      strategy.getHarvestable(),
    ]);
    const harvestable = crvWallet
      .add(pending[0])
      .mul(crvPrice.toFixed())
      .add(
        cvxWallet.add(pending[1]).mul(cvxPrice.toFixed()).add(spellWallet.add(pending[2]).mul(spellPrice.toFixed())),
      );
    return parseFloat(ethers.utils.formatEther(harvestable));
  }
}
