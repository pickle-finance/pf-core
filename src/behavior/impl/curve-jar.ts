import { BigNumber, ethers } from "ethers";
import { AbstractJarBehavior, ONE_YEAR_IN_SECONDS } from "../AbstractJarBehavior";
import { AssetAprComponent, AssetProjectedApr, HistoricalYield, JarDefinition } from "../../model/PickleModelJson";
import curveGaugeAbi from "../../Contracts/ABIs/curve-gauge.json";
import poolAbi from "../../Contracts/ABIs/pool.json";
import controllerAbi from "../../Contracts/ABIs/gauge-controller.json";
import { Contract } from "ethers-multiprovider";
import { ChainNetwork } from "../../chain/Chains";
import { PickleModel, toError } from "../../model/PickleModel";
import { getCurvePoolData } from "../../protocols/CurveUtil";
import { ErrorSeverity } from "../../core/platform/PlatformInterfaces";

const MAINNET_GAUGE_CONTROLLER_ADDR = "0x2F50D538606Fa9EDD2B11E2446BEb18C9D5846bB";

export abstract class CurveJar extends AbstractJarBehavior {
  readonly gaugeAddress: string;

  constructor(gaugeAddress: string) {
    super();
    this.gaugeAddress = gaugeAddress;
  }

  async getDepositTokenPrice(definition: JarDefinition, model: PickleModel): Promise<number> {
    let tokenPrice: number;
    const poolData = await getCurvePoolData(definition, model);
    if (poolData && poolData.price !== undefined) {
      tokenPrice = poolData.price;
    } else {
      tokenPrice = await super.getDepositTokenPrice(definition, model);
    }
    return tokenPrice;
  }

  async getProtocolApy(definition: JarDefinition, model: PickleModel): Promise<HistoricalYield> {
    const poolData = await getCurvePoolData(definition, model);

    if (poolData && poolData.lpApr !== undefined && poolData.lpApr7d !== undefined) {
      return {
        d1: poolData.lpApr,
        d3: poolData.lpApr,
        d7: poolData.lpApr7d,
        d30: poolData.lpApr7d,
      };
    } else {
      return {
        d1: 0,
        d3: 0,
        d7: 0,
        d30: 0,
      };
    }
  }

  async getHarvestableUSD(jar: JarDefinition, model: PickleModel): Promise<number> {
    return this.getHarvestableUSDDefaultImplementationV2(jar, model, true);
  }

  async getProjectedAprStats(definition: JarDefinition, model: PickleModel): Promise<AssetProjectedApr> {
    const aprComponents: AssetAprComponent[] = [];

    const lpComponent = await this.getLpAprDefaultImpl(definition, model);
    const crvComponent = await this.getCrvAprDefaultImpl(definition, model);
    const extraComponents = await this.getExtraRewardsAprDefaultImpl(definition, model);

    aprComponents.push(lpComponent, crvComponent, ...extraComponents);

    return this.aprComponentsToProjectedApr(aprComponents);
  }

  // From Curve's API
  protected async getLpAprDefaultImpl(definition: JarDefinition, model: PickleModel): Promise<AssetAprComponent> {
    let lpApy = 0;
    const poolData = await getCurvePoolData(definition, model);
    if (poolData) {
      lpApy = poolData.lpApr ?? 0;
    }

    return this.createAprComponent("lp", lpApy, false);
  }

  protected async getCrvAprDefaultImpl(jar: JarDefinition, model: PickleModel): Promise<AssetAprComponent | undefined> {
    const retainedPercent = jar.chain === ChainNetwork.Ethereum ? 0.8 : 0.9;
    const poolData = await getCurvePoolData(jar, model);

    if (poolData && poolData.crvApy !== undefined) {
      return this.createAprComponent("crv", poolData.crvApy, true, retainedPercent);
    }
  }

  protected async getExtraRewardsAprDefaultImpl(jar: JarDefinition, model: PickleModel): Promise<AssetAprComponent[]> {
    const retainedPercent = jar.chain === ChainNetwork.Ethereum ? 0.8 : 0.9;
    const poolData = await getCurvePoolData(jar, model);

    const extraRewardsAprs: AssetAprComponent[] = [];
    if (poolData && poolData.extraRewards && poolData.extraRewards.length) {
      poolData.extraRewards.forEach((reward) => {
        // Check if reward has ended
        const rewardEnds = reward.rewardEnds;
        if (rewardEnds && Date.now() / 1000 > rewardEnds) return;

        const token = model.tokenDetails(reward.tokenAddr, jar.chain);
        if (!token) {
          // prettier-ignore
          model.logPlatformError(toError(305000, jar.chain, jar.details.apiKey, "CurveJar/getExtraRewardsApr", `failed finding reward token ${reward.tokenAddr} details in ExternalTokenModel` , '', ErrorSeverity.ERROR_3));
          return;
        }

        extraRewardsAprs.push(this.createAprComponent(token.id, reward.apy, true, retainedPercent));
      });
    }

    return extraRewardsAprs;
  }

  // On-chain calculations
  protected async getCrvAprMainnetImpl(
    jar: JarDefinition,
    model: PickleModel,
    underlyingPrice: number,
    gauge: string,
    pool: string,
  ): Promise<AssetAprComponent> {
    const retainedPercent = jar.chain === ChainNetwork.Ethereum ? 0.8 : 0.9;
    const multiProvider = model.multiproviderFor(jar.chain);
    const mcGauge = new Contract(gauge, curveGaugeAbi);
    const mcPool = new Contract(pool, poolAbi);
    const ctrlr = new Contract(MAINNET_GAUGE_CONTROLLER_ADDR, controllerAbi);

    const [workingSupply, gaugeRate, virtualPrice, weight] = (
      await multiProvider.all([
        mcGauge.working_supply(),
        mcGauge.inflation_rate(),
        mcPool.get_virtual_price(),
        ctrlr.gauge_relative_weight(gauge),
      ])
    ).map((x) => parseFloat(ethers.utils.formatUnits(x)));

    // https://github.com/curvefi/curve-dao/blob/b7d6d2b6633fd64aa44e80094f6fb5f17f5e771a/src/components/minter/gaugeStore.js#L212
    const rate = (((gaugeRate * weight * 31536000) / workingSupply) * 0.4) / (virtualPrice * underlyingPrice);
    const crvApy = rate * model.priceOfSync("crv", jar.chain) * 100;
    const crvComponent = this.createAprComponent("crv", crvApy, true, retainedPercent);

    return crvComponent;
  }

  protected async getCrvAprArbImpl(
    jar: JarDefinition,
    model: PickleModel,
    swapAddr: string,
    gaugeAddr: string,
    tokensNo: number,
    rewardTokenId = "crv",
  ): Promise<AssetAprComponent> {
    const swap_abi = [
      "function balances(uint256) view returns(uint256)",
      "function get_virtual_price() view returns(uint256)",
      "function coins(uint256) view returns(address)",
    ];
    const gaugeAbi = [
      "function working_supply() view returns(uint256)",
      rewardTokenId == "crv"
        ? "function inflation_rate(uint256) view returns(uint256)"
        : "function inflation_rate() view returns(uint256)",
      "function integrate_inv_supply(uint256) view returns(uint256)",
      "function totalSupply() view returns(uint256)",
    ];
    const retainedPercent = jar.chain === ChainNetwork.Ethereum ? 0.8 : 0.9;

    // Get CRV emission rate
    const multiProvider = model.multiproviderFor(jar.chain);
    const swapContract = new Contract(swapAddr, swap_abi);
    const gaugeContract = new Contract(gaugeAddr, gaugeAbi);

    const secondsInOneWeek = 60 * 60 * 24 * 7;
    const currentWeekEpoch = Math.floor(Date.now() / 1000 / secondsInOneWeek);

    const [totalSupply, workingSupply, gaugeRate]: BigNumber[] = await multiProvider.all([
      gaugeContract.totalSupply(),
      gaugeContract.working_supply(),
      rewardTokenId == "crv" ? gaugeContract.inflation_rate(currentWeekEpoch) : gaugeContract.inflation_rate(),
    ]);

    const rewardTokenDecimals = model.tokenDecimals(rewardTokenId, jar.chain);
    const rewardTokenPrice = model.priceOfSync(rewardTokenId, jar.chain);

    // This assumes no reward boost
    const yearlyRewardRateBN = gaugeRate.mul(ONE_YEAR_IN_SECONDS).mul(totalSupply).mul(40).div(100).div(workingSupply);
    const yearlyRewardRate = parseFloat(ethers.utils.formatUnits(yearlyRewardRateBN, rewardTokenDecimals));

    const rewardValuePerYear = yearlyRewardRate * rewardTokenPrice;

    // Get total pool USD value
    const coinsProm: Promise<string[]> = multiProvider.all(
      Array.from(Array.from(Array(tokensNo).keys()).map((x) => swapContract.coins(x))),
    );
    const balancesProm: Promise<BigNumber[]> = multiProvider.all(
      Array.from(Array.from(Array(tokensNo).keys()).map((x) => swapContract.balances(x))),
    );

    const [tokenAddresses, balancesBN] = await Promise.all([coinsProm, balancesProm]);
    const decimals: number[] = tokenAddresses.map((x) => model.tokenDecimals(x, jar.chain));
    const prices: number[] = tokenAddresses.map((x) => model.priceOfSync(x, jar.chain));

    let totalStakedUsd = 0;
    tokenAddresses.forEach((_, i) => {
      const balance = parseFloat(ethers.utils.formatUnits(balancesBN[i], decimals[i]));
      totalStakedUsd += balance * prices[i];
    });

    const rewardApy = (rewardValuePerYear / totalStakedUsd) * 100;
    const rewardComponent = this.createAprComponent(rewardTokenId, rewardApy, true, retainedPercent);

    return rewardComponent;
  }
}
