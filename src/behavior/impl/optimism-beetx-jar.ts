import { Contract } from "ethers-multiprovider";
import { Chains, PickleModel } from "../..";
import {
  AssetAprComponent,
  AssetProjectedApr,
  HistoricalYield,
  JarDefinition,
} from "../../model/PickleModelJson";
import {
  getBalancerPerformance,
  getBeethovenPoolDayAPY,
  getPoolData,
} from "../../protocols/BeethovenXUtil";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { getRewardOnlyGaugeTokensApr } from "../../protocols/CurveGaugeUtil";
import { toError } from "../../model/PickleModel";
import { ErrorSeverity } from "../../core/platform/PlatformInterfaces";
import { BigNumber, ethers } from "ethers";
import erc20Abi from "../../Contracts/ABIs/erc20.json";

export class OPBeetXJar extends AbstractJarBehavior {
  protected jarData: {
    pricePerToken: number | undefined;
    gauge: string | undefined;
    rewardTokens: string[];
  };

  async getDepositTokenPrice(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    if (!this.jarData) await this.getJarData(jar, model);
    if (this.jarData) return this.jarData.pricePerToken;

    const msg = `Error in getDepositTokenPrice (${jar.details.apiKey})`;
    console.log(msg);
    return 0;
  }

  async getProjectedAprStats(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    if (!this.jarData) await this.getJarData(jar, model);
    const poolAprComponents: AssetAprComponent[] = [];

    const lp: AssetAprComponent = {
      name: "lp",
      apr: await getBeethovenPoolDayAPY(jar, model),
      compoundable: false,
    };
    poolAprComponents.push(lp);

    if (this.jarData) {
      const rewardsAprs = await getRewardOnlyGaugeTokensApr(
        jar,
        model,
        this.jarData.gauge,
        this.jarData.rewardTokens,
      );
      const aprsPostFee = rewardsAprs.map((component) =>
        this.createAprComponent(
          component.name,
          component.apr,
          component.compoundable,
          1 - Chains.get(jar.chain).defaultPerformanceFee,
        ),
      );
      poolAprComponents.push(...aprsPostFee);
    }
    return this.aprComponentsToProjectedApr(poolAprComponents);
  }

  async getProtocolApy(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<HistoricalYield> {
    return await getBalancerPerformance(definition, model);
  }

  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    // prettier-ignore
    const gaugeAbi = ["function claimable_reward_write(address _addr, address _token) view returns(uint256)"];
    if (!this.jarData) await this.getJarData(jar, model);
    const multiProvider = model.multiproviderFor(jar.chain);
    const gauge = new Contract(this.jarData.gauge, gaugeAbi);

    const amountsInStrategyProm = multiProvider.all(
      this.jarData.rewardTokens.map((rewardAddr) =>
        new Contract(rewardAddr, erc20Abi).balanceOf(jar.details.strategyAddr),
      ),
    );
    const amountsPendingProm = multiProvider.all(
      this.jarData.rewardTokens.map((reward) =>
        gauge.claimable_reward_write(jar.details.strategyAddr, reward),
      ),
    );
    const [amountsInStrategy, amountsPending]: [BigNumber[], BigNumber[]] =
      await Promise.all([amountsInStrategyProm, amountsPendingProm]);

    const rewardsUsdValues = this.jarData.rewardTokens.map((tokenAddr, idx) => {
      const decimals = model.tokenDecimals(tokenAddr, jar.chain);
      const price = model.priceOfSync(tokenAddr, jar.chain);
      const total = parseFloat(
        ethers.utils.formatUnits(
          amountsInStrategy[idx].add(amountsPending[idx]),
          decimals,
        ),
      );
      const value = total * price;
      return value;
    });
    const totalUsd = rewardsUsdValues.reduce((cum, cur) => cum + cur, 0);

    return totalUsd;
  }

  async getJarData(jar: JarDefinition, model: PickleModel): Promise<void> {
    // prettier-ignore
    const strategyAbi = ["function gauge() view returns(address)","function getActiveRewardsTokens() view returns (address[])"];
    const multiProvider = model.multiproviderFor(jar.chain);
    const strategyContract = new Contract(
      jar.details.strategyAddr,
      strategyAbi,
    );
    let pricePerToken: number, gauge: string, rewardTokens: string[];
    try {
      [pricePerToken, [gauge, rewardTokens]] = await Promise.all([
        getPoolData(jar, model),
        multiProvider.all([
          strategyContract.gauge(),
          strategyContract.getActiveRewardsTokens(),
        ]),
      ]);
      this.jarData = { pricePerToken, gauge, rewardTokens };
    } catch (err) {
      console.log(err);
      // prettier-ignore
      model.logPlatformError(toError(305000,jar.chain,jar.details.apiKey,"optimism-beetx-jar/getJarData",`Error loading Beethoven jarData (price, gauge, rewardTokens)`,"" + err,ErrorSeverity.ERROR_4,));
    }
  }
}
