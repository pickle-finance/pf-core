import { Provider } from "@ethersproject/abstract-provider";
import { Signer } from "@ethersproject/abstract-signer";
import { ethers, providers } from "ethers";
import { IChain } from "./IChain";

export abstract class AbstractChain implements IChain {
    id: number;
    name: string;
    explorer: string;
    rpcProviderUrls: string[];
    secondsPerBlock: number;
    private preferredProvider : Provider;
    private signer : Signer;
    constructor(id: number, name: string, 
        secondsPerBlock: number,
        explorer: string, rpcProviderUrls: string[]) {
        this.secondsPerBlock = secondsPerBlock;
        this.id = id;
        this.name = name;
        this.explorer = explorer;
        this.rpcProviderUrls = rpcProviderUrls;
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
    setPreferredWeb3Provider(provider: Provider) {
        this.preferredProvider = provider;
    }
    getPreferredWeb3Provider(): Provider {
        return this.preferredProvider !== undefined ? this.preferredProvider :
                this.signer !== undefined && this.signer.provider ? this.signer.provider : 
                 this.getRandomWeb3Provider();
    }
    getProviderOrSigner(): Provider | Signer {
        return this.signer !== undefined ? this.signer : 
            this.preferredProvider !== undefined ? this.preferredProvider : this.getRandomWeb3Provider();
    }

}