import { ethers } from "ethers";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import {
  AssetAprComponent,
  HistoricalYield,
  JarDefinition,
} from "../../model/PickleModelJson";
import curveGaugeAbi from "../../Contracts/ABIs/curve-gauge.json";
import poolAbi from "../../Contracts/ABIs/pool.json";
import controllerAbi from "../../Contracts/ABIs/gauge-controller.json";
import { Contract } from "ethers-multiprovider";
import { ChainNetwork } from "../../chain/Chains";
import { PickleModel } from "../../model/PickleModel";
import fetch from "cross-fetch";
import { getCurvePerformance } from "../../protocols/CurveUtil";

export const GAUGE_CONTROLLER_ADDR =
  "0x2F50D538606Fa9EDD2B11E2446BEb18C9D5846bB";

export interface CurveChainMetadata {
  cacheKey: string;
  url: string;
}
const curveMetadataForChains: Map<ChainNetwork | string, CurveChainMetadata> =
  new Map();
curveMetadataForChains.set(ChainNetwork.Ethereum, {
  cacheKey: "curveJar.apr.rawstats.eth.key",
  url: "https://stats.curve.fi/raw-stats/apys.json",
});
curveMetadataForChains.set(`${ChainNetwork.Ethereum}factory`, {
  cacheKey: "curveJar.apr.rawstats.ethfactory.key",
  url: "https://api.curve.fi/api/getFactoryAPYs?version=crypto",
});
curveMetadataForChains.set(ChainNetwork.Polygon, {
  cacheKey: "curveJar.apr.rawstats.poly.key",
  url: "https://stats.curve.fi/raw-stats-polygon/apys.json",
});
curveMetadataForChains.set(ChainNetwork.Arbitrum, {
  cacheKey: "curveJar.apr.rawstats.arbitrum.key",
  url: "https://stats.curve.fi/raw-stats-arbitrum/apys.json",
});
// ADD_CHAIN_PROTOCOL

export interface RawStatAPYs {
  compound: number;
  usdt: number;
  y: number;
  busd: number;
  susd: number;
  pax: number;
  ren2: number;
  rens: number;
  hbtc: number;
  ["3pool"]: number;
  gusd: number;
  husd: number;
  usdn: number;
  usdk: number;
  steth: number;
  aave: number;
}

export interface RawStatArbAPYs {
  ["2pool"]: number;
  tricrypto: number;
  ren: number;
}

export async function getCurveRawStats(
  model: PickleModel,
  network: ChainNetwork,
  factory?: boolean,
): Promise<RawStatAPYs | RawStatArbAPYs | any> {
  const metadata = curveMetadataForChains.get(
    network + (factory ? "factory" : ""),
  );
  if (!metadata) return undefined;

  const fromCache: any = model.resourceCache.get(metadata.cacheKey);
  if (fromCache === undefined && !factory) {
    const stats: RawStatAPYs = await loadCurveRawStats(metadata.url);
    model.resourceCache.set(metadata.cacheKey, stats);
    return stats;
  }

  if (fromCache === undefined && factory) {
    const res = await fetch(metadata.url).then((x) => x.json());
    const pools = res.data.poolDetails;
    const stats = {};
    pools.map((pool) => {
      stats[pool.poolAddress] = pool.apyWeekly;
    });
    model.resourceCache.set(metadata.cacheKey, stats);
    return stats;
  }

  return fromCache;
}

export async function loadCurveRawStats(url: string): Promise<RawStatAPYs> {
  const res = await fetch(url).then((x) => x.json());
  const stats = res.apy.day;
  for (const k of Object.keys(stats)) {
    stats[k] = stats[k] * 100;
  }
  return stats;
}

export abstract class CurveJar extends AbstractJarBehavior {
  readonly gaugeAddress: string;

  constructor(gaugeAddress: string) {
    super();
    this.gaugeAddress = gaugeAddress;
  }
  async getProtocolApy(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<HistoricalYield> {
    return await getCurvePerformance(definition, model);
  }

  async getCurveCrvAPY(
    jar: JarDefinition,
    model: PickleModel,
    underlyingPrice: number,
    gauge: string,
    pool: string,
  ): Promise<AssetAprComponent> {
    const multiProvider = model.multiproviderFor(jar.chain);
    const mcGauge = new Contract(gauge, curveGaugeAbi);
    const mcPool = new Contract(pool, poolAbi);

    const [workingSupply, gaugeRate, virtualPrice] = (
      await multiProvider.all([
        mcGauge.working_supply(),
        mcGauge.inflation_rate(),
        mcPool.get_virtual_price(),
      ])
    ).map((x) => parseFloat(ethers.utils.formatUnits(x)));

    const ctrlr = new Contract(GAUGE_CONTROLLER_ADDR, controllerAbi);
    const weight = await multiProvider
      .all([ctrlr.gauge_relative_weight(gauge)])
      .then((x) => parseFloat(ethers.utils.formatUnits(x[0])));

    // https://github.com/curvefi/curve-dao/blob/b7d6d2b6633fd64aa44e80094f6fb5f17f5e771a/src/components/minter/gaugeStore.js#L212
    const rate =
      (((gaugeRate * weight * 31536000) / workingSupply) * 0.4) /
      (virtualPrice * underlyingPrice);

    const crvApy = rate * model.priceOfSync("crv", jar.chain) * 100;
    return { name: "CRV", apr: crvApy, compoundable: true };
  }

  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    const curveGaugeAbi = [
      {
        name: "claimable_tokens",
        outputs: [{ type: "uint256", name: "" }],
        inputs: [{ type: "address", name: "addr" }],
        stateMutability: "view",
        type: "function",
      },
    ];
    const multiProvider = model.multiproviderFor(jar.chain);
    const gauge = new Contract(this.gaugeAddress, curveGaugeAbi);
    const [crv] = await multiProvider.all([
      gauge.claimable_tokens(jar.details.strategyAddr),
    ]);
    const crvPrice = model.priceOfSync("curve-dao-token", jar.chain);
    const harvestable = crv.mul(crvPrice.toFixed());
    return parseFloat(ethers.utils.formatEther(harvestable));
  }
}
