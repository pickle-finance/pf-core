import {
  AssetEnablement,
  DillDetails,
  DillWeek,
  JarDefinition,
} from "../model/PickleModelJson";
import { BigNumber, ethers } from "ethers";
import { Contract as MultiContract } from "ethers-multicall";
import dillAbi from "../Contracts/ABIs/dill.json";
import feeDistributorAbiV2 from "../Contracts/ABIs/fee-distributor-v2.json";
import feeDistributorAbi from "../Contracts/ABIs/fee-distributor.json";
import Erc20Abi from "../Contracts/ABIs/erc20.json";
import { fetchHistoricalPriceSeries } from "../price/CoinGeckoPriceResolver";
import moment from "moment";
import { ChainNetwork, Chains, PickleModel } from "..";
import { DEBUG_OUT } from "../model/PickleModel";
// import { Erc20, Erc20__factory } from "../Contracts/ContractsImpl";

const week = 7 * 24 * 60 * 60;
const firstMeaningfulDistributionTimestamp = 1619049600;
const firstMeaningfulDistributionTimestampV2 = 1652313600;

export const DILL_CONTRACT = "0xbBCf169eE191A1Ba7371F30A1C344bFC498b29Cf";
export const FEE_DISTRIBUTOR = "0x74C6CadE3eF61d64dcc9b97490d9FbB231e4BdCc";
export const FEE_DISTRIBUTOR_V2 = "0x2c6C87E7E6195ab7A4f19d3CF31D867580Bb2a1b";
export const PICKLE_TOKEN = "0x429881672B9AE42b8EbA0E26cD9C73711b891Ca5";
/**
 * This implementation is kinda dumb and just takes the current APR
 * of all compoundable reward tokens of all jars and adds them together.
 *
 * @param jars
 * @returns
 */
export function getWeeklyDistribution(jars: JarDefinition[]): number {
  const enabledJars = jars.filter(
    (x) => x.enablement === AssetEnablement.ENABLED,
  );
  let runningRevenue = 0;
  for (let i = 0; i < enabledJars.length; i++) {
    if (enabledJars[i].aprStats && enabledJars[i].details.harvestStats) {
      let balance = enabledJars[i].details.harvestStats.balanceUSD;
      if (balance === undefined || isNaN(balance)) {
        balance = 0;
      }
      const components = enabledJars[i].aprStats.components;
      let jarUSD = 0;
      for (let j = 0; j < components.length; j++) {
        if (components[j].compoundable) {
          const apr1 = components[j].apr / 100;
          // We already took 20% off the compoundables,
          // so to get our fee, it's 25% of what remains
          const chainFee = Chains.get(
            enabledJars[i].chain,
          ).defaultPerformanceFee;
          const pctFee = chainFee / (1 - chainFee);
          // aprs are 360 days. convert to 365 days for more accurate weekly
          const yearlyRevPct = (apr1 * pctFee * 365) / 360;
          const weeklyRevPct = yearlyRevPct / 52;
          const weeklyFee = weeklyRevPct * balance;
          const jarComponentUSD = weeklyFee;
          jarUSD += jarComponentUSD || 0;
        }
      }
      runningRevenue += jarUSD;
    }
  }
  return runningRevenue * 0.45;
}

export async function getDillDetails(
  thisWeekProjectedDistribution: number,
  picklePrice: number,
  model: PickleModel,
  chain: ChainNetwork,
): Promise<DillDetails> {
  DEBUG_OUT("Begin getDillDetails");
  const start = Date.now();
  const multicallProvider = model.multicallProviderFor(chain);
  await multicallProvider.init();

  const picklePriceSeriesPromise = fetchHistoricalPriceSeries({
    from: new Date(firstMeaningfulDistributionTimestamp * 1000),
  });

  try {
    const dillContract = new MultiContract(DILL_CONTRACT, dillAbi);
    const feeDistContract = new MultiContract(
      FEE_DISTRIBUTOR,
      feeDistributorAbi,
    );
    const feeDistContractV2 = new MultiContract(
      FEE_DISTRIBUTOR_V2,
      feeDistributorAbiV2,
    );
    const pickleContract = new MultiContract(PICKLE_TOKEN, Erc20Abi);

    // Ignore initial negligible distributions that distort
    // PICKLE/DILL ratio range.
    let workingTimeBN = ethers.BigNumber.from(
      firstMeaningfulDistributionTimestamp,
    );
    const startTime = firstMeaningfulDistributionTimestamp;
    const payoutTimes: BigNumber[] = [];
    for (let time = startTime; time < Date.now() / 1000; time += week) {
      payoutTimes.push(workingTimeBN);
      workingTimeBN = workingTimeBN.add(ethers.BigNumber.from(week));
    }

    let workingTimeBNV2 = ethers.BigNumber.from(
      firstMeaningfulDistributionTimestampV2,
    );
    const startTimeV2 = firstMeaningfulDistributionTimestampV2;
    const payoutTimesV2: BigNumber[] = [];
    for (let time = startTimeV2; time < Date.now() / 1000; time += week) {
      payoutTimesV2.push(workingTimeBNV2);
      workingTimeBNV2 = workingTimeBNV2.add(ethers.BigNumber.from(week));
    }

    const payoutV2idx = payoutTimes.findIndex(t => t.eq(payoutTimesV2[0]));

    const batch1Promise = model.callMulti(
      [
        () => dillContract.supply(),
        () => dillContract.totalSupply(),
        () => feeDistContract.time_cursor(),
        () => feeDistContractV2.time_cursor(),
        () => pickleContract.totalSupply(),
      ],
      chain,
    );

    const batch2Promise = Promise.all([
      model.callMulti(
        payoutTimes.map((time) => () => feeDistContract.tokens_per_week(time)),
        chain,
      ),
      model.callMulti(
        payoutTimes.map((time) => () => feeDistContract.ve_supply(time)),
        chain,
      ),
    ]);

    const batch3Promise = Promise.all([
      model.callMulti(
        payoutTimesV2.map(
          (time) => () => feeDistContractV2.tokens_per_week(time),
        ),
        chain,
      ),
      model.callMulti(
        payoutTimesV2.map((time) => () => feeDistContractV2.eth_per_week(time)),
        chain,
      ),
      model.callMulti(
        payoutTimesV2.map((time) => () => feeDistContractV2.ve_supply(time)),
        chain,
      ),
    ]);

    const [payoutsBN, dillAmountsBN]: [BigNumber[], BigNumber[]] =
      await batch2Promise;
    const [payoutsBNV2, payoutsEthBNV2, dillAmountsBNV2]: [
      BigNumber[],
      BigNumber[],
      BigNumber[],
    ] = await batch3Promise;
    const [
      picklesLocked,
      dillSupply,
      endTime,
      endTimeV2,
      pickleSupply,
    ]: BigNumber[] = await batch1Promise;

    const pickleSupplyFloat = parseFloat(
      ethers.utils.formatEther(pickleSupply),
    );
    const picklesLockedFloat = parseFloat(
      ethers.utils.formatEther(picklesLocked),
    );
    const dillSupplyFloat = parseFloat(ethers.utils.formatEther(dillSupply));

    const payouts: number[] = payoutsBN.map((x: BigNumber) =>
      parseFloat(ethers.utils.formatEther(x)),
    );
    const dillAmounts: number[] = dillAmountsBN.map((x: BigNumber) =>
      parseFloat(ethers.utils.formatEther(x)),
    );
    const payoutsV2: number[] = payoutsBNV2.map((x: BigNumber) =>
      parseFloat(ethers.utils.formatEther(x)),
    );
    const payoutsEthV2: number[] = payoutsEthBNV2.map((x: BigNumber) =>
      parseFloat(ethers.utils.formatEther(x)),
    );
    const dillAmountsV2: number[] = dillAmountsBNV2.map((x: BigNumber) =>
      parseFloat(ethers.utils.formatEther(x)),
    );

    let totalPickleAmount = 0;
    let lastTotalDillAmount = 0;
    let totalEthAmount = 0;
    const picklePriceSeries = await picklePriceSeriesPromise;

    const mapResult: DillWeek[] = payoutTimes.map((time, index): DillWeek => {
      // Fees get distributed at the beginning of the following period.
      const distributionTime = new Date((time.toNumber() + week) * 1000);
      const isProjected = distributionTime > new Date();

      let weeklyPickleAmount = isProjected
        ? thisWeekProjectedDistribution / picklePrice
        : payouts[index];

      const historicalEntry = picklePriceSeries.find((value) =>
        moment(value[0]).isSame(distributionTime, "day"),
      );
      const picklePriceUsd = historicalEntry ? historicalEntry[1] : picklePrice;

      let totalDillAmount: number = dillAmounts[index];
      let pickleDillRatio = weeklyPickleAmount / totalDillAmount;

      let weeklyDillAmount = totalDillAmount - lastTotalDillAmount;

      let weeklyEthAmount = 0;

      if (payoutV2idx >= 0 && index >= payoutV2idx) {
        // After the release date of V2, add params of both V1 and V2
        weeklyPickleAmount += isProjected
          ? 0 // Subject to change
          : payoutsV2[index - payoutV2idx];
        weeklyEthAmount = isProjected
          ? 0 // Subject to change
          : payoutsEthV2[index - payoutV2idx];

        totalDillAmount += dillAmountsV2[index - payoutV2idx];
      }

      pickleDillRatio = weeklyPickleAmount / totalDillAmount;
      totalPickleAmount += weeklyPickleAmount;
      totalEthAmount += weeklyEthAmount;
      weeklyDillAmount = totalDillAmount - lastTotalDillAmount;
      lastTotalDillAmount = totalDillAmount;

      const buybackUsd =
        Math.floor(100 * pickleDillRatio * totalDillAmount * picklePriceUsd) /
        100;

      return {
        weeklyPickleAmount,
        totalPickleAmount,
        weeklyEthAmount,
        totalEthAmount,
        weeklyDillAmount,
        totalDillAmount,
        pickleDillRatio,
        picklePriceUsd,
        buybackUsd,
        isProjected,
        distributionTime,
      };
    });

    DEBUG_OUT("End getDillDetails: " + (Date.now() - start));
    return {
      pickleLocked: picklesLockedFloat,
      totalDill: dillSupplyFloat,
      dillWeeks: mapResult,
      totalPickle: pickleSupplyFloat,
    };
  } catch (e) {
    console.log(e);
    DEBUG_OUT("End getDillDetails" + (Date.now() - start));
    return undefined;
  }
}
