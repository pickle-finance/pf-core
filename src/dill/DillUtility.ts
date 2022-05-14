import {
  AssetEnablement,
  DillDetails,
  DillWeek,
  JarDefinition,
} from "../model/PickleModelJson";
import { BigNumber, ethers } from "ethers";
import { Contract as MultiContract } from "ethers-multicall";
import dillAbi from "../Contracts/ABIs/dill.json";
import feeDistributorAbi from "../Contracts/ABIs/feeDistributorVer2.json";
import Erc20Abi from "../Contracts/ABIs/erc20.json";
import { fetchHistoricalPriceSeries } from "../price/CoinGeckoPriceResolver";
import moment from "moment";
import { ChainNetwork, Chains, PickleModel } from "..";
import { DEBUG_OUT } from "../model/PickleModel";
// import { Erc20, Erc20__factory } from "../Contracts/ContractsImpl";

const week = 7 * 24 * 60 * 60;
const firstMeaningfulDistributionTimestamp = 1619049600;

export const DILL_CONTRACT = "0xbBCf169eE191A1Ba7371F30A1C344bFC498b29Cf";
const FEE_DISTRIBUTOR = "0x2c6C87E7E6195ab7A4f19d3CF31D867580Bb2a1b";
const pickleAddress = "0x429881672B9AE42b8EbA0E26cD9C73711b891Ca5";
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
    const pickleContract = new MultiContract(pickleAddress, Erc20Abi);
   
    // const pickleContract: Erc20 = Erc20__factory.connect(
    //   ADDRESSES.get(ChainNetwork.Ethereum).pickle,
    //   providerFor(ChainNetwork.Ethereum),
    // );
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

    const batch1Promise = model.callMulti(
      [
        () => dillContract.supply(),
        () => dillContract.totalSupply(),
        () => feeDistContract.time_cursor(),
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
    const [payoutsBN, dillAmountsBN]: [BigNumber[], BigNumber[]] =
      await batch2Promise;
    const [picklesLocked, dillSupply, endTime, pickleSupply]: BigNumber[] =
      await batch1Promise;

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

    let totalPickleAmount = 0;
    let lastTotalDillAmount = 0;
    const picklePriceSeries = await picklePriceSeriesPromise;
    const mapResult: DillWeek[] = payoutTimes.map((time, index): DillWeek => {
      // Fees get distributed at the beginning of the following period.
      const distributionTime = new Date((time.toNumber() + week) * 1000);
      const isProjected = distributionTime > new Date();
      const weeklyPickleAmount = isProjected
        ? thisWeekProjectedDistribution / picklePrice
        : payouts[index];

      const historicalEntry = picklePriceSeries.find((value) =>
        moment(value[0]).isSame(distributionTime, "day"),
      );
      const picklePriceUsd = historicalEntry ? historicalEntry[1] : picklePrice;

      const totalDillAmount: number = dillAmounts[index];
      const pickleDillRatio = weeklyPickleAmount / totalDillAmount;

      totalPickleAmount += weeklyPickleAmount;

      const weeklyDillAmount = totalDillAmount - lastTotalDillAmount;
      lastTotalDillAmount = totalDillAmount;

      const buybackUsd =
        Math.floor(100 * pickleDillRatio * totalDillAmount * picklePriceUsd) /
        100;
      return {
        weeklyPickleAmount,
        totalPickleAmount,
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
      totalPickle: String(pickleSupply),
    };
  } catch (e) {
    console.log(e);
    DEBUG_OUT("End getDillDetails" + (Date.now() - start));
    return undefined;
  }
}
