import { ChainNetwork, Chains } from "../chain/Chains";
import { IExternalToken } from "../model/PickleModelJson";

export enum ExternalTokenFetchStyle {
  CONTRACT = 1,
  ID = 2,
  BOTH = 3,
  NONE = 4,
  COIN_MARKET_CAP = 5,
  SWAP_PAIRS = 6,
}
export class ExternalToken implements IExternalToken {
  chain: ChainNetwork;
  id: string;
  contractAddr: string;
  decimals: number;
  coingeckoId?: string;
  fetchType?: ExternalTokenFetchStyle;
  swapPairs?: string[];
  isNativeToken?: Boolean;
  constructor(
    chain: ChainNetwork,
    id: string,
    cgid: string,
    addr: string,
    dec = 18,
    style: ExternalTokenFetchStyle = ExternalTokenFetchStyle.BOTH,
    swapPairs: string[] = [],
    isNativeToken: Boolean = false,
  ) {
    this.chain = chain;
    this.id = id;
    this.coingeckoId = cgid;
    this.contractAddr = addr;
    this.decimals = dec;
    this.fetchType = style;
    this.swapPairs = swapPairs;
    this.isNativeToken = isNativeToken;
  }
  toOutputFormat(): IExternalToken {
    return {
      chain: this.chain,
      id: this.id,
      contractAddr: this.contractAddr,
      decimals: this.decimals,
    };
  }
}

export class ExternalTokenModel {
  chainTokens: Map<ChainNetwork, Map<string, ExternalToken>> = new Map();
  contractToToken: Map<string, ExternalToken> = new Map();
  constructor() {
    for (const item in ChainNetwork) {
      if (isNaN(Number(item))) {
        this.chainTokens.set(ChainNetwork[item], new Map());
      }
    }
    this.addToken(
      ChainNetwork.Ethereum,
      "pickle",
      "pickle-finance",
      "0x429881672B9AE42b8EbA0E26cD9C73711b891Ca5".toLowerCase(),
    );
    this.addToken(
      ChainNetwork.Ethereum,
      "comp",
      "compound-governance-token",
      "0xc00e94cb662c3520282e6f5717214004a7f26888".toLowerCase(),
    );
    this.addToken(
      ChainNetwork.Ethereum,
      "dai",
      "dai",
      "0x6b175474e89094c44da98b954eedeac495271d0f".toLowerCase(),
    );
    this.addToken(
      ChainNetwork.Ethereum,
      "usdc",
      "usd-coin",
      "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48".toLowerCase(),
      6,
    );
    this.addToken(
      ChainNetwork.Ethereum,
      "usdt",
      "tether",
      "0xdac17f958d2ee523a2206206994597c13d831ec7".toLowerCase(),
      6,
    );
    this.addToken(
      ChainNetwork.Ethereum,
      "susd",
      "nusd",
      "0x57ab1ec28d129707052df4df418d58a2d46d5f51".toLowerCase(),
    );
    this.addToken(
      ChainNetwork.Ethereum,
      "crv",
      "curve-dao-token",
      "0xD533a949740bb3306d119CC777fa900bA034cd52".toLowerCase(),
    );
    this.addToken(
      ChainNetwork.Ethereum,
      "weth",
      "weth",
      "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2".toLowerCase(),
      18,
      ExternalTokenFetchStyle.BOTH,
      [],
      true,
    );
    this.addToken(
      ChainNetwork.Ethereum,
      "wbtc",
      "wrapped-bitcoin",
      "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599".toLowerCase(),
      8,
    );
    this.addToken(
      ChainNetwork.Ethereum,
      "yfi",
      "yearn-finance",
      "0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e".toLowerCase(),
    );
    this.addToken(
      ChainNetwork.Ethereum,
      "bac",
      "basis-cash",
      "0x3449fc1cd036255ba1eb19d65ff4ba2b8903a69a".toLowerCase(),
    );
    this.addToken(
      ChainNetwork.Ethereum,
      "mic",
      "mith-cash",
      "0x368b3a58b5f49392e5c9e4c998cb0bb966752e51".toLowerCase(),
      18,
      ExternalTokenFetchStyle.NONE,
    );
    this.addToken(
      ChainNetwork.Ethereum,
      "mis",
      "mithril-share",
      "0x4b4d2e899658fb59b1d518b68fe836b100ee8958".toLowerCase(),
      18,
      ExternalTokenFetchStyle.NONE,
    );
    this.addToken(
      ChainNetwork.Ethereum,
      "ldo",
      "lido-dao",
      "0x5a98fcbea516cf06857215779fd812ca3bef1b32".toLowerCase(),
    );
    this.addToken(
      ChainNetwork.Ethereum,
      "yvecrv",
      "vecrv-dao-yvault",
      "0xc5bddf9843308380375a611c18b50fb9341f502a".toLowerCase(),
    );
    this.addToken(
      ChainNetwork.Ethereum,
      "bas",
      "basis-share",
      "0x106538cc16f938776c7c180186975bca23875287".toLowerCase(),
    );
    this.addToken(
      ChainNetwork.Ethereum,
      "mir",
      "mirror-protocol",
      "0x09a3ecafa817268f77be1283176b946c4ff2e608".toLowerCase(),
    );
    this.addToken(
      ChainNetwork.Ethereum,
      "ust",
      "terrausd",
      "0xa47c8bf37f92abed4a126bda807a7b7498661acd".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Ethereum,
      "mtsla",
      "mirrored-tesla",
      "0x21ca39943e91d704678f5d00b6616650f066fd63".toLowerCase(),
    );
    this.addToken(
      ChainNetwork.Ethereum,
      "maapl",
      "mirrored-apple",
      "0xd36932143f6ebdedd872d5fb0651f4b72fd15a84".toLowerCase(),
    );
    this.addToken(
      ChainNetwork.Ethereum,
      "mqqq",
      "mirrored-invesco-qqq-trust",
      "0x13b02c8de71680e71f0820c996e4be43c2f57d15".toLowerCase(),
    );
    this.addToken(
      ChainNetwork.Ethereum,
      "mslv",
      "mirrored-ishares-silver-trust",
      "0x9d1555d8cb3c846bb4f7d5b1b1080872c3166676".toLowerCase(),
    );
    this.addToken(
      ChainNetwork.Ethereum,
      "mbaba",
      "mirrored-alibaba",
      "0x56aa298a19c93c6801fdde870fa63ef75cc0af72".toLowerCase(),
    );
    this.addToken(
      ChainNetwork.Ethereum,
      "sushi",
      "sushi",
      "0x6b3595068778dd592e39a122f4f5a5cf09c90fe2".toLowerCase(),
    );
    this.addToken(
      ChainNetwork.Ethereum,
      "fei",
      "fei-usd",
      "0x956f47f50a910163d8bf957cf5846d573e7f87ca".toLowerCase(),
    );
    this.addToken(
      ChainNetwork.Ethereum,
      "tribe",
      "tribe-2",
      "0xc7283b66eb1eb5fb86327f08e1b5816b0720212b".toLowerCase(),
    );
    this.addToken(
      ChainNetwork.Ethereum,
      "lusd",
      "liquity-usd",
      "0x5f98805a4e8be255a32880fdec7f6728c6568ba0".toLowerCase(),
    );
    this.addToken(
      ChainNetwork.Ethereum,
      "frax",
      "frax",
      "0x853d955acef822db058eb8505911ed77f175b99e".toLowerCase(),
    );
    this.addToken(
      ChainNetwork.Ethereum,
      "alcx",
      "alchemix",
      "0xdbdb4d16eda451d0503b854cf79d55697f90c8df".toLowerCase(),
    );
    this.addToken(
      ChainNetwork.Ethereum,
      "alusd",
      "alchemix-usd",
      "0xBC6DA0FE9aD5f3b0d58160288917AA56653660E9".toLowerCase(),
    );
    this.addToken(
      ChainNetwork.Ethereum,
      "luna",
      "terra-luna",
      "0x92bf969865c80eda082fd5d8b4e28da4d58e1c3a".toLowerCase(),
    );
    this.addToken(
      ChainNetwork.Ethereum,
      "yvboost",
      "yvboost",
      "0x9d409a0a012cfba9b15f6d4b36ac57a46966ab9a".toLowerCase(),
    );
    this.addToken(
      ChainNetwork.Ethereum,
      "cvx",
      "convex-finance",
      "0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b".toLowerCase(),
    );
    this.addToken(
      ChainNetwork.Ethereum,
      "fxs",
      "frax-share",
      "0x3432b6a60d23ca0dfca7761b7ab56459d9c964d0".toLowerCase(),
    );
    this.addToken(
      ChainNetwork.Ethereum,
      "lqty",
      "liquity",
      "0x6dea81c8171d0ba574754ef6f8b412f2ed88c54d".toLowerCase(),
    );
    this.addToken(
      ChainNetwork.Ethereum,
      "3crv",
      "lp-3pool-curve",
      "0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490".toLowerCase(),
    );
    this.addToken(
      ChainNetwork.Ethereum,
      "scrv",
      "lp-scurve",
      "0xc25a3a3b969415c80451098fa907ec722572917f".toLowerCase(),
    );
    this.addToken(
      ChainNetwork.Ethereum,
      "spell",
      "spell-token",
      "0x090185f2135308bad17527004364ebcc2d37e5f6".toLowerCase(),
    );
    this.addToken(
      ChainNetwork.Ethereum,
      "mim",
      "magic-internet-money",
      "0x99d8a9c45b2eca8864373a26d1459e3dff1e17f3".toLowerCase(),
    );
    this.addToken(
      ChainNetwork.Ethereum,
      "fox",
      "shapeshift-fox-token",
      "0xc770eefad204b5180df6a14ee197d99d808ee52d".toLowerCase(),
    );
    this.addToken(
      ChainNetwork.Ethereum,
      "tru",
      "truefi",
      "0x4C19596f5aAfF459fA38B0f7eD92F11AE6543784".toLowerCase(),
      8,
    );
    this.addToken(
      ChainNetwork.Ethereum,
      "rly",
      "rally-2",
      "0xf1f955016ecbcd7321c7266bccfb96c68ea5e49b".toLowerCase(),
      18,
    );
    this.addToken(
      ChainNetwork.Ethereum,
      "cvxcrv",
      "convex-crv",
      "0x62b9c7356a2dc64a1969e19c23e4f579f9810aa7".toLowerCase(),
      18,
    );
    this.addToken(
      ChainNetwork.Ethereum,
      "rbn",
      "ribbon-finance",
      "0x6123b0049f904d730db3c36a31167d9d4121fa6b".toLowerCase(),
      18,
    );
    this.addToken(
      ChainNetwork.Ethereum,
      "newo",
      "new-order",
      "0x1b890fd37cd50bea59346fc2f8ddb7cd9f5fabd5".toLowerCase(),
      18,
    );
    this.addToken(
      ChainNetwork.Ethereum,
      "looks",
      "looksrare",
      "0xf4d2888d29d722226fafa5d9b24f9164c092421e".toLowerCase(),
      18,
    );

    // Polygon
    this.addToken(
      ChainNetwork.Polygon,
      "usdc",
      "usd-coin",
      "0x2791bca1f2de4661ed88a30c99a7a9449aa84174".toLowerCase(),
      6,
    );
    this.addToken(
      ChainNetwork.Polygon,
      "weth",
      "weth",
      "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619".toLowerCase(),
    );
    this.addToken(
      ChainNetwork.Polygon,
      "usdt",
      "tether",
      "0xc2132d05d31c914a87c6611c10748aeb04b58e8f".toLowerCase(),
      6,
    );
    this.addToken(
      ChainNetwork.Polygon,
      "wbtc",
      "wrapped-bitcoin",
      "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6".toLowerCase(),
      8,
    );
    this.addToken(
      ChainNetwork.Polygon,
      "dai",
      "dai",
      "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063".toLowerCase(),
    );
    this.addToken(
      ChainNetwork.Polygon,
      "must",
      "must",
      "0x9c78ee466d6cb57a4d01fd887d2b5dfb2d46288f".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Polygon,
      "pickle",
      "pickle-finance",
      "0x2b88ad57897a8b496595925f43048301c37615da".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Polygon,
      "matic",
      "matic-network",
      "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
      [],
      true,
    );
    this.addToken(
      ChainNetwork.Polygon,
      "sushi",
      "sushi",
      "0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a".toLowerCase(),
    );
    this.addToken(
      ChainNetwork.Polygon,
      "mimatic",
      "mimatic",
      "0xa3fa99a148fa48d14ed51d610c367c61876997f1".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Polygon,
      "qi",
      "qi-dao",
      "0x580a84c73811e1839f75d86d75d88cca0c241ff4".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Polygon,
      "crv",
      "curve-dao-token",
      "0x172370d5cd63279efa6d502dab29171933a610af".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Polygon,
      "dino",
      "dinoswap",
      "0xAa9654BECca45B5BDFA5ac646c939C62b527D394".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Polygon,
      "ice",
      "iron-finance",
      "0x4a81f8796e0c6ad4877a51c86693b0de8093f2ef".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Polygon,
      "work",
      "the-employment-commons-work-token",
      "0x6002410dda2fb88b4d0dc3c1d562f7761191ea80".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Polygon,
      "raider",
      "crypto-raiders",
      "0xcd7361ac3307d1c5a46b63086a90742ff44c63b3".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Polygon,
      "aurum",
      "raider-aurum",
      "0x34d4ab47bee066f361fa52d792e69ac7bd05ee23".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );

    // Arbitrum
    this.addToken(
      ChainNetwork.Arbitrum,
      "spell",
      "spell-token",
      "0x3e6648c5a70a150a88bce65f4ad4d506fe15d2af".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Arbitrum,
      "weth",
      "weth",
      "0x82af49447d8a07e3bd95bd0d56f35241523fbab1".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
      [],
      true
    );
    this.addToken(
      ChainNetwork.Arbitrum,
      "sushi",
      "sushi",
      "0xd4d42f0b6def4ce0383636770ef773390d85c61a".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Arbitrum,
      "mim",
      "magic-internet-money",
      "0xfea7a6a0b346362bf88a9e4a88416b77a57d6c2a".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Arbitrum,
      "crv",
      "curve-dao-token",
      "0x11cdb42b0eb46d95f990bedd4695a6e3fa034978".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Arbitrum,
      "wbtc",
      "wrapped-bitcoin",
      "0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f".toLowerCase(),
      8,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Arbitrum,
      "usdt",
      "usdt",
      "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9".toLowerCase(),
      6,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Arbitrum,
      "2crv",
      "2crv",
      "0xbf7e49483881c76487b0989cd7d9a8239b20ca41".toLowerCase(),
      18,
      ExternalTokenFetchStyle.NONE,
    );
    this.addToken(
      ChainNetwork.Arbitrum,
      "dodo",
      "dodo",
      "0x69eb4fa4a2fbd498c257c57ea8b7655a2559a581".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Arbitrum,
      "hnd",
      "hundred-finance",
      "0x10010078a54396f62c96df8532dc2b4847d47ed3".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Arbitrum,
      "pickle",
      "pickle-finance",
      "0x965772e0E9c84b6f359c8597C891108DcF1c5B1A".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Arbitrum,
      "bal",
      "balancer",
      "0x040d1edc9569d4bab2d15287dc5a4f10f56a56b8".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Arbitrum,
      "usdc",
      "usd-coin",
      "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8".toLowerCase(),
      6,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Arbitrum,
      "usdc",
      "usd-coin",
      "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8".toLowerCase(),
      6,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Arbitrum,
      "gohm",
      "governance-ohm",
      "0x8d9ba570d6cb60c7e3e0f31343efe75ab8e65fb1".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Arbitrum,
      "magic",
      "magic",
      "0x539bde0d7dbd336b79148aa742883198bbf60342".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Arbitrum,
      "vsta",
      "vesta-finance",
      "0xa684cd057951541187f288294a1e1C2646aA2d24".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );

    // OKEx
    this.addToken(
      ChainNetwork.OKEx,
      "btck",
      "oec-btc",
      "0x54e4622DC504176b3BB432dCCAf504569699a7fF".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.OKEx,
      "bxh",
      "bxh",
      "0x145ad28a42bf334104610f7836d0945dffb6de63".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.OKEx,
      "usdc",
      "usdc",
      "0xc946DAf81b08146B1C7A8Da2A851Ddf2B3EAaf85".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.OKEx,
      "usdt",
      "usdt",
      "0x382bb369d343125bfb2117af9c149795c6c65c50".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.OKEx,
      "cherry",
      "cherryswap",
      "0x8179D97Eb6488860d816e3EcAFE694a4153F216c".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.OKEx,
      "ethk",
      "oec-eth",
      "0xEF71CA2EE68F45B9Ad6F72fbdb33d707b872315C".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.OKEx,
      "wokt",
      "wrapped-okt",
      "0x8F8526dbfd6E38E3D8307702cA8469Bae6C56C15".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
      [],
      true,
    );
    this.addToken(
      ChainNetwork.OKEx,
      "jswap",
      "jswap-finance",
      "0x5fAc926Bf1e638944BB16fb5B787B5bA4BC85b0A".toLowerCase(),
      18,
      ExternalTokenFetchStyle.COIN_MARKET_CAP,
    );
    this.addToken(
      ChainNetwork.OKEx,
      "daik",
      "dai",
      "0x21cDE7E32a6CAF4742d00d44B07279e7596d26B9".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );

    // Harmony
    this.addToken(
      ChainNetwork.Harmony,
      "wone",
      "harmony",
      "0xcF664087a5bB0237a0BAd6742852ec6c8d69A27a".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
      [],
      true,
    );
    this.addToken(
      ChainNetwork.Harmony,
      "1eth",
      "ethereum",
      "0x6983D1E6DEf3690C4d616b13597A09e6193EA013".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Harmony,
      "1dai",
      "dai",
      "0xEf977d2f931C1978Db5F6747666fa1eACB0d0339".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Harmony,
      "1wbtc",
      "wrapped-bitcoin",
      "0x3095c7557bCb296ccc6e363DE01b760bA031F2d9".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Harmony,
      "sushi",
      "sushi",
      "0xBEC775Cb42AbFa4288dE81F387a9b1A3c4Bc552A".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );

    // Moonriver
    this.addToken(
      ChainNetwork.Moonriver,
      "movr",
      "moonriver",
      "0x98878B06940aE243284CA214f92Bb71a2b032B8A".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
      [],
      true,
    );
    this.addToken(
      ChainNetwork.Moonriver,
      "solar",
      "solarbeam",
      "0x6bd193ee6d2104f14f94e2ca6efefae561a4334b".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Moonriver,
      "eth",
      "ethereum",
      "0x639A647fbe20b6c8ac19E48E2de44ea792c62c5C".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Moonriver,
      "avax",
      "avalanche-2",
      "0x14a0243C333A5b238143068dC3A7323Ba4C30ECB".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Moonriver,
      "bnb",
      "binancecoin",
      "0x2bF9b864cdc97b08B6D79ad4663e71B8aB65c45c".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Moonriver,
      "busd",
      "binance-usd",
      "0x5D9ab5522c64E1F6ef5e3627ECCc093f56167818".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Moonriver,
      "usdc",
      "usd-coin",
      "0xE3F5a90F9cb311505cd691a46596599aA1A0AD7D".toLowerCase(),
      6,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Moonriver,
      "usdc-2",
      "usd-coin",
      "0x748134b5f553f2bcbd78c6826de99a70274bdeb3".toLowerCase(),
      6,
      ExternalTokenFetchStyle.ID,
    );
    // the second "dai" field is the Coingecko price ID of that token
    this.addToken(
      ChainNetwork.Moonriver,
      "dai",
      "dai",
      "0x80a16016cc4a2e6a2caca8a4a498b1699ff0f844".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Moonriver,
      "wbtc",
      "wrapped-bitcoin",
      "0x6aB6d61428fde76768D7b45D8BFeec19c6eF91A8".toLowerCase(),
      8,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Moonriver,
      "mai",
      "mimatic",
      "0x7f5a79576620C046a293F54FFCdbd8f2468174F1".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Moonriver,
      "mim",
      "magic-internet-money",
      "0x0caE51e1032e8461f4806e26332c030E34De3aDb".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Moonriver,
      "ftm",
      "fantom",
      "0xaD12daB5959f30b9fF3c2d6709f53C335dC39908".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Moonriver,
      "rib",
      "riverboat",
      "0xbD90A6125a84E5C512129D622a75CDDE176aDE5E".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Moonriver,
      "pets",
      "polkapet-world",
      "0x1e0F2A75Be02c025Bd84177765F89200c04337Da".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Moonriver,
      "relay",
      "relay-token",
      "0xad7f1844696652dda7959a49063bffccafafefe7".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Moonriver,
      "usdt",
      "tether",
      "0xb44a9b6905af7c801311e8f4e76932ee959c663c".toLowerCase(),
      6,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Moonriver,
      "frax",
      "frax",
      "0x1A93B23281CC1CDE4C4741353F3064709A16197d".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Moonriver,
      "ksm",
      "kusama",
      "0xffffffff1fcacbd218edc0eba20fc2308c778080".toLowerCase(),
      12,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Moonriver,
      "finn",
      "huckleberry",
      "0x9a92b5ebf1f6f6f7d93696fcd44e5cf75035a756".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Moonriver,
      "rmrk",
      "rmrk",
      "0xffffffff893264794d9d57e1e0e21e0042af5a0a".toLowerCase(),
      10,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Moonriver,
      "dot",
      "polkadot",
      "0x15B9CA9659F5dfF2b7d35a98dd0790a3CBb3D445".toLowerCase(),
      10,
      ExternalTokenFetchStyle.ID,
    )

    // Cronos
    this.addToken(
      ChainNetwork.Cronos,
      "weth",
      "ethereum",
      "0xe44Fd7fCb2b1581822D0c862B68222998a0c299a".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Cronos,
      "cro",
      "crypto-com-chain",
      "0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
      [],
      true,
    );
    this.addToken(
      ChainNetwork.Cronos,
      "vvs",
      "vvs-finance",
      "0x2d03bece6747adc00e1a131bba1469c15fd11e03".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Cronos,
      "btc",
      "wrapped-bitcoin",
      "0x062E66477Faf219F25D27dCED647BF57C3107d52".toLowerCase(),
      8,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Cronos,
      "dai",
      "dai",
      "0xF2001B145b43032AAF5Ee2884e456CCd805F677D".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Cronos,
      "shib",
      "shiba-inu",
      "0xbED48612BC69fA1CaB67052b42a95FB30C1bcFee".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Cronos,
      "usdc",
      "usd-coin",
      "0xc21223249CA28397B4B6541dfFaEcC539BfF0c59".toLowerCase(),
      6,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Cronos,
      "usdt",
      "tether",
      "0x66e428c3f67a68878562e79A0234c1F83c208770".toLowerCase(),
      6,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Cronos,
      "bifi",
      "beefy-finance",
      "0xe6801928061CDbE32AC5AD0634427E140EFd05F9".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );

    // Aurora
    this.addToken(
      ChainNetwork.Aurora,
      "tri",
      "trisolaris",
      "0xFa94348467f64D5A457F75F8bc40495D33c65aBB".toLowerCase(),
      18,
      ExternalTokenFetchStyle.SWAP_PAIRS,
      [
        "0x84b123875F0F36B966d0B6Ca14b31121bd9676AD",
        "0x20F8AeFB5697B77E0BB835A8518BE70775cdA1b0",
      ],
    );
    this.addToken(
      ChainNetwork.Aurora,
      "near",
      "near",
      "0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d".toLowerCase(),
      24,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Aurora,
      "usdc",
      "usd-coin",
      "0xB12BFcA5A55806AaF64E99521918A4bf0fC40802".toLowerCase(),
      6,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Aurora,
      "eth",
      "ethereum",
      "0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
      [],
      true,
    );
    this.addToken(
      ChainNetwork.Aurora,
      "usdt",
      "tether",
      "0x4988a896b1227218e4A686fdE5EabdcAbd91571f".toLowerCase(),
      6,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Aurora,
      "btc",
      "wrapped-bitcoin",
      "0xF4eB217Ba2454613b15dBdea6e5f22276410e89e".toLowerCase(),
      8,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Aurora,
      "aurora",
      "aurora-near",
      "0x8BEc47865aDe3B172A928df8f990Bc7f2A3b9f79".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Aurora,
      "pad",
      "nearpad",
      "0x885f8CF6E45bdd3fdcDc644efdcd0AC93880c781".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Aurora,
      "wanna",
      "wanna",
      "0x7faA64Faf54750a2E3eE621166635fEAF406Ab22".toLowerCase(),
      18,
      ExternalTokenFetchStyle.SWAP_PAIRS,
      ["0x523faE29D7ff6FD38842c8F271eDf2ebd3150435"],
    );
    this.addToken(
      ChainNetwork.Aurora,
      "dai",
      "dai",
      "0xe3520349F477A5F6EB06107066048508498A291b".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Aurora,
      "frax",
      "frax",
      "0xDA2585430fEf327aD8ee44Af8F1f989a2A91A3d2".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Aurora,
      "rose",
      "rose",
      "0xdcD6D4e2B3e1D1E1E6Fa8C21C8A323DcbecfF970".toLowerCase(),
      18,
      ExternalTokenFetchStyle.SWAP_PAIRS,
      ["0xeD4C231b98b474f7cAeCAdD2736e5ebC642ad707"],
    );
    this.addToken(
      ChainNetwork.Aurora,
      "luna",
      "terra-luna",
      "0xC4bdd27c33ec7daa6fcfd8532ddB524Bf4038096".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Aurora,
      "ust",
      "terrausd",
      "0x5ce9F0B6AFb36135b5ddBF11705cEB65E634A9dC".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Aurora,
      "brl",
      "borealis",
      "0x12c87331f086c3C926248f964f8702C0842Fd77F".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Aurora,
      "avax",
      "avalanche-2",
      "0x80A16016cC4A2E6a2CACA8a4a498b1699fF0f844".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Aurora,
      "matic",
      "matic-network",
      "0x6aB6d61428fde76768D7b45D8BFeec19c6eF91A8".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Aurora,
      "bnb",
      "binancecoin",
      "0x2bF9b864cdc97b08B6D79ad4663e71B8aB65c45c".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Aurora,
      "busd",
      "binance-usd",
      "0x5D9ab5522c64E1F6ef5e3627ECCc093f56167818".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );

    // Metis
    this.addToken(
      ChainNetwork.Metis,
      "nett",
      "netswap",
      "0x90fe084f877c65e1b577c7b2ea64b8d8dd1ab278".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Metis,
      "metis",
      "metis-token",
      "0xdeaddeaddeaddeaddeaddeaddeaddeaddead0000".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
      [],
      true,
    );
    this.addToken(
      ChainNetwork.Metis,
      "tethys",
      "tethys-finance",
      "0x69fdb77064ec5c84fa2f21072973eb28441f43f3".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Metis,
      "bnb",
      "binancecoin",
      "0x2692BE44A6E38B698731fDDf417d060f0d20A0cB".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Metis,
      "eth",
      "ethereum",
      "0x420000000000000000000000000000000000000A".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Metis,
      "usdc",
      "usd-coin",
      "0xEA32A96608495e54156Ae48931A7c20f0dcc1a21".toLowerCase(),
      6,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Metis,
      "usdt",
      "tether",
      "0xbB06DCA3AE6887fAbF931640f67cab3e3a16F4dC".toLowerCase(),
      6,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Metis,
      "hades",
      "hades-money",
      "0x88c37e0bc6a237e96bc4a82774a38bbc30eff3cf".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Metis,
      "hellshare",
      "hellshare",
      "0xefb15ef34f85632fd1d4c17fc130ccee3d3d48ae".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );

    // Moonbeam
    this.addToken(
      ChainNetwork.Moonbeam,
      "glmr",
      "moonbeam",
      "0xAcc15dC74880C9944775448304B263D191c6077F".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
      [],
      true
    );
    this.addToken(
      ChainNetwork.Moonbeam,
      "stella",
      "stellaswap",
      "0x0E358838ce72d5e61E0018a2ffaC4bEC5F4c88d2".toLowerCase(),
      18,
      ExternalTokenFetchStyle.SWAP_PAIRS,
      ["0x81e11a9374033d11Cc7e7485A7192AE37D0795D6"],
    );
    this.addToken(
      ChainNetwork.Moonbeam,
      "usdc",
      "usd-coin",
      "0x818ec0A7Fe18Ff94269904fCED6AE3DaE6d6dC0b".toLowerCase(),
      6,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Moonbeam,
      "usdc-2",
      "usd-coin",
      "0x8f552a71efe5eefc207bf75485b356a0b3f01ec9".toLowerCase(),
      6,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Moonbeam,
      "bnb",
      "binancecoin",
      "0xc9BAA8cfdDe8E328787E29b4B078abf2DaDc2055".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Moonbeam,
      "busd",
      "binance-usd",
      "0xA649325Aa7C5093d12D6F98EB4378deAe68CE23F".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Moonbeam,
      "dai",
      "dai",
      "0x765277EebeCA2e31912C9946eAe1021199B39C61".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Moonbeam,
      "eth",
      "ethereum",
      "0xfA9343C3897324496A05fC75abeD6bAC29f8A40f".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Moonbeam,
      "eth-2",
      "ethereum",
      "0x30D2a9F5FDf90ACe8c17952cbb4eE48a55D916A7".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Moonbeam,
      "usdt",
      "tether",
      "0xeFAeeE334F0Fd1712f9a8cc375f427D9Cdd40d73".toLowerCase(),
      6,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Moonbeam,
      "beam",
      "beamswap",
      "0xcd3b51d98478d53f4515a306be565c6eebef1d58".toLowerCase(),
      18,
      ExternalTokenFetchStyle.SWAP_PAIRS,
      [
        "0x99588867e817023162F4d4829995299054a5fC57",
        "0xb929914B89584b4081C7966AC6287636F7EfD053",
      ],
    );
    this.addToken(
      ChainNetwork.Moonbeam,
      "flare",
      "solarflare",
      "0xE3e43888fa7803cDC7BEA478aB327cF1A0dc11a7".toLowerCase(),
      18,
      ExternalTokenFetchStyle.SWAP_PAIRS,
      [
        "0x976888647affb4b2d7ac1952cb12ca048cd67762", // FLARE-USDC
      ],
    );
    this.addToken(
      ChainNetwork.Moonbeam,
      "movr",
      "moonriver",
      "0x1d4C2a246311bB9f827F4C768e277FF5787B7D7E".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Moonbeam,
      "wbtc",
      "wrapped-bitcoin",
      "0x1DC78Acda13a8BC4408B207c9E48CDBc096D95e0".toLowerCase(),
      8,
      ExternalTokenFetchStyle.ID,
    );

    // Optimism
    this.addToken(
      ChainNetwork.Optimism,
      "zip",
      "zipswap",
      "0xFA436399d0458Dbe8aB890c3441256E3E09022a8".toLowerCase(),
      18,
      ExternalTokenFetchStyle.SWAP_PAIRS,
      [
        "0xD7F6ECF4371eddBd60C1080BfAEc3d1d60D415d0",
        "0x1A981dAa7967C66C3356Ad044979BC82E4a478b9",
      ],
    );
    this.addToken(
      ChainNetwork.Optimism,
      "eth",
      "ethereum",
      "0x4200000000000000000000000000000000000006".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
      [],
      true,
    );
    this.addToken(
      ChainNetwork.Optimism,
      "usdc",
      "usd-coin",
      "0x7F5c764cBc14f9669B88837ca1490cCa17c31607".toLowerCase(),
      6,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Optimism,
      "btc",
      "bitcoin",
      "0x68f180fcCe6836688e9084f035309E29Bf0A2095".toLowerCase(),
      8,
      ExternalTokenFetchStyle.ID,
    );
    this.addToken(
      ChainNetwork.Optimism,
      "dai",
      "dai",
      "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1".toLowerCase(),
      18,
      ExternalTokenFetchStyle.ID,
    );

    // Make the reverse map to fascilitate contract lookups
    const tokenMaps: Map<string, ExternalToken>[] = this.allChainMaps();
    const allTokenList: ExternalToken[] = [];
    for (let i = 0; i < tokenMaps.length; i++) {
      allTokenList.push(...tokenMaps[i].values());
    }
    for (const oneToken of allTokenList) {
      this.contractToToken.set(oneToken.contractAddr.toLowerCase(), oneToken);
    }
  }

  addToken(
    chain: ChainNetwork,
    id: string,
    cgid: string,
    addr: string,
    dec = 18,
    style: ExternalTokenFetchStyle = ExternalTokenFetchStyle.BOTH,
    swapPairs: string[] = [],
    isNative: Boolean = false,
  ): void {
    this.chainTokens
      .get(chain)
      .set(id, new ExternalToken(chain, id, cgid, addr, dec, style, swapPairs, isNative));
  }

  mapForChain(chain: ChainNetwork): Map<string, ExternalToken> {
    return this.chainTokens.get(chain);
  }

  allChainMaps(): Map<string, ExternalToken>[] {
    const ret: Map<string, ExternalToken>[] = [];
    const chains: ChainNetwork[] = Chains.list();
    for (let i = 0; i < chains.length; i++) {
      const m1: Map<string, ExternalToken> = this.mapForChain(chains[i]);
      if (m1) {
        ret.push(m1);
      }
    }
    return ret;
  }

  getTokensById(id: string): ExternalToken[] {
    const ret: ExternalToken[] = [];
    const chainTokens: Map<string, ExternalToken>[] = this.allChainMaps();
    for (let i = 0; i < chainTokens.length; i++) {
      const tokenInChain: ExternalToken = chainTokens[i].get(id);
      if (tokenInChain) ret.push(tokenInChain);
    }
    return ret;
  }

  getTokenCoinGeckoName(id: string): string {
    const chainTokens: Map<string, ExternalToken>[] = this.allChainMaps();
    for (let i = 0; i < chainTokens.length; i++) {
      if (chainTokens[i].get(id)) {
        return chainTokens[i].get(id).coingeckoId;
      }
    }
    return undefined;
  }
  findTokenByCoinGeckoName(id: string): ExternalToken[] {
    const chainMaps: Map<string, ExternalToken>[] = this.allChainMaps();
    const ret = [];
    for (let i = 0; i < chainMaps.length; i++) {
      const foundInChain = [...chainMaps[i].values()].filter((value) => {
        return value.coingeckoId === id;
      });
      if (foundInChain.length > 0) ret.push(...foundInChain);
    }
    return ret.length === 0 ? undefined : ret;
  }
  findTokenFromContract(id: string): ExternalToken | undefined {
    return this.contractToToken.get(id.toLowerCase());
  }

  getToken(id: string, chain: ChainNetwork): ExternalToken {
    let ret: ExternalToken = this.mapForChain(chain)?.get(id);
    if (ret === undefined) {
      // Search by contract
      if (id.toLowerCase().startsWith("0x")) {
        ret = this.findTokenFromContract(id);
      }
    }
    return ret ? ret : null;
  }

  getTokens(chain: ChainNetwork): ExternalToken[] {
    const mapForChain: Map<string, ExternalToken> = this.mapForChain(chain);
    return mapForChain ? [...mapForChain.values()] : null;
  }

  getAllTokens(): ExternalToken[] {
    const ret: ExternalToken[] = [];
    const chains = Chains.list();
    for (let i = 0; i < chains.length; i++) {
      const tmp: ExternalToken[] = this.getTokens(chains[i]);
      ret.push(...tmp);
    }
    return ret;
  }

  // Get all tokens for output via json model
  getAllTokensOutput(): IExternalToken[] {
    const ret: IExternalToken[] = [];
    const chains = Chains.list();
    for (let i = 0; i < chains.length; i++) {
      const tmp: IExternalToken[] = this.getTokens(chains[i]).map((x) =>
        x.toOutputFormat(),
      );
      ret.push(...tmp);
    }
    return ret;
  }
}
export const ExternalTokenModelSingleton = new ExternalTokenModel();
