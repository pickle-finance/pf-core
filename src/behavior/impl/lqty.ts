import { BigNumber, ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import erc20Abi from '../../Contracts/ABIs/erc20.json';
import { multiSushiStrategyAbi } from '../../Contracts/ABIs/multi-sushi-strategy.abi';
import { AssetAprComponent, AssetProjectedApr, JarDefinition } from '../../model/PickleModelJson';
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { PickleModel } from '../../model/PickleModel';
import { getOrLoadYearnDataFromDune } from '../../protocols/DuneDataUtility';

export class pLqty extends AbstractJarBehavior {
  async getHarvestableUSD( jar: JarDefinition, model: PickleModel, resolver: Signer | Provider): Promise<number> {
    const strategy = new ethers.Contract(jar.details.strategyAddr, multiSushiStrategyAbi, resolver);
    const wethToken = new ethers.Contract(model.addr("weth"), erc20Abi, resolver);
    const lusdToken = new ethers.Contract(model.addr("lusd"), erc20Abi, resolver);
    const [res, wethWallet, lusdWallet, wethPrice, lusdPrice]: [BigNumber[], BigNumber, BigNumber, number, number] =
      await Promise.all([
        strategy.getHarvestable().catch(() => BigNumber.from('0')),
        wethToken.balanceOf(jar.details.strategyAddr).catch(() => BigNumber.from('0')),
        lusdToken.balanceOf(jar.details.strategyAddr).catch(() => BigNumber.from('0')),
        await model.priceOf("weth"),
        await model.priceOf("lusd"),
      ]);

    const wethValue = res[1].add(wethWallet).mul(wethPrice.toFixed());
    const lusdValue = res[0].add(lusdWallet).mul(lusdPrice.toFixed());
    const harvestable = wethValue.add(lusdValue);
    return parseFloat(ethers.utils.formatEther(harvestable));
  }


  async getProjectedAprStats(_definition: JarDefinition, model: PickleModel) : Promise<AssetProjectedApr> {
    const apr1 : number = await this.calculateLqtyStakingAPY(model);
    const apr1Comp : AssetAprComponent = this.createAprComponent(
      "auto-compounded ETH and LUSD fees", apr1, true);
    return super.aprComponentsToProjectedApr([apr1Comp]);
  }
  async calculateLqtyStakingAPY(model: PickleModel) {
    const duneData = await getOrLoadYearnDataFromDune(model);
    if (duneData) {
      let lqtyApy = 0;
      lqtyApy = duneData?.data?.get_result_by_result_id[0].data?.apr / 100;
      return lqtyApy * 100;
    }
    return 0;
  };
}
