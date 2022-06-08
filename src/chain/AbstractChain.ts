import { ethers, Signer } from "ethers";
import { RawChain } from "./Chains";
import { IChain } from "./IChain";

export abstract class AbstractChain implements IChain {
  id: number;
  name: string;
  explorer: string;
  rpcProviderUrls: string[];
  secondsPerBlock: number;
  multicallAddress?: string;
  gasToken: string;
  defaultPerformanceFee: number;
  wrappedNativeAddress: string;
  private preferredProvider: ethers.providers.Provider;
  private signer: Signer;
  constructor(rawChain: RawChain) {
    this.secondsPerBlock = rawChain.secondsPerBlock;
    this.id = rawChain.chainId;
    this.name = rawChain.network;
    this.explorer = rawChain.explorer;
    this.rpcProviderUrls = rawChain.rpcs;
    this.gasToken = rawChain.gasToken;
    this.defaultPerformanceFee = rawChain.defaultPerformanceFee;
    this.wrappedNativeAddress = rawChain.wrappedNativeAddress;
    if (rawChain.multicallAddress)
      this.multicallAddress = rawChain.multicallAddress;
  }
  getRandomWeb3Provider(): ethers.providers.Provider {
    const url: string =
      this.rpcProviderUrls[~~(Math.random() * this.rpcProviderUrls.length)];
    return this.asProvider(url);
  }
  private asProvider(s: string): ethers.providers.Provider {
    return new ethers.providers.JsonRpcProvider(s);
  }

  setSigner(signer: Signer): void {
    this.signer = signer;
  }
  setPreferredWeb3Provider(provider: ethers.providers.Provider): void {
    this.preferredProvider = provider;
  }
  getPreferredWeb3Provider(): ethers.providers.Provider {
    return this.preferredProvider !== undefined
      ? this.preferredProvider
      : this.signer !== undefined && this.signer.provider
      ? this.signer.provider
      : this.getRandomWeb3Provider();
  }
  getProviderOrSigner(): ethers.providers.Provider | Signer {
    return this.signer !== undefined
      ? this.signer
      : this.preferredProvider !== undefined
      ? this.preferredProvider
      : this.getRandomWeb3Provider();
  }
}
