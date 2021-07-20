import Web3 from "web3";

export enum Chain {
    Ethereum = 1,
    Polygon,
    //Binance
}

export class ChainModel {
    chainData : Map<Chain,string[]> = new Map<Chain, string[]>();
    constructor() {
        this.chainData.set(Chain.Ethereum, ["https://cloudflare-eth.com/"]);
        this.chainData.set(Chain.Polygon, [
            'https://matic-mainnet.chainstacklabs.com/',
            'https://rpc-mainnet.matic.network',
            'https://rpc-mainnet.maticvigil.com'
        ]);
    }

    getPreferredWeb3Provider(chain: Chain) : Web3 {
        return this.asProvider(this.chainData.get(chain)[0]);
    }
    getRandomWeb3Provider(chain: Chain) : Web3 {
        const arr: string[] = this.chainData.get(chain);
        return this.asProvider(arr[~~(Math.random() * arr.length)]);
    }
    private asProvider(s: string) : Web3 {
        return new Web3(new Web3.providers.HttpProvider(s));
    }

}
export const ChainModelSingleton : ChainModel = new ChainModel();
export async function getBlock(chain: Chain, block: number) {
    return await ChainModelSingleton.getRandomWeb3Provider(chain).eth.getBlock(block);
}
