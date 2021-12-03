import { Provider, TransactionResponse } from "@ethersproject/providers";
import { ContractTransaction, ethers, Signer } from "ethers";
import strategyAbi from '../../Contracts/ABIs/strategy.json';
import { PickleModel } from "../..";
import { HistoricalYield, JarDefinition } from "../../model/PickleModelJson";
import { getBalancerPerformance } from "../../protocols/BalancerUtil";
import { BalancerClaimsManager } from "../../protocols/BalancerUtil/BalancerClaimsManager";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { Prices } from "../../protocols/BalancerUtil/types";
import { ICustomHarvester, PfCoreGasFlags } from "../JarBehaviorResolver";


export abstract class BalancerJar extends AbstractJarBehavior {
  readonly vaultAddress: string;

  constructor(vaultAddress: string) {
    super();
    this.vaultAddress = vaultAddress;
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
    resolver: Signer | Provider,
  ): Promise<number> {
      const strategyAddr = jar.details.strategyAddr;
      const prices: Prices = {
          bal: model.priceOfSync("bal"),
          pickle: model.priceOfSync("pickle"),
      }
    const manager = new BalancerClaimsManager(strategyAddr, resolver, prices);
    await manager.fetchData();
    return manager.claimableAmountUsd;
  }
  async getCustomHarvester(jar: JarDefinition, model: PickleModel, signer: ethers.Signer, _properties: unknown): Promise<ICustomHarvester | undefined> {
    return {
      async harvest(flags: PfCoreGasFlags) : Promise<TransactionResponse> {
        const prices: Prices = {
          bal: model.priceOfSync("bal"),
          pickle: model.priceOfSync("pickle"),
        }
        const strategyAddr = jar.details.strategyAddr;
        const manager = new BalancerClaimsManager(strategyAddr, signer, prices);
        await manager.fetchData();
        const claimTransaction : ContractTransaction = await manager.claimDistributions();
        await claimTransaction.wait(3);
        const strategy = new ethers.Contract(jar.details.strategyAddr as string, strategyAbi, signer);
        return strategy.harvest(flags);
      }
    };
  }
}
