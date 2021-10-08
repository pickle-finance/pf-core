import { ChainNetwork, Chains } from "../chain/Chains";


export enum ExternalTokenFetchStyle {
    CONTRACT=1,
    ID=2,
    BOTH=3,
    NONE=4
}
export class ExternalToken {
    chain: ChainNetwork;
    id: string;
    coingeckoId: string;
    contractAddr: string;
    decimals: number;
    fetchType: ExternalTokenFetchStyle;
    constructor(chain: ChainNetwork, id: string, cgid: string, addr: string, 
        dec = 18, style: ExternalTokenFetchStyle = ExternalTokenFetchStyle.BOTH) {
        this.chain = chain;
        this.id = id;
        this.coingeckoId = cgid;
        this.contractAddr = addr;
        this.decimals = dec;
        this.fetchType = style;
    }
}

export class ExternalTokenModel {

    // ADD_CHAIN
    chainTokens: Map<ChainNetwork, Map<string,ExternalToken>> = new Map();

    contractToToken: Map<string,ExternalToken> = new Map();
    constructor() {
        const chains = Chains.list();
        for( let i = 0; i < chains.length; i++ ) {
            this.chainTokens.set(chains[i], new Map());
        }
        const etherTokens: Map<string,ExternalToken> = this.chainTokens.get(ChainNetwork.Ethereum);
        etherTokens.set("pickle", new ExternalToken(ChainNetwork.Ethereum, "pickle", "pickle-finance", "0x429881672B9AE42b8EbA0E26cD9C73711b891Ca5".toLowerCase()));
        etherTokens.set("comp", new ExternalToken(ChainNetwork.Ethereum, "comp", "compound-governance-token", "0xc00e94cb662c3520282e6f5717214004a7f26888".toLowerCase()));
        etherTokens.set("dai", new ExternalToken(ChainNetwork.Ethereum, "dai", "dai", "0x6b175474e89094c44da98b954eedeac495271d0f".toLowerCase()));
        etherTokens.set("usdc", new ExternalToken(ChainNetwork.Ethereum, "usdc", "usd-coin", "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48".toLowerCase(), 6));
        etherTokens.set("usdt", new ExternalToken(ChainNetwork.Ethereum, "usdt", "tether", "0xdac17f958d2ee523a2206206994597c13d831ec7".toLowerCase(), 6));
        etherTokens.set("susd", new ExternalToken(ChainNetwork.Ethereum, "susd", "nusd", "0x57ab1ec28d129707052df4df418d58a2d46d5f51".toLowerCase()));
        etherTokens.set("crv", new ExternalToken(ChainNetwork.Ethereum, "crv", "curve-dao-token", "0xD533a949740bb3306d119CC777fa900bA034cd52".toLowerCase()));
        etherTokens.set("weth", new ExternalToken(ChainNetwork.Ethereum, "weth", "weth", "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2".toLowerCase()));
        etherTokens.set("wbtc", new ExternalToken(ChainNetwork.Ethereum, "wbtc", "wrapped-bitcoin", "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599".toLowerCase(),8));
        etherTokens.set("yfi", new ExternalToken(ChainNetwork.Ethereum, "yfi", "yearn-finance", "0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e".toLowerCase()));
        etherTokens.set("bac", new ExternalToken(ChainNetwork.Ethereum, "bac", "basis-cash", "0x3449fc1cd036255ba1eb19d65ff4ba2b8903a69a".toLowerCase()));
        etherTokens.set("mic", new ExternalToken(ChainNetwork.Ethereum, "mic", "mith-cash", "0x368b3a58b5f49392e5c9e4c998cb0bb966752e51".toLowerCase(), 18, ExternalTokenFetchStyle.NONE));
        etherTokens.set("mis", new ExternalToken(ChainNetwork.Ethereum, "mis", "mithril-share", "0x4b4d2e899658fb59b1d518b68fe836b100ee8958".toLowerCase(), 18, ExternalTokenFetchStyle.NONE));
        etherTokens.set("ldo", new ExternalToken(ChainNetwork.Ethereum, "ldo", "lido-dao", "0x5a98fcbea516cf06857215779fd812ca3bef1b32".toLowerCase()));
        etherTokens.set("yvecrv", new ExternalToken(ChainNetwork.Ethereum, "yvecrv", "vecrv-dao-yvault", "0xc5bddf9843308380375a611c18b50fb9341f502a".toLowerCase()));
        etherTokens.set("bas", new ExternalToken(ChainNetwork.Ethereum, "bas", "basis-share", "0x106538cc16f938776c7c180186975bca23875287".toLowerCase()));
        etherTokens.set("mir", new ExternalToken(ChainNetwork.Ethereum, "mir", "mirror-protocol", "0x09a3ecafa817268f77be1283176b946c4ff2e608".toLowerCase()));
        etherTokens.set("ust", new ExternalToken(ChainNetwork.Ethereum, "ust", "terrausd", "0xa47c8bf37f92abed4a126bda807a7b7498661acd".toLowerCase(), 18, ExternalTokenFetchStyle.ID));
        etherTokens.set("mtsla", new ExternalToken(ChainNetwork.Ethereum, "mtsla", "mirrored-tesla", "0x21ca39943e91d704678f5d00b6616650f066fd63".toLowerCase()));
        etherTokens.set("maapl", new ExternalToken(ChainNetwork.Ethereum, "maapl", "mirrored-apple", "0xd36932143f6ebdedd872d5fb0651f4b72fd15a84".toLowerCase()));
        etherTokens.set("mqqq", new ExternalToken(ChainNetwork.Ethereum, "mqqq", "mirrored-invesco-qqq-trust", "0x13b02c8de71680e71f0820c996e4be43c2f57d15".toLowerCase()));
        etherTokens.set("mslv", new ExternalToken(ChainNetwork.Ethereum, "mslv", "mirrored-ishares-silver-trust", "0x9d1555d8cb3c846bb4f7d5b1b1080872c3166676".toLowerCase()));
        etherTokens.set("mbaba", new ExternalToken(ChainNetwork.Ethereum, "mbaba", "mirrored-alibaba", "0x56aa298a19c93c6801fdde870fa63ef75cc0af72".toLowerCase()));
        etherTokens.set("sushi", new ExternalToken(ChainNetwork.Ethereum, "sushi", "sushi", "0x6b3595068778dd592e39a122f4f5a5cf09c90fe2".toLowerCase()));
        etherTokens.set("fei", new ExternalToken(ChainNetwork.Ethereum, "fei", "fei-protocol", "0x956f47f50a910163d8bf957cf5846d573e7f87ca".toLowerCase()));
        etherTokens.set("tribe", new ExternalToken(ChainNetwork.Ethereum, "tribe", "tribe-2", "0xc7283b66eb1eb5fb86327f08e1b5816b0720212b".toLowerCase()));
        etherTokens.set("lusd", new ExternalToken(ChainNetwork.Ethereum, "lusd", "liquity-usd", "0x5f98805a4e8be255a32880fdec7f6728c6568ba0".toLowerCase()));
        etherTokens.set("frax", new ExternalToken(ChainNetwork.Ethereum, "frax", "frax", "0x853d955acef822db058eb8505911ed77f175b99e".toLowerCase()));
        etherTokens.set("alcx", new ExternalToken(ChainNetwork.Ethereum, "alcx", "alchemix", "0xdbdb4d16eda451d0503b854cf79d55697f90c8df".toLowerCase()));
        etherTokens.set("alusd", new ExternalToken(ChainNetwork.Ethereum, "alusd", "alchemix-usd", "0xBC6DA0FE9aD5f3b0d58160288917AA56653660E9".toLowerCase()));
        etherTokens.set("luna", new ExternalToken(ChainNetwork.Ethereum, "luna", "terra-luna", "0x92bf969865c80eda082fd5d8b4e28da4d58e1c3a".toLowerCase()));
        etherTokens.set("yvboost", new ExternalToken(ChainNetwork.Ethereum, "yvboost", "yvboost", "0x9d409a0a012cfba9b15f6d4b36ac57a46966ab9a".toLowerCase()));
        etherTokens.set("cvx", new ExternalToken(ChainNetwork.Ethereum, "cvx", "convex-finance", "0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b".toLowerCase()));
        etherTokens.set("fxs", new ExternalToken(ChainNetwork.Ethereum, "fxs", "frax-share", "0x3432b6a60d23ca0dfca7761b7ab56459d9c964d0".toLowerCase()));
        etherTokens.set("lqty", new ExternalToken(ChainNetwork.Ethereum, "lqty", "liquity", "0x6dea81c8171d0ba574754ef6f8b412f2ed88c54d".toLowerCase()));
        etherTokens.set("3crv", new ExternalToken(ChainNetwork.Ethereum, "3crv", "lp-3pool-curve", "0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490".toLowerCase()));
        etherTokens.set("scrv", new ExternalToken(ChainNetwork.Ethereum, "scrv", "lp-scurve", "0xc25a3a3b969415c80451098fa907ec722572917f".toLowerCase()));
        etherTokens.set("spell", new ExternalToken(ChainNetwork.Ethereum, "spell", "spell-token", "0x090185f2135308bad17527004364ebcc2d37e5f6".toLowerCase()));
        etherTokens.set("mim", new ExternalToken(ChainNetwork.Ethereum, "mim", "magic-internet-money", "0x99d8a9c45b2eca8864373a26d1459e3dff1e17f3".toLowerCase()));
        etherTokens.set("fox", new ExternalToken(ChainNetwork.Ethereum, "fox", "shapeshift-fox-token", "0xc770eefad204b5180df6a14ee197d99d808ee52d".toLowerCase()));
        etherTokens.set("tru", new ExternalToken(ChainNetwork.Ethereum, "tru", "truefi", "0x4C19596f5aAfF459fA38B0f7eD92F11AE6543784".toLowerCase(), 8));
        etherTokens.set("rly", new ExternalToken(ChainNetwork.Ethereum, "rly", "rally-2", "0xf1f955016ecbcd7321c7266bccfb96c68ea5e49b".toLowerCase(), 18));
        etherTokens.set("cvxcrv", new ExternalToken(ChainNetwork.Ethereum, "cvxcrv", "convex-crv", "0x62b9c7356a2dc64a1969e19c23e4f579f9810aa7".toLowerCase(), 18));

        // Polygon
        const polyTokens: Map<string,ExternalToken> = this.chainTokens.get(ChainNetwork.Polygon);
        polyTokens.set("usdc", new ExternalToken(ChainNetwork.Polygon, "usdc", "usd-coin", "0x2791bca1f2de4661ed88a30c99a7a9449aa84174".toLowerCase(), 6));
        polyTokens.set("weth", new ExternalToken(ChainNetwork.Polygon, "weth", "weth", "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619".toLowerCase()));
        polyTokens.set("dai", new ExternalToken(ChainNetwork.Polygon, "dai", "dai", "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063".toLowerCase()));
        polyTokens.set("must", new ExternalToken(ChainNetwork.Polygon, "must", "must", "0x9c78ee466d6cb57a4d01fd887d2b5dfb2d46288f".toLowerCase(), 18, ExternalTokenFetchStyle.ID));
        polyTokens.set("pickle", new ExternalToken(ChainNetwork.Polygon, "pickle", "pickle-finance", "0x2b88ad57897a8b496595925f43048301c37615da".toLowerCase(), 18, ExternalTokenFetchStyle.ID));
        polyTokens.set("matic", new ExternalToken(ChainNetwork.Polygon, "matic", "matic-network", "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270".toLowerCase(), 18, ExternalTokenFetchStyle.ID));
        polyTokens.set("sushi", new ExternalToken(ChainNetwork.Polygon, "sushi", "sushi", "0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a".toLowerCase()));
        polyTokens.set("usdt", new ExternalToken(ChainNetwork.Polygon, "usdt", "tether", "0xc2132d05d31c914a87c6611c10748aeb04b58e8f".toLowerCase(), 6));
        polyTokens.set("mimatic", new ExternalToken(ChainNetwork.Polygon, "mimatic", "mimatic", "0xa3fa99a148fa48d14ed51d610c367c61876997f1".toLowerCase(), 18, ExternalTokenFetchStyle.ID));
        polyTokens.set("qi", new ExternalToken(ChainNetwork.Polygon, "qi", "qi-dao", "0x580a84c73811e1839f75d86d75d88cca0c241ff4".toLowerCase(), 18, ExternalTokenFetchStyle.ID));
        polyTokens.set("mweth", new ExternalToken(ChainNetwork.Polygon, "mweth", "weth", "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619".toLowerCase(), 18, ExternalTokenFetchStyle.ID));
        polyTokens.set("musdt", new ExternalToken(ChainNetwork.Polygon, "musdt", "usdt", "0xc2132D05D31c914a87C6611C10748AEb04B58e8F".toLowerCase(), 6, ExternalTokenFetchStyle.ID));
        polyTokens.set("musdc", new ExternalToken(ChainNetwork.Polygon, "musdc", "usdc", "0x2791bca1f2de4661ed88a30c99a7a9449aa84174".toLowerCase(), 6, ExternalTokenFetchStyle.ID));
        polyTokens.set("crv", new ExternalToken(ChainNetwork.Polygon, "crv", "curve-dao-token", "0x172370d5cd63279efa6d502dab29171933a610af".toLowerCase(), 18, ExternalTokenFetchStyle.ID));
        polyTokens.set("dino", new ExternalToken(ChainNetwork.Polygon, "dino", "dinoswap", "0xAa9654BECca45B5BDFA5ac646c939C62b527D394".toLowerCase(), 18, ExternalTokenFetchStyle.ID));
        polyTokens.set("iron", new ExternalToken(ChainNetwork.Polygon, "ice", "iron-finance", "0x4a81f8796e0c6ad4877a51c86693b0de8093f2ef".toLowerCase(), 18, ExternalTokenFetchStyle.ID));
        
        // Arbitrum
        const arbitrumTokens: Map<string,ExternalToken> = this.chainTokens.get(ChainNetwork.Arbitrum);
        arbitrumTokens.set("spell", new ExternalToken(ChainNetwork.Arbitrum, "spell", "spell-token", '0x3e6648c5a70a150a88bce65f4ad4d506fe15d2af'.toLowerCase(), 18, ExternalTokenFetchStyle.ID));
        arbitrumTokens.set("weth", new ExternalToken(ChainNetwork.Arbitrum, "weth", "weth", '0x82af49447d8a07e3bd95bd0d56f35241523fbab1'.toLowerCase(), 18, ExternalTokenFetchStyle.ID));
        arbitrumTokens.set("sushi", new ExternalToken(ChainNetwork.Arbitrum, "sushi", "sushi", '0xd4d42f0b6def4ce0383636770ef773390d85c61a'.toLowerCase(), 18, ExternalTokenFetchStyle.ID));
        arbitrumTokens.set("mim", new ExternalToken(ChainNetwork.Arbitrum, "mim", "magic-internet-money", '0xfea7a6a0b346362bf88a9e4a88416b77a57d6c2a'.toLowerCase(), 18, ExternalTokenFetchStyle.ID));
        arbitrumTokens.set("crv", new ExternalToken(ChainNetwork.Arbitrum, "crv", "curve-dao-token", '0x11cdb42b0eb46d95f990bedd4695a6e3fa034978'.toLowerCase(), 18, ExternalTokenFetchStyle.ID));
        arbitrumTokens.set("wbtc", new ExternalToken(ChainNetwork.Arbitrum, "wbtc", "wrapped-bitcoin", '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f'.toLowerCase(), 8, ExternalTokenFetchStyle.ID));
        arbitrumTokens.set("usdt", new ExternalToken(ChainNetwork.Arbitrum, "usdt", "usdt", '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9'.toLowerCase(), 6, ExternalTokenFetchStyle.ID));
        arbitrumTokens.set("weth", new ExternalToken(ChainNetwork.Arbitrum, "weth", "weth", '0x82af49447d8a07e3bd95bd0d56f35241523fbab1'.toLowerCase(), 18, ExternalTokenFetchStyle.ID));
        arbitrumTokens.set("2crv", new ExternalToken(ChainNetwork.Arbitrum, "2crv", "2crv", '0xbf7e49483881c76487b0989cd7d9a8239b20ca41'.toLowerCase(), 18, ExternalTokenFetchStyle.NONE));
        arbitrumTokens.set("dodo", new ExternalToken(ChainNetwork.Arbitrum, "dodo", "dodo", '0x69eb4fa4a2fbd498c257c57ea8b7655a2559a581'.toLowerCase(), 18, ExternalTokenFetchStyle.ID));
        arbitrumTokens.set("hnd", new ExternalToken(ChainNetwork.Arbitrum, "hnd", "hundred-finance", '0x10010078a54396f62c96df8532dc2b4847d47ed3'.toLowerCase(), 18, ExternalTokenFetchStyle.ID));
        

        // Make the reverse map to fascilitate contract lookups
        const tokenMaps: Map<string,ExternalToken>[] = this.allChainMaps();
        const allTokenList:ExternalToken[] = [];
        for( let i = 0; i < tokenMaps.length; i++ ) {
            allTokenList.push(...tokenMaps[i].values());
        }
        for( const oneToken of allTokenList ) {
            this.contractToToken.set(oneToken.contractAddr.toLowerCase(),oneToken);
        }
    }

    mapForChain(chain: ChainNetwork) : Map<string,ExternalToken> {
        return this.chainTokens.get(chain);
    }

    allChainMaps() : Map<string,ExternalToken>[] {
        const ret : Map<string, ExternalToken>[] = [];
        const chains : ChainNetwork[] = Chains.list();
        for( let i = 0; i < chains.length; i++ ) {
            const m1 : Map<string,ExternalToken> = this.mapForChain(chains[i]);
            if( m1 ) {
                ret.push(m1);
            }
        }
        return ret;
    }

    getTokensById(id: string) : ExternalToken[] {
        const ret: ExternalToken[] = [];
        const chainTokens : Map<string,ExternalToken>[] = this.allChainMaps();
        for( let i = 0; i < chainTokens.length; i++ ) {
            const tokenInChain : ExternalToken = chainTokens[i].get(id);
            if( tokenInChain) 
                ret.push(tokenInChain);
        }
        return ret;
    }
    
    getTokenCoinGeckoName(id: string) : string {
        const chainTokens : Map<string,ExternalToken>[] = this.allChainMaps();
        for( let i = 0; i < chainTokens.length; i++ ) {
            if( chainTokens[i].get(id)) {
                return  chainTokens[i].get(id).coingeckoId;
            }
        }
        return undefined;
    }
    findTokenByCoinGeckoName(id: string) : ExternalToken[] {
        const chainMaps : Map<string,ExternalToken>[] = this.allChainMaps();
        const ret = [];
        for( let i = 0; i < chainMaps.length; i++ ) {
            const foundInChain = [...chainMaps[i].values()].filter((value)=>{return value.coingeckoId===id});
            if( foundInChain.length > 0 )
                ret.push(...foundInChain);
        }
        return ret.length === 0 ? undefined : ret;
    }
    findTokenFromContract(id: string) : ExternalToken | undefined {
        return this.contractToToken.get(id.toLowerCase());
    }
 
    getToken(id: string, chain: ChainNetwork) : ExternalToken {
        let ret : ExternalToken = this.mapForChain(chain)?.get(id);
        if( ret === undefined ) {
            // Search by contract
            if( id.toLowerCase().startsWith("0x")) {
                ret = this.findTokenFromContract(id);
            }
        }
        return ret ? ret : null;
    }

    getTokens(chain: ChainNetwork) : ExternalToken[] {
        const mapForChain : Map<string,ExternalToken>  = this.mapForChain(chain);
        return mapForChain ? [...mapForChain.values()] : null;
    }
}
export const ExternalTokenModelSingleton = new ExternalTokenModel();
