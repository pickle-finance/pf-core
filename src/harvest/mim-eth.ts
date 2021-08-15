import { BigNumber, ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { sorbettiereAbi } from '../Contracts/ABIs/sorbettiere.abi';
import { JarDefinition } from '../model/PickleModelJson';
import { PriceCache } from '../price/PriceCache';
import { AbstractJarHarvestResolver } from './JarHarvestResolver';
import erc20Abi from '../Contracts/ABIs/erc20.json';

export class MimEth extends AbstractJarHarvestResolver {
  constructor() {
    super();
  }

  async getHarvestableUSD( jar: JarDefinition, prices: PriceCache, resolver: Signer | Provider): Promise<number> {
    const sorbettiere = new ethers.Contract(
      '0xf43480afe9863da4acbd4419a47d9cc7d25a647f',
      sorbettiereAbi,
      resolver,
    );
    const spellToken = new ethers.Contract(this.addr("spell"), erc20Abi, resolver);
    const [spell, spellPrice, spellBal] = await Promise.all([
      sorbettiere.pendingIce(2, jar.details.strategyAddr),
      this.priceOf(prices, 'spell'),
      spellToken.balanceOf(jar.details.strategyAddr),
    ]);
    const harvestable = spell.add(spellBal).mul(BigNumber.from((spellPrice * 1e18).toFixed())).div((1e18).toFixed());
    return parseFloat(ethers.utils.formatEther(harvestable));
  }
}
