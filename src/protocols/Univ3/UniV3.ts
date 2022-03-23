import { /* Contract, */ ethers, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import { ChainNetwork, Chains, PickleModel } from "../..";
import { ONE_YEAR_IN_SECONDS } from "../../behavior/AbstractJarBehavior";
import { AssetProtocol, JarDefinition } from "../../model/PickleModelJson";
import v3PoolABI from "../../Contracts/ABIs/univ3Pool.json";
import univ3prices from "@thanpolas/univ3prices";
import { Token } from "@uniswap/sdk-core";
import { Pool, Position } from "@uniswap/v3-sdk";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import fetch from "node-fetch";
import { readQueryFromGraphDetails } from "../../graph/TheGraph";
import { Contract as MultiContract } from "ethers-multicall";
import jarV3Abi from "../../Contracts/ABIs/jar-v3.json";

export const UniV3GraphCacheKey =
  "uniswap.mainnet.v3.graph.pair.data.cache.key";

const UNISWAP_GRAPH_POLYGON =
  "https://api.thegraph.com/subgraphs/name/laktek/uniswap-v3-polygon";

export interface UniV3PoolData {
  token: number;
  symbol: string;
  weth: number;
  tvl: number;
  tick: number;
  spacing: number;
  liquidity: string;
}
export interface AprNamePair {
  id: string;
  apr: number;
}
export interface IncentiveKey {
  rewardToken: string;
  pool: string;
  startTime: number;
  endTime: number;
  refundee: string;
}
export interface UniV3InfoValue {
  incentiveKey: IncentiveKey;
  emissions: number;
  rewardName: string;
  nftNumber: number;
}
export interface UniV3GraphPairData {
  id: number;
  depositedToken0: number;
  depositedToken1: number;
}
// UniV3 Incentives
const uniV3Info: any = {
  // RBN-ETH
  "0x94981F69F7483AF3ae218CbfE65233cC3c60d93a": {
    incentiveKey: {
      rewardToken: "0x6123B0049F904d730dB3C36a31167D9d4121fA6B",
      pool: "0x94981F69F7483AF3ae218CbfE65233cC3c60d93a",
      startTime: 1633694400,
      endTime: 1638878400,
      refundee: "0xDAEada3d210D2f45874724BeEa03C7d4BBD41674",
    },
    emissions: 10000000,
    rewardName: "rbn",
    nftNumber: 144390,
  },
};

export function getUniV3Info(key: string): UniV3InfoValue {
  return uniV3Info[key] as UniV3InfoValue;
}

// Fetches TVL of a XXX/ETH pool and returns prices
export const getPoolData = async (
  pool: string,
  token: string,
  model: PickleModel,
  chain: ChainNetwork,
): Promise<UniV3PoolData> => {
  const weth = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
  const promises = [];
  promises.push(getWETHPrice(model));

  const poolContract = new MultiContract(pool, v3PoolABI);
  const wethContract = new MultiContract(weth, erc20Abi);
  const tokenContract = new MultiContract(token, erc20Abi);
  promises.push(
    model.callMulti(
      [
        () => poolContract.token0(),
        () => poolContract.slot0(),
        () => poolContract.tickSpacing(),
        () => poolContract.liquidity(),
        () => wethContract.balanceOf(pool),
        () => tokenContract.symbol(),
        () => tokenContract.balanceOf(pool),
      ],
      chain,
    ),
  );
  const [
    wethPrice,
    [token0, data, spacing, liquidity, wethBalanceBN, symbol, tokenBalanceBN],
  ] = await Promise.all(promises);

  const ratio = univ3prices([18, 18], data.sqrtPriceX96).toAuto();
  const tokenPrice = token0 === weth ? wethPrice * ratio : wethPrice / ratio;
  const wethBalance = ethers.utils.formatUnits(wethBalanceBN, 18);
  const tokenBalance = ethers.utils.formatUnits(tokenBalanceBN, 18);
  const tvl: number =
    parseFloat(tokenBalance) * tokenPrice + wethPrice * parseFloat(wethBalance);

  return {
    token: tokenPrice,
    symbol: symbol,
    weth: wethPrice,
    tvl: tvl,
    tick: data.tick,
    spacing: spacing,
    liquidity: liquidity.toString(),
  };
};

export const getWETHPrice = async (model: PickleModel) => {
  const weth_usdc = "0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640";
  const poolContract = new MultiContract(weth_usdc, v3PoolABI);
  const data = await model.callMulti(
    () => poolContract.slot0(),
    ChainNetwork.Ethereum,
  );
  const ratio = univ3prices([6, 18], data.sqrtPriceX96).toAuto(); // [] token decimals
  return ratio;
};

export const calculateUniV3Apy = async (
  poolTokenAddress: string,
  chain: ChainNetwork,
  model: PickleModel,
): Promise<AprNamePair> => {
  // const provider: Provider | Signer = Chains.get(chain).getProviderOrSigner();

  const { incentiveKey, emissions, rewardName } =
    getUniV3Info(poolTokenAddress);
  const data = await getPoolData(
    incentiveKey.pool,
    incentiveKey.rewardToken,
    model,
    chain,
  );
  const emissionsPerSecond =
    emissions / (incentiveKey.endTime - incentiveKey.startTime);
  const apr =
    (emissionsPerSecond * data.token * ONE_YEAR_IN_SECONDS) / data.tvl;
  return { id: rewardName, apr: apr * 100 };
};

export async function getUniV3TokenPairData(
  model: PickleModel,
  jar: JarDefinition,
): Promise<UniV3GraphPairData> {
  let allGraphData = undefined;
  if (model.getResourceCache().get(UniV3GraphCacheKey))
    allGraphData = model.getResourceCache().get(UniV3GraphCacheKey);
  else {
    const result = await queryUniV3TokensFromGraph();
    model.getResourceCache().set(UniV3GraphCacheKey, result);
    allGraphData = result;
  }
  // TODO complete
  const depositToken = jar.depositToken.addr;
  if (uniV3Info[depositToken]) {
    const nftNumber = (uniV3Info[depositToken] as UniV3InfoValue).nftNumber;
    const info = allGraphData.find((x) => x.id === "" + nftNumber);
    if (info) {
      return {
        id: info.id,
        depositedToken0: info.depositedToken0,
        depositedToken1: info.depositedToken1,
      };
    }
  }
  return undefined;
}

export const getUniV3 = async (
  jar: JarDefinition,
  model: PickleModel,
  // provider: Provider | Signer,
) => {
  const jarV3Abi = [
    {
      inputs: [],
      name: "pool",
      outputs: [
        {
          internalType: "contract IUniswapV3Pool",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalLiquidity",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "token0",
      outputs: [{ internalType: "contract IERC20", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "token1",
      outputs: [{ internalType: "contract IERC20", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getLowerTick",
      outputs: [{ internalType: "int24", name: "", type: "int24" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getUpperTick",
      outputs: [{ internalType: "int24", name: "", type: "int24" }],
      stateMutability: "view",
      type: "function",
    },
  ];

  const jarV3 = new MultiContract(jar.contract, jarV3Abi);
  const poolAddress = await model.callMulti(() => jarV3.pool(), jar.chain);
  const poolContract = new MultiContract(poolAddress, v3PoolABI);

  const [
    data,
    fee,
    totalLiquidity,
    jarLiquidity,
    token0,
    token1,
    tickLower,
    tickUpper,
  ] = await model.callMulti(
    [
      () => poolContract.slot0(),
      () => poolContract.fee(),
      () => poolContract.liquidity(),
      () => jarV3.totalLiquidity(),
      () => jarV3.token0(),
      () => jarV3.token1(),
      () => jarV3.getLowerTick(),
      () => jarV3.getUpperTick(),
    ],
    jar.chain,
  );

  const token0Contract = new MultiContract(token0, erc20Abi);
  const token1Contract = new MultiContract(token1, erc20Abi);

  const [token0Decimals, token1Decimals] = await model.callMulti(
    [() => token0Contract.decimals(), () => token1Contract.decimals()],
    jar.chain,
  );

  const tokenA = new Token(1, token0, token0Decimals);
  const tokenB = new Token(1, token1, token1Decimals);
  const pool = new Pool(
    tokenA,
    tokenB,
    fee,
    data.sqrtPriceX96,
    totalLiquidity,
    data.tick,
  );
  const position = new Position({
    pool,
    liquidity: jarLiquidity,
    tickLower,
    tickUpper,
  });
  return { position, tokenA, tokenB, pool };
};

export async function queryUniswapTicks(
  poolAddress: string,
  chain: ChainNetwork,
) {
  const query = `{
    ticks(first: 1000, skip: 0, where: { poolAddress: "${poolAddress}" }, orderBy: tickIdx) {
      tickIdx
      liquidityNet
      price0
      price1
    }
  }`;
  const res = await readQueryFromGraphDetails(
    query,
    AssetProtocol.UNISWAP_V3,
    chain,
  );
  return res?.data?.ticks;
}

export async function queryVolume24H(poolAddress: string, chain: ChainNetwork) {
  const query = `{
    poolDayDatas(skip: 1, first:3, orderBy: date, orderDirection: desc, where:{pool: "${poolAddress}"}) {
      volumeUSD
    }
  }`;
  const res = await readQueryFromGraphDetails(
    query,
    AssetProtocol.UNISWAP_V3,
    chain,
  );
  return res?.data?.poolDayDatas[0]?.volumeUSD;
}

export async function queryUniV3TokensFromGraph() {
  const listOfInfos = Object.values(uniV3Info);
  const toFind = listOfInfos.map((x) => (x as UniV3InfoValue).nftNumber);
  const toFindAsString = toFind.flat().join('\\", \\"');
  const fetchParams = {
    credentials: "omit",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:81.0) Gecko/20100101 Firefox/81.0",
      Accept: "*/*",
      "Accept-Language": "en-US,en;q=0.5",
      "Content-Type": "application/json",
    },
    referrer: "https://thegraph.com/hosted-service/subgraph/uniswap/uniswap-v3",
    body: `{"query":"{\\n  positions(first: ${toFind.length.toString()}, orderDirection: desc, where: {id_in: [\\"${toFindAsString}\\"]}) {\\n    id\\n    depositedToken0\\n    depositedToken1\\n pool{id}\\n}\\n}\\n","variables":null}`,
    method: "POST",
    mode: "cors",
  };
  const res = await fetch(
    "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3",
    fetchParams as RequestInit,
  ).then((x) => x.json());
  return res && res.data && res.data.positions ? res.data.positions : undefined;
}
