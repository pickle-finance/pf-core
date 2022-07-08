import { TransactionResponse } from "@ethersproject/providers";
import { BigNumber, ContractTransaction, ethers } from "ethers";
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
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { Prices } from "../../protocols/BalancerUtil/types";
import { ICustomHarvester, PfCoreGasFlags, ReturnWithError } from "../JarBehaviorResolver";
import { Contract } from "ethers-multiprovider";
import { toError1 } from "../../model/PickleModel";
import { ErrorSeverity, PickleProduct, PlatformError } from "../../core/platform/PlatformInterfaces";

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
    if (!this.poolData) {
      try {
        this.poolData = await getPoolData(jar, model);
      } catch (error) {
        const msg = `Error in getProjectedAprStats (${jar.details.apiKey}): ${error}`;
        console.log(msg);
        return;
      }
    }
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
  ): Promise<JarHarvestStats> {
    const ret = await super.getAssetHarvestData(
      definition,
      model,
      balance,
      available,
    );
    const multiProvider = model.multiproviderFor(definition.chain);
    const [earnableInJar] = await multiProvider.all([
      new Contract(definition.contract, jarAbi).available(),
    ]);
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
    _jar: JarDefinition,
    _model: PickleModel,
  ): Promise<number> {
    return 0;
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
      async estimateGasToRun(): Promise<ReturnWithError<BigNumber>> {
        const strategy = new ethers.Contract(
          jar.details.strategyAddr as string,
          strategyAbi,
          signer,
        );
        try {
          const bn: BigNumber = await strategy.estimateGas.harvest();
          return { retval:  bn};
        } catch ( error ) {
          const pe: PlatformError = toError1(PickleProduct.TSUKEPFCORE, 302000, jar.chain, jar.details.apiKey,
            'BalancerJar/estimateGasToRun', 'Error estimating Gas', '' + error, ErrorSeverity.ERROR_5 );
          return {
            error: pe
          }

        }
      },
      async run(flags: PfCoreGasFlags): Promise<ReturnWithError<TransactionResponse>> {
        try {
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
        } catch( error ) {
          const pe: PlatformError = toError1(PickleProduct.TSUKEPFCORE, 302100, jar.chain, jar.details.apiKey,
            'BalancerJar/run', 'Error Harvesting', '' + error, ErrorSeverity.ERROR_5 );
          return {
            error: pe
          }
        }
      },
    };
  }
}
