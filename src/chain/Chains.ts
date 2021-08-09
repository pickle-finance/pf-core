import Web3 from "web3";
import { AbstractChain } from "./AbstractChain";
import { IChain } from "./IChain";

export enum ChainNetwork {
    Ethereum = 'Ethereum',
    Polygon = 'Polygon',
    //Binance
}

export class EthereumChain extends AbstractChain {
    constructor() {
        super(1, ChainNetwork.Ethereum, ["https://cloudflare-eth.com/"]);
    }
}

export class PolygonChain extends AbstractChain {
    constructor() {
        super(137, ChainNetwork.Polygon, [
            'https://rpc-mainnet.maticvigil.com',
            'https://matic-mainnet.chainstacklabs.com/',
            'https://rpc-mainnet.matic.network',
        ]);
    }
}

export class Chains {
    private static singleton: Chains = new Chains();

    chainData : Map<ChainNetwork,AbstractChain> = new Map<ChainNetwork, AbstractChain>();
    private constructor() {
        Chains.singleton = this;
        this.chainData.set(ChainNetwork.Ethereum, new EthereumChain());
        this.chainData.set(ChainNetwork.Polygon, new PolygonChain());
    }

    static get(network: ChainNetwork) : IChain {
        const chain = Chains.singleton.chainData.get(network);
        if (!chain) {
          throw new Error(`${network} is not a supported chain`);
        }
        return chain;
      }
}
