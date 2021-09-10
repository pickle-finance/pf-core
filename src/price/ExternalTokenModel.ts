import { ChainNetwork } from "../chain/Chains";


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
    etherTokens: Map<string,ExternalToken> = new Map();
    polyTokens: Map<string,ExternalToken> = new Map();

    contractToToken: Map<string,ExternalToken> = new Map();
    constructor() {
        this.etherTokens.set("pickle", new ExternalToken(ChainNetwork.Ethereum, "pickle", "pickle-finance", "0x429881672B9AE42b8EbA0E26cD9C73711b891Ca5".toLowerCase()));
        this.etherTokens.set("comp", new ExternalToken(ChainNetwork.Ethereum, "comp", "compound-governance-token", "0xc00e94cb662c3520282e6f5717214004a7f26888".toLowerCase()));
        this.etherTokens.set("dai", new ExternalToken(ChainNetwork.Ethereum, "dai", "dai", "0x6b175474e89094c44da98b954eedeac495271d0f".toLowerCase()));
        this.etherTokens.set("usdc", new ExternalToken(ChainNetwork.Ethereum, "usdc", "usd-coin", "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48".toLowerCase(), 6));
        this.etherTokens.set("usdt", new ExternalToken(ChainNetwork.Ethereum, "usdt", "tether", "0xdac17f958d2ee523a2206206994597c13d831ec7".toLowerCase(), 6));
        this.etherTokens.set("susd", new ExternalToken(ChainNetwork.Ethereum, "susd", "nusd", "0x57ab1ec28d129707052df4df418d58a2d46d5f51".toLowerCase()));
        this.etherTokens.set("crv", new ExternalToken(ChainNetwork.Ethereum, "crv", "curve-dao-token", "0xD533a949740bb3306d119CC777fa900bA034cd52".toLowerCase()));
        this.etherTokens.set("weth", new ExternalToken(ChainNetwork.Ethereum, "weth", "weth", "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2".toLowerCase()));
        this.etherTokens.set("wbtc", new ExternalToken(ChainNetwork.Ethereum, "wbtc", "wrapped-bitcoin", "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599".toLowerCase(),8));
        this.etherTokens.set("yfi", new ExternalToken(ChainNetwork.Ethereum, "yfi", "yearn-finance", "0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e".toLowerCase()));
        this.etherTokens.set("bac", new ExternalToken(ChainNetwork.Ethereum, "bac", "basis-cash", "0x3449fc1cd036255ba1eb19d65ff4ba2b8903a69a".toLowerCase()));
        this.etherTokens.set("mic", new ExternalToken(ChainNetwork.Ethereum, "mic", "mith-cash", "0x368b3a58b5f49392e5c9e4c998cb0bb966752e51".toLowerCase(), 18, ExternalTokenFetchStyle.NONE));
        this.etherTokens.set("mis", new ExternalToken(ChainNetwork.Ethereum, "mis", "mithril-share", "0x4b4d2e899658fb59b1d518b68fe836b100ee8958".toLowerCase(), 18, ExternalTokenFetchStyle.NONE));
        this.etherTokens.set("ldo", new ExternalToken(ChainNetwork.Ethereum, "ldo", "lido-dao", "0x5a98fcbea516cf06857215779fd812ca3bef1b32".toLowerCase()));
        this.etherTokens.set("yvecrv", new ExternalToken(ChainNetwork.Ethereum, "yvecrv", "vecrv-dao-yvault", "0xc5bddf9843308380375a611c18b50fb9341f502a".toLowerCase()));
        this.etherTokens.set("bas", new ExternalToken(ChainNetwork.Ethereum, "bas", "basis-share", "0x106538cc16f938776c7c180186975bca23875287".toLowerCase()));
        this.etherTokens.set("mir", new ExternalToken(ChainNetwork.Ethereum, "mir", "mirror-protocol", "0x09a3ecafa817268f77be1283176b946c4ff2e608".toLowerCase()));
        this.etherTokens.set("ust", new ExternalToken(ChainNetwork.Ethereum, "ust", "terrausd", "0xa47c8bf37f92abed4a126bda807a7b7498661acd".toLowerCase(), 18, ExternalTokenFetchStyle.ID));
        this.etherTokens.set("mtsla", new ExternalToken(ChainNetwork.Ethereum, "mtsla", "mirrored-tesla", "0x21ca39943e91d704678f5d00b6616650f066fd63".toLowerCase()));
        this.etherTokens.set("maapl", new ExternalToken(ChainNetwork.Ethereum, "maapl", "mirrored-apple", "0xd36932143f6ebdedd872d5fb0651f4b72fd15a84".toLowerCase()));
        this.etherTokens.set("mqqq", new ExternalToken(ChainNetwork.Ethereum, "mqqq", "mirrored-invesco-qqq-trust", "0x13b02c8de71680e71f0820c996e4be43c2f57d15".toLowerCase()));
        this.etherTokens.set("mslv", new ExternalToken(ChainNetwork.Ethereum, "mslv", "mirrored-ishares-silver-trust", "0x9d1555d8cb3c846bb4f7d5b1b1080872c3166676".toLowerCase()));
        this.etherTokens.set("mbaba", new ExternalToken(ChainNetwork.Ethereum, "mbaba", "mirrored-alibaba", "0x56aa298a19c93c6801fdde870fa63ef75cc0af72".toLowerCase()));
        this.etherTokens.set("sushi", new ExternalToken(ChainNetwork.Ethereum, "sushi", "sushi", "0x6b3595068778dd592e39a122f4f5a5cf09c90fe2".toLowerCase()));
        this.etherTokens.set("fei", new ExternalToken(ChainNetwork.Ethereum, "fei", "fei-protocol", "0x956f47f50a910163d8bf957cf5846d573e7f87ca".toLowerCase()));
        this.etherTokens.set("tribe", new ExternalToken(ChainNetwork.Ethereum, "tribe", "tribe-2", "0xc7283b66eb1eb5fb86327f08e1b5816b0720212b".toLowerCase()));
        this.etherTokens.set("lusd", new ExternalToken(ChainNetwork.Ethereum, "lusd", "liquity-usd", "0x5f98805a4e8be255a32880fdec7f6728c6568ba0".toLowerCase()));
        this.etherTokens.set("frax", new ExternalToken(ChainNetwork.Ethereum, "frax", "frax", "0x853d955acef822db058eb8505911ed77f175b99e".toLowerCase()));
        this.etherTokens.set("alcx", new ExternalToken(ChainNetwork.Ethereum, "alcx", "alchemix", "0xdbdb4d16eda451d0503b854cf79d55697f90c8df".toLowerCase()));
        this.etherTokens.set("alusd", new ExternalToken(ChainNetwork.Ethereum, "alusd", "alchemix-usd", "0xBC6DA0FE9aD5f3b0d58160288917AA56653660E9".toLowerCase()));
        this.etherTokens.set("luna", new ExternalToken(ChainNetwork.Ethereum, "luna", "terra-luna", "0x92bf969865c80eda082fd5d8b4e28da4d58e1c3a".toLowerCase()));
        this.etherTokens.set("yvboost", new ExternalToken(ChainNetwork.Ethereum, "yvboost", "yvboost", "0x9d409a0a012cfba9b15f6d4b36ac57a46966ab9a".toLowerCase()));
        this.etherTokens.set("cvx", new ExternalToken(ChainNetwork.Ethereum, "cvx", "convex-finance", "0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b".toLowerCase()));
        this.etherTokens.set("fxs", new ExternalToken(ChainNetwork.Ethereum, "fxs", "frax-share", "0x3432b6a60d23ca0dfca7761b7ab56459d9c964d0".toLowerCase()));
        this.etherTokens.set("lqty", new ExternalToken(ChainNetwork.Ethereum, "lqty", "liquity", "0x6dea81c8171d0ba574754ef6f8b412f2ed88c54d".toLowerCase()));
        this.etherTokens.set("3crv", new ExternalToken(ChainNetwork.Ethereum, "3crv", "lp-3pool-curve", "0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490".toLowerCase()));
        this.etherTokens.set("scrv", new ExternalToken(ChainNetwork.Ethereum, "scrv", "lp-scurve", "0xc25a3a3b969415c80451098fa907ec722572917f".toLowerCase()));
        this.etherTokens.set("spell", new ExternalToken(ChainNetwork.Ethereum, "spell", "spell-token", "0x090185f2135308bad17527004364ebcc2d37e5f6".toLowerCase()));
        this.etherTokens.set("mim", new ExternalToken(ChainNetwork.Ethereum, "mim", "mim", "0x99d8a9c45b2eca8864373a26d1459e3dff1e17f3".toLowerCase()));
        this.etherTokens.set("fox", new ExternalToken(ChainNetwork.Ethereum, "fox", "shapeshift-fox-token", "0xc770eefad204b5180df6a14ee197d99d808ee52d".toLowerCase()));
        this.etherTokens.set("tru", new ExternalToken(ChainNetwork.Ethereum, "tru", "truefi", "0x4C19596f5aAfF459fA38B0f7eD92F11AE6543784".toLowerCase(), 8));
        

        // Polygon
        this.polyTokens.set("usdc", new ExternalToken(ChainNetwork.Polygon, "usdc", "usd-coin", "0x2791bca1f2de4661ed88a30c99a7a9449aa84174".toLowerCase(), 6));
        this.polyTokens.set("weth", new ExternalToken(ChainNetwork.Polygon, "weth", "weth", "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619".toLowerCase()));
        this.polyTokens.set("dai", new ExternalToken(ChainNetwork.Polygon, "dai", "dai", "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063".toLowerCase()));
        this.polyTokens.set("must", new ExternalToken(ChainNetwork.Polygon, "must", "must", "0x9c78ee466d6cb57a4d01fd887d2b5dfb2d46288f".toLowerCase(), 18, ExternalTokenFetchStyle.ID));
        this.polyTokens.set("pickle", new ExternalToken(ChainNetwork.Polygon, "pickle", "pickle-finance", "0x2b88ad57897a8b496595925f43048301c37615da".toLowerCase(), 18, ExternalTokenFetchStyle.ID));
        this.polyTokens.set("matic", new ExternalToken(ChainNetwork.Polygon, "matic", "matic-network", "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270".toLowerCase(), 18, ExternalTokenFetchStyle.ID));
        this.polyTokens.set("sushi", new ExternalToken(ChainNetwork.Polygon, "sushi", "sushi", "0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a".toLowerCase()));
        this.polyTokens.set("usdt", new ExternalToken(ChainNetwork.Polygon, "usdt", "tether", "0xc2132d05d31c914a87c6611c10748aeb04b58e8f".toLowerCase(), 6));
        this.polyTokens.set("mimatic", new ExternalToken(ChainNetwork.Polygon, "mimatic", "mimatic", "0xa3fa99a148fa48d14ed51d610c367c61876997f1".toLowerCase(), 18, ExternalTokenFetchStyle.ID));
        this.polyTokens.set("qi", new ExternalToken(ChainNetwork.Polygon, "qi", "qi-dao", "0x580a84c73811e1839f75d86d75d88cca0c241ff4".toLowerCase(), 18, ExternalTokenFetchStyle.ID));
        this.polyTokens.set("mweth", new ExternalToken(ChainNetwork.Polygon, "mweth", "weth", "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619".toLowerCase(), 18, ExternalTokenFetchStyle.ID));
        this.polyTokens.set("musdt", new ExternalToken(ChainNetwork.Polygon, "musdt", "usdt", "0xc2132D05D31c914a87C6611C10748AEb04B58e8F".toLowerCase(), 6, ExternalTokenFetchStyle.ID));
        this.polyTokens.set("musdc", new ExternalToken(ChainNetwork.Polygon, "musdc", "usdc", "0x2791bca1f2de4661ed88a30c99a7a9449aa84174".toLowerCase(), 6, ExternalTokenFetchStyle.ID));
        this.polyTokens.set("crv", new ExternalToken(ChainNetwork.Polygon, "crv", "curve-dao-token", "0x172370d5cd63279efa6d502dab29171933a610af".toLowerCase(), 18, ExternalTokenFetchStyle.ID));
        this.polyTokens.set("dino", new ExternalToken(ChainNetwork.Polygon, "dino", "dinoswap", "0xAa9654BECca45B5BDFA5ac646c939C62b527D394".toLowerCase(), 18, ExternalTokenFetchStyle.ID));
        this.polyTokens.set("iron", new ExternalToken(ChainNetwork.Polygon, "ice", "iron-finance", "0x4a81f8796e0c6ad4877a51c86693b0de8093f2ef".toLowerCase(), 18, ExternalTokenFetchStyle.ID));
        

        // Make the reverse map to fascilitate contract lookups
        const allTokenList : ExternalToken[] = Array.from(this.polyTokens.values()).concat(Array.from(this.etherTokens.values()));
        for( const oneToken of allTokenList ) {
            this.contractToToken.set(oneToken.contractAddr.toLowerCase(),oneToken);
        }
    }
    
    getTokensById(id: string) : ExternalToken[] {
        const ret: ExternalToken[] = [];
        if( this.etherTokens.get(id))
            ret.push(this.etherTokens.get(id));
        if( this.polyTokens.get(id))
            ret.push(this.polyTokens.get(id));
        return ret;
    }
    
    getTokenCoinGeckoName(id: string) : string {
        return this.etherTokens.get(id) !== undefined ? this.etherTokens.get(id).coingeckoId :
            this.polyTokens.get(id) !== undefined ? this.polyTokens.get(id).coingeckoId :
            undefined;
    }
    findTokenByCoinGeckoName(id: string) : ExternalToken[] {
        const inEther = [...this.etherTokens.values()].filter((value)=>{return value.coingeckoId===id});
        const inPoly = [...this.polyTokens.values()].filter((value)=>{return value.coingeckoId===id});
        
        const matched = inEther.concat(inPoly);
        return matched.length === 0 ? undefined : matched;
    }
    findTokenFromContract(id: string) : ExternalToken | undefined {
        return this.contractToToken.get(id.toLowerCase());
    }

    getToken(id: string, chain: ChainNetwork) : ExternalToken {
        let ret : ExternalToken;
        if( chain === ChainNetwork.Ethereum ) {
            ret = this.etherTokens.get(id);
        } else if( chain === ChainNetwork.Polygon ) {
            ret = this.polyTokens.get(id);
        } 
        if( ret === undefined ) {
            // Search by contract
            if( id.toLowerCase().startsWith("0x")) {
                ret = this.findTokenFromContract(id);
            }
        }
        return ret ? ret : null;
    }

    getTokens(chain: ChainNetwork) : ExternalToken[] {
        if( chain === ChainNetwork.Ethereum )
            return Array.from(this.etherTokens.values());
        if( chain === ChainNetwork.Polygon )
            return Array.from(this.polyTokens.values());
        return null;
    }
}
export const ExternalTokenModelSingleton = new ExternalTokenModel();
