import { AbstractChain } from "./AbstractChain";
import { IChain } from "./IChain";
import { Provider } from "@ethersproject/abstract-provider";
import { Signer } from "@ethersproject/abstract-signer";
import { setMulticallAddress } from "ethers-multicall";

interface RawChain {
  chainId: number,
  network: string,
  secondsPerBlock: number,
  gasToken: string,
  explorer: string,
  rpcs: string[],
  multicallAddress?: string,
}

export enum ChainNetwork {
  Ethereum = 'eth',
  Polygon = 'polygon',
  OKEx = 'okex',
  Arbitrum = 'arbitrum',
  Harmony = 'harmony',
  Moonriver = 'moonriver'
  // ADD_CHAIN 
  //Binance
}
const rawChains : RawChain[] = [
      {
          chainId: 1,
          network: "eth",
          secondsPerBlock: 13,
          gasToken: 'ethereum',
          explorer: "https://etherscan.io",
          rpcs: [
              "https://cloudflare-eth.com/"
          ]
      },
      {
          chainId: 137,
          network: "polygon",
          secondsPerBlock: 2,
          gasToken: 'matic-network',
          explorer: "https://polygonscan.com",
          rpcs: [
              "https://polygon-rpc.com",
              "https://rpc-mainnet.maticvigil.com",
              "https://matic-mainnet.chainstacklabs.com/",
              "https://rpc-mainnet.matic.network"
          ]
      },
      {
          chainId: 66,
          network: "okex",
          secondsPerBlock: 3,
          gasToken: 'oec-token',
          explorer: "https://oklink.com/okexchain",
          rpcs: [
              "https://exchainrpc.okex.org"
          ],
          multicallAddress: "0x94fEadE0D3D832E4A05d459eBeA9350c6cDd3bCa"
      },
      {
          chainId: 42161,
          network: "arbitrum",
          secondsPerBlock: 13,
          gasToken: 'ethereum',
          explorer: "https://arbiscan.io",
          rpcs: [
              "https://arb1.arbitrum.io/rpc"
          ],
          multicallAddress: "0x813715eF627B01f4931d8C6F8D2459F26E19137E"
      },
      {
          chainId: 1666600000,
          network: "harmony",
          secondsPerBlock: 2,
          gasToken: 'harmony',
          explorer: "https://explorer.harmony.one/",
          rpcs: [
              "https://api.harmony.one"
          ],
          multicallAddress: "0x5e9e5eea23b37a0d37d6dcac2f1edfba5cbc84f9"
      },
      {
        chainId: 1285,
        network: "moonriver",
        secondsPerBlock: 14,
        gasToken: 'moonriver',
        explorer: "https://moonriver.moonscan.io",
        rpcs: [
            "https://rpc.moonriver.moonbeam.network"
        ],
        multicallAddress: "0x4c4a5d20f1ee40eaacb6a7787d20d16b7997363b"
    },
      // ADD_CHAIN
  ];
export class JsonChain extends AbstractChain {
  constructor(raw: RawChain ) {
    super(raw.chainId, raw.network, raw.secondsPerBlock, raw.explorer, raw.rpcs, raw.multicallAddress);
  }
}
export class Chains {
    private static singleton: Chains = new Chains();

    chainData : Map<ChainNetwork,AbstractChain> = new Map<ChainNetwork, AbstractChain>();
    private constructor() {
        Chains.singleton = this;
        for( const i in ChainNetwork ) {
          const foundRawChain = rawChains.find((x)=>x.network === ChainNetwork[i]);
          if( foundRawChain ) {
            this.chainData.set(ChainNetwork[i], new JsonChain(foundRawChain));
          }
        }
    }

    static list() : ChainNetwork[] {
      return [...Chains.singleton.chainData.keys()];
    }

    static globalInitialize(chains: Map<ChainNetwork, Provider | Signer>) : void {
      for( let i = 0; i < rawChains.length; i++ ) {
        if( rawChains[i].multicallAddress ) {
          setMulticallAddress(rawChains[i].chainId, rawChains[i].multicallAddress);
        }
      }

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
