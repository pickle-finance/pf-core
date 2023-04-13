import { BigNumber, ethers } from "ethers";
import erc20Abi from "../Contracts/ABIs/erc20.json";
import {
  AssetAprComponent,
  AssetProjectedApr,
  JarDefinition,
  HistoricalYield,
  XYK_SWAP_PROTOCOLS,
  PickleAsset,
  AssetEnablement,
} from "../model/PickleModelJson";
import {
  ICustomHarvester,
  JarBehavior,
  JarHarvestStats,
} from "./JarBehaviorResolver";
import { PickleModel, toError } from "../model/PickleModel";
import { getDepositTokenPrice } from "../price/DepositTokenPriceUtility";
import { GenericSwapUtility } from "../protocols/GenericSwapUtil";
import { getSwapUtilityForAsset } from "../protocols/ProtocolUtil";
import { Contract as MultiContract } from "ethers-multiprovider";
import { ErrorSeverity } from "../core/platform/PlatformInterfaces";

// TODO move these constants out to somewhere better
export const ONE_YEAR_IN_SECONDS: number = 360 * 24 * 60 * 60;

export abstract class AbstractJarBehavior implements JarBehavior {
  getCustomHarvester(
    _definition: JarDefinition,
    _model: PickleModel,
    _signer: ethers.Signer,
    _properties: unknown,
  ): ICustomHarvester | undefined {
    return undefined;
  }

  isGenericSwapProtocol(protocol: string): boolean {
    return (
      XYK_SWAP_PROTOCOLS.filter((x) => x.protocol.toString() === protocol)
        .length > 0
    );
  }

  async getProtocolApy(
    definition: JarDefinition,
    _model: PickleModel,
  ): Promise<HistoricalYield> {
    if (this.isGenericSwapProtocol(definition.protocol)) {
      const swap: GenericSwapUtility = getSwapUtilityForAsset(definition);
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
      const ret = model.priceOfSync(
        definition.depositToken.addr,
        definition.chain,
      );
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
  ): Promise<JarHarvestStats> {
    const harvestableUSD: number = await this.getHarvestableUSD(
      definition,
      model,
    );
    const blocked = await this.getIsHarvestBlocked(
      definition,
      model,
      harvestableUSD,
    );
    const depositTokenDecimals = definition.depositToken.decimals
      ? definition.depositToken.decimals
      : 18;
    const depositTokenPrice: number =
      definition.depositToken.price ??
      model.priceOfSync(definition.depositToken.addr, definition.chain);
    const balanceUSD: number =
      parseFloat(ethers.utils.formatUnits(balance, depositTokenDecimals)) *
      depositTokenPrice;
    const availUSD: number =
      parseFloat(ethers.utils.formatUnits(available, depositTokenDecimals)) *
      depositTokenPrice;

    const ret: JarHarvestStats = {
      balanceUSD: balanceUSD,
      earnableUSD: availUSD,
      harvestableUSD: harvestableUSD,
    };
    if (blocked) {
      ret.harvestBlocked = true;
    }
    return ret;
  }

  async getIsHarvestBlocked(
    _jar: JarDefinition,
    _model: PickleModel,
    _harvestableUsd: number,
  ): Promise<boolean> {
    return false;
  }

  abstract getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number>;

  async getHarvestableUSDDefaultImplementation(
    jar: JarDefinition,
    model: PickleModel,
    rewardTokens: string[],
    strategyAbi: any,
  ): Promise<number> {
    const multiProvider = model.multiproviderFor(jar.chain);
    const rewardContracts: MultiContract[] = rewardTokens.map(
      (x) =>
        new MultiContract(model.address(x, jar.chain), erc20Abi, multiProvider),
    );
    let strategyContract: MultiContract;
    try {
      strategyContract = new MultiContract(
        jar.details.strategyAddr,
        strategyAbi,
      );
    } catch (error) {
      // prettier-ignore
      model.logPlatformError(toError(301000,jar.chain,jar.details.apiKey,"getHarvestableUSDComManImplementation","","" + error,ErrorSeverity.ERROR_3));
    }

    const promises: Promise<any>[] = [];
    for (let i = 0; i < rewardTokens.length; i++) {
      promises.push(
        multiProvider
          .all([rewardContracts[i].balanceOf(jar.details.strategyAddr)])
          .then((x) => x[0])
          .catch(() => BigNumber.from("0")),
      );
    }
    promises.push(
      multiProvider
        .all([strategyContract.getHarvestable()])
        .then((x) => x[0])
        .catch(() => new Array(rewardTokens.length).fill(BigNumber.from("0"))),
    );

    const results: any[] = await Promise.all(promises);
    const walletBalances = results.slice(0, results.length - 1);
    const tmpStrategyHarvestables = results[results.length - 1];
    const strategyHarvestables: BigNumber[] = tmpStrategyHarvestables
      ? [].concat(tmpStrategyHarvestables)
      : [];
    const rewardTokenPrices = rewardTokens.map((x) =>
      model.priceOfSync(x, jar.chain),
    );

    let runningTotal = 0;
    for (let i = 0; i < rewardTokens.length; i++) {
      runningTotal += oneRewardSubtotal(
        strategyHarvestables[i],
        walletBalances[i],
        rewardTokenPrices[i],
        model.tokenDecimals(rewardTokens[i], jar.chain),
      );
    }
    return runningTotal;
  }

  /**
   * @description for jars with strategy-v2
   */
  async getHarvestableUSDDefaultImplementationV2(
    jar: JarDefinition,
    model: PickleModel,
    callStatic = false,
  ): Promise<number> {
    // prettier-ignore
    const strategyV2Abi =["function getHarvestable() view returns(address[], uint256[])"]
    const multiProvider = model.multiproviderFor(jar.chain);
    let strategyContract: MultiContract;
    try {
      strategyContract = new MultiContract(
        jar.details.strategyAddr,
        strategyV2Abi,
        multiProvider
      );
    } catch (error) {
      // prettier-ignore
      model.logPlatformError(toError(301000, jar.chain, jar.details.apiKey, "getHarvestableUSDDefaultImplementationV2/strategyContract", 'failed creating strategyContract', '' + error, ErrorSeverity.ERROR_3));
    }

    let rewardTokensAddresses: string[] = jar.rewardTokens.map((token) =>
      model.address(token, jar.chain),
    );

    let stratHarvestables = [rewardTokensAddresses, new Array(rewardTokensAddresses.length).fill(BigNumber.from("0"))];
    try {
      if (callStatic) {
        stratHarvestables = await strategyContract.callStatic.getHarvestableStatic()
      } else {
        const ret = await multiProvider.all([strategyContract.getHarvestable()]);
        stratHarvestables = ret[0];
      }
    } catch (error) {
      // prettier-ignore
      model.logPlatformError(toError(301000, jar.chain, jar.details.apiKey, "getHarvestableUSDDefaultImplementationV2/getHarvestable", 'failed calling getHarvestable on strategy', '' + error, ErrorSeverity.ERROR_3));
    }

    rewardTokensAddresses = stratHarvestables[0].map((token) =>
      model.address(token, jar.chain),
    );

    const promises: Promise<BigNumber>[] = rewardTokensAddresses.map(
      (token) => {
        const tokenContract: MultiContract = new MultiContract(
          model.address(token, jar.chain),
          erc20Abi,
          multiProvider,
        );
        return multiProvider
          .all([tokenContract.balanceOf(jar.details.strategyAddr)])
          .then((x) => x[0])
          .catch(() => BigNumber.from("0"));
      },
    );

    const walletBalances = await Promise.all(promises);
    const strategyHarvestables: BigNumber[] = stratHarvestables
      ? [].concat(stratHarvestables[1])
      : [];
    const rewardTokenPrices = rewardTokensAddresses.map((x) =>
      model.priceOfSync(x, jar.chain),
    );

    const total = rewardTokensAddresses.reduce(
      (cum, _, idx) =>
        cum +
        oneRewardSubtotal(
          strategyHarvestables[idx],
          walletBalances[idx],
          rewardTokenPrices[idx],
          model.tokenDecimals(rewardTokensAddresses[idx], jar.chain),
        ),
      0,
    );
    return total;
  }

  async getHarvestableUSDMasterchefImplementation(
    jar: JarDefinition,
    model: PickleModel,
    rewardTokens: string[],
    masterchefAddr: string,
    rewardsFuncName: string,
    poolId: number,
  ): Promise<number> {
    const mcAbi = [
      {
        inputs: [
          { internalType: "uint256", name: "_pid", type: "uint256" },
          { internalType: "address", name: "_user", type: "address" },
        ],
        name: rewardsFuncName,
        outputs: [
          { internalType: "uint256", name: "pending", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
      },
    ];

    const multiProvider = model.multiproviderFor(jar.chain);
    const rewardContracts: MultiContract[] = rewardTokens.map(
      (x) =>
        new MultiContract(model.address(x, jar.chain), erc20Abi, multiProvider),
    );

    const promises: Promise<any>[] = [];
    for (let i = 0; i < rewardTokens.length; i++) {
      promises.push(
        multiProvider
          .all([rewardContracts[i].balanceOf(jar.details.strategyAddr)])
          .then((x) => x[0])
          .catch(() => BigNumber.from("0")),
      );
    }

    const mcContract = new MultiContract(masterchefAddr, mcAbi);
    promises.push(
      multiProvider
        .all([mcContract[rewardsFuncName](poolId, jar.details.strategyAddr)])
        .then((x) => x[0])
        .catch(() => BigNumber.from("0")),
    );

    const results: any[] = await Promise.all(promises);
    const walletBalances = results.slice(0, results.length - 1);
    const tmpMCHarvestables = results[results.length - 1];
    const masterchefHarvestables: BigNumber[] = tmpMCHarvestables
      ? [].concat(tmpMCHarvestables)
      : [];
    const rewardTokenPrices = rewardTokens.map((x) =>
      model.priceOfSync(x, jar.chain),
    );

    let runningTotal = 0;
    for (let i = 0; i < rewardTokens.length; i++) {
      runningTotal += oneRewardSubtotal(
        masterchefHarvestables[i],
        walletBalances[i],
        rewardTokenPrices[i],
        model.tokenDecimals(rewardTokens[i], jar.chain),
      );
    }
    return runningTotal;
  }
}

export const oneRewardSubtotal = (
  harvestable: BigNumber,
  wallet: BigNumber,
  tokenPrice: number,
  tokenDecimals: number,
): number => {
  const tokens = harvestable.add(wallet);
  const log = Math.log(tokenPrice) / Math.log(10);
  const precisionAdjust = log > 4 ? 0 : 5 - Math.floor(log);
  const precisionAsNumber = Math.pow(10, precisionAdjust);
  const tokenPriceWithPrecision = (tokenPrice * precisionAsNumber).toFixed();
  const resultBN = tokens.mul(tokenPriceWithPrecision).div(precisionAsNumber);
  return parseFloat(ethers.utils.formatUnits(resultBN, tokenDecimals));
};

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

export function isDisabledOrWithdrawOnly(asset: PickleAsset): boolean {
  const arr = [
    AssetEnablement.PERMANENTLY_DISABLED,
    AssetEnablement.DISABLED,
    AssetEnablement.WITHDRAW_ONLY,
  ];
  return arr.includes(asset.enablement);
}
