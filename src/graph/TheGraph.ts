import fetch from "cross-fetch";
import { ChainNetwork } from "..";
import { AssetProtocol } from "../model/PickleModelJson";

// ADD_CHAIN_PROTOCOL
const SUBGRAPH_URL_PICKLE_MAINNET =
  "https://api.thegraph.com/subgraphs/name/pickle-finance/pickle";
const SUBGRAPH_URL_PICKLE_POLYGON =
  "https://api.thegraph.com/subgraphs/name/pickle-finance/pickle-polygon";
const SUBGRAPH_URL_PICKLE_ARBITRUM =
  "https://api.thegraph.com/subgraphs/name/pickle-finance/pickle-arbitrum";

// TODO - add Pickle subgraph on Harmony

//ADD_PROTOCOL
const SUBGRAPH_URL_UNISWAP =
  "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2";
const SUBGRAPH_URL_UNISWAP_V3_POLYGON =
  "https://api.thegraph.com/subgraphs/name/kalinbas/uniswap-v3-polygon";
const SUBGRAPH_URL_SUSHISWAP =
  "https://api.thegraph.com/subgraphs/name/croco-finance/sushiswap";
const SUBGRAPH_URL_SUSHISWAP_POLYGON =
  "https://api.thegraph.com/subgraphs/name/sushiswap/matic-exchange";
const SUBGRAPH_URL_SUSHISWAP_ARBITRUM =
  "https://api.thegraph.com/subgraphs/name/sushiswap/arbitrum-exchange";
const SUBGRAPH_URL_SUSHISWAP_HARMONY =
  "https://sushi.graph.t.hmny.io/subgraphs/name/sushiswap/harmony-exchange";
const SUBGRAPH_URL_COMETH =
  "https://api.thegraph.com/subgraphs/name/cometh-game/comethswap";
const SUBGRAPH_URL_QUICKSWAP =
  "https://api.thegraph.com/subgraphs/name/sameepsi/quickswap06";
const SUBGRAPH_URL_SOLARSWAP = "https://analytics.solarbeam.io/api/subgraph";
const SUBGRAPH_URL_BALANCER =
  "https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-v2";
const SUBGRAPH_URL_BALANCER_ARBITRUM =
  "https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-arbitrum-v2";
const SUBGRAPH_URL_VVS_CRONOS = "https://graph.vvs.finance/exchange";
const SUBGRAPH_URL_TETHYS = "https://node.tethys.finance/subgraphs/name/tethys";
const SUBGRAPH_URL_LOOKS =
  "https://api.thegraph.com/subgraphs/name/looksrare/looks-distribution";
const SUBGRAPH_BEAMSWAP =
  "https://api.thegraph.com/subgraphs/name/beamswap/beamswap-dex";
const SUBGRAPH_SOLARFLARE = "https://analytics.solarflare.io/api/subgraph";
const SUBGRAPH_URL_BEETHOVENX =
  "https://graph-node.beets-ftm-node.com/subgraphs/name/beethovenx";
const SUBGRAPH_URL_SPOOKYSWAP =
  "https://api.thegraph.com/subgraphs/name/eerieeight/spookyswap";
const SUBGRAPH_URL_SPIRITSWAP =
  "https://api.thegraph.com/subgraphs/name/layer3org/spiritswap-analytics";

// ADD_CHAIN_PICKLE
export const chainToPickleSubgraphUrl: Map<string, string> = new Map([
  [ChainNetwork.Ethereum, SUBGRAPH_URL_PICKLE_MAINNET],
  [ChainNetwork.Polygon, SUBGRAPH_URL_PICKLE_POLYGON],
  [ChainNetwork.Arbitrum, SUBGRAPH_URL_PICKLE_ARBITRUM],
  // TODO - add Pickle subgraph on Harmony
]);

export async function readQueryFromPickleSubgraph(
  query: string,
  chain: ChainNetwork,
): Promise<any> {
  return await readQueryFromGraph(query, chainToPickleSubgraphUrl.get(chain));
}

export async function readQueryFromGraphDetails(
  query: string,
  protocol: AssetProtocol,
  chain: ChainNetwork,
): Promise<any> {
  return await readQueryFromGraph(query, graphUrlFromDetails(protocol, chain));
}

export function graphUrlFromDetails(
  protocol: AssetProtocol,
  chain: ChainNetwork,
): string {
  switch (protocol) {
    case AssetProtocol.UNISWAP:
      return SUBGRAPH_URL_UNISWAP;
    case AssetProtocol.UNISWAP_V3: {
      switch (chain) {
        case ChainNetwork.Polygon:
          return SUBGRAPH_URL_UNISWAP_V3_POLYGON;
      }
      break;
    }
    case AssetProtocol.COMETHSWAP:
      return SUBGRAPH_URL_COMETH;
    case AssetProtocol.QUICKSWAP:
      return SUBGRAPH_URL_QUICKSWAP;
    case AssetProtocol.SOLARSWAP:
      return SUBGRAPH_URL_SOLARSWAP;
    case AssetProtocol.BALANCER: {
      switch (chain) {
        case ChainNetwork.Ethereum:
          return SUBGRAPH_URL_BALANCER;
        case ChainNetwork.Arbitrum:
          return SUBGRAPH_URL_BALANCER_ARBITRUM;
      }
      break;
    }
    case AssetProtocol.VVS:
      return SUBGRAPH_URL_VVS_CRONOS;
    case AssetProtocol.TETHYS:
      return SUBGRAPH_URL_TETHYS;
    case AssetProtocol.LOOKS:
      return SUBGRAPH_URL_LOOKS;
    case AssetProtocol.BEAM:
      return SUBGRAPH_BEAMSWAP;
    case AssetProtocol.FLARE:
      return SUBGRAPH_SOLARFLARE;
    case AssetProtocol.SUSHISWAP: {
      switch (chain) {
        case ChainNetwork.Ethereum:
          return SUBGRAPH_URL_SUSHISWAP;
        case ChainNetwork.Polygon:
          return SUBGRAPH_URL_SUSHISWAP_POLYGON;
        case ChainNetwork.Arbitrum:
          return SUBGRAPH_URL_SUSHISWAP_ARBITRUM;
        case ChainNetwork.Harmony:
          return SUBGRAPH_URL_SUSHISWAP_HARMONY;
      }
      break;
    }
    case AssetProtocol.BEETHOVENX:
      return SUBGRAPH_URL_BEETHOVENX;
    // ADD_PROTOCOL
    case AssetProtocol.SPOOKYSWAP:
      return SUBGRAPH_URL_SPOOKYSWAP;
    case AssetProtocol.SPIRITSWAP:
      return SUBGRAPH_URL_SPIRITSWAP;
      return undefined;
  }
}

export async function readQueryFromGraph(
  query: string,
  url: string,
): Promise<any> {
  if (url === undefined) return undefined;
  const tst = await fetch(url, {
    method: "POST",
    body: JSON.stringify({ query }),
  });
  try {
    return tst.json();
  } catch (error) {
    console.log(error);
    console.log(tst);
  }
}

// Not sure why this is still here :X
module.exports.getMasterChef = async () => {
  const query = `
      {
        masterChef(id: "0xbd17b1ce622d73bd438b9e658aca5996dc394b0d") {
          id
          totalAllocPoint
          rewardsPerBlock
        },
        masterChefPools(where: {allocPoint_gt: 0}, orderBy: allocPoint, orderDirection: desc) {
          id
          token {
            id
          }
          balance
          allocPoint
          lastRewardBlock
          accPicklePerShare
        }
      }
    `;
  return await readQueryFromGraph(query, SUBGRAPH_URL_PICKLE_MAINNET);
};
