import { ethers } from "ethers";
import { MultiProvider } from "ethers-multiprovider";
import { ChainNetwork, RawChain, RAW_CHAIN_BUNDLED_DEF } from "../chain/Chains";
import { DEBUG_OUT } from "../model/PickleModel";

const RPCs: { [P in ChainNetwork]?: [string, ProviderConfig?][] } = {
  eth: [
    ["https://eth-mainnet.public.blastapi.io"],
    ["https://cloudflare-eth.com"],
    ["https://rpc.ankr.com/eth"],
    ["https://nodes.mewapi.io/rpc/eth"],
    ["https://eth-rpc.gateway.pokt.network"],
    ["https://rpc.flashbots.net"],
    ["https://api.mycryptoapi.com/eth"],
    // ["https://main-light.eth.linkpool.io", { callsDelay: 1 }],  // Very flaky
    // ["https://main-rpc.linkpool.io", { callsDelay: 1, batchSize: 30 }], // Very flaky
    // ["https://ethereumnodelight.app.runonflux.io", { callsDelay: 0.75 }], // unreliable
  ],
  arbitrum: [
    ["https://rpc.ankr.com/arbitrum"],
    ["https://arb1.arbitrum.io/rpc"],
  ],
  aurora: [["https://mainnet.aurora.dev"]],
  cronos: [
    ["https://evm.cronos.org"],
    ["https://evm-cronos.crypto.org"],
    // ["https://cronosrpc-1.xstaking.sg"],  // offline - too long
  ],
  fantom: [
    ["https://rpc.ftm.tools"],
    ["https://rpc3.fantom.network"],
    [
      "https://fantom-mainnet.gateway.pokt.network/v1/lb/62759259ea1b320039c9e7ac",
    ],
    ["https://rpc.ankr.com/fantom"],
    ["https://rpc2.fantom.network", { callsDelay: 1 }],
    ["https://fantom-mainnet.public.blastapi.io", { callsDelay: 1.2 }],
    ["https://rpcapi.fantom.network"],
    // ["https://rpc.fantom.network"], // offline - too long
  ],
  gnosis: [
    ["https://gnosis-mainnet.public.blastapi.io"],
    ["https://rpc.ankr.com/gnosis"],
    ["https://xdai.poanetwork.dev"],
    ["https://dai.poa.network"],
    ["https://rpc.xdaichain.com"],
    ["https://rpc-df.xdaichain.com"],
    ["https://gnosischain-rpc.gateway.pokt.network"],
    ["https://xdai-archive.blockscout.com"],
    ["https://xdai-rpc.gateway.pokt.network"],
    // ["https://rpc.gnosischain.com"], // doesn't support Access-Control-Allow-Origin, causing calls to it to be blocked on UI by CORS policy
    // ["wss://xdai.poanetwork.dev/wss"],  // offline
    // ["wss://rpc.gnosischain.com/wss"],  // offline
  ],
  metis: [["https://andromeda.metis.io/?owner=1088"]],
  moonbeam: [
    ["https://moonbeam.public.blastapi.io"],
    ["https://rpc.ankr.com/moonbeam"],
    ["https://rpc.api.moonbeam.network"],
    // ["wss://wss.api.moonbeam.network"], // offline
  ],
  moonriver: [
    ["https://moonriver.public.blastapi.io"],
    ["https://rpc.api.moonriver.moonbeam.network"],
    ["https://moonriver.api.onfinality.io/public"],
    // ["wss://wss.api.moonriver.moonbeam.network"], // offline
  ],
  okex: [["https://exchainrpc.okex.org"]],
  optimism: [
    ["https://optimism-mainnet.public.blastapi.io"],
    ["https://mainnet.optimism.io"],
  ],
  polygon: [
    ["https://rpc-mainnet.matic.quiknode.pro"],
    ["https://rpc.ankr.com/polygon"],
    ["https://polygon-mainnet.public.blastapi.io"],
    ["https://polygon-rpc.com"],
    ["https://rpc-mainnet.maticvigil.com"],
    ["https://matic-mainnet-archive-rpc.bwarelabs.com"],
    ["https://matic-mainnet-full-rpc.bwarelabs.com"],
    ["https://matic-mainnet.chainstacklabs.com"],
    // ["https://poly-rpc.gateway.pokt.network"],  // offline - too long
  ],
};
interface ProviderConfig {
  multicallAddress?: string;
  batchSize?: number;
  callsDelay?: number;
}
type CommsMgrConfig = {
  [P in ChainNetwork]?: ProviderConfig;
};
const defaultConfig = {
  batchSize: 100,
  callsDelay: 0.5,
};
// type CommsMgrConfig = Map<ChainNetwork, ProviderConfig>;
const CONFIGS: CommsMgrConfig = {
  eth: defaultConfig,
  arbitrum: defaultConfig,
  aurora: defaultConfig,
  cronos: defaultConfig,
  fantom: defaultConfig,
  gnosis: defaultConfig,
  metis: defaultConfig,
  moonbeam: defaultConfig,
  moonriver: defaultConfig,
  okex: defaultConfig,
  optimism: defaultConfig,
  polygon: defaultConfig,
};

export class CommsMgrV2 {
  private multiProviders: { [value in ChainNetwork]?: MultiProvider } = {};
  constructor(chainConfig: ProviderConfig = {}) {
    RAW_CHAIN_BUNDLED_DEF.forEach((rawChain) => {
      const chainConf: ProviderConfig = chainConfig
        ? Object.assign({}, chainConfig)
        : {};
      if (rawChain.multicallAddress)
        chainConf.multicallAddress = rawChain.multicallAddress;
      CONFIGS[rawChain.network] = Object.assign(
        chainConf,
        CONFIGS[rawChain.network],
      );
    });
  }

  // async init(chains: ChainNetwork[] = undefined) {
  //   const rawChains: RawChain[] = !chains
  //     ? RAW_CHAIN_BUNDLED_DEF
  //     : RAW_CHAIN_BUNDLED_DEF.filter((rawChain) =>
  //         chains.includes(<ChainNetwork>rawChain.network),
  //       );
  //   const defaultProms: Promise<void>[] = [];
  //   for (const rawChain of rawChains) {
  //     const chain = <ChainNetwork>rawChain.network;
  //     const multiProvider = new MultiProvider(
  //       rawChain.chainId,
  //       CONFIGS[chain],
  //       console.log, //DEBUG_OUT,
  //     );
  //     defaultProms.push(multiProvider.initDefault());
  //     this.multiProviders[chain] = multiProvider;
  //   }
  //   await Promise.all(defaultProms);
  //   const addProms: Promise<void>[] = [];
  //   for (const rawChain of rawChains) {
  //     const chain = <ChainNetwork>rawChain.network;
  //     for (const rpc of rawChain.rpcs) {
  //       const ethersProvider = new ethers.providers.JsonRpcProvider(rpc);
  //       addProms.push(this.addProvider(ethersProvider, chain));
  //     }
  //   }
  //   await Promise.all(addProms);
  // }

  async init(chains: ChainNetwork[] = undefined): Promise<void[]> {
    const rawChains: RawChain[] = !chains
      ? RAW_CHAIN_BUNDLED_DEF
      : RAW_CHAIN_BUNDLED_DEF.filter((rawChain) =>
          chains.includes(<ChainNetwork>rawChain.network),
        );
    const promsCollector: Promise<void>[] = [];
    for (const rawChain of rawChains) {
      const chain = <ChainNetwork>rawChain.network;
      const multiProvider = new MultiProvider(
        rawChain.chainId,
        CONFIGS[chain],
        DEBUG_OUT,
      );
      const urls: [string, ProviderConfig?][] = RPCs[chain];
      this.multiProviders[chain] = multiProvider;
      urls.forEach((url) => {
        const provider = new ethers.providers.JsonRpcProvider(url[0]);
        promsCollector.push(this.addProvider(chain, provider, url[1]));
      });
    }
    return Promise.all(promsCollector);
  }

  async addProvider(
    chain: ChainNetwork,
    provider: ethers.providers.Provider,
    config: ProviderConfig,
  ) {
    const multiProvider = this.multiProviders[chain];
    await multiProvider.addProvider(provider, config);
  }

  getProvider(chain: ChainNetwork) {
    return this.multiProviders[chain];
  }

  async stop() {
    await Promise.all(
      Object.keys(this.multiProviders).map((chain) =>
        this.multiProviders[chain].stop(),
      ),
    );
    for (const chain in this.multiProviders) {
      if (Object.prototype.hasOwnProperty.call(this.multiProviders, chain)) {
        const multiProvider = this.multiProviders[chain];
        await multiProvider.stop();
      }
    }
  }
}
