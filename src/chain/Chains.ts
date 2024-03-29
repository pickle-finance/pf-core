import { AbstractChain } from "./AbstractChain";
import { IChain } from "./IChain";
import { ethers, Signer } from "ethers";
import { setMulticallAddress } from "ethers-multiprovider";
import { PickleModel /* toError */ } from "../model/PickleModel";
import {
  ErrorSeverity,
  PickleProduct,
  PlatformError,
} from "../core/platform/PlatformInterfaces";
import { FuncsQueue } from "../util/PromiseTimeout";

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
  wrappedNativeAddress: string;
}

export enum ChainNetwork {
  Ethereum = "eth",
  Polygon = "polygon",
  OKEx = "okex",
  Arbitrum = "arbitrum",
  Moonriver = "moonriver",
  Cronos = "cronos",
  Aurora = "aurora",
  Metis = "metis",
  Moonbeam = "moonbeam",
  Optimism = "optimism",
  Fantom = "fantom",
  Gnosis = "gnosis",
  Kava = "kava",
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
    rpcs: ["https://rpc.ankr.com/eth"],
    defaultPerformanceFee: 0.2,
    wrappedNativeAddress: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  },
  {
    chainId: 137,
    network: ChainNetwork.Polygon,
    networkVisible: "Polygon",
    secondsPerBlock: 2,
    gasToken: "matic-network",
    gasTokenSymbol: "matic",
    explorer: "https://polygonscan.com",
    rpcs: ["https://polygon-rpc.com"],
    defaultPerformanceFee: 0.2,
    wrappedNativeAddress: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
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
    wrappedNativeAddress: "0x8F8526dbfd6E38E3D8307702cA8469Bae6C56C15",
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
    wrappedNativeAddress: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
  },
  {
    chainId: 1285,
    network: ChainNetwork.Moonriver,
    networkVisible: "Moonriver",
    secondsPerBlock: 14,
    gasToken: "moonriver",
    gasTokenSymbol: "movr",
    explorer: "https://moonriver.moonscan.io",
    rpcs: ["https://rpc.api.moonriver.moonbeam.network"],
    multicallAddress: "0x4c4a5d20f1ee40eaacb6a7787d20d16b7997363b",
    defaultPerformanceFee: 0.1,
    wrappedNativeAddress: "0x98878B06940aE243284CA214f92Bb71a2b032B8A",
  },
  {
    chainId: 25,
    network: ChainNetwork.Cronos,
    networkVisible: "Cronos",
    secondsPerBlock: 5.8,
    gasToken: "crypto-com-chain",
    gasTokenSymbol: "cro",
    explorer: "https://cronoscan.com/",
    rpcs: ["https://evm-cronos.crypto.org"],
    multicallAddress: "0x0fA4d452693F2f45D28c4EC4d20b236C4010dA74",
    defaultPerformanceFee: 0.042,
    wrappedNativeAddress: "0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23",
  },
  {
    chainId: 1313161554,
    network: ChainNetwork.Aurora,
    networkVisible: "Aurora",
    secondsPerBlock: 1,
    gasToken: "ethereum",
    gasTokenSymbol: "eth",
    explorer: "https://explorer.mainnet.aurora.dev",
    rpcs: ["https://mainnet.aurora.dev"],
    multicallAddress: "0x60Ad579Fb20c8896b7b98E800cBA9e196E6eaA44",
    defaultPerformanceFee: 0.1,
    wrappedNativeAddress: "0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB",
  },
  {
    chainId: 1088,
    network: ChainNetwork.Metis,
    networkVisible: "Metis",
    secondsPerBlock: 3.5,
    gasToken: "metis-token",
    gasTokenSymbol: "metis",
    explorer: "https://andromeda-explorer.metis.io",
    rpcs: ["https://andromeda.metis.io/?owner=1088"],
    multicallAddress: "0xa99850Ff94d3D333e7F669203Ab7B77Ec634028F",
    defaultPerformanceFee: 0.042,
    wrappedNativeAddress: "0xdeaddeaddeaddeaddeaddeaddeaddeaddead0000",
  },
  {
    chainId: 1284,
    network: ChainNetwork.Moonbeam,
    networkVisible: "Moonbeam",
    secondsPerBlock: 13.5,
    gasToken: "moonbeam",
    gasTokenSymbol: "glmr",
    explorer: "https://moonbeam.moonscan.io",
    rpcs: ["https://rpc.api.moonbeam.network"],
    multicallAddress: "0xDad6760bd3FC33b741D46df1e205558BB22D1507",
    defaultPerformanceFee: 0.1,
    wrappedNativeAddress: "0xAcc15dC74880C9944775448304B263D191c6077F",
  },
  {
    chainId: 10,
    network: ChainNetwork.Optimism,
    networkVisible: "Optimism",
    secondsPerBlock: 2.78,
    gasToken: "ethereum",
    gasTokenSymbol: "eth",
    explorer: "https://explorer.optimism.io",
    rpcs: ["https://mainnet.optimism.io"],
    multicallAddress: "0xD0E99f15B24F265074747B2A1444eB02b9E30422",
    defaultPerformanceFee: 0.1,
    wrappedNativeAddress: "0x4200000000000000000000000000000000000006",
  },
  {
    chainId: 250,
    network: ChainNetwork.Fantom,
    networkVisible: "Fantom",
    secondsPerBlock: 0.91,
    gasToken: "fantom",
    gasTokenSymbol: "ftm",
    explorer: "https://ftmscan.com",
    rpcs: ["https://rpc.ankr.com/fantom"],
    multicallAddress: "0x11473D6E641dF17cd6331D45b135E35B49edBea8",
    defaultPerformanceFee: 0.042,
    wrappedNativeAddress: "0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83",
  },
  {
    chainId: 100,
    network: ChainNetwork.Gnosis,
    networkVisible: "Gnosis",
    secondsPerBlock: 5,
    gasToken: "xDai",
    gasTokenSymbol: "xDAI",
    explorer: "https://blockscout.com/xdai/mainnet",
    rpcs: ["https://rpc.ankr.com/gnosis"],
    multicallAddress: "0x88b373B83166E72FD55648Ce114712633f1782E2",
    defaultPerformanceFee: 0.042,
    wrappedNativeAddress: "0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d",
  },
  {
    chainId: 2222,
    network: ChainNetwork.Kava,
    networkVisible: "Kava",
    secondsPerBlock: 6.4,
    gasToken: "kava",
    gasTokenSymbol: "KAVA",
    explorer: "https://explorer.kava.io/",
    rpcs: ["https://evm.kava.io"],
    multicallAddress: "0x7c3e2545ad7009d6f053CAa0153137F60685dD32",
    defaultPerformanceFee: 0.1,
    wrappedNativeAddress: "0xc86c7C0eFbd6A49B35E8714C5f59D99De09A225b",
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
  private static secondsPerBlock: Map<ChainNetwork, number> = new Map<
    ChainNetwork,
    number
  >();
  private static SPBStore = new FuncsQueue(); // secondsPerBlock queue flag

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

  static globalInitialize(
    chains: Map<ChainNetwork, ethers.providers.Provider | Signer>,
  ): void {
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
        const provider: ethers.providers.Provider = isSigner
          ? (resolver as Signer).provider
          : (resolver as ethers.providers.Provider);
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

  static getResolver(
    network: ChainNetwork,
  ): ethers.providers.Provider | Signer {
    const chain = Chains.singleton.chainMap.get(network);
    if (!chain) {
      throw new Error(`${network} is not a supported chain`);
    }
    return chain.getProviderOrSigner();
  }

  /**
   * @description Fetches the current network average blocktime value. Should be used inplace of `Chains.get(network).secondsPerBlock`
   */
  static async getAccurateSecondsPerBlock(
    network: ChainNetwork,
    model: PickleModel,
  ): Promise<number> {
    return await this.SPBStore.queue(async () => {
      let secondsPerBlock = this.get(network).secondsPerBlock;
      try {
        const blocksRange = 10000;
        const multiProvider = model.multiproviderFor(network);
        const currentBlock = await multiProvider.getBlock("latest");
        const prevBlock = await multiProvider.getBlock(
          currentBlock.number - blocksRange,
        );
        secondsPerBlock =
          (currentBlock.timestamp - prevBlock.timestamp) / blocksRange;
      } catch (error) {
        // prettier-ignore
        model.logPlatformError(toError(100105, network, "secondsPerBlock", "Chains/getAccurateSecondsPerBlock",``, ''+error, ErrorSeverity.ERROR_4));
      }

      return secondsPerBlock;
    }, network);
  }
}

// This was copied from PickleModel. Importing it results in compilation error
const toError = (
  errorCode: number,
  chain: ChainNetwork | undefined,
  asset: string,
  failedCall: string,
  message: string,
  causeMessage: string,
  severity: ErrorSeverity,
): PlatformError => {
  let chainGot: IChain | undefined = undefined;
  try {
    chainGot = chain ? Chains.get(chain) : undefined;
  } catch (error) {
    // Not found
  }
  return toError2(
    PickleProduct.PFCORE,
    errorCode,
    chainGot ? chainGot.id : -1,
    asset,
    failedCall,
    message,
    causeMessage,
    severity,
  );
};

const toError2 = (
  product: PickleProduct,
  errorCode: number,
  chain: number,
  asset: string,
  failedCall: string,
  message: string,
  causeMessage: string,
  severity: ErrorSeverity,
): PlatformError => {
  return {
    product: product,
    timestamp: Date.now(),
    errorCode,
    chain,
    asset: asset || "",
    failedCall: failedCall || "",
    message: message || failedCall || "",
    causeMessage: causeMessage || "",
    severity,
  };
};
