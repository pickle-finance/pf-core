import { BigNumber, ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { JarDefinition } from '../model/PickleModelJson';
import { PriceCache } from '../price/PriceCache';
import { CurveJar } from './curve-jar';
import erc20Abi from '../Contracts/ABIs/erc20.json';
import { curveThirdPartyGaugeAbi } from '../Contracts/ABIs/curve-external-gauge.abi';

const lidoAddress = '0x5a98fcbea516cf06857215779fd812ca3bef1b32';

export class SteCrv extends CurveJar {
  constructor() {
    super( '0x182b723a58739a9c974cfdb385ceadb237453c28');
  }
  async getHarvestableUSD( jar: JarDefinition, prices: PriceCache, resolver: Signer | Provider): Promise<number> {
    const lido = new ethers.Contract(lidoAddress, erc20Abi, resolver);
    const gauge = new ethers.Contract(this.gaugeAddress, curveThirdPartyGaugeAbi, resolver);
    const [crv, crvPrice, ldo, ldoWallet, ldoPrice]: [BigNumber, number, BigNumber, BigNumber, number] =
      await Promise.all([
        gauge.callStatic.claimable_tokens(jar.details.strategyAddr),
        this.priceOf(prices, 'curve-dao-token'),
        gauge.callStatic.claimable_reward(jar.details.strategyAddr, lidoAddress),
        lido.balanceOf(jar.details.strategyAddr),
        this.priceOf(prices, 'lido-dao'),
      ]);
    const lidoValue = ldo.add(ldoWallet).mul(ldoPrice.toFixed());
    const harvestable = crv.mul(crvPrice.toFixed()).add(lidoValue);
    return parseFloat(ethers.utils.formatEther(harvestable));
  }
}
