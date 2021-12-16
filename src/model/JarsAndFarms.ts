import { ChainNetwork } from "../chain/Chains";
import {
  StandaloneFarmDefinition,
  AssetEnablement,
  JarDefinition,
  HarvestStyle,
  AssetType,
  PickleAsset,
  ExternalAssetDefinition,
  AssetProtocol,
} from "./PickleModelJson";

export const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";

/**
 * Now the actual implementations
 */
export const STANDALONE_FARM_DEFINITIONS: StandaloneFarmDefinition[] = [];

export const FARM_UNI_PICKLE_ETH: StandaloneFarmDefinition = {
  type: AssetType.STANDALONE_FARM,
  id: "Uniswap Pickle/Eth",
  farmNickname: "Pickle Power",
  contract: "0xfAA267C3Bb25a82CFDB604136a29895D30fd3fd8",
  depositToken: {
    addr: "0xdc98556ce24f007a5ef6dc1ce96322d65832a819",
    name: "UniV2 PICKLE/ETH",
    link: "https://app.uniswap.org/#/add/v2/0x429881672B9AE42b8EbA0E26cD9C73711b891Ca5/ETH",
    components: ["pickle", "weth"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.UNISWAP,
  details: {
    apiKey: "pickle-eth",
  },
  tags: "pool2",
};
STANDALONE_FARM_DEFINITIONS.push(FARM_UNI_PICKLE_ETH);

export const JAR_DEFINITIONS: JarDefinition[] = [];
export const JAR_sCRV: JarDefinition = {
  type: AssetType.JAR,
  id: "pJar 0a",
  contract: "0x68d14d66B2B0d6E157c06Dc8Fefa3D8ba0e66a89",
  depositToken: {
    addr: "0xC25a3A3b969415c80451098fa907EC722572917F",
    name: "Curve sCRV",
    link: "https://www.curve.fi/susdv2/deposit",
  },
  enablement: AssetEnablement.DISABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.CURVE,
  details: {
    apiKey: "sCRV",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: undefined,
};
JAR_DEFINITIONS.push(JAR_sCRV);

export const JAR_renCRV: JarDefinition = {
  type: AssetType.JAR,
  id: "pJar 0b",
  contract: "0x2E35392F4c36EBa7eCAFE4de34199b2373Af22ec",
  depositToken: {
    addr: "0x49849C98ae39Fff122806C06791Fa73784FB3675",
    name: "Curve REN/BTC",
    link: "https://www.curve.fi/ren/deposit",
  },
  enablement: AssetEnablement.DISABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.CURVE,
  details: {
    apiKey: "renBTCCRV",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: undefined,
};
JAR_DEFINITIONS.push(JAR_renCRV);

export const JAR_3CRV: JarDefinition = {
  type: AssetType.JAR,
  id: "pJar 0c",
  contract: "0x1BB74b5DdC1f4fC91D6f9E7906cf68bc93538e33",
  depositToken: {
    addr: "0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490",
    name: "Curve 3pool",
    link: "https://www.curve.fi/3pool/deposit",
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.CURVE,
  details: {
    apiKey: "3poolCRV",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0xf5bD1A4894a6ac1D786c7820bC1f36b1535147F6",
    farmNickname: "pCurve 3pool",
    farmDepositTokenName: "pCurve 3pool",
  },
};
JAR_DEFINITIONS.push(JAR_3CRV);

export const JAR_steCRV: JarDefinition = {
  type: AssetType.JAR,
  id: "pJar 0d",
  contract: "0x77C8A58D940a322Aea02dBc8EE4A30350D4239AD",
  depositToken: {
    addr: "0x06325440D014e39736583c165C2963BA99fAf14E",
    name: "Curve ETH/stETH",
    link: "https://www.curve.fi/steth/deposit",
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.CURVE,
  details: {
    apiKey: "steCRV",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x4731CD18fFfF2C2A43f72eAe1B598dC3c0C16912",
    farmNickname: "pCurve ETH/stETH",
    farmDepositTokenName: "pCurve ETH/stETH",
  },
};
JAR_DEFINITIONS.push(JAR_steCRV);

export const JAR_UNIV2_ETH_DAI: JarDefinition = {
  type: AssetType.JAR,
  id: "pJar 0.69a (inactive)",
  contract: "0xCffA068F1E44D98D3753966eBd58D4CFe3BB5162",
  depositToken: {
    addr: "0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11",
    name: "UniV2 DAI/ETH",
    link: "https://app.uniswap.org/#/add/v2/0x6b175474e89094c44da98b954eedeac495271d0f/ETH",
    components: ["dai", "weth"],
  },
  enablement: AssetEnablement.PERMANENTLY_DISABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.UNISWAP,
  details: undefined,
  farm: undefined,
};
JAR_DEFINITIONS.push(JAR_UNIV2_ETH_DAI);

export const JAR_UNIV2_ETH_USDC: JarDefinition = {
  type: AssetType.JAR,
  id: "pJar 0.69b (inactive)",
  contract: "0x53Bf2E62fA20e2b4522f05de3597890Ec1b352C6",
  depositToken: {
    addr: "0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc",
    name: "UniV2 USDC/ETH",
    link: "https://app.uniswap.org/#/add/v2/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48/ETH",
    components: ["usdc", "weth"],
  },
  enablement: AssetEnablement.PERMANENTLY_DISABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.UNISWAP,
  details: undefined,
  farm: undefined,
};
JAR_DEFINITIONS.push(JAR_UNIV2_ETH_USDC);

export const JAR_UNIV2_ETH_USDT: JarDefinition = {
  type: AssetType.JAR,
  id: "pJar 0.69c (inactive)",
  contract: "0x09FC573c502037B149ba87782ACC81cF093EC6ef",
  depositToken: {
    addr: "0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852",
    name: "UniV2 USDT/ETH",
    link: "https://app.uniswap.org/#/add/v2/ETH/0xdac17f958d2ee523a2206206994597c13d831ec7",
    components: ["usdt", "weth"],
  },
  enablement: AssetEnablement.PERMANENTLY_DISABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.UNISWAP,
  details: undefined,
  farm: undefined,
};
JAR_DEFINITIONS.push(JAR_UNIV2_ETH_USDT);

export const JAR_UNIV2_ETH_WBTC: JarDefinition = {
  type: AssetType.JAR,
  id: "pJar 0.69d (inactive)",
  contract: "0xc80090AA05374d336875907372EE4ee636CBC562",
  depositToken: {
    addr: "0xBb2b8038a1640196FbE3e38816F3e67Cba72D940",
    name: "UniV2 WBTC/ETH",
    link: "https://app.uniswap.org/#/add/v2/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599/ETH",
    components: ["wbtc", "weth"],
  },
  enablement: AssetEnablement.PERMANENTLY_DISABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.UNISWAP,
  details: undefined,
  farm: undefined,
};
JAR_DEFINITIONS.push(JAR_UNIV2_ETH_WBTC);

export const JAR_pDAI: JarDefinition = {
  type: AssetType.JAR,
  id: "pJar 0.88a (inactive)",
  contract: "0x6949Bb624E8e8A90F87cD2058139fcd77D2F3F87",
  depositToken: {
    addr: "0x6b175474e89094c44da98b954eedeac495271d0f",
    name: "DAI",
    link: "https://etherscan.io/token/0x6b175474e89094c44da98b954eedeac495271d0f",
  },
  enablement: AssetEnablement.PERMANENTLY_DISABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.COMPOUND,
  details: undefined,
  farm: undefined,
};
JAR_DEFINITIONS.push(JAR_pDAI);

export const JAR_ALETH: JarDefinition = {
  type: AssetType.JAR,
  id: "pJar 0.98s",
  contract: "0xCbA1FE4Fdbd90531EFD929F1A1831F38e91cff1e",
  depositToken: {
    addr: "0xc9da65931ABf0Ed1b74Ce5ad8c041C4220940368",
    name: "Saddle ETH/alETH",
    link: "https://saddle.exchange/#/pools/aleth/deposit",
  },
  enablement: AssetEnablement.PERMANENTLY_DISABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.SADDLE,
  details: {
    apiKey: "ALETH",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x042650a573f3d62d91C36E08045d7d0fd9E63759",
    farmNickname: "pSaddle ETH/alETH",
    farmDepositTokenName: "pSaddle ETH/alETH",
  },
};
JAR_DEFINITIONS.push(JAR_ALETH);

export const JAR_LQTY: JarDefinition = {
  type: AssetType.JAR,
  id: "pJar 0.98l",
  contract: "0x65B2532474f717D5A8ba38078B78106D56118bbb",
  depositToken: {
    addr: "0x6DEA81C8171D0bA574754EF6F8b412F2Ed88c54D",
    name: "UniV2 LQTY",
    link: "https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x6dea81c8171d0ba574754ef6f8b412f2ed88c54d",
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.TOKENPRICE,
  details: {
    apiKey: "LQTY",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0xA7BC844a76e727Ec5250f3849148c21F4b43CeEA",
    farmNickname: "pUniV2 LQTY",
    farmDepositTokenName: "pUniV2 LQTY",
  },
};
JAR_DEFINITIONS.push(JAR_LQTY);

export const JAR_SUSHI_ETH_DAI: JarDefinition = {
  type: AssetType.JAR,
  id: "pJar 0.99a",
  contract: "0x55282dA27a3a02ffe599f6D11314D239dAC89135",
  depositToken: {
    addr: "0xC3D03e4F041Fd4cD388c549Ee2A29a9E5075882f",
    name: "Sushi DAI/ETH",
    link: "https://app.sushi.com/add/0x6b175474e89094c44da98b954eedeac495271d0f/ETH",
    components: ["dai", "weth"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.SUSHISWAP,
  details: {
    apiKey: "SLP-DAI",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x6092c7084821057060ce2030F9CC11B22605955F",
    farmNickname: "pSushi DAI/ETH",
    farmDepositTokenName: "pSushi DAI/ETH",
  },
};
JAR_DEFINITIONS.push(JAR_SUSHI_ETH_DAI);

export const JAR_SUSHI_ETH_USDC: JarDefinition = {
  type: AssetType.JAR,
  id: "pJar 0.99b",
  contract: "0x8c2D16B7F6D3F989eb4878EcF13D695A7d504E43",
  depositToken: {
    addr: "0x397FF1542f962076d0BFE58eA045FfA2d347ACa0",
    name: "Sushi USDC/ETH",
    link: "https://app.sushi.com/add/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48/ETH",
    components: ["usdc", "weth"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.SUSHISWAP,
  details: {
    apiKey: "SLP-USDC",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x8F720715d34Ff1FDa1342963EF6372d1557dB3A7",
    farmNickname: "pSushi USDC/ETH",
    farmDepositTokenName: "pSushi USDC/ETH",
  },
};
JAR_DEFINITIONS.push(JAR_SUSHI_ETH_USDC);

export const JAR_SUSHI_ETH_USDT: JarDefinition = {
  type: AssetType.JAR,
  id: "pJar 0.99c",
  contract: "0xa7a37aE5Cb163a3147DE83F15e15D8E5f94D6bCE",
  depositToken: {
    addr: "0x06da0fd433C1A5d7a4faa01111c044910A184553",
    name: "Sushi USDT/ETH",
    link: "https://app.sushi.com/add/ETH/0xdac17f958d2ee523a2206206994597c13d831ec7",
    components: ["weth", "usdt"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.SUSHISWAP,
  details: {
    apiKey: "SLP-USDT",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x421476a3c0338E929cf9B77f7D087533bc9d2a2d",
    farmNickname: "pSushi USDT/ETH",
    farmDepositTokenName: "pSushi USDT/ETH",
  },
};
JAR_DEFINITIONS.push(JAR_SUSHI_ETH_USDT);

export const JAR_SUSHI_ETH_WBTC: JarDefinition = {
  type: AssetType.JAR,
  id: "pJar 0.99d",
  contract: "0xde74b6c547bd574c3527316a2eE30cd8F6041525",
  depositToken: {
    addr: "0xCEfF51756c56CeFFCA006cD410B03FFC46dd3a58",
    name: "Sushi WBTC/ETH",
    link: "https://app.sushi.com/add/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599/ETH",
    components: ["wbtc", "weth"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.SUSHISWAP,
  details: {
    apiKey: "SLP-WBTC",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0xD55331E7bCE14709d825557E5Bca75C73ad89bFb",
    farmNickname: "pSushi WBTC/ETH",
    farmDepositTokenName: "pSushi WBTC/ETH",
  },
};
JAR_DEFINITIONS.push(JAR_SUSHI_ETH_WBTC);

export const JAR_SUSHI_ETH_YFI: JarDefinition = {
  type: AssetType.JAR,
  id: "pJar 0.99e",
  contract: "0x3261D9408604CC8607b687980D40135aFA26FfED",
  depositToken: {
    addr: "0x088ee5007C98a9677165D78dD2109AE4a3D04d0C",
    name: "Sushi YFI/ETH",
    link: "https://app.sushi.com/add/0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e/ETH",
    components: ["yfi", "weth"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.SUSHISWAP,
  details: {
    apiKey: "SLP-YFI",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x2E32b1c2D7086DB1620F4586E09BaC7147640838",
    farmNickname: "pSushi YFI/ETH",
    farmDepositTokenName: "pSushi YFI/ETH",
  },
};
JAR_DEFINITIONS.push(JAR_SUSHI_ETH_YFI);

export const JAR_UNI_BAC_DAI: JarDefinition = {
  type: AssetType.JAR,
  id: "pJar 0.99f (inactive)",
  contract: "0x4Cac56929B98d4C52dDfDF998329622013Fed2a5",
  depositToken: {
    addr: "0xd4405F0704621DBe9d4dEA60E128E0C3b26bddbD",
    name: "UniV2 BAC/DAI",
    link: undefined,
    components: ["bac", "dai"],
  },
  enablement: AssetEnablement.PERMANENTLY_DISABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.UNISWAP,
  details: {
    apiKey: undefined,
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: undefined,
    farmNickname: "pUniV2 BAC/DAI",
    farmDepositTokenName: "pUniV2 BAC/DAI",
  },
};
JAR_DEFINITIONS.push(JAR_UNI_BAC_DAI);

export const JAR_SUSHI_MIC_USDT: JarDefinition = {
  type: AssetType.JAR,
  id: "pJar 0.99g (inactive)",
  contract: "0xC66583Dd4E25b3cfc8D881F6DbaD8288C7f5Fd30",
  depositToken: {
    addr: "0xC9cB53B48A2f3A9e75982685644c1870F1405CCb",
    name: "Sushi MIC/USDT",
    link: undefined,
    components: ["mic", "usdt"],
  },
  enablement: AssetEnablement.PERMANENTLY_DISABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.SUSHISWAP,
  details: {
    apiKey: undefined,
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: undefined,
    farmNickname: "pSushi MIC/USDT",
    farmDepositTokenName: "pSushi MIC/USDT",
  },
};
JAR_DEFINITIONS.push(JAR_SUSHI_MIC_USDT);

export const JAR_SUSHI_MIS_USDT: JarDefinition = {
  type: AssetType.JAR,
  id: "pJar 0.99h (inactive)",
  contract: "0x0faa189afe8ae97de1d2f01e471297678842146d",
  depositToken: {
    addr: "0x066f3a3b7c8fa077c71b9184d862ed0a4d5cf3e0",
    name: "Sushi MIS/USDT",
    link: undefined,
    components: ["mis", "usdt"],
  },
  enablement: AssetEnablement.PERMANENTLY_DISABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.SUSHISWAP,
  details: {
    apiKey: undefined,
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: undefined,
    farmNickname: "pSushi MIS/USDT",
    farmDepositTokenName: "pSushi MIS/USDT",
  },
};
JAR_DEFINITIONS.push(JAR_SUSHI_MIS_USDT);

export const JAR_SUSHI_ETH_YVECRV: JarDefinition = {
  type: AssetType.JAR,
  id: "pJar 0.99i (inactive)",
  contract: "0x5Eff6d166D66BacBC1BF52E2C54dD391AE6b1f48",
  depositToken: {
    addr: "0x10B47177E92Ef9D5C6059055d92DdF6290848991",
    name: "Sushi yveCRV/ETH",
    link: "https://app.sushi.com/add/0xc5bddf9843308380375a611c18b50fb9341f502a/ETH",
    components: ["weth", "yvecrv"],
  },
  enablement: AssetEnablement.DISABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.SUSHISWAP,
  details: {
    apiKey: "yveCRV-ETH",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0xd3F6732D758008E59e740B2bc2C1b5E420b752c2",
    farmNickname: "pSushi yveCRV/ETH",
    farmDepositTokenName: "pSushi yveCRV/ETH",
  },
};
JAR_DEFINITIONS.push(JAR_SUSHI_ETH_YVECRV);

export const JAR_UNI_BAS_DAI: JarDefinition = {
  type: AssetType.JAR,
  id: "pJar 0.99j (inactive)",
  contract: "0xcF45563514a24b10563aC0c9fECCd3476b00DF45",
  depositToken: {
    addr: "0x3E78F2E7daDe07ea685F8612F00477FD97162F1e",
    name: "UniV2 BAS/DAI",
    link: undefined,
    components: ["bas", "dai"],
  },
  enablement: AssetEnablement.PERMANENTLY_DISABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.UNISWAP,
  details: {
    apiKey: undefined,
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: undefined,
    farmNickname: "pUniV2 BAS/DAI",
    farmDepositTokenName: "pUniV2 BAS/DAI",
  },
};
JAR_DEFINITIONS.push(JAR_UNI_BAS_DAI);

export const JAR_UNIV2_MIR_UST: JarDefinition = {
  type: AssetType.JAR,
  id: "pJar 0.99k",
  contract: "0x3Bcd97dCA7b1CED292687c97702725F37af01CaC",
  depositToken: {
    addr: "0x87dA823B6fC8EB8575a235A824690fda94674c88",
    name: "UniV2 MIR/UST",
    link: "https://app.uniswap.org/#/add/v2/0x09a3ecafa817268f77be1283176b946c4ff2e608/0xa47c8bf37f92aBed4A126BDA807A7b7498661acD",
    components: ["mir", "ust"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.UNISWAP,
  details: {
    apiKey: "MIR-UST",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x02c9420467a22ad6067ef0CB4459752F45266C07",
    farmNickname: "pUniV2 MIR/UST",
    farmDepositTokenName: "pUniV2 MIR/UST",
  },
};
JAR_DEFINITIONS.push(JAR_UNIV2_MIR_UST);

export const JAR_UNIV2_MTSLA_UST: JarDefinition = {
  type: AssetType.JAR,
  id: "pJar 0.99l",
  contract: "0xaFB2FE266c215B5aAe9c4a9DaDC325cC7a497230",
  depositToken: {
    addr: "0x5233349957586A8207c52693A959483F9aeAA50C",
    name: "UniV2 MTSLA/UST",
    link: "https://app.uniswap.org/#/add/v2/0x21cA39943E91d704678F5D00b6616650F066fD63/0xa47c8bf37f92aBed4A126BDA807A7b7498661acD",
    components: ["mtsla", "ust"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.UNISWAP,
  details: {
    apiKey: "MTSLA-UST",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0xd7513F24B4D3672ADD9AF6C739Eb6EeBB85D8dD5",
    farmNickname: "pUniV2 MTSLA/UST",
    farmDepositTokenName: "pUniV2 MTSLA/UST",
  },
};
JAR_DEFINITIONS.push(JAR_UNIV2_MTSLA_UST);

export const JAR_UNIV2_MAAPL_UST: JarDefinition = {
  type: AssetType.JAR,
  id: "pJar 0.99m",
  contract: "0xF303B35D5bCb4d9ED20fB122F5E268211dEc0EBd",
  depositToken: {
    addr: "0xB022e08aDc8bA2dE6bA4fECb59C6D502f66e953B",
    name: "UniV2 MAAPL/UST",
    link: "https://app.uniswap.org/#/add/v2/0xd36932143F6eBDEDD872D5Fb0651f4B72Fd15a84/0xa47c8bf37f92aBed4A126BDA807A7b7498661acD",
    components: ["maapl", "ust"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.UNISWAP,
  details: {
    apiKey: "MAAPL-UST",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x2Df015B117343e24AEC9AC99909A4c097a2828Ab",
    farmNickname: "UniV2 MAAPL/UST",
    farmDepositTokenName: "UniV2 MAAPL/UST",
  },
};
JAR_DEFINITIONS.push(JAR_UNIV2_MAAPL_UST);

export const JAR_UNIV2_MQQQ_UST: JarDefinition = {
  type: AssetType.JAR,
  id: "pJar 0.99n",
  contract: "0x7C8de3eE2244207A54b57f45286c9eE1465fee9f",
  depositToken: {
    addr: "0x9E3B47B861B451879d43BBA404c35bdFb99F0a6c",
    name: "UniV2 MQQQ/UST",
    link: "https://app.uniswap.org/#/add/v2/0x13B02c8dE71680e71F0820c996E4bE43c2F57d15/0xa47c8bf37f92aBed4A126BDA807A7b7498661acD",
    components: ["mqqq", "ust"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.UNISWAP,
  details: {
    apiKey: "MQQQ-UST",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x3D24b7693A0a5Bf13977b19C81460aEd3f60C150",
    farmNickname: "pUniV2 MQQQ/UST",
    farmDepositTokenName: "pUniV2 MQQQ/UST",
  },
};
JAR_DEFINITIONS.push(JAR_UNIV2_MQQQ_UST);

export const JAR_UNIV2_MSLV_UST: JarDefinition = {
  type: AssetType.JAR,
  id: "pJar 0.99o",
  contract: "0x1ed1fD33b62bEa268e527A622108fe0eE0104C07",
  depositToken: {
    addr: "0x860425bE6ad1345DC7a3e287faCBF32B18bc4fAe",
    name: "UniV2 MSLV/UST",
    link: "https://app.uniswap.org/#/add/v2/0x9d1555d8cB3C846Bb4f7D5B1B1080872c3166676/0xa47c8bf37f92aBed4A126BDA807A7b7498661acD",
    components: ["mslv", "ust"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.UNISWAP,
  details: {
    apiKey: "MSLV-UST",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x1456846B5A7d3c7F9Ea643a4847376fB19fC1aB1",
    farmNickname: "pUniV2 MSLV/UST",
    farmDepositTokenName: "pUniV2 MSLV/UST",
  },
};
JAR_DEFINITIONS.push(JAR_UNIV2_MSLV_UST);

export const JAR_UNIV2_MBABA_UST: JarDefinition = {
  type: AssetType.JAR,
  id: "pJar 0.99p",
  contract: "0x1CF137F651D8f0A4009deD168B442ea2E870323A",
  depositToken: {
    addr: "0x676Ce85f66aDB8D7b8323AeEfe17087A3b8CB363",
    name: "UniV2 MBABA/UST",
    link: "https://app.uniswap.org/#/add/v2/0x56aA298a19C93c6801FDde870fA63EF75Cc0aF72/0xa47c8bf37f92aBed4A126BDA807A7b7498661acD",
    components: ["mbaba", "ust"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.UNISWAP,
  details: {
    apiKey: "MBABA-UST",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x6Ea17c249f6cFD434A01c54701A8694766b76594",
    farmNickname: "pUniV2 MBABA/UST",
    farmDepositTokenName: "pUniV2 MBABA/UST",
  },
};
JAR_DEFINITIONS.push(JAR_UNIV2_MBABA_UST);

export const JAR_SUSHI_ETH: JarDefinition = {
  type: AssetType.JAR,
  id: "pJar 0.99q",
  contract: "0xECb520217DccC712448338B0BB9b08Ce75AD61AE",
  depositToken: {
    addr: "0x795065dCc9f64b5614C407a6EFDC400DA6221FB0",
    name: "Sushi ETH/SUSHI",
    link: "https://app.sushi.com/add/0x6b3595068778dd592e39a122f4f5a5cf09c90fe2/ETH",
    components: ["sushi", "weth"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.SUSHISWAP,
  details: {
    apiKey: "SUSHI-ETH",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0xdaf08622Ce348fdEA09709F279B6F5673B1e0dad",
    farmNickname: "pSushi ETH/SUSHI",
    farmDepositTokenName: "pSushi ETH/SUSHI",
  },
};
JAR_DEFINITIONS.push(JAR_SUSHI_ETH);

export const JAR_UNIV2_FEI_TRIBE: JarDefinition = {
  type: AssetType.JAR,
  id: "pJar 0.99r",
  contract: "0xC1513C1b0B359Bc5aCF7b772100061217838768B",
  depositToken: {
    addr: "0x9928e4046d7c6513326cCeA028cD3e7a91c7590A",
    name: "UniV2 FEI/TRIBE",
    link: "https://app.uniswap.org/#/add/v2/0x956f47f50a910163d8bf957cf5846d573e7f87ca/0xc7283b66eb1eb5fb86327f08e1b5816b0720212b",
    components: ["fei", "tribe"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.UNISWAP,
  details: {
    apiKey: "FEI-TRIBE",
    harvestStyle: HarvestStyle.EARN_BEFORE_HARVEST,
  },
  farm: {
    farmAddress: "0xeA5b46877E2d131405DB7e5155CC15B8e55fbD27",
    farmNickname: "pUniV2 FEI/TRIBE",
    farmDepositTokenName: "pUniV2 FEI/TRIBE",
  },
};
JAR_DEFINITIONS.push(JAR_UNIV2_FEI_TRIBE);

export const JAR_SADDLE_D4: JarDefinition = {
  type: AssetType.JAR,
  id: "pJar 0.99s4",
  contract: "0xe6487033F5C8e2b4726AF54CA1449FEC18Bd1484",
  depositToken: {
    addr: "0xd48cf4d7fb0824cc8bae055df3092584d0a1726a",
    name: "Saddle D4",
    link: "https://saddle.exchange/#/pools/d4/deposit",
    components: ["alusd", "fei", "frax", "lusd"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.SADDLE,
  details: {
    apiKey: "saddled4",
    harvestStyle: HarvestStyle.EARN_BEFORE_HARVEST,
  },
  farm: {
    farmAddress: "0x08cb0a0ba8e4f143e4e6f7bed65e02b6dfb9a16c",
    farmNickname: "pSaddle D4",
    farmDepositTokenName: "pSaddle D4",
  },
};
JAR_DEFINITIONS.push(JAR_SADDLE_D4);

export const JAR_UNIV2_LUSD_ETH: JarDefinition = {
  type: AssetType.JAR,
  id: "pJar 0.99u (inactive)",
  contract: "0x927e3bCBD329e89A8765B52950861482f0B227c4",
  depositToken: {
    addr: "0xF20EF17b889b437C151eB5bA15A47bFc62bfF469",
    name: "UniV2 LUSD/ETH",
    link: "https://app.uniswap.org/#/add/v2/0x5f98805A4E8be255a32880FDeC7F6728C6568bA0/ETH",
    components: ["lusd", "weth"],
  },
  enablement: AssetEnablement.PERMANENTLY_DISABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.UNISWAP,
  details: {
    apiKey: "LUSD-ETH",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0xbc9d68f38881a9c161da18881e21b2ac9df87b55",
    farmNickname: "pUniV2 LUSD/ETH",
    farmDepositTokenName: "pUniV2 LUSD/ETH",
  },
};
JAR_DEFINITIONS.push(JAR_UNIV2_LUSD_ETH);

export const JAR_SUSHI_ETH_ALCX: JarDefinition = {
  type: AssetType.JAR,
  id: "pJar 0.99x",
  contract: "0x9eb0aAd5Bb943D3b2F7603Deb772faa35f60aDF9",
  depositToken: {
    addr: "0xC3f279090a47e80990Fe3a9c30d24Cb117EF91a8",
    name: "Sushi ALCX/ETH",
    link: "https://app.sushi.com/add/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2/0xdbdb4d16eda451d0503b854cf79d55697f90c8df",
    components: ["weth", "alcx"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.SUSHISWAP,
  details: {
    apiKey: "ALCX-ETH",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0xE9bEAd1d3e3A25E8AF7a6B40e48de469a9613EDe",
    farmNickname: "pSushi ALCX/ETH",
    farmDepositTokenName: "pSushi ALCX/ETH",
  },
};
JAR_DEFINITIONS.push(JAR_SUSHI_ETH_ALCX);

export const JAR_SUSHI_ETH_YVBOOST: JarDefinition = {
  type: AssetType.JAR,
  id: "pJar 0.99y",
  contract: "0xCeD67a187b923F0E5ebcc77C7f2F7da20099e378",
  depositToken: {
    addr: "0x9461173740D27311b176476FA27e94C681b1Ea6b",
    name: "Sushi yvBOOST/ETH",
    link: "https://app.sushi.com/add/0x9d409a0A012CFbA9B15F6D4B36Ac57A46966Ab9a/ETH",
    components: ["weth", "yvboost"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.SUSHISWAP,
  details: {
    apiKey: "yvBOOST-ETH",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0xDA481b277dCe305B97F4091bD66595d57CF31634",
    farmNickname: "pSushi yvBOOST/ETH",
    farmDepositTokenName: "pSushi yvBOOST/ETH",
  },
};
JAR_DEFINITIONS.push(JAR_SUSHI_ETH_YVBOOST);

export const JAR_SUSHI_CVX_ETH: JarDefinition = {
  type: AssetType.JAR,
  id: "pJar 0.99z",
  contract: "0xDCfAE44244B3fABb5b351b01Dc9f050E589cF24F",
  depositToken: {
    addr: "0x05767d9EF41dC40689678fFca0608878fb3dE906",
    name: "Sushi CVX/ETH",
    link: "https://app.sushi.com/add/0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b/ETH",
    components: ["cvx", "weth"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.SUSHISWAP,
  details: {
    apiKey: "CVX-ETH",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x62e558cda4619e31af8c84cd8f345fa474afe1b9",
    farmNickname: "pSushi CVX/ETH",
    farmDepositTokenName: "pSushi CVX/ETH",
  },
};
JAR_DEFINITIONS.push(JAR_SUSHI_CVX_ETH);

export const JAR_UNI_RLY_ETH: JarDefinition = {
  type: AssetType.JAR,
  id: "pJar A",
  contract: "0x0989a227E7c50311f7De61e5e61F7c28Df8936f0",
  depositToken: {
    addr: "0x27fD0857F0EF224097001E87e61026E39e1B04d1",
    name: "UniV2 RLY/ETH",
    link: "https://app.uniswap.org/#/add/v2/0xf1f955016ecbcd7321c7266bccfb96c68ea5e49b/ETH",
    components: ["rly", "weth"],
    decimals: 18,
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.UNISWAP,
  details: {
    decimals: 18,
    apiKey: "RLY-ETH",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x1a6e44981B4144261932E460d30C9342e961f5D9",
    farmNickname: "pUniV2 RLY/ETH",
    farmDepositTokenName: "pUniV2 RLY/ETH",
  },
};
JAR_DEFINITIONS.push(JAR_UNI_RLY_ETH);

export const JAR_USDC: JarDefinition = {
  type: AssetType.JAR,
  id: "pJar Y-1",
  contract: "0xEB801AB73E9A2A482aA48CaCA13B1954028F4c94",
  depositToken: {
    addr: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    name: "Yearn USDC",
    link: "https://etherscan.io/token/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    components: ["usdc"],
    decimals: 6,
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.YEARN,
  details: {
    decimals: 6,
    apiKey: "USDC",
    harvestStyle: HarvestStyle.NONE,
  },
  farm: {
    farmAddress: "0x9e1126c51c319A1d31d928DC498c9988C094e793",
    farmNickname: "pYearn USDC",
    farmDepositTokenName: "pYearn USDC",
  },
};
JAR_DEFINITIONS.push(JAR_USDC);

export const JAR_lusdCRV: JarDefinition = {
  type: AssetType.JAR,
  id: "pJar Y-2",
  contract: "0x4fFe73Cf2EEf5E8C8E0E10160bCe440a029166D2",
  depositToken: {
    addr: "0xEd279fDD11cA84bEef15AF5D39BB4d4bEE23F0cA",
    name: "Yearn LUSD/3CRV",
    link: "https://curve.fi/lusd/deposit",
    components: ["lusd", "3crv"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.YEARN,
  details: {
    apiKey: "lusdCRV",
    harvestStyle: HarvestStyle.NONE,
  },
  farm: {
    farmAddress: "0x2040c856d53d5CbB111c81D5A85ccc10829c5783",
    farmNickname: "pYearn LUSD/3CRV",
    farmDepositTokenName: "pYearn LUSD/3CRV",
  },
};
JAR_DEFINITIONS.push(JAR_lusdCRV);

export const JAR_fraxCRV: JarDefinition = {
  type: AssetType.JAR,
  id: "pJar Y-3",
  contract: "0x729C6248f9B1Ce62B3d5e31D4eE7EE95cAB32dfD",
  depositToken: {
    addr: "0xd632f22692FaC7611d2AA1C0D552930D43CAEd3B",
    name: "Yearn FRAX/3CRV",
    link: "https://curve.fi/frax/deposit",
    components: ["frax", "3crv"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.YEARN,
  details: {
    apiKey: "FRAXCRV",
    harvestStyle: HarvestStyle.NONE,
  },
  farm: {
    farmAddress: "0xCAbdCB680fC0E477bbB0aC77b2a278cA54D0E6Ff",
    farmNickname: "pYearn FRAX/3CRV",
    farmDepositTokenName: "pYearn FRAX/3CRV",
  },
};
JAR_DEFINITIONS.push(JAR_fraxCRV);

export const JAR_CRV_IB: JarDefinition = {
  type: AssetType.JAR,
  id: "pJar Y-4",
  contract: "0x4E9806345fb39FFebd70A01f177A675805019ba8",
  depositToken: {
    addr: "0x5282a4ef67d9c33135340fb3289cc1711c13638c",
    name: "Yearn Ironbank",
    link: "https://curve.fi/ib/deposit",
    components: ["dai", "usdc", "usdt"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.YEARN,
  details: {
    apiKey: "IBCRV",
    harvestStyle: HarvestStyle.NONE,
  },
  farm: {
    farmAddress: "0x87B54048B60689EE81F48F8797e7FCF64fBf081b",
    farmNickname: "pYearn Ironbank",
    farmDepositTokenName: "pYearn Ironbank",
  },
};
JAR_DEFINITIONS.push(JAR_CRV_IB);

export const JAR_MIM3CRV: JarDefinition = {
  type: AssetType.JAR,
  id: "pjar 0.99m1",
  contract: "0x1Bf62aCb8603Ef7F3A0DFAF79b25202fe1FAEE06",
  depositToken: {
    addr: "0x5a6A4D54456819380173272A5E8E9B9904BdF41B",
    name: "Curve MIM/3CRV",
    link: "https://curve.fi/mim/deposit",
    components: ["mim", "3crv"], // TODO
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.CURVE,
  details: {
    apiKey: "MIM3CRV",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x801BD61c272e8Ded8700736048422AFd63cF2346",
    farmNickname: "pCurve MIM/3CRV",
    farmDepositTokenName: "pCurve MIM/3CRV",
  },
};
JAR_DEFINITIONS.push(JAR_MIM3CRV);

export const JAR_SPELLETH: JarDefinition = {
  type: AssetType.JAR,
  id: "pjar 0.99m2",
  contract: "0xdB84a6A48881545E8595218b7a2A3c9bd28498aE",
  depositToken: {
    addr: "0xb5De0C3753b6E1B4dBA616Db82767F17513E6d4E",
    name: "Sushi SPELL/ETH",
    link: "https://app.sushi.com/add/ETH/0x090185f2135308BaD17527004364eBcC2D37e5F6",
    components: ["spell", "weth"], // TODO
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.SUSHISWAP,
  details: {
    apiKey: "SPELL-ETH",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0xF7eECA3C5B0A01D051690E0cF082AE5006c7e073",
    farmNickname: "pSushi SPELL/ETH",
    farmDepositTokenName: "pSushi SPELL/ETH",
  },
};
JAR_DEFINITIONS.push(JAR_SPELLETH);

export const JAR_MIMETH: JarDefinition = {
  type: AssetType.JAR,
  id: "pjar 0.99m3",
  contract: "0x993f35FaF4AEA39e1dfF28f45098429E0c87126C",
  depositToken: {
    addr: "0x07D5695a24904CC1B6e3bd57cC7780B90618e3c4",
    name: "Sushi MIM/ETH",
    link: "https://app.sushi.com/add/ETH/0x99D8a9C45b2ecA8864373A26D1459e3Dff1e17F3",
    components: ["mim", "weth"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.SUSHISWAP,
  details: {
    apiKey: "MIM-ETH",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0xe58f2f41d586803615fadfc423a41c148fd1d949",
    farmNickname: "pSushi MIM/ETH",
    farmDepositTokenName: "pSushi MIM/ETH",
  },
};
JAR_DEFINITIONS.push(JAR_MIMETH);

export const JAR_FOXETH: JarDefinition = {
  type: AssetType.JAR,
  id: "pjar 0.99f1",
  contract: "0xeb8174F94FDAcCB099422d9A816B8E17d5e393E3",
  depositToken: {
    addr: "0x470e8de2eBaef52014A47Cb5E6aF86884947F08c",
    name: "UniV2 FOX/ETH",
    link: "https://app.uniswap.org/#/add/v2/0xc770eefad204b5180df6a14ee197d99d808ee52d/ETH",
    components: ["fox", "weth"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.UNISWAP,
  details: {
    apiKey: "FOX-ETH",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x58675Af6001e8785e69CE82746a74a37f824EBAE",
    farmNickname: "pUniV2 FOX/ETH",
    farmDepositTokenName: "pUniV2 FOX/ETH",
  },
};
JAR_DEFINITIONS.push(JAR_FOXETH);

export const JAR_CURVE_CVXCRVLP: JarDefinition = {
  type: AssetType.JAR,
  id: "pjar 0e",
  contract: "0xF1478A8387C449c55708a3ec11c143c35daf5E74",
  depositToken: {
    addr: "0x9D0464996170c6B9e75eED71c68B99dDEDf279e8",
    name: "Curve cvxCRV/CRV",
    link: "https://curve.fi/factory/22/deposit",
    components: ["crv", "cvxcrv"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.CURVE,
  details: {
    apiKey: "cvxCRVlp",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0xDAADDdc2Cb94a132A1FC0D6E9999A91639294Aa7",
    farmNickname: "pCurve cvxCRV/CRV",
    farmDepositTokenName: "pCurve cvxCRV/CRV",
  },
};
JAR_DEFINITIONS.push(JAR_CURVE_CVXCRVLP);

export const JAR_CVXCRV: JarDefinition = {
  type: AssetType.JAR,
  id: "pjar 0f",
  contract: "0xB245280Fd1795f5068DEf8E8f32DB7846b030b2B",
  depositToken: {
    addr: "0x62B9c7356A2Dc64a1969e19C23e4f579F9810Aa7",
    name: "Curve cvxCRV",
    link: "https://curve.fi/factory/22/deposit",
    components: ["cvxcrv"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.CURVE, // Not actually a Curve LP but doesn't seem to matter
  details: {
    apiKey: "cvxcrv",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0xd27b644ff94841ea54286a0e93b480c09aaaa1e7",
    farmNickname: "pCurve cvxCRV",
    farmDepositTokenName: "pCurve cvxCRV",
  },
};
JAR_DEFINITIONS.push(JAR_CVXCRV);

export const JAR_CURVE_CRVETHLP: JarDefinition = {
  type: AssetType.JAR,
  id: "pjar 0g",
  contract: "0x1c5Dbb5d9864738e84c126782460C18828859648",
  depositToken: {
    addr: "0xEd4064f376cB8d68F770FB1Ff088a3d0F3FF5c4d",
    name: "Curve CRV/ETH",
    link: "https://curve.fi/crveth/deposit",
    components: ["crv", "weth"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.CURVE,
  details: {
    apiKey: "CRVETH",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x4801154c499c37cfb524cdb617995331ff618c4e",
    farmNickname: "pCurve CRV/ETH",
    farmDepositTokenName: "pCurve CRV/ETH",
  },
};
JAR_DEFINITIONS.push(JAR_CURVE_CRVETHLP);

export const JAR_SUSHI_ETH_TRU: JarDefinition = {
  type: AssetType.JAR,
  id: "pjar 0.99t",
  contract: "0x1d92e1702D7054f74eAC3a9569AeB87FC93e101D",
  depositToken: {
    addr: "0xfCEAAf9792139BF714a694f868A215493461446D",
    name: "Sushi TRU/ETH",
    link: "https://app.sushi.com/add/ETH/0x4C19596f5aAfF459fA38B0f7eD92F11AE6543784",
    components: ["tru", "weth"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.SUSHISWAP,
  details: {
    apiKey: "TRU-ETH",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x9fec5e5d75274f8cfa4261f8e97138920e142470",
    farmNickname: "pSushi TRU/ETH",
    farmDepositTokenName: "pSushi TRU/ETH",
  },
};
JAR_DEFINITIONS.push(JAR_SUSHI_ETH_TRU);



export const JAR_UNIV3_RBN_ETH: JarDefinition = {
  type: AssetType.JAR,
  id: "pjar U3a",
  contract: "0x506748d736b77f51c5b490e4aC6c26B8c3975b14",
  // The deposit token is actually rbn and weth, but the underlying token
  // in the strategy is the univ3 pool token. Kinda fuzzy here
  depositToken: {
    addr: "0x94981F69F7483AF3ae218CbfE65233cC3c60d93a",
    name: "UniV3 RBN/ETH",
    link: "https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x6123b0049f904d730db3c36a31167d9d4121fa6b",
    components: ["rbn", "weth"],
    style: { erc20: false }
  },
  enablement: AssetEnablement.PERMANENTLY_DISABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.UNISWAP_V3,
  details: {
    controller: "0xD6CA5052Bf7b57f6AEdeE0D259a0E9AA4DCa64c6",
    apiKey: "RBN-ETH",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  /*
  farm: {
    farmAddress: "TODO",
    farmNickname: "pUNIv3 RBN/ETH",
    farmDepositTokenName: "pUNIv3 RBN/ETH",
  },*/
};
JAR_DEFINITIONS.push(JAR_UNIV3_RBN_ETH);

// Polygon

export const JAR_COMETH_USDC_WETH: JarDefinition = {
  type: AssetType.JAR,
  id: "polyJar 1a",
  contract: "0x9eD7e3590F2fB9EEE382dfC55c71F9d3DF12556c",
  depositToken: {
    addr: "0x1Edb2D8f791D2a51D56979bf3A25673D6E783232",
    name: "Cometh USDC/WETH",
    link: "https://swap.cometh.io/#/add/0x2791bca1f2de4661ed88a30c99a7a9449aa84174/0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
    components: ["usdc", "weth"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Polygon,
  protocol: AssetProtocol.COMETHSWAP,
  details: {
    apiKey: "COMETH-USDC",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x20b2a3fc7b13ca0ccf7af81a68a14cb3116e8749",
    farmNickname: "pCometh USDC/WETH",
    farmDepositTokenName: "pCometh USDC/WETH",
  },
};
JAR_DEFINITIONS.push(JAR_COMETH_USDC_WETH);

export const JAR_COMETH_PICKLE_MUST: JarDefinition = {
  type: AssetType.JAR,
  id: "polyJar 1b",
  contract: "0x7512105DBb4C0E0432844070a45B7EA0D83a23fD",
  depositToken: {
    addr: "0xb0b5e3bd18eb1e316bcd0bba876570b3c1779c55",
    name: "Cometh PICKLE/MUST",
    link: "https://swap.cometh.io/#/add/0x9c78ee466d6cb57a4d01fd887d2b5dfb2d46288f/0x2b88ad57897a8b496595925f43048301c37615da",
    components: ["pickle", "must"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Polygon,
  protocol: AssetProtocol.COMETHSWAP,
  details: {
    apiKey: "COMETH-PICKLE",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x20b2a3fc7b13ca0ccf7af81a68a14cb3116e8749",
    farmNickname: "pCometh PICKLE/MUST",
    farmDepositTokenName: "pCometh PICKLE/MUST",
  },
};
JAR_DEFINITIONS.push(JAR_COMETH_PICKLE_MUST);

export const JAR_COMETH_MATIC_MUST: JarDefinition = {
  type: AssetType.JAR,
  id: "polyJar 1c",
  contract: "0x91bcc0BBC2ecA760e3b8A79903CbA53483A7012C",
  depositToken: {
    addr: "0x80676b414a905de269d0ac593322af821b683b92",
    name: "Cometh MATIC/MUST",
    link: "https://swap.cometh.io/#/add/0x9c78ee466d6cb57a4d01fd887d2b5dfb2d46288f/0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    components: ["matic", "must"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Polygon,
  protocol: AssetProtocol.COMETHSWAP,
  details: {
    apiKey: "COMETH-MATIC",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x20b2a3fc7b13ca0ccf7af81a68a14cb3116e8749",
    farmNickname: "pCometh MATIC/MUST",
    farmDepositTokenName: "pCometh MATIC/MUST",
  },
};
JAR_DEFINITIONS.push(JAR_COMETH_MATIC_MUST);

export const JAR_AAVEDAI: JarDefinition = {
  type: AssetType.JAR,
  id: "polyJar 2a",
  contract: "0x0519848e57Ba0469AA5275283ec0712c91e20D8E",
  depositToken: {
    addr: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
    name: "Aave DAI",
    link: "https://polygonscan.com/token/0x8f3cf7ad23cd3cadbd9735aff958023239c6a063?a=0x5143e71982a2d5dc63a77f0a5611685cf13c5aaf",
    components: ["dai"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Polygon,
  protocol: AssetProtocol.AAVE_POLYGON,
  details: {
    apiKey: "DAI",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x20b2a3fc7b13ca0ccf7af81a68a14cb3116e8749",
    farmNickname: "pAave DAI",
    farmDepositTokenName: "pAave DAI",
  },
};
JAR_DEFINITIONS.push(JAR_AAVEDAI);

export const JAR_AM3CRV: JarDefinition = {
  type: AssetType.JAR,
  id: "polyJar 3a",
  contract: "0x261b5619d85B710f1c2570b65ee945975E2cC221",
  depositToken: {
    addr: "0xE7a24EF0C5e95Ffb0f6684b813A78F2a3AD7D171",
    name: "Curve am3CRV",
    link: "https://polygon.curve.fi/aave/deposit",
    components: [], // TODO
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Polygon,
  protocol: AssetProtocol.CURVE,
  details: {
    apiKey: "am3CRV",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x20b2a3fc7b13ca0ccf7af81a68a14cb3116e8749",
    farmNickname: "pCurve am3CRV",
    farmDepositTokenName: "pCurve am3CRV",
  },
};
JAR_DEFINITIONS.push(JAR_AM3CRV);

export const JAR_POLY_SUSHI_ETH_USDT: JarDefinition = {
  type: AssetType.JAR,
  id: "polyJar 4a",
  contract: "0x80aB65b1525816Ffe4222607EDa73F86D211AC95",
  depositToken: {
    addr: "0xc2755915a85c6f6c1c0f3a86ac8c058f11caa9c9",
    name: "Sushi USDT/ETH",
    link: "https://app.sushi.com/#/add/0x7ceb23fd6bc0add59e62ac25578270cff1b9f619/0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
    components: ["weth", "usdt"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Polygon,
  protocol: AssetProtocol.SUSHISWAP_POLYGON,
  details: {
    apiKey: "PSLP-USDT",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x20b2a3fc7b13ca0ccf7af81a68a14cb3116e8749",
    farmNickname: "pSushi USDT/ETH",
    farmDepositTokenName: "pSushi USDT/ETH",
  },
};
JAR_DEFINITIONS.push(JAR_POLY_SUSHI_ETH_USDT);

export const JAR_POLY_SUSHI_MATIC_ETH: JarDefinition = {
  type: AssetType.JAR,
  id: "polyJar 4b",
  contract: "0xd438Ba7217240a378238AcE3f44EFaaaF8aaC75A",
  depositToken: {
    addr: "0xc4e595acdd7d12fec385e5da5d43160e8a0bac0e",
    name: "Sushi MATIC/ETH",
    link: "https://app.sushi.com/add/0x7ceb23fd6bc0add59e62ac25578270cff1b9f619/0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    components: ["weth", "matic"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Polygon,
  protocol: AssetProtocol.SUSHISWAP_POLYGON,
  details: {
    apiKey: "PSLP-MATIC",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x20b2a3fc7b13ca0ccf7af81a68a14cb3116e8749",
    farmNickname: "pSushi MATIC/ETH",
    farmDepositTokenName: "pSushi MATIC/ETH",
  },
};
JAR_DEFINITIONS.push(JAR_POLY_SUSHI_MATIC_ETH);

export const JAR_QUICKmiMATICUSDC_old: JarDefinition = {
  type: AssetType.JAR,
  id: "polyJar 5a_old (inactive)",
  contract: "0xf12BB9dcD40201b5A110e11E38DcddF4d11E6f83",
  depositToken: {
    addr: "0x160532d2536175d65c03b97b0630a9802c274dad",
    name: "Quick MAI/USDC",
    link: "https://quickswap.exchange/#/add/0xa3Fa99A148fA48D14Ed51d610c367C61876997F1/0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    components: ["usdc", "mimatic"],
  },
  enablement: AssetEnablement.PERMANENTLY_DISABLED,
  chain: ChainNetwork.Polygon,
  protocol: AssetProtocol.QUICKSWAP_POLYGON,
  details: {
    apiKey: undefined,
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x20b2a3fc7b13ca0ccf7af81a68a14cb3116e8749",
    farmNickname: "pQuick MAI/USDC (old)",
    farmDepositTokenName: "pQuick MAI/USDC (old)",
  },
};
JAR_DEFINITIONS.push(JAR_QUICKmiMATICUSDC_old);

export const JAR_QUICK_MIMATIC_USDC: JarDefinition = {
  type: AssetType.JAR,
  id: "polyJar 5a",
  contract: "0x74dC9cdCa9a96Fd0B7900e6eb953d1EA8567c3Ce",
  depositToken: {
    addr: "0x160532d2536175d65c03b97b0630a9802c274dad",
    name: "Quick MAI/USDC",
    link: "https://quickswap.exchange/#/add/0xa3Fa99A148fA48D14Ed51d610c367C61876997F1/0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    components: ["usdc", "mimatic"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Polygon,
  protocol: AssetProtocol.QUICKSWAP_POLYGON,
  details: {
    apiKey: "QLP-MIMATIC",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x20b2a3fc7b13ca0ccf7af81a68a14cb3116e8749",
    farmNickname: "pQuick MAI/USDC",
    farmDepositTokenName: "pQuick MAI/USDC",
  },
};
JAR_DEFINITIONS.push(JAR_QUICK_MIMATIC_USDC);

export const JAR_QUICK_QI_MIMATIC: JarDefinition = {
  type: AssetType.JAR,
  id: "polyJar 5b",
  contract: "0xd06a56c864C80e4cC76A2eF778183104BF0c848d",
  depositToken: {
    addr: "0x7AfcF11F3e2f01e71B7Cc6b8B5e707E42e6Ea397",
    name: "Quick QI/MIMATIC",
    link: "https://quickswap.exchange/#/add/0xa3Fa99A148fA48D14Ed51d610c367C61876997F1/0x580A84C73811E1839F75d86d75d88cCa0c241fF4",
    components: ["qi", "mimatic"],
  },
  enablement: AssetEnablement.DISABLED,
  chain: ChainNetwork.Polygon,
  protocol: AssetProtocol.QUICKSWAP_POLYGON,
  details: {
    apiKey: "QLP-QI",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0x7749fbd85f388f4a186b1d339c2fd270dd0aa647",
  },
  farm: {
    farmAddress: "0x20b2a3fc7b13ca0ccf7af81a68a14cb3116e8749",
    farmNickname: "pQuick QI/MIMATIC",
    farmDepositTokenName: "pQuick QI/MIMATIC",
  },
};
JAR_DEFINITIONS.push(JAR_QUICK_QI_MIMATIC);

export const JAR_QUICK_QI_MATIC: JarDefinition = {
  type: AssetType.JAR,
  id: "polyJar 5c",
  contract: "0xe5bd4954bd6749a8e939043eedce4c62b41cc6d0",
  depositToken: {
    addr: "0x9a8b2601760814019b7e6ee0052e25f1c623d1e6",
    name: "Quick QI/MATIC",
    link: "https://quickswap.exchange/#/add/0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270/0x580A84C73811E1839F75d86d75d88cCa0c241fF4",
    components: ["qi", "matic"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Polygon,
  protocol: AssetProtocol.QUICKSWAP_POLYGON,
  details: {
    apiKey: "QLP-QIMATIC",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x20b2a3fc7b13ca0ccf7af81a68a14cb3116e8749",
    farmNickname: "pQuick QI/MATIC",
    farmDepositTokenName: "pQuick QI/MATIC",
  },
};
JAR_DEFINITIONS.push(JAR_QUICK_QI_MATIC);

export const JAR_IRON3USD: JarDefinition = {
  type: AssetType.JAR,
  id: "polyJar 6a",
  contract: "0xE484Ed97E19F6B649E78db0F37D173C392F7A1D9",
  depositToken: {
    addr: "0xb4d09ff3dA7f9e9A2BA029cb0A81A989fd7B8f17",
    name: "Iron 3USD",
    link: "https://app.iron.finance/swap/pools/is3usd/deposit",
    components: ["usdc", "usdt", "dai"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Polygon,
  protocol: AssetProtocol.IRON_POLYGON,
  details: {
    apiKey: "IS3USD",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x20b2a3fc7b13ca0ccf7af81a68a14cb3116e8749",
    farmNickname: "pIron 3USD",
    farmDepositTokenName: "pIron 3USD",
  },
};
JAR_DEFINITIONS.push(JAR_IRON3USD);

export const JAR_SUSHI_DINO_USDC: JarDefinition = {
  type: AssetType.JAR,
  id: "polyJar 7a",
  contract: "0xC8450922d18793AD97C401D65BaE8A83aE5353a8",
  depositToken: {
    addr: "0x3324af8417844e70b81555A6D1568d78f4D4Bf1f",
    name: "Sushi DINO/USDC",
    link: "https://app.sushi.com/add/0x2791bca1f2de4661ed88a30c99a7a9449aa84174/0xAa9654BECca45B5BDFA5ac646c939C62b527D394",
    components: ["dino", "usdc"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Polygon,
  protocol: AssetProtocol.SUSHISWAP_POLYGON,
  details: {
    apiKey: "DINO-USDC",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x20b2a3fc7b13ca0ccf7af81a68a14cb3116e8749",
    farmNickname: "pSushi DINO/USDC",
    farmDepositTokenName: "pSushi DINO/USDC",
  },
};
JAR_DEFINITIONS.push(JAR_SUSHI_DINO_USDC);

export const JAR_QUICK_DINO_ETH: JarDefinition = {
  type: AssetType.JAR,
  id: "polyJar 7b",
  contract: "0x1cCDB8152Bb12aa34e5E7F6C9c7870cd6C45E37F",
  depositToken: {
    addr: "0x9f03309A588e33A239Bf49ed8D68b2D45C7A1F11",
    name: "Quick DINO/ETH",
    link: "https://app.sushi.com/add/0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619/0xAa9654BECca45B5BDFA5ac646c939C62b527D394",
    components: ["dino", "weth"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Polygon,
  protocol: AssetProtocol.QUICKSWAP_POLYGON,
  details: {
    apiKey: "DINO-WETH",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x20b2a3fc7b13ca0ccf7af81a68a14cb3116e8749",
    farmNickname: "pQuick DINO/ETH",
    farmDepositTokenName: "pQuick DINO/ETH",
  },
};
JAR_DEFINITIONS.push(JAR_QUICK_DINO_ETH);

export const JAR_POLY_SUSHI_PICKLE_DAI: JarDefinition = {
  type: AssetType.JAR,
  id: "polyJar 4c",
  contract: "0x1D35e4348826857eaFb22739d4e494C0337cb427",
  depositToken: {
    addr: "0x57602582eB5e82a197baE4E8b6B80E39abFC94EB",
    name: "Sushi PICKLE/DAI",
    link: "https://app.sushi.com/add/0x2b88aD57897A8b496595925F43048301C37615Da/0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
    components: ["pickle", "dai"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Polygon,
  protocol: AssetProtocol.QUICKSWAP_POLYGON,
  details: {
    apiKey: "PSLP-PICKLE",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  tags: "pool2",
};
JAR_DEFINITIONS.push(JAR_POLY_SUSHI_PICKLE_DAI);

export const JAR_POLY_SUSHI_WORK_USDC: JarDefinition = {
  type: AssetType.JAR,
  id: "polyJar 7c",
  contract: "0xd170f0a8629a6f7a1e330d5fc455d96e54c09675",
  depositToken: {
    addr: "0xab0454b98daf4a02ea29292e6a8882fb2c787dd4",
    name: "Sushi WORK/USDC",
    link: "https://app.sushi.com/add/0x2791bca1f2de4661ed88a30c99a7a9449aa84174/0x6002410dDA2Fb88b4D0dc3c1D562F7761191eA80",
    components: ["usdc", "work"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Polygon,
  protocol: AssetProtocol.SUSHISWAP_POLYGON,
  details: {
    apiKey: "PSLP-WORK",
    harvestStyle: HarvestStyle.PASSIVE,
  },
};
JAR_DEFINITIONS.push(JAR_POLY_SUSHI_WORK_USDC);

// Arbitrum

export const JAR_ARBITRUM_SLP_MIM_ETH: JarDefinition = {
  type: AssetType.JAR,
  id: "arbJar 1a",
  contract: "0x94feade0d3d832e4a05d459ebea9350c6cdd3bca",
  depositToken: {
    addr: "0xb6DD51D5425861C808Fd60827Ab6CFBfFE604959",
    name: "Sushi MIM/ETH",
    link: "https://app.sushi.com/add/0xFEa7a6a0B346362BF88A9e4A88416B77a57D6c2A/ETH",
    components: ["mim", "weth"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Arbitrum,
  protocol: AssetProtocol.SUSHISWAP_ARBITRUM,
  details: {
    apiKey: "ArbitrumSlpMimEth",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x7ecc7163469f37b777d7b8f45a667314030ace24",
    farmNickname: "pSushi MIM/ETH",
    farmDepositTokenName: "pSushi MIM/ETH",
  },
};
JAR_DEFINITIONS.push(JAR_ARBITRUM_SLP_MIM_ETH);

export const JAR_ARBITRUM_SLP_SPELL_ETH: JarDefinition = {
  type: AssetType.JAR,
  id: "arbJar 1b",
  contract: "0x9Cae10143d7316dF417413C43b79Fb5b44Fa85e2",
  depositToken: {
    addr: "0x8f93Eaae544e8f5EB077A1e09C1554067d9e2CA8",
    name: "Sushi SPELL/ETH",
    link: "https://app.sushi.com/add/0x3e6648c5a70a150a88bce65f4ad4d506fe15d2af/ETH",
    components: ["spell", "weth"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Arbitrum,
  protocol: AssetProtocol.SUSHISWAP_ARBITRUM,
  details: {
    apiKey: "ArbitrumSlpSpellEth",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x7ecc7163469f37b777d7b8f45a667314030ace24",
    farmNickname: "pSushi SPELL/ETH",
    farmDepositTokenName: "pSushi SPELL/ETH",
  },
};
JAR_DEFINITIONS.push(JAR_ARBITRUM_SLP_SPELL_ETH);

export const JAR_ARBITRUM_MIM2CRV: JarDefinition = {
  type: AssetType.JAR,
  id: "arbJar 1c",
  contract: "0x973b669ef8c1459f7cb685bf7d7bcd4150977504",
  depositToken: {
    addr: "0x30dF229cefa463e991e29D42DB0bae2e122B2AC7",
    name: "Curve MIM/2CRV",
    link: "https://arbitrum.curve.fi/factory/0/deposit",
    components: ["mim", "2crv"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Arbitrum,
  protocol: AssetProtocol.CURVE,
  details: {
    apiKey: "Mim2CRV",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x7ecc7163469f37b777d7b8f45a667314030ace24",
    farmNickname: "pCurve MIM/2CRV",
    farmDepositTokenName: "pCurve MIM/2CRV",
  },
};
JAR_DEFINITIONS.push(JAR_ARBITRUM_MIM2CRV);

export const JAR_ARBITRUM_DODO_HND_ETH: JarDefinition = {
  type: AssetType.JAR,
  id: "arbJar 3a",
  contract: "0x4d622C1f40A83C6FA2c0E441AE393e6dE61E7dD2",
  depositToken: {
    addr: "0x65E17c52128396443d4A9A61EaCf0970F05F8a20",
    name: "Dodo HND/ETH",
    link: "https://app.dodoex.io/liquidity?poolAddress=0x65e17c52128396443d4a9a61eacf0970f05f8a20",
    components: ["hnd", "weth"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Arbitrum,
  protocol: AssetProtocol.DODOSWAP,
  details: {
    apiKey: "DodoHndEth",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x7ecc7163469f37b777d7b8f45a667314030ace24",
    farmNickname: "pDodo HND/ETH",
    farmDepositTokenName: "pDodo HND/ETH",
  },
};
JAR_DEFINITIONS.push(JAR_ARBITRUM_DODO_HND_ETH);

export const JAR_ARBITRUM_DODO_USDC: JarDefinition = {
  type: AssetType.JAR,
  id: "arbJar 3b",
  contract: "0x0A9eD9B39613850819a5f80857395bFeA434c22A",
  depositToken: {
    addr: "0x6a58c68FF5C4e4D90EB6561449CC74A64F818dA5",
    name: "Dodo DODO/USDC",
    link: "https://app.dodoex.io/liquidity?network=arbitrum&poolAddress=0x6a58c68ff5c4e4d90eb6561449cc74a64f818da5",
    components: ["dodo", "usdc"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Arbitrum,
  protocol: AssetProtocol.DODOSWAP,
  details: {
    apiKey: "DodoUsdc",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x7ecc7163469f37b777d7b8f45a667314030ace24",
    farmNickname: "pDodo DODO/USDC",
    farmDepositTokenName: "pDodo DODO/USDC",
  },
};
JAR_DEFINITIONS.push(JAR_ARBITRUM_DODO_USDC);

export const JAR_ARBITRUM_CRV_TRICRYPTO: JarDefinition = {
  type: AssetType.JAR,
  id: "arbJar 2b",
  contract: "0x8e93d85afa9e6a092676912c3eb00f46c533a07c",
  depositToken: {
    addr: "0x8e0b8c8bb9db49a46697f3a5bb8a308e744821d2",
    name: "Curve Tricrypto",
    link: "https://arbitrum.curve.fi/tricrypto/deposit",
    components: ["usdt", "wbtc", "weth"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Arbitrum,
  protocol: AssetProtocol.CURVE,
  details: {
    apiKey: "CrvTricrypto",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x7ecc7163469f37b777d7b8f45a667314030ace24",
    farmNickname: "Curve Tricrypto",
    farmDepositTokenName: "Curve Tricrypto",
  },
};
JAR_DEFINITIONS.push(JAR_ARBITRUM_CRV_TRICRYPTO);

export const JAR_ARBITRUM_BAL_TRICRYPTO: JarDefinition = {
  type: AssetType.JAR,
  id: "arbJar 4a",
  contract: "0x0be790c83648c28ed285fee5e0bd79d1d57aae69",
  depositToken: {
    addr: "0x64541216bafffeec8ea535bb71fbc927831d0595",
    name: "Balancer Tricrypto",
    link: "https://arbitrum.balancer.fi/#/pool/0x64541216bafffeec8ea535bb71fbc927831d0595000100000000000000000002/invest",
    components: ["usdc", "wbtc", "weth"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Arbitrum,
  protocol: AssetProtocol.BALANCER_ARBITRUM,
  details: {
    apiKey: "BalTricrypto",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: "0x7ecc7163469f37b777d7b8f45a667314030ace24",
    farmNickname: "Balancer Tricrypto",
    farmDepositTokenName: "Balancer Tricrypto",
  },
};
JAR_DEFINITIONS.push(JAR_ARBITRUM_BAL_TRICRYPTO);



// OKEx Chain

export const JAR_OKEX_OKT_CHE: JarDefinition = {
  type: AssetType.JAR,
  id: "okexJar 1a",
  contract: "0xC3f393FB40F8Cc499C1fe7FA5781495dc6FAc9E9",
  depositToken: {
    addr: "0x8E68C0216562BCEA5523b27ec6B9B6e1cCcBbf88",
    name: "Cherry OKT/CHE",
    link: "https://www.cherryswap.net/#/add/ETH/0x8179D97Eb6488860d816e3EcAFE694a4153F216c",
    components: ["wokt", "cherry"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.OKEx,
  protocol: AssetProtocol.CHERRYSWAP,
  details: {
    apiKey: "CherryOktChe",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x7446BF003b98B7B0D90CE84810AC12d6b8114B62",
    farmNickname: "pCherry OKT/CHE",
    farmDepositTokenName: "pCherry OKT/CHE",
  },
};
JAR_DEFINITIONS.push(JAR_OKEX_OKT_CHE);


export const JAR_OKEX_USDT_CHE: JarDefinition = {
  type: AssetType.JAR,
  id: "okexJar 1b",
  contract: "0xe75c8805f9970c7547255059A22d14001d3D7b94",
  depositToken: {
    addr: "0x089dedbFD12F2aD990c55A2F1061b8Ad986bFF88",
    name: "Cherry USDT/CHE",
    link: "https://www.cherryswap.net/#/add/0x382bb369d343125bfb2117af9c149795c6c65c50/0x8179D97Eb6488860d816e3EcAFE694a4153F216c",
    components: ["usdt", "cherry"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.OKEx,
  protocol: AssetProtocol.CHERRYSWAP,
  details: {
    apiKey: "CherryUsdtChe",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x7446BF003b98B7B0D90CE84810AC12d6b8114B62",
    farmNickname: "pCherry USDT/CHE",
    farmDepositTokenName: "pCherry USDT/CHE",
  },
};
JAR_DEFINITIONS.push(JAR_OKEX_USDT_CHE);


export const JAR_OKEX_OKT_USDT: JarDefinition = {
  type: AssetType.JAR,
  id: "okexJar 1c",
  contract: "0x7072B80D4E259F26b82C2C4e53cDBFB71450195e",
  depositToken: {
    addr: "0xF3098211d012fF5380A03D80f150Ac6E5753caA8",
    name: "Cherry OKT/USDT",
    link: "https://www.cherryswap.net/#/add/ETH/0x382bb369d343125bfb2117af9c149795c6c65c50",
    components: ["wokt", "usdt"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.OKEx,
  protocol: AssetProtocol.CHERRYSWAP,
  details: {
    apiKey: "CherryOktUsdt",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x7446BF003b98B7B0D90CE84810AC12d6b8114B62",
    farmNickname: "pCherry OKT/USDT",
    farmDepositTokenName: "pCherry OKT/USDT",
  },
};
JAR_DEFINITIONS.push(JAR_OKEX_OKT_USDT);



export const JAR_OKEX_ETHK_USDT: JarDefinition = {
  type: AssetType.JAR,
  id: "okexJar 1e",
  contract: "0x4a19C49Ee3233A2AE103487f3699D70573EC2371",
  depositToken: {
    addr: "0x407F7a2F61E5bAB199F7b9de0Ca330527175Da93",
    name: "Cherry ETHK/USDT",
    link: "https://www.cherryswap.net/#/add/0xEF71CA2EE68F45B9Ad6F72fbdb33d707b872315C/0x382bb369d343125bfb2117af9c149795c6c65c50",
    components: ["ethk", "usdt"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.OKEx,
  protocol: AssetProtocol.CHERRYSWAP,
  details: {
    apiKey: "CherryEthkUsdt",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x7446BF003b98B7B0D90CE84810AC12d6b8114B62",
    farmNickname: "pCherry ETHK/USDT",
    farmDepositTokenName: "pCherry ETHK/USDT",
  },
};
JAR_DEFINITIONS.push(JAR_OKEX_ETHK_USDT);



export const JAR_OKEX_BXH_USDT: JarDefinition = {
  type: AssetType.JAR,
  id: "okexJar 2z",
  contract: "0x09c22bdc438b69bcc190efa8f8e3417277e1dd4f",
  depositToken: {
    addr: "0x04b2C23Ca7e29B71fd17655eb9Bd79953fA79faF",
    name: "BXH USDT/BXH",
    link: "https://okswap.bxh.com/#/add/0x145ad28a42bf334104610f7836d0945dffb6de63/0x382bb369d343125bfb2117af9c149795c6c65c50",
    components: ["bxh", "usdt"],
  },
  enablement: AssetEnablement.PERMANENTLY_DISABLED,
  chain: ChainNetwork.OKEx,
  protocol: AssetProtocol.BXH,
  details: {
    apiKey: "BxhUsdt",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x7446BF003b98B7B0D90CE84810AC12d6b8114B62",
    farmNickname: "pBXH USDT/BXH",
    farmDepositTokenName: "pBXH USDT/BXH",
  },
};
JAR_DEFINITIONS.push(JAR_OKEX_BXH_USDT);

export const JAR_OKEX_ETHK_BTCK: JarDefinition = {
  type: AssetType.JAR,
  id: "okexJar 2y",
  contract: "0x2a956403816445553FdA5Cbfce2ac6c251454f6f",
  depositToken: {
    addr: "0x3799Fb39b7fA01E23338C1C3d652FB1AB6E7D5BC",
    name: "BXH ETHK/BTCK",
    link: "https://okswap.bxh.com/#/add/0x145ad28a42bf334104610f7836d0945dffb6de63/0x382bb369d343125bfb2117af9c149795c6c65c50",
    components: ["ethk", "btck"],
  },
  enablement: AssetEnablement.PERMANENTLY_DISABLED,
  chain: ChainNetwork.OKEx,
  protocol: AssetProtocol.BXH,
  details: {
    apiKey: "BXH-ETHK-BTCK",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x7446BF003b98B7B0D90CE84810AC12d6b8114B62",
    farmNickname: "pBXH ETHK/BTCK",
    farmDepositTokenName: "pBXH ETHK/BTCK",
  },
};
JAR_DEFINITIONS.push(JAR_OKEX_ETHK_BTCK);

export const JAR_OKEX_JSWAP_JF_USDT: JarDefinition = {
  type: AssetType.JAR,
  id: "okexJar 2a",
  contract: "0xd120c607911105bc99b510749d102dc63a20bbb4",
  depositToken: {
    addr: "0x8009edebBBdeb4A3BB3003c79877fCd98ec7fB45",
    name: "JSWAP JF/USDT",
    link: "https://app.jswap.finance/#/add/0x382bB369d343125BfB2117af9c149795C6C65C50/0x5fAc926Bf1e638944BB16fb5B787B5bA4BC85b0A",
    components: ["jswap", "usdt"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.OKEx,
  protocol: AssetProtocol.JSWAP,
  details: {
    apiKey: "JSWAP-JF-USDT",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x7446BF003b98B7B0D90CE84810AC12d6b8114B62",
    farmNickname: "pJSWAP JF/USDT",
    farmDepositTokenName: "pJSWAP JF/USDT",
  },
};
JAR_DEFINITIONS.push(JAR_OKEX_JSWAP_JF_USDT);

export const JAR_OKEX_JSWAP_BTCK_USDT: JarDefinition = {
  type: AssetType.JAR,
  id: "okexJar 2b",
  contract: "0x5be52aDF0C54598F0fA6f433B398492748Ecd588",
  depositToken: {
    addr: "0x838a7a7f3e16117763c109d98c79ddcd69f6fd6e",
    name: "JSWAP BTCK/USDT",
    link: "https://app.jswap.finance/#/add/0x382bB369d343125BfB2117af9c149795C6C65C50/0x54e4622DC504176b3BB432dCCAf504569699a7fF",
    components: ["btck", "usdt"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.OKEx,
  protocol: AssetProtocol.JSWAP,
  details: {
    apiKey: "JSWAP-BTCK-USDT",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x7446BF003b98B7B0D90CE84810AC12d6b8114B62",
    farmNickname: "pJSWAP BTCK/USDT",
    farmDepositTokenName: "pJSWAP BTCK/USDT",
  },
};
JAR_DEFINITIONS.push(JAR_OKEX_JSWAP_BTCK_USDT);

export const JAR_OKEX_JSWAP_ETHK_USDT: JarDefinition = {
  type: AssetType.JAR,
  id: "okexJar 2c",
  contract: "0x668d30c30Ffb182964516f549528E06633B48295",
  depositToken: {
    addr: "0xeb02a695126b998e625394e43dfd26ca4a75ce2b",
    name: "JSWAP ETHK/USDT",
    link: "https://app.jswap.finance/#/add/0x382bB369d343125BfB2117af9c149795C6C65C50/0xEF71CA2EE68F45B9Ad6F72fbdb33d707b872315C",
    components: ["ethk", "usdt"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.OKEx,
  protocol: AssetProtocol.JSWAP,
  details: {
    apiKey: "JSWAP-ETHK-USDT",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x7446BF003b98B7B0D90CE84810AC12d6b8114B62",
    farmNickname: "pJSWAP ETHK/USDT",
    farmDepositTokenName: "pJSWAP ETHK/USDT",
  },
};
JAR_DEFINITIONS.push(JAR_OKEX_JSWAP_ETHK_USDT);

export const JAR_OKEX_JSWAP_USDT_DAIK: JarDefinition = {
  type: AssetType.JAR,
  id: "okexJar 2d",
  contract: "0xb697e2cb609f19ccd3594964cea1a7e03cef47f2",
  depositToken: {
    addr: "0xE9313b7dea9cbaBd2df710C25bef44A748Ab38a9",
    name: "JSWAP DAIK/USDT",
    link: "https://app.jswap.finance/#/add/0x21cDE7E32a6CAF4742d00d44B07279e7596d26B9/0x382bB369d343125BfB2117af9c149795C6C65C50",
    components: ["daik", "usdt"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.OKEx,
  protocol: AssetProtocol.JSWAP,
  details: {
    apiKey: "JSWAP-DAIK-USDT",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x7446BF003b98B7B0D90CE84810AC12d6b8114B62",
    farmNickname: "pJSWAP DAIK/USDT",
    farmDepositTokenName: "pJSWAP DAIK/USDT",
  },
};
JAR_DEFINITIONS.push(JAR_OKEX_JSWAP_USDT_DAIK);

export const JAR_OKEX_JSWAP_DAIK_USDC: JarDefinition = {
  type: AssetType.JAR,
  id: "okexJar 2e",
  contract: "0x2e148f4848f79105a68444c49d078c6a6edcb26d",
  depositToken: {
    addr: "0xa25E1C05c58EDE088159cc3cD24f49445d0BE4b2",
    name: "JSWAP DAIK/USDC",
    link: "https://app.jswap.finance/#/add/0x21cDE7E32a6CAF4742d00d44B07279e7596d26B9/0xc946DAf81b08146B1C7A8Da2A851Ddf2B3EAaf85",
    components: ["daik", "usdc"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.OKEx,
  protocol: AssetProtocol.JSWAP,
  details: {
    apiKey: "JSWAP-DAIK-USDC",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x7446BF003b98B7B0D90CE84810AC12d6b8114B62",
    farmNickname: "pJSWAP DAIK/USDC",
    farmDepositTokenName: "pJSWAP DAIK/USDC",
  },
};
JAR_DEFINITIONS.push(JAR_OKEX_JSWAP_DAIK_USDC);

// Harmony One

export const JAR_ONE_SUSHI_ETH_DAI: JarDefinition = {
  type: AssetType.JAR,
  id: "oneJar 1a",
  contract: "0xce9075ab4158aa05447df12e5bf09d51e21516e9",
  depositToken: {
    addr: "0xc5B8129B411EF5f5BE22e74De6fE86C3b69e641d",
    name: "SUSHI ETH/DAI",
    link: "https://app.sushi.com/add/0x6983D1E6DEf3690C4d616b13597A09e6193EA013/0xEf977d2f931C1978Db5F6747666fa1eACB0d0339",
    components: ["1eth", "1dai"],
  },
  enablement: AssetEnablement.DEV,
  chain: ChainNetwork.Harmony,
  protocol: AssetProtocol.SUSHISWAP_HARMONY,
  details: {
    apiKey: "HSLP-ETH-DAI",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSUSHI ETH/DAI",
    farmDepositTokenName: "pSUSHI ETH/DAI",
  },
};
JAR_DEFINITIONS.push(JAR_ONE_SUSHI_ETH_DAI);

export const JAR_ONE_SUSHI_WBTC_ETH: JarDefinition = {
  type: AssetType.JAR,
  id: "oneJar 1b",
  contract: "0xbe6300c2ffc26f8c6cdd3a468867caf8bb01cfce",
  depositToken: {
    addr: "0x39bE7c95276954a6f7070F9BAa38db2123691Ed0",
    name: "SUSHI WBTC/ETH",
    link: "https://app.sushi.com/add/0x3095c7557bCb296ccc6e363DE01b760bA031F2d9/0x6983D1E6DEf3690C4d616b13597A09e6193EA013",
    components: ["1wbtc", "1eth"],
  },
  enablement: AssetEnablement.DEV,
  chain: ChainNetwork.Harmony,
  protocol: AssetProtocol.SUSHISWAP_HARMONY,
  details: {
    apiKey: "HSLP-WBTC-ETH",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSUSHI WBTC/ETH",
    farmDepositTokenName: "pSUSHI WBTC/ETH",
  },
};
JAR_DEFINITIONS.push(JAR_ONE_SUSHI_WBTC_ETH);

export const JAR_ONE_SUSHI_ETH_ONE: JarDefinition = {
  type: AssetType.JAR,
  id: "oneJar 1c",
  contract: "0xab1a9bf446c77a9873023646147e36ea34279c72",
  depositToken: {
    addr: "0xeb049F1eD546F8efC3AD57f6c7D22F081CcC7375",
    name: "SUSHI ETH/ONE",
    link: "https://app.sushi.com/add/0x6983D1E6DEf3690C4d616b13597A09e6193EA013/ETH",
    components: ["1eth", "wone"],
  },
  enablement: AssetEnablement.DEV,
  chain: ChainNetwork.Harmony,
  protocol: AssetProtocol.SUSHISWAP_HARMONY,
  details: {
    apiKey: "HSLP-ETH-ONE",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSUSHI ETH/ONE",
    farmDepositTokenName: "pSUSHI ETH/ONE",
  },
};
JAR_DEFINITIONS.push(JAR_ONE_SUSHI_ETH_ONE);

// Moonriver

export const JAR_MOVR_SOLAR_MOVR: JarDefinition = {
  type: AssetType.JAR,
  id: "moonJar 1a",
  contract: "0x55D5BCEf2BFD4921B8790525FF87919c2E26bD03",
  depositToken: {
    addr: "0x7eDA899b3522683636746a2f3a7814e6fFca75e1",
    name: "SOLAR SOLAR/MOVR",
    link: "https://app.solarbeam.io/exchange/add/0x6bD193Ee6D2104F14F94E2cA6efefae561A4334B/ETH",
    components: ["solar", "movr"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Moonriver,
  protocol: AssetProtocol.SOLARSWAP,
  details: {
    apiKey: "SLP-SOLAR-MOVR",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSOLAR SOLAR/MOVR",
    farmDepositTokenName: "pSOLAR SOLAR/MOVR",
  },
};
JAR_DEFINITIONS.push(JAR_MOVR_SOLAR_MOVR);

export const JAR_MOVR_SOLAR_DAI_USDC: JarDefinition = {
  type: AssetType.JAR,
  id: "moonJar 1b",
  contract: "0xE29C6d11D4153ac0d25e463919401EF02558627B",
  depositToken: {
    addr: "0xFE1b71BDAEE495dCA331D28F5779E87bd32FbE53",
    name: "SOLAR DAI/USDC",
    link: "https://app.solarbeam.io/exchange/add/0x80a16016cc4a2e6a2caca8a4a498b1699ff0f844/0xe3f5a90f9cb311505cd691a46596599aa1a0ad7d",
    components: ["dai", "usdc"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Moonriver,
  protocol: AssetProtocol.SOLARSWAP,
  details: {
    apiKey: "SLP-DAI-USDC",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSOLAR DAI/USDC",
    farmDepositTokenName: "pSOLAR DAI/USDC",
  },
};
JAR_DEFINITIONS.push(JAR_MOVR_SOLAR_DAI_USDC);

export const JAR_MOVR_SOLAR_MOVR_USDC: JarDefinition = {
  type: AssetType.JAR,
  id: "moonJar 1c",
  contract: "0x8f32bd87ba00954b9f89296db90ff66183a5dbb1",
  depositToken: {
    addr: "0xe537f70a8b62204832b8ba91940b77d3f79aeb81",
    name: "SOLAR MOVR/USDC",
    link: "https://app.solarbeam.io/exchange/add/ETH/0xe3f5a90f9cb311505cd691a46596599aa1a0ad7d",
    components: ["movr", "usdc"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Moonriver,
  protocol: AssetProtocol.SOLARSWAP,
  details: {
    apiKey: "SLP-MOVR-USDC",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSOLAR MOVR/USDC",
    farmDepositTokenName: "pSOLAR MOVR/USDC",
  },
};
JAR_DEFINITIONS.push(JAR_MOVR_SOLAR_MOVR_USDC);

export const JAR_MOVR_SOLAR_SOLAR_USDC: JarDefinition = {
  type: AssetType.JAR,
  id: "moonJar 1d",
  contract: "0x746fd0fcB62dd739ED5e65b37953D5fab8cB3df6",
  depositToken: {
    addr: "0xdb66BE1005f5Fe1d2f486E75cE3C50B52535F886",
    name: "SOLAR SOLAR/USDC",
    link: "https://app.solarbeam.io/exchange/add/0x6bD193Ee6D2104F14F94E2cA6efefae561A4334B/0xe3f5a90f9cb311505cd691a46596599aa1a0ad7d",
    components: ["solar", "usdc"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Moonriver,
  protocol: AssetProtocol.SOLARSWAP,
  details: {
    apiKey: "SLP-SOLAR-USDC",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSOLAR SOLAR/USDC",
    farmDepositTokenName: "pSOLAR SOLAR/USDC",
  },
};
JAR_DEFINITIONS.push(JAR_MOVR_SOLAR_SOLAR_USDC);

export const JAR_MOVR_SOLAR_USDT_USDC: JarDefinition = {
  type: AssetType.JAR,
  id: "moonJar 1e",
  contract: "0xfdd190C0a619Cc3e549FDDEa8bc02286a3699c56",
  depositToken: {
    addr: "0x2a44696DDc050f14429bd8a4A05c750C6582bF3b",
    name: "SOLAR USDT/USDC",
    link: "https://app.solarbeam.io/exchange/add/0xB44a9B6905aF7c801311e8F4E76932ee959c663C/0xe3f5a90f9cb311505cd691a46596599aa1a0ad7d",
    components: ["usdt", "usdc"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Moonriver,
  protocol: AssetProtocol.SOLARSWAP,
  details: {
    apiKey: "SLP-USDT-USDC",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSOLAR USDT/USDC",
    farmDepositTokenName: "pSOLAR USDT/USDC",
  },
};
JAR_DEFINITIONS.push(JAR_MOVR_SOLAR_USDT_USDC);

export const JAR_MOVR_SOLAR_BUSD_USDC: JarDefinition = {
  type: AssetType.JAR,
  id: "moonJar 1f",
  contract: "0x7F58f167EC834775143Ac8A17BA3c4d6461F99db",
  depositToken: {
    addr: "0x384704557F73fBFAE6e9297FD1E6075FC340dbe5",
    name: "SOLAR BUSD/USDC",
    link: "https://app.solarbeam.io/exchange/add/0x5D9ab5522c64E1F6ef5e3627ECCc093f56167818/0xe3f5a90f9cb311505cd691a46596599aa1a0ad7d",
    components: ["busd", "usdc"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Moonriver,
  protocol: AssetProtocol.SOLARSWAP,
  details: {
    apiKey: "SLP-BUSD-USDC",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSOLAR BUSD/USDC",
    farmDepositTokenName: "pSOLAR BUSD/USDC",
  },
};
JAR_DEFINITIONS.push(JAR_MOVR_SOLAR_BUSD_USDC);

export const JAR_MOVR_SOLAR_ETH_USDC: JarDefinition = {
  type: AssetType.JAR,
  id: "moonJar 1g",
  contract: "0x2189F95cff292889B5d1697ef964Ea47d988AB1f",
  depositToken: {
    addr: "0xA0D8DFB2CC9dFe6905eDd5B71c56BA92AD09A3dC",
    name: "SOLAR ETH/USDC",
    link: "https://app.solarbeam.io/exchange/add/0x639A647fbe20b6c8ac19E48E2de44ea792c62c5C/0xe3f5a90f9cb311505cd691a46596599aa1a0ad7d",
    components: ["eth", "usdc"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Moonriver,
  protocol: AssetProtocol.SOLARSWAP,
  details: {
    apiKey: "SLP-ETH-USDC",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSOLAR ETH/USDC",
    farmDepositTokenName: "pSOLAR ETH/USDC",
  },
};
JAR_DEFINITIONS.push(JAR_MOVR_SOLAR_ETH_USDC);

export const JAR_MOVR_SOLAR_BNB_BUSD: JarDefinition = {
  type: AssetType.JAR,
  id: "moonJar 1h",
  contract: "0xaA459A8B2ce9EF01cC76D2feeF78d4Aa2720969c",
  depositToken: {
    addr: "0xfb1d0D6141Fc3305C63f189E39Cc2f2F7E58f4c2",
    name: "SOLAR BNB/BUSD",
    link: "https://app.solarbeam.io/exchange/add/0x2bF9b864cdc97b08B6D79ad4663e71B8aB65c45c/0x5D9ab5522c64E1F6ef5e3627ECCc093f56167818",
    components: ["bnb", "busd"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Moonriver,
  protocol: AssetProtocol.SOLARSWAP,
  details: {
    apiKey: "SLP-BNB-BUSD",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSOLAR BNB/BUSD",
    farmDepositTokenName: "pSOLAR BNB/BUSD",
  },
};
JAR_DEFINITIONS.push(JAR_MOVR_SOLAR_BNB_BUSD);

export const JAR_MOVR_SOLAR_WBTC_USDC: JarDefinition = {
  type: AssetType.JAR,
  id: "moonJar 1i",
  contract: "0x5395F1d5e40fA4C98dB6e7128b81cf16441F7F9A",
  depositToken: {
    addr: "0x83d7a3fc841038E8c8F46e6192BBcCA8b19Ee4e7",
    name: "SOLAR WBTC/USDC",
    link: "https://app.solarbeam.io/exchange/add/0x6aB6d61428fde76768D7b45D8BFeec19c6eF91A8/0xe3f5a90f9cb311505cd691a46596599aa1a0ad7d",
    components: ["wbtc", "usdc"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Moonriver,
  protocol: AssetProtocol.SOLARSWAP,
  details: {
    apiKey: "SLP-WBTC-USDC",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSOLAR WBTC/USDC",
    farmDepositTokenName: "pSOLAR WBTC/USDC",
  },
};
JAR_DEFINITIONS.push(JAR_MOVR_SOLAR_WBTC_USDC);

export const JAR_MOVR_SOLAR_AVAX_MOVR: JarDefinition = {
  type: AssetType.JAR,
  id: "moonJar 1j",
  contract: "0x5c41e2Ba7f9A368e9ff83b849589699322Bb6a04",
  depositToken: {
    addr: "0xb9a61ac826196AbC69A3C66ad77c563D6C5bdD7b",
    name: "SOLAR AVAX/MOVR",
    link: "https://app.solarbeam.io/exchange/add/0x14a0243C333A5b238143068dC3A7323Ba4C30ECB/ETH",
    components: ["avax", "movr"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Moonriver,
  protocol: AssetProtocol.SOLARSWAP,
  details: {
    apiKey: "SLP-AVAX-MOVR",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSOLAR AVAX/MOVR",
    farmDepositTokenName: "pSOLAR AVAX/MOVR",
  },
};
JAR_DEFINITIONS.push(JAR_MOVR_SOLAR_AVAX_MOVR);

export const JAR_MOVR_SOLAR_MAI_USDC: JarDefinition = {
  type: AssetType.JAR,
  id: "moonJar 1k",
  contract: "0xB49c5e326C325bd3d630c17623e70fA8c605E5e1",
  depositToken: {
    addr: "0x55Ee073B38BF1069D5F1Ed0AA6858062bA42F5A9",
    name: "SOLAR MAI/USDC",
    link: "https://app.solarbeam.io/exchange/add/0x7f5a79576620C046a293F54FFCdbd8f2468174F1/0xe3f5a90f9cb311505cd691a46596599aa1a0ad7d",
    components: ["mai", "usdc"],
  },
  enablement: AssetEnablement.PERMANENTLY_DISABLED,
  chain: ChainNetwork.Moonriver,
  protocol: AssetProtocol.SOLARSWAP,
  details: {
    apiKey: "SLP-MAI-USDC",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSOLAR MAI/USDC",
    farmDepositTokenName: "pSOLAR MAI/USDC",
  },
};
JAR_DEFINITIONS.push(JAR_MOVR_SOLAR_MAI_USDC);

export const JAR_MOVR_SOLAR_MIM_USDC: JarDefinition = {
  type: AssetType.JAR,
  id: "moonJar 1l",
  contract: "0x826a9cD66A20Ff4c2dC7AAcfa3e413dfee6a71E4",
  depositToken: {
    addr: "0x9051fB701d6D880800e397e5B5d46FdDfAdc7056",
    name: "SOLAR MIM/USDC",
    link: "https://app.solarbeam.io/exchange/add/0x0caE51e1032e8461f4806e26332c030E34De3aDb/0xe3f5a90f9cb311505cd691a46596599aa1a0ad7d",
    components: ["mim", "usdc"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Moonriver,
  protocol: AssetProtocol.SOLARSWAP,
  details: {
    apiKey: "SLP-MIM-USDC",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSOLAR MIM/USDC",
    farmDepositTokenName: "pSOLAR MIM/USDC",
  },
};
JAR_DEFINITIONS.push(JAR_MOVR_SOLAR_MIM_USDC);

export const JAR_MOVR_SOLAR_MOVR_FTM: JarDefinition = {
  type: AssetType.JAR,
  id: "moonJar 1m",
  contract: "0x99865c1c45D111801A93342A3B61132d7B97b12D",
  depositToken: {
    addr: "0x1eebed8F28A6865a76D91189FD6FC45F4F774d67",
    name: "SOLAR MOVR/FTM",
    link: "https://app.solarbeam.io/exchange/add/ETH/0xaD12daB5959f30b9fF3c2d6709f53C335dC39908",
    components: ["movr", "ftm"],
  },
  enablement: AssetEnablement.PERMANENTLY_DISABLED,
  chain: ChainNetwork.Moonriver,
  protocol: AssetProtocol.SOLARSWAP,
  details: {
    apiKey: "SLP-MOVR-FTM",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSOLAR MOVR/FTM",
    farmDepositTokenName: "pSOLAR MOVR/FTM",
  },
};
JAR_DEFINITIONS.push(JAR_MOVR_SOLAR_MOVR_FTM);

export const JAR_MOVR_SOLAR_MOVR_RIB: JarDefinition = {
  type: AssetType.JAR,
  id: "moonJar 1n",
  contract: "0x0D57bDF54741E52D8469ce96f86E28a463659951",
  depositToken: {
    addr: "0x0acDB54E610dAbC82b8FA454b21AD425ae460DF9",
    name: "SOLAR MOVR/RIB",
    link: "https://app.solarbeam.io/exchange/add/ETH/0xbD90A6125a84E5C512129D622a75CDDE176aDE5E",
    components: ["movr", "rib"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Moonriver,
  protocol: AssetProtocol.SOLARSWAP,
  details: {
    apiKey: "SLP-MOVR-RIB",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSOLAR MOVR/RIB",
    farmDepositTokenName: "pSOLAR MOVR/RIB",
  },
};
JAR_DEFINITIONS.push(JAR_MOVR_SOLAR_MOVR_RIB);

export const JAR_MOVR_SOLAR_MOVR_RELAY: JarDefinition = {
  type: AssetType.JAR,
  id: "moonJar 1o",
  contract: "0x7f59FD56e1b878505f14fD72d847EEE3605aeCAA",
  depositToken: {
    addr: "0x9e0d90ebB44c22303Ee3d331c0e4a19667012433",
    name: "SOLAR MOVR/RELAY",
    link: "https://app.solarbeam.io/exchange/add/ETH/0xAd7F1844696652ddA7959a49063BfFccafafEfe7",
    components: ["movr", "relay"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Moonriver,
  protocol: AssetProtocol.SOLARSWAP,
  details: {
    apiKey: "SLP-MOVR-RELAY",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSOLAR MOVR/RELAY",
    farmDepositTokenName: "pSOLAR MOVR/RELAY",
  },
};
JAR_DEFINITIONS.push(JAR_MOVR_SOLAR_MOVR_RELAY);

export const JAR_MOVR_SOLAR_SOLAR_RIB: JarDefinition = {
  type: AssetType.JAR,
  id: "moonJar 1p",
  contract: "0x01B1B46f4a6Fe65fd3e0163e283F6dB9182A605b",
  depositToken: {
    addr: "0xf9b7495b833804e4d894fC5f7B39c10016e0a911",
    name: "SOLAR SOLAR/RIB",
    link: "https://app.solarbeam.io/exchange/add/0x6bD193Ee6D2104F14F94E2cA6efefae561A4334B/0xbD90A6125a84E5C512129D622a75CDDE176aDE5E",
    components: ["solar", "rib"],
  },
  enablement: AssetEnablement.PERMANENTLY_DISABLED,
  chain: ChainNetwork.Moonriver,
  protocol: AssetProtocol.SOLARSWAP,
  details: {
    apiKey: "SLP-SOLAR-RIB",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSOLAR SOLAR/RIB",
    farmDepositTokenName: "pSOLAR SOLAR/RIB",
  },
};
JAR_DEFINITIONS.push(JAR_MOVR_SOLAR_SOLAR_RIB);

export const JAR_MOVR_SOLAR_PETS_MOVR: JarDefinition = {
  type: AssetType.JAR,
  id: "moonJar 1q",
  contract: "0xd22Fd1b3CefcD0A699F65AC35Ba51264CF6aa7EE",
  depositToken: {
    addr: "0x9f9a7a3f8F56AFB1a2059daE1E978165816cea44",
    name: "SOLAR PETS/MOVR",
    link: "https://app.solarbeam.io/exchange/add/0x1e0F2A75Be02c025Bd84177765F89200c04337Da/ETH",
    components: ["pets", "movr"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Moonriver,
  protocol: AssetProtocol.SOLARSWAP,
  details: {
    apiKey: "SLP-PETS-MOVR",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSOLAR PETS/MOVR",
    farmDepositTokenName: "pSOLAR PETS/MOVR",
  },
};

JAR_DEFINITIONS.push(JAR_MOVR_SOLAR_PETS_MOVR);

export const JAR_MOVR_SOLAR_FRAX_MOVR: JarDefinition = {
  type: AssetType.JAR,
  id: "moonJar 1r",
  contract: "0x56E2f4e6E32a2dDdB02E0cFe823DC15318928b6D",
  depositToken: {
    addr: "0x2cc54b4A3878e36E1C754871438113C1117a3ad7",
    name: "SOLAR FRAX/MOVR",
    link: "https://app.solarbeam.io/exchange/add/0x1A93B23281CC1CDE4C4741353F3064709A16197d/ETH",
    components: ["frax", "movr"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Moonriver,
  protocol: AssetProtocol.SOLARSWAP,
  details: {
    apiKey: "SLP-FRAX-MOVR",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSOLAR FRAX/MOVR",
    farmDepositTokenName: "pSOLAR FRAX/MOVR",
  },
};
JAR_DEFINITIONS.push(JAR_MOVR_SOLAR_FRAX_MOVR);

export const JAR_MOVR_SOLAR_MIM_MOVR: JarDefinition = {
  type: AssetType.JAR,
  id: "moonJar 1s",
  contract: "0xD873aDa5C0c16Bb1DBAC8a7A2e7a4eb79C5c0D78",
  depositToken: {
    addr: "0x9432B25fBD8a37e5A1300e36a96BD14E1E6f5c90",
    name: "SOLAR MIM/MOVR",
    link: "https://app.solarbeam.io/exchange/add/0x0caE51e1032e8461f4806e26332c030E34De3aDb/ETH",
    components: ["mim", "movr"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Moonriver,
  protocol: AssetProtocol.SOLARSWAP,
  details: {
    apiKey: "SLP-MIM-MOVR",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSOLAR MIM/MOVR",
    farmDepositTokenName: "pSOLAR MIM/MOVR",
  },
};
JAR_DEFINITIONS.push(JAR_MOVR_SOLAR_MIM_MOVR);

export const JAR_MOVR_SOLAR_BNB_MOVR: JarDefinition = {
  type: AssetType.JAR,
  id: "moonJar 1t",
  contract: "0x59A08Cb313ad49E716CC073CC43656cb17b0fBAb",
  depositToken: {
    addr: "0xBe2aBe58eDAae96B4303F194d2fAD5233BaD3d87",
    name: "SOLAR BNB/MOVR",
    link: "https://app.solarbeam.io/exchange/add/0x2bF9b864cdc97b08B6D79ad4663e71B8aB65c45c/ETH",
    components: ["bnb", "movr"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Moonriver,
  protocol: AssetProtocol.SOLARSWAP,
  details: {
    apiKey: "SLP-BNB-MOVR",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSOLAR BNB/MOVR",
    farmDepositTokenName: "pSOLAR BNB/MOVR",
  },
};
JAR_DEFINITIONS.push(JAR_MOVR_SOLAR_BNB_MOVR);

export const JAR_MOVR_SOLAR_ETH_MOVR: JarDefinition = {
  type: AssetType.JAR,
  id: "moonJar 1u",
  contract: "0x986080e8e9968E1dA5AB14473b1884b5A7342EC2",
  depositToken: {
    addr: "0x0d171b55fC8d3BDDF17E376FdB2d90485f900888",
    name: "SOLAR ETH/MOVR",
    link: "https://app.solarbeam.io/exchange/add/0x639A647fbe20b6c8ac19E48E2de44ea792c62c5C/ETH",
    components: ["eth", "movr"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Moonriver,
  protocol: AssetProtocol.SOLARSWAP,
  details: {
    apiKey: "SLP-ETH-MOVR",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSOLAR ETH/MOVR",
    farmDepositTokenName: "pSOLAR ETH/MOVR",
  },
};
JAR_DEFINITIONS.push(JAR_MOVR_SOLAR_ETH_MOVR);


export const JAR_CRO_VVS_CRO_BIFI: JarDefinition = {
  type: AssetType.JAR,
  id: "croJar 1a",
  contract: "0xF125357f05c75F9beEA0Cc721D7a2A0eA03aaa63",
  depositToken: {
    addr: "0x1803E360393A472beC6E1A688BDF7048d3076b1A",
    name: "VVS CRO/BIFI",
    link: "https://vvs.finance/add/0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23/0xe6801928061CDbE32AC5AD0634427E140EFd05F9",
    components: ["cro", "bifi"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Cronos,
  protocol: AssetProtocol.VVS_CRONOS,
  details: {
    apiKey: "VLP-CRO-BIFI",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pVVS CRO/BIFI",
    farmDepositTokenName: "pVVS CRO/BIFI",
  },
};
JAR_DEFINITIONS.push(JAR_CRO_VVS_CRO_BIFI);

export const JAR_CRO_VVS_CRO_DAI: JarDefinition = {
  type: AssetType.JAR,
  id: "croJar 1b",
  contract: "0x4Dc96fe980B2D14C7A74FCCf5E83DC6943dF8380",
  depositToken: {
    addr: "0x3Eb9FF92e19b73235A393000C176c8bb150F1B20",
    name: "VVS CRO/DAI",
    link: "https://vvs.finance/add/0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23/0xF2001B145b43032AAF5Ee2884e456CCd805F677D",
    components: ["cro", "dai"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Cronos,
  protocol: AssetProtocol.VVS_CRONOS,
  details: {
    apiKey: "VLP-CRO-DAI",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pVVS CRO/DAI",
    farmDepositTokenName: "pVVS CRO/DAI",
  },
};
JAR_DEFINITIONS.push(JAR_CRO_VVS_CRO_DAI);

export const JAR_CRO_VVS_CRO_SHIB: JarDefinition = {
  type: AssetType.JAR,
  id: "croJar 1d",
  contract: "0x5a10B857Fb05Ce8E71440CA063AEb504AeDE5535",
  depositToken: {
    addr: "0xc9eA98736dbC94FAA91AbF9F4aD1eb41e7fb40f4",
    name: "VVS CRO/SHIB",
    link: "https://vvs.finance/add/0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23/0xbED48612BC69fA1CaB67052b42a95FB30C1bcFee",
    components: ["cro", "shib"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Cronos,
  protocol: AssetProtocol.VVS_CRONOS,
  details: {
    apiKey: "VLP-CRO-SHIB",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pVVS CRO/SHIB",
    farmDepositTokenName: "pVVS CRO/SHIB",
  },
};
JAR_DEFINITIONS.push(JAR_CRO_VVS_CRO_SHIB);

export const JAR_CRO_VVS_CRO_USDC: JarDefinition = {
  type: AssetType.JAR,
  id: "croJar 1e",
  contract: "0x795f9EE745Ed4a3d3597304C494b95B31894849F",
  depositToken: {
    addr: "0xe61Db569E231B3f5530168Aa2C9D50246525b6d6",
    name: "VVS CRO/USDC",
    link: "https://vvs.finance/add/0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23/0xc21223249CA28397B4B6541dfFaEcC539BfF0c59",
    components: ["cro", "usdc"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Cronos,
  protocol: AssetProtocol.VVS_CRONOS,
  details: {
    apiKey: "VLP-CRO-USDC",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pVVS CRO/USDC",
    farmDepositTokenName: "pVVS CRO/USDC",
  },
};
JAR_DEFINITIONS.push(JAR_CRO_VVS_CRO_USDC);

export const JAR_CRO_VVS_CRO_USDT: JarDefinition = {
  type: AssetType.JAR,
  id: "croJar 1f",
  contract: "0x4349b140F40e857ffC9981536e627Bca54976e56",
  depositToken: {
    addr: "0x3d2180DB9E1B909f35C398BC39EF36108C0FC8c3",
    name: "VVS CRO/USDT",
    link: "https://vvs.finance/add/0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23/0x66e428c3f67a68878562e79A0234c1F83c208770",
    components: ["cro", "usdt"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Cronos,
  protocol: AssetProtocol.VVS_CRONOS,
  details: {
    apiKey: "VLP-CRO-USDT",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pVVS CRO/USDT",
    farmDepositTokenName: "pVVS CRO/USDT",
  },
};
JAR_DEFINITIONS.push(JAR_CRO_VVS_CRO_USDT);

export const JAR_CRO_VVS_VVS_USDC: JarDefinition = {
  type: AssetType.JAR,
  id: "croJar 1g",
  contract: "0xc52C3aA6EC7EB406E3685e822AEE18FF2B03d3E4",
  depositToken: {
    addr: "0x814920D1b8007207db6cB5a2dD92bF0b082BDBa1",
    name: "VVS VVS/USDC",
    link: "https://vvs.finance/add/0x2D03bECE6747ADC00E1a131BBA1469C15fD11e03/0xc21223249CA28397B4B6541dfFaEcC539BfF0c59",
    components: ["vvs", "usdc"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Cronos,
  protocol: AssetProtocol.VVS_CRONOS,
  details: {
    apiKey: "VLP-VVS-USDC",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pVVS VVS/USDC",
    farmDepositTokenName: "pVVS VVS/USDC",
  },
};
JAR_DEFINITIONS.push(JAR_CRO_VVS_VVS_USDC);

export const JAR_CRO_VVS_VVS_USDT: JarDefinition = {
  type: AssetType.JAR,
  id: "croJar 1h",
  contract: "0x32645B27007167E6089ACD2d7D5d6484797b4B68",
  depositToken: {
    addr: "0x280aCAD550B2d3Ba63C8cbff51b503Ea41a1c61B",
    name: "VVS VVS/USDT",
    link: "https://vvs.finance/add/0x2D03bECE6747ADC00E1a131BBA1469C15fD11e03/0x66e428c3f67a68878562e79A0234c1F83c208770",
    components: ["vvs", "usdt"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Cronos,
  protocol: AssetProtocol.VVS_CRONOS,
  details: {
    apiKey: "VLP-VVS-USDT",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pVVS VVS/USDT",
    farmDepositTokenName: "pVVS VVS/USDT",
  },
};
JAR_DEFINITIONS.push(JAR_CRO_VVS_VVS_USDT);

export const JAR_CRO_VVS_CRO_VVS: JarDefinition = {
  type: AssetType.JAR,
  id: "croJar 1i",
  contract: "0x5F5572fa2EFd7d9a2eccfC6bA4a1b4b8942bDd77",
  depositToken: {
    addr: "0xbf62c67eA509E86F07c8c69d0286C0636C50270b",
    name: "VVS CRO/VVS",
    link: "https://vvs.finance/add/0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23/0x2D03bECE6747ADC00E1a131BBA1469C15fD11e03",
    components: ["cro", "vvs"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Cronos,
  protocol: AssetProtocol.VVS_CRONOS,
  details: {
    apiKey: "VLP-CRO-VVS",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pVVS CRO/VVS",
    farmDepositTokenName: "pVVS CRO/VVS",
  },
};
JAR_DEFINITIONS.push(JAR_CRO_VVS_CRO_VVS);

export const JAR_CRO_VVS_CRO_BTC: JarDefinition = {
  type: AssetType.JAR,
  id: "croJar 1j",
  contract: "0xb289Bedd68F6b3cFd221C63C0f56BC0cc9430473",
  depositToken: {
    addr: "0x8F09fFf247B8fDB80461E5Cf5E82dD1aE2EBd6d7",
    name: "VVS CRO/BTC",
    link: "https://vvs.finance/add/0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23/0x062E66477Faf219F25D27dCED647BF57C3107d52",
    components: ["cro", "btc"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Cronos,
  protocol: AssetProtocol.VVS_CRONOS,
  details: {
    apiKey: "VLP-CRO-BTC",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pVVS CRO/BTC",
    farmDepositTokenName: "pVVS CRO/BTC",
  },
};
JAR_DEFINITIONS.push(JAR_CRO_VVS_CRO_BTC);

export const JAR_CRO_VVS_USDC_USDT: JarDefinition = {
  type: AssetType.JAR,
  id: "croJar 1k",
  contract: "0x40F80625feA504Fb32eD0e6e7450A77fFF114585",
  depositToken: {
    addr: "0x39cC0E14795A8e6e9D02A21091b81FE0d61D82f9",
    name: "VVS CRO/VVS",
    link: "https://vvs.finance/add/0xc21223249CA28397B4B6541dfFaEcC539BfF0c59/0x66e428c3f67a68878562e79A0234c1F83c208770",
    components: ["usdc", "usdt"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Cronos,
  protocol: AssetProtocol.VVS_CRONOS,
  details: {
    apiKey: "VLP-USDC-USDT",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pVVS USDC/USDT",
    farmDepositTokenName: "pVVS USDC/USDT",
  },
};
JAR_DEFINITIONS.push(JAR_CRO_VVS_USDC_USDT);

export const JAR_CRO_VVS_CRO_ETH: JarDefinition = {
  type: AssetType.JAR,
  id: "croJar 1c",
  contract: "0x55D5BCEf2BFD4921B8790525FF87919c2E26bD03",
  depositToken: {
    addr: "0xA111C17f8B8303280d3EB01BBcd61000AA7F39F9",
    name: "VVS CRO/ETH",
    link: "https://vvs.finance/add/CRO/0xe44Fd7fCb2b1581822D0c862B68222998a0c299a",
    components: ["cro", "weth"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Cronos,
  protocol: AssetProtocol.VVS_CRONOS,
  details: {
    apiKey: "VLP-CRO-ETH",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pVVS CRO/ETH",
    farmDepositTokenName: "pVVS CRO/ETH",
  },
};
JAR_DEFINITIONS.push(JAR_CRO_VVS_CRO_ETH);

export const JAR_AURORA_TRI_NEAR_USDC: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 1a",
  contract: "0xbD59171dA1c3a2624D60421bcb6c3c3270111656",
  depositToken: {
    addr: "0x20F8AeFB5697B77E0BB835A8518BE70775cdA1b0",
    name: "TRI NEAR/USDC",
    link: "https://www.trisolaris.io/#/add/0xB12BFcA5A55806AaF64E99521918A4bf0fC40802/0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d",
    components: ["near", "usdc"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.TRISOLARIS,
  details: {
    apiKey: "TLP-NEAR-USDC",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pTLP NEAR/USDC",
    farmDepositTokenName: "pTLP NEAR/USDC",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_TRI_NEAR_USDC);

export const JAR_AURORA_TRI_NEAR_ETH: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 1b",
  contract: "0xF623c32828B40c89D5cf114A7186c6B8b25De4Ed",
  depositToken: {
    addr: "0x63da4DB6Ef4e7C62168aB03982399F9588fCd198",
    name: "TRI NEAR/ETH",
    link: "https://www.trisolaris.io/#/add/0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d/ETH",
    components: ["near", "eth"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.TRISOLARIS,
  details: {
    apiKey: "TLP-NEAR-ETH",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pTLP NEAR/ETH",
    farmDepositTokenName: "pTLP NEAR/ETH",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_TRI_NEAR_ETH);

export const JAR_AURORA_TRI_NEAR_USDT: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 1c",
  contract: "0xfc258cF7f1bf3739A04992D1c790aF20d60f44E9",
  depositToken: {
    addr: "0x03B666f3488a7992b2385B12dF7f35156d7b29cD",
    name: "TRI NEAR/USDT",
    link: "https://www.trisolaris.io/#/add/0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d/0x4988a896b1227218e4A686fdE5EabdcAbd91571f",
    components: ["near", "usdt"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.TRISOLARIS,
  details: {
    apiKey: "TLP-NEAR-USDT",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pTLP NEAR/USDT",
    farmDepositTokenName: "pTLP NEAR/USDT",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_TRI_NEAR_USDT);

export const JAR_AURORA_TRI_NEAR_TRI: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 1d",
  contract: "0x1E686d65031Ac75754Cd6AeAb5B71ac2257c6a9D",
  depositToken: {
    addr: "0x84b123875F0F36B966d0B6Ca14b31121bd9676AD",
    name: "TRI NEAR/TRI",
    link: "https://www.trisolaris.io/#/add/0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d/0xFa94348467f64D5A457F75F8bc40495D33c65aBB",
    components: ["near", "tri"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.TRISOLARIS,
  details: {
    apiKey: "TLP-NEAR-TRI",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pTLP NEAR/TRI",
    farmDepositTokenName: "pTLP NEAR/TRI",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_TRI_NEAR_TRI);

export const JAR_AURORA_TRI_USDT_USDC: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 1e",
  contract: "0x023d4874f30292b24512b969dC8dc8A3227d2012",
  depositToken: {
    addr: "0x2fe064B6c7D274082aa5d2624709bC9AE7D16C77",
    name: "TRI USDT/USDC",
    link: "https://www.trisolaris.io/#/add/0x4988a896b1227218e4A686fdE5EabdcAbd91571f/0xB12BFcA5A55806AaF64E99521918A4bf0fC40802",
    components: ["usdt", "usdc"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.TRISOLARIS,
  details: {
    apiKey: "TLP-USDT/USDC",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pTLP USDT/USDC",
    farmDepositTokenName: "pTLP USDT/USDC",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_TRI_USDT_USDC);

export const JAR_AURORA_TRI_BTC_NEAR: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 1f",
  contract: "0xF49803dB604E118f3aFCF44beB0012f3c6684F05",
  depositToken: {
    addr: "0xbc8A244e8fb683ec1Fd6f88F3cc6E565082174Eb",
    name: "TRI BTC/NEAR",
    link: "https://www.trisolaris.io/#/add/0xF4eB217Ba2454613b15dBdea6e5f22276410e89e/0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d",
    components: ["btc", "near"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.TRISOLARIS,
  details: {
    apiKey: "TLP-BTC/NEAR",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pTLP BTC/NEAR",
    farmDepositTokenName: "pTLP BTC/NEAR",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_TRI_BTC_NEAR);

export const JAR_AURORA_TRI_LP: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 1g",
  contract: "0xF49803dB604E118f3aFCF44beB0012f3c6684F05",
  depositToken: {
    addr: "0xd1654a7713617d41A8C9530Fb9B948d00e162194",
    name: "TRI AURORA/TRI",
    link: "https://www.trisolaris.io/#/add/0xF4eB217Ba2454613b15dBdea6e5f22276410e89e/0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d",
    components: ["aurora", "tri"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.TRISOLARIS,
  details: {
    apiKey: "TLP-AURORA/TRI",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pTLP AURORA/TRI",
    farmDepositTokenName: "pTLP AURORA/TRI",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_TRI_LP);

export const JAR_AURORA_TRI_AURORA_ETH: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 1h",
  contract: "0x4add83C7a0aEd64468A149dA583f1b92d1aCa6AA",
  depositToken: {
    addr: "0x5eeC60F348cB1D661E4A5122CF4638c7DB7A886e",
    name: "TRI AURORA/ETH",
    link: "https://www.trisolaris.io/#/add/0x8BEc47865aDe3B172A928df8f990Bc7f2A3b9f79/ETH",
    components: ["aurora", "eth"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.TRISOLARIS,
  details: {
    apiKey: "TLP-AURORA/ETH",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pTLP AURORA/ETH",
    farmDepositTokenName: "pTLP AURORA/ETH",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_TRI_AURORA_ETH);

export const JAR_AURORA_WANNA_NEAR: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 2a",
  contract: "0x4550B283D30F96a8B56Fe16EB576f6d5033adDF7",
  depositToken: {
    addr: "0xbf9Eef63139b67fd0ABf22bD5504ACB0519a4212",
    name: "WANNA WANNA/NEAR",
    link: "https://wannaswap.finance/exchange/add/0x7faA64Faf54750a2E3eE621166635fEAF406Ab22/0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d",
    components: ["wanna", "near"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.NEARPAD,
  details: {
    apiKey: "WLP-WANNA-NEAR",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pWLP WANNA/NEAR",
    farmDepositTokenName: "pWLP WANNA/NEAR",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_WANNA_NEAR);

export const JAR_AURORA_PAD_BTC_NEAR: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 3a",
  contract: "0xcf59208abbAE8457F39f961eAb6293bdef1E5F1e",
  depositToken: {
    addr: "0xA188D79D6bdbc1120a662DE9eB72384E238AF104",
    name: "PAD BTC/NEAR",
    link: "https://dex.nearpad.io/add/0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d/0xF4eB217Ba2454613b15dBdea6e5f22276410e89e",
    components: ["btc", "near"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.NEARPAD,
  details: {
    apiKey: "NLP-BTC/NEAR",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pNLP BTC/NEAR",
    farmDepositTokenName: "pNLP BTC/NEAR",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_PAD_BTC_NEAR);


// ADD_ASSET  add jars above this line,  standalone farms or external somewhere below

// External Assets
export const EXTERNAL_DEFINITIONS: ExternalAssetDefinition[] = [];
export const ASSET_PBAMM: ExternalAssetDefinition = {
  type: AssetType.EXTERNAL,
  id: "B.Protocol BAMM",
  contract: "0x54bC9113f1f55cdBDf221daf798dc73614f6D972",
  depositToken: {
    addr: "0x5f98805a4e8be255a32880fdec7f6728c6568ba0",
    name: "LUSD",
    link: "https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x5f98805A4E8be255a32880FDeC7F6728C6568bA0",
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.BPROTOCOL,
  details: {
    apiKey: "PBAMM",
    includeInTvl: false,
  },
};
EXTERNAL_DEFINITIONS.push(ASSET_PBAMM);

export const EXTERNAL_SUSHI_PICKLE_ETH: ExternalAssetDefinition = {
  type: AssetType.EXTERNAL,
  id: "Sushi Pickle/Eth",
  contract: "0xEF0881eC094552b2e128Cf945EF17a6752B4Ec5d", // sushi masterchef v2
  depositToken: {
    addr: "0x269db91fc3c7fcc275c2e6f22e5552504512811c",
    name: "Sushi PICKLE/ETH",
    link: "https://app.sushi.com/add/0x429881672B9AE42b8EbA0E26cD9C73711b891Ca5/ETH",
    components: ["pickle", "weth"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.SUSHISWAP,
  details: {
    apiKey: "sushi-pickle-eth",
  },
  tags: "pool2",
};
EXTERNAL_DEFINITIONS.push(EXTERNAL_SUSHI_PICKLE_ETH);

export const ALL_ASSETS: PickleAsset[] = []
  .concat(JAR_DEFINITIONS)
  .concat(STANDALONE_FARM_DEFINITIONS)
  .concat(EXTERNAL_DEFINITIONS);
