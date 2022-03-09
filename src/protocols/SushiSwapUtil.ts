import { ChainNetwork, Chains, PickleModel } from "..";
import { ONE_YEAR_SECONDS } from "../behavior/JarBehaviorResolver";
import { AssetProtocol, JarDefinition } from "../model/PickleModelJson";
import { PoolId } from "./ProtocolUtil";
import { Contract as MultiContract } from "ethers-multicall";
import erc20Abi from "../Contracts/ABIs/erc20.json";
import sushiChefAbi from "../Contracts/ABIs/sushi-chef.json";
import sushiMiniChefAbi from "../Contracts/ABIs/sushi-minichef.json";
import masterChefV2Abi from "../Contracts/ABIs/masterchefv2.json";
import rewarderAbi from "../Contracts/ABIs/rewarder.json";
import { formatEther, formatUnits } from "ethers/lib/utils";
import { GenericSwapUtility, IExtendedPairData } from "./GenericSwapUtil";

export const SUSHI_CHEF_ADDR = "0xc2EdaD668740f1aA35E4D8f227fB8E17dcA888Cd";
export const MASTERCHEFV2_ADDR = "0xef0881ec094552b2e128cf945ef17a6752b4ec5d";
export const SUSHI_MINICHEF_ARBITRUM_ADDR =
  "0xF4d73326C13a4Fc5FD7A064217e12780e9Bd62c3";

const sushiPoolIds: PoolId = {
  "0xC3D03e4F041Fd4cD388c549Ee2A29a9E5075882f": 2,
  "0x397FF1542f962076d0BFE58eA045FfA2d347ACa0": 1,
  "0x06da0fd433C1A5d7a4faa01111c044910A184553": 0,
  "0xCEfF51756c56CeFFCA006cD410B03FFC46dd3a58": 21,
  "0x088ee5007C98a9677165D78dD2109AE4a3D04d0C": 11,
  "0x10B47177E92Ef9D5C6059055d92DdF6290848991": 132,
  "0x795065dCc9f64b5614C407a6EFDC400DA6221FB0": 12,
  "0x9461173740D27311b176476FA27e94C681b1Ea6b": 230,
};

const sushiPoolV2Ids: PoolId = {
  "0xC3f279090a47e80990Fe3a9c30d24Cb117EF91a8": 0,
  "0x05767d9EF41dC40689678fFca0608878fb3dE906": 1,
  "0x269db91fc3c7fcc275c2e6f22e5552504512811c": 3,
  "0xfCEAAf9792139BF714a694f868A215493461446D": 8,
};

const sushiPoolIdsArbitrum: PoolId = {
  "0xb6DD51D5425861C808Fd60827Ab6CFBfFE604959": 9,
  "0x8f93Eaae544e8f5EB077A1e09C1554067d9e2CA8": 11,
  "0xaa5bD49f2162ffdC15634c87A77AC67bD51C6a6D": 12,
  "0xB7E50106A5bd3Cf21AF210A755F9C8740890A8c9": 13,
};

const SUSHI_ARB_PAIR_DATA_CACHE_KEY = "sushiswap.arb.pair.data.cache.key";
export class SushiArbPairManager extends GenericSwapUtility {
  constructor() {
    super(
      SUSHI_ARB_PAIR_DATA_CACHE_KEY,
      "pair",
      SUSHI_POLY_PAIR_GRAPH_FIELDS, //Same fields as Polygon
      AssetProtocol.SUSHISWAP,
      ChainNetwork.Arbitrum,
      0.0025,
    );
  }

  pairAddressFromDayData(dayData: any): string {
    return dayData.pair.id;
  }
  toExtendedPairData(pair: any): IExtendedPairData {
    return {
      pairAddress: pair.id,
      reserveUSD: pair.reserveUSD,
      dailyVolumeUSD: pair.volumeUSD,
      reserve0: pair.reserve0,
      reserve1: pair.reserve1,
      token0Id: pair.token0.id,
      token1Id: pair.token1.id,
      totalSupply: pair.totalSupply,
      pricePerToken: pair.reserveUSD / pair.totalSupply,
    };
  }
}

const SUSHI_ONE_PAIR_DATA_CACHE_KEY = "sushiswap.one.pair.data.cache.key";
export class SushiOnePairManager extends GenericSwapUtility {
  constructor() {
    super(
      SUSHI_ONE_PAIR_DATA_CACHE_KEY,
      "pair",
      SUSHI_POLY_PAIR_GRAPH_FIELDS, //Same fields as Polygon
      AssetProtocol.SUSHISWAP,
      ChainNetwork.Harmony,
      0.0025,
    );
  }

  pairAddressFromDayData(dayData: any): string {
    return dayData.pair.id;
  }
  toExtendedPairData(pair: any): IExtendedPairData {
    return {
      pairAddress: pair.id,
      reserveUSD: pair.reserveUSD,
      dailyVolumeUSD: pair.volumeUSD,
      reserve0: pair.reserve0,
      reserve1: pair.reserve1,
      token0Id: pair.token0.id,
      token1Id: pair.token1.id,
      totalSupply: pair.totalSupply,
      pricePerToken: pair.reserveUSD / pair.totalSupply,
    };
  }
}

const SUSHI_POLY_PAIR_DATA_CACHE_KEY = "sushiswap.poly.pair.data.cache.key";
const SUSHI_POLY_PAIR_GRAPH_FIELDS: string[] = [
  "pair{id}",
  "date",
  "reserveUSD",
  "volumeUSD",
  "reserve0",
  "reserve1",
  "token0{id}",
  "token1{id}",
  "totalSupply",
];
export class SushiPolyPairManager extends GenericSwapUtility {
  constructor() {
    super(
      SUSHI_POLY_PAIR_DATA_CACHE_KEY,
      "pair",
      SUSHI_POLY_PAIR_GRAPH_FIELDS,
      AssetProtocol.SUSHISWAP,
      ChainNetwork.Polygon,
      0.0025,
    );
  }

  pairAddressFromDayData(dayData: any): string {
    return dayData.pair.id;
  }
  toExtendedPairData(pair: any): IExtendedPairData {
    return {
      pairAddress: pair.id,
      reserveUSD: pair.reserveUSD,
      dailyVolumeUSD: pair.volumeUSD,
      reserve0: pair.reserve0,
      reserve1: pair.reserve1,
      token0Id: pair.token0.id,
      token1Id: pair.token1.id,
      totalSupply: pair.totalSupply,
      pricePerToken: pair.reserveUSD / pair.totalSupply,
    };
  }
}

const SUSHI_ETH_PAIR_DATA_CACHE_KEY = "sushiswap.eth.pair.data.cache.key";
const SUSHI_ETH_PAIR_GRAPH_FIELDS: string[] = [
  "pairAddress",
  "date",
  "reserveUSD",
  "dailyVolumeUSD",
  "reserve0",
  "reserve1",
  "token0{id}",
  "token1{id}",
  "totalSupply",
];
export class SushiEthPairManager extends GenericSwapUtility {
  constructor() {
    super(
      SUSHI_ETH_PAIR_DATA_CACHE_KEY,
      "pairAddress",
      SUSHI_ETH_PAIR_GRAPH_FIELDS,
      AssetProtocol.SUSHISWAP,
      ChainNetwork.Ethereum,
      0.0025,
    );
  }

  pairAddressFromDayData(dayData: any): string {
    return dayData.pairAddress;
  }
  toExtendedPairData(pair: any): IExtendedPairData {
    return {
      pairAddress: pair.pairAddress,
      reserveUSD: pair.reserveUSD,
      dailyVolumeUSD: pair.dailyVolumeUSD,
      reserve0: pair.reserve0,
      reserve1: pair.reserve1,
      token0Id: pair.token0.id,
      token1Id: pair.token1.id,
      totalSupply: pair.totalSupply,
      pricePerToken: pair.reserveUSD / pair.totalSupply,
    };
  }
}

export async function calculateSushiRewardApr(
  lpTokenAddress: string,
  model: PickleModel,
  chain: ChainNetwork,
): Promise<number> {
  const pairData = await new SushiEthPairManager().getPairData(
    model,
    lpTokenAddress,
  );
  if (pairData && model.priceOfSync("sushi", chain)) {
    const poolId = sushiPoolIds[lpTokenAddress];
    const multicallSushiChef = new MultiContract(SUSHI_CHEF_ADDR, sushiChefAbi);
    const [sushiPerBlockBN, totalAllocPointBN, poolInfo] =
      await model.comMan.call(
        [
          () => multicallSushiChef.sushiPerBlock(),
          () => multicallSushiChef.totalAllocPoint(),
          () => multicallSushiChef.poolInfo(poolId),
        ],
        chain,
      );

    const sushiRewardsPerBlock =
      (parseFloat(formatEther(sushiPerBlockBN)) *
        0.9 *
        poolInfo.allocPoint.toNumber()) /
      totalAllocPointBN.toNumber();

    const sushiRewardsPerYear =
      sushiRewardsPerBlock *
      (ONE_YEAR_SECONDS / Chains.get(chain).secondsPerBlock);
    const valueRewardedPerYear =
      model.priceOfSync("sushi", chain) * sushiRewardsPerYear;

    const sushiAPY = valueRewardedPerYear / pairData.reserveUSD;
    return sushiAPY * 100;
  }
  return 0;
}

export async function calculateMCv2SushiRewards(
  lpTokenAddress: string,
  model: PickleModel,
  chain: ChainNetwork,
): Promise<number> {
  let poolId = sushiPoolV2Ids[lpTokenAddress];
  if (poolId === undefined)
    poolId = sushiPoolV2Ids[lpTokenAddress.toLowerCase()];

  const multicallMasterChefV2 = new MultiContract(
    MASTERCHEFV2_ADDR,
    masterChefV2Abi,
  );
  const lpToken = new MultiContract(lpTokenAddress, erc20Abi);

  const [sushiPerBlockBN, totalAllocPointBN, poolInfo, supplyInRewarderBN] =
    await model.comMan.call(
      [
        () => multicallMasterChefV2.sushiPerBlock(),
        () => multicallMasterChefV2.totalAllocPoint(),
        () => multicallMasterChefV2.poolInfo(poolId),
        () => lpToken.balanceOf(MASTERCHEFV2_ADDR),
      ],
      chain,
    );

  const supplyInRewarder = parseFloat(formatEther(supplyInRewarderBN));
  const sushiRewardsPerBlock =
    (parseFloat(formatEther(sushiPerBlockBN)) *
      0.9 *
      poolInfo.allocPoint.toNumber()) /
    totalAllocPointBN.toNumber();

  const sushiRewardsPerYear =
    sushiRewardsPerBlock *
    (ONE_YEAR_SECONDS / Chains.get(chain).secondsPerBlock);
  const valueRewardedPerYear =
    model.priceOfSync("sushi", chain) * sushiRewardsPerYear;
  const pricePerToken = model.priceOfSync(lpTokenAddress, chain);
  const totalValueStaked = supplyInRewarder * pricePerToken;
  const sushiAPY = valueRewardedPerYear / totalValueStaked;
  return sushiAPY * 100;
}
/*
  export enum MASTERCHEF_V2_REWARD_RATE {

  }
  */
export async function calculateMCv2TokenRewards(
  lpTokenAddress: string,
  rewardToken: string,
  model: PickleModel,
  chain: ChainNetwork,
): Promise<number> {
  const poolId = sushiPoolV2Ids[lpTokenAddress];
  const rewarder_addr = await model.comMan.call(
    () =>
      new MultiContract(MASTERCHEFV2_ADDR, masterChefV2Abi).rewarder(poolId),
    chain,
  );
  const rewarder = new MultiContract(rewarder_addr, rewarderAbi);
  const lpToken = new MultiContract(lpTokenAddress, erc20Abi);
  const supplyInMasterChefBN = await model.comMan.call(
    () => lpToken.balanceOf(MASTERCHEFV2_ADDR),
    chain,
  );
  const supplyInMasterChef = parseFloat(formatEther(supplyInMasterChefBN));

  // TODO clean this mess up
  let rewardsPerYear = 0;
  if (rewardToken === "alcx") {
    const tokenPerBlockBN = await model.comMan.call(
      () => rewarder.tokenPerBlock(),
      chain,
    );
    const secPerBl = Chains.get(chain).secondsPerBlock;
    rewardsPerYear =
      (parseFloat(formatEther(tokenPerBlockBN)) * ONE_YEAR_SECONDS) /
      Chains.get(chain).secondsPerBlock;
    const rewardsPerYear2 =
      (parseFloat(formatEther(tokenPerBlockBN)) * ONE_YEAR_SECONDS) / 13;
  } else if (rewardToken === "cvx") {
    const tokenPerSecondBN = await model.comMan.call(
      () => rewarder.rewardRate(),
      chain,
    );
    rewardsPerYear =
      parseFloat(formatEther(tokenPerSecondBN)) * ONE_YEAR_SECONDS;
  } else if (rewardToken === "tru") {
    const tokenPerSecondBN = await model.comMan.call(
      () => rewarder.rewardPerSecond(),
      chain,
    );
    rewardsPerYear =
      parseFloat(formatUnits(tokenPerSecondBN, 8)) * ONE_YEAR_SECONDS;
  }
  const valueRewardedPerYear =
    model.priceOfSync(rewardToken, chain) * rewardsPerYear;

  const pricePerToken = model.priceOfSync(lpTokenAddress, chain);
  const totalValueStaked = pricePerToken * supplyInMasterChef;
  const rewardAPR = valueRewardedPerYear / totalValueStaked;

  return rewardAPR * 100;
}

export async function calculateSushiApyArbitrum(
  jar: JarDefinition,
  model: PickleModel,
) {
  const lpTokenAddress: string = jar.depositToken.addr;
  const poolId = sushiPoolIdsArbitrum[lpTokenAddress];
  const multicallsushiMinichef = new MultiContract(
    SUSHI_MINICHEF_ARBITRUM_ADDR,
    sushiMiniChefAbi,
  );
  const lpToken = new MultiContract(lpTokenAddress, erc20Abi);
  const [sushiPerSecondBN, totalAllocPointBN, poolInfo, totalSupplyBN] =
    await model.comMan.call(
      [
        () => multicallsushiMinichef.sushiPerSecond(),
        () => multicallsushiMinichef.totalAllocPoint(),
        () => multicallsushiMinichef.poolInfo(poolId),
        () => lpToken.balanceOf(SUSHI_MINICHEF_ARBITRUM_ADDR),
      ],
      jar.chain,
    );
  const totalSupply = parseFloat(formatEther(totalSupplyBN));
  const sushiRewardsPerSecond =
    (parseFloat(formatEther(sushiPerSecondBN)) *
      poolInfo.allocPoint.toNumber()) /
    totalAllocPointBN.toNumber();
  const pricePerToken = jar.depositToken.price;
  const sushiRewardsPerYear = sushiRewardsPerSecond * (365 * 24 * 60 * 60);
  const valueRewardedPerYear =
    model.priceOfSync("sushi", jar.chain) * sushiRewardsPerYear;

  const totalValueStaked = totalSupply * pricePerToken;
  const sushiAPY = valueRewardedPerYear / totalValueStaked;
  return sushiAPY;
}

export async function calculateMCv2ApyArbitrum(
  jar: JarDefinition,
  model: PickleModel,
  rewardToken: string,
) {
  const lpTokenAddress = jar.depositToken.addr;
  const poolId = sushiPoolIdsArbitrum[lpTokenAddress];
  const sushiMinichef = new MultiContract(
    SUSHI_MINICHEF_ARBITRUM_ADDR,
    sushiMiniChefAbi,
  );
  const rewarder_addr = await model.comMan.call(
    () => sushiMinichef.rewarder(poolId),
    jar.chain,
  );
  const rewarder = new MultiContract(rewarder_addr, rewarderAbi);
  const lpToken = new MultiContract(lpTokenAddress, erc20Abi);
  const totalSupplyBN = await model.comMan.call(
    () => lpToken.balanceOf(sushiMinichef.address),
    jar.chain,
  );
  const totalSupply = parseFloat(formatEther(totalSupplyBN));
  const pricePerToken = jar.depositToken.price;

  const tokenPerSecondBN = await model.comMan.call(
    () => rewarder.rewardPerSecond(),
    jar.chain,
  );
  const rewardsPerYear =
    parseFloat(formatEther(tokenPerSecondBN)) * ONE_YEAR_SECONDS;

  const valueRewardedPerYear =
    model.priceOfSync(rewardToken, jar.chain) * rewardsPerYear;

  const totalValueStaked = totalSupply * pricePerToken;
  const rewardAPY = valueRewardedPerYear / totalValueStaked;
  return rewardAPY;
}
