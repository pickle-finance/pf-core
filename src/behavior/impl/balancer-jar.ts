import { Provider, TransactionResponse } from "@ethersproject/providers";
import { BigNumber, Contract, ContractTransaction, ethers, Signer } from "ethers";
import strategyAbi from "../../Contracts/ABIs/strategy.json";
import jarAbi from "../../Contracts/ABIs/jar.json";
import { JarHarvestStats, PickleModel } from "../..";
import { HistoricalYield, JarDefinition } from "../../model/PickleModelJson";
import { getBalancerPerformance } from "../../protocols/BalancerUtil";
import { BalancerClaimsManager } from "../../protocols/BalancerUtil/BalancerClaimsManager";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { Prices } from "../../protocols/BalancerUtil/types";
import { ICustomHarvester, PfCoreGasFlags } from "../JarBehaviorResolver";

export abstract class BalancerJar extends AbstractJarBehavior {
  async getProtocolApy(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<HistoricalYield> {
    return await getBalancerPerformance(definition, model);
  }

  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
    resolver: Signer | Provider,
  ): Promise<number> {
    const strategyAddr = jar.details.strategyAddr;
    const prices: Prices = {
      bal: model.priceOfSync("bal"),
      pickle: model.priceOfSync("pickle"),
    };
    try {
      const manager = new BalancerClaimsManager(strategyAddr, resolver, prices);
      await manager.fetchData(model.getDataStore());
      return manager.claimableAmountUsd;
    } catch( error ) {
      console.log(error);
      return 0;
    }
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
          bal: model.priceOfSync("bal"),
          pickle: model.priceOfSync("pickle"),
        };
        const strategyAddr = jar.details.strategyAddr;
        console.log("[" + jar.details.apiKey + "] - Fetching claim data");
        const manager = new BalancerClaimsManager(strategyAddr, signer, prices);
        await manager.fetchData(model.getDataStore());
        console.log("[" + jar.details.apiKey + "] - About to claim distributions");
        const claimTransaction: ContractTransaction =
        await manager.claimDistributions();
        console.log("[" + jar.details.apiKey + "] - Waiting for claim to verify");
        await claimTransaction.wait(3);
        const strategy = new ethers.Contract(
          jar.details.strategyAddr as string,
          strategyAbi,
          signer,
        );
        console.log("[" + jar.details.apiKey + "] - Calling harvest");
        const ret = strategy.harvest(flags);
        console.log("[" + jar.details.apiKey + "] - harvest called, returning result");
        return ret;
      },
    };
  }
}
