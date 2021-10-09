import { ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { curveThirdPartyGaugeAbi } from '../../Contracts/ABIs/curve-external-gauge.abi';
import { AssetAprComponent, AssetProjectedApr, JarDefinition } from '../../model/PickleModelJson';
import { PriceCache } from '../../price/PriceCache';
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { ChainNetwork, Chains } from '../../chain/Chains';
import { PickleModel } from '../../model/PickleModel';
import { getCurveRawStats } from './curve-jar';
import { Provider as MulticallProvider, Contract as MulticallContract} from 'ethers-multicall';
import erc20Abi from '../../Contracts/ABIs/erc20.json';
import fetch from 'cross-fetch';
import { formatEther } from 'ethers/lib/utils';
import { getStableswapPriceAddress } from '../../price/DepositTokenPriceUtility';

const swap_abi = ["function balances(uint256) view returns(uint256)"];

const aaveContracts = {
  N_COINS: 3,
  is_aave: true,
  coin_precisions: [1e18, 1e6, 1e6],
  wrapped_precisions: [1e18, 1e6, 1e6],
  use_lending: [false, false, false],
  tethered: [false, false, true],
  is_plain: [false, false, false],
  swap_address: "0x445FE580eF8d70FF569aB36e80c647af338db351",
  token_address: "0xE7a24EF0C5e95Ffb0f6684b813A78F2a3AD7D171",
  gauge_address: "0x19793B454D3AfC7b454F206Ffe95aDE26cA6912c",
  underlying_coins: [
    "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063",
    "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
  ],
  coins: [
    "0x27F8D03b3a2196956ED754baDc28D73be8830A6e",
    "0x1a13F4Ca1d028320A707D99520AbFefca3998b7F",
    "0x60D55F02A771d515e077c9C2403a1ef324885CeC",
  ],
  swap_abi: swap_abi,
  // sCurveRewards_abi: paaveRewardsabi,
  sCurveRewards_address: "0xBdFF0C27dd073C119ebcb1299a68A6A92aE607F0",
  reward_token: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
};

export class PThreeCrv extends AbstractJarBehavior {
  constructor() {
    super();
  }

  async getDepositTokenPrice(asset: JarDefinition, model: PickleModel): Promise<number> {
    return getStableswapPriceAddress("0x445fe580ef8d70ff569ab36e80c647af338db351", asset, model);
  }

  async getHarvestableUSD( jar: JarDefinition, model: PickleModel, resolver: Signer | Provider): Promise<number> {
    const gauge = new ethers.Contract(
      '0x19793B454D3AfC7b454F206Ffe95aDE26cA6912c',
      curveThirdPartyGaugeAbi,
      resolver,
    );
    const [matic, maticPrice, crv, crvPrice] = await Promise.all([
      gauge.claimable_reward(jar.details.strategyAddr, model.address("matic", ChainNetwork.Polygon)),
      await model.priceOf('matic'),
      gauge.claimable_reward(jar.details.strategyAddr, model.address("crv", ChainNetwork.Polygon)),
      await model.priceOf('crv'),
    ]);

    const harvestable = matic.mul(maticPrice.toFixed()).add(crv.mul(crvPrice.toFixed()));
    return parseFloat(ethers.utils.formatEther(harvestable));
  }


  async getProjectedAprStats(jar: JarDefinition, model: PickleModel) : Promise<AssetProjectedApr> {
    const multicallProvider = model.multicallProviderFor(jar.chain);
    await multicallProvider.init();

    const now = Date.now() / 1000;
    const statsAave = await (
      await fetch(
        `https://aave-api-v2.aave.com/data/markets-data/0xd05e3e715d945b59290df0ae8ef85c1bdb684744`,
      )
    ).json();

    const lpToken = new MulticallContract(jar.depositToken.addr, erc20Abi);
    const swap = new MulticallContract(
      aaveContracts.swap_address,aaveContracts.swap_abi);

    const aaveApys: number[] = [];
    aaveContracts.underlying_coins.map(async (coinAddress) => {
      const coinData = statsAave.reserves.find(
        ({ underlyingAsset }: { underlyingAsset: string }) =>
          underlyingAsset === coinAddress,
      );
      aaveApys.push(coinData.aIncentivesAPY);
    });

    const [
      balance0,
      balance1,
      balance2,
      lpSupply,
      lpBalance, // Balance staked in gauge
    ] = await multicallProvider.all([
      swap.balances(0),
      swap.balances(1),
      swap.balances(2),
      lpToken.totalSupply(),
      lpToken.balanceOf(aaveContracts.gauge_address),
    ]);
    const scaledBalance0 = balance0 / aaveContracts.coin_precisions[0];
    const scaledBalance1 = balance1 / aaveContracts.coin_precisions[1];
    const scaledBalance2 = balance2 / aaveContracts.coin_precisions[2];

    const totalBalance = scaledBalance0 + scaledBalance1 + scaledBalance2;
    const aaveAPY =
      aaveApys[0] * (scaledBalance0 / totalBalance) +
      aaveApys[1] * (scaledBalance1 / totalBalance) +
      aaveApys[2] * (scaledBalance2 / totalBalance);

    const wmaticRewardsAmount = await model.priceOf("matic") * 1042784 * 6; // Multiplied by 6 to annualize the rewards
    const crvRewardsAmount = await model.priceOf("crv") * 796812 * 6;

    const wmaticAPY = wmaticRewardsAmount / +formatEther(lpBalance);
    const crvAPY = crvRewardsAmount / +formatEther(lpBalance);


    const curveRawStats : any = await getCurveRawStats(model, jar.chain);
  
   return this.aprComponentsToProjectedApr([
        this.createAprComponent("lp", curveRawStats ? curveRawStats.aave : 0, false),
        this.createAprComponent("crv", crvAPY, true),
        this.createAprComponent("matic", wmaticAPY, true)
    ]);
  }
}
