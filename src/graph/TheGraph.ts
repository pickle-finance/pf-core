import fetch from 'cross-fetch';
import { PROTOCOL_TYPE_UNISWAP, PROTOCOL_TYPE_SUSHISWAP, PROTOCOL_TYPE_SUSHISWAP_POLYGON, PROTOCOL_TYPE_COMETHSWAP, PROTOCOL_TYPE_QUICKSWAP_POLYGON } from '../model/PickleModelJson';

const SUBGRAPH_URL_PICKLE: string = "https://api.thegraph.com/subgraphs/name/pickle-finance/pickle"
const SUBGRAPH_URL_PICKLE_POLYGON: string = "https://api.thegraph.com/subgraphs/name/pickle-finance/pickle-polygon"

const SUBGRAPH_URL_UNISWAP = "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2"
const SUBGRAPH_URL_SUSHISWAP = "https://api.thegraph.com/subgraphs/name/croco-finance/sushiswap"
const SUBGRAPH_URL_SUSHISWAP_POLYGON = "https://api.thegraph.com/subgraphs/name/sushiswap/matic-exchange"
const SUBGRAPH_URL_COMETH = "https://api.thegraph.com/subgraphs/name/cometh-game/comethswap"
const SUBGRAPH_URL_QUICKSWAP = "https://api.thegraph.com/subgraphs/name/sameepsi/quickswap06"


export const protocolToSubgraphUrl : Map<string,string> = new Map([
    [PROTOCOL_TYPE_UNISWAP,SUBGRAPH_URL_UNISWAP],
    [PROTOCOL_TYPE_SUSHISWAP,SUBGRAPH_URL_SUSHISWAP],
    [PROTOCOL_TYPE_SUSHISWAP_POLYGON,SUBGRAPH_URL_SUSHISWAP_POLYGON],
    [PROTOCOL_TYPE_COMETHSWAP,SUBGRAPH_URL_COMETH],
    [PROTOCOL_TYPE_QUICKSWAP_POLYGON,SUBGRAPH_URL_QUICKSWAP], //TODO is this right?
]);

export async function readQueryFromGraphProtocol(query:string, protocol: string) : Promise<any> {
  return await readQueryFromGraph(query, protocolToSubgraphUrl.get(protocol));
}


export async function readQueryFromGraph(query:string, url: string) : Promise<any> {
    const tst =  await fetch(url, {
        method: "POST",
        body: JSON.stringify({ query })
      });
    return tst.json();
}


export async function getSushiSwapPair(protocol: string, token: string, block?: number): Promise<any> {
    const query = `
        {
        pair(id: "${token.toLowerCase()}"${block ? `, block: {number: ${block}}` : ""
        }) {
            reserve0
            reserve1
            token0 {
            id
            }
            token1 {
            id
            }
            totalSupply
        }
        }
    `;
    return await readQueryFromGraph(query, protocolToSubgraphUrl.get(protocol));
}

export async function getSushiSwapPolyPair(protocol: string, token: string, block?: number): Promise<any> {
    const query = `
    {
        pair(id: "${token}"${block ? `, block: {number: ${block}}` : ""}) {
        reserveUSD
        totalSupply
        }
    }
    `;
    const pairReturn = await readQueryFromGraph(query, protocolToSubgraphUrl.get(protocol));
    return pairReturn;
}

export async function getUniswapPair(protocol: string, token: string, block?: number): Promise<any> {
    const query = `
        {
            pair(id: "${token}"${block ? `, block: {number: ${block}}` : ""}) {
            reserveUSD
            totalSupply
            }
        }
        `;
    const ret = await readQueryFromGraph(query, protocolToSubgraphUrl.get(protocol));
    return ret;
};

export async function getComethPair(protocol: string, token: string, block?: number): Promise<any> {
    const query = `
        {
            pair(id: "${token}"${block ? `, block: {number: ${block}}` : ""}) {
            reserveUSD
            totalSupply
            }
        }
        `;
    return await readQueryFromGraph(query, protocolToSubgraphUrl.get(protocol));
};

export async function getQuickswapPair(protocol: string, token: string, block?: number): Promise<any> {
    const query = `
        {
            pair(id: "${token}"${block ? `, block: {number: ${block}}` : ""}) {
            reserveUSD
            totalSupply
            }
        }
        `;
    return await readQueryFromGraph(query, protocolToSubgraphUrl.get(protocol));
};


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
    return await readQueryFromGraph(query, SUBGRAPH_URL_PICKLE);
  };
  


export async function queryRewardsContract(contract: string, block: number) : Promise<any> {
    let query = `
      {
        rewardContract(id: "${contract}", block: {number: ${block}}) {
          totalRewards
          currentRewards
          stakedTokens
          stakingTokenTotalSupply
        }
      }
    `;
    return await readQueryFromGraph(query, SUBGRAPH_URL_PICKLE);
  };