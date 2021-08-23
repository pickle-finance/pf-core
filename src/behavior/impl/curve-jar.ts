import { Contract, ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { AssetAprComponent, JarDefinition } from '../../model/PickleModelJson';
import { PriceCache } from '../../price/PriceCache';
import curveGaugeAbi from '../../Contracts/ABIs/curve-gauge.json';
import poolAbi from '../../Contracts/ABIs/pool.json';
import gaugeControllerAbi from '../../Contracts/ABIs/gauge-controller.json';
import { Provider as MulticallProvider, Contract as MulticallContract} from 'ethers-multicall';
import { Chains } from '../../chain/Chains';
import { GaugeController, GaugeController__factory } from '../../Contracts/ContractsImpl';
import { PickleModel } from '../../model/PickleModel';


export const GAUGE_CONTROLLER_ADDR = "0x2F50D538606Fa9EDD2B11E2446BEb18C9D5846bB";

export abstract class CurveJar extends AbstractJarBehavior {
  readonly gaugeAddress: string;

  constructor( gaugeAddress: string) {
    super();
    this.gaugeAddress = gaugeAddress;
  }

  async getCurveCrvAPY(jar: JarDefinition, model: PickleModel, 
    gauge: string, pool: string): Promise<AssetAprComponent> {
      
      const multicallProvider = new MulticallProvider(Chains.get(jar.chain).getPreferredWeb3Provider());
      await multicallProvider.init();
      const mcGauge = new MulticallContract(gauge, curveGaugeAbi);
      const mcPool = new MulticallContract(pool, poolAbi);

      const [workingSupply, gaugeRate, virtualPrice] = (
        await multicallProvider.all([
          mcGauge.working_supply(),
          mcGauge.inflation_rate(),
          mcPool.get_virtual_price(),
        ])
      ).map((x) => parseFloat(ethers.utils.formatUnits(x)));



      const ctrlr : GaugeController = GaugeController__factory.connect(GAUGE_CONTROLLER_ADDR, Chains.getResolver(jar.chain));
      const weight = await ctrlr["gauge_relative_weight(address)"](
        gauge,
      ).then((x) => parseFloat(ethers.utils.formatUnits(x)));

      // https://github.com/curvefi/curve-dao/blob/b7d6d2b6633fd64aa44e80094f6fb5f17f5e771a/src/components/minter/gaugeStore.js#L212
      const rate =
        (((gaugeRate * weight * 31536000) / workingSupply) * 0.4) /
        (virtualPrice * model.prices.get("weth"));

      const crvApy = rate * model.prices.get("crv") * 100;
      return { name: "CRV", apr: crvApy, compoundable: true};
  }


  async getHarvestableUSD( jar: JarDefinition, model: PickleModel, resolver: Signer | Provider): Promise<number> {
    const gauge = new ethers.Contract(this.gaugeAddress, curveGaugeAbi, resolver);
    const [crv, crvPrice] = await Promise.all([
      gauge.callStatic.claimable_tokens(jar.details.strategyAddr),
      model.prices.get('curve-dao-token'),
    ]);
    const harvestable = crv.mul(crvPrice.toFixed());
    return parseFloat(ethers.utils.formatEther(harvestable));
  }
}
