import { ChainNetwork, IChain } from "..";
import { Chains } from "../chain/Chains";
import {
  ADDRESSES,
  DEBUG_OUT,
  NULL_ADDRESS,
  PickleModel,
} from "../model/PickleModel";
import { Contract as MultiContract } from "ethers-multicall";
import MasterchefAbi from "../Contracts/ABIs/masterchef.json";
import MinichefAbi from "../Contracts/ABIs/minichef.json";
import { ethers } from "ethers";
import gaugeAbi from "../Contracts/ABIs/gauge.json";
import gaugeProxyAbi from "../Contracts/ABIs/gauge-proxy.json";
import { ONE_YEAR_IN_SECONDS } from "../behavior/AbstractJarBehavior";
import {
  AssetAprComponent,
  JarDefinition,
  StandaloneFarmDefinition,
} from "../model/PickleModelJson";

export function minichefAddressForChain(
  network: ChainNetwork,
): string | undefined {
  const c = ADDRESSES.get(network);
  return c ? c.minichef : undefined;
}

export function secondsPerBlock(network: ChainNetwork): number | undefined {
  const chain: IChain = Chains.get(network);
  if (chain) {
    return chain.secondsPerBlock;
  }
  return undefined;
}

export async function setGaugeAprData(
  model: PickleModel,
  chain: ChainNetwork,
  rawGaugeData: IRawGaugeData[],
): Promise<void> {
  const chainStart = Date.now();
  DEBUG_OUT("Begin setGaugeAprData chain " + chain);
  // TODO ADD_CHAIN_STYLE
  if (chain === ChainNetwork.Ethereum) {
    if (rawGaugeData && rawGaugeData.length > 0) {
      for (let i = 0; i < rawGaugeData.length; i++) {
        setAssetGaugeAprEth(rawGaugeData[i], model);
      }
    }
  } else {
    if (rawGaugeData && rawGaugeData.length > 0) {
      for (let i = 0; i < rawGaugeData.length; i++) {
        setAssetGaugeAprMinichef(
          rawGaugeData[i],
          model,
          secondsPerBlock(chain),
        );
      }
    }
  }
  DEBUG_OUT(
    "End setGaugeAprData chain " + chain + ";  " + (Date.now() - chainStart),
  );
}

export interface RawGaugeChainMap {
  [key: string]: IRawGaugeData[];
}
export async function preloadRawGaugeData(
  model: PickleModel,
  chain: ChainNetwork,
  tokens: string[] | undefined,
): Promise<IRawGaugeData[]> {
  const chainStart = Date.now();
  DEBUG_OUT("Begin preloadRawGaugeData chain " + chain);
  // TODO ADD_CHAIN_STYLE
  let rawGaugeData: IRawGaugeData[] = [];
  if (chain === ChainNetwork.Ethereum) {
    try {
      rawGaugeData = await loadGaugeDataEth(tokens, model);
    } catch (error) {
      model.logError("preloadRawGaugeData", chain.toString(), error);
    }
  } else {
    // All other chains use minichef currently
    const minichefAddr: string = minichefAddressForChain(chain);
    if (minichefAddr !== undefined && minichefAddr !== NULL_ADDRESS) {
      try {
        rawGaugeData = await loadGaugeDataForMinichef(
          minichefAddr,
          chain,
          tokens,
          model,
        );
      } catch (error) {
        model.logError("preloadRawGaugeData", chain.toString(), error);
      }
    }
  }
  DEBUG_OUT(
    "End preloadRawGaugeData chain " +
      chain +
      ";  " +
      (Date.now() - chainStart),
  );
  return rawGaugeData;
}

function findJarForGauge(
  gauge: IRawGaugeData,
  model: PickleModel,
): JarDefinition {
  const matchingJars = model
    .getJars()
    .filter(
      (x) =>
        x.farm !== undefined &&
        x.farm.farmAddress !== undefined &&
        x.farm.farmAddress.toLowerCase() === gauge.gaugeAddress.toLowerCase() &&
        gauge.token.toLowerCase() === x.contract.toLowerCase(),
    );
  if (matchingJars.length > 0) {
    if (!matchingJars[0].farm.details) {
      matchingJars[0].farm.details = {};
    }
    return matchingJars[0];
  }
  return undefined;
}

function findStandaloneFarmForGauge(
  gauge: IRawGaugeData,
  model: PickleModel,
): StandaloneFarmDefinition {
  const matchingStandaloneFarms = model
    .getStandaloneFarms()
    .filter(
      (x) =>
        x.contract !== undefined &&
        x.contract.toLowerCase() === gauge.gaugeAddress.toLowerCase(),
    );
  if (matchingStandaloneFarms.length > 0) {
    return matchingStandaloneFarms[0];
  }
  return undefined;
}
function createAprRange(
  jarRatio: number,
  depositTokenPrice: number,
  rewardRatePY: number,
  picklePrice: number,
  dec: number,
): AssetAprComponent {
  const pricePerPToken = jarRatio * depositTokenPrice;
  const dec2 = 18 - dec;
  const fullApr =
    (rewardRatePY * picklePrice) / (pricePerPToken * Math.pow(10, dec2));
  const avgApr = rewardRatePY * picklePrice;

  const component: AssetAprComponent = {
    name: "pickle",
    apr: 0.4 * fullApr,
    maxApr: fullApr,
    compoundable: false,
  };

  return component;
}

export function setAssetGaugeAprEth(gauge: IRawGaugeData, model: PickleModel) {
  // Check if it's a normal jar
  const picklePrice = model.priceOfSync("pickle", ChainNetwork.Ethereum);
  const jar: JarDefinition = findJarForGauge(gauge, model);
  if (jar !== undefined) {
    let rrpy = gauge.rewardRatePerYear;
    if (!Number.isFinite(rrpy)) {
      // rrpy is infinite. Likely zero in the farm. Default to a $1000 pool
      rrpy =
        ((gauge.poolPicklesPerYear || 0) * picklePrice) /
        (1000 / jar.depositToken.price);
    }
    const rewardPerYear: number = gauge.allocPoint === 0 ? 0 : rrpy * 100;
    const c: AssetAprComponent = createAprRange(
      jar.details.ratio,
      jar.depositToken.price,
      rewardPerYear,
      picklePrice,
      jar.details.decimals ? jar.details.decimals : 18,
    );
    if (c && c.apr) {
      jar.farm.details.farmApyComponents = [c];
    }
    jar.farm.details.allocShare = gauge.allocPoint;
    jar.farm.details.picklePerDay = gauge.poolPicklesPerYear / 360;
    jar.farm.details.poolId = gauge.poolId;
    jar.farm.details.picklePerBlock =
      (gauge.poolPicklesPerYear / ONE_YEAR_IN_SECONDS) *
      secondsPerBlock(ChainNetwork.Ethereum);
    if (jar.farm.details.allocShare === 0) {
      jar.farm.details.farmApyComponents = [];
    }
    return;
  }

  // Chek standalone farms
  const saFarm: StandaloneFarmDefinition = findStandaloneFarmForGauge(
    gauge,
    model,
  );
  if (saFarm !== undefined) {
    let rrpy = gauge.rewardRatePerYear;
    if (!Number.isFinite(rrpy)) {
      // rrpy is infinite. Likely zero in the farm. Default to a $500 pool
      rrpy = ((rrpy || 0) * picklePrice) / (500 / jar.depositToken.price);
    }

    const c: AssetAprComponent = createAprRange(
      1,
      saFarm.depositToken.price,
      rrpy * 100,
      picklePrice,
      18,
    );
    if (c && c.apr) {
      saFarm.details.farmApyComponents = [c];
    }
    saFarm.details.allocShare = gauge.allocPoint;
    saFarm.details.poolId = gauge.poolId;
    saFarm.details.picklePerDay = gauge.poolPicklesPerYear / 360;
    saFarm.details.picklePerBlock =
      (gauge.poolPicklesPerYear / ONE_YEAR_IN_SECONDS) *
      secondsPerBlock(ChainNetwork.Ethereum);

    return;
  }
}

export function setAssetGaugeAprMinichef(
  gauge: IRawGaugeData,
  model: PickleModel,
  secPerBlock: number,
) {
  const picklePrice = model.priceOfSync("pickle", ChainNetwork.Ethereum);
  // Check if it's a normal jar
  const jar: JarDefinition = findJarForGauge(gauge, model);
  if (jar !== undefined) {
    let rrpy = gauge.rewardRatePerYear;
    if (!Number.isFinite(rrpy)) {
      // rrpy is infinite. Likely zero in the farm. Default to a $500 pool
      rrpy = ((rrpy || 0) * picklePrice) / (500 / jar.depositToken.price);
    }

    // If there's no money in the farm, use a default value
    const denominator = jar.farm.details.valueBalance || 500;
    const apr = (100 * rrpy * picklePrice) / denominator;
    const c: AssetAprComponent = {
      name: "pickle",
      apr: apr,
      compoundable: false,
    };
    if (c && c.apr) {
      jar.farm.details.farmApyComponents = [c];
    }
    jar.farm.details.allocShare = gauge.allocPoint;
    jar.farm.details.poolId = gauge.poolId;
    jar.farm.details.picklePerDay = gauge.poolPicklesPerYear / 360;
    jar.farm.details.picklePerBlock =
      (gauge.poolPicklesPerYear / ONE_YEAR_IN_SECONDS) * secPerBlock;
    return;
  }

  // Chek standalone farms
  // This is likely wrong but we don't have standalone farms on other chains?
  const saFarm: StandaloneFarmDefinition = findStandaloneFarmForGauge(
    gauge,
    model,
  );
  if (saFarm !== undefined) {
    let rrpy = gauge.rewardRatePerYear;
    if (!Number.isFinite(rrpy)) {
      // rrpy is infinite. Likely zero in the farm. Default to a $500 pool
      rrpy = ((rrpy || 0) * picklePrice) / (500 / saFarm.depositToken.price);
    }

    const c: AssetAprComponent = createAprRange(
      1,
      saFarm.depositToken.price,
      rrpy,
      picklePrice,
      18,
    );
    if (c && c.apr) {
      saFarm.details.farmApyComponents = [c];
    }
    saFarm.details.allocShare = gauge.allocPoint;
    saFarm.details.poolId = gauge.poolId;
    saFarm.details.picklePerDay =
      (gauge.poolPicklesPerYear / ONE_YEAR_IN_SECONDS) * 60 * 60 * 24;
    saFarm.details.picklePerBlock =
      (gauge.poolPicklesPerYear / ONE_YEAR_IN_SECONDS) * secPerBlock;
    return;
  }
}

export async function loadGaugeDataEth(
  tokensToQuery: string[] | undefined,
  model: PickleModel,
): Promise<IRawGaugeData[]> {
  if (tokensToQuery && tokensToQuery.length === 0) {
    return [];
  }
  const ethAddresses = ADDRESSES.get(ChainNetwork.Ethereum);

  const proxy: MultiContract = new MultiContract(
    ethAddresses.gaugeProxy,
    gaugeProxyAbi,
  );
  const masterChef: MultiContract = new MultiContract(
    ethAddresses.masterChef,
    MasterchefAbi,
  );
  const [tokensOnProxy, totalWeight, ppb] = await model.callMulti(
    [
      () => proxy.tokens(),
      () => proxy.totalWeight(),
      () => masterChef.picklePerBlock(),
    ],
    ChainNetwork.Ethereum,
  );

  const mcGaugeProxy = new MultiContract(
    ethAddresses.gaugeProxy,
    gaugeProxyAbi,
  );
  const tokens = tokensToQuery ? tokensToQuery : tokensOnProxy;
  const gaugeAddressesPromises = model.callMulti(
    tokens.map((token) => {
      return () => mcGaugeProxy.getGauge(token);
    }),
    ChainNetwork.Ethereum,
  );
  const gaugeWeightsPromises = model.callMulti(
    tokens.map((token) => {
      return () => mcGaugeProxy.weights(token);
    }),
    ChainNetwork.Ethereum,
  );

  const [gaugeAddresses, gaugeWeights] = await Promise.all([
    gaugeAddressesPromises,
    gaugeWeightsPromises,
  ]);

  const gaugeRewardRatesPromises = model.callMulti(
    tokens.map((_token, index) => {
      return () =>
        new MultiContract(gaugeAddresses[index], gaugeAbi).rewardRate();
    }),
    ChainNetwork.Ethereum,
  );
  const derivedSuppliesPromises = model.callMulti(
    tokens.map((_token, index) => {
      return () =>
        new MultiContract(gaugeAddresses[index], gaugeAbi).derivedSupply();
    }),
    ChainNetwork.Ethereum,
  );

  const [gaugeRewardRates, derivedSupplies] = await Promise.all([
    gaugeRewardRatesPromises,
    derivedSuppliesPromises,
  ]);

  /*
    const totalSupplies = await multicallProvider.all(
      tokens.map((_token, index) => {
        return new MulticallContract(
          gaugeAddresses[index],
          gaugeAbi,
        ).totalSupply();
      }),
    );
*/
  // extract response and convert to something we can use
  const gauges: IRawGaugeData[] = tokens.map((token, idx) => {
    const rrpy = +derivedSupplies[idx].toString()
      ? (+gaugeRewardRates[idx].toString() / +derivedSupplies[idx].toString()) *
        ONE_YEAR_IN_SECONDS
      : Number.POSITIVE_INFINITY;

    const alloc = +gaugeWeights[idx].toString() / +totalWeight.toString() || 0;
    const ret: IRawGaugeData = {
      allocPoint: alloc,
      token: token,
      gaugeAddress: gaugeAddresses[idx],
      rewardRate: +gaugeRewardRates[idx].toString(),
      rewardRatePerYear: rrpy,
      poolPicklesPerYear:
        (alloc *
          parseFloat(ethers.utils.formatEther(ppb)) *
          ONE_YEAR_IN_SECONDS) /
        secondsPerBlock(ChainNetwork.Ethereum),
    };
    return ret;
  });

  return gauges;
}

export async function loadGaugeDataForMinichef(
  minichefAddr: string,
  chain: ChainNetwork,
  tokens: string[] | undefined,
  model: PickleModel,
): Promise<IRawGaugeData[]> {
  // TODO this implementation is not efficient if requesting only a single jar
  if (tokens !== undefined && tokens.length === 0) return [];
  const minichef = new MultiContract(minichefAddr, MinichefAbi);
  const [ppsBN, poolLengthBN] = await Promise.all([
    model
      .callMulti(() => minichef.picklePerSecond(), chain)
      .catch(() => ethers.BigNumber.from(0)),
    model
      .callMulti(() => minichef.poolLength(), chain)
      .catch(() => ethers.BigNumber.from(0)),
  ]);
  const poolLength = parseFloat(poolLengthBN.toString());
  const picklePerSecond = parseFloat(ethers.utils.formatEther(ppsBN));

  // load pool infos
  const miniChefMulticall = new MultiContract(minichefAddr, MinichefAbi);
  const poolIds: number[] = Array.from(Array(poolLength).keys());
  const lpTokens: any[] = await model.callMulti(
    poolIds.map((id) => {
      return () => miniChefMulticall.lpToken(id);
    }),
    chain,
  );
  const poolInfo: any[] = await model.callMulti(
    poolIds.map((id) => {
      return () => miniChefMulticall.poolInfo(id);
    }),
    chain,
  );
  const totalAllocPoints = poolInfo.reduce((acc, curr) => {
    return acc + curr.allocPoint.toNumber();
  }, 0);

  const ret: IRawGaugeData[] = [];
  for (let i = 0; i < poolInfo.length; i++) {
    const poolShareOfPickles =
      poolInfo[i].allocPoint.toNumber() / totalAllocPoints;
    const poolPicklesPerYear =
      poolShareOfPickles * ONE_YEAR_IN_SECONDS * picklePerSecond;
    ret.push({
      allocPoint: poolShareOfPickles,
      token: lpTokens[i],
      gaugeAddress: minichefAddr,
      poolPicklesPerYear: poolPicklesPerYear,
      rewardRatePerYear: poolPicklesPerYear,
      poolId: poolIds[i],
    });
  }

  // Filter out duplicates, keep the active ones
  const filtered: IRawGaugeData[] = [];
  ret.forEach((rawData) => {
    let keepRawData = rawData;
    const duplicates = ret.filter((raw) => raw.token === rawData.token);
    if (duplicates.length > 1) {
      if (filtered.find((f) => f.token === rawData.token)) return;
      keepRawData = duplicates.reduce((acc, cur) => {
        if (acc.allocPoint > cur.allocPoint) return acc;
        return cur;
      });
    }
    filtered.push(keepRawData);
  });
  return filtered;
}

export interface IRawGaugeData {
  allocPoint: number;
  token: string;
  gaugeAddress: string;
  rewardRatePerYear: number;
  poolPicklesPerYear: number;
  rewardRate?: number;
  poolId?: number;
  //derivedSupply: number,
  //totalSupply: number
}
