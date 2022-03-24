import { Provider as MultiProvider } from "ethers-multicall";
import { ChainNetwork } from "..";
import { PickleModel } from "../model/PickleModel";
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
type ResolvedCalls = Map<string, any>;
type ChainConfig = {
  secondsBetweenCalls: number;
  callsPerMulticall: number;
};
type ValueOfChainNetwork = `${ChainNetwork}` | "default";
type ChainsConfigs = {
  [P in ValueOfChainNetwork]?: ChainConfig;
};
// Configs
const COMMAN_CONFIGS = {
  waitForNewCall: 2, // seconds to wait before starting sending pending calls
  getResponseInterval: 2,
};
const CHAINS_CONFIGS: ChainsConfigs = {
  default: { secondsBetweenCalls: 1, callsPerMulticall: 100 },
  eth: { secondsBetweenCalls: 1, callsPerMulticall: 100 },
  aurora: { secondsBetweenCalls: 1, callsPerMulticall: 50 },
  fantom: { secondsBetweenCalls: 1, callsPerMulticall: 100 },
};

// Helpers
const GLOBAL_DEBUG_FLAG = true;
const DEBUG_OUT = (str: string): void => {
  if (GLOBAL_DEBUG_FLAG) console.log(str);
};
const isError = (err: unknown): err is Error => err instanceof Error;
// const isError = (err: any): boolean => err && err.stack && err.message && typeof err.stack === 'string'
// && typeof err.message === 'string';

export class CommsMgr {
  private pendingMulticalls: PendingCalls;
  private pendingSinglecalls: PendingCalls;
  private resolvedCalls: ResolvedCalls;
  private lastUpdated: number; // when was the last call added to pendingCalls
  private isMulticalling: boolean;
  private isSinglecalling: boolean;
  private model: PickleModel;
  private configs: ChainsConfigs;
  private rpcs: RPCs;
  sweepIntervalId: NodeJS.Timeout;

  constructor(model: PickleModel, config: ChainsConfigs = undefined) {
    this.model = model;
    this.configs = config ?? CHAINS_CONFIGS;
    this.lastUpdated = 0;
    this.isMulticalling = false;
    this.isSinglecalling = false;
    this.pendingMulticalls = new Map<
      ChainNetwork,
      { id: string; callback: any }[]
    >();
    this.pendingSinglecalls = new Map<
      ChainNetwork,
      { id: string; callback: any }[]
    >();
    this.rpcs = new Map<ChainNetwork, ChainRPCs>();
    Object.keys(ChainNetwork).forEach((chain) => {
      this.pendingMulticalls[ChainNetwork[chain]] = [];
      this.pendingSinglecalls[ChainNetwork[chain]] = [];
      this.rpcs[ChainNetwork[chain]] = {};
    });
    this.resolvedCalls = new Map<string, any>();
    this.start();
  }

  start() {
    this.sweepIntervalId = setInterval(this.sweepPendingCalls.bind(this), 2000);
  }

  stop() {
    clearInterval(this.sweepIntervalId);
  }

  // TODO this will break CommsMgr if a chain has all its RPCs dead
  async configureRPCs(configuredChains: ChainNetwork[]) {
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
              console.log(`${url} is live.`);
            } catch (error) {
              this.model.logError(
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
          } catch (error) {
            this.model.logError(
              `[CommsMgr] configureRPCs`,
              error,
              `[${chain}] a multiProvider.init() has failed`,
            );
          }
          multiProviders.push(multiProvider);
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
    this.lastUpdated = Date.now();

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
  ): Promise<any> {
    const id = uuid();
    this.pendingSinglecalls[chain].push({
      callback: contractCallback,
      id: id,
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
    if (!this.isSinglecalling) {
      this.isSinglecalling = true;
      const promises = Object.keys(this.pendingSinglecalls).map((chain) => {
        if (this.pendingSinglecalls[chain].length > 0)
          return this.executeChainSinglecalls(<ChainNetwork>chain);
      });
      await Promise.all(promises);
      this.isSinglecalling = false;
    }
    if (
      !this.isMulticalling &&
      Date.now() - this.lastUpdated > COMMAN_CONFIGS.waitForNewCall * 1000
    ) {
      this.isMulticalling = true;
      const promises = Object.keys(this.pendingMulticalls).map((chain) => {
        if (this.pendingMulticalls[chain].length > 0)
          return this.executeChainMulticalls(<ChainNetwork>chain);
      });
      await Promise.all(promises);
      this.isMulticalling = false;
    }
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
            this.model.logError("executeChainCalls", error);
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
    for (let i = 0; i < callbacks.length; i++) {
      const delay = (this.configs[chain] ?? this.configs["default"])
        .secondsBetweenCalls;
      DEBUG_OUT(`executeChainSinglecalls ${delay}-seconds delay`);
      await new Promise((resolve) => setTimeout(resolve, delay * 1000));
      DEBUG_OUT(`executeChainSinglecalls ${delay}-seconds delay end`);
      DEBUG_OUT(`sending a call to ${chain} single provider`);
      try {
        const response = await callbacks[i]();
        this.resolvedCalls[ids[i]] = response;
        this.deletePendingCall(chain, ids[i]);
      } catch (error) {
        this.model.logError(
          "executeChainSinglecalls",
          error,
          `${chain} singlecall failed`,
        );
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
      this.model.logError(
        "ternaryExecuteTmpCalls",
        error,
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
    DEBUG_OUT(`sending ${tmpIds.length} calls to ${chain} multiProvider`);
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
        this.model.logError("deletePendingCall", "pending call not found");
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
