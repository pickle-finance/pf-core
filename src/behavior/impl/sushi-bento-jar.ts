import { AssetAprComponent, AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { PickleModel, toError } from "../../model/PickleModel";
import { ChainNetwork } from "../..";
import { BigNumber, ethers } from "ethers";
import { Contract as MultiContract } from "ethers-multiprovider";
import fetch from "cross-fetch";
import { RAW_CHAIN_BUNDLED_DEF } from "../../chain/Chains";
import { ONE_YEAR_IN_SECONDS } from "../../behavior/AbstractJarBehavior";
import { ErrorSeverity } from "../../core/platform/PlatformInterfaces";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import sushiMiniChefAbi from "../../Contracts/ABIs/sushi-minichef.json";

// prettier-ignore
const strategyAbi = ["function bentoBox() view returns(address)", "function isBentoPool() view returns(bool)", "function getHarvestable() view returns(address[], uint256[])", "function poolId() view returns(uint256)", "function minichef() view returns(address)"];
// prettier-ignore
const bentoPoolAbi = ["function getReserves() view returns(uint256, uint256)", "function totalSupply() view returns(uint256)", "function decimals() view returns(uint8)"];

export class SushiBentoJar extends AbstractJarBehavior {
  isBentoPool: boolean;
  poolApiData: any;

  async getDepositTokenPrice(jar: JarDefinition, model: PickleModel): Promise<number> {
    if (jar.depositToken.price) return jar.depositToken.price;
    if (await this.getPoolApiData(jar, model)) {
      // Get pool information from Sushi API
      const reserveUSD: number = parseFloat(this.poolApiData.liquidityUSD);
      const totalSupply: number = parseFloat(ethers.utils.formatEther(this.poolApiData.totalSupply));
      const pricePerToken = reserveUSD / totalSupply;
      return pricePerToken;
    } else {
      // Get pool information on chain
      const multiProvider = model.multiproviderFor(jar.chain);

      if (await this.getIsBentoPool(jar, model)) {
        // Trident pools
        const poolContract = new MultiContract(jar.depositToken.addr, bentoPoolAbi);
        const tokenA = jar.depositToken.components[0];
        const tokenB = jar.depositToken.components[1];

        const [balancesBN, totalSupplyBN, poolDecimals] = (await multiProvider.all([
          poolContract.getReserves(),
          poolContract.totalSupply(),
          poolContract.decimals(),
        ])) as [BigNumber[], BigNumber, number];

        // get prices
        const priceA = model.priceOfSync(tokenA, jar.chain);
        const priceB = model.priceOfSync(tokenB, jar.chain);

        // get num of tokens
        const balanceA = parseFloat(ethers.utils.formatUnits(balancesBN[0], model.tokenDecimals(tokenA, jar.chain)));
        const balanceB = parseFloat(ethers.utils.formatUnits(balancesBN[1], model.tokenDecimals(tokenB, jar.chain)));

        let reserveUSD: number;
        // In case price one token is not listed on coingecko
        if (priceA && priceB) {
          reserveUSD = priceA * balanceA + priceB * balanceB;
        } else if (priceA) {
          reserveUSD = 2 * priceA * balanceA;
        } else {
          reserveUSD = 2 * priceB * balanceB;
        }

        const totalSupply = parseFloat(ethers.utils.formatUnits(totalSupplyBN, poolDecimals));
        const pricePerToken = reserveUSD / totalSupply;
        return pricePerToken;
      } else {
        // Legacy (uniswap-style) pools
        return super.getDepositTokenPrice(jar, model);
      }
    }
  }

  async getHarvestableUSD(jar: JarDefinition, model: PickleModel): Promise<number> {
    return this.getHarvestableUSDDefaultImplementationV2(jar, model);
  }

  async getProjectedAprStats(jar: JarDefinition, model: PickleModel): Promise<AssetProjectedApr> {
    const components: AssetAprComponent[] = [];
    const retainedPercentage = jar.chain === ChainNetwork.Ethereum ? 0.8 : 0.9;

    // Get reward tokens
    const multiProvider = model.multiproviderFor(jar.chain);
    const strategyContract = new MultiContract(jar.details.strategyAddr, strategyAbi);

    // let rewardTokensAddresses: string[] = jar.rewardTokens.map((token) => model.address(token, jar.chain));
    const [[activeRewardsAddresses]] = (await multiProvider.all([strategyContract.getHarvestable()])) as [[string[]]];
    const activeRewards = activeRewardsAddresses.map((addr) => model.tokenDetails(addr, jar.chain));

    if (await this.getPoolApiData(jar, model)) {
      // LP APR
      const lpApr = this.poolApiData.feeApr;
      components.push(this.createAprComponent("lp", lpApr * 100, false));

      // Rewards APR
      const rewardsData: any[] = this.poolApiData.incentives;
      activeRewards.forEach((reward) => {
        const rewardData = rewardsData.find((r) => r.rewardToken.address === reward.contractAddr.toLowerCase());
        if (rewardData) {
          components.push(this.createAprComponent(reward.id, rewardData.apr * 100, true, retainedPercentage));
        } else {
          components.push(this.createAprComponent(reward.id, 0, true));
        }
      });
    } else {
      const sushiAPY = await this.calculateSushiAPYOnChainImpl(jar, model);
      components.push(this.createAprComponent("sushi", sushiAPY, true, retainedPercentage));
    }
    return this.aprComponentsToProjectedApr(components);
  }

  // Calculates the $SUSHI rewards APY using on-chain data
  // Does not include extra rewards APY since not all RPCs support getStorageAt calls
  async calculateSushiAPYOnChainImpl(jar: JarDefinition, model: PickleModel): Promise<number> {
    const multiProvider = model.multiproviderFor(jar.chain);
    const strategyContract = new MultiContract(jar.details.strategyAddr, strategyAbi);

    const [poolId, chefAddr] = await multiProvider.all([strategyContract.poolId(), strategyContract.minichef()]);
    const chefContract = new MultiContract(chefAddr, sushiMiniChefAbi);
    const lpToken = new MultiContract(jar.depositToken.addr, erc20Abi);

    const [sushiPerSecondBN, totalAllocPointBN, poolInfo, totalSupplyBN] = await multiProvider.all([
      chefContract.sushiPerSecond(),
      chefContract.totalAllocPoint(),
      chefContract.poolInfo(poolId),
      lpToken.balanceOf(chefAddr),
    ]);

    const totalSupply = parseFloat(ethers.utils.formatEther(totalSupplyBN));
    const sushiRewardsPerSecond =
      (parseFloat(ethers.utils.formatEther(sushiPerSecondBN)) * poolInfo.allocPoint.toNumber()) /
      totalAllocPointBN.toNumber();

    const pricePerToken = await this.getDepositTokenPrice(jar, model);

    const sushiRewardsPerYear = sushiRewardsPerSecond * ONE_YEAR_IN_SECONDS;
    const valueRewardedPerYear = model.priceOfSync("sushi", jar.chain) * sushiRewardsPerYear;

    const totalValueStaked = totalSupply * pricePerToken;
    const sushiAPY = (valueRewardedPerYear / totalValueStaked) * 100;

    return sushiAPY;
  }

  async getIsBentoPool(jar: JarDefinition, model: PickleModel): Promise<boolean> {
    if (this.isBentoPool === undefined) {
      const multiProvider = model.multiproviderFor(jar.chain);
      const strategyContract: MultiContract = new MultiContract(jar.details.strategyAddr, strategyAbi);

      const [isBentoPool] = (await multiProvider.all([strategyContract.isBentoPool()])) as [boolean];
      this.isBentoPool = isBentoPool;
    }
    return this.isBentoPool;
  }

  async getPoolApiData(jar: JarDefinition, model: PickleModel): Promise<any> {
    if (this.poolApiData === undefined) {
      const pool = jar.depositToken.addr.toLowerCase();
      const chainId = RAW_CHAIN_BUNDLED_DEF.find((rawChain) => rawChain.network === jar.chain).chainId;
      // const sushiApi = `https://www.sushi.com/earn/api/graphPool/${chainId}:${pool}`;
      const sushiApi = `https://pools-git-feature-swap.sushi.com/api/v0/${chainId}/${pool}`;
      let poolData: any;
      try {
        const resp = await fetch(sushiApi);
        const data = await resp.json();
        poolData = data;
      } catch (error) {
        // prettier-ignore
        model.logPlatformError(toError(301102, jar.chain, jar.details.apiKey, "getApiLpDetails", "error fetching velodrome API", "" + error, ErrorSeverity.ERROR_3));
      }
      this.poolApiData = poolData;
    }
    return this.poolApiData;
  }
}
