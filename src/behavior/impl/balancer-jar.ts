import { Provider, TransactionResponse } from "@ethersproject/providers";
import { BigNumber, ContractTransaction, ethers, Signer } from "ethers";
import strategyAbi from "../../Contracts/ABIs/strategy.json";
import jarAbi from "../../Contracts/ABIs/jar.json";
import { JarHarvestStats, PickleModel } from "../..";
import {
  AssetProjectedApr,
  HistoricalYield,
  JarDefinition,
} from "../../model/PickleModelJson";
import {
  calculateBalPoolAPRs,
  getBalancerPerformance,
  getPoolData,
  PoolData,
} from "../../protocols/BalancerUtil";
import { BalancerClaimsManager } from "../../protocols/BalancerUtil/BalancerClaimsManager";
import { AbstractJarBehavior, oneRewardSubtotal } from "../AbstractJarBehavior";
import { Prices } from "../../protocols/BalancerUtil/types";
import { ICustomHarvester, PfCoreGasFlags } from "../JarBehaviorResolver";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import { Contract as MultiContract } from "ethers-multicall";

const balancerRewardTokens = {
  arbitrum: ["bal", "pickle"],
};

export class BalancerJar extends AbstractJarBehavior {
  poolData: PoolData | undefined;

  async getDepositTokenPrice(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    if (!this.poolData) {
      try {
        this.poolData = await getPoolData(jar, model);
      } catch (error) {
        const msg = `Error in getDepositTokenPrice (${jar.details.apiKey}): ${error}`;
        console.log(msg);
        return 0;
      }
    }

    return this.poolData.pricePerToken;
  }

  async getProjectedAprStats(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    if (!this.poolData) this.poolData = await getPoolData(jar, model);
    const res = await calculateBalPoolAPRs(jar, model);
    const aprsPostFee = res.map((component) =>
      this.createAprComponent(
        component.name,
        component.apr,
        component.compoundable,
      ),
    );
    return this.aprComponentsToProjectedApr(aprsPostFee);
  }

  async getProtocolApy(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<HistoricalYield> {
    return await getBalancerPerformance(definition, model);
  }

  async getAssetHarvestData(
    definition: JarDefinition,
    model: PickleModel,
    balance: BigNumber, // total want balance in strategy+jar
    available: BigNumber, // strategy want balance + jar earnable balance (95% of jar want balance)
    resolver: Signer | Provider,
  ): Promise<JarHarvestStats> {
    const ret = await super.getAssetHarvestData(
      definition,
      model,
      balance,
      available,
      resolver,
    );
    const earnableInJar = await model.callMulti(
      () => new MultiContract(definition.contract, jarAbi).available(),
      definition.chain,
    );
    const depositTokenDecimals = definition.depositToken.decimals
      ? definition.depositToken.decimals
      : 18;
    const depositTokenPrice: number = model.priceOfSync(
      definition.depositToken.addr,
      definition.chain,
    );
    const availUSD: number =
      parseFloat(
        ethers.utils.formatUnits(earnableInJar, depositTokenDecimals),
      ) * depositTokenPrice;
    const less = ret.earnableUSD - availUSD;
    ret.earnableUSD = availUSD;
    ret.balanceUSD = less;
    return ret;
  }

  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
    resolver: Signer | Provider,
  ): Promise<number> {
    const strategyAddr = jar.details.strategyAddr;
    const prices: Prices = {
      bal: model.priceOfSync("bal", jar.chain),
      pickle: model.priceOfSync("pickle", jar.chain),
    };
    let total = 0;
    try {
      const manager = new BalancerClaimsManager(strategyAddr, resolver, prices);
      await manager.fetchData(model.getDataStore());
      total += manager.claimableAmountUsd;
    } catch (error) {
      console.log(error);
    }
    const rewardTokens = balancerRewardTokens[jar.chain];
    const rewardContracts: MultiContract[] = rewardTokens.map(
      (x) => new MultiContract(model.address(x, jar.chain), erc20Abi),
    );

    const promises: Promise<any>[] = [];
    for (let i = 0; i < rewardTokens.length; i++) {
      promises.push(
        model
          .callMulti(
            () => rewardContracts[i].balanceOf(jar.details.strategyAddr),
            jar.chain,
          )
          .catch(() => BigNumber.from("0")),
      );
    }

    const walletBalances: any[] = await Promise.all(promises);
    const rewardTokenPrices = rewardTokens.map((x) =>
      model.priceOfSync(x, jar.chain),
    );

    walletBalances.forEach(
      (walletBalance, i) =>
        (total += oneRewardSubtotal(
          BigNumber.from(0),
          walletBalance,
          rewardTokenPrices[i],
          model.tokenDecimals(rewardTokens[i], jar.chain),
        )),
    );
    return total;
  }

  getCustomHarvester(
    jar: JarDefinition,
    model: PickleModel,
    signer: ethers.Signer,
    properties: { [key: string]: string },
  ): ICustomHarvester | undefined {
    if (properties && properties.action === "harvest") {
      return this.customHarvestRunner(jar, model, signer);
    }
    return undefined;
  }

  customHarvestRunner(
    jar: JarDefinition,
    model: PickleModel,
    signer: ethers.Signer,
  ): ICustomHarvester | undefined {
    return {
      async estimateGasToRun(): Promise<BigNumber | undefined> {
        const strategy = new ethers.Contract(
          jar.details.strategyAddr as string,
          strategyAbi,
          signer,
        );
        return strategy.estimateGas.harvest();
      },
      async run(flags: PfCoreGasFlags): Promise<TransactionResponse> {
        console.log("[" + jar.details.apiKey + "] - Harvesting a balancer jar");
        const prices: Prices = {
          bal: model.priceOfSync("bal", jar.chain),
          pickle: model.priceOfSync("pickle", jar.chain),
        };
        const strategyAddr = jar.details.strategyAddr;
        console.log("[" + jar.details.apiKey + "] - Fetching claim data");
        const manager = new BalancerClaimsManager(strategyAddr, signer, prices);
        await manager.fetchData(model.getDataStore());
        console.log(
          "[" + jar.details.apiKey + "] - About to claim distributions",
        );
        const claimTransaction: ContractTransaction =
          await manager.claimDistributions();
        console.log(
          "[" + jar.details.apiKey + "] - Waiting for claim to verify",
        );
        await claimTransaction.wait(3);
        const strategy = new ethers.Contract(
          jar.details.strategyAddr as string,
          strategyAbi,
          signer,
        );
        console.log("[" + jar.details.apiKey + "] - Calling harvest");
        const ret = strategy.harvest(flags);
        console.log(
          "[" + jar.details.apiKey + "] - harvest called, returning result",
        );
        return ret;
      },
    };
  }
}
