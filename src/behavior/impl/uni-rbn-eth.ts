import { Provider } from "@ethersproject/abstract-provider";
import { Signer } from "@ethersproject/abstract-signer";
import { BigNumber } from "ethers";
import { JarHarvestStats, PickleModel } from "../..";
import { AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import { AprNamePair, calculateUniV3Apy } from "../../protocols/UniV3";
import { AbstractJarBehavior } from "../AbstractJarBehavior";

export class Uni3RbnEth extends AbstractJarBehavior {
    async getDepositTokenPrice(
        definition: JarDefinition,
        model: PickleModel,
      ): Promise<number> {
          const components : string[] = definition.depositToken.components;
          let usd = 0;
          for( let i = 0; i < components.length; i++ ) {
            usd += (definition.depositToken.componentTokens[i] * model.priceOfSync(components[i]));
          }
          let perUnit = usd / definition.depositToken.totalSupply;
          return perUnit;
    }

    async getHarvestableUSD(_jar: JarDefinition, _model: PickleModel,
         _resolver: Signer | Provider): Promise<number> {
        // Do not implement. 
        return 0;
    }
    async getAssetHarvestData(
        _definition: JarDefinition,
        _model: PickleModel,
        _balance: BigNumber,
        _available: BigNumber,
        _resolver: Signer | Provider,
      ): Promise<JarHarvestStats> {
          // TODO This is the thing we need to do
          return {
            balanceUSD: 0,
            earnableUSD: 0,
            harvestableUSD: 0,
          }
    }
    async getProjectedAprStats(
      jar: JarDefinition,
      _model: PickleModel,
    ): Promise<AssetProjectedApr> {
        const ret : AprNamePair = await calculateUniV3Apy(jar.depositToken.addr, jar.chain);
        return  super.aprComponentsToProjectedApr([
            this.createAprComponent(ret.id, ret.apr, true)
        ]);
    }
}  