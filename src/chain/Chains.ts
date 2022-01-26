import { AbstractChain } from "./AbstractChain";
import { IChain } from "./IChain";
import { Provider } from "@ethersproject/abstract-provider";
import { Signer } from "@ethersproject/abstract-signer";
import { setMulticallAddress } from "ethers-multicall";

export interface RawChain {
  chainId: number;
  network: string; // This must never change once created
  networkVisible: string; // This can change as we wish
  secondsPerBlock: number;
  gasToken: string; // Coingecko API ID
  gasTokenSymbol: string; // Token symbol
  explorer: string;
  rpcs: string[];
  multicallAddress?: string;
  defaultPerformanceFee: number;
}

export enum ChainNetwork {
  Ethereum = "eth",
  Polygon = "polygon",
  OKEx = "okex",
  Arbitrum = "arbitrum",
  Harmony = "harmony",
  Moonriver = "moonriver",
  Cronos = "cronos",
  Aurora = "aurora",
  Metis = "metis",
  Moonbeam = "moonbeam",
  // ADD_CHAIN
  //Binance
}
export const RAW_CHAIN_BUNDLED_DEF: RawChain[] = [
  {
    chainId: 1,
    network: ChainNetwork.Ethereum,
    networkVisible: "Ethereum",
    secondsPerBlock: 13,
    gasToken: "ethereum",
    gasTokenSymbol: "eth",
    explorer: "https://etherscan.io",
    rpcs: ["https://cloudflare-eth.com/"],
    defaultPerformanceFee: 0.2,
  },
  {
    chainId: 137,
    network: ChainNetwork.Polygon,
    networkVisible: "Polygon",
    secondsPerBlock: 2,
    gasToken: "matic-network",
    gasTokenSymbol: "matic",
    explorer: "https://polygonscan.com",
    rpcs: [
      "https://polygon-rpc.com",
      "https://rpc-mainnet.maticvigil.com",
      "https://matic-mainnet.chainstacklabs.com/",
      "https://rpc-mainnet.matic.network",
    ],
    defaultPerformanceFee: 0.2,
  },
  {
    chainId: 66,
    network: ChainNetwork.OKEx,
    networkVisible: "OEC",
    secondsPerBlock: 3,
    gasToken: "oec-token",
    gasTokenSymbol: "okt",
    explorer: "https://www.oklink.com/en/oec",
    rpcs: ["https://exchainrpc.okex.org"],
    multicallAddress: "0x94fEadE0D3D832E4A05d459eBeA9350c6cDd3bCa",
    defaultPerformanceFee: 0.1,
  },
  {
    chainId: 42161,
    network: ChainNetwork.Arbitrum,
    networkVisible: "Arbitrum",
    secondsPerBlock: 13,
    gasToken: "ethereum",
    gasTokenSymbol: "eth",
    explorer: "https://arbiscan.io",
    rpcs: ["https://arb1.arbitrum.io/rpc"],
    multicallAddress: "0x813715eF627B01f4931d8C6F8D2459F26E19137E",
    defaultPerformanceFee: 0.2,
  },
  {
    chainId: 1666600000,
    network: ChainNetwork.Harmony,
    networkVisible: "Harmony ONE",
    secondsPerBlock: 2,
    gasToken: "harmony",
    gasTokenSymbol: "one",
    explorer: "https://explorer.harmony.one",
    rpcs: ["https://api.harmony.one"],
    multicallAddress: "0x5e9e5eea23b37a0d37d6dcac2f1edfba5cbc84f9",
    defaultPerformanceFee: 0.1,
  },
  {
    chainId: 1285,
    network: ChainNetwork.Moonriver,
    networkVisible: "Moonriver",
    secondsPerBlock: 14,
    gasToken: "moonriver",
    gasTokenSymbol: "movr",
    explorer: "https://moonriver.moonscan.io",
    rpcs: ["https://rpc.moonriver.moonbeam.network"],
    multicallAddress: "0x4c4a5d20f1ee40eaacb6a7787d20d16b7997363b",
    defaultPerformanceFee: 0.1,
  },
  {
    chainId: 25,
    network: ChainNetwork.Cronos,
    networkVisible: "Cronos",
    secondsPerBlock: 5.5,
    gasToken: "crypto-com-chain",
    gasTokenSymbol: "cro",
    explorer: "https://cronos.crypto.org/explorer",
    rpcs: ["https://evm-cronos.crypto.org"],
    multicallAddress: "0x0fA4d452693F2f45D28c4EC4d20b236C4010dA74",
    defaultPerformanceFee: 0.1,
  },
  {
    chainId: 1313161554,
    network: ChainNetwork.Aurora,
    networkVisible: "Aurora",
    secondsPerBlock: 1,
    gasToken: "ethereum",
    gasTokenSymbol: "eth",
    explorer: "https://explorer.mainnet.aurora.dev/",
    rpcs: ["https://mainnet.aurora.dev"],
    multicallAddress: "0x60Ad579Fb20c8896b7b98E800cBA9e196E6eaA44",
    defaultPerformanceFee: 0.1,
  },
  {
    chainId: 1088,
    network: ChainNetwork.Metis,
    networkVisible: "Metis",
    secondsPerBlock: 3.5,
    gasToken: "metis-token",
    gasTokenSymbol: "metis",
    explorer: "https://andromeda-explorer.metis.io/",
    rpcs: ["https://andromeda.metis.io/?owner=1088"],
    multicallAddress: "0xa99850Ff94d3D333e7F669203Ab7B77Ec634028F",
    defaultPerformanceFee: 0.1,
  },
  {
    chainId: 1284,
    network: ChainNetwork.Moonbeam,
    networkVisible: "Moonbeam",
    secondsPerBlock: 12.1,
    gasToken: "moonbeam",
    gasTokenSymbol: "glmr",
    explorer: "https://moonbeam.moonscan.io/",
    rpcs: ["https://rpc.api.moonbeam.network"],
    multicallAddress: "0xDad6760bd3FC33b741D46df1e205558BB22D1507",
    defaultPerformanceFee: 0.1,
  },
  // ADD_CHAIN
];
export class JsonChain extends AbstractChain {
  constructor(raw: RawChain) {
    super(raw);
  }
}
export class Chains {
  private static singleton: Chains = new Chains(RAW_CHAIN_BUNDLED_DEF);
  public static overrideSingleton(raw: RawChain[]): void {
    Chains.singleton = new Chains(raw);
  }

  chainMap: Map<ChainNetwork, AbstractChain> = new Map<
    ChainNetwork,
    AbstractChain
  >();
  rawData: RawChain[];

  private constructor(chainData: RawChain[]) {
    this.rawData = chainData;
    for (const i in ChainNetwork) {
      const foundRawChain = chainData.find(
        (x) => x.network === ChainNetwork[i],
      );
      if (foundRawChain) {
        this.chainMap.set(ChainNetwork[i], new JsonChain(foundRawChain));
      }
    }
  }

  static list(): ChainNetwork[] {
    return [...Chains.singleton.chainMap.keys()];
  }

  static globalInitialize(chains: Map<ChainNetwork, Provider | Signer>): void {
    for (let i = 0; i < this.singleton.rawData.length; i++) {
      if (Chains.singleton.rawData[i].multicallAddress) {
        setMulticallAddress(
          Chains.singleton.rawData[i].chainId,
          Chains.singleton.rawData[i].multicallAddress,
        );
      }
    }

    for (const key of Chains.list()) {
      const resolver = chains.get(key);
      if (resolver) {
        const isSigner: boolean = (resolver as Signer).provider !== undefined;
        const signer: Signer = isSigner ? (resolver as Signer) : undefined;
        const provider: Provider = isSigner
          ? (resolver as Signer).provider
          : (resolver as Provider);
        if (signer) Chains.get(key).setSigner(signer);
        if (provider) Chains.get(key).setPreferredWeb3Provider(provider);
      } else {
        Chains.get(key).setPreferredWeb3Provider(
          Chains.get(key).getRandomWeb3Provider(),
        );
      }
    }
  }

  static get(network: ChainNetwork): IChain {
    const chain = Chains.singleton.chainMap.get(network);
    if (!chain) {
      throw new Error(`${network} is not a supported chain`);
    }
    return chain;
  }
  static fromId(id: number): IChain {
    for (const [key, value] of Chains.singleton.chainMap) {
      if (value.id === id) return value;
    }
    throw new Error(`Chain ${id} is not a supported chain`);
  }

  static getResolver(network: ChainNetwork): Provider | Signer {
    const chain = Chains.singleton.chainMap.get(network);
    if (!chain) {
      throw new Error(`${network} is not a supported chain`);
    }
    return chain.getProviderOrSigner();
  }
}
