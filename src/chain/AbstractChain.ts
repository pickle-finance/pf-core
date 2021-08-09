import { Provider } from "@ethersproject/abstract-provider";
import { Signer } from "@ethersproject/abstract-signer";
import { ethers, providers } from "ethers";
import Web3 from "web3";
import { IChain } from "./IChain";

export abstract class AbstractChain implements IChain {
    id: number;
    name: string;
    rpcProviderUrls: string[];
    private preferredProvider : Provider;
    private signer : Signer;
    constructor(id: number, name: string, rpcProviderUrls: string[]) {
        this.id = id;
        this.name = name;
        this.rpcProviderUrls = rpcProviderUrls;
    }
    setPreferredWeb3Provider(provider: Provider) {
        this.preferredProvider = provider;
    }
    getPreferredWeb3Provider(): Provider {
        return this.preferredProvider;
    }
    getRandomWeb3Provider(): Provider {
        const url: string = this.rpcProviderUrls[~~(Math.random() * this.rpcProviderUrls.length)];
        return this.asProvider(url);
    }
    private asProvider(s: string) : Provider {
        return new ethers.providers.JsonRpcProvider(s);
    }

    setSigner(signer: Signer) {
        this.signer = signer;
    }
    getProviderOrSigner(): Provider | Signer {
        return this.signer !== undefined ? this.signer : 
            this.preferredProvider !== undefined ? this.preferredProvider : this.getRandomWeb3Provider();
    }

}