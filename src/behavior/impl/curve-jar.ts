import { ethers, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { AssetAprComponent, HistoricalYield, JarDefinition } from "../../model/PickleModelJson";
import curveGaugeAbi from "../../Contracts/ABIs/curve-gauge.json";
import poolAbi from "../../Contracts/ABIs/pool.json";
import { Contract as MulticallContract } from "ethers-multicall";
import { ChainNetwork, Chains } from "../../chain/Chains";
import {
  GaugeController,
  GaugeController__factory,
} from "../../Contracts/ContractsImpl";
import { PickleModel } from "../../model/PickleModel";
import fetch from "cross-fetch";
import { getCurvePerformance } from "../../protocols/CurveUtil";

export const GAUGE_CONTROLLER_ADDR =
  "0x2F50D538606Fa9EDD2B11E2446BEb18C9D5846bB";

export interface CurveChainMetadata {
  cacheKey: string;
  url: string;
}
const curveMetadataForChains: Map<ChainNetwork, CurveChainMetadata> = new Map();
curveMetadataForChains.set(ChainNetwork.Ethereum, {
  cacheKey: "curveJar.apr.rawstats.eth.key",
  url: "https://stats.curve.fi/raw-stats/apys.json",
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
): Promise<RawStatAPYs | RawStatArbAPYs> {
  const metadata = curveMetadataForChains.get(network);
  if (!metadata) return undefined;

  const fromCache: any = model.resourceCache.get(metadata.cacheKey);
  if (fromCache === undefined) {
    const stats: RawStatAPYs = await loadCurveRawStats(metadata.url);
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
  async getProtocolApy(definition:JarDefinition, model:PickleModel) : Promise<HistoricalYield> {
    return await getCurvePerformance(definition, model);
  }

  async getCurveCrvAPY(
    jar: JarDefinition,
    model: PickleModel,
    underlyingPrice: number,
    gauge: string,
    pool: string,
  ): Promise<AssetAprComponent> {
    const multicallProvider = model.multicallProviderFor(jar.chain);
    await multicallProvider.init();
    const mcGauge = new MulticallContract(gauge, curveGaugeAbi);
    const mcPool = new MulticallContract(pool, poolAbi);

    const [workingSupply, gaugeRate, virtualPrice] = (
      await multicallProvider.all([
        mcGauge.working_supply(),
        mcGauge.inflation_rate(),
        mcPool.get_virtual_price(),
      ])
    ).map((x) => parseFloat(ethers.utils.formatUnits(x)));

    const ctrlr: GaugeController = GaugeController__factory.connect(
      GAUGE_CONTROLLER_ADDR,
      Chains.getResolver(jar.chain),
    );
    const weight = await ctrlr["gauge_relative_weight(address)"](gauge).then(
      (x) => parseFloat(ethers.utils.formatUnits(x)),
    );

    // https://github.com/curvefi/curve-dao/blob/b7d6d2b6633fd64aa44e80094f6fb5f17f5e771a/src/components/minter/gaugeStore.js#L212
    const rate =
      (((gaugeRate * weight * 31536000) / workingSupply) * 0.4) /
      (virtualPrice * underlyingPrice);

    const crvApy = rate * (await model.priceOf("crv")) * 100;
    return { name: "CRV", apr: crvApy, compoundable: true };
  }

  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
    resolver: Signer | Provider,
  ): Promise<number> {
    const gauge = new ethers.Contract(
      this.gaugeAddress,
      curveGaugeAbi,
      resolver,
    );
    const [crv, crvPrice] = await Promise.all([
      gauge.callStatic.claimable_tokens(jar.details.strategyAddr),
      await model.priceOf("curve-dao-token"),
    ]);
    const harvestable = crv.mul(crvPrice.toFixed());
    return parseFloat(ethers.utils.formatEther(harvestable));
  }
}
