import { Provider } from "@ethersproject/providers";
import {
  Provider as MulticallProvider,
  Contract as MulticallContract,
} from "ethers-multicall";
import { ethers, Signer } from "ethers";
import { Chains, PickleModel } from "../..";
import {
  AssetProjectedApr,
  HistoricalYield,
  JarDefinition,
} from "../../model/PickleModelJson";
import {
  calculateBalPoolAPRs,
  fBeets,
  fBeetsUnderlying,
  getBalancerPerformance,
  getPoolData,
  PoolData,
} from "../../protocols/BeethovenXUtil";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import strategyABI from "../../Contracts/ABIs/strategy.json";

export class BeetXJar extends AbstractJarBehavior {
  protected poolData: PoolData | undefined;

  async getDepositTokenPrice(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    if (!this.poolData) {
      try {
        this.poolData = await getPoolData(jar, model);
        if (jar.depositToken.addr === fBeets) {
          const multicallProvider: MulticallProvider =
            model.multicallProviderFor(jar.chain);
          await multicallProvider.init();
          const fBeetsMulticontract = new MulticallContract(fBeets, erc20Abi);
          const fBeetsUnderlyingMulticontract = new MulticallContract(
            fBeetsUnderlying,
            erc20Abi,
          );
          const [fBeetsTotalSupplyBN, underlyingLocked] =
            await multicallProvider.all([
              fBeetsMulticontract.totalSupply(),
              fBeetsUnderlyingMulticontract.balanceOf(fBeets),
            ]);
          const ratio =
            parseFloat(ethers.utils.formatEther(underlyingLocked)) /
            parseFloat(ethers.utils.formatEther(fBeetsTotalSupplyBN));
          this.poolData.pricePerToken = this.poolData.pricePerToken * ratio;
        }
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
    const res = await calculateBalPoolAPRs(jar, model, this.poolData);
    const aprsPostFee = res.map((component) =>
      this.createAprComponent(
        component.name,
        component.apr,
        component.compoundable,
        1 - Chains.get(jar.chain).defaultPerformanceFee,
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

  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
    resolver: Signer | Provider,
  ): Promise<number> {
    return this.getHarvestableUSDDefaultImplementation(
      jar,
      model,
      resolver,
      ["beets"],
      strategyABI,
    );
  }
}
