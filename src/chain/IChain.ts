import { Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';

export interface IChain {
    readonly id: number,
    readonly name: string,
    readonly rpcProviderUrls: string[]
    getPreferredWeb3Provider() : Provider;
    setPreferredWeb3Provider(provider: Provider);
    getRandomWeb3Provider() : Provider;
    setSigner(signer: Signer);
    getProviderOrSigner() : Provider | Signer;
}