import { ethers } from "ethers";
import { AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import {
  AbstractJarBehavior,
  ONE_YEAR_IN_SECONDS,
} from "../AbstractJarBehavior";
import { ChainNetwork } from "../../chain/Chains";
import { PickleModel } from "../../model/PickleModel";
import { getCurveRawStats } from "./curve-jar";
import { Contract as MultiContract } from "ethers-multicall";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import { formatEther, formatUnits } from "ethers/lib/utils";
import { getStableswapPriceAddress } from "../../price/DepositTokenPriceUtility";

const swap_abi = ["function balances(uint256) view returns(uint256)"];
const crv_streamer_abi = [
  {
    stateMutability: "view",
    type: "function",
    name: "reward_data",
    inputs: [{ name: "arg0", type: "address" }],
    outputs: [
      { name: "distributor", type: "address" },
      { name: "period_finish", type: "uint256" },
      { name: "rate", type: "uint256" },
      { name: "duration", type: "uint256" },
      { name: "received", type: "uint256" },
      { name: "paid", type: "uint256" },
    ],
  },
];
const non_crv_streamer_abi = [
  {
    stateMutability: "view",
    type: "function",
    name: "period_finish",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    name: "reward_rate",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
];

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
  rewards: [
    {
      stream: "0xC48f4653dd6a9509De44c92beb0604BEA3AEe714",
      token: "0x172370d5Cd63279eFa6d502DAB29171933a610AF",
      id: "crv",
      decimals: 18,
      abi: crv_streamer_abi,
    },
    {
      stream: "0xBdFF0C27dd073C119ebcb1299a68A6A92aE607F0",
      token: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
      id: "matic",
      decimals: 18,
      abi: non_crv_streamer_abi,
    },
  ],
};

// changed stateMutability to view to allow calling the function as constant
const curveThirdPartyGaugeAbi = [
  {
    stateMutability: "view",
    type: "function",
    name: "claimable_reward_write",
    inputs: [
      { name: "_addr", type: "address" },
      { name: "_token", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
    // gas: "2067577",
  },
];

export class PThreeCrv extends AbstractJarBehavior {
  constructor() {
    super();
  }

  async getDepositTokenPrice(
    asset: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    return getStableswapPriceAddress(
      "0x445fe580ef8d70ff569ab36e80c647af338db351",
      asset,
      model,
    );
  }

  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    const gauge = new MultiContract(
      "0x19793B454D3AfC7b454F206Ffe95aDE26cA6912c",
      curveThirdPartyGaugeAbi,
    );
    const [matic, crv] = await model.callMulti(
      [
        () =>
          gauge.claimable_reward_write(
            jar.details.strategyAddr,
            model.address("matic", ChainNetwork.Polygon),
          ),
        () =>
          gauge.claimable_reward_write(
            jar.details.strategyAddr,
            model.address("crv", ChainNetwork.Polygon),
          ),
      ],
      jar.chain,
    );
    const maticPrice = model.priceOfSync("matic", jar.chain);
    const crvPrice = model.priceOfSync("crv", jar.chain);

    const harvestable = matic
      .mul(maticPrice.toFixed())
      .add(crv.mul(crvPrice.toFixed()));
    return parseFloat(ethers.utils.formatEther(harvestable));
  }

  async getProjectedAprStats(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const lpToken = new MultiContract(jar.depositToken.addr, erc20Abi);

    const lpBalance = await model.callMulti(
      // Balance staked in gauge
      () => lpToken.balanceOf(aaveContracts.gauge_address),
      jar.chain,
    );

    const yearlyRewards = await this.getRewardsAprs(jar, model);
    const rewardsAprComponents = yearlyRewards.map((reward) => {
      const apr = reward.yearlyRewardsUSD / +formatEther(lpBalance);
      return this.createAprComponent(reward.id, apr * 100, true);
    });

    // TODO: matic rewards calculation is inaccurate and should be fixed ... sometime
    let isMaticRewardsRetrieved = false;
    yearlyRewards.forEach((x) => {
      if (x.id === "matic") isMaticRewardsRetrieved = true;
    });

    if (!isMaticRewardsRetrieved) {
      const wmaticRewardsAmount =
        model.priceOfSync("matic", jar.chain) * 414597 * 6; // Reward rate is reverse engineered, not sure how long it will last correct!
      const wmaticAPY = wmaticRewardsAmount / +formatEther(lpBalance);
      rewardsAprComponents.push(
        this.createAprComponent("matic", wmaticAPY * 100, true),
      );
    }

    const curveRawStats: any = await getCurveRawStats(model, jar.chain);

    return this.aprComponentsToProjectedApr([
      this.createAprComponent(
        "lp",
        curveRawStats ? curveRawStats.aave : 0,
        false,
      ),
      ...rewardsAprComponents,
    ]);
  }

  async getRewardsAprs(jar: JarDefinition, model: PickleModel) {
    const yearlyRewards = (
      await Promise.all(
        aaveContracts.rewards.map(async (reward) => {
          let rewardRate: number;
          let periodFinish: number;
          const price = model.priceOfSync(reward.token, jar.chain);
          if (reward.id === "crv") {
            const rewardStreamer = new MultiContract(reward.stream, reward.abi);
            const { period_finish: periodFinishBN, rate: rateBN } =
              await model.callMulti(
                () => rewardStreamer.reward_data(reward.token),
                jar.chain,
              );
            rewardRate = +formatUnits(rateBN, reward.decimals);
            periodFinish = +formatUnits(periodFinishBN, 0);
          } else {
            const rewardStreamer = new MultiContract(reward.stream, reward.abi);
            const [periodFinishBN, rateBN] = await model.callMulti(
              [
                () => rewardStreamer.period_finish(),
                () => rewardStreamer.reward_rate(),
              ],
              jar.chain,
            );
            rewardRate = +formatUnits(rateBN, reward.decimals);
            periodFinish = +formatUnits(periodFinishBN, 0);
          }

          return {
            token: reward.token,
            id: reward.id,
            periodFinish: periodFinish,
            yearlyRewardsUSD: rewardRate * price * ONE_YEAR_IN_SECONDS,
          };
        }),
      )
    ).filter((x) => x.periodFinish > Date.now() / 1000);

    return yearlyRewards;
  }
}
