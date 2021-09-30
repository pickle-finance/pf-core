import { ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { ChainNetwork, PickleModel } from '../..';
import { JarDefinition, AssetProjectedApr, AssetAprComponent } from '../../model/PickleModelJson';
import { CurveJar, getCurveRawStats } from './curve-jar';
import { curveThirdPartyGaugeAbi } from '../../Contracts/ABIs/curve-external-gauge.abi';
import { formatEther } from 'ethers/lib/utils';
import curvePoolAbi from '../../Contracts/ABIs/curve-pool.json';
import erc20Abi from '../../Contracts/ABIs/erc20.json';
import { calculateCurveApyArbitrum } from '../../protocols/CurveUtil';

export class CrvTricrypto extends CurveJar {

  constructor() {
    super('0x97E2768e8E73511cA874545DC5Ff8067eB19B787');
  }

  async getDepositTokenPrice(definition: JarDefinition, model: PickleModel): Promise<number> {
    const triPool = '0x960ea3e3C7FB317332d990873d354E18d7645590';
    const triTokenAddress = '0x8e0b8c8bb9db49a46697f3a5bb8a308e744821d2';
    const pool = new ethers.Contract(triPool, curvePoolAbi, model.providerFor(definition.chain));
    const triToken = new ethers.Contract(triTokenAddress, erc20Abi, model.providerFor(definition.chain));

    const [balance0, balance1, balance2, supply, wbtcPrice, ethPrice, virtualPrice] = await Promise.all([
      pool.balances(0),
      pool.balances(1),
      pool.balances(2),
      triToken.totalSupply(),
      model.priceOf('wbtc'),
      model.priceOf('weth'),
      pool.get_virtual_price(),
    ]);

    const scaledBalance0 = balance0 / 1e6;
    const scaledBalance1 = (balance1 / 1e8) * wbtcPrice;
    const scaledBalance2 = (balance2 / 1e18) * ethPrice;
    const totalStakedUsd = (scaledBalance0 + scaledBalance1 + scaledBalance2) * +formatEther(virtualPrice);
    const price = totalStakedUsd / +formatEther(supply);
    return price;
  }

  async getHarvestableUSD( jar: JarDefinition, model: PickleModel, resolver: Signer | Provider): Promise<number> {
    const gauge = new ethers.Contract(this.gaugeAddress, curveThirdPartyGaugeAbi, resolver);
    const [crv, crvPrice] = await Promise.all([
      gauge.claimable_reward(jar.details.strategyAddr, model.address("crv", ChainNetwork.Arbitrum)),
      await model.priceOf('curve-dao-token'),
    ]);
    const harvestable = crv.mul(crvPrice.toFixed());
    return parseFloat(ethers.utils.formatEther(harvestable));
  }

  async getProjectedAprStats(jar: JarDefinition, model: PickleModel) : Promise<AssetProjectedApr> {
    const apr = await calculateCurveApyArbitrum(jar, model, 
      "0x960ea3e3C7FB317332d990873d354E18d7645590",
      "0x97E2768e8E73511cA874545DC5Ff8067eB19B787",
      ["usdt", "wbtc", "weth"]
    );
    return this.aprComponentsToProjectedApr([
      this.createAprComponent("crv", apr, true),
    ]);
  }


}
