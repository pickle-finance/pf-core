import { Provider } from "@ethersproject/abstract-provider";
import { Signer } from "@ethersproject/abstract-signer";
import {
  Provider as MulticallProvider,
  Contract as MulticallContract,
} from "ethers-multicall";
import { BigNumber } from "@ethersproject/bignumber";
import { ChainNetwork, Chains, PickleModelJson } from "..";
import { getUserJarSummary, IUserEarningsSummary } from "./UserEarnings";
import { NULL_ADDRESS } from "../model/JarsAndFarms";
import erc20Abi from "../Contracts/ABIs/erc20.json";
import gaugeAbi from "../Contracts/ABIs/gauge.json";
import gaugeProxyAbi from "../Contracts/ABIs/gauge-proxy.json";
import minichefAbi from "../Contracts/ABIs/minichef.json";
import brineryAbi from "../Contracts/ABIs/brinery.json";
import {
  AssetEnablement,
  AssetProtocol,
  BrineryDefinition,
  JarDefinition,
} from "../model/PickleModelJson";
import {
  ADDRESSES,
  ConsoleErrorLogger,
  DEBUG_OUT,
  getZeroValueMulticallForChain,
  getZeroValueMulticallForNonErc20,
} from "../model/PickleModel";
import { Contract } from "@ethersproject/contracts";
import {
  Dill,
  Dill__factory,
  Erc20,
  Erc20__factory,
  FeeDistributorV2,
  FeeDistributorV2__factory,
  FeeDistributor,
  FeeDistributor__factory,
} from "../Contracts/ContractsImpl";
import {
  ExternalTokenModelSingleton,
  ExternalToken,
} from "../price/ExternalTokenModel";
import { ChainsConfigs, CommsMgr } from "../util/CommsMgr";
export interface UserTokens {
  [key: string]: UserTokenData;
}

export interface BalanceAllowance {
  balance: string;
  allowance: string;
}

interface SingleRequiredComponentAllowance {
  assetContract: string;
  componentContract: string;
  allowance: string;
}

export interface UserTokenData {
  assetKey: string;
  depositTokenBalance: string;
  componentTokenBalances: { [key: string]: BalanceAllowance };
  pAssetBalance: string;
  jarAllowance: string;
  pStakedBalance: string;
  farmAllowance: string;
  picklePending: string;
}
export interface UserData {
  tokens: UserTokens;
  earnings: IUserEarningsSummary;
  votes: IUserVote[];
  dill: IUserDillStats;
  brineries: UserBrineries;
  pickles: UserPickles;
  errors: string[];
}

export interface UserPickles {
  [key: string]: string;
}

export interface IUserDillStats {
  pickleLocked: string;
  lockEnd: string;
  balance: string;
  claimable: string;
  claimableV2: string;
  claimableETHV2: string;
  totalClaimableTokenV2: string;
  totalClaimableETHV2: string;
  dillApproval: string;
}

export interface UserBrineries {
  [key: string]: UserBrineryData;
}

export interface UserBrineryData {
  assetKey: string;
  depositTokenBalance: string;
  allowance: string;
  claimable: string;
  balance: string;
}

export interface IUserVote {
  farmDepositToken: string;
  weight: string;
}

export interface IUserModelCallback {
  modelUpdated(newest: UserData): Promise<void>;
  modelFinished(newest: UserData): Promise<void>;
}

const emptyUserData = (): UserData => {
  return {
    tokens: {},
    earnings: {
      userId: "",
      earnings: 0,
      jarEarnings: [],
    },
    votes: [],
    dill: {
      pickleLocked: "0",
      lockEnd: "0",
      balance: "0",
      claimable: "0",
      claimableV2: "0",
      claimableETHV2: "0",
      totalClaimableTokenV2: "0",
      totalClaimableETHV2: "0",
      dillApproval: "0",
    },
    brineries: {},
    pickles: {
      dillApproval: "0",
    },
    errors: [],
  };
};

export class UserModel implements ConsoleErrorLogger {
  model: PickleModelJson.PickleModelJson;
  callback: IUserModelCallback | undefined;
  walletId: string;
  workingData: UserData;
  configuredChains: ChainNetwork[];
  commsMgr: CommsMgr;
  constructor(
    model: PickleModelJson.PickleModelJson,
    walletId: string,
    rpcs: Map<ChainNetwork, Provider | Signer>,
    callback?: IUserModelCallback,
  ) {
    if (callback) {
      this.callback = callback;
    }
    this.workingData = emptyUserData();
    this.workingData.earnings.userId = this.walletId;
    this.model = model;
    this.walletId = walletId;
    Chains.globalInitialize(rpcs);
    this.configuredChains = Chains.list();
  }
  logError(where: string, error: any, context?: any): void {
    this.logUserModelError(where + ":" + (context || "unknown"), error);
  }

  async sendUpdate(): Promise<void> {
    if (this.callback !== undefined) {
      this.callback.modelUpdated(this.workingData);
    }
  }

  async initCommsMgr(): Promise<void> {
    const CHAINS_CONFIGS: ChainsConfigs = {
      default: { secondsBetweenCalls: 0.5, callsPerMulticall: 80 },
    };
    this.commsMgr = new CommsMgr(this, CHAINS_CONFIGS);
    await this.commsMgr.configureRPCs(Chains.list());
    this.commsMgr.start();
  }

  async generateUserModel(): Promise<UserData> {
    await this.initCommsMgr();
    try {
      await Promise.all([
        this.getUserTokens(),
        this.getUserEarningsSummary(),
        this.getUserGaugeVotesGuard(),
        this.getUserDillStatsGuard(),
        this.getUserBrineryStatsGuard(),
        this.getUserPickles(),
      ]);
      if (this.callback !== undefined) {
        this.callback.modelFinished(this.workingData);
      }
      return this.workingData;
    } finally {
      this.commsMgr.stop();
    }
  }

  async generateMinimalModel(): Promise<UserData> {
    await this.initCommsMgr();
    try {
      await Promise.all([this.getUserTokens(), this.getUserEarningsSummary(), this.getUserDillStatsGuard()]);
      if (this.callback !== undefined) {
        this.callback.modelFinished(this.workingData);
      }
      return this.workingData;
    } finally {
      this.commsMgr.stop();
    }
  }

  getChainsToRun(): ChainNetwork[] {
    return this.configuredChains;
  }
  setChainsToRun(chains: ChainNetwork[]): void {
    this.configuredChains = chains;
  }

  async getUserPickles(): Promise<UserPickles> {
    DEBUG_OUT("Begin getUserPickles");
    const start = Date.now();
    try {
      const ret: UserPickles = {};
      await Promise.all(
        this.getChainsToRun().map(async (x) => {
          try {
            let r: BigNumber = BigNumber.from(0);
            const s: BigNumber = BigNumber.from(0);
            if (
              ADDRESSES.get(x) &&
              ADDRESSES.get(x).pickle !== undefined &&
              ADDRESSES.get(x).pickle !== NULL_ADDRESS
            ) {
              const contract = new Contract(
                ADDRESSES.get(x).pickle,
                erc20Abi,
                this.providerFor(x),
              );
              r = await contract
                .balanceOf(this.walletId)
                .catch(() => BigNumber.from("0"));
            }
            this.workingData.pickles[x.toString()] = r.toString();
            ret[x.toString()] = r.toString();
            this.sendUpdate();
          } catch (err) {
            this.logUserModelError(
              "loading user pickles on chain " + x,
              "" + err,
            );
            this.sendUpdate();
          }
        }),
      );
      this.workingData.pickles = ret;
      this.sendUpdate();
      DEBUG_OUT("End getUserPickles: " + (Date.now() - start));
      return ret;
    } catch (err) {
      this.logUserModelError("loading user pickles", "" + err);
      this.sendUpdate();
      DEBUG_OUT("End getUserPickles: " + (Date.now() - start));
      return {};
    }
  }

  async getUserTokens(): Promise<UserTokens> {
    DEBUG_OUT("Begin getUserTokens");
    const start = Date.now();
    try {
      const ret: UserTokens = {};
      const result = await Promise.all(
        this.getChainsToRun().map((x) => this.getUserTokensSingleChainGuard(x)),
      );
      for (let i = 0; i < result.length; i++) {
        const chainArr: UserTokenData[] = result[i];
        for (let j = 0; j < chainArr.length; j++) {
          const assetKey = chainArr[j].assetKey.toLowerCase();
          ret[assetKey] = chainArr[j];
        }
      }
      this.workingData.tokens = ret;
      this.sendUpdate();
      DEBUG_OUT("End getUserTokens: " + (Date.now() - start));
      return ret;
    } catch (err) {
      this.logUserModelError("getUserTokens", "" + err);
      this.sendUpdate();
      DEBUG_OUT("End getUserTokens: " + (Date.now() - start));
      return {};
    }
  }

  isErc20Underlying(asset: JarDefinition): boolean {
    return (
      asset.depositToken.style === undefined ||
      asset.depositToken.style.erc20 === true
    );
  }

  async getUserTokensSingleChainGuard(
    chain: ChainNetwork,
  ): Promise<UserTokenData[]> {
    try {
      const res: UserTokenData[] = await this.getUserTokensSingleChain(chain);
      for (let j = 0; j < res.length; j++) {
        const assetKey = res[j].assetKey.toLowerCase();
        this.workingData.tokens[assetKey] = res[j];
      }
      this.sendUpdate();
      return res;
    } catch (error) {
      this.logUserModelError(
        "Loading user tokens on chain " + chain,
        "" + error,
      );
      this.sendUpdate();
      return [];
    }
  }

  async getUserTokensSingleChain(
    chain: ChainNetwork,
  ): Promise<UserTokenData[]> {
    const ret = [];
    const chainAssets = this.model.assets.jars.filter(
      (x) =>
        x.chain === chain &&
        x.enablement !== AssetEnablement.PERMANENTLY_DISABLED,
    );

    if (chainAssets.length === 0) {
      return [];
    }

    const allChainTokens: ExternalToken[] =
      ExternalTokenModelSingleton.getAllTokens().filter(
        (x) => x.chain === chain,
      );

    const depositTokenBalancesPromise: Promise<BigNumber[]> = this.callMulti(
      chainAssets.flatMap((x) => () => {
        DEBUG_OUT("start depositTokenBalancesPromise for " + x.details.apiKey);
        const erc20Guard = getZeroValueMulticallForNonErc20(x);
        if (erc20Guard) {
          return erc20Guard;
        }
        if (x.protocol === AssetProtocol.UNISWAP_V3) {
          const mcContract0 = new MulticallContract(
            this.model.tokens.find(
              (token) =>
                token.chain === chain &&
                token.id === x.depositToken.components?.[0],
            ).contractAddr,
            erc20Abi,
          );
          const mcContract1 = new MulticallContract(
            this.model.tokens.find(
              (token) =>
                token.chain === chain &&
                token.id === x.depositToken.components?.[1],
            ).contractAddr,
            erc20Abi,
          );

          console.log(
            this.model.tokens.find(
              (token) =>
                token.chain === chain &&
                token.id === x.depositToken.components?.[1],
            ),
          );
          return [
            mcContract0.balanceOf(this.walletId),
            mcContract1.balanceOf(this.walletId),
          ];
        }
        const mcContract = new MulticallContract(x.depositToken.addr, erc20Abi);
        const rval = mcContract.balanceOf(this.walletId);
        return rval;
      }),
      chain,
    );

    const userAllowanceOfChainTokensPromise: Promise<
      SingleRequiredComponentAllowance[]
    > = this.getRequiredComponentTokenAllowances(
      chain,
      chainAssets,
      allChainTokens,
    );

    const pTokenBalancesPromise: Promise<BigNumber[]> = this.callMulti(
      chainAssets.map((x) => () => {
        DEBUG_OUT("start pTokenBalancesPromise for " + x.details.apiKey);

        const mcContract = new MulticallContract(x.contract, erc20Abi);
        return mcContract.balanceOf(this.walletId);
      }),
      chain,
    );

    const jarAllowancePromise: Promise<BigNumber[]> = this.callMulti(
      chainAssets.map((x) => () => {
        DEBUG_OUT("start jarAllowancePromise for " + x.details.apiKey);
        const erc20Guard = getZeroValueMulticallForNonErc20(x);
        if (erc20Guard) return erc20Guard;
        const mcContract = new MulticallContract(x.depositToken.addr, erc20Abi);
        return mcContract.allowance(this.walletId, x.contract);
      }),
      chain,
    );

    const farmAllowancePromise: Promise<BigNumber[]> = this.callMulti(
      chainAssets.map((x) => () => {
        if (x.farm && x.farm.farmAddress) {
          const mcContract = new MulticallContract(x.contract, erc20Abi);
          return mcContract.allowance(this.walletId, x.farm.farmAddress);
        } else {
          return getZeroValueMulticallForChain(x.chain);
        }
      }),
      chain,
    );

    let stakedAndPendingPromise: Promise<StakedAndPendingRet> = undefined;
    if (chain === ChainNetwork.Ethereum) {
      stakedAndPendingPromise = this.getStakedAndPendingFarmEth(
        chain,
        chainAssets,
      );
    } else {
      stakedAndPendingPromise = this.getStakedAndPendingMinichef(
        chain,
        chainAssets,
      );
    }

    const userBalanceOfChainTokensPromise: Promise<BigNumber[]> =
      this.callMulti(
        allChainTokens.map(
          (x) => () =>
            new MulticallContract(x.contractAddr, erc20Abi).balanceOf(
              this.walletId,
            ),
        ),
        chain,
      );

    let depositTokenBalances = [];
    let userBalanceOfChainTokens = [];
    let userAllowanceOfChainTokens: SingleRequiredComponentAllowance[] = [];
    let pTokenBalances = [];
    let stakedInFarm = [];
    let picklePending = [];
    let jarAllowance = [];
    let farmAllowance = [];
    try {
      depositTokenBalances = await depositTokenBalancesPromise;
    } catch (error) {
      this.logUserModelError(
        "Loading deposit token balances on chain " + chain,
        "" + error,
      );
      depositTokenBalances = [];
    }
    try {
      userBalanceOfChainTokens = await userBalanceOfChainTokensPromise;
    } catch (error) {
      this.logUserModelError(
        "Loading user Balance Of Chain Tokens on chain " + chain,
        "" + error,
      );
      userBalanceOfChainTokens = [];
    }
    try {
      userAllowanceOfChainTokens = await userAllowanceOfChainTokensPromise;
    } catch (error) {
      this.logUserModelError(
        "Loading user Balance Of Component Tokens on chain " + chain,
        "" + error,
      );
      userAllowanceOfChainTokens = [];
    }

    try {
      DEBUG_OUT("Initializing ptoken balances");
      pTokenBalances = await pTokenBalancesPromise;
      DEBUG_OUT(
        "Finished Initializing ptoken balances: " +
        JSON.stringify(pTokenBalances),
      );
    } catch (error) {
      this.logUserModelError(
        "Loading ptoken balances on chain " + chain,
        "" + error,
      );
      pTokenBalances = [];
    }
    try {
      stakedInFarm = (await stakedAndPendingPromise).staked;
    } catch (error) {
      this.logUserModelError(
        "Loading staked ptoken balances on chain " + chain,
        "" + error,
      );
      stakedInFarm = [];
    }
    try {
      picklePending = (await stakedAndPendingPromise).pending;
    } catch (error) {
      this.logUserModelError(
        "Loading pending pickles on chain " + chain,
        "" + error,
      );
      picklePending = [];
    }
    try {
      jarAllowance = await jarAllowancePromise;
    } catch (error) {
      this.logUserModelError(
        "Loading deposit token allowances on chain " + chain,
        "" + error,
      );
      jarAllowance = [];
    }
    try {
      farmAllowance = await farmAllowancePromise;
    } catch (error) {
      this.logUserModelError(
        "Loading ptoken allowances on chain " + chain,
        "" + error,
      );
      farmAllowance = [];
    }
    for (let j = 0; j < chainAssets.length; j++) {
      DEBUG_OUT(
        "Creating usertoken data " + j + " " + chainAssets[j].details.apiKey,
      );
      const toAdd: UserTokenData = {
        assetKey: chainAssets[j].details.apiKey,
        depositTokenBalance: depositTokenBalances[j]?.toString() || "0",
        componentTokenBalances: this.getComponentTokensForJar(
          chainAssets[j],
          allChainTokens,
          userBalanceOfChainTokens,
          userAllowanceOfChainTokens,
        ),
        pAssetBalance: pTokenBalances[j]?.toString() || "0",
        pStakedBalance: stakedInFarm[j]?.toString() || "0",
        picklePending: picklePending[j]?.toString() || "0",
        jarAllowance: jarAllowance[j]?.toString() || "0",
        farmAllowance: farmAllowance[j]?.toString() || "0",
      };
      const hasComponentTokenBalances: boolean =
        Object.keys(toAdd.componentTokenBalances).find(
          (x) =>
            toAdd.componentTokenBalances[x] != undefined &&
            toAdd.componentTokenBalances[x].balance !== "0",
        ) != undefined;
      const allZeros: boolean =
        toAdd.depositTokenBalance === "0" &&
        toAdd.pAssetBalance === "0" &&
        toAdd.pStakedBalance === "0" &&
        toAdd.picklePending === "0" &&
        toAdd.jarAllowance === "0" &&
        toAdd.farmAllowance === "0" &&
        // Allowances are irrelevant so we're not including them
        !hasComponentTokenBalances;

      if (!allZeros) ret.push(toAdd);
    }
    return ret;
  }

  getComponentTokensForJar(
    jar: JarDefinition,
    chainTokens: ExternalToken[],
    userTokenBalances: BigNumber[],
    userTokenAllowances: SingleRequiredComponentAllowance[],
  ): { [key: string]: BalanceAllowance } {
    const ret: { [key: string]: BalanceAllowance } = {};
    const components = jar.depositToken.components || [];
    for (let i = 0; i < components.length; i++) {
      let tokenBal: BigNumber | undefined = undefined;
      const foundToken: ExternalToken | undefined = chainTokens.find(
        (x) => x.id === components[i],
      );
      for (let j = 0; !tokenBal && j < chainTokens.length; j++) {
        if (chainTokens[j].id === components[i]) {
          tokenBal =
            j < userTokenBalances.length - 1
              ? userTokenBalances[j]
              : BigNumber.from(0);
        }
      }
      const tokenAllowObj: SingleRequiredComponentAllowance | undefined =
        userTokenAllowances.find(
          (x) =>
            foundToken &&
            x.assetContract === jar.contract &&
            foundToken.contractAddr.toLowerCase() ===
            x.componentContract.toLowerCase(),
        );

      const bal = (tokenBal || BigNumber.from(0)).toString();
      const allow = (
        tokenAllowObj ? tokenAllowObj.allowance : BigNumber.from(0)
      ).toString();

      ret[components[i]] = { balance: bal, allowance: allow };
    }
    return ret;
  }

  async getRequiredComponentTokenAllowances(
    chain: ChainNetwork,
    chainAssets: JarDefinition[],
    allChainTokens: ExternalToken[],
  ): Promise<SingleRequiredComponentAllowance[]> {
    const requiredComponentAllowances: SingleRequiredComponentAllowance[] = [];
    const uni3Assets = chainAssets.filter(
      (x) => x.protocol === AssetProtocol.UNISWAP_V3,
    );
    for (let i = 0; i < uni3Assets.length; i++) {
      const assetContract = uni3Assets[i].contract;
      const components = uni3Assets[i].depositToken.components || [];
      for (let j = 0; j < components.length; j++) {
        const token = allChainTokens.find((x) => x.id === components[j]);
        if (token) {
          requiredComponentAllowances.push({
            assetContract: assetContract,
            componentContract: token.contractAddr,
            allowance: "0",
          });
        }
      }
    }
    const userAllowanceOfChainTokensPromise: Promise<BigNumber[]> =
      this.callMulti(
        requiredComponentAllowances.map(
          (x) => () =>
            new MulticallContract(x.componentContract, erc20Abi).allowance(
              this.walletId,
              x.assetContract,
            ),
        ),
        chain,
      );

    try {
      const asBigNumberArray: BigNumber[] =
        await userAllowanceOfChainTokensPromise;
      for (let i = 0; i < requiredComponentAllowances.length; i++) {
        requiredComponentAllowances[i].allowance =
          asBigNumberArray[i].toString();
      }
    } catch (err) {
      this.logUserModelError(
        "Loading component allowances on chain " + chain,
        "" + err,
      );
    }
    return requiredComponentAllowances;
  }

  async getStakedAndPendingMinichef(
    chain: ChainNetwork,
    chainAssets: PickleModelJson.JarDefinition[],
  ): Promise<StakedAndPendingRet> {
    const chef = ADDRESSES.get(chain).minichef;
    const skip: boolean =
      chef === null || chef === undefined || chef === NULL_ADDRESS;
    if (skip) {
      const stakedInFarmPromise = Promise.resolve(
        chainAssets.map(() => BigNumber.from(0)),
      );
      const picklePendingPromise = Promise.resolve(
        chainAssets.map(() => BigNumber.from(0)),
      );
      return {
        staked: await stakedInFarmPromise,
        pending: await picklePendingPromise,
      };
    } else {
      const poolLengthBN: BigNumber = skip
        ? BigNumber.from(0)
        : await new Contract(
          chef,
          minichefAbi,
          this.providerFor(chain),
        ).poolLength();
      const poolLength = parseFloat(poolLengthBN.toString());
      const poolIds: number[] = Array.from(Array(poolLength).keys());
      const miniChefMulticall: MulticallContract = new MulticallContract(
        chef,
        minichefAbi,
      );
      const lpTokens: string[] = await this.callMulti(
        poolIds.map((id) => () => {
          return miniChefMulticall.lpToken(id);
        }),
        chain,
      );
      const lpLower: string[] = lpTokens.map((x) => x.toLowerCase());
      const stakedInFarmPromise = this.getStakedInFarmMinichef(
        chain,
        chainAssets,
        poolIds,
        lpLower,
      );
      const picklePendingPromise = this.getPicklePendingMinichef(
        chain,
        chainAssets,
        poolIds,
        lpLower,
      );
      return {
        staked: await stakedInFarmPromise,
        pending: await picklePendingPromise,
      };
    }
  }

  async getStakedAndPendingFarmEth(
    chain: ChainNetwork,
    chainAssets: JarDefinition[],
  ): Promise<StakedAndPendingRet> {
    return {
      staked: await this.getStakedInFarmEth(chain, chainAssets),
      pending: await this.getPicklePendingEth(chain, chainAssets),
    };
  }
  async getStakedInFarmEth(
    chain: ChainNetwork,
    chainAssets: JarDefinition[],
  ): Promise<BigNumber[]> {
    const filteredChainAssets = chainAssets.filter(
      (x) => x.farm && x.farm.farmAddress,
    );
    const stakedBalances: BigNumber[] = await this.callMulti(
      filteredChainAssets.map((x) => () => {
        const mcContract = new MulticallContract(x.farm.farmAddress, gaugeAbi);
        return mcContract.balanceOf(this.walletId);
      }),
      chain,
    );

    // return an array with the same indexes as in the input jar
    // since we filtered them, they don't exactly match up right now
    return this.normalizeIndexes(
      chainAssets,
      filteredChainAssets,
      stakedBalances,
      BigNumber.from(0),
    );
  }

  async getStakedInFarmMinichef(
    chain: ChainNetwork,
    chainAssets: JarDefinition[],
    poolIds: number[],
    lpLower: string[],
  ): Promise<BigNumber[]> {
    const chef = ADDRESSES.get(chain).minichef;
    const miniChefMulticall: MulticallContract = new MulticallContract(
      chef,
      minichefAbi,
    );
    const userInfos: any[] = await this.callMulti(
      poolIds.map((id) => () => {
        return miniChefMulticall.userInfo(id, this.walletId);
      }),
      chain,
    );
    const ret: BigNumber[] = [];
    for (let i = 0; i < chainAssets.length; i++) {
      const ind: number = lpLower.indexOf(
        chainAssets[i].contract.toLowerCase(),
      );
      if (ind === -1) {
        ret.push(BigNumber.from(0));
      } else {
        ret.push(userInfos[ind][0].toString());
      }
    }
    return ret;
  }

  async getPicklePendingEth(
    chain: ChainNetwork,
    chainAssets: JarDefinition[],
  ): Promise<BigNumber[]> {
    const filteredChainAssets = chainAssets.filter(
      (x) => x.farm && x.farm.farmAddress,
    );
    const pending: BigNumber[] = await this.callMulti(
      filteredChainAssets.map((x) => () => {
        const mcContract = new MulticallContract(x.farm.farmAddress, gaugeAbi);
        return mcContract.earned(this.walletId);
      }),
      chain,
    );

    // return an array with the same indexes as in the input jar
    // since we filtered them, they don't exactly match up right now
    return this.normalizeIndexes(
      chainAssets,
      filteredChainAssets,
      pending,
      BigNumber.from(0),
    );
  }

  async getPicklePendingMinichef(
    chain: ChainNetwork,
    chainAssets: JarDefinition[],
    poolIds: number[],
    lpLower: string[],
  ): Promise<BigNumber[]> {
    const chef = ADDRESSES.get(chain).minichef;
    const miniChefMulticall: MulticallContract = new MulticallContract(
      chef,
      minichefAbi,
    );
    const picklePending: BigNumber[] = await this.callMulti(
      poolIds.map((id) => () => {
        return miniChefMulticall.pendingPickle(id, this.walletId);
      }),
      chain,
    );
    const ret: BigNumber[] = [];
    for (let i = 0; i < chainAssets.length; i++) {
      const ind: number = lpLower.indexOf(
        chainAssets[i].contract.toLowerCase(),
      );
      if (ind === -1) {
        ret.push(BigNumber.from(0));
      } else {
        ret.push(picklePending[ind]);
      }
    }
    return ret;
  }

  async getUserGaugeVotesGuard(): Promise<IUserVote[]> {
    DEBUG_OUT("Begin getUserGaugeVotesGuard");
    const start = Date.now();
    try {
      const r = await this.getUserGaugeVotes();
      this.workingData.votes = r;
      this.sendUpdate();
      DEBUG_OUT("End getUserGaugeVotesGuard: " + (Date.now() - start));
      return r;
    } catch (error) {
      this.logUserModelError("Loading user votes", "" + error);
      this.sendUpdate();
      DEBUG_OUT("End getUserGaugeVotesGuard: " + (Date.now() - start));
      return [];
    }
  }
  async getUserGaugeVotes(): Promise<IUserVote[]> {
    const gaugeProxy = ADDRESSES.get(ChainNetwork.Ethereum).gaugeProxy;
    const gaugeProxyContract = new Contract(
      gaugeProxy,
      gaugeProxyAbi,
      this.providerFor(ChainNetwork.Ethereum),
    );
    const eligibleTokens: string[] = await gaugeProxyContract.tokens();
    const gaugeProxyMC = new MulticallContract(gaugeProxy, gaugeProxyAbi);
    const userVotes: BigNumber[] = await this.callMulti(
      eligibleTokens.map((x) => () => {
        return gaugeProxyMC.votes(this.walletId, x);
      }),
      ChainNetwork.Ethereum,
    );
    const ret: IUserVote[] = [];
    for (let i = 0; i < userVotes.length; i++) {
      const voteString = userVotes[i].toString();
      if (voteString !== BigNumber.from(0).toString())
        ret.push({ farmDepositToken: eligibleTokens[i], weight: voteString });
    }
    return ret;
  }

  async getUserEarningsSummary(): Promise<IUserEarningsSummary> {
    DEBUG_OUT("Begin getUserEarningsSummary");
    const start = Date.now();
    try {
      const r = await getUserJarSummary(
        this.walletId.toLowerCase(),
        this.model,
      );
      this.workingData.earnings = r;
      this.sendUpdate();
      DEBUG_OUT("End getUserEarningsSummary: " + (Date.now() - start));
      return r;
    } catch (error) {
      this.logUserModelError("getUserEarningsSummary", "" + error);
      this.sendUpdate();
      DEBUG_OUT("End getUserEarningsSummary: " + (Date.now() - start));
      return {
        userId: this.walletId,
        earnings: 0,
        jarEarnings: [],
      };
    }
  }

  logUserModelError = (context: string, err: string): void => {
    const msg = "Error [" + context + "] " + err;
    console.log(msg);
    this.workingData.errors.push(msg);
  };

  async getUserDillStatsGuard(): Promise<IUserDillStats> {
    DEBUG_OUT("Begin getUserDillStatsGuard");
    const start = Date.now();
    try {
      const r = await this.getUserDillStats();
      this.workingData.dill = r;
      this.sendUpdate();
      DEBUG_OUT("End getUserDillStatsGuard: " + (Date.now() - start));
      return r;
    } catch (error) {
      this.logUserModelError("in getUserDillStats", "" + error);
      this.sendUpdate();
      DEBUG_OUT("End getUserDillStatsGuard: " + (Date.now() - start));
      return {
        pickleLocked: "0",
        lockEnd: "0",
        balance: "0",
        claimable: "0",
        claimableV2: "0",
        claimableETHV2: "0",
        totalClaimableTokenV2: "0",
        totalClaimableETHV2: "0",
        dillApproval: "0",
      };
    }
  }
  async getUserDillStats(): Promise<IUserDillStats> {
    const dillContractAddr: string = ADDRESSES.get(ChainNetwork.Ethereum).dill;
    const feeDistributorAddrV2: string = ADDRESSES.get(
      ChainNetwork.Ethereum,
    ).feeDistributorV2;
    const feeDistributorAddr: string = ADDRESSES.get(
      ChainNetwork.Ethereum,
    ).feeDistributor;
    const dillContract: Dill = Dill__factory.connect(
      dillContractAddr,
      this.providerFor(ChainNetwork.Ethereum),
    );
    const feeDistributorContract: FeeDistributor = FeeDistributor__factory.connect(
      feeDistributorAddr,
      this.providerFor(ChainNetwork.Ethereum),
    );
    const feeDistributorContractV2: FeeDistributorV2 = FeeDistributorV2__factory.connect(
      feeDistributorAddrV2,
      this.providerFor(ChainNetwork.Ethereum),
    );

    const pickleContract: Erc20 = Erc20__factory.connect(
      ADDRESSES.get(ChainNetwork.Ethereum).pickle,
      this.providerFor(ChainNetwork.Ethereum),
    );

    const [lockStats, balance, claimable, userClaimable, allowance, totalClaimable] = await Promise.all([
      dillContract.locked(this.walletId, { gasLimit: 1000000 }),
      dillContract["balanceOf(address)"](this.walletId, { gasLimit: 1000000 }),
      feeDistributorContract.callStatic["claim(address)"](this.walletId, {
        gasLimit: 1000000,
      }),
      feeDistributorContractV2.callStatic["claim(address)"](this.walletId, {
        gasLimit: 1000000,
      }),
      pickleContract.allowance(this.walletId, dillContractAddr),
      feeDistributorContractV2.callStatic["claim_all(address)"](this.walletId, {
        gasLimit: 9000000,
      }).catch((err) => {
        this.logUserModelError("in getUserDillStats: total claimable", "" + err);
        return [0, 0]
      })
    ]);

    // To handle edge case if totalCLaimable call fails
    let totalClaimableV2 = totalClaimable;
    if (userClaimable[0].gt(0) && totalClaimableV2[0] === 0) {
      totalClaimableV2 = userClaimable;
    }

    return {
      pickleLocked: lockStats[0].toString(),
      lockEnd: lockStats[1].toString(),
      balance: balance.toString(),
      claimable: claimable.toString(),
      claimableV2: userClaimable[0].toString(),
      claimableETHV2: userClaimable[1].toString(),
      totalClaimableTokenV2: totalClaimableV2[0].toString(),
      totalClaimableETHV2: totalClaimableV2[1].toString(),
      dillApproval: allowance.toString(),
    };
  }

  async getUserBrineryStats(): Promise<UserBrineryData[]> {
    const brineries = this.model.assets.brineries;
    const userBrineries = await Promise.all(
      brineries.map(
        async (asset: BrineryDefinition): Promise<UserBrineryData> => {
          const mcBrineryContract = new MulticallContract(
            asset.contract,
            brineryAbi,
          );

          const mcDepositToken = new MulticallContract(
            asset.depositToken.addr,
            erc20Abi,
          );
          const [userPendingBN, userBalanceBN] = await this.callMulti(
            [
              () => mcBrineryContract.claimable(this.walletId),
              () => mcBrineryContract.balanceOf(this.walletId),
              () => mcBrineryContract.index(),
              () => mcBrineryContract.supplyIndex(this.walletId),
              () => mcDepositToken.balanceOf(this.walletId),
              () => mcDepositToken.allowance(this.walletId, asset.contract),
            ],
            asset.chain,
          );

          const [userDepositBalanceBN, userBrineryAllowanceBN] =
            await this.callMulti(
              [
                () => mcDepositToken.balanceOf(this.walletId),
                () => mcDepositToken.allowance(this.walletId, asset.contract),
              ],
              asset.chain,
            );

          const pickleLockedUnderlying =
            asset.details.pickleLockedUnderlying || 1;
          const distributorPending = asset.details.distributorPending || 0;

          const userTotalPending = userPendingBN.add(
            BigNumber.from((distributorPending * 1e6).toFixed())
              .mul(userBalanceBN)
              .div(BigNumber.from((pickleLockedUnderlying * 1e6).toFixed())),
          );

          return {
            assetKey: asset.details.apiKey,
            claimable: userTotalPending.toString(),
            balance: userBalanceBN.toString(),
            depositTokenBalance: userDepositBalanceBN.toString(),
            allowance: userBrineryAllowanceBN.toString(),
          };
        },
      ),
    );
    return userBrineries;
  }

  async getUserBrineryStatsGuard(): Promise<UserBrineries> {
    DEBUG_OUT("Begin getUserBrineryStatsGuard");
    const start = Date.now();
    try {
      const ret: UserBrineries = {};
      const r = await this.getUserBrineryStats();
      for (let i = 0; i < r.length; i++) {
        const assetKey = r[i].assetKey.toLowerCase();
        ret[assetKey] = r[i];
      }
      this.workingData.brineries = ret;
      this.sendUpdate();
      DEBUG_OUT("End getUserBrineryStatsGuard: " + (Date.now() - start));
      return ret;
    } catch (error) {
      this.logUserModelError("in getUserBrineryStats", "" + error);
      this.sendUpdate();
      DEBUG_OUT("End getUserBrineryStatsGuard: " + (Date.now() - start));
      return {};
    }
  }

  normalizeIndexes(
    original: JarDefinition[],
    filtered: JarDefinition[],
    results: any[],
    def: any,
  ): any[] {
    let destIndex = 0;
    const retval = [];
    for (let sourceIndex = 0; sourceIndex < original.length; sourceIndex++) {
      if (original[sourceIndex] === filtered[destIndex]) {
        retval.push(results[destIndex]);
        destIndex++;
      } else {
        retval.push(def);
      }
    }
    return retval;
  }

  providerFor(network: ChainNetwork): Provider {
    return Chains.get(network).getPreferredWeb3Provider();
  }
  multicallProviderFor(chain: ChainNetwork): MulticallProvider {
    return new MulticallProvider(this.providerFor(chain), Chains.get(chain).id);
  }

  async callMulti(
    // tslint:disable-next-line
    contractCallback: Function | Function[],
    chain: ChainNetwork,
  ) {
    return await this.commsMgr.callMulti(contractCallback, chain);
  }
}
interface StakedAndPendingRet {
  staked: BigNumber[];
  pending: BigNumber[];
}
