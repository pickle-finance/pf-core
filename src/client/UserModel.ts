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
import { AssetEnablement, JarDefinition } from "../model/PickleModelJson";
import { ADDRESSES, DEBUG_OUT, getZeroValueMulticallForChain, getZeroValueMulticallForNonErc20 } from "../model/PickleModel";
import { Contract } from "@ethersproject/contracts";
import {
  Dill,
  Dill__factory,
  FeeDistributor,
  FeeDistributor__factory,
} from "../Contracts/ContractsImpl";

export interface UserTokenData {
  assetKey: string;
  depositTokenBalance: string;
  pAssetBalance: string;
  jarAllowance: string;
  pStakedBalance: string;
  farmAllowance: string;
  picklePending: string;
}
export interface UserData {
  tokens: UserTokenData[];
  earnings: IUserEarningsSummary;
  votes: IUserVote[];
  dill: IUserDillStats;
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
    tokens: [],
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
    },
    pickles: {},
    errors: [],
  };
};

export class UserModel {
  model: PickleModelJson.PickleModelJson;
  callback: IUserModelCallback | undefined;
  walletId: string;
  workingData: UserData;
  configuredChains: ChainNetwork[];
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

  async sendUpdate(): Promise<void> {
    if (this.callback !== undefined) {
      this.callback.modelUpdated(this.workingData);
    }
  }

  async generateUserModel(): Promise<UserData> {
    await Promise.all([
      this.getUserTokens(),
      this.getUserEarningsSummary(),
      this.getUserGaugeVotesGuard(),
      this.getUserDillStatsGuard(),
      this.getUserPickles(),
    ]);
    if (this.callback !== undefined) {
      this.callback.modelFinished(this.workingData);
    }
    return this.workingData;
  }

  async generateMinimalModel(): Promise<UserData> {
    await Promise.all([
      this.getUserTokens(),
      this.getUserEarningsSummary(),
    ]);
    if (this.callback !== undefined) {
      this.callback.modelFinished(this.workingData);
    }
    return this.workingData;
  }

  getChainsToRun(): ChainNetwork[] {
    return this.configuredChains;
  }
  setChainsToRun(chains: ChainNetwork[]): void {
    this.configuredChains = chains;;
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
            this.logUserModelError("loading user pickles on chain " + x, ""+err);
            this.sendUpdate();
          }
        }),
      );
      this.workingData.pickles = ret;
      this.sendUpdate();
      DEBUG_OUT("End getUserPickles: " + (Date.now() - start));
      return ret;
    } catch (err) {
      this.logUserModelError("loading user pickles", ""+err);
      this.sendUpdate();
      DEBUG_OUT("End getUserPickles: " + (Date.now() - start));
      return {};
    }
  }

  async getUserTokens(): Promise<UserTokenData[]> {
    DEBUG_OUT("Begin getUserTokens");
    const start = Date.now();
    try {
      const ret: UserTokenData[] = [];
      const result = await Promise.all(
        this.getChainsToRun().map((x) => this.getUserTokensSingleChainGuard(x)),
      );
      for (let i = 0; i < result.length; i++) {
        ret.push(...result[i]);
      }
      this.workingData.tokens = ret;
      this.sendUpdate();
      DEBUG_OUT("End getUserTokens: " + (Date.now() - start));
      return ret;
    } catch (err) {
      this.logUserModelError("getUserTokens", ""+err);
      this.sendUpdate();
      DEBUG_OUT("End getUserTokens: " + (Date.now() - start));
      return [];
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
      this.workingData.tokens.push(...res);
      this.sendUpdate();
      return res;
    } catch (error) {
      this.logUserModelError("Loading user tokens on chain " + chain, ""+error);
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
        x.enablement !== AssetEnablement.PERMANENTLY_DISABLED &&
        this.isErc20Underlying(x),
    );

    if (chainAssets.length === 0) {
      return [];
    }

    const provider: MulticallProvider = this.multicallProviderFor(chain);
    const depositTokenBalancesPromise: Promise<BigNumber[]> = provider.all(
      chainAssets.map((x) => {
        const mcContract = new MulticallContract(x.depositToken.addr, erc20Abi);
        return mcContract.balanceOf(this.walletId);
      }),
    );

    const provider2: MulticallProvider = this.multicallProviderFor(chain);
    const pTokenBalancesPromise: Promise<BigNumber[]> = provider2.all(
      chainAssets.map((x) => {
        const erc20Guard = getZeroValueMulticallForNonErc20(x);
        if( erc20Guard ) return erc20Guard;
        const mcContract = new MulticallContract(x.contract, erc20Abi);
        return mcContract.balanceOf(this.walletId);
      }),
    );

    const provider3: MulticallProvider = this.multicallProviderFor(chain);
    const jarAllowancePromise: Promise<BigNumber[]> = provider3.all(
      chainAssets.map((x) => {
        const erc20Guard = getZeroValueMulticallForNonErc20(x);
        if( erc20Guard ) return erc20Guard;
        const mcContract = new MulticallContract(x.depositToken.addr, erc20Abi);
        return mcContract.allowance(this.walletId, x.contract);
      }),
    );

    const provider4: MulticallProvider = this.multicallProviderFor(chain);
    const farmAllowancePromise: Promise<BigNumber[]> = provider4.all(
      chainAssets.map((x) => {
        const erc20Guard = getZeroValueMulticallForNonErc20(x);
        if( erc20Guard ) return erc20Guard;
        if( x.farm && x.farm.farmAddress) {
          const mcContract = new MulticallContract(x.contract, erc20Abi);
          return mcContract.allowance(this.walletId, x.farm.farmAddress);
        } else {
          return getZeroValueMulticallForChain(x.chain);
        }
      }),
    );

    let stakedInFarmPromise: Promise<BigNumber[]> = undefined;
    let picklePendingPromise: Promise<BigNumber[]> = undefined;
    if (chain === ChainNetwork.Ethereum) {
      stakedInFarmPromise = this.getStakedInFarmEth(chain, chainAssets);
      picklePendingPromise = this.getPicklePendingEth(chain, chainAssets);
    } else {
      const chef = ADDRESSES.get(chain).minichef;
      const skip: boolean =
        chef === null || chef === undefined || chef === NULL_ADDRESS;
      if (skip) {
        stakedInFarmPromise = Promise.resolve(
          chainAssets.map(() => BigNumber.from(0)),
        );
        picklePendingPromise = Promise.resolve(
          chainAssets.map(() => BigNumber.from(0)),
        );
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
        const multicallProvider = new MulticallProvider(
          this.providerFor(chain),
        );
        await multicallProvider.init();
        const miniChefMulticall: MulticallContract = new MulticallContract(
          chef,
          minichefAbi,
        );
        const lpTokens: string[] = await multicallProvider.all(
          poolIds.map((id) => {
            return miniChefMulticall.lpToken(id);
          }),
        );
        const lpLower: string[] = lpTokens.map((x) => x.toLowerCase());
        stakedInFarmPromise = this.getStakedInFarmMinichef(
          chain,
          chainAssets,
          poolIds,
          lpLower,
        );
        picklePendingPromise = this.getPicklePendingMinichef(
          chain,
          chainAssets,
          poolIds,
          lpLower,
        );
      }
    }

    let depositTokenBalances = [];
    let pTokenBalances = [];
    let stakedInFarm = [];
    let picklePending = [];
    let jarAllowance = [];
    let farmAllowance = [];
    try {
      depositTokenBalances = await depositTokenBalancesPromise;
    } catch( error ) {
      this.logUserModelError("Loading deposit token balances on chain " + chain, ""+error);
      depositTokenBalances = [];
    }
    try {
      pTokenBalances = await pTokenBalancesPromise;
    } catch( error ) {
      this.logUserModelError("Loading ptoken balances on chain " + chain, ""+error);
      pTokenBalances = [];
    }
    try {
      stakedInFarm = await stakedInFarmPromise;
    } catch( error ) {
      this.logUserModelError("Loading staked ptoken balances on chain " + chain, ""+error);
      stakedInFarm = [];
    }
    try {
      picklePending = await picklePendingPromise;
    } catch( error ) {
      this.logUserModelError("Loading pending pickles on chain " + chain, ""+error);
      picklePending = [];
    }
    try {
      jarAllowance = await jarAllowancePromise;
    } catch( error ) {
      this.logUserModelError("Loading deposit token allowances on chain " + chain, ""+error);
      jarAllowance = [];
    }
    try {
      farmAllowance = await farmAllowancePromise;
    } catch( error ) {
      this.logUserModelError("Loading ptoken allowances on chain " + chain, ""+error);
      farmAllowance = [];
    }
    for (let j = 0; j < chainAssets.length; j++) {
      const toAdd: UserTokenData = {
        assetKey: chainAssets[j].details.apiKey,
        depositTokenBalance: depositTokenBalances[j]?.toString() || "0",
        pAssetBalance: pTokenBalances[j]?.toString() || "0",
        pStakedBalance: stakedInFarm[j]?.toString() || "0",
        picklePending: picklePending[j]?.toString() || "0",
        jarAllowance: jarAllowance[j]?.toString() || "0",
        farmAllowance: farmAllowance[j]?.toString() || "0",
      };
      const allZeros: boolean =
        toAdd.depositTokenBalance === "0" &&
        toAdd.pAssetBalance === "0" &&
        toAdd.pStakedBalance === "0" &&
        toAdd.picklePending === "0";

      if (!allZeros) ret.push(toAdd);
    }
    return ret;
  }

  async getStakedInFarmEth(
    chain: ChainNetwork,
    chainAssets: JarDefinition[],
  ): Promise<BigNumber[]> {
    const filteredChainAssets = chainAssets.filter(
      (x) => x.farm && x.farm.farmAddress,
    );
    const provider: MulticallProvider = this.multicallProviderFor(chain);
    const stakedBalances: BigNumber[] = await provider.all(
      filteredChainAssets.map((x) => {
        const mcContract = new MulticallContract(x.farm.farmAddress, gaugeAbi);
        return mcContract.balanceOf(this.walletId);
      }),
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
    const multicallProvider = new MulticallProvider(this.providerFor(chain));
    await multicallProvider.init();
    const miniChefMulticall: MulticallContract = new MulticallContract(
      chef,
      minichefAbi,
    );

    const userInfos: any[] = await multicallProvider.all(
      poolIds.map((id) => {
        return miniChefMulticall.userInfo(id, this.walletId);
      }),
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
    const provider: MulticallProvider = this.multicallProviderFor(chain);
    const pending: BigNumber[] = await provider.all(
      filteredChainAssets.map((x) => {
        const mcContract = new MulticallContract(x.farm.farmAddress, gaugeAbi);
        return mcContract.earned(this.walletId);
      }),
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
    const multicallProvider = new MulticallProvider(this.providerFor(chain));
    await multicallProvider.init();
    const miniChefMulticall: MulticallContract = new MulticallContract(
      chef,
      minichefAbi,
    );
    const picklePending: BigNumber[] = await multicallProvider.all(
      poolIds.map((id) => {
        return miniChefMulticall.pendingPickle(id, this.walletId);
      }),
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
      this.logUserModelError("Loading user votes", ""+error);
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
    const provider: MulticallProvider = this.multicallProviderFor(
      ChainNetwork.Ethereum,
    );
    const gaugeProxyMC = new MulticallContract(gaugeProxy, gaugeProxyAbi);
    const userVotes: BigNumber[] = await provider.all(
      eligibleTokens.map((x) => {
        return gaugeProxyMC.votes(this.walletId, x);
      }),
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
      this.logUserModelError("getUserEarningsSummary", ""+error);
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
  }

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
      this.logUserModelError("in getUserDillStats", ""+error);
      this.sendUpdate();
      DEBUG_OUT("End getUserDillStatsGuard: " + (Date.now() - start));
      return {
        pickleLocked: "0",
        lockEnd: "0",
        balance: "0",
        claimable: "0",
      };
    }
  }
  async getUserDillStats(): Promise<IUserDillStats> {
    const dillContractAddr: string = ADDRESSES.get(ChainNetwork.Ethereum).dill;
    const feeDistributorAddr: string = ADDRESSES.get(
      ChainNetwork.Ethereum,
    ).feeDistributor;
    const dillContract: Dill = Dill__factory.connect(
      dillContractAddr,
      this.providerFor(ChainNetwork.Ethereum),
    );
    const feeDistributorContract: FeeDistributor =
      FeeDistributor__factory.connect(
        feeDistributorAddr,
        this.providerFor(ChainNetwork.Ethereum),
      );

    const [lockStats, balance, userClaimable] = await Promise.all([
      dillContract.locked(this.walletId, { gasLimit: 1000000 }),
      dillContract["balanceOf(address)"](this.walletId, { gasLimit: 1000000 }),
      feeDistributorContract.callStatic["claim(address)"](this.walletId, {
        gasLimit: 1000000,
      }),
    ]);

    return {
      pickleLocked: lockStats[0].toString(),
      lockEnd: lockStats[1].toString(),
      balance: balance.toString(),
      claimable: userClaimable.toString(),
    };
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
}
