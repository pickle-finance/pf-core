import { BigNumber, ethers } from "ethers";
import balVaultABI from "../Contracts/ABIs/balancer_vault.json";
import erc20Abi from "../Contracts/ABIs/erc20.json";
import beethovenxChefAbi from "../Contracts/ABIs/beethovenx-chef.json";
import { Chains, PickleModel } from "..";
import { readQueryFromGraphDetails } from "../graph/TheGraph";
import {
  AssetAprComponent,
  AssetProtocol,
  HistoricalYield,
  JarDefinition,
} from "../model/PickleModelJson";
import { Contract } from "ethers-multiprovider";
import { ONE_YEAR_IN_SECONDS } from "../behavior/AbstractJarBehavior";
import { toError } from "../model/PickleModel";
import { ErrorSeverity } from "../core/platform/PlatformInterfaces";

const VAULT_ADDRESS = "0x20dd72Ed959b6147912C2e529F0a0C651c33c9ce";
export const MC_ADDRESS = "0x8166994d9ebBe5829EC86Bd81258149B87faCfd3";

// make sure keys are lower-cased! (TODO: replace with the checksummed version)
const vaultPoolIds: { [poolTokenAddress: string]: string } = {
  "0xd47d2791d3b46f9452709fa41855a045304d6f9d":
    "0xd47d2791d3b46f9452709fa41855a045304d6f9d000100000000000000000004", // ftm-btc-eth
  "0x5e02ab5699549675a6d3beeb92a62782712d0509":
    "0x5e02ab5699549675a6d3beeb92a62782712d0509000200000000000000000138", // lqdr-ftm
  "0x2c580c6f08044d6dfaca8976a66c8fadddbd9901":
    "0x2c580c6f08044d6dfaca8976a66c8fadddbd9901000000000000000000000038", // usdc-dai-mai
  "0xf3a602d30dcb723a74a0198313a7551feaca7dac":
    "0xf3a602d30dcb723a74a0198313a7551feaca7dac00010000000000000000005f", // usdc-ftm-btc-eth
  "0x9af1f0e9ac9c844a4a4439d446c1437807183075":
    "0x9af1f0e9ac9c844a4a4439d446c14378071830750001000000000000000000da", // ftm-matic-sol-avax-luna-bnb
  "0xcdf68a4d525ba2e90fe959c74330430a5a6b8226":
    "0xcdf68a4d525ba2e90fe959c74330430a5a6b8226000200000000000000000008", // ftm-usdc
  "0xfcef8a994209d6916eb2c86cdd2afd60aa6f54b1":
    "0xcde5a11a4acb4ee4c805352cec57e236bdbc3837000200000000000000000019", // beets-ftm
};

// make sure keys are lower-cased! (TODO: replace with the checksummed version)
export const masterChefIds: { [tokenAddress: string]: number } = {
  "0xd47d2791d3b46f9452709fa41855a045304d6f9d": 1, // ftm-btc-eth
  "0x5e02ab5699549675a6d3beeb92a62782712d0509": 36, // lqdr-ftm
  "0x2c580c6f08044d6dfaca8976a66c8fadddbd9901": 16, // usdc-dai-mai
  "0xf3a602d30dcb723a74a0198313a7551feaca7dac": 17, // usdc-ftm-btc-eth
  "0x9af1f0e9ac9c844a4a4439d446c1437807183075": 26, // ftm-matic-sol-avax-luna-bnb
  "0xcdf68a4d525ba2e90fe959c74330430a5a6b8226": 8, // ftm-usdc
  "0xfcef8a994209d6916eb2c86cdd2afd60aa6f54b1": 22, // fBeets (beets-ftm)
};

export const fBeets = "0xfcef8a994209d6916EB2C86cDD2AFD60Aa6F54b1";
export const fBeetsUnderlying = "0xcdE5a11a4ACB4eE4c805352Cec57E236bdBC3837"; // beets-ftm

interface GraphResponse {
  address: string;
  totalLiquidity: number;
  totalSwapFee: number;
}

export const queryTheGraph = async (
  jar: JarDefinition,
  blockNumber: number,
): Promise<GraphResponse | undefined> => {
  blockNumber -= 5400; // 1.5 hours safety buffer, the graph on fantom is quite instantaneous, but just to be safe
  const poolAddr =
    jar.depositToken.addr === fBeets ? fBeetsUnderlying : jar.depositToken.addr;
  const query = `
  { pools(first: 1, skip: 0, block: {number: ${blockNumber}}, where: {address_in: ["${poolAddr}"]}) {
        address
        totalLiquidity
        totalSwapFee
      }
  }`;
  const res = await readQueryFromGraphDetails(
    query,
    AssetProtocol.BEETHOVENX,
    jar.chain,
  );
  if (!res || !res.data || !res.data.pools || res.data.pools.length === 0) {
    return undefined;
  }
  const poolData = res?.data?.pools[0];
  if (
    poolData.address === undefined ||
    poolData.totalLiquidity === undefined ||
    poolData.totalSwapFee === undefined
  ) {
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
  }
};

export const getBalancerPoolDayAPY = async (
  jar: JarDefinition,
  model: PickleModel,
): Promise<number> => {
  const blocktime = Chains.get(jar.chain).secondsPerBlock;
  const blockNum = await model.multiproviderFor(jar.chain).getBlockNumber();
  const secondsInDay = 60 * 60 * 24;
  const blocksInDay = Math.round(secondsInDay / blocktime);
  const currentPoolDayDate: GraphResponse | undefined = await queryTheGraph(
    jar,
    blockNum,
  );
  const yesterdayPoolDayData: GraphResponse | undefined = await queryTheGraph(
    jar,
    blockNum - blocksInDay,
  );
  if (currentPoolDayDate === undefined || yesterdayPoolDayData === undefined) {
    return 0;
  }

  const lastDaySwapFee =
    currentPoolDayDate.totalSwapFee - yesterdayPoolDayData.totalSwapFee;
  const apy = (lastDaySwapFee / currentPoolDayDate.totalLiquidity) * 365 * 100;
  return apy;
};

export const getBalancerPerformance = async (
  jar: JarDefinition,
  model: PickleModel,
): Promise<HistoricalYield> => {
  const blocktime = Chains.get(jar.chain).secondsPerBlock;
  const blockNum = await model.multiproviderFor(jar.chain).getBlockNumber();
  const secondsInDay = 60 * 60 * 24;
  const blocksInDay = Math.round(secondsInDay / blocktime);
  const [currentPoolDate, d1PoolData, d3PoolData, d7PoolData, d30PoolData] =
    await Promise.all([
      queryTheGraph(jar, blockNum),
      queryTheGraph(jar, blockNum - blocksInDay),
      queryTheGraph(jar, blockNum - blocksInDay * 3),
      queryTheGraph(jar, blockNum - blocksInDay * 7),
      queryTheGraph(jar, blockNum - blocksInDay * 30),
    ]);
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

export const getPoolData = async (
  jar: JarDefinition,
  model: PickleModel,
): Promise<number> => {
  const blockNum = await model.multiproviderFor(jar.chain).getBlockNumber();
  const graphResp: GraphResponse | undefined = await queryTheGraph(
    jar,
    blockNum,
  );
  const multiProvider = model.multiproviderFor(jar.chain);
  const poolContract = new Contract(jar.depositToken.addr, erc20Abi);
  const [poolTokenTotalSupplyBN]: BigNumber[] = await multiProvider.all([
    poolContract.totalSupply(),
  ]);
  const poolTokenTotalSupply = parseFloat(
    ethers.utils.formatUnits(poolTokenTotalSupplyBN.toString(), 18),
  ); // balancer LP tokens always have 18 decimals

  let totalSupplyUSD = 0.0001;
  if (graphResp) {
    // Better way to get totalLiquidityUSD value. Depends on the graph to work.
    const { totalLiquidity } = graphResp;
    totalSupplyUSD = totalLiquidity;
  } else {
    try {
      // Less efficient. Fallback in case the graph doesn't work
      const vaultPoolId = vaultPoolIds[jar.depositToken.addr.toLowerCase()];
      const balVaultContract = new Contract(
        VAULT_ADDRESS,
        balVaultABI,
        multiProvider,
      );
      const poolTokensResp = await balVaultContract.callStatic.getPoolTokens(
        vaultPoolId,
      );

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
      const poolTotalBalanceUSD = filtered.reduce(
        (total: number, [tokenAddr, tokenAmount]: [string, number]) => {
          const tokenAddress = tokenAddr.toLowerCase();
          const tokenPrice = model.priceOfSync(tokenAddress, jar.chain);
          const tokenValueUSD = tokenAmount * tokenPrice;
          return total + tokenValueUSD;
        },
        0,
      );
      if (!poolTotalBalanceUSD)
        throw `Error: poolTotalBalanceUSD = ${poolTotalBalanceUSD}`;
      totalSupplyUSD = poolTotalBalanceUSD;
    } catch (error) {
      model.logPlatformError(toError(305000, jar.chain, jar.details.apiKey, "BeethovenXUtil/getPoolData", 
      ``, ''+error, ErrorSeverity.ERROR_4));
    }
  }

  return totalSupplyUSD / poolTokenTotalSupply;
};

export const calculateBalPoolAPRs = async (
  jar: JarDefinition,
  model: PickleModel,
  pricePerToken: number,
): Promise<AssetAprComponent[]> => {
  const poolId = masterChefIds[jar.depositToken.addr.toLowerCase()];
  const multiProvider = model.multiproviderFor(jar.chain);
  const multicallMasterchef = new Contract(MC_ADDRESS, beethovenxChefAbi);
  const lpToken = new Contract(jar.depositToken.addr, erc20Abi);
  const [beetsPerBlockBN, totalAllocPointBN, poolInfo, totalSupplyBN] =
    await multiProvider.all([
      multicallMasterchef.beetsPerBlock(),
      multicallMasterchef.totalAllocPoint(),
      multicallMasterchef.poolInfo(poolId),
      lpToken.balanceOf(MC_ADDRESS),
    ]);
  const totalSupply = parseFloat(ethers.utils.formatEther(totalSupplyBN));
  const rewardsPerBlock =
    (parseFloat(ethers.utils.formatEther(beetsPerBlockBN)) *
      poolInfo.allocPoint.toNumber()) /
    totalAllocPointBN.toNumber();
  const blocksPerYear =
    ONE_YEAR_IN_SECONDS / Chains.get(jar.chain).secondsPerBlock;
  const rewardsPerYear = rewardsPerBlock * blocksPerYear;

  const valueRewardedPerYear =
    model.priceOfSync("beets", jar.chain) * rewardsPerYear;

  const totalValueStaked = totalSupply * pricePerToken;
  const beetsAPY = valueRewardedPerYear / totalValueStaked;
  const poolAprComponents = [
    { name: "beets", apr: beetsAPY * 100, compoundable: true },
  ];

  const lp: AssetAprComponent = {
    name: "lp",
    apr: await getBalancerPoolDayAPY(jar, model),
    compoundable: false,
  };
  poolAprComponents.push(lp);

  return poolAprComponents;
};
