import { Provider } from "@ethersproject/abstract-provider";
import { Signer } from "@ethersproject/abstract-signer";
import { ethers } from "ethers";
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
  private preferredProvider: Provider;
  private signer: Signer;
  constructor(rawChain: RawChain) {
    this.secondsPerBlock = rawChain.secondsPerBlock;
    this.id = rawChain.chainId;
    this.name = rawChain.network;
    this.explorer = rawChain.explorer;
    this.rpcProviderUrls = rawChain.rpcs;
    this.gasToken = rawChain.gasToken;
    this.defaultPerformanceFee = rawChain.defaultPerformanceFee;
    if( rawChain.multicallAddress )
      this.multicallAddress = rawChain.multicallAddress;
  }
  getRandomWeb3Provider(): Provider {
    const url: string =
      this.rpcProviderUrls[~~(Math.random() * this.rpcProviderUrls.length)];
    return this.asProvider(url);
  }
  private asProvider(s: string): Provider {
    return new ethers.providers.JsonRpcProvider(s);
  }

  setSigner(signer: Signer) : void {
    this.signer = signer;
  }
  setPreferredWeb3Provider(provider: Provider) : void {
    this.preferredProvider = provider;
  }
  getPreferredWeb3Provider(): Provider {
    return this.preferredProvider !== undefined
      ? this.preferredProvider
      : this.signer !== undefined && this.signer.provider
      ? this.signer.provider
      : this.getRandomWeb3Provider();
  }
  getProviderOrSigner(): Provider | Signer {
    return this.signer !== undefined
      ? this.signer
      : this.preferredProvider !== undefined
      ? this.preferredProvider
      : this.getRandomWeb3Provider();
  }
}
