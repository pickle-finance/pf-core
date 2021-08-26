import { ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { AssetProjectedApr, JarDefinition } from '../../model/PickleModelJson';
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import {foldingStrategyAbi} from '../../Contracts/ABIs/folding-strategy.abi';
import AaveStrategyAbi from '../../Contracts/ABIs/aave-strategy.json';
import { PickleModel } from '../../model/PickleModel';
import { Provider as MulticallProvider, Contract as MulticallContract} from 'ethers-multicall';
import { ChainNetwork, Chains } from '../../chain/Chains';
import fetch from 'cross-fetch';

export class DaiJar extends AbstractJarBehavior {
   async getHarvestableUSD( jar: JarDefinition, model: PickleModel, resolver: Signer | Provider): Promise<number> {
    const strategy = new ethers.Contract(jar.details.strategyAddr, foldingStrategyAbi, resolver);
    const [matic, maticPrice] = await Promise.all([strategy.getMaticAccrued(), await model.priceOf('matic')]);
    const harvestable = matic.mul(maticPrice.toFixed());
    return parseFloat(ethers.utils.formatEther(harvestable));
  }


  async getProjectedAprStats(definition: JarDefinition, model: PickleModel) : Promise<AssetProjectedApr> {
    return this.calculateAaveAPY(definition, model,
      model.address("dai", ChainNetwork.Polygon),
      "0x0b198b5EE64aB29c98A094380c867079d5a1682e");
}

  async calculateAaveAPY(jar: JarDefinition, model: PickleModel,
     assetAddress: string, strategyAddress: string ) : Promise<AssetProjectedApr> {
    const pools = await fetch(
      "https://aave-api-v2.aave.com/data/liquidity/v2?poolId=0xd05e3E715d945B59290df0ae8eF85c1BdB684744",
    ).then((response) => response.json());
    const pool = pools?.find(
      (pool) =>
        pool.underlyingAsset.toUpperCase() === assetAddress.toUpperCase(),
    );

    const multicallProvider = new MulticallProvider(Chains.get(jar.chain).getPreferredWeb3Provider());
    await multicallProvider.init();

    const maticPrice = await model.priceOf("matic");
    if (!pool || !maticPrice || !multicallProvider) 
      return super.aprComponentsToProjectedApr(
        [super.createAprComponent("Error Loading APY", 0, false)]
      );


    const aaveStrategy = new MulticallContract(strategyAddress,AaveStrategyAbi);
    const [supplied, borrowed, balance] = (
      await multicallProvider.all([
        aaveStrategy.getSuppliedView(),
        aaveStrategy.getBorrowedView(),
        aaveStrategy.balanceOfPool(),
      ])
    ).map((x) => parseFloat(ethers.utils.formatEther(x)));

    const rawSupplyAPY = +pool["avg1DaysLiquidityRate"];
    const rawBorrowAPY = +pool["avg1DaysVariableBorrowRate"];

    const supplyMaticAPR =
      (+pool.aEmissionPerSecond * 365 * 3600 * 24 * maticPrice) /
      +pool["totalLiquidity"] /
      +pool["referenceItem"]["priceInUsd"];
    const borrowMaticAPR =
      (+pool.vEmissionPerSecond * 365 * 3600 * 24 *  maticPrice) /
      +pool["totalDebt"] /
      +pool["referenceItem"]["priceInUsd"];

    const maticAPR =
      (supplied * supplyMaticAPR + borrowed * borrowMaticAPR) /
      (balance * 1e18);

    const rawAPY =
      (rawSupplyAPY * supplied - rawBorrowAPY * borrowed) / balance;

      return super.aprComponentsToProjectedApr([
        super.createAprComponent("lp", rawAPY, false),
        super.createAprComponent("matic", maticAPR*100, true)
      ]);
  };
}
