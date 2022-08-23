import { BigNumber, ethers } from "ethers";
import { Contract } from "ethers-multiprovider";
import balVaultABI from "../Contracts/ABIs/balancer_vault.json";
import erc20 from "../Contracts/ABIs/erc20.json";
import { ChainNetwork, Chains, PickleModel } from "..";
import { readQueryFromGraphDetails } from "../graph/TheGraph";
import {
  AssetAprComponent,
  AssetProtocol,
  HistoricalYield,
  JarDefinition,
} from "../model/PickleModelJson";
import { toError } from "../model/PickleModel";
import { ErrorSeverity } from "../core/platform/PlatformInterfaces";

const balVaultAddr = "0xBA12222222228d8Ba445958a75a0704d566BF2C8";

// make sure keys are lower-cased!
const balPoolIds: { [poolTokenAddress: string]: string } = {
  "0x64541216bafffeec8ea535bb71fbc927831d0595":
    "0x64541216bafffeec8ea535bb71fbc927831d0595000100000000000000000002", // arb bal tricrypto
  "0xc2f082d33b5b8ef3a7e3de30da54efd3114512ac":
    "0xc2f082d33b5b8ef3a7e3de30da54efd3114512ac000200000000000000000017", // arb bal pickle-eth
  "0xcc65a812ce382ab909a11e434dbf75b34f1cc59d":
    "0xcc65a812ce382ab909a11e434dbf75b34f1cc59d000200000000000000000001", // arb bal-eth
  "0xc61ff48f94d801c1ceface0289085197b5ec44f0":
    "0xc61ff48f94d801c1ceface0289085197b5ec44f000020000000000000000004d", // arb vsta-eth
};

interface GraphResponse {
  address: string;
  totalLiquidity: number;
  totalSwapFee: number;
}

export interface PoolData {
  pricePerToken: number;
  totalPoolValue: number;
  totalSupply: number;
}

export const queryTheGraph = async (
  model: PickleModel,
  jar: JarDefinition,
  blockNumber: number,
): Promise<GraphResponse | undefined> => {
  blockNumber -=
    jar.chain === ChainNetwork.Ethereum
      ? 30 // safety buffer, the graph on mainnet is quite instantaneous, but just to be safe
      : jar.chain === ChainNetwork.Arbitrum
      ? 5000 // safety buffer, the graph on arbitrum can take more than 1000 blocks to update!
      : 0;
  const query = `{ pools(first: 1, skip: 0, block: {number: ${blockNumber}}, where: {address_in: ["${jar.depositToken.addr}"]}) {\n    address\n    totalLiquidity\n    totalSwapFee\n  }\n}`;
  const res = await readQueryFromGraphDetails(
    query,
    AssetProtocol.BALANCER,
    jar.chain,
  );
  if (!res || !res.data || !res.data.pools || res.data.pools.length === 0) {
    model.logPlatformError(toError(305000, jar.chain, jar.details.apiKey, "BalancerUtil/queryTheGraph/1", 
    `Error loading Beethoven apy from graph`, '', ErrorSeverity.ERROR_4));
    return undefined;
  }
  const poolData = res?.data?.pools[0];
  if (
    poolData === undefined ||
    poolData.address === undefined ||
    poolData.totalLiquidity === undefined ||
    poolData.totalSwapFee === undefined
  ) {
    model.logPlatformError(toError(305000, jar.chain, jar.details.apiKey, "BalancerUtil/queryTheGraph/2", 
    `Error loading Beethoven apy from graph`, '', ErrorSeverity.ERROR_4));
    return undefined;
  }
  try {
    return {
      address: <string>poolData.address,
      totalLiquidity: +poolData.totalLiquidity,
      totalSwapFee: +poolData.totalSwapFee,
    } as GraphResponse;
  } catch (error) {
    console.log(error);
    console.log(res);
    model.logPlatformError(toError(305000, jar.chain, jar.details.apiKey, "BalancerUtil/queryTheGraph/3", 
    `Error loading Beethoven apy from graph`, ''+error, ErrorSeverity.ERROR_4));
    return undefined;
  }
};

export const getBalancerPoolDayAPY = async (
  jar: JarDefinition,
  model: PickleModel,
): Promise<number> => {
  // const arbBlocktime = ARBITRUM_SECONDS_PER_BLOCK   // TODO: uncomment this line once the value is corrected in Chains.ts
  const blocktime =
    jar.chain === ChainNetwork.Arbitrum
      ? 3 // in Chains.ts the value is wrongly set to 13
      : await Chains.getAccurateSecondsPerBlock(jar.chain, model);
  const blockNum = await model.multiproviderFor(jar.chain).getBlockNumber();
  const secondsInDay = 60 * 60 * 24;
  const blocksInDay = Math.round(secondsInDay / blocktime);
  const currentPoolDayDate: GraphResponse | undefined = await queryTheGraph(model, jar, blockNum );
  const b2 = blockNum - blocksInDay;
  const yesterdayPoolDayData: GraphResponse | undefined = await queryTheGraph(model, jar, b2);
  if (currentPoolDayDate === undefined || yesterdayPoolDayData === undefined) {
    model.logPlatformError(toError(305000, jar.chain, jar.details.apiKey, "BalancerUtil/getBalancerPoolDayAPY", 
    `Error loading Balancer apy from graph`, '', ErrorSeverity.ERROR_4));
    return 0;
  }

  const lastDaySwapFee =
    currentPoolDayDate.totalSwapFee - yesterdayPoolDayData.totalSwapFee;
  const apy = (lastDaySwapFee / currentPoolDayDate.totalLiquidity) * 365 * 100;
  return apy;
};

export const getBalancerPerformance = async (
  asset: JarDefinition,
  model: PickleModel,
): Promise<HistoricalYield> => {
  const blocktime =
    asset.chain === ChainNetwork.Arbitrum
      ? 3 // in Chains.ts the value is wrongly set to 13
      : await Chains.getAccurateSecondsPerBlock(asset.chain, model);
  const blockNum = await model.multiproviderFor(asset.chain).getBlockNumber();
  const secondsInDay = 60 * 60 * 24;
  const blocksInDay = Math.round(secondsInDay / blocktime);
  const [currentPoolDate, d1PoolData, d3PoolData, d7PoolData, d30PoolData] =
    await Promise.all([
      queryTheGraph(model, asset, blockNum),
      queryTheGraph(model, asset, blockNum - blocksInDay),
      queryTheGraph(model, asset, blockNum - blocksInDay * 3),
      queryTheGraph(model, asset, blockNum - blocksInDay * 7),
      queryTheGraph(model, asset, blockNum - blocksInDay * 30),
    ]);
  if( !currentPoolDate ) {
    model.logPlatformError(toError(305000, asset.chain, asset.details.apiKey, "BalancerUtil/queryTheGraph", 
    `Error loading balancer apy from graph`, '', ErrorSeverity.ERROR_4));
    return { d1: 0, d3: 0, d7: 0, d30: 0 };
  }
  const d1SwapFee = currentPoolDate.totalSwapFee - d1PoolData.totalSwapFee;
  const d3SwapFee = currentPoolDate.totalSwapFee - d3PoolData.totalSwapFee;
  const d7SwapFee = currentPoolDate.totalSwapFee - d7PoolData.totalSwapFee;
  const d30SwapFee = currentPoolDate.totalSwapFee - d30PoolData.totalSwapFee;
  const d1 = (d1SwapFee / currentPoolDate.totalLiquidity) * 365 * 100;
  const d3 = (d3SwapFee / currentPoolDate.totalLiquidity / 3) * 365 * 100;
  const d7 = (d7SwapFee / currentPoolDate.totalLiquidity / 7) * 365 * 100;
  const d30 = (d30SwapFee / currentPoolDate.totalLiquidity / 30) * 365 * 100;

  return {
    d1: d1,
    d3: d3,
    d7: d7,
    d30: d30,
  };
};

export const getPoolData = async (jar: JarDefinition, model: PickleModel) => {
  const multiProvider = model.multiproviderFor(jar.chain);
  const balVaultContract = new Contract(
    balVaultAddr,
    balVaultABI,
    multiProvider,
  );
  const balPoolId = balPoolIds[jar.depositToken.addr.toLowerCase()];
  const [poolTokensResp] = await multiProvider.all([
    balVaultContract.getPoolTokens(balPoolId),
  ]);
  const { tokens, balances } = poolTokensResp;
  const filtered = tokens.map((tokenAddr: string, i: number) => {
    return [
      tokenAddr,
      parseFloat(
        ethers.utils.formatUnits(
          balances[i],
          model.tokenDecimals(tokenAddr, jar.chain),
        ),
      ),
    ];
  });
  const poolContract = new Contract(
    jar.depositToken.addr,
    erc20,
    multiProvider,
  );
  const [poolTokenTotalSupplyBN]: BigNumber[] = await multiProvider.all([
    poolContract.totalSupply(),
  ]);
  const poolTokenTotalSupply = parseFloat(
    ethers.utils.formatUnits(poolTokenTotalSupplyBN.toString(), 18),
  ); // balancer LP tokens always have 18 decimals
  const poolTotalBalanceUSD = filtered.reduce(
    (total: number, token: [string, number]) => {
      const tokenAddress = token[0].toLowerCase();
      const tokenValueUSD =
        token[1] * model.priceOfSync(tokenAddress, jar.chain);
      return total + tokenValueUSD;
    },
    0,
  );
  return {
    totalPoolValue: +poolTotalBalanceUSD,
    totalSupply: poolTokenTotalSupply,
    pricePerToken: poolTotalBalanceUSD / poolTokenTotalSupply,
  };
};

export const calculateBalPoolAPRs = async (
  jar: JarDefinition,
  model: PickleModel,
): Promise<AssetAprComponent[]> => {
  const poolAprComponents: AssetAprComponent[] = [];

  const lp: AssetAprComponent = {
    name: "lp",
    apr: await getBalancerPoolDayAPY(jar, model),
    compoundable: false,
  };

  poolAprComponents.push(lp);

  return poolAprComponents;
};
