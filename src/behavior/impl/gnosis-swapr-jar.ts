import {
  JarDefinition,
  AssetAprComponent,
  AssetProjectedApr,
} from "../../model/PickleModelJson";
import {
  createAprComponentImpl,
  AbstractJarBehavior,
  ONE_YEAR_IN_SECONDS,
} from "../AbstractJarBehavior";
import { Contract } from "ethers-multiprovider";
import { PickleModel } from "../../model/PickleModel";
import swaprRewarderAbi from "../../Contracts/ABIs/swapr-rewarder.json";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import { formatEther, formatUnits } from "ethers/lib/utils";
import { Chains } from "../../chain/Chains";
import { ExternalTokenModelSingleton } from "../../price/ExternalTokenModel";
import { BigNumber } from "ethers";

// Info for individual rewarder contracts
const swaprRewarders = {
  "0xD7b118271B1B7d26C9e044Fc927CA31DccB22a5a": {
    name: "GNO-XDAI",
    rewarder: "0x070386C4d038FE96ECC9D7fB722b3378Aace4863",
    rewards: ["swapr", "gno"],
  },
  "0x8028457E452D7221dB69B1e0563AA600A059fab1": {
    name: "COW-WETH",
    rewarder: "0xDa72E71f84DC15c80941D70494D6BD8a623DCBB4",
    rewards: ["swapr", "gno", "cow"],
  },
  "0x5fCA4cBdC182e40aeFBCb91AFBDE7AD8d3Dc18a8": {
    name: "GNO-WETH",
    rewarder: "0x40b37ba95f9BCf8930E6f8A65e5B4534518c3EAB",
    rewards: ["swapr", "gno"],
  },
  "0xf6Be7AD58F4BAA454666b0027839a01BcD721Ac3": {
    name: "BTC-WETH",
    rewarder: "0x60eC5c7Ddfe17203c706D7082224f67d0e005fcC",
    rewards: ["swapr", "gno"],
  },
  "0x558d777B24366f011E35A9f59114D1b45110d67B": {
    name: "DXD-GNO",
    rewarder: "0x6148399F63c3dfdDf33A77c63A87C54e597D80E5",
    rewards: ["swapr", "gno"],
  },
  "0x1865d5445010E0baf8Be2eB410d3Eae4A68683c2": {
    name: "XDAI-WETH",
    rewarder: "0xCB3aAba65599341B5beb24b6001611077c5979E6",
    rewards: ["swapr", "gno"],
  },
  "0xDBF14bce36F661B29F6c8318a1D8944650c73F38": {
    name: "COW-GNO",
    rewarder: "0x95DBc58bCBB3Bc866EdFFC107d65D479d83799E5",
    rewards: ["swapr", "gno", "cow"],
  },
};

export async function calculateGnosisSwaprAPY(
  jar: JarDefinition,
  model: PickleModel,
): Promise<AssetAprComponent[]> {
  const rewarder = swaprRewarders[jar.depositToken.addr].rewarder;
  const multiProvider = model.multiproviderFor(jar.chain);
  const multicallRewarder = new Contract(rewarder, swaprRewarderAbi);

  const [rewardTokens, duration, totalSupplyBN] = await multiProvider.all([
    multicallRewarder.getRewardTokens(),
    multicallRewarder.secondsDuration(),
    multicallRewarder.totalStakedTokensAmount(),
  ]);

  const pricePerToken = model.priceOfSync(jar.depositToken.addr, jar.chain);
  const totalSupply = parseFloat(formatEther(totalSupplyBN));
  const totalValueStaked = totalSupply * pricePerToken;

  const rewardData = [];
  for (let i = 0; i < rewardTokens.length; i++) {
    rewardData.push(
      await multiProvider.all([multicallRewarder.rewards(i)]).then((x) => x[0]),
    );
  }

  const rewardsReturn = [];
  for (let i = 0; i < rewardData.length; i++) {
    const rewardTokenAddress = rewardData[i][0];
    const rewardTokenName = swaprRewarders[jar.depositToken.addr].rewards[i];
    const price = model.priceOfSync(rewardTokenAddress, jar.chain);

    if (price) {
      const amountBN = rewardData[i][1];
      const amount = parseFloat(formatEther(amountBN));
      const rewardPerSecond = amount / duration;
      const rewardPerYear = rewardPerSecond * ONE_YEAR_IN_SECONDS;
      const valueRewardedPerYear =
        model.priceOfSync(rewardTokenName, jar.chain) * rewardPerYear;
      const rewardAPY = (valueRewardedPerYear / totalValueStaked) * 100;

      rewardsReturn.push(
        createAprComponentImpl(
          rewardTokenName,
          rewardAPY,
          true,
          1 - Chains.get(jar.chain).defaultPerformanceFee,
        ),
      );
    }
  }
  return rewardsReturn;
}

export class GnosisSwaprJar extends AbstractJarBehavior {
  strategyAbi: any;
  constructor() {
    super();
    this.strategyAbi = swaprRewarderAbi;
  }
  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    // const rewarder = swaprRewarders[jar.depositToken.addr].rewarder;
    // const multiProvider = model.multiproviderFor(jar.chain);
    // const multicallRewarder = new Contract(rewarder, swaprRewarderAbi);

    // // Returns a list of claimable amounts
    // const [claimablesBN] = await multiProvider.all([
    //   multicallRewarder.claimableRewards(jar.details.strategyAddr),
    // ]);

    // /*
    //   Get the claimables tokens
    //   Note: some rewarders give out some weird worthless tokens
    //   (e.g, 0x070386C4d038FE96ECC9D7fB722b3378Aace4863 give an extra worthless token)
    // */
    // const tokensInfo = await multiProvider.all(
    //   claimablesBN.map((_, i) => multicallRewarder.rewards(i)),
    // );
    // const rewardTokens = tokensInfo.map((info) =>
    //   ExternalTokenModelSingleton.getToken(info.token, jar.chain),
    // );

    // const claimablesUSD = claimablesBN
    //   .map((c, i) => {
    //     if (!rewardTokens[i]) return;
    //     const price = model.priceOfSync(
    //       rewardTokens[i].contractAddr,
    //       jar.chain,
    //     );
    //     const claimable = parseFloat(formatUnits(c, rewardTokens[i].decimals));
    //     return claimable * price;
    //   })
    //   .filter((x) => x);

    // return claimablesUSD.reduce((x, y) => x + y);

    const multiProvider = model.multiproviderFor(jar.chain);
    const strategyContract = new Contract(
      jar.details.strategyAddr,
      swaprStrategyAbi,
    );

    const [
      [rewardTokensAddresses, harvestableAmounts],
      activeRewardsTokens,
    ] /* : [
      string[],
      BigNumber[],
    ][]  */ = await multiProvider.all([
      strategyContract.getHarvestable(),
      strategyContract.getActiveRewardsTokens(),
    ]);

    const [decimals]: number[] = await multiProvider.all(
      rewardTokensAddresses.map((token) =>
        new Contract(token, erc20Abi).decimals(),
      ),
    );

    // Some swapr rewarders gives out unswappable reward tokens, so we ignore those.
    let runningTotal = 0;
    rewardTokensAddresses.forEach((token, i) => {
      const price = model.priceOfSync(token, jar.chain);
      if (price) {
        const claimable = parseFloat(
          formatUnits(harvestableAmounts[i], decimals[i]),
        );
        runningTotal += price * claimable;
      }
    });

    // Active Reward Tokens in the strategy
    activeRewardsTokens.forEach((token, i) => {
      const price = model.priceOfSync(token, jar.chain);
      if (price) {
        const claimable = parseFloat(
          formatUnits(harvestableAmounts[i], decimals[i]),
        );
        runningTotal += price * claimable;
      }
    });

    return runningTotal;
  }

  async getProjectedAprStats(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const multiProvider = model.multiproviderFor(jar.chain);

    const [rewarderAddress] = await multiProvider.all([
      new Contract(jar.details.strategyAddr, swaprStrategyAbi).rewarder(),
    ]);

    const rewarderContract = new Contract(rewarderAddress, swaprRewarderAbi);
    const [rewardTokens, duration, totalSupplyBN] = await multiProvider.all([
      rewarderContract.getRewardTokens(),
      rewarderContract.secondsDuration(),
      rewarderContract.totalStakedTokensAmount(),
    ]);

    const pricePerToken = model.priceOfSync(jar.depositToken.addr, jar.chain);
    const totalSupply = parseFloat(formatEther(totalSupplyBN));
    const totalValueStaked = totalSupply * pricePerToken;

    const rewardData = [];
    for (let i = 0; i < rewardTokens.length; i++) {
      rewardData.push(
        await multiProvider
          .all([rewarderContract.rewards(i)])
          .then((x) => x[0]),
      );
    }

    const aprComponents:AssetAprComponent[] = [];
    for (let i = 0; i < rewardData.length; i++) {
      const rewardTokenAddress = rewardData[i][0];
      const price = model.priceOfSync(rewardTokenAddress, jar.chain);

      if (price) {
        const rewardTokenName = ExternalTokenModelSingleton.getToken(
          rewardTokenAddress,
          jar.chain,
        ).id;
        const amountBN = rewardData[i][1];
        const amount = parseFloat(formatEther(amountBN));
        const rewardPerSecond = amount / duration;
        const rewardPerYear = rewardPerSecond * ONE_YEAR_IN_SECONDS;
        const valueRewardedPerYear =
          model.priceOfSync(rewardTokenName, jar.chain) * rewardPerYear;
        const rewardAPY = (valueRewardedPerYear / totalValueStaked) * 100;

        aprComponents.push(
          createAprComponentImpl(
            rewardTokenName,
            rewardAPY,
            true,
            1 - Chains.get(jar.chain).defaultPerformanceFee,
          ),
        );
      }
    }
    
    return this.aprComponentsToProjectedApr(aprComponents);
  }
}

const swaprStrategyAbi = [
  {
    type: "constructor",
    stateMutability: "nonpayable",
    inputs: [
      { type: "address", name: "_governance", internalType: "address" },
      { type: "address", name: "_strategist", internalType: "address" },
      { type: "address", name: "_controller", internalType: "address" },
      { type: "address", name: "_timelock", internalType: "address" },
    ],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "address", name: "", internalType: "address" }],
    name: "activeRewardsTokens",
    inputs: [{ type: "uint256", name: "", internalType: "uint256" }],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "addToNativeRoute",
    inputs: [{ type: "address[]", name: "path", internalType: "address[]" }],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "balanceOf",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "balanceOfPool",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "balanceOfWant",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "address", name: "", internalType: "address" }],
    name: "controller",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "deactivateReward",
    inputs: [{ type: "address", name: "reward", internalType: "address" }],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "deposit",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "payable",
    outputs: [{ type: "bytes", name: "response", internalType: "bytes" }],
    name: "execute",
    inputs: [
      { type: "address", name: "_target", internalType: "address" },
      { type: "bytes", name: "_data", internalType: "bytes" },
    ],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "address[]", name: "", internalType: "address[]" }],
    name: "getActiveRewardsTokens",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [
      { type: "address[]", name: "", internalType: "address[]" },
      { type: "uint256[]", name: "", internalType: "uint256[]" },
    ],
    name: "getHarvestable",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "pure",
    outputs: [{ type: "string", name: "", internalType: "string" }],
    name: "getName",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "address", name: "", internalType: "address" }],
    name: "governance",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "harvest",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "bool", name: "", internalType: "bool" }],
    name: "harvesters",
    inputs: [{ type: "address", name: "", internalType: "address" }],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "address", name: "", internalType: "address" }],
    name: "native",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "address", name: "", internalType: "address" }],
    name: "nativeToTokenRoutes",
    inputs: [
      { type: "address", name: "", internalType: "address" },
      { type: "uint256", name: "", internalType: "uint256" },
    ],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "performanceDevFee",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "performanceDevMax",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "performanceTreasuryFee",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "performanceTreasuryMax",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "revokeHarvesters",
    inputs: [
      { type: "address[]", name: "_harvesters", internalType: "address[]" },
    ],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "address", name: "", internalType: "address" }],
    name: "rewarder",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "setController",
    inputs: [{ type: "address", name: "_controller", internalType: "address" }],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "setGovernance",
    inputs: [{ type: "address", name: "_governance", internalType: "address" }],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "setPerformanceDevFee",
    inputs: [
      { type: "uint256", name: "_performanceDevFee", internalType: "uint256" },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "setPerformanceTreasuryFee",
    inputs: [
      {
        type: "uint256",
        name: "_performanceTreasuryFee",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "setRewarder",
    inputs: [{ type: "address", name: "_rewarder", internalType: "address" }],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "setStrategist",
    inputs: [{ type: "address", name: "_strategist", internalType: "address" }],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "setTimelock",
    inputs: [{ type: "address", name: "_timelock", internalType: "address" }],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "setWithdrawalDevFundFee",
    inputs: [
      {
        type: "uint256",
        name: "_withdrawalDevFundFee",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "setWithdrawalTreasuryFee",
    inputs: [
      {
        type: "uint256",
        name: "_withdrawalTreasuryFee",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "address", name: "", internalType: "address" }],
    name: "strategist",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "address", name: "", internalType: "address" }],
    name: "timelock",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "address", name: "", internalType: "address" }],
    name: "toNativeRoutes",
    inputs: [
      { type: "address", name: "", internalType: "address" },
      { type: "uint256", name: "", internalType: "uint256" },
    ],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "address", name: "", internalType: "address" }],
    name: "token0",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "address", name: "", internalType: "address" }],
    name: "token1",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "address", name: "", internalType: "address" }],
    name: "uniV2Router",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "address", name: "", internalType: "address" }],
    name: "want",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "whitelistHarvesters",
    inputs: [
      { type: "address[]", name: "_harvesters", internalType: "address[]" },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "withdraw",
    inputs: [{ type: "uint256", name: "_amount", internalType: "uint256" }],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [{ type: "uint256", name: "balance", internalType: "uint256" }],
    name: "withdraw",
    inputs: [
      { type: "address", name: "_asset", internalType: "contract IERC20" },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [{ type: "uint256", name: "balance", internalType: "uint256" }],
    name: "withdrawAll",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [{ type: "uint256", name: "balance", internalType: "uint256" }],
    name: "withdrawForSwap",
    inputs: [{ type: "uint256", name: "_amount", internalType: "uint256" }],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "withdrawalDevFundFee",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "withdrawalDevFundMax",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "withdrawalTreasuryFee",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "withdrawalTreasuryMax",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "address", name: "", internalType: "address" }],
    name: "xdai",
    inputs: [],
  },
];
