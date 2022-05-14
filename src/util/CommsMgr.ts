import { Provider as MultiProvider } from "ethers-multicall";
import { ChainNetwork } from "..";
import { ConsoleErrorLogger } from "../model/PickleModel";
import { v4 as uuid } from "uuid";
import { ethers } from "ethers";
import { Chains } from "../chain/Chains";

// Interfaces & Types
type ChainRPCs = {
  single: ethers.providers.JsonRpcProvider;
  multi: MultiProvider[];
};
type RPCs = Map<ChainNetwork, ChainRPCs>;
type PendingCalls = Map<ChainNetwork, { id: string; callback: Function }[]>; // tslint:disable-line
type PendingSingleCalls = Map<
  ChainNetwork,
  { id: string; callback: Function; canFail: boolean }[] // tslint:disable-line
>;
type ResolvedCalls = Map<string, any>;
type ChainConfig = {
  secondsBetweenCalls: number;
  callsPerMulticall: number;
};
type ValueOfChainNetwork = `${ChainNetwork}` | "default";
export type ChainsConfigs = {
  [P in ValueOfChainNetwork]?: ChainConfig;
};
type CallsFlags = {
  [P in "single" | "multi"]: {
    [P in `${ChainNetwork}`]: { isCalling: boolean; lastQueued: number };
  };
};
// Configs
const COMMAN_CONFIGS = {
  waitForNewCall: 1, // seconds to wait before starting sending pending calls
  getResponseInterval: 0.5,
};
const CHAINS_CONFIGS: ChainsConfigs = {
  default: { secondsBetweenCalls: 0.5, callsPerMulticall: 100 },
  eth: { secondsBetweenCalls: 0.5, callsPerMulticall: 75 },
  aurora: { secondsBetweenCalls: 0.5, callsPerMulticall: 50 },
  moonriver: { secondsBetweenCalls: 1.2, callsPerMulticall: 100 },
  // fantom: { secondsBetweenCalls: 1, callsPerMulticall: 100 },
};

// Helpers
const GLOBAL_DEBUG_FLAG = false;
const DEBUG_OUT = (str: string): void => {
  if (GLOBAL_DEBUG_FLAG) console.log(str);
};
const isError = (err: unknown): err is Error => err instanceof Error;
// const isError = (err: any): boolean => err && err.stack && err.message && typeof err.stack === 'string'
// && typeof err.message === 'string';
const initialFlags = (): CallsFlags => {
  const flagsObj = { single: {}, multi: {} };
  Object.keys(ChainNetwork).forEach((chain) => {
    flagsObj.single[ChainNetwork[chain]] = { isCalling: false, lastQueued: 0 };
    flagsObj.multi[ChainNetwork[chain]] = { isCalling: false, lastQueued: 0 };
  });
  return <CallsFlags>flagsObj;
};

const currentMultiRun: { [chain: string]: number } = {};
const currentSingleRun: { [chain: string]: number } = {};

export class CommsMgr {
  private pendingMulticalls: PendingCalls;
  private pendingSinglecalls: PendingSingleCalls;
  private resolvedCalls: ResolvedCalls;
  private logger: ConsoleErrorLogger;
  private isConfigured: boolean;
  private flages: CallsFlags;
  private configs: ChainsConfigs;
  private rpcs: RPCs;
  sweepIntervalId: NodeJS.Timeout;

  constructor(logger: ConsoleErrorLogger, config: ChainsConfigs = undefined) {
    this.logger = logger;
    this.configs = config ?? CHAINS_CONFIGS;
    this.isConfigured = false;
    this.flages = initialFlags();
    this.pendingMulticalls = new Map<
      ChainNetwork,
      { id: string; callback: any }[]
    >();
    this.pendingSinglecalls = new Map<
      ChainNetwork,
      { id: string; callback: any; canFail: boolean }[]
    >();
    this.rpcs = new Map<ChainNetwork, ChainRPCs>();
    Object.keys(ChainNetwork).forEach((chain) => {
      this.pendingMulticalls[ChainNetwork[chain]] = [];
      this.pendingSinglecalls[ChainNetwork[chain]] = [];
      this.rpcs[ChainNetwork[chain]] = {};
    });
    this.resolvedCalls = new Map<string, any>();
  }

  // Instantiate CommsMgr correctly and perform some checks
  async configure() {
    if (!this.isConfigured) {
      await this.configureRPCs(Chains.list());
      this.isConfigured = true;
    }
    // TODO: check RPCs, if a chain has no live RPC/multiProvidr, do something!
  }

  async start() {
    await this.configure();
    this.sweepIntervalId = setInterval(this.sweepPendingCalls.bind(this), 500);
  }

  stop() {
    clearInterval(this.sweepIntervalId);
  }

  // TODO this will break CommsMgr if a chain has all its RPCs dead
  async configureRPCs(configuredChains: ChainNetwork[]): Promise<void> {
    await Promise.all(
      configuredChains.map(async (chain) => {
        const rpcObject: ChainRPCs = { single: undefined, multi: [] };
        const chainRPCs = Chains.get(chain).rpcProviderUrls;
        const liveRPCs: ethers.providers.JsonRpcProvider[] = [];
        await Promise.all(
          chainRPCs.map(async (url) => {
            const rpc = new ethers.providers.JsonRpcProvider(url);
            try {
              await rpc.getNetwork();
              liveRPCs.push(rpc);
            } catch (error) {
              this.logger.logError(
                `[CommsMgr] configureRPCs`,
                error,
                `[${chain}] RPC [${url}] is dead`,
              );
            }
          }),
        );

        const multiProviders: MultiProvider[] = [];
        // assign a random rpc for single calls on each run
        rpcObject["single"] = liveRPCs[~~(Math.random() * liveRPCs.length)];
        while (liveRPCs.length > 0) {
          const rpc = liveRPCs.pop();
          const multiProvider = new MultiProvider(rpc);
          try {
            await multiProvider.init();
            multiProviders.push(multiProvider);
          } catch (error) {
            this.logger.logError(
              `[CommsMgr] configureRPCs`,
              error,
              `[${chain}] a multiProvider.init() has failed`,
            );
          }
        }
        rpcObject.multi = multiProviders;

        this.rpcs[chain] = rpcObject;
      }),
    );
  }

  // the entry function that puts an ethers-multicall in the ComMan calls queue, returns the response if resolve, or undefined if rejected
  async callMulti(
    contractCallback: Function | Function[], // tslint:disable-line
    chain: ChainNetwork,
  ): Promise<any> {
    this.flages.multi[chain].lastQueued = Date.now();

    if (Array.isArray(contractCallback)) {
      const ids = [];
      contractCallback.forEach((c) => {
        const id = uuid();
        this.pendingMulticalls[chain].push({ callback: c, id: id });
        ids.push(id);
      });

      return Promise.all(ids.map((id) => this.getResponse(id)));
    } else {
      const id = uuid();
      this.pendingMulticalls[chain].push({
        callback: contractCallback,
        id: id,
      });

      return this.getResponse(id);
    }
  }

  /*
    Almost all calls can and should be routed through callMulti.
    There are actually two scenarios where using callSingle makes more sense:
    - Calls that when rejected provide meaningful info (e.g, dynamically deciding whether
      a farm has dual rewards by calling a function that is present only on some contracts).
    - Calls that has to be simulated with callStatic (e.g, to simulate a certain sender).
  */
  async callSingle(
    contractCallback: Function, // tslint:disable-line
    chain: ChainNetwork,
    canFail = false,
  ): Promise<any> {
    const id = uuid();
    this.pendingSinglecalls[chain].push({
      callback: contractCallback,
      id: id,
      canFail: canFail,
    });

    return this.getResponse(id);
  }

  // gets the call response from the resolvedCalls queue, keeps checking for responses every 2 seconds
  private async getResponse(id: string): Promise<any> {
    let res: any;

    while (res === undefined) {
      await new Promise((resolve) =>
        setTimeout(resolve, COMMAN_CONFIGS.getResponseInterval * 1000),
      );
      res = this.resolvedCalls[id];
    }
    if (isError(res)) return await Promise.reject(res);
    return res;
  }

  // starts sending pending calls to the RPCs if no new call is added to the queue for 2 seconds
  private async sweepPendingCalls() {
    const promises = [];

    promises.push(
      Object.keys(this.pendingSinglecalls).map(async (chain) => {
        if (
          this.pendingSinglecalls[chain].length > 0 &&
          !this.flages.single[chain].isCalling
        ) {
          currentSingleRun[chain]
            ? (currentSingleRun[chain] = currentSingleRun[chain] + 1)
            : (currentSingleRun[chain] = 1);
          DEBUG_OUT(
            `[${chain}] start single batch: ${currentSingleRun[chain]} pending: ${this.pendingSinglecalls[chain].length}`,
          );
          this.flages.single[chain].isCalling = true;
          await this.executeChainSinglecalls(<ChainNetwork>chain);
          this.flages.single[chain].isCalling = false;
          DEBUG_OUT(
            `[${chain}] end single batch: ${currentSingleRun[chain]} pending: ${this.pendingSinglecalls[chain].length}`,
          );
        }
      }),
    );

    promises.push(
      Object.keys(this.pendingMulticalls).map(async (chain) => {
        if (
          (Date.now() - this.flages.multi[chain].lastQueued >
            COMMAN_CONFIGS.waitForNewCall * 1000) &&
          this.pendingMulticalls[chain].length > 0 &&
          !this.flages.multi[chain].isCalling
        ) {
          currentMultiRun[chain]
            ? (currentMultiRun[chain] = currentMultiRun[chain] + 1)
            : (currentMultiRun[chain] = 1);
          DEBUG_OUT(
            `start [${chain}] multi batch: ${currentMultiRun[chain]} pending: ${this.pendingMulticalls[chain].length}`,
          );
          this.flages.multi[chain].isCalling = true;
          await this.executeChainMulticalls(<ChainNetwork>chain);
          this.flages.multi[chain].isCalling = false;
          DEBUG_OUT(
            `end [${chain}] multi batch: ${currentMultiRun[chain]} pending: ${this.pendingMulticalls[chain].length}`,
          );
        }
      }),
    );

    await Promise.all(promises);
  }

  private async executeChainMulticalls(chain: ChainNetwork) {
    const maxCalls = (this.configs[chain] ?? this.configs.default)
      .callsPerMulticall;
    const ids: string[] = this.pendingMulticalls[chain].map((x) => x.id);
    // tslint:disable-next-line
    const callbacks: Function[] = this.pendingMulticalls[chain].map(
      (x) => x.callback,
    );

    let multiProviders = this.rpcs[chain].multi;
    const splitIds: string[][] = [];
    // tslint:disable-next-line
    const splitCallbacks: Function[][] = [];
    if (ids.length > maxCalls && multiProviders.length > 1) {
      const splitSize = Math.ceil(ids.length / multiProviders.length);
      let tmpSplitIds = [];
      let tmpSplitCallbacks = [];
      for (let i = 0; i < ids.length; i++) {
        tmpSplitIds.push(ids[i]);
        tmpSplitCallbacks.push(callbacks[i]);
        if ((i + 1) % splitSize === 0) {
          splitIds.push(tmpSplitIds);
          splitCallbacks.push(tmpSplitCallbacks);
          tmpSplitIds = [];
          tmpSplitCallbacks = [];
        }
      }
      splitIds.push(tmpSplitIds);
      splitCallbacks.push(tmpSplitCallbacks);
    } else {
      splitIds.push(ids);
      splitCallbacks.push(callbacks);
      if (multiProviders.length > 1) {
        // juggle the load on the RPCs
        multiProviders = [
          multiProviders[~~(Math.random() * multiProviders.length)],
        ];
      }
    }

    const promises = multiProviders.map(async (multiProvider, idx) => {
      const ids = splitIds[idx];
      const callbacks = splitCallbacks[idx];
      let tmpIds: string[] = [];
      // tslint:disable-next-line
      let tmpCallbacks: Function[] = [];
      for (let i = 0; i < callbacks.length; i++) {
        tmpCallbacks.push(callbacks[i]);
        tmpIds.push(ids[i]);
        if (tmpCallbacks.length === maxCalls) {
          try {
            await this.ternaryExecuteTmpCalls(
              tmpCallbacks,
              tmpIds,
              multiProvider,
              chain,
            );
          } catch (error) {
            this.logger.logError("executeChainCalls", error);
          }
          tmpIds = [];
          tmpCallbacks = [];
        }
      }
      await this.ternaryExecuteTmpCalls(
        tmpCallbacks,
        tmpIds,
        multiProvider,
        chain,
      );
    });
    await Promise.all(promises);
  }

  private async executeChainSinglecalls(chain: ChainNetwork) {
    const ids = this.pendingSinglecalls[chain].map((x) => x.id);
    // tslint:disable-next-line
    const callbacks: Function[] = this.pendingSinglecalls[chain].map(
      (x) => x.callback,
    );
    const failFlags: boolean[] = this.pendingSinglecalls[chain].map(
      (x) => x.canFail,
    );
    for (let i = 0; i < callbacks.length; i++) {
      const delay = (this.configs[chain] ?? this.configs["default"])
        .secondsBetweenCalls;
      DEBUG_OUT(`executeChainSinglecalls ${delay}-seconds delay`);
      await new Promise((resolve) => setTimeout(resolve, delay * 1000));
      DEBUG_OUT(`executeChainSinglecalls ${delay}-seconds delay end`);
      DEBUG_OUT(`[${Date.now()}] sending a call to ${chain} single provider`);
      try {
        const response = await callbacks[i]();
        this.resolvedCalls[ids[i]] = response;
        this.deletePendingCall(chain, ids[i]);
      } catch (error) {
        if (!failFlags[i]) {
          this.logger.logError(
            "executeChainSinglecalls",
            error,
            `${chain} singlecall failed`,
          );
        }
        this.resolvedCalls[ids[i]] = error;
        this.deletePendingCall(chain, ids[i]);
      }
    }
  }

  // sends a batch of multicalls, if it fails, performs a basic ternary search to pinpoint the culprit call/calls
  private async ternaryExecuteTmpCalls(
    // tslint:disable-next-line
    tmpCallbacks: Function[],
    tmpIds: string[],
    multiProvider: MultiProvider,
    chain: ChainNetwork,
    delay = 0,
  ) {
    try {
      await new Promise((resolve) => setTimeout(resolve, delay * 1000));
      await this.executeTmpMulticalls(
        tmpCallbacks,
        tmpIds,
        multiProvider,
        chain,
      );
      return Promise.resolve();
    } catch (error) {
      const where = "[" + tmpCallbacks.length + "-request multicall] ";
      const errMsg = tmpCallbacks.length === 0 ? "Zero requests" : 
        tmpCallbacks.length > 1 ? "One or more contract requests have failed." : 
        tmpCallbacks.length > 0 && tmpCallbacks[0] ? tmpCallbacks[0].toString() + " has failed." : 
        "An unknown error has occurred";
      this.logger.logError(
        where,
        errMsg,
        `${chain} multicall failed`,
      );
      if (tmpIds.length === 1) {
        const id = tmpIds[0];
        this.resolvedCalls[id] = error;
        this.deletePendingCall(chain, id);
        return;
      }
      const tmpCallsChunks = [];
      const tmpIdsChunks = [];
      const chunkSize = Math.ceil(tmpIds.length / 3);
      for (let i = 0; i < tmpIds.length; i += chunkSize) {
        const callsChunk = tmpCallbacks.slice(i, i + chunkSize);
        const idsChunk = tmpIds.slice(i, i + chunkSize);
        tmpCallsChunks.push(callsChunk);
        tmpIdsChunks.push(idsChunk);
      }
      await Promise.allSettled(
        tmpIdsChunks.map((ids, i) =>
          this.ternaryExecuteTmpCalls(
            tmpCallsChunks[i],
            ids,
            multiProvider,
            chain,
            delay ? delay : this.calculateDelay(tmpIds.length),
          ),
        ),
      );
    }
  }

  private async executeTmpMulticalls(
    // tslint:disable-next-line
    tmpCallbacks: Function[],
    tmpIds: string[],
    multiProvider: MultiProvider,
    chain: ChainNetwork,
  ) {
    const delay = (this.configs[chain] ?? this.configs["default"])
      .secondsBetweenCalls;
    DEBUG_OUT(`executeTmpMulticalls ${delay}-seconds delay`);
    await new Promise((resolve) => setTimeout(resolve, delay * 1000));
    DEBUG_OUT(`executeTmpMulticalls ${delay}-seconds delay end`);
    DEBUG_OUT(
      `[${Date.now()}] sending ${
        tmpIds.length
      } calls to ${chain} multiProvider`,
    );
    const responses = await multiProvider.all(tmpCallbacks.map((c) => c()));
    responses.forEach((res, idx) => {
      const id = tmpIds[idx];
      this.resolvedCalls[id] = res;
      this.deletePendingCall(chain, id);
    });
  }

  private deletePendingCall(chain: ChainNetwork, id: string) {
    const index = this.pendingMulticalls[chain].findIndex(
      (call) => call.id === id,
    );
    if (index !== -1) {
      this.pendingMulticalls[chain].splice(index, 1);
    } else {
      const index = this.pendingSinglecalls[chain].findIndex(
        (call) => call.id === id,
      );
      if (~index) {
        this.pendingSinglecalls[chain].splice(index, 1);
      } else {
        this.logger.logError("deletePendingCall", "pending call not found");
      }
    }
  }

  // adds 1 second delay inbetween RPC calls
  private calculateDelay(numberOfCalls: number) {
    let remaining = numberOfCalls;
    let delay = 0;
    while (remaining > 1) {
      remaining = Math.ceil(remaining / 3);
      delay += 1;
    }
    return delay;
  }

  getProvider(chain: ChainNetwork) {
    return this.rpcs[chain].single;
  }
}
