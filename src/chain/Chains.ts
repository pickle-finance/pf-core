import { AbstractChain } from "./AbstractChain";
import { IChain } from "./IChain";
import { Provider } from "@ethersproject/abstract-provider";
import { Signer } from "@ethersproject/abstract-signer";
import { ethers } from "exchain-ethers";
import { setMulticallAddress } from "ethers-multicall";
export const POLYGON_SECONDS_PER_BLOCK = 2;
export const ARBITRUM_SECONDS_PER_BLOCK = 13;
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
          'https://polygon-rpc.com',
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
  getRandomWeb3Provider(): Provider {
    const url: string =
      this.rpcProviderUrls[~~(Math.random() * this.rpcProviderUrls.length)];
    return new ethers.providers.JsonRpcProvider(url);
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
        this.chainData.set(ChainNetwork.OKEx, new OKExChain());
    }

    static list() : ChainNetwork[] {
      return [...Chains.singleton.chainData.keys()];
    }

    static globalInitialize(chains: Map<ChainNetwork, Provider | Signer>) {
      // ADD_CHAIN 
      setMulticallAddress(66, "0x94fEadE0D3D832E4A05d459eBeA9350c6cDd3bCa");
      setMulticallAddress(42161, '0x813715eF627B01f4931d8C6F8D2459F26E19137E');

      for(const key of Chains.list()) {
        const resolver = chains.get(key);
        if( resolver ) {
            const isSigner : boolean = (resolver as Signer).provider !== undefined;
            const signer : Signer = isSigner ? (resolver as Signer) : undefined;
            const provider : Provider = isSigner ? (resolver as Signer).provider : (resolver as Provider);
            if( signer ) 
                Chains.get(key).setSigner(signer);
            if( provider) 
                Chains.get(key).setPreferredWeb3Provider(provider);
        } else {
            Chains.get(key).setPreferredWeb3Provider(Chains.get(key).getRandomWeb3Provider());
        }
    }
  }

    
    static get(network: ChainNetwork) : IChain {
      const chain = Chains.singleton.chainData.get(network);
      if (!chain) {
        throw new Error(`${network} is not a supported chain`);
      }
      return chain;
    }
    static fromId(id: number) : IChain {
      for (const [key, value] of Chains.singleton.chainData) {
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
