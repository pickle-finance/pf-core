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

// ADD_CHAIN_PICKLE
export const chainToPickleSubgraphUrl: Map<string, string> = new Map([
  [ChainNetwork.Ethereum, SUBGRAPH_URL_PICKLE_MAINNET],
  [ChainNetwork.Polygon, SUBGRAPH_URL_PICKLE_POLYGON],
  [ChainNetwork.Arbitrum, SUBGRAPH_URL_PICKLE_ARBITRUM],
  // TODO - add Pickle subgraph on Harmony
]);

// ADD_PROTOCOL
export const protocolToSubgraphUrl: Map<string, string> = new Map([
  [AssetProtocol.UNISWAP, SUBGRAPH_URL_UNISWAP],
  [AssetProtocol.SUSHISWAP, SUBGRAPH_URL_SUSHISWAP],
  [AssetProtocol.SUSHISWAP_POLYGON, SUBGRAPH_URL_SUSHISWAP_POLYGON],
  [AssetProtocol.SUSHISWAP_ARBITRUM, SUBGRAPH_URL_SUSHISWAP_ARBITRUM],
  [AssetProtocol.SUSHISWAP_HARMONY, SUBGRAPH_URL_SUSHISWAP_HARMONY],
  [AssetProtocol.COMETHSWAP, SUBGRAPH_URL_COMETH],
  [AssetProtocol.QUICKSWAP_POLYGON, SUBGRAPH_URL_QUICKSWAP], //TODO is this right?
  [AssetProtocol.SOLARSWAP, SUBGRAPH_URL_SOLARSWAP],
]);

export async function readQueryFromPickleSubgraph(
  query: string,
  chain: ChainNetwork,
): Promise<any> {
  return await readQueryFromGraph(query, chainToPickleSubgraphUrl.get(chain));
}

export async function readQueryFromGraphProtocol(
  query: string,
  protocol: string,
): Promise<any> {
  return await readQueryFromGraph(query, protocolToSubgraphUrl.get(protocol));
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
