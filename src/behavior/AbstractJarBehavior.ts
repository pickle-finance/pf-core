import { BigNumber, ethers, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import erc20Abi from "../Contracts/ABIs/erc20.json";
import {
  AssetAprComponent,
  AssetProjectedApr,
  JarDefinition,
  HistoricalYield,
  SWAP_PROTOCOLS,
} from "../model/PickleModelJson";
import { ICustomHarvester, JarBehavior, JarHarvestStats } from "./JarBehaviorResolver";
import { PickleModel } from "../model/PickleModel";
import { getDepositTokenPrice } from "../price/DepositTokenPriceUtility";
import { GenericSwapUtility } from "../protocols/GenericSwapUtil";
import { getSwapUtilityForProtocol } from "../protocols/ProtocolUtil";

// TODO move these constants out to somewhere better
export const ONE_YEAR_IN_SECONDS: number = 360 * 24 * 60 * 60;

export abstract class AbstractJarBehavior implements JarBehavior {
  getCustomHarvester(_definition: JarDefinition, _model: PickleModel, _signer: ethers.Signer,_properties: unknown): ICustomHarvester | undefined {
    return undefined;
  }
  
  isGenericSwapProtocol(protocol: string): boolean {
    return SWAP_PROTOCOLS.filter((x) => x.toString() === protocol).length > 0;
  }

  async getProtocolApy(
    definition: JarDefinition,
    _model: PickleModel,
  ): Promise<HistoricalYield> {
    if (this.isGenericSwapProtocol(definition.protocol)) {
      const swap: GenericSwapUtility = getSwapUtilityForProtocol(definition);
      if (swap !== undefined) {
        const ret = await swap.runThirtyDaysSingleJar(
          definition.depositToken.addr,
        );
        return ret;
      }
    }
    return undefined;
  }

  async getProjectedAprStats(
    _definition: JarDefinition,
    _model: PickleModel,
  ): Promise<AssetProjectedApr> {
    return undefined;
  }

  // TODO we can eventually get rid of the DepositTokenPriceUtility thingie
  // and put this functionality right here or in the subclasses
  async getDepositTokenPrice(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    if (definition && definition.depositToken && definition.depositToken.addr) {
      const ret = model.priceOfSync(definition.depositToken.addr);
      if (ret !== undefined && ret !== null) {
        return ret;
      }
    }
    return getDepositTokenPrice(definition, model);
  }

  /**
   * All apr components should arrive with percentages as apr values,
   * so for example an APR of 50% should arrive as "50" and not "0.50"
   *
   * All components should arrive post-fee (if applicable).
   * It's best to use  `createAprComponent` for this purpose unless
   * you require custom logic.
   */
  aprComponentsToProjectedApr(
    components: AssetAprComponent[],
  ): AssetProjectedApr {
    return aprComponentsToProjectedAprImpl(components);
  }

  createAprComponent(
    id: string,
    aprPreFee: number,
    compoundable: boolean,
    retainedPercent = 0.8,
  ): AssetAprComponent {
    return createAprComponentImpl(id, aprPreFee, compoundable, retainedPercent);
  }

  async getAssetHarvestData(
    definition: JarDefinition,
    model: PickleModel,
    balance: BigNumber,
    available: BigNumber,
    resolver: Signer | Provider,
  ): Promise<JarHarvestStats> {
    const harvestableUSD: number = await this.getHarvestableUSD(
      definition,
      model,
      resolver,
    );
    const balanceWithAvailable = balance.add(available);
    const depositTokenDecimals = definition.depositToken.decimals
      ? definition.depositToken.decimals
      : 18;
    const depositTokenPrice: number = await model.priceOf(
      definition.depositToken.addr,
    );
    const balanceUSD: number =
      parseFloat(
        ethers.utils.formatUnits(balanceWithAvailable, depositTokenDecimals),
      ) * depositTokenPrice;
    const availUSD: number =
      parseFloat(ethers.utils.formatUnits(available, depositTokenDecimals)) *
      depositTokenPrice;

    return {
      balanceUSD: balanceUSD,
      earnableUSD: availUSD,
      harvestableUSD: harvestableUSD,
    };
  }
  abstract getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
    resolver: Signer | Provider,
  ): Promise<number>;

  async getHarvestableUSDDefaultImplementation(
    jar: JarDefinition,
    model: PickleModel,
    resolver: Signer | Provider,
    rewardTokens: string[],
    strategyAbi: any,
  ): Promise<number> {

    const rewardContracts: ethers.Contract[] = rewardTokens.map((x)=> 
      new ethers.Contract(model.address(x, jar.chain), erc20Abi, resolver));
    const strategyContract = new ethers.Contract(jar.details.strategyAddr, strategyAbi, resolver);

    const promises: Promise<any>[] = [];
    for( let i = 0; i < rewardTokens.length; i++ ) {
      promises.push(rewardContracts[i].balanceOf(jar.details.strategyAddr).catch(() => BigNumber.from("0")));
    }
    promises.push(strategyContract.getHarvestable().catch(() => new Array(rewardTokens.length).fill(BigNumber.from("0"))));

    const results: any[] = await Promise.all(promises);
    const walletBalances = results.slice(0,results.length-1);
    const tmpStrategyHarvestables = results[results.length-1];
    const strategyHarvestables: BigNumber[] = tmpStrategyHarvestables ? [].concat(tmpStrategyHarvestables): [];
    const rewardTokenPrices = rewardTokens.map((x)=>model.priceOfSync(x));
    
    const oneRewardSubtotal = (harvestable: BigNumber, wallet: BigNumber, 
      tokenPrice: number, tokenDecimals: number) : number => {
      const tokens = harvestable.add(wallet);
      const log = Math.log(tokenPrice) / Math.log(10);
      const precisionAdjust = log > 4 ? 0 : 5 - Math.floor(log);
      const precisionAsNumber = Math.pow(10, precisionAdjust);
      const tokenPriceWithPrecision = (tokenPrice * precisionAsNumber).toFixed();
      const resultBN = tokens.mul(tokenPriceWithPrecision).div(precisionAsNumber);
      return parseFloat(ethers.utils.formatUnits(resultBN, tokenDecimals));
    };
    
    let runningTotal = 0;
    for( let i = 0; i < rewardTokens.length; i++ ) {
      runningTotal += (oneRewardSubtotal(strategyHarvestables[i], walletBalances[i], rewardTokenPrices[i], model.tokenDecimals(rewardTokens[i], jar.chain)));
    }
    return runningTotal;
  }

}

/**
 * All apr components should arrive with percentages as apr values,
 * so for example an APR of 50% should arrive as "50" and not "0.50"
 *
 * All components should arrive post-fee (if applicable).
 * It's best to use  `createAprComponent` for this purpose unless
 * you require custom logic.
 */
export function aprComponentsToProjectedAprImpl(
  components: AssetAprComponent[],
): AssetProjectedApr {
  let compoundableApr = 0;
  let nonCompoundableApr = 0;
  for (let i = 0; i < components.length; i++) {
    if (components[i].compoundable) {
      compoundableApr += components[i].apr;
    } else {
      nonCompoundableApr += components[i].apr;
    }
  }
  const totalApr = compoundableApr + nonCompoundableApr;
  const totalApy =
    getCompoundingAPY(compoundableApr / 100) + nonCompoundableApr;
  return {
    components: components,
    apr: totalApr,
    apy: totalApy,
  };
}

export function createAprComponentImpl(
  id: string,
  aprPreFee: number,
  compoundable: boolean,
  retainedPercent = 0.8,
): AssetAprComponent {
  return {
    name: id,
    apr: compoundable ? aprPreFee * retainedPercent : aprPreFee,
    compoundable: compoundable,
  };
}

// TODO move to math utility or something?
export function getCompoundingAPY(apr: number): number {
  return 100 * (Math.pow(1 + apr / 365, 365) - 1);
}
