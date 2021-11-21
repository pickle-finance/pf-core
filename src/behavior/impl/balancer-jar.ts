import { Provider } from "@ethersproject/providers";
import { ethers, Signer } from "ethers";
import { PickleModel } from "../..";
import { HistoricalYield, JarDefinition } from "../../model/PickleModelJson";
import { getBalancerPerformance } from "../../protocols/BalancerUtil";
import { BalancerClaimsManager } from "../../protocols/BalancerUtil/BalancerClaimsManager";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { Prices } from "../../protocols/BalancerUtil/types";


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
}
