import fetch from 'node-fetch';

// TODO: Larry re-did the graph stuff to be more decentralized. 
// Might be some work

// TODO move these out i guess?
export const PROTOCOL_TYPE_UNISWAP = "uniswap";
export const PROTOCOL_TYPE_SUSHISWAP = "sushiswap";
export const PROTOCOL_TYPE_SUSHISWAP_POLYGON = "sushiswap_polygon";
export const PROTOCOL_TYPE_COMETHSWAP = "comethswap";
export const PROTOCOL_TYPE_QUICKSWAP_POLYGON = "quickswap_polygon";

/*
const SUBGRAPH_URL_PICKLE: string = "https://api.thegraph.com/subgraphs/name/pickle-finance/pickle"
const SUBGRAPH_URL_PICKLE_POLYGON: string = "https://api.thegraph.com/subgraphs/name/pickle-finance/pickle-polygon"
*/

const SUBGRAPH_URL_UNISWAP = "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2"
const SUBGRAPH_URL_SUSHISWAP = "https://api.thegraph.com/subgraphs/name/croco-finance/sushiswap"
const SUBGRAPH_URL_SUSHISWAP_POLYGON = "https://api.thegraph.com/subgraphs/name/sushiswap/matic-exchange"
const SUBGRAPH_URL_COMETH = "https://api.thegraph.com/subgraphs/name/cometh-game/comethswap"
const SUBGRAPH_URL_QUICKSWAP = "https://api.thegraph.com/subgraphs/name/sameepsi/quickswap"


export const protocolToSubgraphUrl : Map<string,string> = new Map([
    [PROTOCOL_TYPE_UNISWAP,SUBGRAPH_URL_UNISWAP],
    [PROTOCOL_TYPE_SUSHISWAP,SUBGRAPH_URL_SUSHISWAP],
    [PROTOCOL_TYPE_SUSHISWAP_POLYGON,SUBGRAPH_URL_SUSHISWAP_POLYGON],
    [PROTOCOL_TYPE_COMETHSWAP,SUBGRAPH_URL_COMETH],
    [PROTOCOL_TYPE_QUICKSWAP_POLYGON,SUBGRAPH_URL_QUICKSWAP], //TODO is this right?
]);

export async function readQueryFromGraph(query:string, url: string) : Promise<any> {
    const tst =  await fetch(url, {
        method: "POST",
        body: JSON.stringify({ query })
      });
    const ret = tst.json();
    return ret;
}