import { BigNumber, ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { PickleModel } from '../..';
import { JarDefinition, AssetProjectedApr } from '../../model/PickleModelJson';
import erc20Abi from '../../Contracts/ABIs/erc20.json';
import { multiSushiStrategyAbi } from '../../Contracts/ABIs/multi-sushi-strategy.abi';
import { AbstractJarBehavior } from '../AbstractJarBehavior';
import { formatEther } from 'ethers/lib/utils';
import { getLivePairDataFromContracts } from '../../protocols/GenericSwapUtil';
import { ONE_YEAR_SECONDS } from '../JarBehaviorResolver';

export class ArbitrumHndEth extends AbstractJarBehavior {
  constructor() {
    super();
  }

  async getDepositTokenPrice(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    return super.getDepositTokenPrice(definition, model);
  }

  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
    resolver: Signer | Provider,
  ): Promise<number> {
    const strategy = new ethers.Contract(
      jar.details.strategyAddr,
      multiSushiStrategyAbi,
      resolver,
    );
    const dodoToken = new ethers.Contract(
      model.address('dodo', jar.chain),
      erc20Abi,
      resolver,
    );
    const hndToken = new ethers.Contract(
      model.address('hnd', jar.chain),
      erc20Abi,
      resolver,
    );
    const [res, dodoWallet, hndWallet, dodoPrice, hndPrice]: [
      BigNumber[],
      BigNumber,
      BigNumber,
      number,
      number,
    ] = await Promise.all([
      strategy.getHarvestable().catch(() => BigNumber.from('0')),
      dodoToken
        .balanceOf(jar.details.strategyAddr)
        .catch(() => BigNumber.from('0')),
      hndToken
        .balanceOf(jar.details.strategyAddr)
        .catch(() => BigNumber.from('0')),
      model.priceOfSync('dodo'),
      model.priceOfSync('hnd'),
    ]);

    const dodoValue = res[0].add(dodoWallet).mul(dodoPrice.toFixed());
    const hndValue = res[1].add(hndWallet).mul(hndPrice.toFixed());
    const harvestable = dodoValue.add(hndValue);

    return parseFloat(ethers.utils.formatEther(harvestable));
  }

  async getProjectedAprStats(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const rewards = '0x06633cd8E46C3048621A517D6bb5f0A84b4919c6'; // HND-ETH
    const DODO_PER_BLOCK = 0.2665;
    const HND_PER_BLOCK = 1.599;

    const lpToken = new ethers.Contract(
      jar.depositToken.addr,
      erc20Abi,
      model.providerFor(jar.chain),
    );
    const totalSupplyBN = await lpToken.balanceOf(rewards);
    const totalSupply = +formatEther(totalSupplyBN);
    const { pricePerToken } = await getLivePairDataFromContracts(
      jar,
      model,
      18,
    );

    const hndValueRewardedPerYear =
      ((await model.priceOf('hnd')) * HND_PER_BLOCK * ONE_YEAR_SECONDS) / 13.3;

    const dodoValueRewardedPerYear =
      ((await model.priceOf('dodo')) * DODO_PER_BLOCK * ONE_YEAR_SECONDS) /
      13.3;

    const totalValueStaked = totalSupply * pricePerToken;
    const hndAPY = hndValueRewardedPerYear / totalValueStaked;
    const dodoApy = dodoValueRewardedPerYear / totalValueStaked;

    return this.aprComponentsToProjectedApr([
      this.createAprComponent('hnd', hndAPY * 100, true),
      this.createAprComponent('dodo', dodoApy * 100, true),
    ]);
  }
}
