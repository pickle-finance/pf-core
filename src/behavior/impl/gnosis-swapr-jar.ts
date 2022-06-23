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

const swaprStrategyAbi = [
  "function getActiveRewardsTokens() view returns(address[])",
  "function getHarvestable() view returns(address[],uint256[])",
  "function rewarder() view returns(address)",
];
export class GnosisSwaprJar extends AbstractJarBehavior {
  strategyAbi: any;
  constructor() {
    super();
    this.strategyAbi = swaprStrategyAbi;
  }
  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    const multiProvider = model.multiproviderFor(jar.chain);
    const strategyContract = new Contract(
      jar.details.strategyAddr,
      this.strategyAbi,
    );

    const [[rewardTokensAddresses, harvestableAmounts], activeRewardsTokens] =
      await multiProvider.all([
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
    const [activRewardsBalancesBN, activeRewardsDecimals]: [
      BigNumber[],
      number[],
    ] = await Promise.all([
      multiProvider.all(
        activeRewardsTokens.map((token) =>
          new Contract(token, erc20Abi).balanceOf(jar.details.strategyAddr),
        ),
      ),
      multiProvider.all(
        activeRewardsTokens.map((token) =>
          new Contract(token, erc20Abi).decimals(),
        ),
      ),
    ]);
    activeRewardsTokens.forEach((token, i) => {
      const price = model.priceOfSync(token, jar.chain);
      if (price) {
        const balance = parseFloat(
          formatUnits(activRewardsBalancesBN[i], activeRewardsDecimals[i]),
        );
        runningTotal += price * balance;
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
      new Contract(jar.details.strategyAddr, this.strategyAbi).rewarder(),
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

    const aprComponents: AssetAprComponent[] = [];
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
