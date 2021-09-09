import Web3 from "web3";
import { AbstractChain } from "./AbstractChain";
import { IChain } from "./IChain";
import { Provider } from "@ethersproject/abstract-provider";
import { Signer } from "@ethersproject/abstract-signer";

export enum ChainNetwork {
    Ethereum = 'Ethereum',
    Polygon = 'Polygon',
    OKEx = 'OKEx',
    //Binance
}

export class EthereumChain extends AbstractChain {
    constructor() {
        super(1, ChainNetwork.Ethereum,  'https://etherscan.io',["https://cloudflare-eth.com/"]);
    }
}

export class PolygonChain extends AbstractChain {
  constructor() {
      super(137, ChainNetwork.Polygon, 'https://polygonscan.com',
        [
          'https://rpc-mainnet.maticvigil.com',
          'https://matic-mainnet.chainstacklabs.com/',
          'https://rpc-mainnet.matic.network',
      ]);
  }
}

export class OKExChain extends AbstractChain {
  constructor() {
      super(66, ChainNetwork.OKEx, 'https://www.oklink.com/okexchain',
        [
          'https://exchainrpc.okex.org'
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
    static fromId(id: number) : IChain {
      for (let [key, value] of Chains.singleton.chainData) {
        if( value.id === id )
          return value;
      }
      throw new Error(`Chain ${id} is not a supported chain`);
    }

      static getResolver(network: ChainNetwork) : Provider | Signer {
        const chain = Chains.singleton.chainData.get(network);
        if (!chain) {
          throw new Error(`${network} is not a supported chain`);
        }
        return chain.getProviderOrSigner();
      }
    }
