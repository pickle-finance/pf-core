import Web3 from "web3";
import { AbstractChain } from "./AbstractChain";
import { IChain } from "./IChain";
import { Provider } from "@ethersproject/abstract-provider";
import { Signer } from "@ethersproject/abstract-signer";
export const POLYGON_SECONDS_PER_BLOCK = 2;
export const ARBITRUM_SECONDS_PER_BLOCK = 4;
export const OKEX_SECONDS_PER_BLOCK = 3; // ??? is this right?
export const ETH_SECONDS_PER_BLOCK = 13;
export enum ChainNetwork {
    Ethereum = 'eth',
    Polygon = 'polygon',
    OKEx = 'okex',
    Arbitrum = 'arbitrum',
    //Binance
}

export class EthereumChain extends AbstractChain {
    constructor() {
        super(1, ChainNetwork.Ethereum,  ETH_SECONDS_PER_BLOCK,
          'https://etherscan.io',["https://cloudflare-eth.com/"]);
    }
}

export class PolygonChain extends AbstractChain {
  constructor() {
      super(137, ChainNetwork.Polygon, 
        POLYGON_SECONDS_PER_BLOCK,
        'https://polygonscan.com',
        [
          'https://rpc-mainnet.maticvigil.com',
          'https://matic-mainnet.chainstacklabs.com/',
          'https://rpc-mainnet.matic.network',
      ]);
  }
}

export class OKExChain extends AbstractChain {
  constructor() {
      super(66, ChainNetwork.OKEx, 
        OKEX_SECONDS_PER_BLOCK,
        'https://www.oklink.com/okexchain',
        ['https://exchainrpc.okex.org']);
  }
}


export class ArbitumChain extends AbstractChain {
  constructor() {
      super(42161, ChainNetwork.Arbitrum, 
        ARBITRUM_SECONDS_PER_BLOCK,
        'https://arbiscan.io',
        ['https://arb1.arbitrum.io/rpc']);
  }
}

export class Chains {
    private static singleton: Chains = new Chains();

    chainData : Map<ChainNetwork,AbstractChain> = new Map<ChainNetwork, AbstractChain>();
    private constructor() {
        Chains.singleton = this;
        this.chainData.set(ChainNetwork.Ethereum, new EthereumChain());
        this.chainData.set(ChainNetwork.Polygon, new PolygonChain());
        this.chainData.set(ChainNetwork.Arbitrum, new ArbitumChain());
    }

    static list() : ChainNetwork[] {
      return [...Chains.singleton.chainData.keys()];
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
