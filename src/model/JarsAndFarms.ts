import { ChainNetwork } from "../chain/Chains";
import { SINGLE_FOLDING_ANY_PROTOCOL_DESCRIPTION, SINGLE_STAKING_ANY_PROTOCOL_DESCRIPTION } from "../docModel/DocsInterfaces";
import {
  StandaloneFarmDefinition,
  AssetEnablement,
  JarDefinition,
  HarvestStyle,
  AssetType,
  PickleAsset,
  ExternalAssetDefinition,
  AssetProtocol,
  BrineryDefinition,
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
  startBlock: 12248852, startTimestamp: 1618545083,
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
  tags: ["pool2"],
};
STANDALONE_FARM_DEFINITIONS.push(FARM_UNI_PICKLE_ETH);

export const JAR_DEFINITIONS: JarDefinition[] = [];
export const JAR_sCRV: JarDefinition = {
  type: AssetType.JAR,
  id: "pJar 0a",
  contract: "0x68d14d66B2B0d6E157c06Dc8Fefa3D8ba0e66a89",
  startBlock: 10960581, startTimestamp: 1601425554,
  depositToken: {
    addr: "0xC25a3A3b969415c80451098fa907EC722572917F",
    name: "Curve sCRV",
    link: "https://www.curve.fi/susdv2/deposit",
    components: ["dai", "usdc", "usdt", "susd"],
  },
  rewardTokens: ["crv", "snx"],
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
  startBlock: 11010898, startTimestamp: 1602105204,
  depositToken: {
    addr: "0x49849C98ae39Fff122806C06791Fa73784FB3675",
    name: "Curve REN/BTC",
    link: "https://www.curve.fi/ren/deposit",
    components: ["renbtc", "wbtc"],
  },
  rewardTokens: ["crv"],
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
  startBlock: 11010885, startTimestamp: 1602105027,
  depositToken: {
    addr: "0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490",
    name: "Curve 3pool",
    link: "https://www.curve.fi/3pool/deposit",
    components: ["dai", "usdc", "usdt"],
  },
  rewardTokens: ["crv"],
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
  tags: ["stablecoins"],
};
JAR_DEFINITIONS.push(JAR_3CRV);

export const JAR_steCRV: JarDefinition = {
  type: AssetType.JAR,
  id: "pJar 0d",
  contract: "0x77C8A58D940a322Aea02dBc8EE4A30350D4239AD",
  startBlock: 11739119, startTimestamp: 1611767447,
  depositToken: {
    addr: "0x06325440D014e39736583c165C2963BA99fAf14E",
    name: "Curve ETH/stETH",
    link: "https://www.curve.fi/steth/deposit",
    components: ["weth", "steth"],
  },
  rewardTokens: ["cvx", "crv", "ldo"],
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
  startBlock: 10960588, startTimestamp: 1601425645,
  depositToken: {
    addr: "0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11",
    name: "UniV2 DAI/ETH",
    link: "https://app.uniswap.org/#/add/v2/0x6b175474e89094c44da98b954eedeac495271d0f/ETH",
    components: ["dai", "weth"],
  },
  rewardTokens: ["uni"],
  enablement: AssetEnablement.PERMANENTLY_DISABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.UNISWAP,
  details: {
    apiKey: "UNIV2_ETH_DAI",
    harvestStyle: HarvestStyle.NONE,
  },
  farm: undefined,
};
JAR_DEFINITIONS.push(JAR_UNIV2_ETH_DAI);

export const JAR_UNIV2_ETH_USDC: JarDefinition = {
  type: AssetType.JAR,
  id: "pJar 0.69b (inactive)",
  contract: "0x53Bf2E62fA20e2b4522f05de3597890Ec1b352C6",
  startBlock: 10960599, startTimestamp: 1601425800,
  depositToken: {
    addr: "0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc",
    name: "UniV2 USDC/ETH",
    link: "https://app.uniswap.org/#/add/v2/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48/ETH",
    components: ["usdc", "weth"],
  },
  rewardTokens: ["uni"],
  enablement: AssetEnablement.PERMANENTLY_DISABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.UNISWAP,
  details: {
    apiKey: "UNIV2_ETH_USDC",
    harvestStyle: HarvestStyle.NONE,
  },
  farm: undefined,
};
JAR_DEFINITIONS.push(JAR_UNIV2_ETH_USDC);

export const JAR_UNIV2_ETH_USDT: JarDefinition = {
  type: AssetType.JAR,
  id: "pJar 0.69c (inactive)",
  contract: "0x09FC573c502037B149ba87782ACC81cF093EC6ef",
  startBlock: 10960612, startTimestamp: 1601426036,
  depositToken: {
    addr: "0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852",
    name: "UniV2 USDT/ETH",
    link: "https://app.uniswap.org/#/add/v2/ETH/0xdac17f958d2ee523a2206206994597c13d831ec7",
    components: ["usdt", "weth"],
  },
  rewardTokens: ["uni"],
  enablement: AssetEnablement.PERMANENTLY_DISABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.UNISWAP,
  details: {
    apiKey: "UNIV2_ETH_USDT",
    harvestStyle: HarvestStyle.NONE,
  },
  farm: undefined,
};
JAR_DEFINITIONS.push(JAR_UNIV2_ETH_USDT);

export const JAR_UNIV2_ETH_WBTC: JarDefinition = {
  type: AssetType.JAR,
  id: "pJar 0.69d (inactive)",
  contract: "0xc80090AA05374d336875907372EE4ee636CBC562",
  startBlock: 11010902, startTimestamp: 1602105244,
  depositToken: {
    addr: "0xBb2b8038a1640196FbE3e38816F3e67Cba72D940",
    name: "UniV2 WBTC/ETH",
    link: "https://app.uniswap.org/#/add/v2/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599/ETH",
    components: ["wbtc", "weth"],
  },
  rewardTokens: ["uni"],
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
  startBlock: 11044218, startTimestamp: 1602551622,
  depositToken: {
    addr: "0x6b175474e89094c44da98b954eedeac495271d0f",
    name: "DAI",
    link: "https://etherscan.io/token/0x6b175474e89094c44da98b954eedeac495271d0f",
    components: ["dai"],
  },
  rewardTokens: ["comp"],
  enablement: AssetEnablement.PERMANENTLY_DISABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.COMPOUND,
  details: {
    apiKey: "evil-dai",
    harvestStyle: HarvestStyle.NONE,
  },
  farm: undefined,
};
JAR_DEFINITIONS.push(JAR_pDAI);

export const JAR_ALETH: JarDefinition = {
  type: AssetType.JAR,
  id: "pJar 0.98s",
  contract: "0xCbA1FE4Fdbd90531EFD929F1A1831F38e91cff1e",
  startBlock: 12723415, startTimestamp: 1624895633,
  depositToken: {
    addr: "0xc9da65931ABf0Ed1b74Ce5ad8c041C4220940368",
    name: "Saddle ETH/alETH",
    link: "https://saddle.exchange/#/pools/aleth/deposit",
  },
  rewardTokens: ["alcx"],
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
  startBlock: 12649112, startTimestamp: 1623894903,
  depositToken: {
    addr: "0x6DEA81C8171D0bA574754EF6F8b412F2Ed88c54D",
    name: "LQTY",
    link: "https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x6dea81c8171d0ba574754ef6f8b412f2ed88c54d",
    components: ["lqty"],
  },
  rewardTokens: ["weth", "lusd"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.LQTY,
  details: {
    apiKey: "LQTY",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  docsKey: SINGLE_STAKING_ANY_PROTOCOL_DESCRIPTION,
  farm: {
    farmAddress: "0xA7BC844a76e727Ec5250f3849148c21F4b43CeEA",
    farmNickname: "pLQTY",
    farmDepositTokenName: "pLQTY",
  },
};
JAR_DEFINITIONS.push(JAR_LQTY);

export const JAR_SUSHI_ETH_DAI: JarDefinition = {
  type: AssetType.JAR,
  id: "pJar 0.99a",
  contract: "0x55282dA27a3a02ffe599f6D11314D239dAC89135",
  startBlock: 11471457, startTimestamp: 1608218377,
  depositToken: {
    addr: "0xC3D03e4F041Fd4cD388c549Ee2A29a9E5075882f",
    name: "Sushi DAI/ETH",
    link: "https://app.sushi.com/add/0x6b175474e89094c44da98b954eedeac495271d0f/ETH",
    components: ["dai", "weth"],
  },
  rewardTokens: ["sushi"],
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
  startBlock: 11474355, startTimestamp: 1608257267,
  depositToken: {
    addr: "0x397FF1542f962076d0BFE58eA045FfA2d347ACa0",
    name: "Sushi USDC/ETH",
    link: "https://app.sushi.com/add/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48/ETH",
    components: ["usdc", "weth"],
  },
  rewardTokens: ["sushi"],
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
  startBlock: 11474365, startTimestamp: 1608257382,
  depositToken: {
    addr: "0x06da0fd433C1A5d7a4faa01111c044910A184553",
    name: "Sushi USDT/ETH",
    link: "https://app.sushi.com/add/ETH/0xdac17f958d2ee523a2206206994597c13d831ec7",
    components: ["weth", "usdt"],
  },
  rewardTokens: ["sushi"],
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
  startBlock: 11474413, startTimestamp: 1608258109,
  depositToken: {
    addr: "0xCEfF51756c56CeFFCA006cD410B03FFC46dd3a58",
    name: "Sushi WBTC/ETH",
    link: "https://app.sushi.com/add/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599/ETH",
    components: ["wbtc", "weth"],
  },
  rewardTokens: ["sushi"],
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
  startBlock: 11478789, startTimestamp: 1608316293,
  depositToken: {
    addr: "0x088ee5007C98a9677165D78dD2109AE4a3D04d0C",
    name: "Sushi YFI/ETH",
    link: "https://app.sushi.com/add/0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e/ETH",
    components: ["yfi", "weth"],
  },
  rewardTokens: ["sushi"],
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
  startBlock: 12253324, startTimestamp: 1618605475,
  depositToken: {
    addr: "0xd4405F0704621DBe9d4dEA60E128E0C3b26bddbD",
    name: "UniV2 BAC/DAI",
    link: undefined,
    components: ["bac", "dai"],
  },
  rewardTokens: ["bas"],
  enablement: AssetEnablement.PERMANENTLY_DISABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.UNISWAP,
  details: {
    apiKey: "uni_bac_dai_old",
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
  startBlock: 11616981, startTimestamp: 1610147510,
  depositToken: {
    addr: "0xC9cB53B48A2f3A9e75982685644c1870F1405CCb",
    name: "Sushi MIC/USDT",
    link: undefined,
    components: ["mic", "usdt"],
  },
  rewardTokens: ["mis"],
  enablement: AssetEnablement.PERMANENTLY_DISABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.SUSHISWAP,
  details: {
    apiKey: "sushi_mic_usdt_old",
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
  startBlock: 11732925, startTimestamp: 1611684776,
  depositToken: {
    addr: "0x066f3a3b7c8fa077c71b9184d862ed0a4d5cf3e0",
    name: "Sushi MIS/USDT",
    link: undefined,
    components: ["mis", "usdt"],
  },
  rewardTokens: ["mis"],
  enablement: AssetEnablement.PERMANENTLY_DISABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.SUSHISWAP,
  details: {
    apiKey: "sushi_mis_usdt_old",
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
  startBlock: 11804602, startTimestamp: 1612639016,
  depositToken: {
    addr: "0x10B47177E92Ef9D5C6059055d92DdF6290848991",
    name: "Sushi yveCRV/ETH",
    link: "https://app.sushi.com/add/0xc5bddf9843308380375a611c18b50fb9341f502a/ETH",
    components: ["weth", "yvecrv"],
  },
  rewardTokens: ["sushi"],
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
  startBlock: 12253421, startTimestamp: 1618606654,
  depositToken: {
    addr: "0x3E78F2E7daDe07ea685F8612F00477FD97162F1e",
    name: "UniV2 BAS/DAI",
    link: undefined,
    components: ["bas", "dai"],
  },
  rewardTokens: ["bas"],
  enablement: AssetEnablement.PERMANENTLY_DISABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.UNISWAP,
  details: {
    apiKey: "bas_dai_99j_old",
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
  startBlock: 11888779, startTimestamp: 1613756570,
  depositToken: {
    addr: "0x87dA823B6fC8EB8575a235A824690fda94674c88",
    name: "UniV2 MIR/UST",
    link: "https://app.uniswap.org/#/add/v2/0x09a3ecafa817268f77be1283176b946c4ff2e608/0xa47c8bf37f92aBed4A126BDA807A7b7498661acD",
    components: ["mir", "ust"],
  },
  rewardTokens: ["mir"],
  enablement: AssetEnablement.WITHDRAW_ONLY,
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
  startBlock: 12053691, startTimestamp: 1615951358,
  depositToken: {
    addr: "0x5233349957586A8207c52693A959483F9aeAA50C",
    name: "UniV2 MTSLA/UST",
    link: "https://app.uniswap.org/#/add/v2/0x21cA39943E91d704678F5D00b6616650F066fD63/0xa47c8bf37f92aBed4A126BDA807A7b7498661acD",
    components: ["mtsla", "ust"],
  },
  rewardTokens: ["mir"],
  enablement: AssetEnablement.PERMANENTLY_DISABLED,
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
  startBlock: 12055550, startTimestamp: 1615975665,
  depositToken: {
    addr: "0xB022e08aDc8bA2dE6bA4fECb59C6D502f66e953B",
    name: "UniV2 MAAPL/UST",
    link: "https://app.uniswap.org/#/add/v2/0xd36932143F6eBDEDD872D5Fb0651f4B72Fd15a84/0xa47c8bf37f92aBed4A126BDA807A7b7498661acD",
    components: ["maapl", "ust"],
  },
  rewardTokens: ["mir"],
  enablement: AssetEnablement.WITHDRAW_ONLY,
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
  startBlock: 12055602, startTimestamp: 1615976367,
  depositToken: {
    addr: "0x9E3B47B861B451879d43BBA404c35bdFb99F0a6c",
    name: "UniV2 MQQQ/UST",
    link: "https://app.uniswap.org/#/add/v2/0x13B02c8dE71680e71F0820c996E4bE43c2F57d15/0xa47c8bf37f92aBed4A126BDA807A7b7498661acD",
    components: ["mqqq", "ust"],
  },
  rewardTokens: ["mir"],
  enablement: AssetEnablement.WITHDRAW_ONLY,
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
  startBlock: 12056041, startTimestamp: 1615982410,
  depositToken: {
    addr: "0x860425bE6ad1345DC7a3e287faCBF32B18bc4fAe",
    name: "UniV2 MSLV/UST",
    link: "https://app.uniswap.org/#/add/v2/0x9d1555d8cB3C846Bb4f7D5B1B1080872c3166676/0xa47c8bf37f92aBed4A126BDA807A7b7498661acD",
    components: ["mslv", "ust"],
  },
  rewardTokens: ["mir"],
  enablement: AssetEnablement.WITHDRAW_ONLY,
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
  startBlock: 12056041, startTimestamp: 1615982410,
  depositToken: {
    addr: "0x676Ce85f66aDB8D7b8323AeEfe17087A3b8CB363",
    name: "UniV2 MBABA/UST",
    link: "https://app.uniswap.org/#/add/v2/0x56aA298a19C93c6801FDde870fA63EF75Cc0aF72/0xa47c8bf37f92aBed4A126BDA807A7b7498661acD",
    components: ["mbaba", "ust"],
  },
  rewardTokens: ["mir"],
  enablement: AssetEnablement.PERMANENTLY_DISABLED,
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
  startBlock: 12107605, startTimestamp: 1616668282,
  depositToken: {
    addr: "0x795065dCc9f64b5614C407a6EFDC400DA6221FB0",
    name: "Sushi ETH/SUSHI",
    link: "https://app.sushi.com/add/0x6b3595068778dd592e39a122f4f5a5cf09c90fe2/ETH",
    components: ["sushi", "weth"],
  },
  rewardTokens: ["sushi"],
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
  startBlock: 12185238, startTimestamp: 1617700288,
  depositToken: {
    addr: "0x9928e4046d7c6513326cCeA028cD3e7a91c7590A",
    name: "UniV2 FEI/TRIBE",
    link: "https://app.uniswap.org/#/add/v2/0x956f47f50a910163d8bf957cf5846d573e7f87ca/0xc7283b66eb1eb5fb86327f08e1b5816b0720212b",
    components: ["fei", "tribe"],
  },
  rewardTokens: ["tribe"],
  enablement: AssetEnablement.WITHDRAW_ONLY,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.UNISWAP,
  details: {
    apiKey: "FEI-TRIBE",
    harvestStyle: HarvestStyle.NONE,
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
  startBlock: 12820459, startTimestamp: 1626201969,
  depositToken: {
    addr: "0xd48cf4d7fb0824cc8bae055df3092584d0a1726a",
    name: "Saddle D4",
    link: "https://saddle.exchange/#/pools/d4/deposit",
    components: ["alusd", "fei", "frax", "lusd"],
  },
  rewardTokens: ["fxs", "lqty", "alcx", "tribe"],
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
  startBlock: 12254395, startTimestamp: 1618619523,
  depositToken: {
    addr: "0xF20EF17b889b437C151eB5bA15A47bFc62bfF469",
    name: "UniV2 LUSD/ETH",
    link: "https://app.uniswap.org/#/add/v2/0x5f98805A4E8be255a32880FDeC7F6728C6568bA0/ETH",
    components: ["lusd", "weth"],
  },
  rewardTokens: ["lqty"],
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
  startBlock: 12294044, startTimestamp: 1619148398,
  depositToken: {
    addr: "0xC3f279090a47e80990Fe3a9c30d24Cb117EF91a8",
    name: "Sushi ALCX/ETH",
    link: "https://app.sushi.com/add/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2/0xdbdb4d16eda451d0503b854cf79d55697f90c8df",
    components: ["weth", "alcx"],
  },
  rewardTokens: ["sushi", "alcx"],
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
  startBlock: 12205849, startTimestamp: 1617974124,
  depositToken: {
    addr: "0x9461173740D27311b176476FA27e94C681b1Ea6b",
    name: "Sushi yvBOOST/ETH",
    link: "https://app.sushi.com/add/0x9d409a0A012CFbA9B15F6D4B36Ac57A46966Ab9a/ETH",
    components: ["weth", "yvboost"],
  },
  rewardTokens: ["sushi"],
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
  startBlock: 12602174, startTimestamp: 1623266739,
  depositToken: {
    addr: "0x05767d9EF41dC40689678fFca0608878fb3dE906",
    name: "Sushi CVX/ETH",
    link: "https://app.sushi.com/add/0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b/ETH",
    components: ["cvx", "weth"],
  },
  rewardTokens: ["cvx", "sushi"],
  enablement: AssetEnablement.DISABLED,
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
  startBlock: 13238837, startTimestamp: 1631822890,
  depositToken: {
    addr: "0x27fD0857F0EF224097001E87e61026E39e1B04d1",
    name: "UniV2 RLY/ETH",
    link: "https://app.uniswap.org/#/add/v2/0xf1f955016ecbcd7321c7266bccfb96c68ea5e49b/ETH",
    components: ["rly", "weth"],
    decimals: 18,
  },
  rewardTokens: ["rly"],
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
  startBlock: 12389759, startTimestamp: 1620425186,
  depositToken: {
    addr: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    name: "Yearn USDC",
    link: "https://etherscan.io/token/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    components: ["usdc"],
    decimals: 6,
  },
  rewardTokens: [],
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
  startBlock: 12389563, startTimestamp: 1620422355,
  depositToken: {
    addr: "0xEd279fDD11cA84bEef15AF5D39BB4d4bEE23F0cA",
    name: "Yearn LUSD/3CRV",
    link: "https://curve.fi/lusd/deposit",
    components: ["lusd", "3crv"],
  },
  rewardTokens: [],
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
  startBlock: 12746744, startTimestamp: 1625209472,
  depositToken: {
    addr: "0xd632f22692FaC7611d2AA1C0D552930D43CAEd3B",
    name: "Yearn FRAX/3CRV",
    link: "https://curve.fi/frax/deposit",
    components: ["frax", "3crv"],
  },
  rewardTokens: [],
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
  startBlock: 13042523, startTimestamp: 1629200722,
  depositToken: {
    addr: "0x5282a4ef67d9c33135340fb3289cc1711c13638c",
    name: "Yearn Ironbank",
    link: "https://curve.fi/ib/deposit",
    components: ["dai", "usdc", "usdt"],
  },
  rewardTokens: [],
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
  startBlock: 12877157, startTimestamp: 1626969516,
  depositToken: {
    addr: "0x5a6A4D54456819380173272A5E8E9B9904BdF41B",
    name: "Curve MIM/3CRV",
    link: "https://curve.fi/mim/deposit",
    components: ["mim", "3crv"], // TODO
  },
  rewardTokens: ["cvx", "crv", "spell"],
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
  tags: ["stablecoins"],
};
JAR_DEFINITIONS.push(JAR_MIM3CRV);

export const JAR_SPELLETH: JarDefinition = {
  type: AssetType.JAR,
  id: "pjar 0.99m2",
  contract: "0xdB84a6A48881545E8595218b7a2A3c9bd28498aE",
  startBlock: 12877133, startTimestamp: 1626969142,
  depositToken: {
    addr: "0xb5De0C3753b6E1B4dBA616Db82767F17513E6d4E",
    name: "Sushi SPELL/ETH",
    link: "https://app.sushi.com/add/ETH/0x090185f2135308BaD17527004364eBcC2D37e5F6",
    components: ["spell", "weth"], // TODO
  },
  rewardTokens: ["spell"],
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
  startBlock: 12877132, startTimestamp: 1626969137,
  depositToken: {
    addr: "0x07D5695a24904CC1B6e3bd57cC7780B90618e3c4",
    name: "Sushi MIM/ETH",
    link: "https://app.sushi.com/add/ETH/0x99D8a9C45b2ecA8864373A26D1459e3Dff1e17F3",
    components: ["mim", "weth"],
  },
  rewardTokens: ["spell"],
  enablement: AssetEnablement.WITHDRAW_ONLY,
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
  startBlock: 12953084, startTimestamp: 1628004374,
  depositToken: {
    addr: "0x470e8de2eBaef52014A47Cb5E6aF86884947F08c",
    name: "UniV2 FOX/ETH",
    link: "https://app.uniswap.org/#/add/v2/0xc770eefad204b5180df6a14ee197d99d808ee52d/ETH",
    components: ["fox", "weth"],
  },
  rewardTokens: ["fox"],
  enablement: AssetEnablement.DISABLED,
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
  startBlock: 13373540, startTimestamp: 1633633543,
  depositToken: {
    addr: "0x9D0464996170c6B9e75eED71c68B99dDEDf279e8",
    name: "Curve cvxCRV/CRV",
    link: "https://curve.fi/factory/22/deposit",
    components: ["crv", "cvxcrv"],
  },
  rewardTokens: ["cvx"],
  stakingProtocol: AssetProtocol.CONVEX,
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

export const JAR_CURVE_CADCUSDC: JarDefinition = {
  type: AssetType.JAR,
  id: "pjar 0j",
  contract: "0x6f4A700a620B03ac0590f3cD2143A80c96A4973b",
  startBlock: 14568187, startTimestamp: 1649731989,
  depositToken: {
    addr: "0x1054Ff2ffA34c055a13DCD9E0b4c0cA5b3aecEB9",
    name: "Curve CADC/USDC",
    link: "https://curve.fi/factory-crypto/12/deposit",
    components: ["cadc", "usdc"],
  },
  rewardTokens: ["cvx", "crv"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.CURVE,
  stakingProtocol: AssetProtocol.CONVEX,
  details: {
    apiKey: "CURVECADCUSDC",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x95bb606e332215d09160bfafe720f84476d06145",
    farmNickname: "pCurve CADC/USDC",
    farmDepositTokenName: "pCurve CADC/USDC",
  },
  tags: ["stablecoins"],
};
JAR_DEFINITIONS.push(JAR_CURVE_CADCUSDC);

export const JAR_CVXCRV: JarDefinition = {
  type: AssetType.JAR,
  id: "pjar 0f",
  contract: "0xB245280Fd1795f5068DEf8E8f32DB7846b030b2B",
  startBlock: 13406257, startTimestamp: 1634076523,
  depositToken: {
    addr: "0x62B9c7356A2Dc64a1969e19C23e4f579F9810Aa7",
    name: "Curve cvxCRV",
    link: "https://curve.fi/factory/22",
    components: ["cvxcrv"],
  },
  rewardTokens: ["cvx", "crv", "3crv"],
  stakingProtocol: AssetProtocol.CONVEX,
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.CURVE, // Not actually a Curve LP but doesn't seem to matter
  details: {
    apiKey: "cvxcrv",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  docsKey: SINGLE_STAKING_ANY_PROTOCOL_DESCRIPTION,
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
  startBlock: 13743179, startTimestamp: 1638667872,
  depositToken: {
    addr: "0xEd4064f376cB8d68F770FB1Ff088a3d0F3FF5c4d",
    name: "Curve CRV/ETH",
    link: "https://curve.fi/crveth/deposit",
    components: ["crv", "weth"],
  },
  rewardTokens: ["cvx", "crv"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.CURVE,
  stakingProtocol: AssetProtocol.CONVEX,
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

export const JAR_CURVE_CVXETHLP: JarDefinition = {
  type: AssetType.JAR,
  id: "pjar 0h",
  contract: "0xc97f3fd224d90609831a2B74b46642aC43afE5ee",
  startBlock: 13886154, startTimestamp: 1640593343,
  depositToken: {
    addr: "0x3A283D9c08E8b55966afb64C515f5143cf907611",
    name: "Curve CVX/ETH",
    link: "https://curve.fi/cvxeth/deposit",
    components: ["cvx", "weth"],
  },
  rewardTokens: ["cvx", "crv", "fxs"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.CURVE,
  stakingProtocol: AssetProtocol.CONVEX,
  details: {
    apiKey: "CURVECVXETH",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x941c42350239B463B80795Fb78Be7817659B8bd0",
    farmNickname: "pCurve CVX/ETH",
    farmDepositTokenName: "pCurve CVX/ETH",
  },
};
JAR_DEFINITIONS.push(JAR_CURVE_CVXETHLP);

export const JAR_SUSHI_ETH_TRU: JarDefinition = {
  type: AssetType.JAR,
  id: "pjar 0.99t",
  contract: "0x1d92e1702D7054f74eAC3a9569AeB87FC93e101D",
  startBlock: 12968282, startTimestamp: 1628210804,
  depositToken: {
    addr: "0xfCEAAf9792139BF714a694f868A215493461446D",
    name: "Sushi TRU/ETH",
    link: "https://app.sushi.com/add/ETH/0x4C19596f5aAfF459fA38B0f7eD92F11AE6543784",
    components: ["tru", "weth"],
  },
  rewardTokens: ["tru", "sushi"],
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

export const JAR_SUSHI_NEWO_USDC: JarDefinition = {
  type: AssetType.JAR,
  id: "pjar 0.98a2",
  contract: "0xBc57294Fc20bD23983dB598fa6B3f306aA1a414f",
  startBlock: 13975836, startTimestamp: 1641791985,
  depositToken: {
    addr: "0xB264dC9D22ece51aAa6028C5CBf2738B684560D6",
    name: "Sushi NEWO/USDC",
    link: "https://app.sushi.com/add/0x1b890fd37cd50bea59346fc2f8ddb7cd9f5fabd5/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    components: ["newo", "usdc"],
  },
  rewardTokens: ["newo"],
  enablement: AssetEnablement.PERMANENTLY_DISABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.SUSHISWAP,
  details: {
    apiKey: "NEWO-USDC",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x5e50640dcdd1e83feac729321bacb52525df1cd2",
    farmNickname: "pSushi NEWO/USDC",
    farmDepositTokenName: "pSushi NEWO/USDC",
  },
};
JAR_DEFINITIONS.push(JAR_SUSHI_NEWO_USDC);

export const JAR_UNIV2_LOOKS_ETH: JarDefinition = {
  type: AssetType.JAR,
  id: "pjar 0.98a",
  contract: "0x69CC22B240bdcDf4A33c7B3D04a660D4cF714370",
  startBlock: 13989733, startTimestamp: 1641977334,
  depositToken: {
    addr: "0xDC00bA87Cc2D99468f7f34BC04CBf72E111A32f7",
    name: "UniV2 LOOKS/ETH",
    link: "https://app.uniswap.org/#/add/v2/ETH/0xf4d2888d29D722226FafA5d9B24F9164c092421E",
    components: ["weth", "looks"],
  },
  rewardTokens: ["looks"],
  enablement: AssetEnablement.WITHDRAW_ONLY,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.UNISWAP,
  details: {
    apiKey: "LOOKS-ETH",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0xb5fe3204aabe02475d5b9d3c52820f2169002124",
    farmNickname: "pUniV2 LOOKS/ETH",
    farmDepositTokenName: "pUniV2 LOOKS/ETH",
  },
};
JAR_DEFINITIONS.push(JAR_UNIV2_LOOKS_ETH);

export const JAR_LOOKS: JarDefinition = {
  type: AssetType.JAR,
  id: "pjar 0.98b",
  contract: "0xb4EBc2C371182DeEa04B2264B9ff5AC4F0159C69",
  startBlock: 14027712, startTimestamp: 1642484467,
  depositToken: {
    addr: "0xf4d2888d29D722226FafA5d9B24F9164c092421E",
    name: "LOOKS",
    link: "https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0xf4d2888d29d722226fafa5d9b24f9164c092421e",
    components: ["looks"],
  },
  rewardTokens: ["weth"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.LOOKS,
  details: {
    apiKey: "LOOKS",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x06a566e7812413bc66215b48d6f26321ddf653a9",
    farmNickname: "pLOOKS",
    farmDepositTokenName: "pLOOKS",
  },
};
JAR_DEFINITIONS.push(JAR_LOOKS);

export const JAR_CURVE_CVXFXS_FXS_LP: JarDefinition = {
  type: AssetType.JAR,
  id: "pjar 0i",
  contract: "0x5Da34d322a4b29488e711419Fea36dA0d0114d5C",
  startBlock: 14318341, startTimestamp: 1646368774,
  depositToken: {
    addr: "0xF3A43307DcAFa93275993862Aae628fCB50dC768",
    name: "Curve CVXFXS/FXS",
    link: "https://curve.fi/factory-crypto/18/deposit",
    components: ["fxs", "cvxfxs"],
  },
  rewardTokens: ["cvx", "crv", "fxs"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.CURVE,
  details: {
    apiKey: "CURVECVXFXS",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x6667c53D631410649B1826D21cFdf41E7a7aE6b1",
    farmNickname: "pCurve FXS/CVXFXS",
    farmDepositTokenName: "pCurve FXS/CVXFXS",
  },
};
JAR_DEFINITIONS.push(JAR_CURVE_CVXFXS_FXS_LP);

export const JAR_CURVE_STG_USDC_LP: JarDefinition = {
  type: AssetType.JAR,
  id: "pjar 0k",
  contract: "0x79CF7c02aF26A3BaccFdcaD5933580c76f5F1562",
  startBlock: 14663933, startTimestamp: 1651027714,
  depositToken: {
    addr: "0xdf55670e27bE5cDE7228dD0A6849181891c9ebA1",
    name: "Curve STG/USDC",
    link: "https://curve.fi/factory-crypto/37/deposit",
    components: ["stg", "usdc"],
  },
  rewardTokens: ["crv"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.CURVE,
  details: {
    apiKey: "CURVESTGUSDC",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0xd2ca1f79230339a3cc5bdd2bc33c8e60b4cd8827",
    farmNickname: "pCurve STG/USDC",
    farmDepositTokenName: "pCurve STG/USDC",
  },
};
JAR_DEFINITIONS.push(JAR_CURVE_STG_USDC_LP);

export const JAR_UNIV3_RBN_ETH: JarDefinition = {
  type: AssetType.JAR,
  id: "pjar U3a",
  contract: "0x506748d736b77f51c5b490e4aC6c26B8c3975b14",
  startBlock: 13501751, startTimestamp: 1635369769,
  // The deposit token is actually rbn and weth, but the underlying token
  // in the strategy is the univ3 pool token. Kinda fuzzy here
  depositToken: {
    addr: "0x94981F69F7483AF3ae218CbfE65233cC3c60d93a",
    name: "UniV3 RBN/ETH",
    link: "https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x6123b0049f904d730db3c36a31167d9d4121fa6b",
    components: ["rbn", "weth"],
    style: { erc20: false },
  },
  rewardTokens: ["rbn"],
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

export const JAR_UNIV3_FRAX_DAI: JarDefinition = {
  type: AssetType.JAR,
  id: "pJar U3b",
  contract: "0xe7b69a17B3531d01FCEAd66FaF7d9f7655469267",
  startBlock: 14194675, startTimestamp: 1644714003, 
  depositToken: {
    addr: "0x97e7d56A0408570bA1a7852De36350f7713906ec",
    name: "UniV3 FRAX/DAI",
    link: "https://app.uniswap.org/#/add/0x853d955aCEf822Db058eb8505911ED77F175b99e/0x6B175474E89094C44Da98b954EedeAC495271d0F/500",
    components: ["dai", "frax"],
    style: { erc20: false },
  },
  rewardTokens: ["fxs"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.UNISWAP_V3,
  details: {
    controller: "0x7B5916C61bCEeaa2646cf49D9541ac6F5DCe3637",
    apiKey: "UNIV3-FRAX-DAI",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0xa50e005c3f2f3cd1f56b09df558816cfce25e934",
    farmNickname: "pUNIv3 FRAX/DAI",
    farmDepositTokenName: "pUNIv3 FRAX/DAI",
  },
  tags: ["stablecoins"],
};
JAR_DEFINITIONS.push(JAR_UNIV3_FRAX_DAI);

export const JAR_UNIV3_USDC_ETH_05: JarDefinition = {
  type: AssetType.JAR,
  id: "pJar U3c",
  contract: "0x8CA1D047541FE183aE7b5d80766eC6d5cEeb942A",
  startBlock: 14286023, startTimestamp: 1645935477,
  depositToken: {
    addr: "0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640",
    name: "UniV3 USDC/ETH 0.05%",
    link: "https://app.uniswap.org/#/add/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/500",
    components: ["usdc", "weth"],
    style: { erc20: false },
  },
  rewardTokens: ["usdc", "weth"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.UNISWAP_V3,
  details: {
    controller: "0x7B5916C61bCEeaa2646cf49D9541ac6F5DCe3637",
    apiKey: "UNIV3-USDC-ETH-05",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x162cec141e6703d08b4844c9246e7aa56726e8c6",
    farmNickname: "pUNIv3 USDC/ETH",
    farmDepositTokenName: "pUNIv3 USDC/ETH",
  },
};
JAR_DEFINITIONS.push(JAR_UNIV3_USDC_ETH_05);

export const JAR_UNIV3_USDC_ETH_3: JarDefinition = {
  type: AssetType.JAR,
  id: "pJar U3d",
  contract: "0x3b79f29d7979D7DE22A0d09098e898157ea32dD5",
  startBlock: 14286059, startTimestamp: 1645935968,
  depositToken: {
    addr: "0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8",
    name: "UniV3 USDC/ETH 0.3%",
    link: "https://app.uniswap.org/#/add/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/3000",
    components: ["usdc", "weth"],
    style: { erc20: false },
  },
  rewardTokens: ["usdc", "weth"],
  enablement: AssetEnablement.PERMANENTLY_DISABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.UNISWAP_V3,
  details: {
    controller: "0x7B5916C61bCEeaa2646cf49D9541ac6F5DCe3637",
    apiKey: "UNIV3-USDC-ETH-3",
    harvestStyle: HarvestStyle.PASSIVE,
  },
};
JAR_DEFINITIONS.push(JAR_UNIV3_USDC_ETH_3);

export const JAR_UNIV3_LOOKS_ETH: JarDefinition = {
  type: AssetType.JAR,
  id: "pJar U3e",
  contract: "0x0A3a5764945E29E38408637bC659981f0172b961",
  startBlock: 14286123, startTimestamp: 1645936743,
  depositToken: {
    addr: "0x4b5Ab61593A2401B1075b90c04cBCDD3F87CE011",
    name: "UniV3 LOOKS/ETH 0.3%",
    link: "https://app.uniswap.org/#/add/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/0xf4d2888d29D722226FafA5d9B24F9164c092421E/3000",
    components: ["weth", "looks"],
    style: { erc20: false },
  },
  rewardTokens: ["weth", "looks"],
  enablement: AssetEnablement.PERMANENTLY_DISABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.UNISWAP_V3,
  details: {
    controller: "0x7B5916C61bCEeaa2646cf49D9541ac6F5DCe3637",
    apiKey: "UNIV3-LOOKS-ETH",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0xcfcc3f6fd9f627d5ebbbd9e9b639b35f35a62ecf",
    farmNickname: "pUNIv3 LOOKS/ETH",
    farmDepositTokenName: "pUNIv3 LOOKS/ETH",
  },
};
JAR_DEFINITIONS.push(JAR_UNIV3_LOOKS_ETH);

export const JAR_UNIV3_USDC_USDT: JarDefinition = {
  type: AssetType.JAR,
  id: "pJar U3f",
  contract: "0x563c77b40c7f08bA735426393Cf5f0e527D16C10",
  startBlock: 14286139, startTimestamp: 1645936994,
  depositToken: {
    addr: "0x3416cF6C708Da44DB2624D63ea0AAef7113527C6",
    name: "UniV3 USDC/USDT 0.01%",
    link: "https://app.uniswap.org/#/add/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/0xdAC17F958D2ee523a2206206994597C13D831ec7/100",
    components: ["usdc", "usdt"],
    style: { erc20: false },
  },
  rewardTokens: ["usdc", "usdt"],
  enablement: AssetEnablement.PERMANENTLY_DISABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.UNISWAP_V3,
  details: {
    controller: "0x7B5916C61bCEeaa2646cf49D9541ac6F5DCe3637",
    apiKey: "UNIV3-USDC-USDT",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0xfe7a1dad74f1cbee137353d52b4a42936c54e28c",
    farmNickname: "pUNIv3 USDC/USDT",
    farmDepositTokenName: "pUNIv3 USDC/USDT",
  },
  tags: ["stablecoins"],
};
JAR_DEFINITIONS.push(JAR_UNIV3_USDC_USDT);

export const JAR_UNIV3_WBTC_ETH: JarDefinition = {
  type: AssetType.JAR,
  id: "pJar U3g",
  contract: "0xAaCDaAad9a9425bE2d666d08F741bE4F081C7ab1",
  startBlock: 14286147, startTimestamp: 1645937077,
  depositToken: {
    addr: "0x4585FE77225b41b697C938B018E2Ac67Ac5a20c0",
    name: "UniV3 WBTC/ETH 0.05%",
    link: "https://app.uniswap.org/#/add/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/500",
    components: ["wbtc", "weth"],
    style: { erc20: false },
  },
  rewardTokens: ["wbtc", "weth"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.UNISWAP_V3,
  details: {
    controller: "0x7B5916C61bCEeaa2646cf49D9541ac6F5DCe3637",
    apiKey: "UNIV3-WBTC-ETH",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0xcb405e52b8cb9276d5cd01d6b5f7135f53c5535d",
    farmNickname: "pUNIv3 WBTC/ETH",
    farmDepositTokenName: "pUNIv3 WBTC/ETH",
  },
  tags: ["stablecoins"],
};
JAR_DEFINITIONS.push(JAR_UNIV3_WBTC_ETH);

export const JAR_UNIV3_PICKLE_ETH: JarDefinition = {
  type: AssetType.JAR,
  id: "pJar U3h",
  contract: "0x575a9E386c33732880DEF8BE1BAD9dbc5dDDf7D7",
  startBlock: 14357274, startTimestamp: 1646891152,
  depositToken: {
    addr: "0x11c4D3b9cd07807F455371d56B3899bBaE662788",
    name: "UniV3 PICKLE/ETH 1%",
    link: "https://app.uniswap.org/#/add/0x429881672B9AE42b8EbA0E26cD9C73711b891Ca5/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/10000",
    components: ["pickle", "weth"],
    style: { erc20: false },
  },
  rewardTokens: ["pickle", "weth"],
  enablement: AssetEnablement.WITHDRAW_ONLY,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.UNISWAP_V3,
  details: {
    controller: "0x7B5916C61bCEeaa2646cf49D9541ac6F5DCe3637",
    apiKey: "UNIV3-PICKLE-ETH",
    harvestStyle: HarvestStyle.PASSIVE,
  },

  farm: {
    farmAddress: "0xc0a78102caA4Ed3b64bB39DFC935D744E940d67A",
    farmNickname: "pUNIv3 PICKLE/ETH",
    farmDepositTokenName: "pUNIv3 PICKLE/ETH",
  },
};
JAR_DEFINITIONS.push(JAR_UNIV3_PICKLE_ETH);

export const JAR_UNIV3_FRAX_USDC: JarDefinition = {
  type: AssetType.JAR,
  id: "pJar U3i",
  contract: "0x7f3514CBC6825410Ca3fA4deA41d46964a953Afb",
  startBlock: 14398496, startTimestamp: 1647445280,
  depositToken: {
    addr: "0xc63B0708E2F7e69CB8A1df0e1389A98C35A76D52",
    name: "UniV3 FRAX/USDC",
    link: "https://app.uniswap.org/#/add/0x853d955aCEf822Db058eb8505911ED77F175b99e/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/500",
    components: ["frax", "usdc"],
    style: { erc20: false },
  },
  rewardTokens: ["fxs"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.UNISWAP_V3,
  details: {
    controller: "0x7B5916C61bCEeaa2646cf49D9541ac6F5DCe3637",
    apiKey: "UNIV3-FRAX-USDC",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x6092cdE5762FA9F5c8D081fb0c5eD23601f0F400",
    farmNickname: "pUNIv3 FRAX/USDC",
    farmDepositTokenName: "pUNIv3 FRAX/USDC",
  },
  tags: ["stablecoins"],
};
JAR_DEFINITIONS.push(JAR_UNIV3_FRAX_USDC);

export const JAR_UNIV3_COW_ETH: JarDefinition = {
  type: AssetType.JAR,
  id: "pJar U3j",
  contract: "0xf0Fb82757B9f8A3A3AE3524e385E2E9039633948",
  startBlock: 14478453, startTimestamp: 1648521288,
  depositToken: {
    addr: "0xFCfDFC98062d13a11cec48c44E4613eB26a34293",
    name: "UniV3 COW/ETH 1%",
    link: "https://app.uniswap.org/#/add/0xDEf1CA1fb7FBcDC777520aa7f396b4E015F497aB/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/10000",
    components: ["weth", "cow"],
    style: { erc20: false },
  },
  rewardTokens: ["weth", "cow"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.UNISWAP_V3,
  details: {
    controller: "0x7B5916C61bCEeaa2646cf49D9541ac6F5DCe3637",
    apiKey: "UNIV3-COW-ETH",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0xbb813d44f8b5a4e033bdc126a9ff2800b7037230",
    farmNickname: "pUNIv3 COW/ETH",
    farmDepositTokenName: "pUNIv3 COW/ETH",
  },
};
JAR_DEFINITIONS.push(JAR_UNIV3_COW_ETH);

export const JAR_UNIV3_APE_ETH: JarDefinition = {
  type: AssetType.JAR,
  id: "pJar U3k",
  contract: "0x49ED0e6B438430CEEdDa8C6d06B6A2797aFA81cA",
  startBlock: 14478453, startTimestamp: 1648521288,
  depositToken: {
    addr: "0xAc4b3DacB91461209Ae9d41EC517c2B9Cb1B7DAF",
    name: "UniV3 APE/ETH 0.3%",
    link: "https://app.uniswap.org/#/add/0x4d224452801ACEd8B2F0aebE155379bb5D594381/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/3000",
    components: ["ape", "weth"],
    style: { erc20: false },
  },
  rewardTokens: ["ape", "weth"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.UNISWAP_V3,
  details: {
    controller: "0x7B5916C61bCEeaa2646cf49D9541ac6F5DCe3637",
    apiKey: "UNIV3-APE-ETH",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0xefd78d7f70b776f47bf6da04bac838917fe10f71",
    farmNickname: "pUNIv3 APE/ETH",
    farmDepositTokenName: "pUNIv3 APE/ETH",
  },
};
JAR_DEFINITIONS.push(JAR_UNIV3_APE_ETH);

export const JAR_STAR_USDC: JarDefinition = {
  type: AssetType.JAR,
  id: "pJar 1a",
  contract: "0x81740AAc02ae2F3c61D5a0c012b3e18f9dc02b5c",
  startBlock: 14490890, startTimestamp: 1648688653,
  depositToken: {
    addr: "0xdf0770dF86a8034b3EFEf0A1Bb3c889B8332FF56",
    name: "STARGATE USDC",
    link: "https://stargate.finance/pool/USDC-ETH/add",
    components: ["usdc"],
    decimals: 6,
  },
  rewardTokens: ["stg"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.STARGATE,
  stakingProtocol: AssetProtocol.STARGATE,
  details: {
    controller: "0x6847259b2B3A4c17e7c43C54409810aF48bA5210",
    apiKey: "STG-USDC",
    harvestStyle: HarvestStyle.PASSIVE,
    decimals: 6,
  },
  farm: {
    farmAddress: "0xa0dcf3c3b199dfc9d2774ec6a43d984e9bf0746a",
    farmNickname: "pSTG USDC",
    farmDepositTokenName: "pSTG USDC",
  },
};
JAR_DEFINITIONS.push(JAR_STAR_USDC);

export const JAR_STAR_USDT: JarDefinition = {
  type: AssetType.JAR,
  id: "pJar 1b",
  contract: "0x363e7CD14AEcf4f7d0e66Ae1DEff830343D760a7",
  startBlock: 14490878, startTimestamp: 1648688430,
  depositToken: {
    addr: "0x38EA452219524Bb87e18dE1C24D3bB59510BD783",
    name: "STARGATE USDT",
    link: "https://stargate.finance/pool/USDT-ETH/add",
    components: ["usdt"],
    decimals: 6,
  },
  rewardTokens: ["stg"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.STARGATE,
  stakingProtocol: AssetProtocol.STARGATE,
  details: {
    controller: "0x6847259b2B3A4c17e7c43C54409810aF48bA5210",
    apiKey: "STG-USDT",
    harvestStyle: HarvestStyle.PASSIVE,
    decimals: 6,
  },
  farm: {
    farmAddress: "0x59d6d2a944d6f4224a9f529560db6c8408cf577c",
    farmNickname: "pSTG USDT",
    farmDepositTokenName: "pSTG USDT",
  },
};
JAR_DEFINITIONS.push(JAR_STAR_USDT);

export const JAR_UNIV2_FRAX_TEMPLE: JarDefinition = {
  type: AssetType.JAR,
  id: "pJar 2a",
  contract: "0x4eB6e19c043513db1451eEe57F0d58ebea2C6150",
  startBlock: 14194675, startTimestamp: 1644714003,
  depositToken: {
    addr: "0x6021444f1706f15465bEe85463BCc7d7cC17Fc03",
    name: "UniV2 FRAX/TEMPLE",
    link: "https://www.stax.fi/app/vaults",
    components: ["temple", "frax"],
  },
  rewardTokens: ["fxs", "temple"],
  enablement: AssetEnablement.PERMANENTLY_DISABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.UNISWAP,
  details: {
    controller: "0x6847259b2B3A4c17e7c43C54409810aF48bA5210",
    apiKey: "UNIV2-FRAX-TEMPLE",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0xb7a632f93e3cbcc9444114bcd162b704e07355a9",
    farmNickname: "pUNIv2 FRAX/TEMPLE",
    farmDepositTokenName: "pUNIv2 FRAX/TEMPLE",
  },
};
JAR_DEFINITIONS.push(JAR_UNIV2_FRAX_TEMPLE);

// Polygon

export const JAR_COMETH_USDC_WETH: JarDefinition = {
  type: AssetType.JAR,
  id: "polyJar 1a",
  contract: "0x9eD7e3590F2fB9EEE382dfC55c71F9d3DF12556c",
  startBlock: 13624727, startTimestamp: 1619169221,
  depositToken: {
    addr: "0x1Edb2D8f791D2a51D56979bf3A25673D6E783232",
    name: "Cometh USDC/WETH",
    link: "https://swap.cometh.io/#/add/0x2791bca1f2de4661ed88a30c99a7a9449aa84174/0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
    components: ["usdc", "weth"],
    nativePath: {
      //(quickSwap)uniswapv2router02 --> WMATIC, USDC
      target: "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
      path: [
        "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
        "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
      ],
    },
  },
  rewardTokens: ["must"],
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
  startBlock: 15164840, startTimestamp: 1622478633,
  depositToken: {
    addr: "0xb0b5e3bd18eb1e316bcd0bba876570b3c1779c55",
    name: "Cometh PICKLE/MUST",
    link: "https://swap.cometh.io/#/add/0x9c78ee466d6cb57a4d01fd887d2b5dfb2d46288f/0x2b88ad57897a8b496595925f43048301c37615da",
    components: ["pickle", "must"],
    nativePath: {
      //(comethSwap)uniswapv2router02 --> WMATIC, MUST
      target: "0x93bcDc45f7e62f89a8e901DC4A0E2c6C427D9F25",
      path: [
        "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
        "0x9C78EE466D6Cb57A4d01Fd887D2b5dFb2D46288f",
      ],
    },
  },
  rewardTokens: ["must"],
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
  startBlock: 15164454, startTimestamp: 1622477837,
  depositToken: {
    addr: "0x80676b414a905de269d0ac593322af821b683b92",
    name: "Cometh MATIC/MUST",
    link: "https://swap.cometh.io/#/add/0x9c78ee466d6cb57a4d01fd887d2b5dfb2d46288f/0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    components: ["matic", "must"],
  },
  rewardTokens: ["must"],
  enablement: AssetEnablement.WITHDRAW_ONLY,
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
  startBlock: 14164165, startTimestamp: 1620310296,
  depositToken: {
    addr: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
    name: "DAI",
    link: "https://polygonscan.com/token/0x8f3cf7ad23cd3cadbd9735aff958023239c6a063?a=0x5143e71982a2d5dc63a77f0a5611685cf13c5aaf",
    components: ["dai"],
  },
  rewardTokens: ["matic"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Polygon,
  protocol: AssetProtocol.AAVE,
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
  startBlock: 14172938, startTimestamp: 1620329389,
  depositToken: {
    addr: "0xE7a24EF0C5e95Ffb0f6684b813A78F2a3AD7D171",
    name: "Curve am3CRV",
    link: "https://polygon.curve.fi/aave/deposit",
    components: ["dai", "usdc", "usdt"], // TODO
  },
  rewardTokens: ["crv"],
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
  startBlock: 15165384, startTimestamp: 1622479757,
  depositToken: {
    addr: "0xc2755915a85c6f6c1c0f3a86ac8c058f11caa9c9",
    name: "Sushi USDT/ETH",
    link: "https://app.sushi.com/#/add/0x7ceb23fd6bc0add59e62ac25578270cff1b9f619/0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
    components: ["weth", "usdt"],
    nativePath: {
      //(quickSwap)uniswapv2router02 --> WMATIC, ETH
      target: "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
      path: [
        "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
        "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
      ],
    },
  },
  rewardTokens: ["sushi"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Polygon,
  protocol: AssetProtocol.SUSHISWAP,
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
  startBlock: 15208969, startTimestamp: 1622569812,
  depositToken: {
    addr: "0xc4e595acdd7d12fec385e5da5d43160e8a0bac0e",
    name: "Sushi MATIC/ETH",
    link: "https://app.sushi.com/add/0x7ceb23fd6bc0add59e62ac25578270cff1b9f619/0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    components: ["weth", "matic"],
  },
  rewardTokens: ["sushi"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Polygon,
  protocol: AssetProtocol.SUSHISWAP,
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
  startBlock: 15597905, startTimestamp: 1623439287,
  depositToken: {
    addr: "0x160532d2536175d65c03b97b0630a9802c274dad",
    name: "Quick MAI/USDC",
    link: "https://quickswap.exchange/#/add/0xa3Fa99A148fA48D14Ed51d610c367C61876997F1/0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    components: ["usdc", "mimatic"],
  },
  rewardTokens: ["qi"],
  enablement: AssetEnablement.PERMANENTLY_DISABLED,
  chain: ChainNetwork.Polygon,
  protocol: AssetProtocol.QUICKSWAP,
  details: {
    apiKey: "polyJar_5a_old",
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
  startBlock: 16364140, startTimestamp: 1625141789,
  depositToken: {
    addr: "0x160532d2536175d65c03b97b0630a9802c274dad",
    name: "Quick MAI/USDC",
    link: "https://quickswap.exchange/#/add/0xa3Fa99A148fA48D14Ed51d610c367C61876997F1/0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    components: ["usdc", "mimatic"],
    nativePath: {
      //(quickSwap)uniswapv2router02 --> WMATIC, USDC
      target: "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
      path: [
        "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
        "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      ],
    },
  },
  rewardTokens: ["qi"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Polygon,
  protocol: AssetProtocol.QUICKSWAP,
  details: {
    apiKey: "QLP-MIMATIC",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x20b2a3fc7b13ca0ccf7af81a68a14cb3116e8749",
    farmNickname: "pQuick MAI/USDC",
    farmDepositTokenName: "pQuick MAI/USDC",
  },
  tags: ["stablecoins"],
};
JAR_DEFINITIONS.push(JAR_QUICK_MIMATIC_USDC);

export const JAR_QUICK_QI_MIMATIC: JarDefinition = {
  type: AssetType.JAR,
  id: "polyJar 5b",
  contract: "0xd06a56c864C80e4cC76A2eF778183104BF0c848d",
  startBlock: 16651328, startTimestamp: 1625778661,
  depositToken: {
    addr: "0x7AfcF11F3e2f01e71B7Cc6b8B5e707E42e6Ea397",
    name: "Quick QI/MIMATIC",
    link: "https://quickswap.exchange/#/add/0xa3Fa99A148fA48D14Ed51d610c367C61876997F1/0x580A84C73811E1839F75d86d75d88cCa0c241fF4",
    components: ["qi", "mimatic"],
  },
  rewardTokens: ["qi"],
  enablement: AssetEnablement.DISABLED,
  chain: ChainNetwork.Polygon,
  protocol: AssetProtocol.QUICKSWAP,
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
  startBlock: 18894454, startTimestamp: 1631134840,
  depositToken: {
    addr: "0x9a8b2601760814019b7e6ee0052e25f1c623d1e6",
    name: "Quick QI/MATIC",
    link: "https://quickswap.exchange/#/add/0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270/0x580A84C73811E1839F75d86d75d88cCa0c241fF4",
    components: ["qi", "matic"],
  },
  rewardTokens: ["qi"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Polygon,
  protocol: AssetProtocol.QUICKSWAP,
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
  startBlock: 16810688, startTimestamp: 1626165636,
  depositToken: {
    addr: "0xb4d09ff3dA7f9e9A2BA029cb0A81A989fd7B8f17",
    name: "Iron 3USD",
    link: "https://app.iron.finance/swap/pools/is3usd/deposit",
    components: ["usdc", "usdt", "dai"],
  },
  rewardTokens: ["ice"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Polygon,
  protocol: AssetProtocol.IRON,
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
  startBlock: 17630603, startTimestamp: 1628124985,
  depositToken: {
    addr: "0x3324af8417844e70b81555A6D1568d78f4D4Bf1f",
    name: "Sushi DINO/USDC",
    link: "https://app.sushi.com/add/0x2791bca1f2de4661ed88a30c99a7a9449aa84174/0xAa9654BECca45B5BDFA5ac646c939C62b527D394",
    components: ["dino", "usdc"],
    nativePath: {
      //(quickSwap)uniswapv2router02 --> WMATIC, USDC
      target: "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
      path: [
        "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
        "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      ],
    },
  },
  rewardTokens: ["dino"],
  enablement: AssetEnablement.WITHDRAW_ONLY,
  chain: ChainNetwork.Polygon,
  protocol: AssetProtocol.SUSHISWAP,
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
  startBlock: 17666490, startTimestamp: 1628219990,
  depositToken: {
    addr: "0x9f03309A588e33A239Bf49ed8D68b2D45C7A1F11",
    name: "Quick DINO/ETH",
    link: "https://quickswap.exchange/#/add/0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619/0xAa9654BECca45B5BDFA5ac646c939C62b527D394",
    components: ["dino", "weth"],
    nativePath: {
      //(quickSwap)uniswapv2router02 --> WMATIC, WETH
      target: "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
      path: [
        "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
        "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
      ],
    },
  },
  rewardTokens: ["dino"],
  enablement: AssetEnablement.WITHDRAW_ONLY,
  chain: ChainNetwork.Polygon,
  protocol: AssetProtocol.QUICKSWAP,
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
  startBlock: 18639788, startTimestamp: 1630534898,
  depositToken: {
    addr: "0x57602582eB5e82a197baE4E8b6B80E39abFC94EB",
    name: "Sushi PICKLE/DAI",
    link: "https://app.sushi.com/add/0x2b88aD57897A8b496595925F43048301C37615Da/0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
    components: ["pickle", "dai"],
    nativePath: {
      //(quickSwap)uniswapv2router02 --> WMATIC, DAI
      target: "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
      path: [
        "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
        "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
      ],
    },
  },
  rewardTokens: ["sushi"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Polygon,
  protocol: AssetProtocol.SUSHISWAP,
  details: {
    apiKey: "PSLP-PICKLE",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  tags: ["pool2"],
};
JAR_DEFINITIONS.push(JAR_POLY_SUSHI_PICKLE_DAI);

export const JAR_POLY_SUSHI_WORK_USDC: JarDefinition = {
  type: AssetType.JAR,
  id: "polyJar 7c",
  contract: "0xd170f0a8629a6f7a1e330d5fc455d96e54c09675",
  startBlock: 19901812, startTimestamp: 1633510844,
  depositToken: {
    addr: "0xab0454b98daf4a02ea29292e6a8882fb2c787dd4",
    name: "Sushi WORK/USDC",
    link: "https://app.sushi.com/add/0x2791bca1f2de4661ed88a30c99a7a9449aa84174/0x6002410dDA2Fb88b4D0dc3c1D562F7761191eA80",
    components: ["usdc", "work"],
    nativePath: {
      //(quickSwap)uniswapv2router02 --> WMATIC, USDC
      target: "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
      path: [
        "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
        "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      ],
    },
  },
  rewardTokens: ["dino"],
  enablement: AssetEnablement.WITHDRAW_ONLY,
  chain: ChainNetwork.Polygon,
  protocol: AssetProtocol.SUSHISWAP,
  details: {
    apiKey: "PSLP-WORK",
    harvestStyle: HarvestStyle.PASSIVE,
  },
};
JAR_DEFINITIONS.push(JAR_POLY_SUSHI_WORK_USDC);

export const JAR_POLY_SUSHI_RAIDER_MATIC: JarDefinition = {
  type: AssetType.JAR,
  id: "polyJar 4d",
  contract: "0xCA12121E55C5523ad5e0e6a9062689c4eBa0b691",
  startBlock: 23688904, startTimestamp: 1642117628,
  depositToken: {
    addr: "0x2E7d6490526C7d7e2FDEa5c6Ec4b0d1b9F8b25B7",
    name: "Sushi RAIDER/MATIC",
    link: "https://app.sushi.com/add/0xcd7361ac3307d1c5a46b63086a90742ff44c63b3/0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
    components: ["raider", "matic"],
  },
  rewardTokens: ["raider"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Polygon,
  protocol: AssetProtocol.SUSHISWAP,
  details: {
    apiKey: "PSLP-RAIDER-MATIC",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x20b2a3fc7b13ca0ccf7af81a68a14cb3116e8749",
    farmNickname: "pSushi RAIDER/MATIC",
    farmDepositTokenName: "pSushi RAIDER/MATIC",
  },
};
JAR_DEFINITIONS.push(JAR_POLY_SUSHI_RAIDER_MATIC);

export const JAR_POLY_SUSHI_RAIDER_WETH: JarDefinition = {
  type: AssetType.JAR,
  id: "polyJar 4e",
  contract: "0x2e57627ACf6c1812F99e274d0ac61B786c19E74f",
  startBlock: 23689010, startTimestamp: 1642117844,
  depositToken: {
    addr: "0x426a56F6923c2B8A488407fc1B38007317ECaFB1",
    name: "Sushi RAIDER/WETH",
    link: "https://app.sushi.com/add/0xcd7361ac3307d1c5a46b63086a90742ff44c63b3/0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
    components: ["raider", "weth"],
    nativePath: {
      //(quickSwap)uniswapv2router02 --> WMATIC, WETH
      target: "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
      path: [
        "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
        "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
      ],
    },
  },
  rewardTokens: ["raider"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Polygon,
  protocol: AssetProtocol.SUSHISWAP,
  details: {
    apiKey: "PSLP-RAIDER-WETH",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x20b2a3fc7b13ca0ccf7af81a68a14cb3116e8749",
    farmNickname: "pSushi RAIDER/WETH",
    farmDepositTokenName: "pSushi RAIDER/WETH",
  },
};
JAR_DEFINITIONS.push(JAR_POLY_SUSHI_RAIDER_WETH);

export const JAR_POLY_SUSHI_AURUM_MATIC: JarDefinition = {
  type: AssetType.JAR,
  id: "polyJar 4f",
  contract: "0x6f8B4D9c4dC3592962C55207Ac945dbf5be54cC4",
  startBlock: 23688802, startTimestamp: 1642117416,
  depositToken: {
    addr: "0x91670a2A69554c61d814CD7f406D7793387E68Ef",
    name: "Sushi AURUM/MATIC",
    link: "https://app.sushi.com/add/0x34d4ab47bee066f361fa52d792e69ac7bd05ee23/0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
    components: ["aurum", "matic"],
  },
  rewardTokens: ["raider"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Polygon,
  protocol: AssetProtocol.SUSHISWAP,
  details: {
    apiKey: "PSLP-AURUM-MATIC",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x20b2a3fc7b13ca0ccf7af81a68a14cb3116e8749",
    farmNickname: "pSushi AURUM/MATIC",
    farmDepositTokenName: "pSushi AURUM/MATIC",
  },
};
JAR_DEFINITIONS.push(JAR_POLY_SUSHI_AURUM_MATIC);

export const JAR_POLY_SUSHI_AURUM_USDC: JarDefinition = {
  type: AssetType.JAR,
  id: "polyJar 4g",
  contract: "0x5E5D7739ea3B6787587E129E4A508FfDAF180923",
  startBlock: 23689116, startTimestamp: 1642118064,
  depositToken: {
    addr: "0xaBEE7668a96C49D27886D1a8914a54a5F9805041",
    name: "Sushi AURUM/USDC",
    link: "https://app.sushi.com/add/0x34d4ab47bee066f361fa52d792e69ac7bd05ee23/0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    components: ["aurum", "usdc"],
    nativePath: {
      //(quickSwap)uniswapv2router02 --> WMATIC, USDC
      target: "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
      path: [
        "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
        "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      ],
    },
  },
  rewardTokens: ["raider"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Polygon,
  protocol: AssetProtocol.SUSHISWAP,
  details: {
    apiKey: "PSLP-AURUM-USDC",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x20b2a3fc7b13ca0ccf7af81a68a14cb3116e8749",
    farmNickname: "pSushi AURUM/USDC",
    farmDepositTokenName: "pSushi AURUM/USDC",
  },
};
JAR_DEFINITIONS.push(JAR_POLY_SUSHI_AURUM_USDC);

export const JAR_POLY_UNIV3_USDC_ETH: JarDefinition = {
  type: AssetType.JAR,
  id: "polyJar U3a",
  contract: "0x75415BF29f054Ab9047D26501Ad5ef93B5364eb0",
  startBlock: 23839377, startTimestamp: 1642451404,
  depositToken: {
    addr: "0x45dDa9cb7c25131DF268515131f647d726f50608",
    name: "UniV3 USDC/ETH",
    link: "https://app.uniswap.org/#/add/0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174/0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619/500",
    components: ["usdc", "weth"],
    style: { erc20: false },
  },
  rewardTokens: ["usdc", "weth"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Polygon,
  protocol: AssetProtocol.UNISWAP_V3,
  details: {
    controller: "0x90Ee5481A78A23a24a4290EEc42E8Ad0FD3B4AC3",
    apiKey: "POLY-UNIV3-USDC-ETH",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x20B2a3fc7B13cA0cCf7AF81A68a14CB3116E8749",
    farmNickname: "pUniV3 USDC/ETH",
    farmDepositTokenName: "pUniV3 USDC/ETH",
  },
};
JAR_DEFINITIONS.push(JAR_POLY_UNIV3_USDC_ETH);

export const JAR_POLY_UNIV3_MATIC_ETH: JarDefinition = {
  type: AssetType.JAR,
  id: "polyJar U3b",
  contract: "0x925b6f866AeB88131d159Fc790b9FC8203621B3C",
  startBlock: 24524019, startTimestamp: 1643943025,
  depositToken: {
    addr: "0x167384319B41F7094e62f7506409Eb38079AbfF8",
    name: "UniV3 MATIC/ETH",
    link: "https://app.uniswap.org/#/add/ETH/0x7ceb23fd6bc0add59e62ac25578270cff1b9f619/3000",
    components: ["matic", "weth"],
    style: { erc20: false },
  },
  rewardTokens: ["matic", "weth"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Polygon,
  protocol: AssetProtocol.UNISWAP_V3,
  details: {
    controller: "0x90Ee5481A78A23a24a4290EEc42E8Ad0FD3B4AC3",
    apiKey: "POLY-UNIV3-MATIC-ETH",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x20B2a3fc7B13cA0cCf7AF81A68a14CB3116E8749",
    farmNickname: "pUniV3 MATIC/ETH",
    farmDepositTokenName: "pUniV3 MATIC/ETH",
  },
};
JAR_DEFINITIONS.push(JAR_POLY_UNIV3_MATIC_ETH);

export const JAR_POLY_UNIV3_MATIC_USDC: JarDefinition = {
  type: AssetType.JAR,
  id: "polyJar U3c",
  contract: "0x09e4E5fc62d8ae06fD44b3527235693f29fda852",
  startBlock: 24523952, startTimestamp: 1643942783,
  depositToken: {
    addr: "0x88f3C15523544835fF6c738DDb30995339AD57d6",
    name: "UniV3 MATIC/USDC",
    link: "https://app.uniswap.org/#/add/ETH/0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174/3000",
    components: ["matic", "usdc"],
    style: { erc20: false },
  },
  rewardTokens: ["matic", "usdc"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Polygon,
  protocol: AssetProtocol.UNISWAP_V3,
  details: {
    controller: "0x90Ee5481A78A23a24a4290EEc42E8Ad0FD3B4AC3",
    apiKey: "POLY-UNIV3-MATIC-USDC",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x20B2a3fc7B13cA0cCf7AF81A68a14CB3116E8749",
    farmNickname: "pUniV3 MATIC/USDC",
    farmDepositTokenName: "pUniV3 MATIC/USDC",
  },
};
JAR_DEFINITIONS.push(JAR_POLY_UNIV3_MATIC_USDC);

export const JAR_POLY_UNIV3_USDC_USDT: JarDefinition = {
  type: AssetType.JAR,
  id: "polyJar U3d",
  contract: "0x6ddCE484E929b2667C604f6867A4a7b3d344A917",
  startBlock: 24277253, startTimestamp: 1643400169,
  depositToken: {
    addr: "0x3F5228d0e7D75467366be7De2c31D0d098bA2C23",
    name: "UniV3 USDC/USDT",
    link: "https://app.uniswap.org/#/add/0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174/0xc2132D05D31c914a87C6611C10748AEb04B58e8F/500",
    components: ["usdc", "usdt"],
    style: { erc20: false },
  },
  rewardTokens: ["usdc", "usdt"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Polygon,
  protocol: AssetProtocol.UNISWAP_V3,
  details: {
    controller: "0x90Ee5481A78A23a24a4290EEc42E8Ad0FD3B4AC3",
    apiKey: "POLY-UNIV3-USDC-USDT",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  tags: ["stablecoins"],
  farm: {
    farmAddress: "0x20B2a3fc7B13cA0cCf7AF81A68a14CB3116E8749",
    farmNickname: "pUniV3 USDC/USDT",
    farmDepositTokenName: "pUniV3 USDC/USDT",
  },
};
JAR_DEFINITIONS.push(JAR_POLY_UNIV3_USDC_USDT);

export const JAR_POLY_UNIV3_WBTC_ETH: JarDefinition = {
  type: AssetType.JAR,
  id: "polyJar U3e",
  contract: "0xf4b1635f6B71D7859B4184EbDB5cf7321e828055",
  startBlock: 24277508, startTimestamp: 1643400823,
  depositToken: {
    addr: "0x50eaEDB835021E4A108B7290636d62E9765cc6d7",
    name: "UniV3 WBTC/ETH",
    link: "https://app.uniswap.org/#/add/0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6/0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619/500",
    components: ["wbtc", "weth"],
    style: { erc20: false },
  },
  rewardTokens: ["wbtc", "weth"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Polygon,
  protocol: AssetProtocol.UNISWAP_V3,
  details: {
    controller: "0x90Ee5481A78A23a24a4290EEc42E8Ad0FD3B4AC3",
    apiKey: "POLY-UNIV3-WBTC-ETH",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x20B2a3fc7B13cA0cCf7AF81A68a14CB3116E8749",
    farmNickname: "pUniV3 WBTC/ETH",
    farmDepositTokenName: "pUniV3 WBTC/ETH",
  },
};
JAR_DEFINITIONS.push(JAR_POLY_UNIV3_WBTC_ETH);

export const JAR_POLY_STAR_USDT: JarDefinition = {
  type: AssetType.JAR,
  id: "polyJar 8a",
  contract: "0x363e7CD14AEcf4f7d0e66Ae1DEff830343D760a7",
  startBlock: 26557778, startTimestamp: 1648685657,
  depositToken: {
    addr: "0x29e38769f23701A2e4A8Ef0492e19dA4604Be62c",
    name: "STARGATE USDT",
    link: "https://stargate.finance/pool/USDT-MATIC/add",
    components: ["usdt"],
    decimals: 6,
  },
  rewardTokens: ["stg"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Polygon,
  protocol: AssetProtocol.STARGATE,
  stakingProtocol: AssetProtocol.STARGATE,
  details: {
    apiKey: "STG-POLYGON-USDT",
    harvestStyle: HarvestStyle.PASSIVE,
    decimals: 6,
  },
  farm: {
    farmAddress: "0x20B2a3fc7B13cA0cCf7AF81A68a14CB3116E8749",
    farmNickname: "pSTG USDT",
    farmDepositTokenName: "pSTG USDT",
  },
};
JAR_DEFINITIONS.push(JAR_POLY_STAR_USDT);

export const JAR_POLY_STAR_USDC: JarDefinition = {
  type: AssetType.JAR,
  id: "polyJar 8b",
  contract: "0x49DA51435329847b369829873b04b537D2DAc302",
  startBlock: 26556897, startTimestamp: 1648683834,
  depositToken: {
    addr: "0x1205f31718499dBf1fCa446663B532Ef87481fe1",
    name: "STARGATE USDC",
    link: "https://stargate.finance/pool/USDC-MATIC/add",
    components: ["usdc"],
    decimals: 6,
  },
  rewardTokens: ["stg"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Polygon,
  protocol: AssetProtocol.STARGATE,
  stakingProtocol: AssetProtocol.STARGATE,
  details: {
    apiKey: "STG-POLYGON-USDC",
    harvestStyle: HarvestStyle.PASSIVE,
    decimals: 6,
  },
  farm: {
    farmAddress: "0x20B2a3fc7B13cA0cCf7AF81A68a14CB3116E8749",
    farmNickname: "pSTG USDC",
    farmDepositTokenName: "pSTG USDC",
  },
};
JAR_DEFINITIONS.push(JAR_POLY_STAR_USDC);

// Arbitrum

export const JAR_ARBITRUM_SLP_MIM_ETH: JarDefinition = {
  type: AssetType.JAR,
  id: "arbJar 1a",
  contract: "0x94feade0d3d832e4a05d459ebea9350c6cdd3bca",
  startBlock: 1176280, startTimestamp: 1631929064,
  depositToken: {
    addr: "0xb6DD51D5425861C808Fd60827Ab6CFBfFE604959",
    name: "Sushi MIM/ETH",
    link: "https://app.sushi.com/add/0xFEa7a6a0B346362BF88A9e4A88416B77a57D6c2A/ETH",
    components: ["mim", "weth"],
  },
  rewardTokens: ["sushi", "spell"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Arbitrum,
  protocol: AssetProtocol.SUSHISWAP,
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
  startBlock: 1394180, startTimestamp: 1632210404,
  depositToken: {
    addr: "0x8f93Eaae544e8f5EB077A1e09C1554067d9e2CA8",
    name: "Sushi SPELL/ETH",
    link: "https://app.sushi.com/add/0x3e6648c5a70a150a88bce65f4ad4d506fe15d2af/ETH",
    components: ["spell", "weth"],
  },
  rewardTokens: ["sushi", "spell"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Arbitrum,
  protocol: AssetProtocol.SUSHISWAP,
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
  startBlock: 1539551, startTimestamp: 1632445325,
  depositToken: {
    addr: "0x30dF229cefa463e991e29D42DB0bae2e122B2AC7",
    name: "Curve MIM/2CRV",
    link: "https://arbitrum.curve.fi/factory/0/deposit",
    components: ["mim", "2crv"],
  },
  rewardTokens: ["crv", "spell"],
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
  tags: ["stablecoins"],
};
JAR_DEFINITIONS.push(JAR_ARBITRUM_MIM2CRV);

export const JAR_ARBITRUM_SLP_GOHM_ETH: JarDefinition = {
  type: AssetType.JAR,
  id: "arbJar 1d",
  contract: "0x6779EB2838f44300CB6025d17DEB9F2E27CC9540",
  startBlock: 4032750, startTimestamp: 1640229218,
  depositToken: {
    addr: "0xaa5bD49f2162ffdC15634c87A77AC67bD51C6a6D",
    name: "Sushi GOHM/ETH",
    link: "https://app.sushi.com/add/0x8d9ba570d6cb60c7e3e0f31343efe75ab8e65fb1/ETH",
    components: ["gohm", "weth"],
  },
  rewardTokens: ["sushi", "gohm"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Arbitrum,
  protocol: AssetProtocol.SUSHISWAP,
  details: {
    apiKey: "ArbitrumSlpGohmEth",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x7ecc7163469f37b777d7b8f45a667314030ace24",
    farmNickname: "pSushi GOHM/ETH",
    farmDepositTokenName: "pSushi GOHM/ETH",
  },
};
JAR_DEFINITIONS.push(JAR_ARBITRUM_SLP_GOHM_ETH);

export const JAR_ARBITRUM_SLP_MAGIC_ETH: JarDefinition = {
  type: AssetType.JAR,
  id: "arbJar 1e",
  contract: "0xEcAf3149fdA215E46e792C65dc0aB7399C2eA78B",
  startBlock: 4032975, startTimestamp: 1640230049,
  depositToken: {
    addr: "0xB7E50106A5bd3Cf21AF210A755F9C8740890A8c9",
    name: "Sushi MAGIC/ETH",
    link: "https://app.sushi.com/add/0x539bde0d7dbd336b79148aa742883198bbf60342/ETH",
    components: ["magic", "weth"],
  },
  rewardTokens: ["sushi", "magic"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Arbitrum,
  protocol: AssetProtocol.SUSHISWAP,
  details: {
    apiKey: "ArbitrumSlpMagicEth",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x7ecc7163469f37b777d7b8f45a667314030ace24",
    farmNickname: "pSushi MAGIC/ETH",
    farmDepositTokenName: "pSushi MAGIC/ETH",
  },
};
JAR_DEFINITIONS.push(JAR_ARBITRUM_SLP_MAGIC_ETH);

export const JAR_ARBITRUM_DODO_HND_ETH: JarDefinition = {
  type: AssetType.JAR,
  id: "arbJar 3a",
  contract: "0x4d622C1f40A83C6FA2c0E441AE393e6dE61E7dD2",
  startBlock: 1927492, startTimestamp: 1633395270,
  depositToken: {
    addr: "0x65E17c52128396443d4A9A61EaCf0970F05F8a20",
    name: "Dodo HND/ETH",
    link: "https://app.dodoex.io/liquidity?poolAddress=0x65e17c52128396443d4a9a61eacf0970f05f8a20",
    components: ["hnd", "weth"],
  },
  rewardTokens: ["dodo"],
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
  startBlock: 2794134, startTimestamp: 1635890430,
  depositToken: {
    addr: "0x6a58c68FF5C4e4D90EB6561449CC74A64F818dA5",
    name: "Dodo DODO/USDC",
    link: "https://app.dodoex.io/liquidity?network=arbitrum&poolAddress=0x6a58c68ff5c4e4d90eb6561449cc74a64f818da5",
    components: ["dodo", "usdc"],
  },
  rewardTokens: ["dodo"],
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
  startBlock: 1704755, startTimestamp: 1632805005,
  depositToken: {
    addr: "0x8e0b8c8bb9db49a46697f3a5bb8a308e744821d2",
    name: "Curve Tricrypto",
    link: "https://arbitrum.curve.fi/tricrypto/deposit",
    components: ["usdt", "wbtc", "weth"],
  },
  rewardTokens: ["crv"],
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
  startBlock: 1489610, startTimestamp: 1632365310,
  depositToken: {
    addr: "0x64541216bafffeec8ea535bb71fbc927831d0595",
    name: "Balancer Tricrypto",
    link: "https://arbitrum.balancer.fi/#/pool/0x64541216bafffeec8ea535bb71fbc927831d0595000100000000000000000002/invest",
    components: ["usdc", "wbtc", "weth"],
  },
  rewardTokens: ["hal"],
  enablement: AssetEnablement.WITHDRAW_ONLY,
  chain: ChainNetwork.Arbitrum,
  protocol: AssetProtocol.BALANCER,
  details: {
    apiKey: "BalTricrypto",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: "0x7ecc7163469f37b777d7b8f45a667314030ace24",
    farmNickname: "Balancer Tricrypto",
    farmDepositTokenName: "Balancer Tricrypto",
  },
  tags: ["cooldown"],
};
JAR_DEFINITIONS.push(JAR_ARBITRUM_BAL_TRICRYPTO);

export const JAR_ARBITRUM_BAL_PICKLE_ETH: JarDefinition = {
  type: AssetType.JAR,
  id: "arbJar 4b",
  contract: "0x979Cb85f2fe4B6036c089c554c91fdfB7158bB28",
  startBlock: 4449395, startTimestamp: 1641551500,
  depositToken: {
    addr: "0xc2F082d33b5B8eF3A7E3de30da54EFd3114512aC",
    name: "Balancer PICKLE/ETH",
    link: "https://arbitrum.balancer.fi/#/pool/0xc2f082d33b5b8ef3a7e3de30da54efd3114512ac000200000000000000000017/invest",
    components: ["pickle", "weth"],
  },
  rewardTokens: ["pickle", "bal"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Arbitrum,
  protocol: AssetProtocol.BALANCER,
  details: {
    apiKey: "BalPickleEth",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: "0x7ecc7163469f37b777d7b8f45a667314030ace24",
    farmNickname: "Balancer PICKLE/ETH",
    farmDepositTokenName: "Balancer PICKLE/ETH",
  },
  tags: ["pool2", "cooldown"],
};
JAR_DEFINITIONS.push(JAR_ARBITRUM_BAL_PICKLE_ETH);

export const JAR_ARBITRUM_BAL_ETH: JarDefinition = {
  type: AssetType.JAR,
  id: "arbJar 4c",
  contract: "0x46573375eEDA7979e19fAEEdd7eF2843047D9E0d",
  startBlock: 4479885, startTimestamp: 1641644000,
  depositToken: {
    addr: "0xcC65A812ce382aB909a11E434dbf75B34f1cc59D",
    name: "Balancer BAL/ETH",
    link: "https://arbitrum.balancer.fi/#/pool/0xcc65a812ce382ab909a11e434dbf75b34f1cc59d000200000000000000000001/invest",
    components: ["bal", "weth"],
  },
  rewardTokens: ["bal"],
  enablement: AssetEnablement.WITHDRAW_ONLY,
  chain: ChainNetwork.Arbitrum,
  protocol: AssetProtocol.BALANCER,
  details: {
    apiKey: "ArbitrumBalEth",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: "0x7ecc7163469f37b777d7b8f45a667314030ace24",
    farmNickname: "Balancer BAL/ETH",
    farmDepositTokenName: "Balancer BAL/ETH",
  },
  tags: ["cooldown"],
};
JAR_DEFINITIONS.push(JAR_ARBITRUM_BAL_ETH);

export const JAR_ARBITRUM_BAL_VSTA_ETH: JarDefinition = {
  type: AssetType.JAR,
  id: "arbJar 5a",
  contract: "0x0c02883103e64b62c4b52ABe7E743Cc50EB2D4C7",
  startBlock: 5711179, startTimestamp: 1644398819,
  depositToken: {
    addr: "0xC61ff48f94D801c1ceFaCE0289085197B5ec44F0",
    name: "Balancer VSTA/ETH",
    link: "https://arbitrum.balancer.fi/#/pool/0xc61ff48f94d801c1ceface0289085197b5ec44f000020000000000000000004d/invest",
    components: ["vsta", "weth"],
  },
  rewardTokens: ["vsta"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Arbitrum,
  protocol: AssetProtocol.BALANCER,
  details: {
    apiKey: "BalVstaEth",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x7ecc7163469f37b777d7b8f45a667314030ace24",
    farmNickname: "Balancer VSTA/ETH",
    farmDepositTokenName: "Balancer VSTA/ETH",
  },
};
JAR_DEFINITIONS.push(JAR_ARBITRUM_BAL_VSTA_ETH);

export const JAR_ARBITRUM_STAR_USDC: JarDefinition = {
  type: AssetType.JAR,
  id: "arbJar 6a",
  contract: "0x1c498531310C0f81561F4723314EF54049d3a9ef",
  startBlock: 8778855, startTimestamp: 1648493576,
  depositToken: {
    addr: "0x892785f33CdeE22A30AEF750F285E18c18040c3e",
    name: "STARGATE USDC",
    link: "https://stargate.finance/pool/USDC-ARBITRUM/add",
    components: ["usdc"],
    decimals: 6,
  },
  rewardTokens: ["stg"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Arbitrum,
  protocol: AssetProtocol.STARGATE,
  stakingProtocol: AssetProtocol.STARGATE,
  details: {
    apiKey: "STG-ARBITRUM-USDC",
    harvestStyle: HarvestStyle.PASSIVE,
    decimals: 6,
  },
  farm: {
    farmAddress: "0x7ecc7163469f37b777d7b8f45a667314030ace24",
    farmNickname: "pSTG USDC",
    farmDepositTokenName: "pSTG USDC",
  },
};
JAR_DEFINITIONS.push(JAR_ARBITRUM_STAR_USDC);

export const JAR_ARBITRUM_STAR_USDT: JarDefinition = {
  type: AssetType.JAR,
  id: "arbJar 6b",
  contract: "0xa23d9e5094ac9582f9f09aaa017b79deccab5404",
  startBlock: 8792774, startTimestamp: 1648509950,
  depositToken: {
    addr: "0xb6cfcf89a7b22988bfc96632ac2a9d6dab60d641",
    name: "STARGATE USDT",
    link: "https://stargate.finance/pool/USDT-ARBITRUM/add",
    components: ["usdt"],
    decimals: 6,
  },
  rewardTokens: ["stg"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Arbitrum,
  protocol: AssetProtocol.STARGATE,
  stakingProtocol: AssetProtocol.STARGATE,
  details: {
    apiKey: "STG-ARBITRUM-USDT",
    harvestStyle: HarvestStyle.PASSIVE,
    decimals: 6,
  },
  farm: {
    farmAddress: "0x7ecc7163469f37b777d7b8f45a667314030ace24",
    farmNickname: "pSTG USDT",
    farmDepositTokenName: "pSTG USDT",
  },
};
JAR_DEFINITIONS.push(JAR_ARBITRUM_STAR_USDT);

// OKEx Chain

export const JAR_OKEX_OKT_CHE: JarDefinition = {
  type: AssetType.JAR,
  id: "okexJar 1a",
  contract: "0xC3f393FB40F8Cc499C1fe7FA5781495dc6FAc9E9",
  startBlock: 4794097, startTimestamp: 1628597093,
  depositToken: {
    addr: "0x8E68C0216562BCEA5523b27ec6B9B6e1cCcBbf88",
    name: "Cherry OKT/CHE",
    link: "https://www.cherryswap.net/#/add/ETH/0x8179D97Eb6488860d816e3EcAFE694a4153F216c",
    components: ["wokt", "cherry"],
  },
  rewardTokens: ["cherry"],
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
  startBlock: 5125777, startTimestamp: 1629943731,
  depositToken: {
    addr: "0x089dedbFD12F2aD990c55A2F1061b8Ad986bFF88",
    name: "Cherry USDT/CHE",
    link: "https://www.cherryswap.net/#/add/0x382bb369d343125bfb2117af9c149795c6c65c50/0x8179D97Eb6488860d816e3EcAFE694a4153F216c",
    components: ["usdt", "cherry"],
    nativePath: {
      //cherry Router --> WOKT, USDT
      target: "0x865bfde337C8aFBffF144Ff4C29f9404EBb22b15",
      path: [
        "0x8F8526dbfd6E38E3D8307702cA8469Bae6C56C15",
        "0x382bb369d343125bfb2117af9c149795c6c65c50",
      ],
    },
  },
  rewardTokens: ["cherry"],
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
  startBlock: 5149060, startTimestamp: 1630035409,
  depositToken: {
    addr: "0xF3098211d012fF5380A03D80f150Ac6E5753caA8",
    name: "Cherry OKT/USDT",
    link: "https://www.cherryswap.net/#/add/ETH/0x382bb369d343125bfb2117af9c149795c6c65c50",
    components: ["wokt", "usdt"],
  },
  rewardTokens: ["cherry"],
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
  startBlock: 5149047, startTimestamp: 1630035357,
  depositToken: {
    addr: "0x407F7a2F61E5bAB199F7b9de0Ca330527175Da93",
    name: "Cherry ETHK/USDT",
    link: "https://www.cherryswap.net/#/add/0xEF71CA2EE68F45B9Ad6F72fbdb33d707b872315C/0x382bb369d343125bfb2117af9c149795c6c65c50",
    components: ["ethk", "usdt"],
    nativePath: {
      //cherry Router --> WOKT, USDT
      target: "0x865bfde337C8aFBffF144Ff4C29f9404EBb22b15",
      path: [
        "0x8F8526dbfd6E38E3D8307702cA8469Bae6C56C15",
        "0x382bb369d343125bfb2117af9c149795c6c65c50",
      ],
    },
  },
  rewardTokens: ["cherry"],
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
  startBlock: 5291418, startTimestamp: 1630601667,
  depositToken: {
    addr: "0x04b2C23Ca7e29B71fd17655eb9Bd79953fA79faF",
    name: "BXH USDT/BXH",
    link: "https://okswap.bxh.com/#/add/0x145ad28a42bf334104610f7836d0945dffb6de63/0x382bb369d343125bfb2117af9c149795c6c65c50",
    components: ["bxh", "usdt"],
    nativePath: {
      //cherry Router --> WOKT, USDT
      target: "0x865bfde337C8aFBffF144Ff4C29f9404EBb22b15",
      path: [
        "0x8F8526dbfd6E38E3D8307702cA8469Bae6C56C15",
        "0x382bb369d343125bfb2117af9c149795c6c65c50",
      ],
    },
  },
  rewardTokens: ["bxh"],
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
  startBlock: 5418700, startTimestamp: 1631098716,
  depositToken: {
    addr: "0x3799Fb39b7fA01E23338C1C3d652FB1AB6E7D5BC",
    name: "BXH ETHK/BTCK",
    link: "https://okswap.bxh.com/#/add/0x145ad28a42bf334104610f7836d0945dffb6de63/0x382bb369d343125bfb2117af9c149795c6c65c50",
    components: ["ethk", "btck"],
    nativePath: {
      //cherry Router --> [WOKT,USDT,ETHK]
      target: "0x865bfde337C8aFBffF144Ff4C29f9404EBb22b15",
      path: [
        "0x8F8526dbfd6E38E3D8307702cA8469Bae6C56C15",
        "0x382bb369d343125bfb2117af9c149795c6c65c50",
        "0xEF71CA2EE68F45B9Ad6F72fbdb33d707b872315C",
      ],
    },
  },
  rewardTokens: ["bxh"],
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
  startBlock: 6606240, startTimestamp: 1635819569,
  depositToken: {
    addr: "0x8009edebBBdeb4A3BB3003c79877fCd98ec7fB45",
    name: "JSWAP JF/USDT",
    link: "https://app.jswap.finance/#/add/0x382bB369d343125BfB2117af9c149795C6C65C50/0x5fAc926Bf1e638944BB16fb5B787B5bA4BC85b0A",
    components: ["jswap", "usdt"],
    nativePath: {
      //cherry Router --> WOKT, USDT
      target: "0x865bfde337C8aFBffF144Ff4C29f9404EBb22b15",
      path: [
        "0x8F8526dbfd6E38E3D8307702cA8469Bae6C56C15",
        "0x382bb369d343125bfb2117af9c149795c6c65c50",
      ],
    },
  },
  rewardTokens: ["jswap"],
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
  startBlock: 6619152, startTimestamp: 1635870228,
  depositToken: {
    addr: "0x838a7a7f3e16117763c109d98c79ddcd69f6fd6e",
    name: "JSWAP BTCK/USDT",
    link: "https://app.jswap.finance/#/add/0x382bB369d343125BfB2117af9c149795C6C65C50/0x54e4622DC504176b3BB432dCCAf504569699a7fF",
    components: ["btck", "usdt"],
    nativePath: {
      //cherry Router --> WOKT, USDT
      target: "0x865bfde337C8aFBffF144Ff4C29f9404EBb22b15",
      path: [
        "0x8F8526dbfd6E38E3D8307702cA8469Bae6C56C15",
        "0x382bb369d343125bfb2117af9c149795c6c65c50",
      ],
    },
  },
  rewardTokens: ["jswap"],
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
  startBlock: 6619212, startTimestamp: 1635870228,
  depositToken: {
    addr: "0xeb02a695126b998e625394e43dfd26ca4a75ce2b",
    name: "JSWAP ETHK/USDT",
    link: "https://app.jswap.finance/#/add/0x382bB369d343125BfB2117af9c149795C6C65C50/0xEF71CA2EE68F45B9Ad6F72fbdb33d707b872315C",
    components: ["ethk", "usdt"],
    nativePath: {
      //cherry Router --> WOKT, USDT
      target: "0x865bfde337C8aFBffF144Ff4C29f9404EBb22b15",
      path: [
        "0x8F8526dbfd6E38E3D8307702cA8469Bae6C56C15",
        "0x382bb369d343125bfb2117af9c149795c6c65c50",
      ],
    },
  },
  rewardTokens: ["jswap"],
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
  startBlock: 6878063, startTimestamp: 1636903035,
  depositToken: {
    addr: "0xE9313b7dea9cbaBd2df710C25bef44A748Ab38a9",
    name: "JSWAP DAIK/USDT",
    link: "https://app.jswap.finance/#/add/0x21cDE7E32a6CAF4742d00d44B07279e7596d26B9/0x382bB369d343125BfB2117af9c149795C6C65C50",
    components: ["daik", "usdt"],
    nativePath: {
      //cherry Router --> WOKT, USDT
      target: "0x865bfde337C8aFBffF144Ff4C29f9404EBb22b15",
      path: [
        "0x8F8526dbfd6E38E3D8307702cA8469Bae6C56C15",
        "0x382bb369d343125bfb2117af9c149795c6c65c50",
      ],
    },
  },
  rewardTokens: ["jswap"],
  enablement: AssetEnablement.PERMANENTLY_DISABLED,
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
  startBlock: 6878122,  startTimestamp: 1636903035,
  depositToken: {
    addr: "0xa25E1C05c58EDE088159cc3cD24f49445d0BE4b2",
    name: "JSWAP DAIK/USDC",
    link: "https://app.jswap.finance/#/add/0x21cDE7E32a6CAF4742d00d44B07279e7596d26B9/0xc946DAf81b08146B1C7A8Da2A851Ddf2B3EAaf85",
    components: ["daik", "usdc"],
  },
  rewardTokens: ["jswap"],
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

// Moonriver

export const JAR_MOVR_SOLAR_MOVR: JarDefinition = {
  type: AssetType.JAR,
  id: "moonJar 1a",
  contract: "0x55D5BCEf2BFD4921B8790525FF87919c2E26bD03",
  startBlock: 946063, startTimestamp: 1637569560,
  depositToken: {
    addr: "0x7eDA899b3522683636746a2f3a7814e6fFca75e1",
    name: "SOLAR SOLAR/MOVR",
    link: "https://app.solarbeam.io/exchange/add/0x6bD193Ee6D2104F14F94E2cA6efefae561A4334B/ETH",
    components: ["solar", "movr"],
  },
  rewardTokens: ["solar"],
  enablement: AssetEnablement.WITHDRAW_ONLY,
  chain: ChainNetwork.Moonriver,
  protocol: AssetProtocol.SOLARBEAM,
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
  startBlock: 954716, startTimestamp: 1637690646,
  depositToken: {
    addr: "0xFE1b71BDAEE495dCA331D28F5779E87bd32FbE53",
    name: "SOLAR DAI/USDC",
    link: "https://app.solarbeam.io/exchange/add/0x80a16016cc4a2e6a2caca8a4a498b1699ff0f844/0xe3f5a90f9cb311505cd691a46596599aa1a0ad7d",
    components: ["dai", "usdc"],
    nativePath: {
      //SolarRouter02 (SolarBeam)--> [WMOVR, USDC]
      target: "0xAA30eF758139ae4a7f798112902Bf6d65612045f",
      path: [
        "0x98878B06940aE243284CA214f92Bb71a2b032B8A",
        "0xe3f5a90f9cb311505cd691a46596599aa1a0ad7d",
      ],
    },
  },
  rewardTokens: ["solar"],
  enablement: AssetEnablement.PERMANENTLY_DISABLED,
  chain: ChainNetwork.Moonriver,
  protocol: AssetProtocol.SOLARBEAM,
  details: {
    apiKey: "SLP-DAI-USDC",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSOLAR DAI/USDC",
    farmDepositTokenName: "pSOLAR DAI/USDC",
  },
  tags: ["stablecoins"],
};
JAR_DEFINITIONS.push(JAR_MOVR_SOLAR_DAI_USDC);

export const JAR_MOVR_SOLAR_MOVR_USDC: JarDefinition = {
  type: AssetType.JAR,
  id: "moonJar 1c",
  contract: "0x8f32bd87ba00954b9f89296db90ff66183a5dbb1",
  startBlock: 949593, startTimestamp: 1637619228,
  depositToken: {
    addr: "0xe537f70a8b62204832B8Ba91940B77d3f79AEb81",
    name: "SOLAR MOVR/USDC",
    link: "https://app.solarbeam.io/exchange/add/ETH/0xe3f5a90f9cb311505cd691a46596599aa1a0ad7d",
    components: ["movr", "usdc"],
  },
  rewardTokens: ["solar"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Moonriver,
  protocol: AssetProtocol.SOLARBEAM,
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
  startBlock: 950113, startTimestamp: 1637626806,
  depositToken: {
    addr: "0xdb66BE1005f5Fe1d2f486E75cE3C50B52535F886",
    name: "SOLAR SOLAR/USDC",
    link: "https://app.solarbeam.io/exchange/add/0x6bD193Ee6D2104F14F94E2cA6efefae561A4334B/0xe3f5a90f9cb311505cd691a46596599aa1a0ad7d",
    components: ["solar", "usdc"],
    nativePath: {
      //SolarRouter02 (SolarBeam)--> [WMOVR, USDC]
      target: "0xAA30eF758139ae4a7f798112902Bf6d65612045f",
      path: [
        "0x98878B06940aE243284CA214f92Bb71a2b032B8A",
        "0xe3f5a90f9cb311505cd691a46596599aa1a0ad7d",
      ],
    },
  },
  rewardTokens: ["solar"],
  enablement: AssetEnablement.PERMANENTLY_DISABLED,
  chain: ChainNetwork.Moonriver,
  protocol: AssetProtocol.SOLARBEAM,
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
  startBlock: 955172, startTimestamp: 1637697168,
  depositToken: {
    addr: "0x2a44696DDc050f14429bd8a4A05c750C6582bF3b",
    name: "SOLAR USDT/USDC",
    link: "https://app.solarbeam.io/exchange/add/0xB44a9B6905aF7c801311e8F4E76932ee959c663C/0xe3f5a90f9cb311505cd691a46596599aa1a0ad7d",
    components: ["usdt", "usdc"],
    nativePath: {
      //SolarRouter02 (SolarBeam)--> [WMOVR, USDC]
      target: "0xAA30eF758139ae4a7f798112902Bf6d65612045f",
      path: [
        "0x98878B06940aE243284CA214f92Bb71a2b032B8A",
        "0xe3f5a90f9cb311505cd691a46596599aa1a0ad7d",
      ],
    },
  },
  rewardTokens: ["solar"],
  enablement: AssetEnablement.PERMANENTLY_DISABLED,
  chain: ChainNetwork.Moonriver,
  protocol: AssetProtocol.SOLARBEAM,
  details: {
    apiKey: "SLP-USDT-USDC",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSOLAR USDT/USDC",
    farmDepositTokenName: "pSOLAR USDT/USDC",
  },
  tags: ["stablecoins"],
};
JAR_DEFINITIONS.push(JAR_MOVR_SOLAR_USDT_USDC);

export const JAR_MOVR_SOLAR_BUSD_USDC: JarDefinition = {
  type: AssetType.JAR,
  id: "moonJar 1f",
  contract: "0x7F58f167EC834775143Ac8A17BA3c4d6461F99db",
  startBlock: 955281, startTimestamp: 1637698668,
  depositToken: {
    addr: "0x384704557F73fBFAE6e9297FD1E6075FC340dbe5",
    name: "SOLAR BUSD/USDC",
    link: "https://app.solarbeam.io/exchange/add/0x5D9ab5522c64E1F6ef5e3627ECCc093f56167818/0xe3f5a90f9cb311505cd691a46596599aa1a0ad7d",
    components: ["busd", "usdc"],
    nativePath: {
      //SolarRouter02 (SolarBeam)--> [WMOVR, USDC]
      target: "0xAA30eF758139ae4a7f798112902Bf6d65612045f",
      path: [
        "0x98878B06940aE243284CA214f92Bb71a2b032B8A",
        "0xe3f5a90f9cb311505cd691a46596599aa1a0ad7d",
      ],
    },
  },
  rewardTokens: ["solar"],
  enablement: AssetEnablement.PERMANENTLY_DISABLED,
  chain: ChainNetwork.Moonriver,
  protocol: AssetProtocol.SOLARBEAM,
  details: {
    apiKey: "SLP-BUSD-USDC",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSOLAR BUSD/USDC",
    farmDepositTokenName: "pSOLAR BUSD/USDC",
  },
  tags: ["stablecoins"],
};
JAR_DEFINITIONS.push(JAR_MOVR_SOLAR_BUSD_USDC);

export const JAR_MOVR_SOLAR_ETH_USDC: JarDefinition = {
  type: AssetType.JAR,
  id: "moonJar 1g",
  contract: "0x2189F95cff292889B5d1697ef964Ea47d988AB1f",
  startBlock: 955846, startTimestamp: 1637706438,
  depositToken: {
    addr: "0xA0D8DFB2CC9dFe6905eDd5B71c56BA92AD09A3dC",
    name: "SOLAR ETH/USDC",
    link: "https://app.solarbeam.io/exchange/add/0x639A647fbe20b6c8ac19E48E2de44ea792c62c5C/0xe3f5a90f9cb311505cd691a46596599aa1a0ad7d",
    components: ["eth", "usdc"],
    nativePath: {
      //SolarRouter02 (SolarBeam)--> [WMOVR, USDC]
      target: "0xAA30eF758139ae4a7f798112902Bf6d65612045f",
      path: [
        "0x98878B06940aE243284CA214f92Bb71a2b032B8A",
        "0xe3f5a90f9cb311505cd691a46596599aa1a0ad7d",
      ],
    },
  },
  rewardTokens: ["solar"],
  enablement: AssetEnablement.PERMANENTLY_DISABLED,
  chain: ChainNetwork.Moonriver,
  protocol: AssetProtocol.SOLARBEAM,
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
  startBlock: 955906, startTimestamp: 1637707392,
  depositToken: {
    addr: "0xfb1d0D6141Fc3305C63f189E39Cc2f2F7E58f4c2",
    name: "SOLAR BNB/BUSD",
    link: "https://app.solarbeam.io/exchange/add/0x2bF9b864cdc97b08B6D79ad4663e71B8aB65c45c/0x5D9ab5522c64E1F6ef5e3627ECCc093f56167818",
    components: ["bnb", "busd"],
    nativePath: {
      //SolarRouter02 (SolarBeam)--> [WMOVR, BNB]
      target: "0xAA30eF758139ae4a7f798112902Bf6d65612045f",
      path: [
        "0x98878B06940aE243284CA214f92Bb71a2b032B8A",
        "0x2bF9b864cdc97b08B6D79ad4663e71B8aB65c45c",
      ],
    },
  },
  rewardTokens: ["solar"],
  enablement: AssetEnablement.PERMANENTLY_DISABLED,
  chain: ChainNetwork.Moonriver,
  protocol: AssetProtocol.SOLARBEAM,
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
  startBlock: 955968, startTimestamp: 1637708208,
  depositToken: {
    addr: "0x83d7a3fc841038E8c8F46e6192BBcCA8b19Ee4e7",
    name: "SOLAR WBTC/USDC",
    link: "https://app.solarbeam.io/exchange/add/0x6aB6d61428fde76768D7b45D8BFeec19c6eF91A8/0xe3f5a90f9cb311505cd691a46596599aa1a0ad7d",
    components: ["wbtc", "usdc"],
    nativePath: {
      //SolarRouter02 (SolarBeam)--> [WMOVR, USDC]
      target: "0xAA30eF758139ae4a7f798112902Bf6d65612045f",
      path: [
        "0x98878B06940aE243284CA214f92Bb71a2b032B8A",
        "0xe3f5a90f9cb311505cd691a46596599aa1a0ad7d",
      ],
    },
  },
  rewardTokens: ["solar"],
  enablement: AssetEnablement.PERMANENTLY_DISABLED,
  chain: ChainNetwork.Moonriver,
  protocol: AssetProtocol.SOLARBEAM,
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
  startBlock: 956046, startTimestamp: 1637709228,
  depositToken: {
    addr: "0xb9a61ac826196AbC69A3C66ad77c563D6C5bdD7b",
    name: "SOLAR AVAX/MOVR",
    link: "https://app.solarbeam.io/exchange/add/0x14a0243C333A5b238143068dC3A7323Ba4C30ECB/ETH",
    components: ["avax", "movr"],
  },
  rewardTokens: ["solar"],
  enablement: AssetEnablement.PERMANENTLY_DISABLED,
  chain: ChainNetwork.Moonriver,
  protocol: AssetProtocol.SOLARBEAM,
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
  startBlock: 956096, startTimestamp: 1637709984,
  depositToken: {
    addr: "0x55Ee073B38BF1069D5F1Ed0AA6858062bA42F5A9",
    name: "SOLAR MAI/USDC",
    link: "https://app.solarbeam.io/exchange/add/0x7f5a79576620C046a293F54FFCdbd8f2468174F1/0xe3f5a90f9cb311505cd691a46596599aa1a0ad7d",
    components: ["mai", "usdc"],
    nativePath: {
      //SolarRouter02 (SolarBeam)--> [WMOVR, USDC]
      target: "0xAA30eF758139ae4a7f798112902Bf6d65612045f",
      path: [
        "0x98878B06940aE243284CA214f92Bb71a2b032B8A",
        "0xe3f5a90f9cb311505cd691a46596599aa1a0ad7d",
      ],
    },
  },
  rewardTokens: ["solar"],
  enablement: AssetEnablement.PERMANENTLY_DISABLED,
  chain: ChainNetwork.Moonriver,
  protocol: AssetProtocol.SOLARBEAM,
  details: {
    apiKey: "SLP-MAI-USDC",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSOLAR MAI/USDC",
    farmDepositTokenName: "pSOLAR MAI/USDC",
  },
  tags: ["stablecoins"],
};
JAR_DEFINITIONS.push(JAR_MOVR_SOLAR_MAI_USDC);

export const JAR_MOVR_SOLAR_MIM_USDC: JarDefinition = {
  type: AssetType.JAR,
  id: "moonJar 1l",
  contract: "0x826a9cD66A20Ff4c2dC7AAcfa3e413dfee6a71E4",
  startBlock: 956704, startTimestamp: 1637718360,
  depositToken: {
    addr: "0x9051fB701d6D880800e397e5B5d46FdDfAdc7056",
    name: "SOLAR MIM/USDC",
    link: "https://app.solarbeam.io/exchange/add/0x0caE51e1032e8461f4806e26332c030E34De3aDb/0xe3f5a90f9cb311505cd691a46596599aa1a0ad7d",
    components: ["mim", "usdc"],
    nativePath: {
      //SolarRouter02 (SolarBeam)--> [WMOVR, USDC]
      target: "0xAA30eF758139ae4a7f798112902Bf6d65612045f",
      path: [
        "0x98878B06940aE243284CA214f92Bb71a2b032B8A",
        "0xe3f5a90f9cb311505cd691a46596599aa1a0ad7d",
      ],
    },
  },
  rewardTokens: ["solar"],
  enablement: AssetEnablement.PERMANENTLY_DISABLED,
  chain: ChainNetwork.Moonriver,
  protocol: AssetProtocol.SOLARBEAM,
  details: {
    apiKey: "SLP-MIM-USDC",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSOLAR MIM/USDC",
    farmDepositTokenName: "pSOLAR MIM/USDC",
  },
  tags: ["stablecoins"],
};
JAR_DEFINITIONS.push(JAR_MOVR_SOLAR_MIM_USDC);

export const JAR_MOVR_SOLAR_MOVR_FTM: JarDefinition = {
  type: AssetType.JAR,
  id: "moonJar 1m",
  contract: "0x99865c1c45D111801A93342A3B61132d7B97b12D",
  startBlock: 961182, startTimestamp: 1637782158,
  depositToken: {
    addr: "0x1eebed8F28A6865a76D91189FD6FC45F4F774d67",
    name: "SOLAR MOVR/FTM",
    link: "https://app.solarbeam.io/exchange/add/ETH/0xaD12daB5959f30b9fF3c2d6709f53C335dC39908",
    components: ["movr", "ftm"],
  },
  rewardTokens: ["solar"],
  enablement: AssetEnablement.PERMANENTLY_DISABLED,
  chain: ChainNetwork.Moonriver,
  protocol: AssetProtocol.SOLARBEAM,
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
  startBlock: 961317, startTimestamp: 1637784024,
  depositToken: {
    addr: "0x0acDB54E610dAbC82b8FA454b21AD425ae460DF9",
    name: "SOLAR MOVR/RIB",
    link: "https://app.solarbeam.io/exchange/add/ETH/0xbD90A6125a84E5C512129D622a75CDDE176aDE5E",
    components: ["movr", "rib"],
  },
  rewardTokens: ["solar"],
  enablement: AssetEnablement.WITHDRAW_ONLY,
  chain: ChainNetwork.Moonriver,
  protocol: AssetProtocol.SOLARBEAM,
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
  startBlock: 961547, startTimestamp: 1637787090,
  depositToken: {
    addr: "0x9e0d90ebB44c22303Ee3d331c0e4a19667012433",
    name: "SOLAR MOVR/RELAY",
    link: "https://app.solarbeam.io/exchange/add/ETH/0xAd7F1844696652ddA7959a49063BfFccafafEfe7",
    components: ["movr", "relay"],
  },
  rewardTokens: ["solar"],
  enablement: AssetEnablement.PERMANENTLY_DISABLED,
  chain: ChainNetwork.Moonriver,
  protocol: AssetProtocol.SOLARBEAM,
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
  startBlock: 961688, startTimestamp: 1637788962,
  depositToken: {
    addr: "0xf9b7495b833804e4d894fC5f7B39c10016e0a911",
    name: "SOLAR SOLAR/RIB",
    link: "https://app.solarbeam.io/exchange/add/0x6bD193Ee6D2104F14F94E2cA6efefae561A4334B/0xbD90A6125a84E5C512129D622a75CDDE176aDE5E",
    components: ["solar", "rib"],
    nativePath: {
      //SolarRouter02 (SolarBeam)--> [WMOVR, SOLAR]
      target: "0xAA30eF758139ae4a7f798112902Bf6d65612045f",
      path: [
        "0x98878B06940aE243284CA214f92Bb71a2b032B8A",
        "0x6bD193Ee6D2104F14F94E2cA6efefae561A4334B",
      ],
    },
  },
  rewardTokens: ["solar"],
  enablement: AssetEnablement.PERMANENTLY_DISABLED,
  chain: ChainNetwork.Moonriver,
  protocol: AssetProtocol.SOLARBEAM,
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
  startBlock: 961830, startTimestamp: 1637791050,
  depositToken: {
    addr: "0x9f9a7a3f8F56AFB1a2059daE1E978165816cea44",
    name: "SOLAR PETS/MOVR",
    link: "https://app.solarbeam.io/exchange/add/0x1e0F2A75Be02c025Bd84177765F89200c04337Da/ETH",
    components: ["pets", "movr"],
  },
  rewardTokens: ["solar"],
  enablement: AssetEnablement.PERMANENTLY_DISABLED,
  chain: ChainNetwork.Moonriver,
  protocol: AssetProtocol.SOLARBEAM,
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
  startBlock: 995445, startTimestamp: 1638292692,
  depositToken: {
    addr: "0x2cc54b4A3878e36E1C754871438113C1117a3ad7",
    name: "SOLAR FRAX/MOVR",
    link: "https://app.solarbeam.io/exchange/add/0x1A93B23281CC1CDE4C4741353F3064709A16197d/ETH",
    components: ["frax", "movr"],
  },
  rewardTokens: ["solar"],
  enablement: AssetEnablement.PERMANENTLY_DISABLED,
  chain: ChainNetwork.Moonriver,
  protocol: AssetProtocol.SOLARBEAM,
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
  startBlock: 995536, startTimestamp: 1638294330,
  depositToken: {
    addr: "0x9432B25fBD8a37e5A1300e36a96BD14E1E6f5c90",
    name: "SOLAR MIM/MOVR",
    link: "https://app.solarbeam.io/exchange/add/0x0caE51e1032e8461f4806e26332c030E34De3aDb/ETH",
    components: ["mim", "movr"],
  },
  rewardTokens: ["solar"],
  enablement: AssetEnablement.PERMANENTLY_DISABLED,
  chain: ChainNetwork.Moonriver,
  protocol: AssetProtocol.SOLARBEAM,
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
  startBlock: 995601, startTimestamp: 1638295638,
  depositToken: {
    addr: "0xBe2aBe58eDAae96B4303F194d2fAD5233BaD3d87",
    name: "SOLAR BNB/MOVR",
    link: "https://app.solarbeam.io/exchange/add/0x2bF9b864cdc97b08B6D79ad4663e71B8aB65c45c/ETH",
    components: ["bnb", "movr"],
  },
  rewardTokens: ["solar"],
  enablement: AssetEnablement.PERMANENTLY_DISABLED,
  chain: ChainNetwork.Moonriver,
  protocol: AssetProtocol.SOLARBEAM,
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
  startBlock: 952413, startTimestamp: 1637658078,
  depositToken: {
    addr: "0x0d171b55fC8d3BDDF17E376FdB2d90485f900888",
    name: "SOLAR ETH/MOVR",
    link: "https://app.solarbeam.io/exchange/add/0x639A647fbe20b6c8ac19E48E2de44ea792c62c5C/ETH",
    components: ["eth", "movr"],
  },
  rewardTokens: ["solar"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Moonriver,
  protocol: AssetProtocol.SOLARBEAM,
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

export const JAR_MOVR_FINN_DOT_FINN: JarDefinition = {
  type: AssetType.JAR,
  id: "moonJar 2a",
  contract: "0x855bfF6456f42643b2b64c767Ce1398C3fF6304B",
  startBlock: 1424435, startTimestamp: 1643833608,
  depositToken: {
    addr: "0xF09211fb5eD5019b072774cfD7Db0c9f4ccd5Be0",
    name: "FINN DOT/FINN",
    link: "https://www.huckleberry.finance/#/add/0x15B9CA9659F5dfF2b7d35a98dd0790a3CBb3D445/0x9A92B5EBf1F6F6f7d93696FCD44e5Cf75035A756",
    components: ["dot", "finn"],
    nativePath: {
      //HuckleberryRouter (Huckleberry)--> [WMOVR, FINN]
      target: "0x2d4e873f9Ab279da9f1bb2c532d4F06f67755b77",
      path: [
        "0x98878B06940aE243284CA214f92Bb71a2b032B8A",
        "0x9A92B5EBf1F6F6f7d93696FCD44e5Cf75035A756",
      ],
    },
  },
  rewardTokens: ["finn"],
  enablement: AssetEnablement.PERMANENTLY_DISABLED,
  chain: ChainNetwork.Moonriver,
  protocol: AssetProtocol.FINN,
  details: {
    apiKey: "FLP-DOT-FINN",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pFINN DOT/FINN",
    farmDepositTokenName: "pFINN DOT/FINN",
  },
};
JAR_DEFINITIONS.push(JAR_MOVR_FINN_DOT_FINN);

export const JAR_MOVR_FINN_FINN_KSM: JarDefinition = {
  type: AssetType.JAR,
  id: "moonJar 2b",
  contract: "0x6F94461bDfe75802e819EF8AeFDD3503388b6fbd",
  startBlock: 1424443, startTimestamp: 1643833728,
  depositToken: {
    addr: "0x14BE4d09c5A8237403b83A8A410bAcE16E8667DC",
    name: "FINN FINN/KSM",
    link: "https://www.huckleberry.finance/#/add/0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080/0x9A92B5EBf1F6F6f7d93696FCD44e5Cf75035A756",
    components: ["finn", "stksm"],
  },
  rewardTokens: ["finn"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Moonriver,
  protocol: AssetProtocol.FINN,
  details: {
    apiKey: "FLP-FINN-KSM",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pFINN FINN/KSM",
    farmDepositTokenName: "pFINN FINN/KSM",
  },
};
JAR_DEFINITIONS.push(JAR_MOVR_FINN_FINN_KSM);

export const JAR_MOVR_FINN_FINN_RMRK: JarDefinition = {
  type: AssetType.JAR,
  id: "moonJar 2c",
  contract: "0xd14802ED86328e88E068F356fA1a98A95C759A8B",
  startBlock: 1424449, startTimestamp: 1643833806,
  depositToken: {
    addr: "0xd9e98aD7AE9E5612b90cd0bdcD82df4FA5b943b8",
    name: "FINN FINN/RMRK",
    link: "https://www.huckleberry.finance/#/add/0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080/0x9A92B5EBf1F6F6f7d93696FCD44e5Cf75035A756",
    components: ["finn", "rmrk"],
  },
  rewardTokens: ["finn"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Moonriver,
  protocol: AssetProtocol.FINN,
  details: {
    apiKey: "FLP-FINN-RMRK",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pFINN FINN/RMRK",
    farmDepositTokenName: "pFINN FINN/RMRK",
  },
};
JAR_DEFINITIONS.push(JAR_MOVR_FINN_FINN_RMRK);

export const JAR_MOVR_FINN_MOVR_FINN: JarDefinition = {
  type: AssetType.JAR,
  id: "moonJar 2d",
  contract: "0x589FFC81e4803017ED0d0169B3C61C04BC4a3B76",
  startBlock: 1424486, startTimestamp: 1643834328,
  depositToken: {
    addr: "0xbBe2f34367972Cb37ae8dea849aE168834440685",
    name: "FINN MOVR/FINN",
    link: "https://www.huckleberry.finance/#/add/MOVR/0x9A92B5EBf1F6F6f7d93696FCD44e5Cf75035A756",
    components: ["movr", "finn"],
  },
  rewardTokens: ["finn"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Moonriver,
  protocol: AssetProtocol.FINN,
  details: {
    apiKey: "FLP-MOVR-FINN",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pFINN MOVR/FINN",
    farmDepositTokenName: "pFINN MOVR/FINN",
  },
};
JAR_DEFINITIONS.push(JAR_MOVR_FINN_MOVR_FINN);

export const JAR_MOVR_FINN_USDC_MOVR: JarDefinition = {
  type: AssetType.JAR,
  id: "moonJar 2e",
  contract: "0x4f02273EAF4a71e53C81f9d50bd89D3Beaf0F3e9",
  startBlock: 1424496, startTimestamp: 1643834460,
  depositToken: {
    addr: "0x7128C61Da34c27eAD5419B8EB50c71CE0B15CD50",
    name: "FINN USDC/MOVR",
    link: "https://www.huckleberry.finance/#/add/0x748134b5F553F2bcBD78c6826De99a70274bDEb3/MOVR",
    components: ["usdc-2", "movr"],
  },
  rewardTokens: ["finn"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Moonriver,
  protocol: AssetProtocol.FINN,
  details: {
    apiKey: "FLP-USDC-MOVR",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pFINN USDC/MOVR",
    farmDepositTokenName: "pFINN USDC/MOVR",
  },
};
JAR_DEFINITIONS.push(JAR_MOVR_FINN_USDC_MOVR);

export const JAR_MOVR_SOLAR_STKSM_XCKSM: JarDefinition = {
  type: AssetType.JAR,
  id: "moonJar 1v",
  contract: "0x65C65bD644eC631ef800A05397548cB25Cb8AC90",
  startBlock: 1890360, startTimestamp: 1653420174,
  depositToken: {
    addr: "0x493147C85Fe43F7B056087a6023dF32980Bcb2D1",
    name: "SOLAR STKSM/XCKSM",
    link: "https://app.solarbeam.io/exchange/stable-pool/add/stksm",
    components: ["stksm", "xcksm"],
  },
  rewardTokens: ["solar", "movr", "ldo"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Moonriver,
  protocol: AssetProtocol.SOLARBEAM,
  details: {
    apiKey: "SLP-STKSM-XCKSM",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xf34514260f18bDB3ED1142b69A6055F51089AC7D",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSOLAR STKSM/XCKSM",
    farmDepositTokenName: "pSOLAR STKSM/XCKSM",
  },
};
JAR_DEFINITIONS.push(JAR_MOVR_SOLAR_STKSM_XCKSM);

//Cronos

export const JAR_CRO_VVS_CRO_BIFI: JarDefinition = {
  type: AssetType.JAR,
  id: "croJar 1a",
  contract: "0xF125357f05c75F9beEA0Cc721D7a2A0eA03aaa63",
  startBlock: 454767, startTimestamp: 1638894300,
  depositToken: {
    addr: "0x1803E360393A472beC6E1A688BDF7048d3076b1A",
    name: "VVS CRO/BIFI",
    link: "https://vvs.finance/add/0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23/0xe6801928061CDbE32AC5AD0634427E140EFd05F9",
    components: ["cro", "bifi"],
  },
  rewardTokens: ["vvs"],
  enablement: AssetEnablement.WITHDRAW_ONLY,
  chain: ChainNetwork.Cronos,
  protocol: AssetProtocol.VVS,
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
  startBlock: 456990, startTimestamp: 1638907212,
  depositToken: {
    addr: "0x3Eb9FF92e19b73235A393000C176c8bb150F1B20",
    name: "VVS CRO/DAI",
    link: "https://vvs.finance/add/0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23/0xF2001B145b43032AAF5Ee2884e456CCd805F677D",
    components: ["cro", "dai"],
  },
  rewardTokens: ["vvs"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Cronos,
  protocol: AssetProtocol.VVS,
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

export const JAR_CRO_VVS_CRO_ETH: JarDefinition = {
  type: AssetType.JAR,
  id: "croJar 1c",
  contract: "0x55D5BCEf2BFD4921B8790525FF87919c2E26bD03",
  startBlock: 450727, startTimestamp: 1638871139,
  depositToken: {
    addr: "0xA111C17f8B8303280d3EB01BBcd61000AA7F39F9",
    name: "VVS CRO/ETH",
    link: "https://vvs.finance/add/CRO/0xe44Fd7fCb2b1581822D0c862B68222998a0c299a",
    components: ["cro", "weth"],
  },
  rewardTokens: ["vvs"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Cronos,
  protocol: AssetProtocol.VVS,
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

export const JAR_CRO_VVS_CRO_SHIB: JarDefinition = {
  type: AssetType.JAR,
  id: "croJar 1d",
  contract: "0x5a10B857Fb05Ce8E71440CA063AEb504AeDE5535",
  startBlock: 457108, startTimestamp: 1638907897,
  depositToken: {
    addr: "0xc9eA98736dbC94FAA91AbF9F4aD1eb41e7fb40f4",
    name: "VVS CRO/SHIB",
    link: "https://vvs.finance/add/0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23/0xbED48612BC69fA1CaB67052b42a95FB30C1bcFee",
    components: ["cro", "shib"],
  },
  rewardTokens: ["vvs"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Cronos,
  protocol: AssetProtocol.VVS,
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
  startBlock: 457270, startTimestamp: 1638908835,
  depositToken: {
    addr: "0xe61Db569E231B3f5530168Aa2C9D50246525b6d6",
    name: "VVS CRO/USDC",
    link: "https://vvs.finance/add/0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23/0xc21223249CA28397B4B6541dfFaEcC539BfF0c59",
    components: ["cro", "usdc"],
  },
  rewardTokens: ["vvs"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Cronos,
  protocol: AssetProtocol.VVS,
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
  startBlock: 457371, startTimestamp: 1638909421,
  depositToken: {
    addr: "0x3d2180DB9E1B909f35C398BC39EF36108C0FC8c3",
    name: "VVS CRO/USDT",
    link: "https://vvs.finance/add/0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23/0x66e428c3f67a68878562e79A0234c1F83c208770",
    components: ["cro", "usdt"],
  },
  rewardTokens: ["vvs"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Cronos,
  protocol: AssetProtocol.VVS,
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
  startBlock: 457592, startTimestamp: 1638910708,
  depositToken: {
    addr: "0x814920D1b8007207db6cB5a2dD92bF0b082BDBa1",
    name: "VVS VVS/USDC",
    link: "https://vvs.finance/add/0x2D03bECE6747ADC00E1a131BBA1469C15fD11e03/0xc21223249CA28397B4B6541dfFaEcC539BfF0c59",
    components: ["vvs", "usdc"],
    nativePath: {
      //VVSRouter --> CRO, VVS
      target: "0x145863Eb42Cf62847A6Ca784e6416C1682b1b2Ae",
      path: [
        "0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23",
        "0x2D03bECE6747ADC00E1a131BBA1469C15fD11e03",
      ],
    },
  },
  rewardTokens: ["vvs"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Cronos,
  protocol: AssetProtocol.VVS,
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
  startBlock: 457657, startTimestamp: 1638911083,
  depositToken: {
    addr: "0x280aCAD550B2d3Ba63C8cbff51b503Ea41a1c61B",
    name: "VVS VVS/USDT",
    link: "https://vvs.finance/add/0x2D03bECE6747ADC00E1a131BBA1469C15fD11e03/0x66e428c3f67a68878562e79A0234c1F83c208770",
    components: ["vvs", "usdt"],
    nativePath: {
      //VVSRouter --> CRO, VVS
      target: "0x145863Eb42Cf62847A6Ca784e6416C1682b1b2Ae",
      path: [
        "0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23",
        "0x2D03bECE6747ADC00E1a131BBA1469C15fD11e03",
      ],
    },
  },
  rewardTokens: ["vvs"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Cronos,
  protocol: AssetProtocol.VVS,
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
  startBlock: 457455, startTimestamp: 1638909910,
  depositToken: {
    addr: "0xbf62c67eA509E86F07c8c69d0286C0636C50270b",
    name: "VVS CRO/VVS",
    link: "https://vvs.finance/add/0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23/0x2D03bECE6747ADC00E1a131BBA1469C15fD11e03",
    components: ["cro", "vvs"],
  },
  rewardTokens: ["vvs"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Cronos,
  protocol: AssetProtocol.VVS,
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
  startBlock: 456815, startTimestamp: 1638906201,
  depositToken: {
    addr: "0x8F09fFf247B8fDB80461E5Cf5E82dD1aE2EBd6d7",
    name: "VVS CRO/BTC",
    link: "https://vvs.finance/add/0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23/0x062E66477Faf219F25D27dCED647BF57C3107d52",
    components: ["cro", "btc"],
  },
  rewardTokens: ["vvs"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Cronos,
  protocol: AssetProtocol.VVS,
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
  startBlock: 457531, startTimestamp: 1638910353,
  depositToken: {
    addr: "0x39cC0E14795A8e6e9D02A21091b81FE0d61D82f9",
    name: "VVS USDC/USDT",
    link: "https://vvs.finance/add/0xc21223249CA28397B4B6541dfFaEcC539BfF0c59/0x66e428c3f67a68878562e79A0234c1F83c208770",
    components: ["usdc", "usdt"],
  },
  rewardTokens: ["vvs"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Cronos,
  protocol: AssetProtocol.VVS,
  details: {
    apiKey: "VLP-USDC-USDT",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pVVS USDC/USDT",
    farmDepositTokenName: "pVVS USDC/USDT",
  },
  tags: ["stablecoins"],
};
JAR_DEFINITIONS.push(JAR_CRO_VVS_USDC_USDT);

export const JAR_CRO_VVS_CRO_DOGE: JarDefinition = {
  type: AssetType.JAR,
  id: "croJar 1l",
  contract: "0x17ad0E59D16aA8c70E703fd83D7D05d7952da50f",
  startBlock: 1922674, startTimestamp: 1647407673,
  depositToken: {
    addr: "0x2A560f2312CB56327AD5D65a03F1bfEC10b62075",
    name: "VVS CRO/DOGE",
    link: "https://vvs.finance/add/CRO/0x1a8E39ae59e5556B56b76fCBA98d22c9ae557396",
    components: ["cro", "doge"],
  },
  rewardTokens: ["vvs"],
  enablement: AssetEnablement.DEV,
  chain: ChainNetwork.Cronos,
  protocol: AssetProtocol.VVS,
  details: {
    apiKey: "VLP-CRO-DOGE",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pVVS CRO/DOGE",
    farmDepositTokenName: "pVVS CRO/DOGE",
  },
};
JAR_DEFINITIONS.push(JAR_CRO_VVS_CRO_DOGE);

export const JAR_CRO_VVS_CRO_ATOM: JarDefinition = {
  type: AssetType.JAR,
  id: "croJar 1m",
  contract: "0x9365AfC6522ADF40AfEB83bad8EaeA0aB56e6264",
  startBlock: 1922786, startTimestamp: 1647408326,
  depositToken: {
    addr: "0x9e5bd780dff875Dd85848a65549791445AE25De0",
    name: "VVS CRO/ATOM",
    link: "https://vvs.finance/add/CRO/0xB888d8Dd1733d72681b30c00ee76BDE93ae7aa93",
    components: ["cro", "atom"],
  },
  rewardTokens: ["vvs"],
  enablement: AssetEnablement.DEV,
  chain: ChainNetwork.Cronos,
  protocol: AssetProtocol.VVS,
  details: {
    apiKey: "VLP-CRO-ATOM",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pVVS CRO/ATOM",
    farmDepositTokenName: "pVVS CRO/ATOM",
  },
};
JAR_DEFINITIONS.push(JAR_CRO_VVS_CRO_ATOM);

export const JAR_CRO_VVS_CRO_TONIC: JarDefinition = {
  type: AssetType.JAR,
  id: "croJar 1n",
  contract: "0x60Ad579Fb20c8896b7b98E800cBA9e196E6eaA44",
  startBlock: 1923066, startTimestamp: 1647409950,
  depositToken: {
    addr: "0x4B377121d968Bf7a62D51B96523d59506e7c2BF0",
    name: "VVS CRO/TONIC",
    link: "https://vvs.finance/add/CRO/0xDD73dEa10ABC2Bff99c60882EC5b2B81Bb1Dc5B2",
    components: ["cro", "tonic"],
  },
  rewardTokens: ["vvs"],
  enablement: AssetEnablement.DEV,
  chain: ChainNetwork.Cronos,
  protocol: AssetProtocol.VVS,
  details: {
    apiKey: "VLP-CRO-TONIC",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pVVS CRO/TONIC",
    farmDepositTokenName: "pVVS CRO/TONIC",
  },
};
JAR_DEFINITIONS.push(JAR_CRO_VVS_CRO_TONIC);

export const JAR_CRO_VVS_VVS_SINGLE: JarDefinition = {
  type: AssetType.JAR,
  id: "croJar 1o",
  contract: "0xb1bcBC1B4F7E2B8288134a12b6F2d0193E9ac100",
  startBlock: 1923126, startTimestamp: 1647410301,
  depositToken: {
    addr: "0x6f72a3f6dB6F486B50217f6e721f4388994B1FBe",
    name: "VVS VVS/SINGLE",
    link: "https://vvs.finance/add/0x2D03bECE6747ADC00E1a131BBA1469C15fD11e03/0x0804702a4E749d39A35FDe73d1DF0B1f1D6b8347",
    components: ["vvs", "single"],
  },
  rewardTokens: ["vvs"],
  enablement: AssetEnablement.DEV,
  chain: ChainNetwork.Cronos,
  protocol: AssetProtocol.VVS,
  details: {
    apiKey: "VLP-VVS-SINGLE",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pVVS VVS/SINGLE",
    farmDepositTokenName: "pVVS VVS/SINGLE",
  },
};
JAR_DEFINITIONS.push(JAR_CRO_VVS_VVS_SINGLE);

export const JAR_CRO_VVS_USDC_SINGLE: JarDefinition = {
  type: AssetType.JAR,
  id: "croJar 1p",
  contract: "0xb96cc3948d32f28AA48bf66E800027a224785868",
  startBlock: 1923629, startTimestamp: 1647413216,
  depositToken: {
    addr: "0x0fBAB8A90CAC61b481530AAd3a64fE17B322C25d",
    name: "VVS USDC/SINGLE",
    link: "https://vvs.finance/add/0xc21223249CA28397B4B6541dfFaEcC539BfF0c59/0x0804702a4E749d39A35FDe73d1DF0B1f1D6b8347",
    components: ["usdc", "single"],
  },
  rewardTokens: ["vvs"],
  enablement: AssetEnablement.DEV,
  chain: ChainNetwork.Cronos,
  protocol: AssetProtocol.VVS,
  details: {
    apiKey: "VLP-USDC-SINGLE",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pVVS USDC/SINGLE",
    farmDepositTokenName: "pVVS USDC/SINGLE",
  },
};
JAR_DEFINITIONS.push(JAR_CRO_VVS_USDC_SINGLE);

export const JAR_CRO_VVS_VVS_TONIC: JarDefinition = {
  type: AssetType.JAR,
  id: "croJar 1q",
  contract: "0xBC1Ad38ef7261A15F519b73F868E0b852c6465B7",
  startBlock: 1923837, startTimestamp: 1647414422,
  depositToken: {
    addr: "0xA922530960A1F94828A7E132EC1BA95717ED1eab",
    name: "VVS VVS/TONIC",
    link: "https://vvs.finance/add/0x2D03bECE6747ADC00E1a131BBA1469C15fD11e03/0xDD73dEa10ABC2Bff99c60882EC5b2B81Bb1Dc5B2",
    components: ["vvs", "tonic"],
  },
  rewardTokens: ["vvs", "tonic"],
  enablement: AssetEnablement.DEV,
  chain: ChainNetwork.Cronos,
  protocol: AssetProtocol.VVS,
  details: {
    apiKey: "VLP-VVS-TONIC",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pVVS VVS/TONIC",
    farmDepositTokenName: "pVVS VVS/TONIC",
  },
};
JAR_DEFINITIONS.push(JAR_CRO_VVS_VVS_TONIC);

export const JAR_CRO_TECTONIC_WETH: JarDefinition = {
  type: AssetType.JAR,
  id: "croJar 2a",
  contract: "0xeC15DA7019C3d0C91E9e36d1adBa22357AF732C3",
  startBlock: 1954028, startTimestamp: 1647591201,
  depositToken: {
    addr: "0xe44Fd7fCb2b1581822D0c862B68222998a0c299a",
    name: "Tectonic WETH",
    link: "https://cronoscan.com/address/0xe44fd7fcb2b1581822d0c862b68222998a0c299a",
    components: ["weth"],
  },
  rewardTokens: ["tonic"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Cronos,
  protocol: AssetProtocol.TECTONIC,
  details: {
    apiKey: "TECTONIC-WETH",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  docsKey: SINGLE_FOLDING_ANY_PROTOCOL_DESCRIPTION,
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pTectonic WETH",
    farmDepositTokenName: "pTectonic WETH",
  },
};
JAR_DEFINITIONS.push(JAR_CRO_TECTONIC_WETH);

export const JAR_CRO_TECTONIC_CRO: JarDefinition = {
  type: AssetType.JAR,
  id: "croJar 2b",
  contract: "0x6fe9d20f64723cb714e0ae90293c6dba7ee23db9",
  startBlock: 2026209, startTimestamp: 1648014833,
  depositToken: {
    addr: "0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23",
    name: "Tectonic CRO",
    link: "https://cronoscan.com/address/0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23",
    components: ["cro"],
  },
  rewardTokens: ["tonic"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Cronos,
  protocol: AssetProtocol.TECTONIC,
  details: {
    apiKey: "TECTONIC-CRO",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  docsKey: SINGLE_FOLDING_ANY_PROTOCOL_DESCRIPTION,
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pTectonic CRO",
    farmDepositTokenName: "pTectonic CRO",
  },
};
JAR_DEFINITIONS.push(JAR_CRO_TECTONIC_CRO);

// Aurora

export const JAR_AURORA_TRI_NEAR_USDC: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 1a",
  contract: "0xbD59171dA1c3a2624D60421bcb6c3c3270111656",
  startBlock: 54665671, startTimestamp: 1639005869,
  depositToken: {
    addr: "0x20F8AeFB5697B77E0BB835A8518BE70775cdA1b0",
    name: "TRI NEAR/USDC",
    link: "https://www.trisolaris.io/#/add/0xB12BFcA5A55806AaF64E99521918A4bf0fC40802/0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d",
    components: ["near", "usdc"],
    nativePath: {
      //UniswapV2Router02 (Trisolaris)--> [WETH, NEAR]
      target: "0x2CB45Edb4517d5947aFdE3BEAbF95A582506858B",
      path: [
        "0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB",
        "0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d",
      ],
    },
  },
  rewardTokens: ["tri", "aurora"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.TRISOLARIS,
  details: {
    apiKey: "TLP-NEAR-USDC",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pTLP NEAR/USDC",
    farmDepositTokenName: "pTLP NEAR/USDC",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_TRI_NEAR_USDC);

export const JAR_AURORA_TRI_NEAR_ETH: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 1b",
  contract: "0xF623c32828B40c89D5cf114A7186c6B8b25De4Ed",
  startBlock: 54735587, startTimestamp: 1639077256,
  depositToken: {
    addr: "0x63da4DB6Ef4e7C62168aB03982399F9588fCd198",
    name: "TRI NEAR/ETH",
    link: "https://www.trisolaris.io/#/add/0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d/ETH",
    components: ["near", "eth"],
  },
  rewardTokens: ["tri"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.TRISOLARIS,
  details: {
    apiKey: "TLP-NEAR-ETH",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pTLP NEAR/ETH",
    farmDepositTokenName: "pTLP NEAR/ETH",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_TRI_NEAR_ETH);

export const JAR_AURORA_TRI_NEAR_USDT: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 1c",
  contract: "0xfc258cF7f1bf3739A04992D1c790aF20d60f44E9",
  startBlock: 54736703, startTimestamp: 1639078412,
  depositToken: {
    addr: "0x03B666f3488a7992b2385B12dF7f35156d7b29cD",
    name: "TRI NEAR/USDT",
    link: "https://www.trisolaris.io/#/add/0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d/0x4988a896b1227218e4A686fdE5EabdcAbd91571f",
    components: ["near", "usdt"],
    nativePath: {
      //UniswapV2Router02 (Trisolaris)--> [WETH, NEAR]
      target: "0x2CB45Edb4517d5947aFdE3BEAbF95A582506858B",
      path: [
        "0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB",
        "0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d",
      ],
    },
  },
  rewardTokens: ["tri", "aurora"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.TRISOLARIS,
  details: {
    apiKey: "TLP-NEAR-USDT",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pTLP NEAR/USDT",
    farmDepositTokenName: "pTLP NEAR/USDT",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_TRI_NEAR_USDT);

export const JAR_AURORA_TRI_NEAR_TRI: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 1d",
  contract: "0x1E686d65031Ac75754Cd6AeAb5B71ac2257c6a9D",
  startBlock: 54737072, startTimestamp: 1639078788,
  depositToken: {
    addr: "0x84b123875F0F36B966d0B6Ca14b31121bd9676AD",
    name: "TRI NEAR/TRI",
    link: "https://www.trisolaris.io/#/add/0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d/0xFa94348467f64D5A457F75F8bc40495D33c65aBB",
    components: ["near", "tri"],
    nativePath: {
      //UniswapV2Router02 (Trisolaris)--> [WETH, NEAR]
      target: "0x2CB45Edb4517d5947aFdE3BEAbF95A582506858B",
      path: [
        "0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB",
        "0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d",
      ],
    },
  },
  rewardTokens: ["tri"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.TRISOLARIS,
  details: {
    apiKey: "TLP-NEAR-TRI",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pTLP NEAR/TRI",
    farmDepositTokenName: "pTLP NEAR/TRI",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_TRI_NEAR_TRI);

export const JAR_AURORA_TRI_USDT_USDC: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 1e",
  contract: "0x023d4874f30292b24512b969dC8dc8A3227d2012",
  startBlock: 54737828, startTimestamp: 1639079560,
  depositToken: {
    addr: "0x2fe064B6c7D274082aa5d2624709bC9AE7D16C77",
    name: "TRI USDT/USDC",
    link: "https://www.trisolaris.io/#/add/0x4988a896b1227218e4A686fdE5EabdcAbd91571f/0xB12BFcA5A55806AaF64E99521918A4bf0fC40802",
    components: ["usdt", "usdc"],
    nativePath: {
      //UniswapV2Router02 (Trisolaris)--> [WETH, USDC]
      target: "0x2CB45Edb4517d5947aFdE3BEAbF95A582506858B",
      path: [
        "0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB",
        "0xB12BFcA5A55806AaF64E99521918A4bf0fC40802",
      ],
    },
  },
  rewardTokens: ["tri"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.TRISOLARIS,
  details: {
    apiKey: "TLP-USDT-USDC",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pTLP USDT/USDC",
    farmDepositTokenName: "pTLP USDT/USDC",
  },
  tags: ["stablecoins"],
};
JAR_DEFINITIONS.push(JAR_AURORA_TRI_USDT_USDC);

export const JAR_AURORA_TRI_BTC_NEAR: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 1f",
  contract: "0xF49803dB604E118f3aFCF44beB0012f3c6684F05",
  startBlock: 54735839, startTimestamp: 1639077513,
  depositToken: {
    addr: "0xbc8A244e8fb683ec1Fd6f88F3cc6E565082174Eb",
    name: "TRI BTC/NEAR",
    link: "https://www.trisolaris.io/#/add/0xF4eB217Ba2454613b15dBdea6e5f22276410e89e/0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d",
    components: ["btc", "near"],
    nativePath: {
      //UniswapV2Router02 (Trisolaris)--> [WETH, NEAR]
      target: "0x2CB45Edb4517d5947aFdE3BEAbF95A582506858B",
      path: [
        "0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB",
        "0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d",
      ],
    },
  },
  rewardTokens: ["tri"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.TRISOLARIS,
  details: {
    apiKey: "TLP-BTC-NEAR",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pTLP BTC/NEAR",
    farmDepositTokenName: "pTLP BTC/NEAR",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_TRI_BTC_NEAR);

export const JAR_AURORA_TRI_LP: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 1g",
  contract: "0x6494DcFa6Af36cE89A990Ca13911365f006898ae",
  startBlock: 55123879, startTimestamp: 1639478987,
  depositToken: {
    addr: "0xd1654a7713617d41A8C9530Fb9B948d00e162194",
    name: "TRI AURORA/TRI",
    link: "https://www.trisolaris.io/#/add/0x8BEc47865aDe3B172A928df8f990Bc7f2A3b9f79/0xFa94348467f64D5A457F75F8bc40495D33c65aBB",
    components: ["aurora", "tri"],
    nativePath: {
      //UniswapV2Router02 (Trisolaris)--> [WETH,AURORA]
      target: "0x2CB45Edb4517d5947aFdE3BEAbF95A582506858B",
      path: [
        "0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB",
        "0x8BEc47865aDe3B172A928df8f990Bc7f2A3b9f79",
      ],
    },
  },
  rewardTokens: ["tri"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.TRISOLARIS,
  details: {
    apiKey: "TLP-AURORA-TRI",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pTLP AURORA/TRI",
    farmDepositTokenName: "pTLP AURORA/TRI",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_TRI_LP);

export const JAR_AURORA_TRI_AURORA_ETH: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 1h",
  contract: "0x4add83C7a0aEd64468A149dA583f1b92d1aCa6AA",
  startBlock: 55154027, startTimestamp: 1639510937,
  depositToken: {
    addr: "0x5eeC60F348cB1D661E4A5122CF4638c7DB7A886e",
    name: "TRI AURORA/ETH",
    link: "https://www.trisolaris.io/#/add/0x8BEc47865aDe3B172A928df8f990Bc7f2A3b9f79/ETH",
    components: ["aurora", "eth"],
  },
  rewardTokens: ["tri"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.TRISOLARIS,
  details: {
    apiKey: "TLP-AURORA-ETH",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pTLP AURORA/ETH",
    farmDepositTokenName: "pTLP AURORA/ETH",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_TRI_AURORA_ETH);

export const JAR_AURORA_TRI_NEAR_LUNA: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 1i",
  contract: "0x59384A541cEF5f604d39C5AaF0CD98170EEb15D2",
  startBlock: 56127375, startTimestamp: 1640641728,
  depositToken: {
    addr: "0xdF8CbF89ad9b7dAFdd3e37acEc539eEcC8c47914",
    name: "TRI NEAR/LUNA",
    link: "https://www.trisolaris.io/#/add/0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d/0xC4bdd27c33ec7daa6fcfd8532ddB524Bf4038096",
    components: ["near", "luna"],
    nativePath: {
      //UniswapV2Router02 (Trisolaris)--> [WETH, NEAR]
      target: "0x2CB45Edb4517d5947aFdE3BEAbF95A582506858B",
      path: [
        "0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB",
        "0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d",
      ],
    },
  },
  rewardTokens: ["tri"],
  enablement: AssetEnablement.PERMANENTLY_DISABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.TRISOLARIS,
  details: {
    apiKey: "TLP-NEAR-LUNA",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pTLP NEAR/LUNA",
    farmDepositTokenName: "pTLP NEAR/LUNA",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_TRI_NEAR_LUNA);

export const JAR_AURORA_TRI_UST_NEAR: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 1j",
  contract: "0xC7201D4BA106F524AafBB93aBeac648016E17A06",
  startBlock: 56129799, startTimestamp: 1640644629,
  depositToken: {
    addr: "0xa9eded3E339b9cd92bB6DEF5c5379d678131fF90",
    name: "TRI UST/NEAR",
    link: "https://www.trisolaris.io/#/add/0x5ce9F0B6AFb36135b5ddBF11705cEB65E634A9dC/0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d",
    components: ["ust", "near"],
    nativePath: {
      //UniswapV2Router02 (Trisolaris)--> [WETH, NEAR]
      target: "0x2CB45Edb4517d5947aFdE3BEAbF95A582506858B",
      path: [
        "0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB",
        "0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d",
      ],
    },
  },
  rewardTokens: ["tri"],
  enablement: AssetEnablement.PERMANENTLY_DISABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.TRISOLARIS,
  details: {
    apiKey: "TLP-UST-NEAR",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pTLP UST/NEAR",
    farmDepositTokenName: "pTLP UST/NEAR",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_TRI_UST_NEAR);

export const JAR_AURORA_TRI_USDT: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 1k",
  contract: "0x820980948220115Ccc64C66Ef71E65c2b7239664",
  startBlock: 56705597, startTimestamp: 1641333822,
  depositToken: {
    addr: "0x61C9E05d1Cdb1b70856c7a2c53fA9c220830633c",
    name: "TRI TRI/USDT",
    link: "https://www.trisolaris.io/#/add/0xFa94348467f64D5A457F75F8bc40495D33c65aBB/0x4988a896b1227218e4A686fdE5EabdcAbd91571f",
    components: ["tri", "usdt"],
    nativePath: {
      //UniswapV2Router02 (Trisolaris)--> [WETH, USDT]
      target: "0x2CB45Edb4517d5947aFdE3BEAbF95A582506858B",
      path: [
        "0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB",
        "0x4988a896b1227218e4A686fdE5EabdcAbd91571f",
      ],
    },
  },
  rewardTokens: ["tri"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.TRISOLARIS,
  details: {
    apiKey: "TLP-TRI-USDT",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pTLP TRI/USDT",
    farmDepositTokenName: "pTLP TRI/USDT",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_TRI_USDT);

export const JAR_AURORA_TRI_AVAX_NEAR: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 1l",
  contract: "0xC12F1469E85Aea3E556242b35AeEfD15bD6d99d1",
  startBlock: 57672974, startTimestamp: 1642557282,
  depositToken: {
    addr: "0x6443532841a5279cb04420E61Cf855cBEb70dc8C",
    name: "TRI AVAX/NEAR",
    link: "https://www.trisolaris.io/#/add/0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d/0x80A16016cC4A2E6a2CACA8a4a498b1699fF0f844",
    components: ["avax", "near"],
    nativePath: {
      //UniswapV2Router02 (Trisolaris)--> [WETH, NEAR]
      target: "0x2CB45Edb4517d5947aFdE3BEAbF95A582506858B",
      path: [
        "0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB",
        "0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d",
      ],
    },
  },
  rewardTokens: ["tri"],
  enablement: AssetEnablement.DISABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.TRISOLARIS,
  details: {
    apiKey: "TLP-AVAX-NEAR",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pTLP AVAX/NEAR",
    farmDepositTokenName: "pTLP AVAX/NEAR",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_TRI_AVAX_NEAR);

export const JAR_AURORA_TRI_MATIC_NEAR: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 1m",
  contract: "0x4fb8690751cd5D68b1d0b59F7E46DA632b6813a4",
  startBlock: 57673326, startTimestamp: 1642557746,
  depositToken: {
    addr: "0x3dC236Ea01459F57EFc737A12BA3Bb5F3BFfD071",
    name: "TRI MATIC/NEAR",
    link: "https://www.trisolaris.io/#/add/0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d/0x6aB6d61428fde76768D7b45D8BFeec19c6eF91A8",
    components: ["matic", "near"],
    nativePath: {
      //UniswapV2Router02 (Trisolaris)--> [WETH, NEAR]
      target: "0x2CB45Edb4517d5947aFdE3BEAbF95A582506858B",
      path: [
        "0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB",
        "0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d",
      ],
    },
  },
  rewardTokens: ["tri"],
  enablement: AssetEnablement.PERMANENTLY_DISABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.TRISOLARIS,
  details: {
    apiKey: "TLP-MATIC-NEAR",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pTLP MATIC/NEAR",
    farmDepositTokenName: "pTLP MATIC/NEAR",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_TRI_MATIC_NEAR);

export const JAR_AURORA_TRI_STNEAR_NEAR_LP: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 1n",
  contract: "0xbD41Da79B1bA18195e184a6eA983CE87BE33D4Ad",
  startBlock: 64018341, startTimestamp: 1650570985,
  depositToken: {
    addr: "0x47924Ae4968832984F4091EEC537dfF5c38948a4",
    name: "TLP STNEAR/NEAR",
    link: "https://www.trisolaris.io/#/add/0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d/0x07F9F7f963C5cD2BBFFd30CcfB964Be114332E30",
    components: ["stnear", "near"],
  },
  rewardTokens: ["tri", "meta"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.TRISOLARIS,
  details: {
    apiKey: "TLP-STNEAR-NEAR",
    harvestStyle: HarvestStyle.CUSTOM,
    controller: "0xdc954e7399e9ADA2661cdddb8D4C19c19E070A8E",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pTLP STNEAR/NEAR",
    farmDepositTokenName: "pTLP STNEAR/NEAR",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_TRI_STNEAR_NEAR_LP);

export const JAR_AURORA_TRI_STNEAR_XTRI_LP: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 1o",
  contract: "0x86c125a1AfB4a656Ee1EadAB85BfB2bB26180360",
  startBlock: 64019954, startTimestamp: 1650573004,
  depositToken: {
    addr: "0x5913f644A10d98c79F2e0b609988640187256373",
    name: "TLP STNEAR/XTRI",
    link: "https://www.trisolaris.io/#/add/0x07F9F7f963C5cD2BBFFd30CcfB964Be114332E30/0x802119e4e253D5C19aA06A5d567C5a41596D6803",
    components: ["stnear", "xtri"],
  },
  rewardTokens: ["tri", "meta"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.TRISOLARIS,
  details: {
    apiKey: "TLP-STNEAR-XTRI",
    harvestStyle: HarvestStyle.CUSTOM,
    controller: "0xdc954e7399e9ADA2661cdddb8D4C19c19E070A8E",
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pTLP STNEAR/XTRI",
    farmDepositTokenName: "pTLP STNEAR/XTRI",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_TRI_STNEAR_XTRI_LP);

export const JAR_AURORA_TRI_USDO_USDT_LP: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 1p",
  contract: "0x663E01A89CF0C7F40E1FA892A157f870EDF55245",
  startBlock: 64020364, startTimestamp: 1650573514,
  depositToken: {
    addr: "0x6277f94a69Df5df0Bc58b25917B9ECEFBf1b846A",
    name: "TLP USDO/USDT",
    link: "https://www.trisolaris.io/#/add/0x293074789b247cab05357b08052468B5d7A23c5a/0x4988a896b1227218e4A686fdE5EabdcAbd91571f",
    components: ["usdo", "usdt"],
  },
  rewardTokens: ["tri", "near"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.TRISOLARIS,
  details: {
    apiKey: "TLP-USDO-USDT",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xdc954e7399e9ADA2661cdddb8D4C19c19E070A8E",
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pTLP USDO/USDT",
    farmDepositTokenName: "pTLP USDO/USDT",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_TRI_USDO_USDT_LP);

export const JAR_AURORA_TRI_FLX_NEAR_LP: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 1q",
  contract: "0x4062A67B641f96000334Af3012BEF2D8087534C4",
  startBlock: 64027042, startTimestamp: 1650581895,
  depositToken: {
    addr: "0x48887cEEA1b8AD328d5254BeF774Be91B90FaA09",
    name: "TLP FLX/NEAR",
    link: "https://www.trisolaris.io/#/add/0xea62791aa682d455614eaA2A12Ba3d9A2fD197af/0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d",
    components: ["flx", "near"],
  },
  rewardTokens: ["tri", "flx"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.TRISOLARIS,
  details: {
    apiKey: "TLP-FLX-NEAR",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xdc954e7399e9ADA2661cdddb8D4C19c19E070A8E",
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pTLP FLX/NEAR",
    farmDepositTokenName: "pTLP FLX/NEAR",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_TRI_FLX_NEAR_LP);

export const JAR_AURORA_TRI_BSTN_NEAR_LP: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 1r",
  contract: "0x031adc001358ee1416c6b4ad8b8bf98a1c72edd0",
  startBlock: 64092739, startTimestamp: 1650663842,
  depositToken: {
    addr: "0xBBf3D4281F10E537d5b13CA80bE22362310b2bf9",
    name: "TLP BSTN/NEAR",
    link: "https://www.trisolaris.io/#/add/0x9f1f933c660a1dc856f0e0fe058435879c5ccef0/0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d",
    components: ["bstn", "near"],
  },
  rewardTokens: ["tri", "bstn"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.TRISOLARIS,
  details: {
    apiKey: "TLP-BSTN-NEAR",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xdc954e7399e9ADA2661cdddb8D4C19c19E070A8E",
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pTRI BSTN/NEAR",
    farmDepositTokenName: "pTRI BSTN/NEAR",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_TRI_BSTN_NEAR_LP);

export const JAR_AURORA_TRI_ROSE_NEAR_LP: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 1s",
  contract: "0xFb56aecFb7eF86c524E70E090B15CD4a643BBEc5",
  startBlock: 64156232, startTimestamp: 1650743016,
  depositToken: {
    addr: "0xbe753E99D0dBd12FB39edF9b884eBF3B1B09f26C",
    name: "TLP ROSE/NEAR",
    link: "https://www.trisolaris.io/#/add/0xdcD6D4e2B3e1D1E1E6Fa8C21C8A323DcbecfF970/0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d",
    components: ["rose", "near"],
  },
  rewardTokens: ["tri", "rose"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.TRISOLARIS,
  details: {
    apiKey: "TLP-ROSE-NEAR",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xdc954e7399e9ADA2661cdddb8D4C19c19E070A8E",
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pTRI ROSE/NEAR",
    farmDepositTokenName: "pTRI ROSE/NEAR",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_TRI_ROSE_NEAR_LP);

export const JAR_AURORA_TRI_RUSD_NEAR_LP: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 1t",
  contract: "0x471a605E4E2Eca369065da90110685d073CBFf1D",
  startBlock: 64156815, startTimestamp: 1650743729,
  depositToken: {
    addr: "0xbC0e71aE3Ef51ae62103E003A9Be2ffDe8421700",
    name: "TLP RUSD/NEAR",
    link: "https://www.trisolaris.io/#/add/0x19cc40283B057D6608C22F1D20F17e16C245642E/0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d",
    components: ["rusd", "near"],
  },
  rewardTokens: ["tri", "rose"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.TRISOLARIS,
  details: {
    apiKey: "TLP-RUSD-NEAR",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xdc954e7399e9ADA2661cdddb8D4C19c19E070A8E",
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pTRI RUSD/NEAR",
    farmDepositTokenName: "pTRI RUSD/NEAR",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_TRI_RUSD_NEAR_LP);

export const JAR_AURORA_TRI_LINEAR_NEAR_LP: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 1u",
  contract: "0x52C7Bc8a7F8dFF855ed4a8cEF6196c36D00E5cAA",
  startBlock: 64157710, startTimestamp: 1650744832,
  depositToken: {
    addr: "0xbceA13f9125b0E3B66e979FedBCbf7A4AfBa6fd1",
    name: "TLP LINEAR/NEAR",
    link: "https://www.trisolaris.io/#/add/0x19cc40283B057D6608C22F1D20F17e16C245642E/0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d",
    components: ["linear", "near"],
  },
  rewardTokens: ["tri", "linear"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.TRISOLARIS,
  details: {
    apiKey: "TLP-LINEAR-NEAR",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xdc954e7399e9ADA2661cdddb8D4C19c19E070A8E",
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pTRI LINEAR/NEAR",
    farmDepositTokenName: "pTRI LINEAR/NEAR",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_TRI_LINEAR_NEAR_LP);

export const JAR_AURORA_TRISOLARIS_SOLACE_NEAR_LP: JarDefinition = {
  type: AssetType.JAR,
  id: "auroraJar 1v",
  contract: "0x0EA5D709851ae7A6856677b880b8c56e87e7877B",
  startBlock: 64160109, startTimestamp: 1650747786,
  depositToken: {
    addr: "0xdDAdf88b007B95fEb42DDbd110034C9a8e9746F2",
    name: "TrisolarisLP SOLACE/NEAR",
    link: "https://www.trisolaris.io/#/add/0x501acE9c35E60f03A2af4d484f49F9B1EFde9f40/0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d",
    components: ["solace", "near"],
  },
  rewardTokens: ["solace"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.TRISOLARIS,
  details: {
    apiKey: "TRISOLARISLP-SOLACE-NEAR",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xdc954e7399e9ADA2661cdddb8D4C19c19E070A8E",
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pTrisolarisLP SOLACE/NEAR",
    farmDepositTokenName: "pTrisolarisLP SOLACE/NEAR",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_TRISOLARIS_SOLACE_NEAR_LP);

export const JAR_AURORA_TRISOLARIS_BBT_NEAR_LP: JarDefinition = {
  type: AssetType.JAR,
  id: "auroraJar 1x",
  contract: "0xA3342A7CB3fc1Fb8de3Fb7ef5d4A30e0e56C36CD",
  startBlock: 64174797, startTimestamp: 1650766226,
  depositToken: {
    addr: "0xadAbA7E2bf88Bd10ACb782302A568294566236dC",
    name: "TrisolarisLP BBT/NEAR",
    link: "https://www.trisolaris.io/#/add/0x4148d2Ce7816F0AE378d98b40eB3A7211E1fcF0D/0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d",
    components: ["bbt", "near"],
  },
  rewardTokens: ["bbt"],
  enablement: AssetEnablement.WITHDRAW_ONLY,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.TRISOLARIS,
  details: {
    apiKey: "TRISOLARISLP-BBT-NEAR",
    harvestStyle: HarvestStyle.CUSTOM,
    controller: "0xdc954e7399e9ADA2661cdddb8D4C19c19E070A8E",
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pTrisolarisLP BBT/NEAR",
    farmDepositTokenName: "pTrisolarisLP BBT/NEAR",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_TRISOLARIS_BBT_NEAR_LP);

export const JAR_AURORA_TRISOLARIS_USDC_SHITZU_LP: JarDefinition = {
  type: AssetType.JAR,
  id: "auroraJar 1z",
  contract: "0x7977844f44BFb9d33302FC4A99bB0247BA13478c",
  startBlock: 64179676, startTimestamp: 1650772493,
  depositToken: {
    addr: "0x5E74D85311fe2409c341Ce49Ce432BB950D221DE",
    name: "TrisolarisLP USDC/SHITZU",
    link: "https://www.trisolaris.io/#/add/0xB12BFcA5A55806AaF64E99521918A4bf0fC40802/0x68e401B61eA53889505cc1366710f733A60C2d41",
    components: ["usdc", "shitzu"],
  },
  rewardTokens: ["tri"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.TRISOLARIS,
  details: {
    apiKey: "TRISOLARISLP-USDC-SHITZU",
    harvestStyle: HarvestStyle.CUSTOM,
    controller: "0xdc954e7399e9ADA2661cdddb8D4C19c19E070A8E",
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pTrisolarisLP USDC/SHITZU",
    farmDepositTokenName: "pTrisolarisLP USDC/SHITZU",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_TRISOLARIS_USDC_SHITZU_LP);

export const JAR_AURORA_TRISOLARIS_AURORA_NEAR_LP: JarDefinition = {
  type: AssetType.JAR,
  id: "auroraJar 1ac",
  contract: "0x708C457199A699Ce7219d778353F9e82f5C49DC3",
  startBlock: 64898205, startTimestamp: 1651694061,
  depositToken: {
    addr: "0x1e0e812FBcd3EB75D8562AD6F310Ed94D258D008",
    name: "TrisolarisLP AURORA/NEAR",
    link: "https://www.trisolaris.io/#/add/0x8BEc47865aDe3B172A928df8f990Bc7f2A3b9f79/0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d",
    components: ["aurora", "near"],
  },
  rewardTokens: ["tri", "aurora"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.TRISOLARIS,
  details: {
    apiKey: "TRISOLARISLP-AURORA-NEAR",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xdc954e7399e9ADA2661cdddb8D4C19c19E070A8E",
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pTrisolarisLP AURORA/NEAR",
    farmDepositTokenName: "pTrisolarisLP AURORA/NEAR",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_TRISOLARIS_AURORA_NEAR_LP);

export const JAR_AURORA_WANNA_NEAR: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 2a",
  contract: "0x4550B283D30F96a8B56Fe16EB576f6d5033adDF7",
  startBlock: 55236886, startTimestamp: 1639603187, 
  depositToken: {
    addr: "0xbf9Eef63139b67fd0ABf22bD5504ACB0519a4212",
    name: "WANNA WANNA/NEAR",
    link: "https://wannaswap.finance/exchange/add/0x7faA64Faf54750a2E3eE621166635fEAF406Ab22/0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d",
    components: ["wanna", "near"],
    nativePath: {
      //UniswapV2Router02 (Trisolaris)--> [WETH, NEAR]
      target: "0x2CB45Edb4517d5947aFdE3BEAbF95A582506858B",
      path: [
        "0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB",
        "0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d",
      ],
    },
  },
  rewardTokens: ["wanna"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.WANNASWAP,
  details: {
    apiKey: "WLP-WANNA-NEAR",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pWLP WANNA/NEAR",
    farmDepositTokenName: "pWLP WANNA/NEAR",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_WANNA_NEAR);

export const JAR_AURORA_WANNA_AURORA_NEAR: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 2b",
  contract: "0xB87C8a9c77e3C98AdcA0E24Dce5D9F43E2b698BB",
  startBlock: 55212979, startTimestamp: 1639572789,
  depositToken: {
    addr: "0x7E9EA10E5984a09D19D05F31ca3cB65BB7df359d",
    name: "WANNA AURORA/NEAR",
    link: "https://wannaswap.finance/exchange/add/0x8BEc47865aDe3B172A928df8f990Bc7f2A3b9f79/0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d",
    components: ["aurora", "near"],
    nativePath: {
      //UniswapV2Router02 (Trisolaris)--> [WETH, NEAR]
      target: "0x2CB45Edb4517d5947aFdE3BEAbF95A582506858B",
      path: [
        "0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB",
        "0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d",
      ],
    },
  },
  rewardTokens: ["wanna"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.WANNASWAP,
  details: {
    apiKey: "WLP-AURORA-NEAR",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pWLP AURORA/NEAR",
    farmDepositTokenName: "pWLP AURORA/NEAR",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_WANNA_AURORA_NEAR);

export const JAR_AURORA_WANNA_ETH_BTC: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 2c",
  contract: "0xCb7f715c4CaB533b245c070b58628b4d6a4019E0",
  startBlock: 55236580, startTimestamp: 1639602844,
  depositToken: {
    addr: "0xf56997948d4235514Dcc50fC0EA7C0e110EC255d",
    name: "WANNA ETH/BTC",
    link: "https://wannaswap.finance/exchange/add/0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB/0xF4eB217Ba2454613b15dBdea6e5f22276410e89e",
    components: ["eth", "btc"],
  },
  rewardTokens: ["wanna"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.WANNASWAP,
  details: {
    apiKey: "WLP-ETH-BTC",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pWLP ETH/BTC",
    farmDepositTokenName: "pWLP ETH/BTC",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_WANNA_ETH_BTC);

export const JAR_AURORA_WANNA_NEAR_BTC: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 2d",
  contract: "0x4DdaC2BfF3746aDAC32E355f1855FD67Cc6FAa2B",
  startBlock: 55236886, startTimestamp: 1639603187,
  depositToken: {
    addr: "0xbF58062D23f869a90c6Eb04B9655f0dfCA345947",
    name: "WANNA NEAR/BTC",
    link: "https://wannaswap.finance/exchange/add/0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d/0xF4eB217Ba2454613b15dBdea6e5f22276410e89e",
    components: ["near", "btc"],
    nativePath: {
      //UniswapV2Router02 (Trisolaris)--> [WETH, NEAR]
      target: "0x2CB45Edb4517d5947aFdE3BEAbF95A582506858B",
      path: [
        "0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB",
        "0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d",
      ],
    },
  },
  rewardTokens: ["wanna"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.WANNASWAP,
  details: {
    apiKey: "WLP-NEAR-BTC",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pWLP NEAR/BTC",
    farmDepositTokenName: "pWLP NEAR/BTC",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_WANNA_NEAR_BTC);

export const JAR_AURORA_WANNA_NEAR_DAI: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 2e",
  contract: "0x90e28D422AeaC1011e03713125Fb9Ba6b4276fc8",
  startBlock: 55237184, startTimestamp: 1639603522,
  depositToken: {
    addr: "0xE6c47B036f6Fd0684B109B484aC46094e633aF2e",
    name: "WANNA NEAR/DAI",
    link: "https://wannaswap.finance/exchange/add/0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d/0xe3520349F477A5F6EB06107066048508498A291b",
    components: ["near", "dai"],
    nativePath: {
      //UniswapV2Router02 (Trisolaris)--> [WETH, NEAR]
      target: "0x2CB45Edb4517d5947aFdE3BEAbF95A582506858B",
      path: [
        "0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB",
        "0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d",
      ],
    },
  },
  rewardTokens: ["wanna"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.WANNASWAP,
  details: {
    apiKey: "WLP-NEAR-DAI",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pWLP NEAR/DAI",
    farmDepositTokenName: "pWLP NEAR/DAI",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_WANNA_NEAR_DAI);

export const JAR_AURORA_WANNA_NEAR_ETH: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 2f",
  contract: "0x639a02651557fFC1C7F233334248c4E7D416D60B",
  startBlock: 55237461, startTimestamp: 1639603834,
  depositToken: {
    addr: "0x256d03607eeE0156b8A2aB84da1D5B283219Fe97",
    name: "WANNA NEAR/ETH",
    link: "https://wannaswap.finance/exchange/add/0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d/0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB",
    components: ["near", "eth"],
  },
  rewardTokens: ["wanna"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.WANNASWAP,
  details: {
    apiKey: "WLP-NEAR-ETH",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pWLP NEAR/ETH",
    farmDepositTokenName: "pWLP NEAR/ETH",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_WANNA_NEAR_ETH);

export const JAR_AURORA_WANNA_USDC_NEAR: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 2g",
  contract: "0x6379F3801cC2004C6CeaD7d766f5d4279E178953",
  startBlock: 55237979, startTimestamp: 1639604415,
  depositToken: {
    addr: "0xBf560771B6002a58477EFBCDD6774A5a1947587B",
    name: "WANNA USDC/NEAR",
    link: "https://wannaswap.finance/exchange/add/0xB12BFcA5A55806AaF64E99521918A4bf0fC40802/0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d",
    components: ["usdc", "near"],
    nativePath: {
      //UniswapV2Router02 (Trisolaris)--> [WETH, NEAR]
      target: "0x2CB45Edb4517d5947aFdE3BEAbF95A582506858B",
      path: [
        "0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB",
        "0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d",
      ],
    },
  },
  rewardTokens: ["wanna"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.WANNASWAP,
  details: {
    apiKey: "WLP-USDC-NEAR",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pWLP USDC/NEAR",
    farmDepositTokenName: "pWLP USDC/NEAR",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_WANNA_USDC_NEAR);

export const JAR_AURORA_WANNA_USDT_NEAR: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 2h",
  contract: "0x7b659258a57A5F4DB9C4049d01B6D8AaF6400a25",
  startBlock: 55239010, startTimestamp: 1639605571,
  depositToken: {
    addr: "0x2e02Bea8e9118f7d2ccadA1d402286Cc6d54bd67",
    name: "WANNA USDT/NEAR",
    link: "https://wannaswap.finance/exchange/add/0x4988a896b1227218e4A686fdE5EabdcAbd91571f/0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d",
    components: ["usdt", "near"],
    nativePath: {
      //UniswapV2Router02 (Trisolaris)--> [WETH, NEAR]
      target: "0x2CB45Edb4517d5947aFdE3BEAbF95A582506858B",
      path: [
        "0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB",
        "0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d",
      ],
    },
  },
  rewardTokens: ["wanna"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.WANNASWAP,
  details: {
    apiKey: "WLP-USDT-NEAR",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pWLP USDT/NEAR",
    farmDepositTokenName: "pWLP USDT/NEAR",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_WANNA_USDT_NEAR);

export const JAR_AURORA_WANNA_USDT_USDC: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 2i",
  contract: "0xC6c7481d7e030aC3acbFD53f98797E32824A7B70",
  startBlock: 55238372, startTimestamp: 1639604859,
  depositToken: {
    addr: "0x3502eaC6Fa27bEebDC5cd3615B7CB0784B0Ce48f",
    name: "WANNA USDT/USDC",
    link: "https://wannaswap.finance/exchange/add/0x4988a896b1227218e4A686fdE5EabdcAbd91571f/0xB12BFcA5A55806AaF64E99521918A4bf0fC40802",
    components: ["usdt", "usdc"],
    nativePath: {
      //UniswapV2Router02 (Trisolaris)--> [WETH, USDC]
      target: "0x2CB45Edb4517d5947aFdE3BEAbF95A582506858B",
      path: [
        "0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB",
        "0xB12BFcA5A55806AaF64E99521918A4bf0fC40802",
      ],
    },
  },
  rewardTokens: ["wanna"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.WANNASWAP,
  details: {
    apiKey: "WLP-USDT-USDC",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pWLP USDT/USDC",
    farmDepositTokenName: "pWLP USDT/USDC",
  },
  tags: ["stablecoins"],
};
JAR_DEFINITIONS.push(JAR_AURORA_WANNA_USDT_USDC);

export const JAR_AURORA_WANNA_WANNA_USDC: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 2j",
  contract: "0x6791325D64318BbCe35392da6BdFf94840c4A4B5",
  startBlock: 55239342, startTimestamp: 1639605944,
  depositToken: {
    addr: "0x523faE29D7ff6FD38842c8F271eDf2ebd3150435",
    name: "WANNA WANNA/USDC",
    link: "https://wannaswap.finance/exchange/add/0x7faA64Faf54750a2E3eE621166635fEAF406Ab22/0xB12BFcA5A55806AaF64E99521918A4bf0fC40802",
    components: ["wanna", "usdc"],
    nativePath: {
      //UniswapV2Router02 (Trisolaris)--> [WETH, USDC]
      target: "0x2CB45Edb4517d5947aFdE3BEAbF95A582506858B",
      path: [
        "0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB",
        "0xB12BFcA5A55806AaF64E99521918A4bf0fC40802",
      ],
    },
  },
  rewardTokens: ["wanna"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.WANNASWAP,
  details: {
    apiKey: "WLP-WANNA-USDC",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pWLP WANNA/USDC",
    farmDepositTokenName: "pWLP WANNA/USDC",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_WANNA_WANNA_USDC);

export const JAR_AURORA_WANNA_USDT_WANNA: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 2k",
  contract: "0xECDA075c31c20449f89Dc4467CF70d5F98e657D2",
  startBlock: 55239679, startTimestamp: 1639606321,
  depositToken: {
    addr: "0xcA461686C711AeaaDf0B516f9C2ad9d9B645a940",
    name: "WANNA WANNA/USDT",
    link: "https://wannaswap.finance/exchange/add/0x4988a896b1227218e4A686fdE5EabdcAbd91571f/0x7faA64Faf54750a2E3eE621166635fEAF406Ab22",
    components: ["usdt", "wanna"],
    nativePath: {
      //UniswapV2Router02 (Trisolaris)--> [WETH, USDT]
      target: "0x2CB45Edb4517d5947aFdE3BEAbF95A582506858B",
      path: [
        "0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB",
        "0x4988a896b1227218e4A686fdE5EabdcAbd91571f",
      ],
    },
  },
  rewardTokens: ["wanna"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.WANNASWAP,
  details: {
    apiKey: "WLP-USDT-WANNA",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pWLP WANNA/USDT",
    farmDepositTokenName: "pWLP WANNA/USDT",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_WANNA_USDT_WANNA);

export const JAR_AURORA_WANNA_NEAR_LUNA: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 2l",
  contract: "0x6C33317A6486ce6Ea564F6618BC2834B8ef63b8C",
  startBlock: 56120427, startTimestamp: 1640633355,
  depositToken: {
    addr: "0x24f6c59747e4AcEB3DBA365df77D68c2A3aA4fB1",
    name: "WANNA NEAR/LUNA",
    link: "https://wannaswap.finance/exchange/add/0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d/0xC4bdd27c33ec7daa6fcfd8532ddB524Bf4038096",
    components: ["near", "luna"],
    nativePath: {
      //UniswapV2Router02 (Trisolaris)--> [WETH, NEAR]
      target: "0x2CB45Edb4517d5947aFdE3BEAbF95A582506858B",
      path: [
        "0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB",
        "0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d",
      ],
    },
  },
  rewardTokens: ["wanna"],
  enablement: AssetEnablement.PERMANENTLY_DISABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.WANNASWAP,
  details: {
    apiKey: "WLP-NEAR-LUNA",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pWLP NEAR/LUNA",
    farmDepositTokenName: "pWLP NEAR/LUNA",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_WANNA_NEAR_LUNA);

export const JAR_AURORA_WANNA_UST_NEAR: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 2m",
  contract: "0x9C319e32422Ce850090D5C3E54e0475D2Fc4BdaA",
  startBlock: 56121153, startTimestamp: 1640634213,
  depositToken: {
    addr: "0x436C525D536adC447c7775575f88D357634734C1",
    name: "WANNA UST/NEAR",
    link: "https://wannaswap.finance/exchange/add/0x5ce9F0B6AFb36135b5ddBF11705cEB65E634A9dC/0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d",
    components: ["ust", "near"],
    nativePath: {
      //UniswapV2Router02 (Trisolaris)--> [WETH, NEAR]
      target: "0x2CB45Edb4517d5947aFdE3BEAbF95A582506858B",
      path: [
        "0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB",
        "0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d",
      ],
    },
  },
  rewardTokens: ["wanna"],
  enablement: AssetEnablement.PERMANENTLY_DISABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.WANNASWAP,
  details: {
    apiKey: "WLP-UST-NEAR",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pWLP UST/NEAR",
    farmDepositTokenName: "pWLP UST/NEAR",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_WANNA_UST_NEAR);

export const JAR_AURORA_WANNA_WANNA_AURORA: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 2n",
  contract: "0xf3EbeC4D691Bc5Ea7B0158228feCfC3de2aE3910",
  startBlock: 56253481, startTimestamp: 1640794057,
  depositToken: {
    addr: "0xddCcf2F096fa400ce90ba0568908233e6A950961",
    name: "WANNA WANNA/AURORA",
    link: "https://wannaswap.finance/exchange/add/0x7faA64Faf54750a2E3eE621166635fEAF406Ab22/0x8BEc47865aDe3B172A928df8f990Bc7f2A3b9f79",
    components: ["wanna", "aurora"],
    nativePath: {
      //UniswapV2Router02 (Trisolaris)--> [WETH,AURORA]
      target: "0x2CB45Edb4517d5947aFdE3BEAbF95A582506858B",
      path: [
        "0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB",
        "0x8BEc47865aDe3B172A928df8f990Bc7f2A3b9f79",
      ],
    },
  },
  rewardTokens: ["wanna"],
  enablement: AssetEnablement.WITHDRAW_ONLY,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.WANNASWAP,
  details: {
    apiKey: "WLP-WANNA-AURORA",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pWLP WANNA/AURORA",
    farmDepositTokenName: "pWLP WANNA/AURORA",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_WANNA_WANNA_AURORA);

export const JAR_AURORA_WANNASWAP_WANNAX_STNEAR_LP: JarDefinition = {
  type: AssetType.JAR,
  id: "auroraJar 2o",
  contract: "0x527F243112Cc6DE5A9879c93c2091C23E9a3afa5",
  startBlock: 64263363, startTimestamp: 1650878812,
  depositToken: {
    addr: "0xE22606659ec950E0328Aa96c7f616aDC4907cBe3",
    name: "WannaswapLP WANNAX/STNEAR",
    link: "https://wannaswap.finance/exchange/add/0x5205c30bf2E37494F8cF77D2c19C6BA4d2778B9B/0x07F9F7f963C5cD2BBFFd30CcfB964Be114332E30",
    components: ["wannax", "stnear"],
  },
  rewardTokens: ["wanna"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.WANNASWAP,
  details: {
    apiKey: "WANNASWAPLP-WANNAX-STNEAR",
    harvestStyle: HarvestStyle.CUSTOM,
    controller: "0xdc954e7399e9ADA2661cdddb8D4C19c19E070A8E",
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pWannaswapLP WANNAX/STNEAR",
    farmDepositTokenName: "pWannaswapLP WANNAX/STNEAR",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_WANNASWAP_WANNAX_STNEAR_LP);

export const JAR_AURORA_PAD_BTC_NEAR: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 3a",
  contract: "0xcf59208abbAE8457F39f961eAb6293bdef1E5F1e",
  startBlock: 54743730, startTimestamp: 1639085685,
  depositToken: {
    addr: "0xA188D79D6bdbc1120a662DE9eB72384E238AF104",
    name: "PAD BTC/NEAR",
    link: "https://dex.nearpad.io/add/0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d/0xF4eB217Ba2454613b15dBdea6e5f22276410e89e",
    components: ["btc", "near"],
    nativePath: {
      //UniswapV2Router02 (Trisolaris)--> [WETH, NEAR]
      target: "0x2CB45Edb4517d5947aFdE3BEAbF95A582506858B",
      path: [
        "0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB",
        "0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d",
      ],
    },
  },
  rewardTokens: ["pad"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.NEARPAD,
  details: {
    apiKey: "NLP-BTC-NEAR",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pNLP BTC/NEAR",
    farmDepositTokenName: "pNLP BTC/NEAR",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_PAD_BTC_NEAR);

export const JAR_AURORA_PAD_PAD_USDT: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 3b",
  contract: "0x86950b9668804154BD385AE0E228099c4375fEEA",
  startBlock: 55132882, startTimestamp: 1639488381,
  depositToken: {
    addr: "0x1FD6CBBFC0363AA394bd77FC74F64009BF54A7e9",
    name: "PAD PAD/USDT",
    link: "https://dex.nearpad.io/add/0x885f8CF6E45bdd3fdcDc644efdcd0AC93880c781/0x4988a896b1227218e4A686fdE5EabdcAbd91571f",
    components: ["pad", "usdt"],
    nativePath: {
      //nearpad router--> [WETH, PAD]
      target: "0xBaE0d7DFcd03C90EBCe003C58332c1346A72836A",
      path: [
        "0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB",
        "0x885f8CF6E45bdd3fdcDc644efdcd0AC93880c781",
      ],
    },
  },
  rewardTokens: ["pad"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.NEARPAD,
  details: {
    apiKey: "NLP-PAD-USDT",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pNLP PAD/USDT",
    farmDepositTokenName: "pNLP PAD/USDT",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_PAD_PAD_USDT);

export const JAR_AURORA_PAD_PAD_USDC: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 3c",
  contract: "0x4D2FE5BcC9d3d252383D32E1ffF3B3C279eB4E85",
  startBlock: 55132324, startTimestamp: 1639487788,
  depositToken: {
    addr: "0x73155e476D6b857fE7722AEfeBAD50F9F8bd0b38",
    name: "PAD PAD/USDC",
    link: "https://dex.nearpad.io/add/0x885f8CF6E45bdd3fdcDc644efdcd0AC93880c781/0xB12BFcA5A55806AaF64E99521918A4bf0fC40802",
    components: ["pad", "usdc"],
    nativePath: {
      //Nearpad router--> [WETH, PAD]
      target: "0xBaE0d7DFcd03C90EBCe003C58332c1346A72836A",
      path: [
        "0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB",
        "0x885f8CF6E45bdd3fdcDc644efdcd0AC93880c781",
      ],
    },
  },
  rewardTokens: ["pad"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.NEARPAD,
  details: {
    apiKey: "NLP-PAD-USDC",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pNLP PAD/USDC",
    farmDepositTokenName: "pNLP PAD/USDC",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_PAD_PAD_USDC);

export const JAR_AURORA_PAD_PAD_ETH: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 3d",
  contract: "0x4F83d6ae3401f6859B579D840a5E38862a889282",
  startBlock: 55112571, startTimestamp: 1639467119,
  depositToken: {
    addr: "0x63b4a0538CE8D90876B201af1020d13308a8B253",
    name: "PAD PAD/ETH",
    link: "https://dex.nearpad.io/add/0x885f8CF6E45bdd3fdcDc644efdcd0AC93880c781/0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB",
    components: ["pad", "eth"],
  },
  rewardTokens: ["pad"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.NEARPAD,
  details: {
    apiKey: "NLP-PAD-ETH",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pNLP PAD/ETH",
    farmDepositTokenName: "pNLP PAD/ETH",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_PAD_PAD_ETH);

export const JAR_AURORA_PAD_PAD_NEAR: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 3e",
  contract: "0x6401Ded5D808eE824791dBfc23aA8769b585EB37",
  startBlock: 55115233, startTimestamp: 1639469967,
  depositToken: {
    addr: "0xc374776Cf5C497Adeef6b505588b00cB298531FD",
    name: "PAD PAD/NEAR",
    link: "https://dex.nearpad.io/add/0x885f8CF6E45bdd3fdcDc644efdcd0AC93880c781/0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d",
    components: ["pad", "near"],
    nativePath: {
      //UniswapV2Router02 (Trisolaris)--> [WETH, NEAR]
      target: "0x2CB45Edb4517d5947aFdE3BEAbF95A582506858B",
      path: [
        "0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB",
        "0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d",
      ],
    },
  },
  rewardTokens: ["pad"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.NEARPAD,
  details: {
    apiKey: "NLP-PAD-NEAR",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pNLP PAD/NEAR",
    farmDepositTokenName: "pNLP PAD/NEAR",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_PAD_PAD_NEAR);

export const JAR_AURORA_PAD_PAD_FRAX: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 3f",
  contract: "0xc773eF9aE52fF43031DD2Db439966ef4cb55bd79",
  startBlock: 55114627, startTimestamp: 1639469320,
  depositToken: {
    addr: "0xB53bC2537e641C37c7B7A8D33aba1B30283CDA2f",
    name: "PAD PAD/FRAX",
    link: "https://dex.nearpad.io/add/0x885f8CF6E45bdd3fdcDc644efdcd0AC93880c781/0xDA2585430fEf327aD8ee44Af8F1f989a2A91A3d2",
    components: ["pad", "frax"],
    nativePath: {
      //Nearpad router--> [WETH, PAD]
      target: "0xBaE0d7DFcd03C90EBCe003C58332c1346A72836A",
      path: [
        "0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB",
        "0x885f8CF6E45bdd3fdcDc644efdcd0AC93880c781",
      ],
    },
  },
  rewardTokens: ["pad"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.NEARPAD,
  details: {
    apiKey: "NLP-PAD-FRAX",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pNLP PAD/FRAX",
    farmDepositTokenName: "pNLP PAD/FRAX",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_PAD_PAD_FRAX);

export const JAR_AURORA_ROSE_PAD_ROSE_PAD_LP: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 4a",
  contract: "0x3F00480fB625Be95abf6c462C84Be1916baF6446",
  startBlock: 64255592, startTimestamp: 1650868599,
  depositToken: {
    addr: "0xC6C3cc84EabD4643C382C988fA2830657fc70a6B",
    name: "PAD PAD/ROSE",
    link: "https://dex.nearpad.io/add/0x885f8CF6E45bdd3fdcDc644efdcd0AC93880c781/0xdcD6D4e2B3e1D1E1E6Fa8C21C8A323DcbecfF970",
    components: ["pad", "rose"],
    nativePath: {
      //UniswapV2Router02 (Trisolaris)--> [WETH, PAD]
      target: "0x2CB45Edb4517d5947aFdE3BEAbF95A582506858B",
      path: [
        "0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB",
        "0x885f8CF6E45bdd3fdcDc644efdcd0AC93880c781",
      ],
    },
  },
  rewardTokens: ["rose"],
  enablement: AssetEnablement.WITHDRAW_ONLY,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.NEARPAD,
  details: {
    apiKey: "NLP-PAD-ROSE",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pNLP PAD/ROSE",
    farmDepositTokenName: "pNLP PAD/ROSE",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_ROSE_PAD_ROSE_PAD_LP);

export const JAR_AURORA_ROSE_PAD_ROSE_FRAX_LP: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 4b",
  contract: "0x566112Ba8Bf50218Ac5D485DcbE0eBF240707D11",
  startBlock: 64255996, startTimestamp: 1650869144,
  depositToken: {
    addr: "0xeD4C231b98b474f7cAeCAdD2736e5ebC642ad707",
    name: "PAD FRAX/ROSE",
    link: "https://dex.nearpad.io/add/0x885f8CF6E45bdd3fdcDc644efdcd0AC93880c781/0xdcD6D4e2B3e1D1E1E6Fa8C21C8A323DcbecfF970",
    components: ["frax", "rose"],
  },
  rewardTokens: ["rose"],
  enablement: AssetEnablement.WITHDRAW_ONLY,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.NEARPAD,
  details: {
    apiKey: "NLP-FRAX-ROSE",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pNLP FRAX/ROSE",
    farmDepositTokenName: "pNLP FRAX/ROSE",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_ROSE_PAD_ROSE_FRAX_LP);

export const JAR_AURORA_ROSE_3POOL_LP: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 4c",
  contract: "0x0FeEc68AFB4716Af45349bcFdc317E872BD50335",
  startBlock: 64237051, startTimestamp: 1650844843, 
  depositToken: {
    addr: "0xfF79D5bff48e1C01b722560D6ffDfCe9FC883587",
    name: "RoseLP 3POOL",
    link: "https://app.rose.fi/#/pools/pools/stables",
    components: ["rose3pool"],
  },
  rewardTokens: ["rose"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.ROSE,
  details: {
    apiKey: "ROSELP-3POOL",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pROSELP-3POOL",
    farmDepositTokenName: "pROSELP-3POOL",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_ROSE_3POOL_LP);

export const JAR_AURORA_ROSE_FRAXPOOL_LP: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 4d",
  contract: "0xF25466cadAD7ACd09249A8e4baDF62C43c6e0375",
  startBlock: 64237051, startTimestamp: 1650844843, 
  depositToken: {
    addr: "0x4463A118A2fB34640ff8eF7Fe1B3abAcd4aC9fB7",
    name: "RoseLP FRAXPOOL",
    link: "https://app.rose.fi/#/pools/pools/frax",
    components: ["rose3pool", "frax"],
  },
  rewardTokens: ["rose"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.ROSE,
  details: {
    apiKey: "ROSELP-FRAXPOOL",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pROSELP-FRAXPOOL",
    farmDepositTokenName: "pROSELP-FRAXPOOL",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_ROSE_FRAXPOOL_LP);

export const JAR_AURORA_ROSE_USTPOOL_LP: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 4e",
  contract: "0xe7a47b1Be32161736FE083E8425b7Be97099B2Ed",
  startBlock: 64238136, startTimestamp: 1650846210,
  depositToken: {
    addr: "0x94A7644E4D9CA0e685226254f88eAdc957D3c263",
    name: "RoseLP USTPOOL",
    link: "https://app.rose.fi/#/pools/pools/ust",
    components: ["rose3pool", "ust"],
  },
  rewardTokens: ["rose"],
  enablement: AssetEnablement.WITHDRAW_ONLY,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.ROSE,
  details: {
    apiKey: "ROSELP-USTPOOL",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pROSELP-USTPOOL",
    farmDepositTokenName: "pROSELP-USTPOOL",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_ROSE_USTPOOL_LP);

export const JAR_AURORA_ROSE_BUSDPOOL_LP: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 4f",
  contract: "0x149228d9d745e5aBdeb0640aE4dB51BdEC7de1AA",
  startBlock: 64829885, startTimestamp: 1651609594,
  depositToken: {
    addr: "0x158f57CF9A4DBFCD1Bc521161d86AeCcFC5aF3Bc",
    name: "RoseLP BUSDPOOL",
    link: "https://app.rose.fi/#/pools/pools/busd",
    components: ["rose3pool", "busd"],
  },
  rewardTokens: ["rose"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.ROSE,
  details: {
    apiKey: "ROSELP-BUSDPOOL",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pROSELP-BUSDPOOL",
    farmDepositTokenName: "pROSELP-BUSDPOOL",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_ROSE_BUSDPOOL_LP);

export const JAR_AURORA_ROSE_MAIPOOL_LP: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 4g",
  contract: "0x4850d60B10520081653F012E000049Bc82dE365F",
  startBlock: 64828260, startTimestamp: 1651607468,
  depositToken: {
    addr: "0xA7ae42224Bf48eCeFc5f838C230EE339E5fd8e62",
    name: "RoseLP MAIPOOL",
    link: "https://app.rose.fi/#/pools/pools/mai",
    components: ["rose3pool", "mai"],
  },
  rewardTokens: ["rose"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.ROSE,
  details: {
    apiKey: "ROSELP-MAIPOOL",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pROSELP-MAIPOOL",
    farmDepositTokenName: "pROSELP-MAIPOOL",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_ROSE_MAIPOOL_LP);

export const JAR_AURORA_ROSE_RUSDPOOL_LP: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 4h",
  contract: "0x5ae33A37398Fe95131c2150D3D4A5D539C791d50",
  startBlock: 64833747, startTimestamp: 1651614656,
  depositToken: {
    addr: "0x56f87a0cB4713eB513BAf57D5E81750433F5fcB9",
    name: "RoseLP RUSDPOOL",
    link: "https://app.rose.fi/#/pools/pools/rusd",
    components: ["rose3pool", "rusd"],
  },
  rewardTokens: ["rose"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.ROSE,
  details: {
    apiKey: "ROSELP-RUSDPOOL",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pROSELP-RUSDPOOL",
    farmDepositTokenName: "pROSELP-RUSDPOOL",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_ROSE_RUSDPOOL_LP);

export const JAR_AURORA_BRL_AURORA_NEAR: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 5a",
  contract: "0xE0df9e3a0595989D6Ada23AF1C0df876e8742941",
  startBlock: 56681359, startTimestamp: 1641304357,
  depositToken: {
    addr: "0x84567E7511E0d97DE676d236AEa7aE688221799e",
    name: "BRL AURORA/NEAR",
    link: "https://swap.auroraswap.net/#/add/0x8BEc47865aDe3B172A928df8f990Bc7f2A3b9f79/0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d",
    components: ["aurora", "near"],
    nativePath: {
      //UniswapV2Router02 (Trisolaris)--> [WETH, NEAR]
      target: "0x2CB45Edb4517d5947aFdE3BEAbF95A582506858B",
      path: [
        "0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB",
        "0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d",
      ],
    },
  },
  rewardTokens: ["brl"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.AURORASWAP,
  details: {
    apiKey: "ALP-AURORA-NEAR",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pALP AURORA/NEAR",
    farmDepositTokenName: "pALP AURORA/NEAR",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_BRL_AURORA_NEAR);

export const JAR_AURORA_BRL_AVAX_NEAR: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 5b",
  contract: "0xf4A06eBe93847f2D822fAc255eB01416545709C6",
  startBlock: 56681555, startTimestamp: 1641304603,
  depositToken: {
    addr: "0x8F6e13B3D28B09535EB82BE539c1E4802B0c25B7",
    name: "BRL AVAX/NEAR",
    link: "https://swap.auroraswap.net/#/add/0x80A16016cC4A2E6a2CACA8a4a498b1699fF0f844/0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d",
    components: ["avax", "near"],
    nativePath: {
      //UniswapV2Router02 (Trisolaris)--> [WETH, NEAR]
      target: "0x2CB45Edb4517d5947aFdE3BEAbF95A582506858B",
      path: [
        "0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB",
        "0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d",
      ],
    },
  },
  rewardTokens: ["brl"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.AURORASWAP,
  details: {
    apiKey: "ALP-AVAX-NEAR",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pALP AVAX/NEAR",
    farmDepositTokenName: "pALP AVAX/NEAR",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_BRL_AVAX_NEAR);

export const JAR_AURORA_BRL_BRL_AURORA: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 5d",
  contract: "0xEc84AF3108c76bFBbf9652A2F39F7dC7005D70a4",
  startBlock: 56682349, startTimestamp: 1641305570,
  depositToken: {
    addr: "0xDB0363ee28a5B40BDc2f4701e399c63E00f91Aa8",
    name: "BRL BRL/AURORA",
    link: "https://swap.auroraswap.net/#/add/0x12c87331f086c3C926248f964f8702C0842Fd77F/0x8BEc47865aDe3B172A928df8f990Bc7f2A3b9f79",
    components: ["brl", "aurora"],
    nativePath: {
      //UniswapV2Router02 (Trisolaris)--> [WETH, AURORA]
      target: "0x2CB45Edb4517d5947aFdE3BEAbF95A582506858B",
      path: [
        "0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB",
        "0x8BEc47865aDe3B172A928df8f990Bc7f2A3b9f79",
      ],
    },
  },
  rewardTokens: ["brl"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.AURORASWAP,
  details: {
    apiKey: "ALP-BRL-AURORA",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pALP BRL/AURORA",
    farmDepositTokenName: "pALP BRL/AURORA",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_BRL_BRL_AURORA);

export const JAR_AURORA_BRL_BRL_ETH: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 5e",
  contract: "0x25a7f48587DD37eD194d1e6DCF3b2DDC48D83cAf",
  startBlock: 56682573, startTimestamp: 1641305846,
  depositToken: {
    addr: "0xEfCF518CA36DC3362F539965807b42A77DC26Be0",
    name: "BRL BRL/ETH",
    link: "https://swap.auroraswap.net/#/add/0x12c87331f086c3C926248f964f8702C0842Fd77F/0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB",
    components: ["brl", "eth"],
  },
  rewardTokens: ["brl"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.AURORASWAP,
  details: {
    apiKey: "ALP-BRL-ETH",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pALP BRL/ETH",
    farmDepositTokenName: "pALP BRL/ETH",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_BRL_BRL_ETH);

export const JAR_AURORA_BRL_BRL_NEAR: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 5f",
  contract: "0x3d1E5f81101de37463775a5Be13C2eEe066a0D63",
  startBlock: 56682808, startTimestamp: 1641306128,
  depositToken: {
    addr: "0x5BdAC608cd38C5C8738f5bE20813194A3150d4Ff",
    name: "BRL BRL/NEAR",
    link: "https://swap.auroraswap.net/#/add/0x12c87331f086c3C926248f964f8702C0842Fd77F/0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d",
    components: ["brl", "near"],
    nativePath: {
      //UniswapV2Router02 (Trisolaris)--> [WETH, NEAR]
      target: "0x2CB45Edb4517d5947aFdE3BEAbF95A582506858B",
      path: [
        "0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB",
        "0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d",
      ],
    },
  },
  rewardTokens: ["brl"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.AURORASWAP,
  details: {
    apiKey: "ALP-BRL-NEAR",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pALP BRL/NEAR",
    farmDepositTokenName: "pALP BRL/NEAR",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_BRL_BRL_NEAR);

export const JAR_AURORA_BRL_BUSD_NEAR: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 5g",
  contract: "0x544c6bab8Fd668B6888D9a1c0bb1BE0c9009fce0",
  startBlock: 56683145, startTimestamp: 1641306559,
  depositToken: {
    addr: "0x1C393468D95ADF8960E64939bCDd6eE602DE221C",
    name: "BRL BUSD/NEAR",
    link: "https://swap.auroraswap.net/#/add/0x5D9ab5522c64E1F6ef5e3627ECCc093f56167818/0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d",
    components: ["busd", "near"],
    nativePath: {
      //UniswapV2Router02 (Trisolaris)--> [WETH, NEAR]
      target: "0x2CB45Edb4517d5947aFdE3BEAbF95A582506858B",
      path: [
        "0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB",
        "0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d",
      ],
    },
  },
  rewardTokens: ["brl"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.AURORASWAP,
  details: {
    apiKey: "NLP-BUSD-NEAR",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pALP BUSD/NEAR",
    farmDepositTokenName: "pALP BUSD/NEAR",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_BRL_BUSD_NEAR);

export const JAR_AURORA_BRL_ETH_BTC: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 5h",
  contract: "0x6bcd59972Af5b6C27e7Df3FA49787B5Fb578E083",
  startBlock: 56683363, startTimestamp: 1641306825,
  depositToken: {
    addr: "0xcb8584360Dc7A4eAC4878b48fB857AA794E46Fa8",
    name: "BRL ETH/BTC",
    link: "https://swap.auroraswap.net/#/add/0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB/0xF4eB217Ba2454613b15dBdea6e5f22276410e89e",
    components: ["eth", "btc"],
  },
  rewardTokens: ["brl"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.AURORASWAP,
  details: {
    apiKey: "ALP-ETH-BTC",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pALP ETH/BTC",
    farmDepositTokenName: "pALP ETH/BTC",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_BRL_ETH_BTC);

export const JAR_AURORA_BRL_MATIC_NEAR: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 5i",
  contract: "0x506f103Dbef428426A8ABD31B3F7c7AbfeB5F681",
  startBlock: 56683787, startTimestamp: 1641307346,
  depositToken: {
    addr: "0x8298B8C863c2213B9698A08de009cC0aB0F87FEe",
    name: "BRL MATIC/NEAR",
    link: "https://swap.auroraswap.net/#/add/0x6aB6d61428fde76768D7b45D8BFeec19c6eF91A8/0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d",
    components: ["matic", "near"],
    nativePath: {
      //UniswapV2Router02 (Trisolaris)--> [WETH, NEAR]
      target: "0x2CB45Edb4517d5947aFdE3BEAbF95A582506858B",
      path: [
        "0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB",
        "0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d",
      ],
    },
  },
  rewardTokens: ["brl"],
  enablement: AssetEnablement.DISABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.AURORASWAP,
  details: {
    apiKey: "ALP-MATIC-NEAR",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pALP MATIC/NEAR",
    farmDepositTokenName: "pALP MATIC/NEAR",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_BRL_MATIC_NEAR);

export const JAR_AURORA_BRL_NEAR_BTC: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 5j",
  contract: "0xA80751447B89dE8601bacB876Ff0096E2FF77c71",
  startBlock: 56702384, startTimestamp: 1641329936,
  depositToken: {
    addr: "0xe11A3f2BAB372d88D133b64487D1772847Eec4eA",
    name: "BRL NEAR/BTC",
    link: "https://swap.auroraswap.net/#/add/0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d/0xF4eB217Ba2454613b15dBdea6e5f22276410e89e",
    components: ["near", "btc"],
    nativePath: {
      //UniswapV2Router02 (Trisolaris)--> [WETH, NEAR]
      target: "0x2CB45Edb4517d5947aFdE3BEAbF95A582506858B",
      path: [
        "0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB",
        "0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d",
      ],
    },
  },
  rewardTokens: ["brl"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.AURORASWAP,
  details: {
    apiKey: "ALP-NEAR-BTC",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pALP NEAR/BTC",
    farmDepositTokenName: "pALP NEAR/BTC",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_BRL_NEAR_BTC);

export const JAR_AURORA_BRL_NEAR_ETH: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 5k",
  contract: "0x8Bc0684beF765B1b0dAf266A82c9f26699Ee0d2A",
  startBlock: 56702591, startTimestamp: 1641330182,
  depositToken: {
    addr: "0xc57eCc341aE4df32442Cf80F34f41Dc1782fE067",
    name: "BRL NEAR/ETH",
    link: "https://swap.auroraswap.net/#/add/0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d/0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB",
    components: ["near", "eth"],
  },
  rewardTokens: ["brl"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.AURORASWAP,
  details: {
    apiKey: "ALP-NEAR-ETH",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pALP NEAR/ETH",
    farmDepositTokenName: "pALP NEAR/ETH",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_BRL_NEAR_ETH);

export const JAR_AURORA_BRL_NEAR_LUNA: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 5l",
  contract: "0x5583D1E47884ba3bbe7E66B564782151114f5ddE",
  startBlock: 56703254, startTimestamp: 1641330980,
  depositToken: {
    addr: "0x388D5EE199aC8dAD049B161b57487271Cd787941",
    name: "BRL NEAR/LUNA",
    link: "https://swap.auroraswap.net/#/add/0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d/0xC4bdd27c33ec7daa6fcfd8532ddB524Bf4038096",
    components: ["near", "luna"],
    nativePath: {
      //UniswapV2Router02 (Trisolaris)--> [WETH, NEAR]
      target: "0x2CB45Edb4517d5947aFdE3BEAbF95A582506858B",
      path: [
        "0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB",
        "0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d",
      ],
    },
  },
  rewardTokens: ["brl"],
  enablement: AssetEnablement.WITHDRAW_ONLY,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.AURORASWAP,
  details: {
    apiKey: "ALP-NEAR-LUNA",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pALP NEAR/LUNA",
    farmDepositTokenName: "pALP NEAR/LUNA",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_BRL_NEAR_LUNA);

export const JAR_AURORA_BRL_USDC_NEAR: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 5m",
  contract: "0xcd71713171fe53Fc1D9EF4C034052669Eb978c20",
  startBlock: 56703657, startTimestamp: 1641331461,
  depositToken: {
    addr: "0x480A68bA97d70495e80e11e05D59f6C659749F27",
    name: "BRL USDC/NEAR",
    link: "https://swap.auroraswap.net/#/add/0xB12BFcA5A55806AaF64E99521918A4bf0fC40802/0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d",
    components: ["usdc", "near"],
    nativePath: {
      //UniswapV2Router02 (Trisolaris)--> [WETH, NEAR]
      target: "0x2CB45Edb4517d5947aFdE3BEAbF95A582506858B",
      path: [
        "0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB",
        "0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d",
      ],
    },
  },
  rewardTokens: ["brl"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.AURORASWAP,
  details: {
    apiKey: "ALP-USDC-NEAR",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pALP USDC/NEAR",
    farmDepositTokenName: "pALP USDC/NEAR",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_BRL_USDC_NEAR);

export const JAR_AURORA_BRL_USDT_NEAR: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 5n",
  contract: "0xD06Bfe30e9AD42Bb92bab8930300BBE98BBe12B7",
  startBlock: 56704057, startTimestamp: 1641331934,
  depositToken: {
    addr: "0xF3DE9dc38f62608179c45fE8943a0cA34Ba9CEfc",
    name: "BRL USDT/NEAR",
    link: "https://swap.auroraswap.net/#/add/0x4988a896b1227218e4A686fdE5EabdcAbd91571f/0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d",
    components: ["usdt", "near"],
    nativePath: {
      //UniswapV2Router02 (Trisolaris)--> [WETH, NEAR]
      target: "0x2CB45Edb4517d5947aFdE3BEAbF95A582506858B",
      path: [
        "0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB",
        "0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d",
      ],
    },
  },
  rewardTokens: ["brl"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.AURORASWAP,
  details: {
    apiKey: "ALP-USDT-NEAR",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pALP USDT/NEAR",
    farmDepositTokenName: "pALP USDT/NEAR",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_BRL_USDT_NEAR);

export const JAR_AURORA_BRL_USDT_USDC: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 5o",
  contract: "0x4F5bd36925e1a141Ebb34f94Be00bdc4A3fc7034",
  startBlock: 56704433, startTimestamp: 1641332387,
  depositToken: {
    addr: "0xEc538fAfaFcBB625C394c35b11252cef732368cd",
    name: "BRL USDT/USDC",
    link: "https://swap.auroraswap.net/#/add/0x4988a896b1227218e4A686fdE5EabdcAbd91571f/0xB12BFcA5A55806AaF64E99521918A4bf0fC40802",
    components: ["usdt", "usdc"],
    nativePath: {
      //UniswapV2Router02 (Trisolaris)--> [WETH, USDC]
      target: "0x2CB45Edb4517d5947aFdE3BEAbF95A582506858B",
      path: [
        "0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB",
        "0xB12BFcA5A55806AaF64E99521918A4bf0fC40802",
      ],
    },
  },
  rewardTokens: ["brl"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.AURORASWAP,
  details: {
    apiKey: "ALP-USDT-USDC",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pALP USDT/USDC",
    farmDepositTokenName: "pALP USDT/USDC",
  },
  tags: ["stablecoins"],
};
JAR_DEFINITIONS.push(JAR_AURORA_BRL_USDT_USDC);

export const JAR_AURORA_BRL_UST_NEAR: JarDefinition = {
  type: AssetType.JAR,
  id: "nearJar 5p",
  contract: "0xD701e3E627f30458ee24dBeeDf11BDAA20B96dAe",
  startBlock: 56704663, startTimestamp: 1641332662,
  depositToken: {
    addr: "0x729dB9dB6d3cA82EF7e4c886C352749758BaD0eb",
    name: "BRL UST/NEAR",
    link: "https://swap.auroraswap.net/#/add/0x5ce9F0B6AFb36135b5ddBF11705cEB65E634A9dC/0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d",
    components: ["ust", "near"],
    nativePath: {
      //UniswapV2Router02 (Trisolaris)--> [WETH, NEAR]
      target: "0x2CB45Edb4517d5947aFdE3BEAbF95A582506858B",
      path: [
        "0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB",
        "0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d",
      ],
    },
  },
  rewardTokens: ["brl"],
  enablement: AssetEnablement.PERMANENTLY_DISABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.AURORASWAP,
  details: {
    apiKey: "ALP-UST-NEAR",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pALP UST/NEAR",
    farmDepositTokenName: "pALP UST/NEAR",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_BRL_UST_NEAR);

export const JAR_AURORA_TRI_PLY_NEAR: JarDefinition = {
  type: AssetType.JAR,
  id: "auroraJar 3a",
  contract: "0x46d42C3DcCC38B92f40b021008AcDc76ab463B12",
  startBlock: 64969978, startTimestamp: 1651784666,
  depositToken: {
    addr: "0x044b6B0CD3Bb13D2b9057781Df4459C66781dCe7",
    name: "TRI PLY/NEAR",
    link: "https://www.trisolaris.io/#/add/0x09C9D464b58d96837f8d8b6f4d9fE4aD408d3A4f/0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d",
    components: ["ply", "near"],
    nativePath: {
      //UniswapV2Router02 (Trisolaris)--> [WETH, NEAR]
      target: "0x2CB45Edb4517d5947aFdE3BEAbF95A582506858B",
      path: [
        "0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB",
        "0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d",
      ],
    },
  },
  rewardTokens: ["ply"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Aurora,
  protocol: AssetProtocol.TRISOLARIS,
  details: {
    apiKey: "TRI-PLY-NEAR",
    harvestStyle: HarvestStyle.CUSTOM,
  },
  farm: {
    farmAddress: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
    farmNickname: "pTRI PLY/NEAR",
    farmDepositTokenName: "pTRI PLY/NEAR",
  },
};
JAR_DEFINITIONS.push(JAR_AURORA_TRI_PLY_NEAR);

// Metis
export const JAR_METIS_NETSWAP_NETT_METIS: JarDefinition = {
  type: AssetType.JAR,
  id: "metJar 1a",
  contract: "0xaDd50d6396B53876ac58752E153E3431C1E9bA93",
  startBlock: 318292, startTimestamp: 1641855681,
  depositToken: {
    addr: "0x60312d4EbBF3617d3D33841906b5868A86931Cbd",
    name: "NET NETT/METIS",
    link: "https://netswap.io/#/add/0x90fe084f877c65e1b577c7b2ea64b8d8dd1ab278/0xdeaddeaddeaddeaddeaddeaddeaddeaddead0000",
    components: ["nett", "metis"],
  },
  rewardTokens: ["nett"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Metis,
  protocol: AssetProtocol.NETSWAP,
  details: {
    apiKey: "NLP-NETT-METIS",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pNLP NETT/METIS",
    farmDepositTokenName: "pNLP NETT/METIS",
  },
};
JAR_DEFINITIONS.push(JAR_METIS_NETSWAP_NETT_METIS);

export const JAR_METIS_NETSWAP_BNB_NETT: JarDefinition = {
  type: AssetType.JAR,
  id: "metJar 1b",
  contract: "0x9c461DA93004A494fb6E92Ed998A398c0e389533",
  startBlock: 328085, startTimestamp: 1641900112, 
  depositToken: {
    addr: "0x3bF77b9192579826f260Bc48F2214Dfba840fcE5",
    name: "NET BNB/NETT",
    link: "https://netswap.io/#/add/0x2692BE44A6E38B698731fDDf417d060f0d20A0cB/0x90fE084F877C65e1b577c7b2eA64B8D8dd1AB278",
    components: ["bnb", "nett"],
    nativePath: {
      //NetswapRouter --> METIS, NETT
      target: "0x1E876cCe41B7b844FDe09E38Fa1cf00f213bFf56",
      path: [
        "0xdeaddeaddeaddeaddeaddeaddeaddeaddead0000",
        "0x90fE084F877C65e1b577c7b2eA64B8D8dd1AB278",
      ],
    },
  },
  rewardTokens: ["nett"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Metis,
  protocol: AssetProtocol.NETSWAP,
  details: {
    apiKey: "NLP-BNB-NETT",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pNLP BNB/NETT",
    farmDepositTokenName: "pNLP BNB/NETT",
  },
};
JAR_DEFINITIONS.push(JAR_METIS_NETSWAP_BNB_NETT);

export const JAR_METIS_NETSWAP_ETH_METIS: JarDefinition = {
  type: AssetType.JAR,
  id: "metJar 1c",
  contract: "0x8dF965E1791f3948158BA0C0A05702EA67861489",
  startBlock: 328085, startTimestamp: 1641900112,
  depositToken: {
    addr: "0x59051b5f5172b69e66869048dc69d35db0b3610d",
    name: "NET ETH/METIS",
    link: "https://netswap.io/#/add/0x420000000000000000000000000000000000000A/0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000",
    components: ["eth", "metis"],
  },
  rewardTokens: ["nett"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Metis,
  protocol: AssetProtocol.NETSWAP,
  details: {
    apiKey: "NLP-ETH-METIS",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pNLP ETH/METIS",
    farmDepositTokenName: "pNLP ETH/METIS",
  },
};
JAR_DEFINITIONS.push(JAR_METIS_NETSWAP_ETH_METIS);

export const JAR_METIS_NETSWAP_ETH_NETT: JarDefinition = {
  type: AssetType.JAR,
  id: "metJar 1k",
  contract: "0x739267bF641756315434f6C1deC6f7eA137B561A",
  startBlock: 328150, startTimestamp: 1641900444,
  depositToken: {
    addr: "0xC8aE82A0ab6AdA2062B812827E1556c0fa448dd0",
    name: "NET ETH/NETT",
    link: "https://netswap.io/#/add/0x420000000000000000000000000000000000000A/0x90fE084F877C65e1b577c7b2eA64B8D8dd1AB278",
    components: ["eth", "nett"],
    nativePath: {
      //NetswapRouter --> METIS, WETH
      target: "0x1E876cCe41B7b844FDe09E38Fa1cf00f213bFf56",
      path: [
        "0xdeaddeaddeaddeaddeaddeaddeaddeaddead0000",
        "0x420000000000000000000000000000000000000A",
      ],
    },
  },
  rewardTokens: ["nett"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Metis,
  protocol: AssetProtocol.NETSWAP,
  details: {
    apiKey: "NLP-ETH-NETT",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pNLP ETH/NETT",
    farmDepositTokenName: "pNLP ETH/NETT",
  },
};
JAR_DEFINITIONS.push(JAR_METIS_NETSWAP_ETH_NETT);

export const JAR_METIS_NETSWAP_ETH_USDC: JarDefinition = {
  type: AssetType.JAR,
  id: "metJar 1d",
  contract: "0x69dd7bc7712596a93F09b556Eb8668D36f336885",
  startBlock: 328173, startTimestamp: 1641900860,
  depositToken: {
    addr: "0xF5988809ac97C65121e2c34f5D49558e3D12C253",
    name: "NET ETH/USDC",
    link: "https://netswap.io/#/add/0x420000000000000000000000000000000000000A/0xEA32A96608495e54156Ae48931A7c20f0dcc1a21",
    components: ["eth", "usdc"],
    nativePath: {
      //NetswapRouter --> METIS, USDC
      target: "0x1E876cCe41B7b844FDe09E38Fa1cf00f213bFf56",
      path: [
        "0xdeaddeaddeaddeaddeaddeaddeaddeaddead0000",
        "0xEA32A96608495e54156Ae48931A7c20f0dcc1a21",
      ],
    },
  },
  rewardTokens: ["nett"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Metis,
  protocol: AssetProtocol.NETSWAP,
  details: {
    apiKey: "NLP-ETH-USDC",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pNLP ETH/USDC",
    farmDepositTokenName: "pNLP ETH/USDC",
  },
};
JAR_DEFINITIONS.push(JAR_METIS_NETSWAP_ETH_USDC);

export const JAR_METIS_NETSWAP_ETH_USDT: JarDefinition = {
  type: AssetType.JAR,
  id: "metJar 1e",
  contract: "0x073068b3d575d6B1dF109a6E580db6A739c47158",
  startBlock: 328197, startTimestamp: 1641900952,
  depositToken: {
    addr: "0x4Db4CE7f5b43A6B455D3c3057b63A083b09b8376",
    name: "NET ETH/USDT",
    link: "https://netswap.io/#/add/0x420000000000000000000000000000000000000A/0xbB06DCA3AE6887fAbF931640f67cab3e3a16F4dC",
    components: ["eth", "usdt"],
    nativePath: {
      //NetswapRouter --> METIS, WETH
      target: "0x1E876cCe41B7b844FDe09E38Fa1cf00f213bFf56",
      path: [
        "0xdeaddeaddeaddeaddeaddeaddeaddeaddead0000",
        "0x420000000000000000000000000000000000000A",
      ],
    },
  },
  rewardTokens: ["nett"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Metis,
  protocol: AssetProtocol.NETSWAP,
  details: {
    apiKey: "NLP-ETH-USDT",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pNLP ETH/USDT",
    farmDepositTokenName: "pNLP ETH/USDT",
  },
};
JAR_DEFINITIONS.push(JAR_METIS_NETSWAP_ETH_USDT);

export const JAR_METIS_NETSWAP_METIS_USDC: JarDefinition = {
  type: AssetType.JAR,
  id: "metJar 1f",
  contract: "0x255832c3d5Ba7583bE132B2dacdD3d081cb44079",
  startBlock: 328228, startTimestamp: 1641901295,
  depositToken: {
    addr: "0x5Ae3ee7fBB3Cb28C17e7ADc3a6Ae605ae2465091",
    name: "NET METIS/USDC",
    link: "https://netswap.io/#/add/0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000/0xEA32A96608495e54156Ae48931A7c20f0dcc1a21",
    components: ["metis", "usdc"],
  },
  rewardTokens: ["nett"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Metis,
  protocol: AssetProtocol.NETSWAP,
  details: {
    apiKey: "NLP-METIS-USDC",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pNLP METIS/USDC",
    farmDepositTokenName: "pNLP METIS/USDC",
  },
};
JAR_DEFINITIONS.push(JAR_METIS_NETSWAP_METIS_USDC);

export const JAR_METIS_NETSWAP_NETT_USDC: JarDefinition = {
  type: AssetType.JAR,
  id: "metJar 1g",
  contract: "0xA4A94C04b8fF7B38314dEdD0bcF4Da3C48A463c0",
  startBlock: 328276, startTimestamp: 1641901506,
  depositToken: {
    addr: "0x0724d37522585E87d27C802728E824862Dc72861",
    name: "NET NETT/USDC",
    link: "https://netswap.io/#/add/0x90fE084F877C65e1b577c7b2eA64B8D8dd1AB278/0xEA32A96608495e54156Ae48931A7c20f0dcc1a21",
    components: ["nett", "usdc"],
    nativePath: {
      //NetswapRouter --> METIS, USDC
      target: "0x1E876cCe41B7b844FDe09E38Fa1cf00f213bFf56",
      path: [
        "0xdeaddeaddeaddeaddeaddeaddeaddeaddead0000",
        "0xEA32A96608495e54156Ae48931A7c20f0dcc1a21",
      ],
    },
  },
  rewardTokens: ["nett"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Metis,
  protocol: AssetProtocol.NETSWAP,
  details: {
    apiKey: "NLP-NETT-USDC",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pNLP NETT/USDC",
    farmDepositTokenName: "pNLP NETT/USDC",
  },
};
JAR_DEFINITIONS.push(JAR_METIS_NETSWAP_NETT_USDC);

export const JAR_METIS_NETSWAP_NETT_USDT: JarDefinition = {
  type: AssetType.JAR,
  id: "metJar 1h",
  contract: "0x57fFD8164E3332B95a042CC876023B1BfE8f81AA",
  startBlock: 328315, startTimestamp: 1641901731,
  depositToken: {
    addr: "0x7D02ab940d7dD2B771e59633bBC1ed6EC2b99Af1",
    name: "NET NETT/USDT",
    link: "https://netswap.io/#/add/0x90fE084F877C65e1b577c7b2eA64B8D8dd1AB278/0xbB06DCA3AE6887fAbF931640f67cab3e3a16F4dC",
    components: ["nett", "usdt"],
    nativePath: {
      //NetswapRouter --> METIS, USDT
      target: "0x1E876cCe41B7b844FDe09E38Fa1cf00f213bFf56",
      path: [
        "0xdeaddeaddeaddeaddeaddeaddeaddeaddead0000",
        "0xbB06DCA3AE6887fAbF931640f67cab3e3a16F4dC",
      ],
    },
  },
  rewardTokens: ["nett"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Metis,
  protocol: AssetProtocol.NETSWAP,
  details: {
    apiKey: "NLP-NETT-USDT",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pNLP NETT/USDT",
    farmDepositTokenName: "pNLP NETT/USDT",
  },
};
JAR_DEFINITIONS.push(JAR_METIS_NETSWAP_NETT_USDT);

export const JAR_METIS_NETSWAP_USDT_METIS: JarDefinition = {
  type: AssetType.JAR,
  id: "metJar 1i",
  contract: "0x3e4cc5307312fD0857E207880e731F4c71fDE1c7",
  startBlock: 328357, startTimestamp: 1641901808,
  depositToken: {
    addr: "0x3D60aFEcf67e6ba950b499137A72478B2CA7c5A1",
    name: "NET USDT/METIS",
    link: "https://netswap.io/#/add/0xbB06DCA3AE6887fAbF931640f67cab3e3a16F4dC/0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000",
    components: ["usdt", "metis"],
  },
  rewardTokens: ["nett"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Metis,
  protocol: AssetProtocol.NETSWAP,
  details: {
    apiKey: "NLP-USDT-METIS",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pNLP USDT/METIS",
    farmDepositTokenName: "pNLP USDT/METIS",
  },
};
JAR_DEFINITIONS.push(JAR_METIS_NETSWAP_USDT_METIS);

export const JAR_METIS_NETSWAP_USDT_USDC: JarDefinition = {
  type: AssetType.JAR,
  id: "metJar 1j",
  contract: "0x5b64b5382d68a934004578d6bE3e482b455EDfa2",
  startBlock: 328438, startTimestamp: 1641902095,
  depositToken: {
    addr: "0x1caD5f8f5D4C0AD49646B2565CC0cA725E4280EA",
    name: "NET USDT/USDC",
    link: "https://netswap.io/#/add/0xbB06DCA3AE6887fAbF931640f67cab3e3a16F4dC/0xEA32A96608495e54156Ae48931A7c20f0dcc1a21",
    components: ["usdt", "usdc"],
    nativePath: {
      //NetswapRouter --> METIS, USDC
      target: "0x1E876cCe41B7b844FDe09E38Fa1cf00f213bFf56",
      path: [
        "0xdeaddeaddeaddeaddeaddeaddeaddeaddead0000",
        "0xEA32A96608495e54156Ae48931A7c20f0dcc1a21",
      ],
    },
  },
  rewardTokens: ["nett"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Metis,
  protocol: AssetProtocol.NETSWAP,
  details: {
    apiKey: "NLP-USDT-USDC",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pNLP USDT/USDC",
    farmDepositTokenName: "pNLP USDT/USDC",
  },
  tags: ["stablecoins"],
};
JAR_DEFINITIONS.push(JAR_METIS_NETSWAP_USDT_USDC);

export const JAR_METIS_NETSWAP_WBTC_METIS: JarDefinition = {
  type: AssetType.JAR,
  id: "metJar 1l",
  contract: "0x56A4ef91C841054B03a963b644F31F51F4Dcb1A5",
  startBlock: 991482, startTimestamp: 1645652648,
  depositToken: {
    addr: "0xE0cc462fe369146BAef2306EC6B4BF26704eE84e",
    name: "NET WBTC/METIS",
    link: "https://netswap.io/#/add/0xa5B55ab1dAF0F8e1EFc0eB1931a957fd89B918f4/0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000",
    components: ["wbtc", "metis"],
  },
  rewardTokens: ["nett"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Metis,
  protocol: AssetProtocol.NETSWAP,
  details: {
    apiKey: "NLP-WBTC-METIS",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x22cE2F89d2efd9d4eFba4E0E51d73720Fa81A150",
    farmNickname: "pNLP WBTC/METIS",
    farmDepositTokenName: "pNLP WBTC/METIS",
  },
};
JAR_DEFINITIONS.push(JAR_METIS_NETSWAP_WBTC_METIS);

export const JAR_METIS_NETSWAP_WBTC_USDT: JarDefinition = {
  type: AssetType.JAR,
  id: "metJar 1m",
  contract: "0xC717887F87E9Eda909F85aD78682bc020f5232F1",
  startBlock: 993242, startTimestamp: 1645666693,
  depositToken: {
    addr: "0xAd9b903451dfdc3D79d2021289F9d864fd8c8119",
    name: "NET WBTC/USDT",
    link: "https://netswap.io/#/add/0xa5B55ab1dAF0F8e1EFc0eB1931a957fd89B918f4/0xbB06DCA3AE6887fAbF931640f67cab3e3a16F4dC",
    components: ["wbtc", "usdt"],
    nativePath: {
      //NetswapRouter --> METIS, USDT
      target: "0x1E876cCe41B7b844FDe09E38Fa1cf00f213bFf56",
      path: [
        "0xdeaddeaddeaddeaddeaddeaddeaddeaddead0000",
        "0xbB06DCA3AE6887fAbF931640f67cab3e3a16F4dC",
      ],
    },
  },
  rewardTokens: ["nett"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Metis,
  protocol: AssetProtocol.NETSWAP,
  details: {
    apiKey: "NLP-WBTC-USDT",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x22cE2F89d2efd9d4eFba4E0E51d73720Fa81A150",
    farmNickname: "pNLP WBTC/USDT",
    farmDepositTokenName: "pNLP WBTC/USDT",
  },
};
JAR_DEFINITIONS.push(JAR_METIS_NETSWAP_WBTC_USDT);

export const JAR_METIS_NETSWAP_BYTE_USDC: JarDefinition = {
  type: AssetType.JAR,
  id: "metJar 1o",
  contract: "0xC92914c1f1dF2284D9A3C5BB480089311Ed49358",
  startBlock: 1692531, startTimestamp: 1647552630,
  depositToken: {
    addr: "0x3Ab6be89ED5A0d4FDD412c246F5e6DdD250Dd45c",
    name: "NET BYTE/USDC",
    link: "https://netswap.io/#/add/0x721532bC0dA5ffaeB0a6A45fB24271E8098629A7/0xEA32A96608495e54156Ae48931A7c20f0dcc1a21",
    components: ["byte", "usdc"],
  },
  rewardTokens: ["nett", "metis"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Metis,
  protocol: AssetProtocol.NETSWAP,
  details: {
    apiKey: "NLP-BYTE-USDC",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0x69094096DaEaFA96F49438Beda6B0e0950E4BF02",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pNLP BYTE/USDC",
    farmDepositTokenName: "pNLP BYTE/USDC",
  },
};
JAR_DEFINITIONS.push(JAR_METIS_NETSWAP_BYTE_USDC);

export const JAR_METIS_NETSWAP_BUSD_USDC: JarDefinition = {
  type: AssetType.JAR,
  id: "metJar 1p",
  contract: "0xFEfBB3CeacAB3a682C34E25A1b4A330771D46b0D",
  startBlock: 1788844, startTimestamp: 1647904527,
  depositToken: {
    addr: "0x8014c801F6cF32445D503f7BaC30976B3161eE52",
    name: "NET BUSD/USDC",
    link: "https://netswap.io/#/add/0x12D84f1CFe870cA9C9dF9785f8954341d7fbb249/0xEA32A96608495e54156Ae48931A7c20f0dcc1a21",
    components: ["busd", "usdc"],
  },
  rewardTokens: ["nett"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Metis,
  protocol: AssetProtocol.NETSWAP,
  details: {
    apiKey: "NLP-BUSD-USDC",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0x69094096DaEaFA96F49438Beda6B0e0950E4BF02",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pNLP BUSD/USDC",
    farmDepositTokenName: "pNLP BUSD/USDC",
  },
  tags: ["stablecoins"],
};
JAR_DEFINITIONS.push(JAR_METIS_NETSWAP_BUSD_USDC);

export const JAR_METIS_NETSWAP_HERA_USDC: JarDefinition = {
  type: AssetType.JAR,
  id: "metJar 1q",
  contract: "0x55F2B96c55B65610ACb3c4F2E0946cDd2a5490ad",
  startBlock: 2232251, startTimestamp: 1649396533,
  depositToken: {
    addr: "0x948f9614628d761f86B672F134Fc273076C4D623",
    name: "NET HERA/USDC",
    link: "https://netswap.io/#/add/0x6F05709bc91Bad933346F9E159f0D3FdBc2c9DCE/0xEA32A96608495e54156Ae48931A7c20f0dcc1a21",
    components: ["hera", "usdc"],
  },
  rewardTokens: ["nett, hera"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Metis,
  protocol: AssetProtocol.NETSWAP,
  details: {
    apiKey: "NLP-HERA-USDC",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pNLP HERA/USDC",
    farmDepositTokenName: "pNLP HERA/USDC",
  },
};
JAR_DEFINITIONS.push(JAR_METIS_NETSWAP_HERA_USDC);

export const JAR_METIS_TETHYS_METIS: JarDefinition = {
  type: AssetType.JAR,
  id: "metJar 2a",
  contract: "0xC3f393FB40F8Cc499C1fe7FA5781495dc6FAc9E9",
  startBlock: 184213, startTimestamp: 1641293499,
  depositToken: {
    addr: "0xc9b290FF37fA53272e9D71A0B13a444010aF4497",
    name: "TETHYS TETHYS/METIS",
    link: "https://tethys.finance/pool/add?inputCurrency=METIS&outputCurrency=0x69fdb77064ec5c84FA2F21072973eB28441F43F3",
    components: ["tethys", "metis"],
  },
  rewardTokens: ["tethys"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Metis,
  protocol: AssetProtocol.TETHYS,
  details: {
    apiKey: "TLP-TETHYS-METIS",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pTLP TETHYS/METIS",
    farmDepositTokenName: "pTLP TETHYS/METIS",
  },
};
JAR_DEFINITIONS.push(JAR_METIS_TETHYS_METIS);

export const JAR_METIS_TETHYS_ETH_METIS: JarDefinition = {
  type: AssetType.JAR,
  id: "metJar 2b",
  contract: "0xC33d6596328935FA558A8d501f8fb15eD56ff879",
  startBlock: 309786, startTimestamp: 1641828109,
  depositToken: {
    addr: "0xEE5adB5b0DfC51029Aca5Ad4Bc684Ad676b307F7",
    name: "TETHYS ETH/METIS",
    link: "https://tethys.finance/pool/add?inputCurrency=0x420000000000000000000000000000000000000A&outputCurrency=METIS",
    components: ["eth", "metis"],
  },
  rewardTokens: ["tethys"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Metis,
  protocol: AssetProtocol.TETHYS,
  details: {
    apiKey: "TLP-ETH-METIS",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pTLP ETH/METIS",
    farmDepositTokenName: "pTLP ETH/METIS",
  },
};
JAR_DEFINITIONS.push(JAR_METIS_TETHYS_ETH_METIS);

export const JAR_METIS_TETHYS_METIS_USDC: JarDefinition = {
  type: AssetType.JAR,
  id: "metJar 2c",
  contract: "0x12334d225c8Efc3eFFe56A5CeF5aEDFEf3f6ca7F",
  startBlock: 327898, startTimestamp: 1641899050,
  depositToken: {
    addr: "0xDd7dF3522a49e6e1127bf1A1d3bAEa3bc100583B",
    name: "TETHYS METIS/USDC",
    link: "https://tethys.finance/pool/add?inputCurrency=METIS&outputCurrency=0xEA32A96608495e54156Ae48931A7c20f0dcc1a21",
    components: ["metis", "usdc"],
  },
  rewardTokens: ["tethys"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Metis,
  protocol: AssetProtocol.TETHYS,
  details: {
    apiKey: "TLP-METIS-USDC",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pTLP METIS/USDC",
    farmDepositTokenName: "pTLP METIS/USDC",
  },
};
JAR_DEFINITIONS.push(JAR_METIS_TETHYS_METIS_USDC);

export const JAR_METIS_TETHYS_USDT_METIS: JarDefinition = {
  type: AssetType.JAR,
  id: "metJar 2d",
  contract: "0x0289035c5a5836597061C4A25A72DDa02F597E10",
  startBlock: 328045, startTimestamp: 1641900046,
  depositToken: {
    addr: "0x8121113eB9952086deC3113690Af0538BB5506fd",
    name: "TETHYS USDT/METIS",
    link: "https://tethys.finance/pool/add?inputCurrency=0xbB06DCA3AE6887fAbF931640f67cab3e3a16F4dC&outputCurrency=METIS",
    components: ["usdt", "metis"],
  },
  rewardTokens: ["tethys"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Metis,
  protocol: AssetProtocol.TETHYS,
  details: {
    apiKey: "TLP-USDT-METIS",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pTLP USDT/METIS",
    farmDepositTokenName: "pTLP USDT/METIS",
  },
};
JAR_DEFINITIONS.push(JAR_METIS_TETHYS_USDT_METIS);

export const JAR_METIS_HADES_METIS: JarDefinition = {
  type: AssetType.JAR,
  id: "metJar 2e",
  contract: "0x3657dE6D8F500a4e91370Fb8c738D33C5010541f",
  startBlock: 525691, startTimestamp: 1642580463,
  depositToken: {
    addr: "0x586f616Bb811F1b0dFa953FBF6DE3569e7919752",
    name: "TETHYS HADES/METIS",
    link: "https://tethys.finance/pool/add?inputCurrency=0x88c37e0bc6a237e96bc4a82774a38bbc30eff3cf&outputCurrency=METIS",
    components: ["hades", "metis"],
  },
  rewardTokens: ["tethys"],
  enablement: AssetEnablement.DISABLED,
  chain: ChainNetwork.Metis,
  protocol: AssetProtocol.TETHYS,
  details: {
    apiKey: "TLP-HADES-METIS",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pTLP HADES/METIS",
    farmDepositTokenName: "pTLP HADES/METIS",
  },
};
JAR_DEFINITIONS.push(JAR_METIS_HADES_METIS);

export const JAR_METIS_HELLSHARE_METIS: JarDefinition = {
  type: AssetType.JAR,
  id: "metJar 2f",
  contract: "0xD46998a580Ca8cB3b4f805A36CD23054874115ee",
  startBlock: 525764, startTimestamp: 1642580721,
  depositToken: {
    addr: "0xCD1cc85DC7b4Deef34247CCB5d7C42A58039b1bA",
    name: "TETHYS HELLSHARE/METIS",
    link: "https://tethys.finance/pool/add?inputCurrency=0xefb15ef34f85632fd1d4c17fc130ccee3d3d48ae&outputCurrency=METIS",
    components: ["hellshare", "metis"],
  },
  rewardTokens: ["tethys"],
  enablement: AssetEnablement.DISABLED,
  chain: ChainNetwork.Metis,
  protocol: AssetProtocol.TETHYS,
  details: {
    apiKey: "TLP-HELLSHARE-METIS",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pTLP HELLSHARE/METIS",
    farmDepositTokenName: "pTLP HELLSHARE/METIS",
  },
};
JAR_DEFINITIONS.push(JAR_METIS_HELLSHARE_METIS);

export const JAR_METIS_TETHYS_WBTC_METIS: JarDefinition = {
  type: AssetType.JAR,
  id: "metJar 2g",
  contract: "0xd332b8B997ED54D2a3361c45dA9CDF05bc26C745",
  startBlock: 993312, startTimestamp: 1645667497,
  depositToken: {
    addr: "0xA0081C6D591c53Ae651bD71B8d90C83C1F1106C2",
    name: "TETHYS WBTC/METIS",
    link: "https://tethys.finance/pool/add?inputCurrency=METIS&outputCurrency=0xa5B55ab1dAF0F8e1EFc0eB1931a957fd89B918f4",
    components: ["wbtc", "metis"],
  },
  rewardTokens: ["tethys"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Metis,
  protocol: AssetProtocol.TETHYS,
  details: {
    apiKey: "TLP-WBTC-METIS",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: "0x22cE2F89d2efd9d4eFba4E0E51d73720Fa81A150",
    farmNickname: "pTLP WBTC/METIS",
    farmDepositTokenName: "pTLP WBTC/METIS",
  },
};
JAR_DEFINITIONS.push(JAR_METIS_TETHYS_WBTC_METIS);

export const JAR_METIS_TETHYS_METIS_DAI: JarDefinition = {
  type: AssetType.JAR,
  id: "metJar 2h",
  contract: "0x4bDA2B3862116d6C26B858354667A981BDCcA047",
  startBlock: 1687592, startTimestamp: 1647543137,
  depositToken: {
    addr: "0xCc15d8f93be780aD78fD1A016fB0F15F2543b5Dc",
    name: "TETHYS METIS/DAI",
    link: "https://tethys.finance/pool/add?inputCurrency=METIS&outputCurrency=0x4651B38e7ec14BB3db731369BFE5B08F2466Bd0A",
    components: ["metis", "dai"],
  },
  rewardTokens: ["tethys"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Metis,
  protocol: AssetProtocol.TETHYS,
  details: {
    apiKey: "TLP-METIS-DAI",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0x69094096DaEaFA96F49438Beda6B0e0950E4BF02",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pTLP METIS/DAI",
    farmDepositTokenName: "pTLP METIS/DAI",
  },
};
JAR_DEFINITIONS.push(JAR_METIS_TETHYS_METIS_DAI);

export const JAR_METIS_TETHYS_METIS_AVAX: JarDefinition = {
  type: AssetType.JAR,
  id: "metJar 2i",
  contract: "0x97C2df1D75632A5d2D0237B5c46e2fB58185a7fD",
  startBlock: 1688168, startTimestamp: 1647544457,
  depositToken: {
    addr: "0x3Ca47677e7D8796e6470307Ad15c1fBFd43f0D6F",
    name: "TETHYS METIS/AVAX",
    link: "https://tethys.finance/pool/add?inputCurrency=METIS&outputCurrency=0xE253E0CeA0CDD43d9628567d097052B33F98D611",
    components: ["metis", "avax"],
  },
  rewardTokens: ["tethys"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Metis,
  protocol: AssetProtocol.TETHYS,
  details: {
    apiKey: "TLP-METIS-AVAX",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0x69094096DaEaFA96F49438Beda6B0e0950E4BF02",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pTLP METIS/AVAX",
    farmDepositTokenName: "pTLP METIS/AVAX",
  },
};
JAR_DEFINITIONS.push(JAR_METIS_TETHYS_METIS_AVAX);

export const JAR_METIS_TETHYS_METIS_FTM: JarDefinition = {
  type: AssetType.JAR,
  id: "metJar 2j",
  contract: "0x909eD0407D21ADa0E8336c24f19C1a177827d156",
  startBlock: 1688704, startTimestamp: 1647545973,
  depositToken: {
    addr: "0x74Ca39F7aB9B685B8eA8c4ab19E7Ab6b474Dd22D",
    name: "TETHYS METIS/FTM",
    link: "https://tethys.finance/pool/add?inputCurrency=METIS&outputCurrency=0xa9109271abcf0C4106Ab7366B4eDB34405947eED",
    components: ["metis", "ftm"],
  },
  rewardTokens: ["tethys"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Metis,
  protocol: AssetProtocol.TETHYS,
  details: {
    apiKey: "TLP-METIS-FTM",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0x69094096DaEaFA96F49438Beda6B0e0950E4BF02",
  },
  farm: {
    farmAddress: "0x22cE2F89d2efd9d4eFba4E0E51d73720Fa81A150",
    farmNickname: "pTLP METIS/FTM",
    farmDepositTokenName: "pTLP METIS/FTM",
  },
};
JAR_DEFINITIONS.push(JAR_METIS_TETHYS_METIS_FTM);

export const JAR_METIS_HUMMUS_USDT: JarDefinition = {
  type: AssetType.JAR,
  id: "metJar 3a",
  contract: "0x8cd9E4734a2b6376380AF61db50185D1146fc7d7",
  startBlock: 2375823, startTimestamp: 1650406772,
  depositToken: {
    addr: "0x9F51f0D7F500343E969D28010C7Eb0Db1bCaAEf9",
    name: "HUMMUS m.USDT",
    link: "https://app.hummus.exchange/pool",
    components: ["usdt"],
    decimals: 6,
  },
  rewardTokens: ["hum"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Metis,
  protocol: AssetProtocol.HUMMUS,
  details: {
    apiKey: "METIS-HUMMUS-USDT",
    harvestStyle: HarvestStyle.PASSIVE,
    decimals: 6,
  },
  docsKey: SINGLE_STAKING_ANY_PROTOCOL_DESCRIPTION,
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pHUM USDT",
    farmDepositTokenName: "pHUM USDT",
  },
};
JAR_DEFINITIONS.push(JAR_METIS_HUMMUS_USDT);

export const JAR_METIS_HUMMUS_USDC: JarDefinition = {
  type: AssetType.JAR,
  id: "metJar 3b",
  contract: "0x6279e6c2A103A6Aa4Baa56De23E9aCfF9613eaB2",
  startBlock: 2375823, startTimestamp: 1650406772, 
  depositToken: {
    addr: "0x9E3F3Be65fEc3731197AFF816489eB1Eb6E6b830",
    name: "HUMMUS m.USDC",
    link: "https://app.hummus.exchange/pool",
    components: ["usdc"],
    decimals: 6,
  },
  rewardTokens: ["hum"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Metis,
  protocol: AssetProtocol.HUMMUS,
  details: {
    apiKey: "METIS-HUMMUS-USDC",
    harvestStyle: HarvestStyle.PASSIVE,
    decimals: 6,
  },
  docsKey: SINGLE_STAKING_ANY_PROTOCOL_DESCRIPTION,
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pHUM USDC",
    farmDepositTokenName: "pHUM USDC",
  },
};
JAR_DEFINITIONS.push(JAR_METIS_HUMMUS_USDC);

export const JAR_METIS_HUMMUS_DAI: JarDefinition = {
  type: AssetType.JAR,
  id: "metJar 3c",
  contract: "0x4E220e8cdf0398e7e5D1EBf86bc6459567A0CE17",
  startBlock: 2375823, startTimestamp: 1650406772, 
  depositToken: {
    addr: "0xd5A0760D55ad46B6A1C46D28725e4C117312a7aD",
    name: "HUMMUS m.DAI",
    link: "https://app.hummus.exchange/pool",
    components: ["dai"],
  },
  rewardTokens: ["hum"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Metis,
  protocol: AssetProtocol.HUMMUS,
  details: {
    apiKey: "METIS-HUMMUS-DAI",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  docsKey: SINGLE_STAKING_ANY_PROTOCOL_DESCRIPTION,
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pHUM DAI",
    farmDepositTokenName: "pHUM DAI",
  },
};
JAR_DEFINITIONS.push(JAR_METIS_HUMMUS_DAI);

// Moonbeam

export const JAR_MOONBEAM_STELLA_GLMR: JarDefinition = {
  type: AssetType.JAR,
  id: "beamJar 1a",
  contract: "0xa9e5E86BA4e8E175e7eF7Ddd4ee30a28f90186e2",
  startBlock: 220187, startTimestamp: 1642503144,
  depositToken: {
    addr: "0x7F5Ac0FC127bcf1eAf54E3cd01b00300a0861a62",
    name: "STELLA STELLA/GLMR",
    link: "https://app.stellaswap.com/exchange/add/ETH/0x0E358838ce72d5e61E0018a2ffaC4bEC5F4c88d2",
    components: ["stella", "glmr"],
  },
  rewardTokens: ["stella"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Moonbeam,
  protocol: AssetProtocol.STELLA,
  details: {
    apiKey: "SLP-STELLA-GLMR",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSLP STELLA/GLMR",
    farmDepositTokenName: "pTLP STELLA/GLMR",
  },
};
JAR_DEFINITIONS.push(JAR_MOONBEAM_STELLA_GLMR);

export const JAR_MOONBEAM_STELLA_USDC_BNB: JarDefinition = {
  type: AssetType.JAR,
  id: "beamJar 1b",
  contract: "0x1b33D8A89aE9F5Bf62D35D5f31aEC24cfd0aec7b",
  startBlock: 223431, startTimestamp: 1642543284,
  depositToken: {
    addr: "0xAc2657ba28768FE5F09052f07A9B7ea867A4608f",
    name: "STELLA USDC/BNB",
    link: "https://app.stellaswap.com/exchange/add/0x818ec0A7Fe18Ff94269904fCED6AE3DaE6d6dC0b/0xc9BAA8cfdDe8E328787E29b4B078abf2DaDc2055",
    components: ["usdc", "bnb"],
    nativePath: {
      //Beam Router --> WGLMR, USDC
      target: "0x96b244391D98B62D19aE89b1A4dCcf0fc56970C7",
      path: [
        "0xacc15dc74880c9944775448304b263d191c6077f",
        "0x818ec0A7Fe18Ff94269904fCED6AE3DaE6d6dC0b",
      ],
    },
  },
  rewardTokens: ["stella"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Moonbeam,
  protocol: AssetProtocol.STELLA,
  details: {
    apiKey: "SLP-USDC-BNB",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSLP USDC/BNB",
    farmDepositTokenName: "pSLP USDC/BNB",
  },
};
JAR_DEFINITIONS.push(JAR_MOONBEAM_STELLA_USDC_BNB);

export const JAR_MOONBEAM_STELLA_BUSD_GLMR: JarDefinition = {
  type: AssetType.JAR,
  id: "beamJar 1c",
  contract: "0xF9E25233293c8DA2f9b929F31454e0388fDD5094",
  startBlock: 223523, startTimestamp: 1642544436,
  depositToken: {
    addr: "0x367c36dAE9ba198A4FEe295c22bC98cB72f77Fe1",
    name: "STELLA BUSD/GLMR",
    link: "https://app.stellaswap.com/exchange/add/0xA649325Aa7C5093d12D6F98EB4378deAe68CE23F/ETH",
    components: ["busd", "glmr"],
  },
  rewardTokens: ["stella"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Moonbeam,
  protocol: AssetProtocol.STELLA,
  details: {
    apiKey: "SLP-BUSD-GLMR",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSLP BUSD/GLMR",
    farmDepositTokenName: "pSLP BUSD/GLMR",
  },
};
JAR_DEFINITIONS.push(JAR_MOONBEAM_STELLA_BUSD_GLMR);

export const JAR_MOONBEAM_STELLA_USDC_DAI: JarDefinition = {
  type: AssetType.JAR,
  id: "beamJar 1d",
  contract: "0x49Aa0dEceA6fb02366253aDe93eE12962840CfeA",
  startBlock: 223576, startTimestamp: 1642545090,
  depositToken: {
    addr: "0x5Ced2f8DD70dc25cbA10ad18c7543Ad9ad5AEeDD",
    name: "STELLA USDC/DAI",
    link: "https://app.stellaswap.com/exchange/add/0x818ec0A7Fe18Ff94269904fCED6AE3DaE6d6dC0b/0x765277EebeCA2e31912C9946eAe1021199B39C61",
    components: ["usdc", "dai"],
    nativePath: {
      //Beam Router --> WGLMR, USDC
      target: "0x96b244391D98B62D19aE89b1A4dCcf0fc56970C7",
      path: [
        "0xacc15dc74880c9944775448304b263d191c6077f",
        "0x818ec0A7Fe18Ff94269904fCED6AE3DaE6d6dC0b",
      ],
    },
  },
  rewardTokens: ["stella"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Moonbeam,
  protocol: AssetProtocol.STELLA,
  details: {
    apiKey: "SLP-USDC-DAI",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSLP USDC/DAI",
    farmDepositTokenName: "pSLP USDC/DAI",
  },
  tags: ["stablecoins"],
};
JAR_DEFINITIONS.push(JAR_MOONBEAM_STELLA_USDC_DAI);

export const JAR_MOONBEAM_STELLA_ETH_GLMR: JarDefinition = {
  type: AssetType.JAR,
  id: "beamJar 1e",
  contract: "0xF125357f05c75F9beEA0Cc721D7a2A0eA03aaa63",
  startBlock: 223604, startTimestamp: 1642545438,
  depositToken: {
    addr: "0x49a1cC58dCf28D0139dAEa9c18A3ca23108E78B3",
    name: "STELLA ETH/GLMR",
    link: "https://app.stellaswap.com/exchange/add/0xfA9343C3897324496A05fC75abeD6bAC29f8A40f/ETH",
    components: ["eth", "glmr"],
  },
  rewardTokens: ["stella"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Moonbeam,
  protocol: AssetProtocol.STELLA,
  details: {
    apiKey: "SLP-ETH-GLMR",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSLP ETH/GLMR",
    farmDepositTokenName: "pSLP ETH/GLMR",
  },
};
JAR_DEFINITIONS.push(JAR_MOONBEAM_STELLA_ETH_GLMR);

export const JAR_MOONBEAM_STELLA_USDC_GLMR: JarDefinition = {
  type: AssetType.JAR,
  id: "beamJar 1f",
  contract: "0x32F601e12629FDa9ac981601593Cf1daBaA67871",
  startBlock: 223668, startTimestamp: 1642546224,
  depositToken: {
    addr: "0x555B74dAFC4Ef3A5A1640041e3244460Dc7610d1",
    name: "STELLA USDC/GLMR",
    link: "https://app.stellaswap.com/exchange/add/0x818ec0A7Fe18Ff94269904fCED6AE3DaE6d6dC0b/ETH",
    components: ["usdc", "glmr"],
  },
  rewardTokens: ["stella"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Moonbeam,
  protocol: AssetProtocol.STELLA,
  details: {
    apiKey: "SLP-USDC-GLMR",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSLP USDC/GLMR",
    farmDepositTokenName: "pSLP USDC/GLMR",
  },
};
JAR_DEFINITIONS.push(JAR_MOONBEAM_STELLA_USDC_GLMR);

export const JAR_MOONBEAM_STELLA_STELLA_USDC: JarDefinition = {
  type: AssetType.JAR,
  id: "beamJar 1g",
  contract: "0xE5855D0e892BaEAe1CFd7f1188754b6c4Fa30684",
  startBlock: 223694, startTimestamp: 1642546536,
  depositToken: {
    addr: "0x81e11a9374033d11Cc7e7485A7192AE37D0795D6",
    name: "STELLA STELLA/USDC",
    link: "https://app.stellaswap.com/exchange/add/0x0E358838ce72d5e61E0018a2ffaC4bEC5F4c88d2/0x818ec0A7Fe18Ff94269904fCED6AE3DaE6d6dC0b",
    components: ["stella", "usdc"],
    nativePath: {
      //Beam Router --> WGLMR, USDC
      target: "0x96b244391D98B62D19aE89b1A4dCcf0fc56970C7",
      path: [
        "0xacc15dc74880c9944775448304b263d191c6077f",
        "0x818ec0A7Fe18Ff94269904fCED6AE3DaE6d6dC0b",
      ],
    },
  },
  rewardTokens: ["stella"],
  enablement: AssetEnablement.WITHDRAW_ONLY,
  chain: ChainNetwork.Moonbeam,
  protocol: AssetProtocol.STELLA,
  details: {
    apiKey: "SLP-STELLA-USDC",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSLP STELLA/USDC",
    farmDepositTokenName: "pSLP STELLA/USDC",
  },
};
JAR_DEFINITIONS.push(JAR_MOONBEAM_STELLA_STELLA_USDC);

export const JAR_MOONBEAM_STELLA_USDC_USDT: JarDefinition = {
  type: AssetType.JAR,
  id: "beamJar 1h",
  contract: "0x20A6FcfEb3c54b9de503E18d0EA2934eC39d1C39",
  startBlock: 223788, startTimestamp: 1642547694,
  depositToken: {
    addr: "0x8BC3CceeF43392B315dDD92ba30b435F79b66b9e",
    name: "STELLA USDC/USDT",
    link: "https://app.stellaswap.com/exchange/add/0x818ec0A7Fe18Ff94269904fCED6AE3DaE6d6dC0b/0xeFAeeE334F0Fd1712f9a8cc375f427D9Cdd40d73",
    components: ["usdc", "usdt"],
    nativePath: {
      //Beam Router --> WGLMR, USDC
      target: "0x96b244391D98B62D19aE89b1A4dCcf0fc56970C7",
      path: [
        "0xacc15dc74880c9944775448304b263d191c6077f",
        "0x818ec0A7Fe18Ff94269904fCED6AE3DaE6d6dC0b",
      ],
    },
  },
  rewardTokens: ["stella"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Moonbeam,
  protocol: AssetProtocol.STELLA,
  details: {
    apiKey: "SLP-USDC-USDT",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSLP USDC/USDT",
    farmDepositTokenName: "pSLP USDC/USDT",
  },
  tags: ["stablecoins"],
};
JAR_DEFINITIONS.push(JAR_MOONBEAM_STELLA_USDC_USDT);

export const JAR_MOONBEAM_BEAM_BNB_BUSD: JarDefinition = {
  type: AssetType.JAR,
  id: "beamJar 2a",
  contract: "0xF1f61233a02BEe9D2867Daa3c3f9ea2327414941",
  startBlock: 250044, startTimestamp: 1642874052,
  depositToken: {
    addr: "0x34A1F4AB3548A92C6B32cd778Eed310FcD9A340D",
    name: "BEAM BNB/BUSD",
    link: "https://app.beamswap.io/exchange/add/0xc9BAA8cfdDe8E328787E29b4B078abf2DaDc2055/0xA649325Aa7C5093d12D6F98EB4378deAe68CE23F",
    components: ["bnb", "busd"],
    nativePath: {
      //Stella Router --> WGLMR, BUSD
      target: "0xd0A01ec574D1fC6652eDF79cb2F880fd47D34Ab1",
      path: [
        "0xacc15dc74880c9944775448304b263d191c6077f",
        "0xa649325aa7c5093d12d6f98eb4378deae68ce23f",
      ],
    },
  },
  rewardTokens: ["glint"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Moonbeam,
  protocol: AssetProtocol.BEAM,
  details: {
    apiKey: "BLP-BNB-BUSD",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pBLP BNB/BUSD",
    farmDepositTokenName: "pBLP BNB/BUSD",
  },
};
JAR_DEFINITIONS.push(JAR_MOONBEAM_BEAM_BNB_BUSD);

export const JAR_MOONBEAM_BEAM_BUSD_GLMR: JarDefinition = {
  type: AssetType.JAR,
  id: "beamJar 2b",
  contract: "0xbF04440582F8a59870f9845005AAc652B9c37733",
  startBlock: 250354, startTimestamp: 1642877898,
  depositToken: {
    addr: "0xfC422EB0A2C7a99bAd330377497FD9798c9B1001",
    name: "BEAM BUSD/GLMR",
    link: "https://app.beamswap.io/exchange/add/0xA649325Aa7C5093d12D6F98EB4378deAe68CE23F/GLMR",
    components: ["busd", "glmr"],
  },
  rewardTokens: ["glint"],
  enablement: AssetEnablement.WITHDRAW_ONLY,
  chain: ChainNetwork.Moonbeam,
  protocol: AssetProtocol.BEAM,
  details: {
    apiKey: "BLP-BUSD-GLMR",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pBLP BUSD/GLMR",
    farmDepositTokenName: "pBLP BUSD/GLMR",
  },
};
JAR_DEFINITIONS.push(JAR_MOONBEAM_BEAM_BUSD_GLMR);

export const JAR_MOONBEAM_BEAM_BUSD_USDC: JarDefinition = {
  type: AssetType.JAR,
  id: "beamJar 2c",
  contract: "0x4f9cAD3450a2B8ba538207082D84B1b49666984e",
  startBlock: 250570, startTimestamp: 1642880544,
  depositToken: {
    addr: "0xa0799832FB2b9F18Acf44B92FbbEDCfD6442DD5e",
    name: "BEAM BUSD/USDC",
    link: "https://app.beamswap.io/exchange/add/0xA649325Aa7C5093d12D6F98EB4378deAe68CE23F/0x818ec0A7Fe18Ff94269904fCED6AE3DaE6d6dC0b",
    components: ["busd", "usdc"],
    nativePath: {
      //Beam Router --> WGLMR, USDC
      target: "0x96b244391D98B62D19aE89b1A4dCcf0fc56970C7",
      path: [
        "0xacc15dc74880c9944775448304b263d191c6077f",
        "0x818ec0A7Fe18Ff94269904fCED6AE3DaE6d6dC0b",
      ],
    },
  },
  rewardTokens: ["glint"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Moonbeam,
  protocol: AssetProtocol.BEAM,
  details: {
    apiKey: "BLP-BUSD-USDC",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pBLP BUSD/USDC",
    farmDepositTokenName: "pBLP BUSD/USDC",
  },
  tags: ["stablecoins"],
};
JAR_DEFINITIONS.push(JAR_MOONBEAM_BEAM_BUSD_USDC);

export const JAR_MOONBEAM_BEAM_ETH_USDC: JarDefinition = {
  type: AssetType.JAR,
  id: "beamJar 2d",
  contract: "0x6f40CB33a3FD953A9254356f40a59C3F4e1377D0",
  startBlock: 250621, startTimestamp: 1642881180,
  depositToken: {
    addr: "0x6BA3071760d46040FB4dc7B627C9f68efAca3000",
    name: "BEAM ETH/USDC",
    link: "https://app.beamswap.io/exchange/add/0xfA9343C3897324496A05fC75abeD6bAC29f8A40f/0x818ec0A7Fe18Ff94269904fCED6AE3DaE6d6dC0b",
    components: ["eth", "usdc"],
    nativePath: {
      //Beam Router --> WGLMR, USDC
      target: "0x96b244391D98B62D19aE89b1A4dCcf0fc56970C7",
      path: [
        "0xacc15dc74880c9944775448304b263d191c6077f",
        "0x818ec0A7Fe18Ff94269904fCED6AE3DaE6d6dC0b",
      ],
    },
  },
  rewardTokens: ["glint"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Moonbeam,
  protocol: AssetProtocol.BEAM,
  details: {
    apiKey: "BLP-ETH-USDC",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pBLP ETH/USDC",
    farmDepositTokenName: "pBLP ETH/USDC",
  },
};
JAR_DEFINITIONS.push(JAR_MOONBEAM_BEAM_ETH_USDC);

export const JAR_MOONBEAM_BEAM_GLMR_GLINT: JarDefinition = {
  type: AssetType.JAR,
  id: "beamJar 2e",
  contract: "0xEE4587694b553aE065337ea4BCdb0C43e83bB3f2",
  startBlock: 239536, startTimestamp: 1642744146,
  depositToken: {
    addr: "0x99588867e817023162F4d4829995299054a5fC57",
    name: "BEAM GLMR/GLINT",
    link: "https://app.beamswap.io/exchange/add/GLMR/0xcd3b51d98478d53f4515a306be565c6eebef1d58",
    components: ["glmr", "glint"],
  },
  rewardTokens: ["glint"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Moonbeam,
  protocol: AssetProtocol.BEAM,
  details: {
    apiKey: "BLP-GLMR-GLINT",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pBLP GLMR/GLINT",
    farmDepositTokenName: "pBLP GLMR/GLINT",
  },
};
JAR_DEFINITIONS.push(JAR_MOONBEAM_BEAM_GLMR_GLINT);

export const JAR_MOONBEAM_BEAM_GLMR_USDC: JarDefinition = {
  type: AssetType.JAR,
  id: "beamJar 2f",
  contract: "0xA075d810fD05c1AB5769b08Dfd34693Ddfa190F3",
  startBlock: 250718, startTimestamp: 1642882362,
  depositToken: {
    addr: "0xb929914B89584b4081C7966AC6287636F7EfD053",
    name: "BEAM GLMR/USDC",
    link: "https://app.beamswap.io/exchange/add/GLMR/0x818ec0A7Fe18Ff94269904fCED6AE3DaE6d6dC0b",
    components: ["glmr", "usdc"],
  },
  rewardTokens: ["glint"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Moonbeam,
  protocol: AssetProtocol.BEAM,
  details: {
    apiKey: "BLP-GLMR-USDC",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pBLP GLMR/USDC",
    farmDepositTokenName: "pBLP GLMR/USDC",
  },
};
JAR_DEFINITIONS.push(JAR_MOONBEAM_BEAM_GLMR_USDC);

export const JAR_MOONBEAM_BEAM_USDC_USDT: JarDefinition = {
  type: AssetType.JAR,
  id: "beamJar 2g",
  contract: "0xE6e02865d8E6DF9b529691204FBC630159e7a9de",
  startBlock: 250786, startTimestamp: 1642883202,
  depositToken: {
    addr: "0xA35B2c07Cb123EA5E1B9c7530d0812e7e03eC3c1",
    name: "BEAM USDC/USDT",
    link: "https://app.beamswap.io/exchange/add/0x818ec0A7Fe18Ff94269904fCED6AE3DaE6d6dC0b/0xeFAeeE334F0Fd1712f9a8cc375f427D9Cdd40d73",
    components: ["usdc", "usdt"],
    nativePath: {
      //Beam Router --> WGLMR, USDC
      target: "0x96b244391D98B62D19aE89b1A4dCcf0fc56970C7",
      path: [
        "0xacc15dc74880c9944775448304b263d191c6077f",
        "0x818ec0A7Fe18Ff94269904fCED6AE3DaE6d6dC0b",
      ],
    },
  },
  rewardTokens: ["glint"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Moonbeam,
  protocol: AssetProtocol.BEAM,
  details: {
    apiKey: "BLP-USDC-USDT",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pBLP USDC/USDT",
    farmDepositTokenName: "pBLP USDC/USDT",
  },
  tags: ["stablecoins"],
};
JAR_DEFINITIONS.push(JAR_MOONBEAM_BEAM_USDC_USDT);

export const JAR_FLARE_FLARE_GLMR: JarDefinition = {
  type: AssetType.JAR,
  id: "beamJar 3a",
  contract: "0xD07796f2C91AB65ebBA43e3A93F36f800946d2BB",
  startBlock: 324558, startTimestamp: 1643793654,
  depositToken: {
    addr: "0x26A2abD79583155EA5d34443b62399879D42748A",
    name: "FLARE FLARE/GLMR",
    link: "https://solarflare.io/exchange/add/ETH/0xE3e43888fa7803cDC7BEA478aB327cF1A0dc11a7",
    components: ["flare", "glmr"],
  },
  rewardTokens: ["flare"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Moonbeam,
  protocol: AssetProtocol.FLARE,
  details: {
    apiKey: "FLP-FLARE-GLMR",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pFLP FLARE/GLMR",
    farmDepositTokenName: "pFLP FLARE/GLMR",
  },
};
JAR_DEFINITIONS.push(JAR_FLARE_FLARE_GLMR);

export const JAR_FLARE_FLARE_USDC: JarDefinition = {
  type: AssetType.JAR,
  id: "beamJar 3b",
  contract: "0x751a2f3b93b9c1af88e34d123ebc4d5541f6c2e4",
  startBlock: 328224, startTimestamp: 1643838948,
  depositToken: {
    addr: "0x976888647affb4b2d7Ac1952cB12ca048cD67762",
    name: "FLARE FLARE/USDC",
    link: "https://solarflare.io/exchange/add/0xE3e43888fa7803cDC7BEA478aB327cF1A0dc11a7/0x8f552a71efe5eefc207bf75485b356a0b3f01ec9",
    components: ["flare", "usdc-2"],
    nativePath: {
      //Solar Router --> WGLMR, FLARE
      target: "0xd3B02Ff30c218c7f7756BA14bcA075Bf7C2C951e",
      path: [
        "0xacc15dc74880c9944775448304b263d191c6077f",
        "0xe3e43888fa7803cdc7bea478ab327cf1a0dc11a7",
      ],
    },
  },
  rewardTokens: ["flare"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Moonbeam,
  protocol: AssetProtocol.FLARE,
  details: {
    apiKey: "FLP-FLARE-USDC",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pFLP FLARE/USDC",
    farmDepositTokenName: "pFLP FLARE/USDC",
  },
};
JAR_DEFINITIONS.push(JAR_FLARE_FLARE_USDC);

export const JAR_FLARE_GLMR_MOVR: JarDefinition = {
  type: AssetType.JAR,
  id: "beamJar 3c",
  contract: "0x3657dE6D8F500a4e91370Fb8c738D33C5010541f",
  startBlock: 329380, startTimestamp: 1643853204,
  depositToken: {
    addr: "0xa65949fa1053903fcc019ac21b0335aa4b4b1bfa",
    name: "FLARE GLMR/MOVR",
    link: "https://solarflare.io/exchange/add/ETH/0x1d4C2a246311bB9f827F4C768e277FF5787B7D7E",
    components: ["glmr", "movr"],
  },
  rewardTokens: ["flare"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Moonbeam,
  protocol: AssetProtocol.FLARE,
  details: {
    apiKey: "FLP-GLMR-MOVR",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pFLP GLMR/MOVR",
    farmDepositTokenName: "pFLP GLMR/MOVR",
  },
};
JAR_DEFINITIONS.push(JAR_FLARE_GLMR_MOVR);

export const JAR_FLARE_GLMR_USDC: JarDefinition = {
  type: AssetType.JAR,
  id: "beamJar 3d",
  contract: "0x9d2F70c5aABc067beaF0Af2367007DF8cB7C497F",
  startBlock: 329459, startTimestamp: 1643854176,
  depositToken: {
    addr: "0xAb89eD43D10c7CE0f4D6F21616556AeCb71b9c5f",
    name: "FLARE GLMR/USDC",
    link: "https://solarflare.io/exchange/add/ETH/0x8f552a71efe5eefc207bf75485b356a0b3f01ec9",
    components: ["glmr", "usdc-2"],
  },
  rewardTokens: ["flare"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Moonbeam,
  protocol: AssetProtocol.FLARE,
  details: {
    apiKey: "FLP-GLMR-USDC",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pFLP GLMR/USDC",
    farmDepositTokenName: "pFLP GLMR/USDC",
  },
};
JAR_DEFINITIONS.push(JAR_FLARE_GLMR_USDC);

export const JAR_FLARE_GLMR_ETH: JarDefinition = {
  type: AssetType.JAR,
  id: "beamJar 3e",
  contract: "0xbD59171dA1c3a2624D60421bcb6c3c3270111656",
  startBlock: 329631, startTimestamp: 1643856336,
  depositToken: {
    addr: "0xb521C0aCf67390C1364f1e940e44dB25828E5Ef9",
    name: "FLARE GLMR/ETH",
    link: "https://solarflare.io/exchange/add/ETH/0x30D2a9F5FDf90ACe8c17952cbb4eE48a55D916A7",
    components: ["glmr", "eth-2"],
  },
  rewardTokens: ["flare"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Moonbeam,
  protocol: AssetProtocol.FLARE,
  details: {
    apiKey: "FLP-GLMR-ETH",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pFLP GLMR/ETH",
    farmDepositTokenName: "pFLP GLMR/ETH",
  },
};
JAR_DEFINITIONS.push(JAR_FLARE_GLMR_ETH);

export const JAR_FLARE_GLMR_WBTC: JarDefinition = {
  type: AssetType.JAR,
  id: "beamJar 3f",
  contract: "0x45d287c9761E14D07f3fF45a733B9f8B0aFF1045",
  startBlock: 329493, startTimestamp: 1643854602,
  depositToken: {
    addr: "0xDF74D67a4Fe29d9D5e0bfAaB3516c65b21a5d7cf",
    name: "FLARE GLMR/WBTC",
    link: "https://solarflare.io/exchange/add/ETH/0x1DC78Acda13a8BC4408B207c9E48CDBc096D95e0",
    components: ["glmr", "wbtc"],
  },
  rewardTokens: ["flare"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Moonbeam,
  protocol: AssetProtocol.FLARE,
  details: {
    apiKey: "FLP-GLMR-WBTC",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pFLP GLMR/WBTC",
    farmDepositTokenName: "pFLP GLMR/WBTC",
  },
};
JAR_DEFINITIONS.push(JAR_FLARE_GLMR_WBTC);

// Optimism
export const JAR_OPTIMISM_ZIP_ETH_USDC: JarDefinition = {
  type: AssetType.JAR,
  id: "opJar 1a",
  contract: "0x7446bf003b98b7b0d90ce84810ac12d6b8114b62",
  startBlock: 2450241, startTimestamp: 1642635948,
  depositToken: {
    addr: "0x1A981dAa7967C66C3356Ad044979BC82E4a478b9",
    name: "ZIP ETH/USDC",
    link: "https://zipswap.fi/#/add/ETH/0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
    components: ["eth", "usdc"],
  },
  rewardTokens: ["zip"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Optimism,
  protocol: AssetProtocol.ZIPSWAP,
  details: {
    apiKey: "ZLP-ETH-USDC",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pZLP ETH/USDC",
    farmDepositTokenName: "pZLP ETH/USDC",
  },
};
JAR_DEFINITIONS.push(JAR_OPTIMISM_ZIP_ETH_USDC);

export const JAR_OPTIMISM_ZIP_ETH_DAI: JarDefinition = {
  type: AssetType.JAR,
  id: "opJar 1b",
  contract: "0xe43c173F7dA43c2D5800aD915426b312Ea003Bff",
  startBlock: 2456276, startTimestamp: 1642654751,
  depositToken: {
    addr: "0x53790B6C7023786659D11ed82eE03079F3bD6976",
    name: "ZIP ETH/DAI",
    link: "https://www.zipswap.fi/#/add/v2/ETH/0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
    components: ["eth", "dai"],
  },
  rewardTokens: ["zip"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Optimism,
  protocol: AssetProtocol.ZIPSWAP,
  details: {
    apiKey: "ZLP-ETH-DAI",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pZLP ETH/DAI",
    farmDepositTokenName: "pZLP ETH/DAI",
  },
};
JAR_DEFINITIONS.push(JAR_OPTIMISM_ZIP_ETH_DAI);

export const JAR_OPTIMISM_ZIP_ETH_BTC: JarDefinition = {
  type: AssetType.JAR,
  id: "opJar 1c",
  contract: "0x15Bfcf85551c3DdBbB94ED08B9bA194D301E690A",
  startBlock: 2456201, startTimestamp: 1642654490,
  depositToken: {
    addr: "0x251de0f0368c472Bba2E1C8f5Db5aC7582B5f847",
    name: "ZIP ETH/BTC",
    link: "https://www.zipswap.fi/#/add/v2/ETH/0x68f180fcCe6836688e9084f035309E29Bf0A2095",
    components: ["eth", "btc"],
  },
  rewardTokens: ["zip"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Optimism,
  protocol: AssetProtocol.ZIPSWAP,
  details: {
    apiKey: "ZLP-ETH-BTC",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pZLP ETH/BTC",
    farmDepositTokenName: "pZLP ETH/BTC",
  },
};
JAR_DEFINITIONS.push(JAR_OPTIMISM_ZIP_ETH_BTC);

export const JAR_OPTIMISM_ZIP_ETH_ZIP: JarDefinition = {
  type: AssetType.JAR,
  id: "opJar 1d",
  contract: "0x25C10d8713172782f83B340cbE1446be171720d7",
  startBlock: 2456491, startTimestamp: 1642655347,
  depositToken: {
    addr: "0xD7F6ECF4371eddBd60C1080BfAEc3d1d60D415d0",
    name: "ZIP ETH/ZIP",
    link: "https://www.zipswap.fi/#/add/v2/ETH/0xFA436399d0458Dbe8aB890c3441256E3E09022a8",
    components: ["eth", "zip"],
  },
  rewardTokens: ["zip"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Optimism,
  protocol: AssetProtocol.ZIPSWAP,
  details: {
    apiKey: "ZLP-ETH-ZIP",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pZLP ETH/ZIP",
    farmDepositTokenName: "pZLP ETH/ZIP",
  },
};
JAR_DEFINITIONS.push(JAR_OPTIMISM_ZIP_ETH_ZIP);

export const JAR_OPTIMISM_ZIP_ETH_OP: JarDefinition = {
  type: AssetType.JAR,
  id: "opJar 1e",
  contract: "0x143bF0f2bf1632eEEe03dD3a0Eeb5BDaA59f884E",
  startBlock: 10163293, startTimestamp: 1654139412,
  depositToken: {
    addr: "0x167dc49c498729223D1565dF3207771B4Ee19853",
    name: "ZIP ETH/OP",
    link: "https://www.zipswap.fi/#/add/v2/ETH/0x4200000000000000000000000000000000000042",
    components: ["eth", "op"],
  },
  rewardTokens: ["zip"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Optimism,
  protocol: AssetProtocol.ZIPSWAP,
  details: {
    apiKey: "ZLP-ETH-OP",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xeEDeF926D3d7C9628c8620B5a018c102F413cDB7",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pZLP ETH/OP",
    farmDepositTokenName: "pZLP ETH/OP",
  },
};
JAR_DEFINITIONS.push(JAR_OPTIMISM_ZIP_ETH_OP);

export const JAR_OPTIMISM_STAR_USDC: JarDefinition = {
  type: AssetType.JAR,
  id: "opJar 2a",
  contract: "0xBD469fdEDd9A8e62BCB1aa1e479A8A287e5718e0",
  startBlock: 4810772, startTimestamp: 1648150183,
  depositToken: {
    addr: "0xDecC0c09c3B5f6e92EF4184125D5648a66E35298",
    name: "STARGATE USDC",
    link: "https://stargate.finance/pool/USDC-Optimism",
    components: ["usdc"],
    decimals: 6,
  },
  rewardTokens: ["stg"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Optimism,
  protocol: AssetProtocol.STARGATE,
  stakingProtocol: AssetProtocol.STARGATE,
  details: {
    apiKey: "STG-OPTIMISM-USDC",
    harvestStyle: HarvestStyle.PASSIVE,
    decimals: 6,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSTG USDC",
    farmDepositTokenName: "pSTG USDC",
  },
};
JAR_DEFINITIONS.push(JAR_OPTIMISM_STAR_USDC);

export const JAR_OPTIMISM_UNIV3_ETH_BTC: JarDefinition = {
  type: AssetType.JAR,
  id: "opJar U3a",
  contract: "0xc335740c951F45200b38C5Ca84F0A9663b51AEC6",
  startBlock: 13923147, startTimestamp: 1657070498,
  depositToken: {
    addr: "0x73B14a78a0D396C521f954532d43fd5fFe385216",
    name: "UniV3 ETH/BTC",
    link: "https://app.uniswap.org/#/add/ETH/0x68f180fcCe6836688e9084f035309E29Bf0A2095/3000?chain=optimism",
    components: ["eth", "btc"],
    style: { erc20: false },
  },
  rewardTokens: ["eth", "btc"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Optimism,
  protocol: AssetProtocol.UNISWAP_V3,
  details: {
    controller: "0xa936511d24F9488Db343AfDdccBf78AD28bd3F42",
    apiKey: "OPTIMISM-UNIV3-ETH-BTC",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pUniV3 ETH/BTC",
    farmDepositTokenName: "pUniV3 ETH/BTC",
  },
};
JAR_DEFINITIONS.push(JAR_OPTIMISM_UNIV3_ETH_BTC);

export const JAR_OPTIMISM_UNIV3_ETH_DAI: JarDefinition = {
  type: AssetType.JAR,
  id: "opJar U3b",
  contract: "0xbE27C2415497f8ae5E6103044f460991E32636F8",
  startBlock: 14048703, startTimestamp: 1657240485,
  depositToken: {
    addr: "0x03aF20bDAaFfB4cC0A521796a223f7D85e2aAc31",
    name: "UniV3 ETH/DAI",
    link: "https://app.uniswap.org/#/add/ETH/0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1/3000?chain=optimism",
    components: ["eth", "dai"],
    style: { erc20: false },
  },
  rewardTokens: ["eth", "dai"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Optimism,
  protocol: AssetProtocol.UNISWAP_V3,
  details: {
    controller: "0xa936511d24F9488Db343AfDdccBf78AD28bd3F42",
    apiKey: "OPTIMISM-UNIV3-ETH-DAI",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pUniV3 ETH/DAI",
    farmDepositTokenName: "pUniV3 ETH/DAI",
  },
};
JAR_DEFINITIONS.push(JAR_OPTIMISM_UNIV3_ETH_DAI);

export const JAR_OPTIMISM_UNIV3_ETH_OP: JarDefinition = {
  type: AssetType.JAR,
  id: "opJar U3c",
  contract: "0x24f8b36b7349053A33E3767bc44B8FF20813AE5e",
  startBlock: 14049776, startTimestamp: 1657241592,
  depositToken: {
    addr: "0x68F5C0A2DE713a54991E01858Fd27a3832401849",
    name: "UniV3 ETH/OP",
    link: "https://app.uniswap.org/#/add/ETH/0x4200000000000000000000000000000000000042/3000?chain=optimism",
    components: ["eth", "op"],
    style: { erc20: false },
  },
  rewardTokens: ["eth", "op"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Optimism,
  protocol: AssetProtocol.UNISWAP_V3,
  details: {
    controller: "0xa936511d24F9488Db343AfDdccBf78AD28bd3F42",
    apiKey: "OPTIMISM-UNIV3-ETH-OP",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pUniV3 ETH/OP",
    farmDepositTokenName: "pUniV3 ETH/OP",
  },
};
JAR_DEFINITIONS.push(JAR_OPTIMISM_UNIV3_ETH_OP);

export const JAR_OPTIMISM_UNIV3_ETH_USDC: JarDefinition = {
  type: AssetType.JAR,
  id: "opJar U3d",
  contract: "0xBBF8233867c1982D66EA920d726d24391B713550",
  startBlock: 14050443, startTimestamp: 1657242418,
  depositToken: {
    addr: "0x85149247691df622eaF1a8Bd0CaFd40BC45154a9",
    name: "UniV3 ETH/USDC",
    link: "https://app.uniswap.org/#/add/ETH/0x7F5c764cBc14f9669B88837ca1490cCa17c31607/500?chain=optimism",
    components: ["eth", "usdc"],
    style: { erc20: false },
  },
  rewardTokens: ["eth", "usdc"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Optimism,
  protocol: AssetProtocol.UNISWAP_V3,
  details: {
    controller: "0xa936511d24F9488Db343AfDdccBf78AD28bd3F42",
    apiKey: "OPTIMISM-UNIV3-ETH-USDC",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pUniV3 ETH/USDC",
    farmDepositTokenName: "pUniV3 ETH/USDC",
  },
};
JAR_DEFINITIONS.push(JAR_OPTIMISM_UNIV3_ETH_USDC);

export const JAR_OPTIMISM_UNIV3_SUSD_DAI: JarDefinition = {
  type: AssetType.JAR,
  id: "opJar U3e",
  contract: "0x37Cc6Ce6eda683AB97433f4Bf26bAbD63889df23",
  startBlock: 14051467, startTimestamp: 1657243437,
  depositToken: {
    addr: "0xAdb35413eC50E0Afe41039eaC8B930d313E94FA4",
    name: "UniV3 SUSD/DAI",
    link: "https://app.uniswap.org/#/add/0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9/0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1/500?chain=optimism",
    components: ["susd", "dai"],
    style: { erc20: false },
  },
  rewardTokens: ["susd", "dai"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Optimism,
  protocol: AssetProtocol.UNISWAP_V3,
  details: {
    controller: "0xa936511d24F9488Db343AfDdccBf78AD28bd3F42",
    apiKey: "OPTIMISM-UNIV3-SUSD-DAI",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pUniV3 SUSD/DAI",
    farmDepositTokenName: "pUniV3 SUSD/DAI",
  },
};
JAR_DEFINITIONS.push(JAR_OPTIMISM_UNIV3_SUSD_DAI);

export const JAR_OPTIMISM_UNIV3_USDC_SUSD: JarDefinition = {
  type: AssetType.JAR,
  id: "opJar U3f",
  contract: "0x637Bbfa0Ba3dE1341c469B15986D4AaE2c8d3cE5",
  startBlock: 14054031, startTimestamp: 1657244290,
  depositToken: {
    addr: "0x8EdA97883a1Bc02Cf68C6B9fb996e06ED8fDb3e5",
    name: "UniV3 USDC/SUSD",
    link: "https://app.uniswap.org/#/add/0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9/0x7F5c764cBc14f9669B88837ca1490cCa17c31607/500?chain=optimism",
    components: ["usdc", "susd"],
    style: { erc20: false },
  },
  rewardTokens: ["usdc", "susd"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Optimism,
  protocol: AssetProtocol.UNISWAP_V3,
  details: {
    controller: "0xa936511d24F9488Db343AfDdccBf78AD28bd3F42",
    apiKey: "OPTIMISM-UNIV3-USDC-SUSD",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pUniV3 USDC/SUSD",
    farmDepositTokenName: "pUniV3 USDC/SUSD",
  },
};
JAR_DEFINITIONS.push(JAR_OPTIMISM_UNIV3_USDC_SUSD);

export const JAR_OPTIMISM_UNIV3_USDC_DAI: JarDefinition = {
  type: AssetType.JAR,
  id: "opJar U3g",
  contract: "0xae2A28B97FFF55ca62881cBB30De0A3D9949F234",
  startBlock: 14055281, startTimestamp: 1657244993,
  depositToken: {
    addr: "0x100bdC1431A9b09C61c0EFC5776814285f8fB248",
    name: "UniV3 USDC/DAI",
    link: "https://app.uniswap.org/#/add/0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1/0x7F5c764cBc14f9669B88837ca1490cCa17c31607/500?chain=optimism",
    components: ["usdc", "dai"],
    style: { erc20: false },
  },
  rewardTokens: ["usdc", "dai"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Optimism,
  protocol: AssetProtocol.UNISWAP_V3,
  details: {
    controller: "0xa936511d24F9488Db343AfDdccBf78AD28bd3F42",
    apiKey: "OPTIMISM-UNIV3-USDC-DAI",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pUniV3 USDC/DAI",
    farmDepositTokenName: "pUniV3 USDC/DAI",
  },
};
JAR_DEFINITIONS.push(JAR_OPTIMISM_UNIV3_USDC_DAI);


// Fantom
export const JAR_FANTOM_BOO_FTM_BOO: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 2a",
  contract: "0xd3dA6cb068Ea54C3f76EAC98884c100A9b144C5a",
  startBlock: 30665577, startTimestamp: 1644600726,
  depositToken: {
    addr: "0xEc7178F4C41f346b2721907F5cF7628E388A7a58",
    name: "BOO FTM/BOO",
    link: "https://spookyswap.finance/add/FTM/0x841FAD6EAe12c286d1Fd18d1d525DFfA75C7EFFE",
    components: ["ftm", "boo"],
  },
  rewardTokens: ["boo"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SPOOKYSWAP,
  stakingProtocol: AssetProtocol.SPOOKYSWAP,
  details: {
    apiKey: "BOO-FTM-BOO",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pBOO FTM/BOO",
    farmDepositTokenName: "pBOO FTM/BOO",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_BOO_FTM_BOO);

export const JAR_FANTOM_BOO_FTM_ICE: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 2b",
  contract: "0x909eD0407D21ADa0E8336c24f19C1a177827d156",
  startBlock: 30677495, startTimestamp: 1644613089,
  depositToken: {
    addr: "0x623EE4a7F290d11C11315994dB70FB148b13021d",
    name: "BOO FTM/ICE",
    link: "https://spookyswap.finance/add/FTM/0xf16e81dce15B08F326220742020379B855B87DF9",
    components: ["ftm", "ice"],
  },
  rewardTokens: ["boo"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SPOOKYSWAP,
  stakingProtocol: AssetProtocol.SPOOKYSWAP,
  details: {
    apiKey: "BOO-FTM-ICE",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pBOO FTM/ICE",
    farmDepositTokenName: "pBOO FTM/ICE",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_BOO_FTM_ICE);

export const JAR_FANTOM_BOO_FTM_SPELL: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 2c",
  contract: "0x0384A9079caa18a1EC7E5A614cf0D654170909d6",
  startBlock: 30679774, startTimestamp: 1644615174,
  depositToken: {
    addr: "0x78f82c16992932EfDd18d93f889141CcF326DBc2",
    name: "BOO FTM/SPELL",
    link: "https://spookyswap.finance/add/FTM/0x468003B688943977e6130F4F68F23aad939a1040",
    components: ["ftm", "spell"],
  },
  rewardTokens: ["boo"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SPOOKYSWAP,
  stakingProtocol: AssetProtocol.SPOOKYSWAP,
  details: {
    apiKey: "BOO-FTM-SPELL",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pBOO FTM/SPELL",
    farmDepositTokenName: "pBOO FTM/SPELL",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_BOO_FTM_SPELL);

export const JAR_FANTOM_BOO_CRV_FTM: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 2d",
  contract: "0x3ddc53Db9241B45d78fe716076661c38Fc77B187",
  startBlock: 30689942, startTimestamp: 1644624271,
  depositToken: {
    addr: "0xB471Ac6eF617e952b84C6a9fF5de65A9da96C93B",
    name: "BOO FTM/CRV",
    link: "https://spookyswap.finance/add/FTM/0x1E4F97b9f9F913c46F1632781732927B9019C68b",
    components: ["ftm", "crv"],
  },
  rewardTokens: ["boo"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SPOOKYSWAP,
  stakingProtocol: AssetProtocol.SPOOKYSWAP,
  details: {
    apiKey: "BOO-FTM-CRV",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pBOO FTM/CRV",
    farmDepositTokenName: "pBOO FTM/CRV",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_BOO_CRV_FTM);

export const JAR_FANTOM_BOO_FTM_AVAX: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 2e",
  contract: "0xf25b3457Ce59127054E0f380d9747CB15cd6e690",
  startBlock: 30711093, startTimestamp: 1644642110,
  depositToken: {
    addr: "0x5DF809e410d9CC577f0d01b4E623C567C7aD56c1",
    name: "BOO FTM/AVAX",
    link: "https://spookyswap.finance/add/FTM/0x511D35c52a3C244E7b8bd92c0C297755FbD89212",
    components: ["ftm", "avax"],
  },
  rewardTokens: ["boo"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SPOOKYSWAP,
  stakingProtocol: AssetProtocol.SPOOKYSWAP,
  details: {
    apiKey: "BOO-FTM-AVAX",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pBOO FTM/AVAX",
    farmDepositTokenName: "pBOO FTM/AVAX",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_BOO_FTM_AVAX);

export const JAR_FANTOM_BOO_FTM_ETH: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 2f",
  contract: "0x3dEBA0136c0b704B3147297FFcfAf033dFf7fA1f",
  startBlock: 30720157, startTimestamp: 1644649911,
  depositToken: {
    addr: "0xf0702249F4D3A25cD3DED7859a165693685Ab577",
    name: "BOO FTM/ETH",
    link: "https://spookyswap.finance/add/FTM/0x74b23882a30290451A17c44f4F05243b6b58C76d",
    components: ["ftm", "eth"],
  },
  rewardTokens: ["boo"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SPOOKYSWAP,
  stakingProtocol: AssetProtocol.SPOOKYSWAP,
  details: {
    apiKey: "BOO-FTM-ETH",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pBOO FTM/ETH",
    farmDepositTokenName: "pBOO FTM/ETH",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_BOO_FTM_ETH);

export const JAR_FANTOM_BOO_USDC_FTM: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 2g",
  contract: "0xC65094422673db9600ca644d35435CeA688D9062",
  startBlock: 30719842, startTimestamp: 1644649650,
  depositToken: {
    addr: "0x2b4C76d0dc16BE1C31D4C1DC53bF9B45987Fc75c",
    name: "BOO USDC/FTM",
    link: "https://spookyswap.finance/add/FTM/0x04068DA6C83AFCFA0e13ba15A6696662335D5B75",
    components: ["usdc", "ftm"],
  },
  rewardTokens: ["boo"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SPOOKYSWAP,
  stakingProtocol: AssetProtocol.SPOOKYSWAP,
  details: {
    apiKey: "BOO-USDC-FTM",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pBOO USDC/FTM",
    farmDepositTokenName: "pBOO USDC/FTM",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_BOO_USDC_FTM);

export const JAR_FANTOM_BOO_USDT_FTM: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 2h",
  contract: "0x06CE6359f93a9a12E415FffB65ACeb6BC3dAA161",
  startBlock: 30763619, startTimestamp: 1644687875,
  depositToken: {
    addr: "0x5965E53aa80a0bcF1CD6dbDd72e6A9b2AA047410",
    name: "BOO USDT/FTM",
    link: "https://spookyswap.finance/add/FTM/0x049d68029688eAbF473097a2fC38ef61633A3C7A",
    components: ["usdt", "ftm"],
  },
  rewardTokens: ["boo"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SPOOKYSWAP,
  stakingProtocol: AssetProtocol.SPOOKYSWAP,
  details: {
    apiKey: "BOO-USDT-FTM",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pBOO USDT/FTM",
    farmDepositTokenName: "pBOO USDT/FTM",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_BOO_USDT_FTM);

export const JAR_FANTOM_BOO_FTM_BNB: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 2i",
  contract: "0x3814a18D46f27912569fE0980073bf441BCd973D",
  startBlock: 30766780, startTimestamp: 1644690754,
  depositToken: {
    addr: "0x956DE13EA0FA5b577E4097Be837BF4aC80005820",
    name: "BOO FTM/BNB",
    link: "https://spookyswap.finance/add/FTM/0xD67de0e0a0Fd7b15dC8348Bb9BE742F3c5850454",
    components: ["ftm", "bnb"],
  },
  rewardTokens: ["boo"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SPOOKYSWAP,
  stakingProtocol: AssetProtocol.SPOOKYSWAP,
  details: {
    apiKey: "BOO-FTM-BNB",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pBOO FTM/BNB",
    farmDepositTokenName: "pBOO FTM/BNB",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_BOO_FTM_BNB);

export const JAR_FANTOM_BOO_FTM_BTC: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 2j",
  contract: "0xfe6E2F124674139C10C658C120a74F91F55225B2",
  startBlock: 30823739, startTimestamp: 1644738271,
  depositToken: {
    addr: "0xFdb9Ab8B9513Ad9E419Cf19530feE49d412C3Ee3",
    name: "BOO FTM/BTC",
    link: "https://spookyswap.finance/add/FTM/0x321162Cd933E2Be498Cd2267a90534A804051b11",
    components: ["ftm", "btc"],
  },
  rewardTokens: ["boo"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SPOOKYSWAP,
  stakingProtocol: AssetProtocol.SPOOKYSWAP,
  details: {
    apiKey: "BOO-FTM-BTC",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pBOO FTM/BTC",
    farmDepositTokenName: "pBOO FTM/BTC",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_BOO_FTM_BTC);

export const JAR_FANTOM_BOO_FTM_MIM: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 2k",
  contract: "0x5012168DD870bD09F0122527aB7CbEda7561B325",
  startBlock: 30823999, startTimestamp: 1644738519,
  depositToken: {
    addr: "0x6f86e65b255c9111109d2D2325ca2dFc82456efc",
    name: "BOO FTM/MIM",
    link: "https://spookyswap.finance/add/FTM/0x82f0B8B456c1A451378467398982d4834b6829c1",
    components: ["ftm", "mim"],
  },
  rewardTokens: ["boo"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SPOOKYSWAP,
  stakingProtocol: AssetProtocol.SPOOKYSWAP,
  details: {
    apiKey: "BOO-FTM-MIM",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pBOO FTM/MIM",
    farmDepositTokenName: "pBOO FTM/MIM",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_BOO_FTM_MIM);

export const JAR_FANTOM_BOO_FTM_LINK: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 2l",
  contract: "0xBe5ec16316D6B035f0f464eC9C74B13131Ca427D",
  startBlock: 30824910, startTimestamp: 1644739259,
  depositToken: {
    addr: "0x89d9bC2F2d091CfBFc31e333D6Dc555dDBc2fd29",
    name: "BOO FTM/LINK",
    link: "https://spookyswap.finance/add/FTM/0xb3654dc3D10Ea7645f8319668E8F54d2574FBdC8",
    components: ["ftm", "link"],
  },
  rewardTokens: ["boo"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SPOOKYSWAP,
  stakingProtocol: AssetProtocol.SPOOKYSWAP,
  details: {
    apiKey: "BOO-FTM-LINK",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pBOO FTM/LINK",
    farmDepositTokenName: "pBOO FTM/LINK",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_BOO_FTM_LINK);

export const JAR_FANTOM_BOO_FTM_SUSHI: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 2m",
  contract: "0x5D1DD14a756171349Cd4c666DE96d496Fd5241c8",
  startBlock: 30865053, startTimestamp: 1644773791,
  depositToken: {
    addr: "0xf84E313B36E86315af7a06ff26C8b20e9EB443C3",
    name: "BOO FTM/SUSHI",
    link: "https://spookyswap.finance/add/FTM/0xae75A438b2E0cB8Bb01Ec1E1e376De11D44477CC",
    components: ["ftm", "sushi"],
  },
  rewardTokens: ["boo"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SPOOKYSWAP,
  stakingProtocol: AssetProtocol.SPOOKYSWAP,
  details: {
    apiKey: "BOO-FTM-SUSHI",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pBOO FTM/SUSHI",
    farmDepositTokenName: "pBOO FTM/SUSHI",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_BOO_FTM_SUSHI);

export const JAR_FANTOM_BOO_FTM_TREEB: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 2n",
  contract: "0x622B2561a02e8bFcD6e40F67EabeDdDAc9c8a208",
  startBlock: 31008576, startTimestamp: 1644900055,
  depositToken: {
    addr: "0xe8b72a866b8D59F5c13D2ADEF96E40A3EF5b3152",
    name: "BOO FTM/TREEB",
    link: "https://spookyswap.finance/add/FTM/0xc60D7067dfBc6f2caf30523a064f416A5Af52963",
    components: ["ftm", "treeb"],
  },
  rewardTokens: ["boo"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SPOOKYSWAP,
  stakingProtocol: AssetProtocol.SPOOKYSWAP,
  details: {
    apiKey: "BOO-FTM-TREEB",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pBOO FTM/TREEB",
    farmDepositTokenName: "pBOO FTM/TREEB",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_BOO_FTM_TREEB);

export const JAR_FANTOM_BOO_FTM_ANY: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 2o",
  contract: "0xAf4A47320867d03B8405FD8459eC2ee8324BDF09",
  startBlock: 30900888, startTimestamp: 1644806011,
  depositToken: {
    addr: "0x5c021D9cfaD40aaFC57786b409A9ce571de375b4",
    name: "BOO FTM/ANY",
    link: "https://spookyswap.finance/add/FTM/0xdDcb3fFD12750B45d32E084887fdf1aABAb34239",
    components: ["ftm", "any"],
  },
  rewardTokens: ["boo"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SPOOKYSWAP,
  stakingProtocol: AssetProtocol.SPOOKYSWAP,
  details: {
    apiKey: "BOO-FTM-ANY",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pBOO FTM/ANY",
    farmDepositTokenName: "pBOO FTM/ANY",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_BOO_FTM_ANY);

export const JAR_FANTOM_BOO_BTC_ETH: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 2p",
  contract: "0x41Fd6eb8Ee8C4BF6BBd68f4c70B5F952895943b5",
  startBlock: 30976525, startTimestamp: 1644872908,
  depositToken: {
    addr: "0xEc454EdA10accdD66209C57aF8C12924556F3aBD",
    name: "BOO BTC/ETH",
    link: "https://spookyswap.finance/add/FTM/0xdDcb3fFD12750B45d32E084887fdf1aABAb34239",
    components: ["btc", "eth"],
    nativePath: {
      //(Spookyswap)uniswapv2router02 --> WFTM, ETH
      target: "0xF491e7B69E4244ad4002BC14e878a34207E38c29",
      path: [
        "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",
        "0x74b23882a30290451A17c44f4F05243b6b58C76d",
      ],
    },
  },
  rewardTokens: ["boo"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SPOOKYSWAP,
  stakingProtocol: AssetProtocol.SPOOKYSWAP,
  details: {
    apiKey: "BOO-BTC-ETH",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pBOO BTC/ETH",
    farmDepositTokenName: "pBOO BTC/ETH",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_BOO_BTC_ETH);

export const JAR_FANTOM_BOO_FTM_DAI: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 2q",
  contract: "0x274f3E746Ff8beD72c5019a0203e861B03205E68",
  startBlock: 30760347, startTimestamp: 1644685196,
  depositToken: {
    addr: "0xe120ffBDA0d14f3Bb6d6053E90E63c572A66a428",
    name: "BOO FTM/DAI",
    link: "https://spookyswap.finance/add/FTM/0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E",
    components: ["ftm", "dai"],
  },
  rewardTokens: ["boo"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SPOOKYSWAP,
  stakingProtocol: AssetProtocol.SPOOKYSWAP,
  details: {
    apiKey: "BOO-FTM-DAI",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pBOO FTM/DAI",
    farmDepositTokenName: "pBOO FTM/DAI",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_BOO_FTM_DAI);

export const JAR_FANTOM_BOO_YFI_ETH: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 2r",
  contract: "0xDB6d81DC46F9E13B9Bb2CCE9C332a8cBF64146c0",
  startBlock: 30865304, startTimestamp: 1644774008,
  depositToken: {
    addr: "0x0845c0bFe75691B1e21b24351aAc581a7FB6b7Df",
    name: "BOO YFI/ETH",
    link: "https://spookyswap.finance/add/0x29b0Da86e484E1C0029B56e817912d778aC0EC69/0x74b23882a30290451A17c44f4F05243b6b58C76d",
    components: ["yfi", "eth"],
    nativePath: {
      //(Spookyswap)uniswapv2router02 --> WFTM, ETH
      target: "0xF491e7B69E4244ad4002BC14e878a34207E38c29",
      path: [
        "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",
        "0x74b23882a30290451A17c44f4F05243b6b58C76d",
      ],
    },
  },
  rewardTokens: ["boo"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SPOOKYSWAP,
  stakingProtocol: AssetProtocol.SPOOKYSWAP,
  details: {
    apiKey: "BOO-YFI-ETH",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pBOO YFI/ETH",
    farmDepositTokenName: "pBOO YFI/ETH",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_BOO_YFI_ETH);

export const JAR_FANTOM_BOO_FTM_MATIC: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 2s",
  contract: "0x26c3b3D864875701eF2F50EE9e2D662CE49b4fA8",
  startBlock: 30916080, startTimestamp: 1644818921,
  depositToken: {
    addr: "0x7051C6F0C1F1437498505521a3bD949654923fE1",
    name: "BOO FTM/MATIC",
    link: "https://spookyswap.finance/add/FTM/0xdDcb3fFD12750B45d32E084887fdf1aABAb34239",
    components: ["ftm", "matic"],
  },
  rewardTokens: ["boo"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SPOOKYSWAP,
  stakingProtocol: AssetProtocol.SPOOKYSWAP,
  details: {
    apiKey: "BOO-FTM-MATIC",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pBOO FTM/MATIC",
    farmDepositTokenName: "pBOO FTM/MATIC",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_BOO_FTM_MATIC);

export const JAR_FANTOM_LQDR_SPIRIT_DEUS_FTM: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 3aa",
  contract: "0x17c138a61B2ED1A0dA0DD61Df8e66AdfF3437A5D",
  startBlock: 31171220, startTimestamp: 1645046473,
  depositToken: {
    addr: "0x2599Eba5fD1e49F294C76D034557948034d6C96E",
    name: "SPIRIT DEUS/FTM",
    link: "https://swap.spiritswap.finance/#/add/FTM/0xDE5ed76E7c05eC5e4572CfC88d1ACEA165109E44",
    components: ["deus", "ftm"],
  },
  rewardTokens: ["spirit", "lqdr"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SPIRITSWAP,
  stakingProtocol: AssetProtocol.LIQUID,
  details: {
    apiKey: "LQDR-SPIRIT-DEUS-FTM",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pLQDR-SPIRIT DEUS-FTM",
    farmDepositTokenName: "pLQDR-SPIRIT DEUS-FTM",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_LQDR_SPIRIT_DEUS_FTM);

export const JAR_FANTOM_LQDR_SPIRIT_FRAX_FTM: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 3ab",
  contract: "0x69094096DaEaFA96F49438Beda6B0e0950E4BF02",
  startBlock: 31172509, startTimestamp: 1645047544,
  depositToken: {
    addr: "0x7ed0cdDB9BB6c6dfEa6fB63E117c8305479B8D7D",
    name: "SPIRIT FRAX/FTM",
    link: "https://swap.spiritswap.finance/#/add/FTM/0xdc301622e621166BD8E82f2cA0A26c13Ad0BE355",
    components: ["frax", "ftm"],
  },
  rewardTokens: ["spirit", "lqdr"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SPIRITSWAP,
  stakingProtocol: AssetProtocol.LIQUID,
  details: {
    apiKey: "LQDR-SPIRIT-FRAX-FTM",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pLQDR-SPIRIT FRAX-FTM",
    farmDepositTokenName: "pLQDR-SPIRIT FRAX-FTM",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_LQDR_SPIRIT_FRAX_FTM);

export const JAR_FANTOM_LQDR_SPIRIT_MIM_FTM: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 3ac",
  contract: "0x1A7271cd1604155C5e1aB1fca4f7D8cE7ee92e71",
  startBlock: 31172760, startTimestamp: 1645047763,
  depositToken: {
    addr: "0xB32b31DfAfbD53E310390F641C7119b5B9Ea0488",
    name: "SPIRIT MIM/FTM",
    link: "https://swap.spiritswap.finance/#/add/FTM/0x82f0B8B456c1A451378467398982d4834b6829c1",
    components: ["mim", "ftm"],
  },
  rewardTokens: ["spirit", "lqdr"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SPIRITSWAP,
  stakingProtocol: AssetProtocol.LIQUID,
  details: {
    apiKey: "LQDR-SPIRIT-MIM-FTM",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pLQDR-SPIRIT MIM-FTM",
    farmDepositTokenName: "pLQDR-SPIRIT MIM-FTM",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_LQDR_SPIRIT_MIM_FTM);

export const JAR_FANTOM_LQDR_SPIRIT_USDC_FTM: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 3ad",
  contract: "0xb36b9767f840e4742528eA65C53499437FFf1b66",
  startBlock: 31172863, startTimestamp: 1645047852,
  depositToken: {
    addr: "0xe7E90f5a767406efF87Fdad7EB07ef407922EC1D",
    name: "SPIRIT USDC/FTM",
    link: "https://swap.spiritswap.finance/#/add/FTM/0x04068DA6C83AFCFA0e13ba15A6696662335D5B75",
    components: ["usdc", "ftm"],
  },
  rewardTokens: ["spirit", "lqdr"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SPIRITSWAP,
  stakingProtocol: AssetProtocol.LIQUID,
  details: {
    apiKey: "LQDR-SPIRIT-USDC-FTM",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pLQDR-SPIRIT USDC-FTM",
    farmDepositTokenName: "pLQDR-SPIRIT USDC-FTM",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_LQDR_SPIRIT_USDC_FTM);

export const JAR_FANTOM_LQDR_SPIRIT_PILLS_FTM: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 3ae",
  contract: "0x4c0035863c371EB77BF3D30583BF9A00239ffcdf",
  startBlock: 31175157, startTimestamp: 1645050010,
  depositToken: {
    addr: "0x9C775D3D66167685B2A3F4567B548567D2875350",
    name: "SPIRIT PILLS/FTM",
    link: "https://swap.spiritswap.finance/#/add/FTM/0x04068DA6C83AFCFA0e13ba15A6696662335D5B75",
    components: ["pills", "ftm"],
  },
  rewardTokens: ["spirit", "lqdr"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SPIRITSWAP,
  stakingProtocol: AssetProtocol.LIQUID,
  details: {
    apiKey: "LQDR-SPIRIT-PILLS-FTM",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pLQDR-SPIRIT PILLS-FTM",
    farmDepositTokenName: "pLQDR-SPIRIT PILLS-FTM",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_LQDR_SPIRIT_PILLS_FTM);

export const JAR_FANTOM_LQDR_SPIRIT_ETH_FTM: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 3af",
  contract: "0x675F8f5a0D091888bA8de194b6Ba3cbD228E31C9",
  startBlock: 31176288, startTimestamp: 1645051017,
  depositToken: {
    addr: "0x613BF4E46b4817015c01c6Bb31C7ae9edAadc26e",
    name: "SPIRIT ETH/FTM",
    link: "https://swap.spiritswap.finance/#/add/FTM/0x74b23882a30290451A17c44f4F05243b6b58C76d",
    components: ["eth", "ftm"],
  },
  rewardTokens: ["spirit", "lqdr"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SPIRITSWAP,
  stakingProtocol: AssetProtocol.LIQUID,
  details: {
    apiKey: "LQDR-SPIRIT-ETH-FTM",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pLQDR-SPIRIT ETH-FTM",
    farmDepositTokenName: "pLQDR-SPIRIT ETH-FTM",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_LQDR_SPIRIT_ETH_FTM);

export const JAR_FANTOM_LQDR_SPIRIT_FTM: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 3ag",
  contract: "0xD826A08dB6bdaa693241B3144160f575112A98Fc",
  startBlock: 31176781, startTimestamp: 1645051669,
  depositToken: {
    addr: "0x30748322B6E34545DBe0788C421886AEB5297789",
    name: "SPIRIT SPIRIT/FTM",
    link: "https://swap.spiritswap.finance/#/add/FTM/0x5Cc61A78F164885776AA610fb0FE1257df78E59B",
    components: ["spirit", "ftm"],
  },
  rewardTokens: ["spirit", "lqdr"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SPIRITSWAP,
  stakingProtocol: AssetProtocol.LIQUID,
  details: {
    apiKey: "LQDR-SPIRIT-FTM",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pLQDR-SPIRIT SPIRIT-FTM",
    farmDepositTokenName: "pLQDR-SPIRIT SPIRIT-FTM",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_LQDR_SPIRIT_FTM);

export const JAR_FANTOM_LQDR_SPIRIT_LQDR_FTM: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 3ah",
  contract: "0x688fE246327C42dedB01F319aFF5A707549cd721",
  startBlock: 31176917, startTimestamp: 1645051804,
  depositToken: {
    addr: "0x4Fe6f19031239F105F753D1DF8A0d24857D0cAA2",
    name: "SPIRIT LQDR/FTM",
    link: "https://swap.spiritswap.finance/#/add/FTM/0x5Cc61A78F164885776AA610fb0FE1257df78E59B",
    components: ["lqdr", "ftm"],
  },
  rewardTokens: ["spirit", "lqdr"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SPIRITSWAP,
  stakingProtocol: AssetProtocol.LIQUID,
  details: {
    apiKey: "LQDR-SPIRIT-LQDR-FTM",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pLQDR-SPIRIT LQDR-FTM",
    farmDepositTokenName: "pLQDR-SPIRIT LQDR-FTM",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_LQDR_SPIRIT_LQDR_FTM);

export const JAR_FANTOM_LQDR_SPIRIT_DEI_USDC: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 3ai",
  contract: "0x0beA755c9EcFFFE1D701C092d6DD2a12BB17EE03",
  startBlock: 32082789, startTimestamp: 1645947451,
  depositToken: {
    addr: "0x8eFD36aA4Afa9F4E157bec759F1744A7FeBaEA0e",
    name: "SPIRIT DEI/USDC",
    link: "https://swap.spiritswap.finance/#/add/FTM/0xDE12c7959E1a72bbe8a5f7A1dc8f8EeF9Ab011B3",
    components: ["dei", "usdc"],
    nativePath: {
      //(Spookyswap)uniswapv2router02 --> WFTM, USDC
      target: "0xF491e7B69E4244ad4002BC14e878a34207E38c29",
      path: [
        "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",
        "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75",
      ],
    },
  },
  rewardTokens: ["spirit", "lqdr"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SPIRITSWAP,
  stakingProtocol: AssetProtocol.LIQUID,
  details: {
    controller: "0xB1698A97b497c998b2B2291bb5C48D1d6075836a",
    apiKey: "LQDR-SPIRIT-DEI-USDC",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pLQDR-SPIRIT DEI-USDC",
    farmDepositTokenName: "pLQDR-SPIRIT DEI-USDC",
  },
  tags: ["stablecoins"],
};
JAR_DEFINITIONS.push(JAR_FANTOM_LQDR_SPIRIT_DEI_USDC);

export const JAR_FANTOM_LQDR_BOO_DAI_FTM: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 3ba",
  contract: "0x1C368f923abC3ee48c6F3511921b4f16443CE989",
  startBlock: 31191414, startTimestamp: 1645064876,
  depositToken: {
    addr: "0xe120ffBDA0d14f3Bb6d6053E90E63c572A66a428",
    name: "BOO DAI/FTM",
    link: "https://spookyswap.finance/add/FTM/0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E",
    components: ["dai", "ftm"],
  },
  rewardTokens: ["boo", "lqdr"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SPOOKYSWAP,
  stakingProtocol: AssetProtocol.LIQUID,
  details: {
    apiKey: "LQDR-BOO-DAI-FTM",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xB1698A97b497c998b2B2291bb5C48D1d6075836a",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pLQDR-BOO DAI-FTM",
    farmDepositTokenName: "pLQDR-BOO DAI-FTM",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_LQDR_BOO_DAI_FTM);

export const JAR_FANTOM_LQDR_BOO_FTM: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 3bb",
  contract: "0xd974775FC29996e39692dBfB50AA98173D553680",
  startBlock: 31192191, startTimestamp: 1645065547,
  depositToken: {
    addr: "0xEc7178F4C41f346b2721907F5cF7628E388A7a58",
    name: "BOO BOO/FTM",
    link: "https://spookyswap.finance/add/FTM/0x841FAD6EAe12c286d1Fd18d1d525DFfA75C7EFFE",
    components: ["boo", "ftm"],
  },
  rewardTokens: ["boo", "lqdr"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SPOOKYSWAP,
  stakingProtocol: AssetProtocol.LIQUID,
  details: {
    apiKey: "LQDR-BOO-FTM",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xB1698A97b497c998b2B2291bb5C48D1d6075836a",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pLQDR-BOO BOO-FTM",
    farmDepositTokenName: "pLQDR-BOO BOO-FTM",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_LQDR_BOO_FTM);

export const JAR_FANTOM_LQDR_BOO_ETH_FTM: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 3bc",
  contract: "0xc479869dF74D8699a4D2204E3A1930437c7e88Dd",
  startBlock: 31193550, startTimestamp: 1645066689,
  depositToken: {
    addr: "0xf0702249F4D3A25cD3DED7859a165693685Ab577",
    name: "BOO ETH/FTM",
    link: "https://spookyswap.finance/add/FTM/0x74b23882a30290451A17c44f4F05243b6b58C76d",
    components: ["eth", "ftm"],
  },
  rewardTokens: ["boo", "lqdr"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SPOOKYSWAP,
  stakingProtocol: AssetProtocol.LIQUID,
  details: {
    apiKey: "LQDR-BOO-ETH-FTM",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xB1698A97b497c998b2B2291bb5C48D1d6075836a",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pLQDR-BOO ETH-FTM",
    farmDepositTokenName: "pLQDR-BOO ETH-FTM",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_LQDR_BOO_ETH_FTM);

export const JAR_FANTOM_LQDR_BOO_MIM_FTM: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 3bd",
  contract: "0x1C0742b93CA1Bd36F4e405A669422b9d66b81ed6",
  startBlock: 31192948, startTimestamp: 1645066198,
  depositToken: {
    addr: "0x6f86e65b255c9111109d2D2325ca2dFc82456efc",
    name: "BOO MIM/FTM",
    link: "https://spookyswap.finance/add/FTM/0x82f0B8B456c1A451378467398982d4834b6829c1",
    components: ["mim", "ftm"],
  },
  rewardTokens: ["boo", "lqdr"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SPOOKYSWAP,
  stakingProtocol: AssetProtocol.LIQUID,
  details: {
    apiKey: "LQDR-BOO-MIM-FTM",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xB1698A97b497c998b2B2291bb5C48D1d6075836a",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pLQDR-BOO MIM-FTM",
    farmDepositTokenName: "pLQDR-BOO MIM-FTM",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_LQDR_BOO_MIM_FTM);

export const JAR_FANTOM_LQDR_BOO_LINK_FTM: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 3be",
  contract: "0x6a3f82d42E65EE78c41f47eA53bF29d9aeCd85fd",
  startBlock: 31192704, startTimestamp: 1645065997,
  depositToken: {
    addr: "0x89d9bC2F2d091CfBFc31e333D6Dc555dDBc2fd29",
    name: "BOO LINK/FTM",
    link: "https://spookyswap.finance/add/FTM/0xb3654dc3D10Ea7645f8319668E8F54d2574FBdC8",
    components: ["link", "ftm"],
  },
  rewardTokens: ["boo", "lqdr"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SPOOKYSWAP,
  stakingProtocol: AssetProtocol.LIQUID,
  details: {
    apiKey: "LQDR-BOO-LINK-FTM",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xB1698A97b497c998b2B2291bb5C48D1d6075836a",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pLQDR-BOO LINK-FTM",
    farmDepositTokenName: "pLQDR-BOO LINK-FTM",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_LQDR_BOO_LINK_FTM);

export const JAR_FANTOM_LQDR_BOO_USDC_FTM: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 3bf",
  contract: "0xC921abCe87717e0E1DF9da95fD03819Fe50203c4",
  startBlock: 31193202, startTimestamp: 1645066402,
  depositToken: {
    addr: "0x2b4C76d0dc16BE1C31D4C1DC53bF9B45987Fc75c",
    name: "BOO USDC/FTM",
    link: "https://spookyswap.finance/add/FTM/0x04068DA6C83AFCFA0e13ba15A6696662335D5B75",
    components: ["usdc", "ftm"],
  },
  rewardTokens: ["boo", "lqdr"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SPOOKYSWAP,
  stakingProtocol: AssetProtocol.LIQUID,
  details: {
    apiKey: "LQDR-BOO-USDC-FTM",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xB1698A97b497c998b2B2291bb5C48D1d6075836a",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pLQDR-BOO USDC-FTM",
    farmDepositTokenName: "pLQDR-BOO USDC-FTM",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_LQDR_BOO_USDC_FTM);

export const JAR_FANTOM_LQDR_BOO_USDT_FTM: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 3bg",
  contract: "0x84Fb387b0d6014A625642c33da2fcbf7A1C85f71",
  startBlock: 31192423, startTimestamp: 1645065774,
  depositToken: {
    addr: "0x5965E53aa80a0bcF1CD6dbDd72e6A9b2AA047410",
    name: "BOO USDT/FTM",
    link: "https://spookyswap.finance/add/FTM/0x049d68029688eAbF473097a2fC38ef61633A3C7A",
    components: ["usdt", "ftm"],
  },
  rewardTokens: ["boo", "lqdr"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SPOOKYSWAP,
  stakingProtocol: AssetProtocol.LIQUID,
  details: {
    apiKey: "LQDR-BOO-USDT-FTM",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xB1698A97b497c998b2B2291bb5C48D1d6075836a",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pLQDR-BOO USDT-FTM",
    farmDepositTokenName: "pLQDR-BOO USDT-FTM",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_LQDR_BOO_USDT_FTM);

export const JAR_FANTOM_LQDR_BOO_SUSHI_FTM: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 3bh",
  contract: "0x82BA82A1Eb794F19688e9fCb4725020114766fDb",
  startBlock: 31193785, startTimestamp: 1645066887,
  depositToken: {
    addr: "0xf84E313B36E86315af7a06ff26C8b20e9EB443C3",
    name: "BOO SUSHI/FTM",
    link: "https://spookyswap.finance/add/FTM/0xae75A438b2E0cB8Bb01Ec1E1e376De11D44477CC",
    components: ["sushi", "ftm"],
  },
  rewardTokens: ["boo", "lqdr"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SPOOKYSWAP,
  stakingProtocol: AssetProtocol.LIQUID,
  details: {
    apiKey: "LQDR-BOO-SUSHI-FTM",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xB1698A97b497c998b2B2291bb5C48D1d6075836a",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pLQDR-BOO SUSHI-FTM",
    farmDepositTokenName: "pLQDR-BOO SUSHI-FTM",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_LQDR_BOO_SUSHI_FTM);

export const JAR_FANTOM_BEETX_FBEETS: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 4a",
  contract: "0x48331A50097C91885442A5FF8d02D6f6fAA1F089",
  startBlock: 31294042, startTimestamp: 1645158485,
  depositToken: {
    addr: "0xfcef8a994209d6916EB2C86cDD2AFD60Aa6F54b1",
    name: "BEETS/FTM",
    link: "https://beets.fi/#/pool/0xcde5a11a4acb4ee4c805352cec57e236bdbc3837000200000000000000000019",
    components: ["beets", "ftm"],
  },
  rewardTokens: ["beets"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.BEETHOVENX,
  stakingProtocol: AssetProtocol.BEETHOVENX,
  details: {
    apiKey: "BEETX-FBEETS",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pBEETX FBEETS",
    farmDepositTokenName: "pBEETX FBEETS",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_BEETX_FBEETS);

export const JAR_FANTOM_BEETX_FTM_BTC_ETH: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 4b",
  contract: "0xAcD024827dd03F012c6EDe61cF298e7Feb75119D",
  startBlock: 31357683, startTimestamp: 1645217280,
  depositToken: {
    addr: "0xd47D2791d3B46f9452709Fa41855a045304D6f9d",
    name: "BEETX FTM/BTC/ETH",
    link: "https://beets.fi/#/pool/0xd47d2791d3b46f9452709fa41855a045304d6f9d000100000000000000000004",
    components: ["ftm", "btc", "eth"],
  },
  rewardTokens: ["beets"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.BEETHOVENX,
  stakingProtocol: AssetProtocol.BEETHOVENX,
  details: {
    apiKey: "BEETX-FTM-BTC-ETH",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pBEETX FTM-BTC-ETH",
    farmDepositTokenName: "pBEETX FTM-BTC-ETH",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_BEETX_FTM_BTC_ETH);

export const JAR_FANTOM_BEETX_LQDR_FTM: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 4c",
  contract: "0xBBF8233867c1982D66EA920d726d24391B713550",
  startBlock: 31366828, startTimestamp: 1645225327,
  depositToken: {
    addr: "0x5E02aB5699549675A6d3BEEb92A62782712D0509",
    name: "BEETX LQDR/FTM",
    link: "https://beets.fi/#/pool/0x5e02ab5699549675a6d3beeb92a62782712d0509000200000000000000000138",
    components: ["lqdr", "ftm"],
  },
  rewardTokens: ["beets"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.BEETHOVENX,
  stakingProtocol: AssetProtocol.BEETHOVENX,
  details: {
    apiKey: "BEETX-LQDR-FTM",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pBEETX LQDR-FTM",
    farmDepositTokenName: "pBEETX LQDR-FTM",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_BEETX_LQDR_FTM);

export const JAR_FANTOM_BEETX_FTM_MATIC_SOL_AVAX_LUNA_BNB: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 4d",
  contract: "0x666141b4040d665383feB7881F265F081b53cf8D",
  startBlock: 31366941, startTimestamp: 1645225413,
  depositToken: {
    addr: "0x9af1F0e9aC9C844A4a4439d446c1437807183075",
    name: "BEETX FTM/MATIC/SOL/AVAX/LUNA/BNB",
    link: "https://beets.fi/#/pool/0x9af1f0e9ac9c844a4a4439d446c14378071830750001000000000000000000da",
    components: ["ftm", "matic", "sol", "avax", "luna", "bnb"],
  },
  rewardTokens: ["beets"],
  enablement: AssetEnablement.PERMANENTLY_DISABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.BEETHOVENX,
  stakingProtocol: AssetProtocol.BEETHOVENX,
  details: {
    apiKey: "BEETX-FTM-MATIC-SOL-AVAX-LUNA-BNB",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pBEETX FTM-MATIC-SOL-AVAX-LUNA-BNB",
    farmDepositTokenName: "pBEETX FTM-MATIC-SOL-AVAX-LUNA-BNB",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_BEETX_FTM_MATIC_SOL_AVAX_LUNA_BNB);

export const JAR_FANTOM_BEETX_FTM_USDC: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 4e",
  contract: "0xae2A28B97FFF55ca62881cBB30De0A3D9949F234",
  startBlock: 31372390, startTimestamp: 1645230143,
  depositToken: {
    addr: "0xcdF68a4d525Ba2E90Fe959c74330430A5a6b8226",
    name: "BEETX FTM/USDC",
    link: "https://beets.fi/#/pool/0xcdf68a4d525ba2e90fe959c74330430a5a6b8226000200000000000000000008",
    components: ["ftm", "usdc"],
  },
  rewardTokens: ["beets"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.BEETHOVENX,
  stakingProtocol: AssetProtocol.BEETHOVENX,
  details: {
    apiKey: "BEETX-FTM-USDC",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pBEETX FTM-USDC",
    farmDepositTokenName: "pBEETX FTM-USDC",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_BEETX_FTM_USDC);

export const JAR_FANTOM_BEETX_USDC_DAI_MAI: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 4f",
  contract: "0x3a0F1451629f62fCb290a600e553e0d9f03B62C9",
  startBlock: 31366857, startTimestamp: 1645225349,
  depositToken: {
    addr: "0x2C580C6F08044D6dfACA8976a66C8fAddDBD9901",
    name: "BEETX USDC/DAI/MAI",
    link: "https://beets.fi/#/pool/0x2c580c6f08044d6dfaca8976a66c8fadddbd9901000000000000000000000038",
    components: ["usdc", "dai", "mimatic"],
  },
  rewardTokens: ["beets"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.BEETHOVENX,
  stakingProtocol: AssetProtocol.BEETHOVENX,
  details: {
    apiKey: "BEETX-USDC-DAI-MAI",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pBEETX USDC-DAI-MAI",
    farmDepositTokenName: "pBEETX USDC-DAI-MAI",
  },
  tags: ["stablecoins"],
};
JAR_DEFINITIONS.push(JAR_FANTOM_BEETX_USDC_DAI_MAI);

export const JAR_FANTOM_BEETX_USDC_FTM_BTC_ETH: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 4g",
  contract: "0x179F487f5d735A1353E13A718e6C1030DC01E011",
  startBlock: 31366902, startTimestamp: 1645225384,
  depositToken: {
    addr: "0xf3A602d30dcB723A74a0198313a7551FEacA7DAc",
    name: "BEETX USDC/FTM/BTC/ETH",
    link: "https://beets.fi/#/pool/0xf3a602d30dcb723a74a0198313a7551feaca7dac00010000000000000000005f",
    components: ["usdc", "ftm", "btc", "eth"],
  },
  rewardTokens: ["beets"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.BEETHOVENX,
  stakingProtocol: AssetProtocol.BEETHOVENX,
  details: {
    apiKey: "BEETX-USDC-FTM-BTC-ETH",
    harvestStyle: HarvestStyle.PASSIVE,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pBEETX USDC-FTM-BTC-ETH",
    farmDepositTokenName: "pBEETX USDC-FTM-BTC-ETH",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_BEETX_USDC_FTM_BTC_ETH);

export const JAR_FANTOM_V_SEX_FTM: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 5a",
  contract: "0xFc3c538931f97458c0F44E6852768A74175DB5C2",
  startBlock: 32386067, startTimestamp: 1646254422,
  depositToken: {
    addr: "0xFCEC86aF8774d69e2e4412B8De3f4aBf1f671ecC",
    name: "SOLIDLY vFTM/SEX",
    link: "https://solidly.exchange/liquidity/0xFCEC86aF8774d69e2e4412B8De3f4aBf1f671ecC",
    components: ["ftm", "sex"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.SEX,
  rewardTokens: ["solid", "sex"],
  details: {
    apiKey: "SEX-SOLID-vFTM-SEX",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xc335740c951F45200b38C5Ca84F0A9663b51AEC6",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSEX-SOLID vFTM-SEX",
    farmDepositTokenName: "pSEX-SOLID vFTM-SEX",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_V_SEX_FTM);

export const JAR_FANTOM_SEX_S_BTC_RENBTC: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 5c",
  contract: "0xC58902B6573082D4be4D1CA0D2Ea8b4Ed596870f",
  startBlock: 32513558, startTimestamp: 1646382019,
  depositToken: {
    addr: "0x6058345A4D8B89Ddac7042Be08091F91a404B80b",
    name: "SOLIDLY sBTC/RENBTC",
    link: "https://solidly.exchange/liquidity/0x6058345A4D8B89Ddac7042Be08091F91a404B80b",
    components: ["btc", "renbtc"],
    nativePath: {
      //SpookyRouter --> WFTM, BTC
      target: "0xF491e7B69E4244ad4002BC14e878a34207E38c29",
      path: [
        "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",
        "0x321162Cd933E2Be498Cd2267a90534A804051b11",
      ],
    },
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.SEX,
  rewardTokens: ["solid", "sex"],
  details: {
    apiKey: "SEX-SOLID-sBTC-RENBTC",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xc335740c951F45200b38C5Ca84F0A9663b51AEC6",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSEX-SOLID sBTC-RENBTC",
    farmDepositTokenName: "pSEX-SOLID sBTC-RENBTC",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_SEX_S_BTC_RENBTC);

export const JAR_FANTOM_SEX_S_USDC_MIM: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 5d",
  contract: "0x6Bf1768482808C43853Dd5D864C3812BAbE7A939",
  startBlock: 32652856, startTimestamp: 1646509764,
  depositToken: {
    addr: "0xbcab7d083Cf6a01e0DdA9ed7F8a02b47d125e682",
    name: "SOLIDLY sUSDC/MIM",
    link: "https://solidly.exchange/liquidity/0xbcab7d083Cf6a01e0DdA9ed7F8a02b47d125e682",
    components: ["usdc", "mim"],
    nativePath: {
      //Spookyswap: uniswapv2router02--> WFTM, MIM
      target: "0xF491e7B69E4244ad4002BC14e878a34207E38c29",
      path: [
        "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",
        "0x82f0B8B456c1A451378467398982d4834b6829c1",
      ],
    },
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.SEX,
  rewardTokens: ["solid", "sex"],
  details: {
    apiKey: "SEX-SOLID-sUSDC-MIM",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xc335740c951F45200b38C5Ca84F0A9663b51AEC6",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSEX-SOLID sUSDC-MIM",
    farmDepositTokenName: "pSEX-SOLID sUSDC-MIM",
  },
  tags: ["stablecoins"],
};
JAR_DEFINITIONS.push(JAR_FANTOM_SEX_S_USDC_MIM);

export const JAR_FANTOM_SEX_V_FTM_TOMB: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 5e",
  contract: "0x7aC8eB8158B1d50475FAC83bB77f24c0F6Df06f7",
  startBlock: 32652856, startTimestamp: 1646509764, 
  depositToken: {
    addr: "0x60a861Cd30778678E3d613db96139440Bd333143",
    name: "SOLIDLY vFTM/TOMB",
    link: "https://solidly.exchange/liquidity/0x60a861Cd30778678E3d613db96139440Bd333143",
    components: ["ftm", "tomb"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.SEX,
  rewardTokens: ["solid", "sex"],
  details: {
    apiKey: "SEX-SOLID-vFTM-TOMB",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xc335740c951F45200b38C5Ca84F0A9663b51AEC6",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSEX-SOLID vFTM-TOMB",
    farmDepositTokenName: "pSEX-SOLID vFTM-TOMB",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_SEX_V_FTM_TOMB);

export const JAR_FANTOM_SEX_V_FTM_CRV: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 5f",
  contract: "0xaa4191091973FA3FaB3fdEAE7a65062B46972581",
  startBlock: 32655009, startTimestamp: 1646512311,
  depositToken: {
    addr: "0xED7Fd242ce91a541ABcaE52f3d617dacA7fe6e34",
    name: "SOLIDLY vFTM/CRV",
    link: "https://solidly.exchange/liquidity/0xED7Fd242ce91a541ABcaE52f3d617dacA7fe6e34",
    components: ["ftm", "crv"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.SEX,
  rewardTokens: ["solid", "sex"],
  details: {
    apiKey: "SEX-SOLID-vFTM-CRV",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xc335740c951F45200b38C5Ca84F0A9663b51AEC6",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSEX-SOLID vFTM-CRV",
    farmDepositTokenName: "pSEX-SOLID vFTM-CRV",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_SEX_V_FTM_CRV);

export const JAR_FANTOM_SEX_V_FXS_FRAX: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 5g",
  contract: "0xC888126f9805975cCCE9A5eae5cbEdF163e2761d",
  startBlock: 32675050, startTimestamp: 1646530228,
  depositToken: {
    addr: "0x4bBd8467ccd49D5360648CE14830f43a7fEB6e45",
    name: "SOLIDLY vFXS/FRAX",
    link: "https://solidly.exchange/liquidity/0x4bBd8467ccd49D5360648CE14830f43a7fEB6e45",
    components: ["fxs", "frax"],
    nativePath: {
      //spiritSwap--> WFTM, FRAX
      target: "0x16327E3FbDaCA3bcF7E38F5Af2599D2DDc33aE52",
      path: [
        "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",
        "0xdc301622e621166bd8e82f2ca0a26c13ad0be355",
      ],
    },
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.SEX,
  rewardTokens: ["solid", "sex"],
  details: {
    apiKey: "SEX-SOLID-vFXS-FRAX",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xc335740c951F45200b38C5Ca84F0A9663b51AEC6",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSEX-SOLID vFXS-FRAX",
    farmDepositTokenName: "pSEX-SOLID vFXS-FRAX",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_SEX_V_FXS_FRAX);

export const JAR_FANTOM_SEX_V_USDC_OXD: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 5h",
  contract: "0xE985B5Cf5d020408271C2Fae20311967a27ff5C8",
  startBlock: 32676235, startTimestamp: 1646531249,
  depositToken: {
    addr: "0xEaFB5Ae6eEa34954eE5e5a27B068B8705CE926a6",
    name: "SOLIDLY vUSDC/OXD",
    link: "https://solidly.exchange/liquidity/0xEaFB5Ae6eEa34954eE5e5a27B068B8705CE926a6",
    components: ["usdc", "oxdv1"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.SEX,
  rewardTokens: ["solid", "sex"],
  details: {
    apiKey: "SEX-SOLID-vUSDC-OXD",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xc335740c951F45200b38C5Ca84F0A9663b51AEC6",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSEX-SOLID vUSDC-OXD",
    farmDepositTokenName: "pSEX-SOLID vUSDC-OXD",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_SEX_V_USDC_OXD);

export const JAR_FANTOM_SEX_V_YFI_WOOFY: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 5i",
  contract: "0xee6A2f840F30A99759f94536fB0Cd8cb95100A31",
  startBlock: 32677507, startTimestamp: 1646532426,
  depositToken: {
    addr: "0x4b3a172283ecB7d07AB881a9443d38cB1c98F4d0",
    name: "SOLIDLY vYFI/WOOFY",
    link: "https://solidly.exchange/liquidity/0x4b3a172283ecB7d07AB881a9443d38cB1c98F4d0",
    components: ["yfi", "woofy"],
    nativePath: {
      // spiritSwap--> WFTM, YFI
      target: "0x16327E3FbDaCA3bcF7E38F5Af2599D2DDc33aE52",
      path: [
        "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",
        "0x29b0Da86e484E1C0029B56e817912d778aC0EC69",
      ],
    },
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.SEX,
  rewardTokens: ["solid", "sex"],
  details: {
    apiKey: "SEX-SOLID-vYFI-WOOFY",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xc335740c951F45200b38C5Ca84F0A9663b51AEC6",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSEX-SOLID vYFI-WOOFY",
    farmDepositTokenName: "pSEX-SOLID vYFI-WOOFY",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_SEX_V_YFI_WOOFY);

export const JAR_FANTOM_SEX_V_USDC_SYN: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 5j",
  contract: "0x0CA957F137c9809cAEFFC9cf985dbd413c56c795",
  startBlock: 32678517, startTimestamp: 1646533351,
  depositToken: {
    addr: "0xB1b3B96cf35435b2518093acD50E02fe03A0131f",
    name: "SOLIDLY vUSDC/SYN",
    link: "https://solidly.exchange/liquidity/0xB1b3B96cf35435b2518093acD50E02fe03A0131f",
    components: ["usdc", "syn"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.SEX,
  rewardTokens: ["solid", "sex"],
  details: {
    apiKey: "SEX-SOLID-vUSDC-SYN",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xc335740c951F45200b38C5Ca84F0A9663b51AEC6",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSEX-SOLID vUSDC-SYN",
    farmDepositTokenName: "pSEX-SOLID vUSDC-SYN",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_SEX_V_USDC_SYN);

export const JAR_FANTOM_SEX_V_FTM_YFI: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 5k",
  contract: "0x1Eb19bAd944d463C7a2e6e4ca8eB5535d87886dB",
  startBlock: 32680351, startTimestamp: 1646534885,
  depositToken: {
    addr: "0xEa5f4ECf6900833f9B7038e5D8d67142ABb09Dcc",
    name: "SOLIDLY vFTM/YFI",
    link: "https://solidly.exchange/liquidity/0xEa5f4ECf6900833f9B7038e5D8d67142ABb09Dcc",
    components: ["ftm", "yfi"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.SEX,
  rewardTokens: ["solid", "sex"],
  details: {
    apiKey: "SEX-SOLID-vFTM-YFI",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xc335740c951F45200b38C5Ca84F0A9663b51AEC6",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSEX-SOLID vFTM-YFI",
    farmDepositTokenName: "pSEX-SOLID vFTM-YFI",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_SEX_V_FTM_YFI);

export const JAR_FANTOM_SEX_V_FTM_OATH: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 5l",
  contract: "0x1a467F2e1BcD81b866B959D0043a713C9ab34E1F",
  startBlock: 32687038, startTimestamp: 1646541232,
  depositToken: {
    addr: "0x6B987e02Ca5eAE26D8B2bCAc724D4e03b3B0c295",
    name: "SOLIDLY vFTM/OATH",
    link: "https://solidly.exchange/liquidity/0x6B987e02Ca5eAE26D8B2bCAc724D4e03b3B0c295",
    components: ["ftm", "oath"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.SEX,
  rewardTokens: ["solid", "sex"],
  details: {
    apiKey: "SEX-SOLID-vFTM-OATH",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xc335740c951F45200b38C5Ca84F0A9663b51AEC6",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSEX-SOLID vFTM-OATH",
    farmDepositTokenName: "pSEX-SOLID vFTM-OATH",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_SEX_V_FTM_OATH);

export const JAR_FANTOM_SEX_V_FTM_MULTI: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 5m",
  contract: "0x0ab8C90e54260468AE41DB2b2515b4a16c87c8d0",
  startBlock: 32688709, startTimestamp: 1646542888,
  depositToken: {
    addr: "0x94bE7e51efE2A0C06c2281b6b385FCD12C84d6F9",
    name: "SOLIDLY vFTM/MULTI",
    link: "https://solidly.exchange/liquidity/0x94bE7e51efE2A0C06c2281b6b385FCD12C84d6F9",
    components: ["ftm", "multi"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.SEX,
  rewardTokens: ["solid", "sex"],
  details: {
    apiKey: "SEX-SOLID-vFTM-MULTI",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xc335740c951F45200b38C5Ca84F0A9663b51AEC6",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSEX-SOLID vFTM-MULTI",
    farmDepositTokenName: "pSEX-SOLID vFTM-MULTI",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_SEX_V_FTM_MULTI);

export const JAR_FANTOM_SEX_S_SOLID_SOLIDSEX: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 5n",
  contract: "0xa4Cc925E7Ff8322114c38822456c5B23cC87790b",
  startBlock: 32690372, startTimestamp: 1646544638,
  depositToken: {
    addr: "0x62E2819Dd417F3b430B6fa5Fd34a49A377A02ac8",
    name: "SOLIDLY sSOLID/SOLIDSEX",
    link: "https://solidly.exchange/liquidity/0x62E2819Dd417F3b430B6fa5Fd34a49A377A02ac8",
    components: ["solid", "solidsex"],
    nativePath: {
      // spooky--> WFTM, sSOLID
      target: "0xF491e7B69E4244ad4002BC14e878a34207E38c29",
      path: [
        "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",
        "0x888EF71766ca594DED1F0FA3AE64eD2941740A20",
      ],
    },
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.SEX,
  rewardTokens: ["solid", "sex"],
  details: {
    apiKey: "SEX-SOLID-sSOLID-SOLIDSEX",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xc335740c951F45200b38C5Ca84F0A9663b51AEC6",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSEX-SOLID sSOLID-SOLIDSEX",
    farmDepositTokenName: "pSEX-SOLID sSOLID-SOLIDSEX",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_SEX_S_SOLID_SOLIDSEX);

export const JAR_FANTOM_SEX_V_FTM_LQDR: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 5o",
  contract: "0x8723DC0e08fAdAf7e8Ac251eAAAC279486670B67",
  startBlock: 32690926, startTimestamp: 1646545163, 
  depositToken: {
    addr: "0x9861B8a9Acc9B4f249981164bFe7f84202068bfE",
    name: "SOLIDLY vFTM/LQDR",
    link: "https://solidly.exchange/liquidity/0x9861B8a9Acc9B4f249981164bFe7f84202068bfE",
    components: ["ftm", "lqdr"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.SEX,
  rewardTokens: ["solid", "sex"],
  details: {
    apiKey: "SEX-SOLID-vFTM-LQDR",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xc335740c951F45200b38C5Ca84F0A9663b51AEC6",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSEX-SOLID vFTM-LQDR",
    farmDepositTokenName: "pSEX-SOLID vFTM-LQDR",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_SEX_V_FTM_LQDR);

export const JAR_FANTOM_SEX_V_FTM_HND: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 5p",
  contract: "0x8090850e82A35B32D5B01C3Fdfd4594A96F6A694",
  startBlock: 32691451, startTimestamp: 1646545653,
  depositToken: {
    addr: "0x6aAE93f2915b899e87b49a9254434D36ac9570d8",
    name: "SOLIDLY vFTM/HND",
    link: "https://solidly.exchange/liquidity/0x6aAE93f2915b899e87b49a9254434D36ac9570d8",
    components: ["ftm", "hnd"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.SEX,
  rewardTokens: ["solid", "sex"],
  details: {
    apiKey: "SEX-SOLID-vFTM-HND",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xc335740c951F45200b38C5Ca84F0A9663b51AEC6",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSEX-SOLID vFTM-HND",
    farmDepositTokenName: "pSEX-SOLID vFTM-HND",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_SEX_V_FTM_HND);

export const JAR_FANTOM_SEX_V_FTM_IB: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 5q",
  contract: "0x2A8e36CD7aA560706B22883d6EaA0bEF0cBdC70C",
  startBlock: 32691922, startTimestamp: 1646546151,
  depositToken: {
    addr: "0x304B61f3481C977Ffbe630B55f2aBeEe74792664",
    name: "SOLIDLY vFTM/IB",
    link: "https://solidly.exchange/liquidity/0x304B61f3481C977Ffbe630B55f2aBeEe74792664",
    components: ["ftm", "ib"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.SEX,
  rewardTokens: ["solid", "sex"],
  details: {
    apiKey: "SEX-SOLID-vFTM-IB",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xc335740c951F45200b38C5Ca84F0A9663b51AEC6",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSEX-SOLID vFTM-IB",
    farmDepositTokenName: "pSEX-SOLID vFTM-IB",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_SEX_V_FTM_IB);

export const JAR_FANTOM_SEX_V_FTM_GEIST: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 5r",
  contract: "0x88d509f5bFd5aA31e4C249A4086ad0024D6b47c0",
  startBlock: 32695198, startTimestamp: 1646549376,
  depositToken: {
    addr: "0xAe885ef155F2835Dce9c66b0A7a3A0c8c0622aa1",
    name: "SOLIDLY vFTM/GEIST",
    link: "https://solidly.exchange/liquidity/0xAe885ef155F2835Dce9c66b0A7a3A0c8c0622aa1",
    components: ["ftm", "geist"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.SEX,
  rewardTokens: ["solid", "sex"],
  details: {
    apiKey: "SEX-SOLID-vFTM-GEIST",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xc335740c951F45200b38C5Ca84F0A9663b51AEC6",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSEX-SOLID vFTM-GEIST",
    farmDepositTokenName: "pSEX-SOLID vFTM-GEIST",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_SEX_V_FTM_GEIST);

export const JAR_FANTOM_SEX_V_BIFI_MAI: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 5s",
  contract: "0xbd6796eC68ee2c8669eB147dC6610072aF0d4D37",
  startBlock: 32688280, startTimestamp: 1646542366,
  depositToken: {
    addr: "0x8aeB0503E13F7bea02F80986a8FDb2AccE5C6b6C",
    name: "SOLIDLY vBIFI/MAI",
    link: "https://solidly.exchange/liquidity/0x8aeB0503E13F7bea02F80986a8FDb2AccE5C6b6C",
    components: ["bifi", "mimatic"],
    nativePath: {
      //spritSwap--> WFTM, miMATIC
      target: "0x16327E3FbDaCA3bcF7E38F5Af2599D2DDc33aE52",
      path: [
        "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",
        "0xfB98B335551a418cD0737375a2ea0ded62Ea213b",
      ],
    },
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.SEX,
  rewardTokens: ["solid", "sex"],
  details: {
    apiKey: "SEX-SOLID-vBIFI-MAI",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xc335740c951F45200b38C5Ca84F0A9663b51AEC6",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSEX-SOLID vBIFI-MAI",
    farmDepositTokenName: "pSEX-SOLID vBIFI-MAI",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_SEX_V_BIFI_MAI);

export const JAR_FANTOM_SEX_V_CRV_G3CRV: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 5u",
  contract: "0x2a1fF1Dd09EEB7095e2CA0b1dba67d792250ab0a",
  startBlock: 32752906, startTimestamp: 1646617796,
  depositToken: {
    addr: "0x6Ca598726d7c9Ed382A101789c5f086F7165eFa1",
    name: "SOLIDLY vCRV/G3CRV",
    link: "https://solidly.exchange/liquidity/0x6Ca598726d7c9Ed382A101789c5f086F7165eFa1",
    components: ["crv", "g3crv"],
    nativePath: {
      //spookySwap--> WFTM, CRV
      target: "0xF491e7B69E4244ad4002BC14e878a34207E38c29",
      path: [
        "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",
        "0x1E4F97b9f9F913c46F1632781732927B9019C68b",
      ],
    },
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.SEX,
  rewardTokens: ["solid", "sex"],
  details: {
    apiKey: "SEX-SOLID-vCRV-G3CRV",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xc335740c951F45200b38C5Ca84F0A9663b51AEC6",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSEX-SOLID vCRV-G3CRV",
    farmDepositTokenName: "pSEX-SOLID vCRV-G3CRV",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_SEX_V_CRV_G3CRV);

export const JAR_FANTOM_SEX_S_FTM_BEFTM: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 5v",
  contract: "0xE4dd453e7D115CcAeA756cd0977b3E571D4e2b4B",
  startBlock: 32753558, startTimestamp: 1646618386,
  depositToken: {
    addr: "0x387a11D161f6855Bd3c801bA6C79Fe9b824Ce1f3",
    name: "SOLIDLY sFTM/BEFTM",
    link: "https://solidly.exchange/liquidity/0x387a11D161f6855Bd3c801bA6C79Fe9b824Ce1f3",
    components: ["ftm", "beftm"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.SEX,
  rewardTokens: ["solid", "sex"],
  details: {
    apiKey: "SEX-SOLID-sFTM-BEFTM",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xc335740c951F45200b38C5Ca84F0A9663b51AEC6",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSEX-SOLID sFTM-BEFTM",
    farmDepositTokenName: "pSEX-SOLID sFTM-BEFTM",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_SEX_S_FTM_BEFTM);

export const JAR_FANTOM_SEX_V_FTM_SOLIDSEX: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 5w",
  contract: "0x71D36Ee3D59413E9e5FD8FDF349D2f200fF9495f",
  startBlock: 32754199, startTimestamp: 1646618988,
  depositToken: {
    addr: "0xa66901D1965F5410dEeB4d0Bb43f7c1B628Cb20b",
    name: "SOLIDLY vFTM/SOLIDSEX",
    link: "https://solidly.exchange/liquidity/0xa66901D1965F5410dEeB4d0Bb43f7c1B628Cb20b",
    components: ["ftm", "solidsex"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.SEX,
  rewardTokens: ["solid", "sex"],
  details: {
    apiKey: "SEX-SOLID-vFTM-SOLIDSEX",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xc335740c951F45200b38C5Ca84F0A9663b51AEC6",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSEX-SOLID vFTM-SOLIDSEX",
    farmDepositTokenName: "pSEX-SOLID vFTM-SOLIDSEX",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_SEX_V_FTM_SOLIDSEX);

export const JAR_FANTOM_SEX_S_USDC_DAI: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 5x",
  contract: "0x805A28E9F02C7CaB064E4c450904F8B336bD3E0b",
  startBlock: 32755499, startTimestamp: 1646620323,
  depositToken: {
    addr: "0xC0240Ee4405f11EFb87A00B432A8be7b7Afc97CC",
    name: "SOLIDLY sUSDC/DAI",
    link: "https://solidly.exchange/liquidity/0xC0240Ee4405f11EFb87A00B432A8be7b7Afc97CC",
    components: ["usdc", "dai"],
    nativePath: {
      //Spookyswap: uniswapv2router02--> WFTM, DAI
      target: "0xF491e7B69E4244ad4002BC14e878a34207E38c29",
      path: [
        "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",
        "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E",
      ],
    },
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.SEX,
  rewardTokens: ["solid", "sex"],
  details: {
    apiKey: "SEX-SOLID-sUSDC-DAI",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xc335740c951F45200b38C5Ca84F0A9663b51AEC6",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSEX-SOLID sUSDC-DAI",
    farmDepositTokenName: "pSEX-SOLID sUSDC-DAI",
  },
  tags: ["stablecoins"],
};
JAR_DEFINITIONS.push(JAR_FANTOM_SEX_S_USDC_DAI);

export const JAR_FANTOM_SEX_V_FTM_SYN: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 5y",
  contract: "0xa6e8D4a3bE37b7bA214D55BDC9FeC5923766E7AE",
  startBlock: 32756110, startTimestamp: 1646620865,
  depositToken: {
    addr: "0x8aa410d8B0Cc3dE48AAC8eB5d928646A00e6ff04",
    name: "SOLIDLY vFTM/SYN",
    link: "https://solidly.exchange/liquidity/0x8aa410d8B0Cc3dE48AAC8eB5d928646A00e6ff04",
    components: ["ftm", "syn"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.SEX,
  rewardTokens: ["solid", "sex"],
  details: {
    apiKey: "SEX-SOLID-vFTM-SYN",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xc335740c951F45200b38C5Ca84F0A9663b51AEC6",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSEX-SOLID vFTM-SYN",
    farmDepositTokenName: "pSEX-SOLID vFTM-SYN",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_SEX_V_FTM_SYN);

export const JAR_FANTOM_SEX_V_TAROT_XTAROT: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 5z",
  contract: "0xE785318c44F7F013FdBa2E0DEf2a0381b5622e1D",
  startBlock: 32756803, startTimestamp: 1646621629,
  depositToken: {
    addr: "0x4FE782133af0f7604B9B89Bf95893ADDE265FEFD",
    name: "SOLIDLY vTAROT/XTAROT",
    link: "https://solidly.exchange/liquidity/0x4FE782133af0f7604B9B89Bf95893ADDE265FEFD",
    components: ["tarot", "xtarot"],
    nativePath: {
      //spritSwap--> WFTM, TAROT
      target: "0x16327E3FbDaCA3bcF7E38F5Af2599D2DDc33aE52",
      path: [
        "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",
        "0xc5e2b037d30a390e62180970b3aa4e91868764cd",
      ],
    },
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.SEX,
  rewardTokens: ["solid", "sex"],
  details: {
    apiKey: "SEX-SOLID-vTAROT-XTAROT",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xc335740c951F45200b38C5Ca84F0A9663b51AEC6",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSEX-SOLID vTAROT-XTAROT",
    farmDepositTokenName: "pSEX-SOLID vTAROT-XTAROT",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_SEX_V_TAROT_XTAROT);

export const JAR_FANTOM_SEX_S_USDC_DEI: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 5aa",
  contract: "0xe5F0A614d4C63f535D36a5871bf6dC3CA01C5d0c",
  startBlock: 32757865, startTimestamp: 1646622736,
  depositToken: {
    addr: "0x5821573d8F04947952e76d94f3ABC6d7b43bF8d0",
    name: "SOLIDLY sUSDC/DEI",
    link: "https://solidly.exchange/liquidity/0x5821573d8F04947952e76d94f3ABC6d7b43bF8d0",
    components: ["usdc", "dei"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.SEX,
  rewardTokens: ["solid", "sex"],
  details: {
    apiKey: "SEX-SOLID-sUSDC-DEI",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xc335740c951F45200b38C5Ca84F0A9663b51AEC6",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSEX-SOLID sUSDC-DEI",
    farmDepositTokenName: "pSEX-SOLID sUSDC-DEI",
  },
  tags: ["stablecoins"],
};
JAR_DEFINITIONS.push(JAR_FANTOM_SEX_S_USDC_DEI);

export const JAR_FANTOM_SEX_V_FTM_RDL: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 5ab",
  contract: "0xac1201bd98E20F7231d22c82E3c5fA9d98EC30c7",
  startBlock: 32758395, startTimestamp: 1646623403,
  depositToken: {
    addr: "0x5ef8f0bd4F071B0199603a28ec9343F3651999c0",
    name: "SOLIDLY vFTM/RDL",
    link: "https://solidly.exchange/liquidity/0x5ef8f0bd4F071B0199603a28ec9343F3651999c0",
    components: ["ftm", "rdl"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.SEX,
  rewardTokens: ["solid", "sex"],
  details: {
    apiKey: "SEX-SOLID-vFTM-RDL",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xc335740c951F45200b38C5Ca84F0A9663b51AEC6",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSEX-SOLID vFTM-RDL",
    farmDepositTokenName: "pSEX-SOLID vFTM-RDL",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_SEX_V_FTM_RDL);

export const JAR_FANTOM_SEX_V_GEIST_G3CRV: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 5ac",
  contract: "0xB155DbD56bBE5Fec5Ca6414e0e9Ef0b8691574e2",
  startBlock: 32759165, startTimestamp: 1646624392,
  depositToken: {
    addr: "0x6c90B69aF6DBD929458497a8D1013Aa255ac71F1",
    name: "SOLIDLY vGEIST/G3CRV",
    link: "https://solidly.exchange/liquidity/0x6c90B69aF6DBD929458497a8D1013Aa255ac71F1",
    components: ["geist", "g3crv"],
    nativePath: {
      // SpookySwap--> WFTM, GEIST
      target: "0xF491e7B69E4244ad4002BC14e878a34207E38c29",
      path: [
        "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",
        "0xd8321aa83fb0a4ecd6348d4577431310a6e0814d",
      ],
    },
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.SEX,
  rewardTokens: ["solid", "sex"],
  details: {
    apiKey: "SEX-SOLID-vGEIST-G3CRV",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xc335740c951F45200b38C5Ca84F0A9663b51AEC6",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSEX-SOLID vGEIST-G3CRV",
    farmDepositTokenName: "pSEX-SOLID vGEIST-G3CRV",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_SEX_V_GEIST_G3CRV);

export const JAR_FANTOM_SEX_V_SOLIDSEX_G3CRV: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 5ad",
  contract: "0x6C2A1cBF315eb75e2482d81629c0d54Be1725c88",
  startBlock: 32759165, startTimestamp: 1646624392,
  depositToken: {
    addr: "0x817CafF2dAC62BDCcE1EBE332cA128215Dbd9e9a",
    name: "SOLIDLY vSOLIDSEX/G3CRV",
    link: "https://solidly.exchange/liquidity/0x817CafF2dAC62BDCcE1EBE332cA128215Dbd9e9a",
    components: ["solidsex", "g3crv"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.SEX,
  rewardTokens: ["solid", "sex"],
  details: {
    apiKey: "SEX-SOLID-vSOLIDSEX-G3CRV",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xc335740c951F45200b38C5Ca84F0A9663b51AEC6",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSEX-SOLID vSOLIDSEX-G3CRV",
    farmDepositTokenName: "pSEX-SOLID vSOLIDSEX-G3CRV",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_SEX_V_SOLIDSEX_G3CRV);

export const JAR_FANTOM_SEX_V_FTM_USDC: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 5ae",
  contract: "0xcb0e7a3eAA1D817ad73406101e0B4F8AE92A309C",
  startBlock: 32760328, startTimestamp: 1646625428,
  depositToken: {
    addr: "0xBad7D3DF8E1614d985C3D9ba9f6ecd32ae7Dc20a",
    name: "SOLIDLY vFTM/USDC",
    link: "https://solidly.exchange/liquidity/0xBad7D3DF8E1614d985C3D9ba9f6ecd32ae7Dc20a",
    components: ["ftm", "usdc"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.SEX,
  rewardTokens: ["solid", "sex"],
  details: {
    apiKey: "SEX-SOLID-vFTM-USDC",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xc335740c951F45200b38C5Ca84F0A9663b51AEC6",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSEX-SOLID vFTM-USDC",
    farmDepositTokenName: "pSEX-SOLID vFTM-USDC",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_SEX_V_FTM_USDC);

export const JAR_FANTOM_SEX_S_SPIRIT_RAINSPIRIT: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 5af",
  contract: "0x2034254BD25fc55F6D1dA47085b59d38A752a615",
  startBlock: 32760874, startTimestamp: 1646625958,
  depositToken: {
    addr: "0xCa395560B6003D921D9408aF011C6C61399F66cA",
    name: "SOLIDLY sSPIRIT/RAINSPIRIT",
    link: "https://solidly.exchange/liquidity/0xCa395560B6003D921D9408aF011C6C61399F66cA",
    components: ["spirit", "rainspirit"],
    nativePath: {
      //SpritSwap : SpiritRouter--> WFTM, SPIRIT
      target: "0x16327E3FbDaCA3bcF7E38F5Af2599D2DDc33aE52",
      path: [
        "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",
        "0x5Cc61A78F164885776AA610fb0FE1257df78E59B",
      ],
    },
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.SEX,
  rewardTokens: ["solid", "sex"],
  details: {
    apiKey: "SEX-SOLID-sSPIRIT-RAINSPIRIT",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xc335740c951F45200b38C5Ca84F0A9663b51AEC6",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSEX-SOLID sSPIRIT-RAINSPIRIT",
    farmDepositTokenName: "pSEX-SOLID sSPIRIT-RAINSPIRIT",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_SEX_S_SPIRIT_RAINSPIRIT);

export const JAR_FANTOM_SEX_S_SPIRIT_LINSPIRIT: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 5ag",
  contract: "0x71E7974e6Fa0c4407BF2EA4244A265319971C4Dd",
  startBlock: 32761481, startTimestamp: 1646626487,
  depositToken: {
    addr: "0xd6be7592E5C424623c8C9557738970aE19ab5de2",
    name: "SOLIDLY sSPIRIT/LINSPIRIT",
    link: "https://solidly.exchange/liquidity/0xd6be7592E5C424623c8C9557738970aE19ab5de2",
    components: ["spirit", "linspirit"],
    nativePath: {
      //SpritSwap : SpiritRouter--> WFTM, SPIRIT
      target: "0x16327E3FbDaCA3bcF7E38F5Af2599D2DDc33aE52",
      path: [
        "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",
        "0x5Cc61A78F164885776AA610fb0FE1257df78E59B",
      ],
    },
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.SEX,
  rewardTokens: ["solid", "sex"],
  details: {
    apiKey: "SEX-SOLID-sSPIRIT-LINSPIRIT",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xc335740c951F45200b38C5Ca84F0A9663b51AEC6",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSEX-SOLID sSPIRIT-LINSPIRIT",
    farmDepositTokenName: "pSEX-SOLID sSPIRIT-LINSPIRIT",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_SEX_S_SPIRIT_LINSPIRIT);

export const JAR_FANTOM_SEX_V_FTM_SOLID: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 5ah",
  contract: "0xCEdC1583a1380FB1BD71fF14a11AF9E3c77D9994",
  startBlock: 32762078, startTimestamp: 1646626974,
  depositToken: {
    addr: "0xe4bc39fdD4618a76f6472079C329bdfa820afA75",
    name: "SOLIDLY vFTM/SOLID",
    link: "https://solidly.exchange/liquidity/0xe4bc39fdD4618a76f6472079C329bdfa820afA75",
    components: ["ftm", "solid"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.SEX,
  rewardTokens: ["solid", "sex"],
  details: {
    apiKey: "SEX-SOLID-vFTM-SOLID",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xc335740c951F45200b38C5Ca84F0A9663b51AEC6",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSEX-SOLID vFTM-SOLID",
    farmDepositTokenName: "pSEX-SOLID vFTM-SOLID",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_SEX_V_FTM_SOLID);

export const JAR_FANTOM_SEX_S_SPIRIT_SINSPIRIT: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 5ai",
  contract: "0x3831d7BD0A6d969A821703CAF8ee21310FFA2FB7",
  startBlock: 32762744, startTimestamp: 1646627565,
  depositToken: {
    addr: "0x742C384D6EDeC91466042ba84E5e751c4eAFf962",
    name: "SOLIDLY sSPIRIT/SINSPIRIT",
    link: "https://solidly.exchange/liquidity/0x742C384D6EDeC91466042ba84E5e751c4eAFf962",
    components: ["spirit", "sinspirit"],
    nativePath: {
      //SpritSwap : SpiritRouter--> WFTM, SPIRIT
      target: "0x16327E3FbDaCA3bcF7E38F5Af2599D2DDc33aE52",
      path: [
        "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",
        "0x5Cc61A78F164885776AA610fb0FE1257df78E59B",
      ],
    },
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.SEX,
  rewardTokens: ["solid", "sex"],
  details: {
    apiKey: "SEX-SOLID-sSPIRIT-SINSPIRIT",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xc335740c951F45200b38C5Ca84F0A9663b51AEC6",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSEX-SOLID sSPIRIT-SINSPIRIT",
    farmDepositTokenName: "pSEX-SOLID sSPIRIT-SINSPIRIT",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_SEX_S_SPIRIT_SINSPIRIT);

export const JAR_FANTOM_SEX_S_SPIRIT_BINSPIRIT: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 5aj",
  contract: "0x82775DE4283A80e1c80D3416695C27DA00D269F4",
  startBlock: 32764321, startTimestamp: 1646629262,
  depositToken: {
    addr: "0xa7Ea870dc93ffB712ca74b43eFCA9B07556d1303",
    name: "SOLIDLY sSPIRIT/BINSPIRIT",
    link: "https://solidly.exchange/liquidity/0xa7Ea870dc93ffB712ca74b43eFCA9B07556d1303",
    components: ["spirit", "binspirit"],
    nativePath: {
      //SpritSwap : SpiritRouter--> WFTM, SPIRIT
      target: "0x16327E3FbDaCA3bcF7E38F5Af2599D2DDc33aE52",
      path: [
        "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",
        "0x5Cc61A78F164885776AA610fb0FE1257df78E59B",
      ],
    },
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.SEX,
  rewardTokens: ["solid", "sex"],
  details: {
    apiKey: "SEX-SOLID-sSPIRIT-BINSPIRIT",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xc335740c951F45200b38C5Ca84F0A9663b51AEC6",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSEX-SOLID sSPIRIT-BINSPIRIT",
    farmDepositTokenName: "pSEX-SOLID sSPIRIT-BINSPIRIT",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_SEX_S_SPIRIT_BINSPIRIT);

export const JAR_FANTOM_SEX_V_USDC_DAI: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 5ak",
  contract: "0x684d7C203a68fB38AB0F8194BdBD225f3d8Da416",
  startBlock: 32764921, startTimestamp: 1646629874,
  depositToken: {
    addr: "0x4e9B80F91E954AE532fF765822fcB5a6bC36cAa6",
    name: "SOLIDLY vUSDC/DAI",
    link: "https://solidly.exchange/liquidity/0x4e9B80F91E954AE532fF765822fcB5a6bC36cAa6",
    components: ["usdc", "dai"],
    nativePath: {
      //Spookyswap: uniswapv2router02--> WFTM, USDC
      target: "0xF491e7B69E4244ad4002BC14e878a34207E38c29",
      path: [
        "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",
        "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75",
      ],
    },
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.SEX,
  rewardTokens: ["solid", "sex"],
  details: {
    apiKey: "SEX-SOLID-vUSDC-DAI",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xc335740c951F45200b38C5Ca84F0A9663b51AEC6",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSEX-SOLID vUSDC-DAI",
    farmDepositTokenName: "pSEX-SOLID vUSDC-DAI",
  },
  tags: ["stablecoins"],
};
JAR_DEFINITIONS.push(JAR_FANTOM_SEX_V_USDC_DAI);

export const JAR_FANTOM_SEX_V_FTM_TAROT: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 5al",
  contract: "0x2c4afD3e2FFe7Db30758Bc982fda771eAE5ea88c",
  startBlock: 32830912, startTimestamp: 1646697517,
  depositToken: {
    addr: "0x783f1eDBE336981dFCb74Bd0B803655F55AaDF48",
    name: "SOLIDLY vFTM/TAROT",
    link: "https://solidly.exchange/liquidity/0x783f1eDBE336981dFCb74Bd0B803655F55AaDF48",
    components: ["ftm", "tarot"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.SEX,
  rewardTokens: ["solid", "sex"],
  details: {
    apiKey: "SEX-SOLID-vFTM-TAROT",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xc335740c951F45200b38C5Ca84F0A9663b51AEC6",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSEX-SOLID vFTM-TAROT",
    farmDepositTokenName: "pSEX-SOLID vFTM-TAROT",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_SEX_V_FTM_TAROT);

export const JAR_FANTOM_SEX_V_CRE8R_BOMB: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 5am",
  contract: "0x62e58b10D306ffE35B1924f6CeaaaF0EdFF70D3F",
  startBlock: 328315, startTimestamp: 164190173165,
  depositToken: {
    addr: "0x5b3b8F8D92472c6cdC0c6a7d0acD29E53cc00d28",
    name: "SOLIDLY vCRE8R/BOMB",
    link: "https://solidly.exchange/liquidity/0x5b3b8F8D92472c6cdC0c6a7d0acD29E53cc00d28",
    components: ["cre8r", "bomb"],
    nativePath: {
      //spritSwap : --> WFTM, BOMB
      target: "0x16327E3FbDaCA3bcF7E38F5Af2599D2DDc33aE52",
      path: [
        "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",
        "0x8503eb4a136bdbeb323e37aa6e0fa0c772228378",
      ],
    },
  },
  enablement: AssetEnablement.PERMANENTLY_DISABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.SEX,
  rewardTokens: ["solid", "sex"],
  details: {
    apiKey: "SEX-SOLID-vCRE8R-BOMB",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xc335740c951F45200b38C5Ca84F0A9663b51AEC6",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSEX-SOLID vCRE8R-BOMB",
    farmDepositTokenName: "pSEX-SOLID vCRE8R-BOMB",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_SEX_V_CRE8R_BOMB);

export const JAR_FANTOM_SPIRIT_FTM: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 6a",
  contract: "0xF4cE6E6A2480BfaB373da09336f0fF107Bd9063d",
  startBlock: 32698813, startTimestamp: 1646552726,
  depositToken: {
    addr: "0x30748322B6E34545DBe0788C421886AEB5297789",
    name: "SPIRIT FTM/SPIRIT",
    link: "https://swap.spiritswap.finance/#/add/FTM/0x5Cc61A78F164885776AA610fb0FE1257df78E59B",
    components: ["ftm", "spirit"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SPIRITSWAP,
  stakingProtocol: AssetProtocol.SPIRITSWAP,
  rewardTokens: ["spirit"],
  details: {
    apiKey: "SPIRIT-FTM-SPIRIT",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xb1698a97b497c998b2b2291bb5c48d1d6075836a",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSPIRIT FTM-SPIRIT",
    farmDepositTokenName: "pSPIRIT FTM-SPIRIT",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_SPIRIT_FTM);

export const JAR_FANTOM_SPIRIT_FTM_TREEB: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 6b",
  contract: "0xf1299FC7F719A49Fc015C8A758823d8fE5526110",
  startBlock: 32699104, startTimestamp: 1646552962,
  depositToken: {
    addr: "0x2cEfF1982591c8B0a73b36D2A6C2A6964Da0E869",
    name: "SPIRIT FTM/TREEB",
    link: "https://swap.spiritswap.finance/#/add/FTM/0xc60d7067dfbc6f2caf30523a064f416a5af52963",
    components: ["ftm", "treeb"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SPIRITSWAP,
  stakingProtocol: AssetProtocol.SPIRITSWAP,
  rewardTokens: ["spirit"],
  details: {
    apiKey: "SPIRIT-FTM-TREEB",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xb1698a97b497c998b2b2291bb5c48d1d6075836a",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSPIRIT FTM-TREEB",
    farmDepositTokenName: "pSPIRIT FTM-TREEB",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_SPIRIT_FTM_TREEB);

export const JAR_FANTOM_SPIRIT_FTM_MAI: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 6c",
  contract: "0xC92445C06E705403b3696814C133AA18511d220E",
  startBlock: 32699399, startTimestamp: 1646553203,
  depositToken: {
    addr: "0x51Eb93ECfEFFbB2f6fE6106c4491B5a0B944E8bd",
    name: "SPIRIT FTM/MAI",
    link: "https://swap.spiritswap.finance/#/add/FTM/0xfb98b335551a418cd0737375a2ea0ded62ea213b",
    components: ["ftm", "mimatic"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SPIRITSWAP,
  stakingProtocol: AssetProtocol.SPIRITSWAP,
  rewardTokens: ["spirit"],
  details: {
    apiKey: "SPIRIT-FTM-MAI",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xb1698a97b497c998b2b2291bb5c48d1d6075836a",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSPIRIT FTM-MAI",
    farmDepositTokenName: "pSPIRIT FTM-MAI",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_SPIRIT_FTM_MAI);

export const JAR_FANTOM_SPIRIT_FTM_LQDR: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 6d",
  contract: "0x6593178bFc883A57C3fcB4516276494a29B1c49B",
  startBlock: 32690926, startTimestamp: 1646545163,
  depositToken: {
    addr: "0x4Fe6f19031239F105F753D1DF8A0d24857D0cAA2",
    name: "SPIRIT FTM/LQDR",
    link: "https://swap.spiritswap.finance/#/add/FTM/0x5Cc61A78F164885776AA610fb0FE1257df78E59B",
    components: ["ftm", "lqdr"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SPIRITSWAP,
  stakingProtocol: AssetProtocol.SPIRITSWAP,
  rewardTokens: ["spirit"],
  details: {
    apiKey: "SPIRIT-FTM-LQDR",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xb1698a97b497c998b2b2291bb5c48d1d6075836a",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSPIRIT FTM-LQDR",
    farmDepositTokenName: "pSPIRIT FTM-LQDR",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_SPIRIT_FTM_LQDR);

export const JAR_FANTOM_SPIRIT_FTM_FRAX: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 6e",
  contract: "0x43982D86a5f42ad48D2c4130FF4BB03c98414937",
  startBlock: 32699984, startTimestamp: 1646553700,
  depositToken: {
    addr: "0x7ed0cdDB9BB6c6dfEa6fB63E117c8305479B8D7D",
    name: "SPIRIT FTM/FRAX",
    link: "https://swap.spiritswap.finance/#/add/FTM/0xdc301622e621166BD8E82f2cA0A26c13Ad0BE355",
    components: ["ftm", "frax"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SPIRITSWAP,
  stakingProtocol: AssetProtocol.SPIRITSWAP,
  rewardTokens: ["spirit"],
  details: {
    apiKey: "SPIRIT-FTM-FRAX",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xb1698a97b497c998b2b2291bb5c48d1d6075836a",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSPIRIT FTM-FRAX",
    farmDepositTokenName: "pSPIRIT FTM-FRAX",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_SPIRIT_FTM_FRAX);

export const JAR_FANTOM_SPIRIT_FTM_DEUS: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 6f",
  contract: "0x1F16C280ad81dc9f6aF845A0aEE0b6F481De4b77",
  startBlock: 32700275, startTimestamp: 1646553939,
  depositToken: {
    addr: "0x2599Eba5fD1e49F294C76D034557948034d6C96E",
    name: "SPIRIT FTM/DEUS",
    link: "https://swap.spiritswap.finance/#/add/FTM/0xDE5ed76E7c05eC5e4572CfC88d1ACEA165109E44",
    components: ["ftm", "deus"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SPIRITSWAP,
  stakingProtocol: AssetProtocol.SPIRITSWAP,
  rewardTokens: ["spirit"],
  details: {
    apiKey: "SPIRIT-FTM-DEUS",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xb1698a97b497c998b2b2291bb5c48d1d6075836a",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSPIRIT FTM-DEUS",
    farmDepositTokenName: "pSPIRIT FTM-DEUS",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_SPIRIT_FTM_DEUS);

export const JAR_FANTOM_SPIRIT_FTM_CRE8R: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 6g",
  contract: "0xf90F53896a561A4eBAD71f5C10B74026e62661D5",
  startBlock: 32700560, startTimestamp: 1646554290,
  depositToken: {
    addr: "0x459e7c947E04d73687e786E4A48815005dFBd49A",
    name: "SPIRIT FTM/CRE8R",
    link: "https://swap.spiritswap.finance/#/add/FTM/0x2ad402655243203fcfa7dcb62f8a08cc2ba88ae0",
    components: ["ftm", "cre8r"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SPIRITSWAP,
  stakingProtocol: AssetProtocol.SPIRITSWAP,
  rewardTokens: ["spirit"],
  details: {
    apiKey: "SPIRIT-FTM-CRE8R",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xb1698a97b497c998b2b2291bb5c48d1d6075836a",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSPIRIT FTM-CRE8R",
    farmDepositTokenName: "pSPIRIT FTM-CRE8R",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_SPIRIT_FTM_CRE8R);

export const JAR_FANTOM_SPIRIT_FTM_BIFI: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 6h",
  contract: "0xE9cE4c7EA009AbC1427B7d4501eee26186b923f4",
  startBlock: 32700862, startTimestamp: 1646554553,
  depositToken: {
    addr: "0xc28cf9aeBfe1A07A27B3A4d722C841310e504Fe3",
    name: "SPIRIT FTM/BIFI",
    link: "https://swap.spiritswap.finance/#/add/FTM/0xd6070ae98b8069de6B494332d1A1a81B6179D960",
    components: ["ftm", "bifi"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SPIRITSWAP,
  stakingProtocol: AssetProtocol.SPIRITSWAP,
  rewardTokens: ["spirit"],
  details: {
    apiKey: "SPIRIT-FTM-BIFI",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xb1698a97b497c998b2b2291bb5c48d1d6075836a",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSPIRIT FTM-BIFI",
    farmDepositTokenName: "pSPIRIT FTM-BIFI",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_SPIRIT_FTM_BIFI);

export const JAR_FANTOM_SPIRIT_GSCARAB_SCARAB: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 6i",
  contract: "0x46C232c456d090776212C360eD63Ed192cCa560d",
  startBlock: 32701154, startTimestamp: 1646554800,
  depositToken: {
    addr: "0x8e38543d4c764DBd8f8b98C73407457a3D3b4999",
    name: "SPIRIT GSCARAB/SCARAB",
    link: "https://swap.spiritswap.finance/#/add/0x6ab5660f0B1f174CFA84e9977c15645e4848F5D6/0x2e79205648B85485731CFE3025d66cF2d3B059c4",
    components: ["gscarab", "scarab"],
    nativePath: {
      //(SpiritSwap)SpiritRouter --> WFTM, SCARAB
      target: "0x16327E3FbDaCA3bcF7E38F5Af2599D2DDc33aE52",
      path: [
        "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",
        "0x2e79205648B85485731CFE3025d66cF2d3B059c4",
      ],
    },
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SPIRITSWAP,
  stakingProtocol: AssetProtocol.SPIRITSWAP,
  rewardTokens: ["spirit"],
  details: {
    apiKey: "SPIRIT-GSCARAB-SCARAB",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xb1698a97b497c998b2b2291bb5c48d1d6075836a",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSPIRIT GSCARAB-SCARAB",
    farmDepositTokenName: "pSPIRIT GSCARAB-SCARAB",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_SPIRIT_GSCARAB_SCARAB);

export const JAR_FANTOM_STAR_USDC: JarDefinition = {
  type: AssetType.JAR,
  id: "fanJar 7a",
  contract: "0xB64A68448bb5B294C7C8543133663f2D67e1959e",
  startBlock: 34398357, startTimestamp: 1648249880,
  depositToken: {
    addr: "0x12edeA9cd262006cC3C4E77c90d2CD2DD4b1eb97",
    name: "STARGATE USDC",
    link: "https://stargate.finance/pool/USDC-FTM/add",
    components: ["usdc"],
    decimals: 6,
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.STARGATE,
  stakingProtocol: AssetProtocol.STARGATE,
  rewardTokens: ["stg"],
  details: {
    apiKey: "STG-FANTOM-USDC",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xc335740c951F45200b38C5Ca84F0A9663b51AEC6",
    decimals: 6,
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSTG USDC",
    farmDepositTokenName: "pSTG USDC",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_STAR_USDC);

export const JAR_FANTOM_OXD_SOLIDLY_VOLATILE_CRV_G3CRV: JarDefinition = {
  type: AssetType.JAR,
  id: "fantomJar 8a",
  contract: "0x77fA2c520055820E151706D180f491258F0b0918",
  startBlock: 35196486, startTimestamp: 1649060149,
  depositToken: {
    addr: "0x6Ca598726d7c9Ed382A101789c5f086F7165eFa1",
    name: "OxdSolidlyLP CRV/G3CRV",
    link: "https://solidly.exchange/liquidity//0x6Ca598726d7c9Ed382A101789c5f086F7165eFa1",
    components: ["crv", "g3crv"],
  },
  rewardTokens: ["oxd", "solid"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.OXD,
  details: {
    apiKey: "OXDSOLIDLYLP-CRV-G3CRV",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xB1698A97b497c998b2B2291bb5C48D1d6075836a",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pOxdSolidlyLP CRV/G3CRV",
    farmDepositTokenName: "pOxdSolidlyLP CRV/G3CRV",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_OXD_SOLIDLY_VOLATILE_CRV_G3CRV);

export const JAR_FANTOM_OXD_SOLIDLY_VOLATILE_WFTM_MULTI: JarDefinition = {
  type: AssetType.JAR,
  id: "fantomJar 8b",
  contract: "0x0Fb5c1087b61eF58a734F4f36511ECf6e669f500",
  startBlock: 35197442, startTimestamp: 1649061041,
  depositToken: {
    addr: "0x94bE7e51efE2A0C06c2281b6b385FCD12C84d6F9",
    name: "OxdSolidlyLP WFTM/MULTI",
    link: "https://solidly.exchange/liquidity/0x94bE7e51efE2A0C06c2281b6b385FCD12C84d6F9",
    components: ["ftm", "multi"],
  },
  rewardTokens: ["oxd", "solid"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.OXD,
  details: {
    apiKey: "OXDSOLIDLYLP-WFTM-MULTI",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xB1698A97b497c998b2B2291bb5C48D1d6075836a",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pOxdSolidlyLP WFTM/MULTI",
    farmDepositTokenName: "pOxdSolidlyLP WFTM/MULTI",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_OXD_SOLIDLY_VOLATILE_WFTM_MULTI);

export const JAR_FANTOM_OXD_SOLIDLY_VOLATILE_LQDR_WFTM: JarDefinition = {
  type: AssetType.JAR,
  id: "fantomJar 8c",
  contract: "0x849F7AbA187787e8C2FF7D9bE1ae97c87314614B",
  startBlock: 35198431, startTimestamp: 1649061965,
  depositToken: {
    addr: "0x9861B8a9Acc9B4f249981164bFe7f84202068bfE",
    name: "OxdSolidlyLP LQDR/WFTM",
    link: "https://solidly.exchange/liquidity/0x9861B8a9Acc9B4f249981164bFe7f84202068bfE",
    components: ["lqdr", "ftm"],
  },
  rewardTokens: ["oxd", "solid"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.OXD,
  details: {
    apiKey: "OXDSOLIDLYLP-LQDR-WFTM",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xB1698A97b497c998b2B2291bb5C48D1d6075836a",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pOxdSolidlyLP LQDR/WFTM",
    farmDepositTokenName: "pOxdSolidlyLP LQDR/WFTM",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_OXD_SOLIDLY_VOLATILE_LQDR_WFTM);

export const JAR_FANTOM_OXD_SOLIDLY_VOLATILE_IB_WFTM: JarDefinition = {
  type: AssetType.JAR,
  id: "fantomJar 8d",
  contract: "0x148e1e19eD2b3730de0A550D6282245B19F54993",
  startBlock: 35222912, startTimestamp: 1649087194,
  depositToken: {
    addr: "0x304B61f3481C977Ffbe630B55f2aBeEe74792664",
    name: "OxdSolidlyLP IB/WFTM",
    link: "https://solidly.exchange/liquidity/0x304B61f3481C977Ffbe630B55f2aBeEe74792664",
    components: ["ib", "ftm"],
  },
  rewardTokens: ["oxd", "solid"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.OXD,
  details: {
    apiKey: "OXDSOLIDLYLP-IB-WFTM",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xB1698A97b497c998b2B2291bb5C48D1d6075836a",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pOxdSolidlyLP IB/WFTM",
    farmDepositTokenName: "pOxdSolidlyLP IB/WFTM",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_OXD_SOLIDLY_VOLATILE_IB_WFTM);

export const JAR_FANTOM_OXD_SOLIDLY_VOLATILE_XTAROT_TAROT: JarDefinition = {
  type: AssetType.JAR,
  id: "fantomJar 8e",
  contract: "0xFd5335a1D992b44e7EDE6582CF2f96465E057343",
  startBlock: 35225781, startTimestamp: 1649090145,
  depositToken: {
    addr: "0x4FE782133af0f7604B9B89Bf95893ADDE265FEFD",
    name: "OxdSolidlyLP XTAROT/TAROT",
    link: "https://solidly.exchange/liquidity/0x4FE782133af0f7604B9B89Bf95893ADDE265FEFD",
    components: ["xtarot", "tarot"],
  },
  rewardTokens: ["oxd", "solid"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.OXD,
  details: {
    apiKey: "OXDSOLIDLYLP-XTAROT-TAROT",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xB1698A97b497c998b2B2291bb5C48D1d6075836a",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pOxdSolidlyLP XTAROT/TAROT",
    farmDepositTokenName: "pOxdSolidlyLP XTAROT/TAROT",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_OXD_SOLIDLY_VOLATILE_XTAROT_TAROT);

export const JAR_FANTOM_OXD_SOLIDLY_VOLATILE_DEI_SCREAM: JarDefinition = {
  type: AssetType.JAR,
  id: "fantomJar 8f",
  contract: "0x8696580cAdDb8410E97fc439646F59AE3B806360",
  startBlock: 35227195, startTimestamp: 1649091822,
  depositToken: {
    addr: "0xd11e940c42e03d927cfd7426718bb4cA21d6015f",
    name: "OxdSolidlyLP DEI/SCREAM",
    link: "https://solidly.exchange/liquidity/0xd11e940c42e03d927cfd7426718bb4cA21d6015f",
    components: ["dei", "scream"],
  },
  rewardTokens: ["oxd", "solid"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.OXD,
  details: {
    apiKey: "OXDSOLIDLYLP-DEI-SCREAM",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xB1698A97b497c998b2B2291bb5C48D1d6075836a",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pOxdSolidlyLP DEI/SCREAM",
    farmDepositTokenName: "pOxdSolidlyLP DEI/SCREAM",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_OXD_SOLIDLY_VOLATILE_DEI_SCREAM);

export const JAR_FANTOM_OXD_SOLIDLY_VOLATILE_WFTM_SYN: JarDefinition = {
  type: AssetType.JAR,
  id: "fantomJar 8g",
  contract: "0x82b1E51f82149336C82639afce2940bAAB067Cac",
  startBlock: 35239253, startTimestamp: 1649103659,
  depositToken: {
    addr: "0x8aa410d8B0Cc3dE48AAC8eB5d928646A00e6ff04",
    name: "OxdSolidlyLP WFTM/SYN",
    link: "https://solidly.exchange/liquidity/0x8aa410d8B0Cc3dE48AAC8eB5d928646A00e6ff04",
    components: ["ftm", "syn"],
  },
  rewardTokens: ["oxd", "solid"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.OXD,
  details: {
    apiKey: "OXDSOLIDLYLP-WFTM-SYN",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xB1698A97b497c998b2B2291bb5C48D1d6075836a",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pOxdSolidlyLP WFTM/SYN",
    farmDepositTokenName: "pOxdSolidlyLP WFTM/SYN",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_OXD_SOLIDLY_VOLATILE_WFTM_SYN);

export const JAR_FANTOM_OXD_SOLIDLY_VOLATILE_WFTM_SOLID: JarDefinition = {
  type: AssetType.JAR,
  id: "fantomJar 8h",
  contract: "0x30ee2ed562075C111a04AF907D856D4347a00828",
  startBlock: 35240455, startTimestamp: 1649104901,
  depositToken: {
    addr: "0xe4bc39fdD4618a76f6472079C329bdfa820afA75",
    name: "OxdSolidlyLP WFTM/SOLID",
    link: "https://solidly.exchange/liquidity/0xe4bc39fdD4618a76f6472079C329bdfa820afA75",
    components: ["ftm", "solid"],
  },
  rewardTokens: ["oxd", "solid"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.OXD,
  details: {
    apiKey: "OXDSOLIDLYLP-WFTM-SOLID",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xB1698A97b497c998b2B2291bb5C48D1d6075836a",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pOxdSolidlyLP WFTM/SOLID",
    farmDepositTokenName: "pOxdSolidlyLP WFTM/SOLID",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_OXD_SOLIDLY_VOLATILE_WFTM_SOLID);

export const JAR_FANTOM_OXD_SOLIDLY_VOLATILE_YFI_WOOFY: JarDefinition = {
  type: AssetType.JAR,
  id: "fantomJar 8i",
  contract: "0xFa185f7F46a40bDbd0D6b9De7A0B9eF2399b713a",
  startBlock: 35247603, startTimestamp: 1649111696,
  depositToken: {
    addr: "0x4b3a172283ecB7d07AB881a9443d38cB1c98F4d0",
    name: "OxdSolidlyLP YFI/WOOFY",
    link: "https://solidly.exchange/liquidity/0x4b3a172283ecB7d07AB881a9443d38cB1c98F4d0",
    components: ["yfi", "woofy"],
  },
  rewardTokens: ["oxd", "solid"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.OXD,
  details: {
    apiKey: "OXDSOLIDLYLP-YFI-WOOFY",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xB1698A97b497c998b2B2291bb5C48D1d6075836a",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pOxdSolidlyLP YFI/WOOFY",
    farmDepositTokenName: "pOxdSolidlyLP YFI/WOOFY",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_OXD_SOLIDLY_VOLATILE_YFI_WOOFY);

export const JAR_FANTOM_OXD_SOLIDLY_VOLATILE_BOMB_PGUNK: JarDefinition = {
  type: AssetType.JAR,
  id: "fantomJar 8j",
  contract: "0x644af38B1076Ab0399BEBEeE3631Cd04F1b3D17b",
  startBlock: 35249600, startTimestamp: 1649113744,
  depositToken: {
    addr: "0x270b4cdEAebC4E0522AA4371a9BE38c624193cEe",
    name: "OxdSolidlyLP BOMB/PGUNK",
    link: "https://solidly.exchange/liquidity/0x270b4cdEAebC4E0522AA4371a9BE38c624193cEe",
    components: ["bomb", "pgunk"],
  },
  rewardTokens: ["oxd", "solid"],
  enablement: AssetEnablement.PERMANENTLY_DISABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.OXD,
  details: {
    apiKey: "OXDSOLIDLYLP-BOMB-PGUNK",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xB1698A97b497c998b2B2291bb5C48D1d6075836a",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pOxdSolidlyLP BOMB/PGUNK",
    farmDepositTokenName: "pOxdSolidlyLP BOMB/PGUNK",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_OXD_SOLIDLY_VOLATILE_BOMB_PGUNK);

export const JAR_FANTOM_OXD_SOLIDLY_STABLE_SOLIDSEX_SOLID: JarDefinition = {
  type: AssetType.JAR,
  id: "fantomJar 8k",
  contract: "0x2C314479A6070AA0f4959d9E042449bd0df71CEF",
  startBlock: 35254844, startTimestamp: 1649118832,
  depositToken: {
    addr: "0x62E2819Dd417F3b430B6fa5Fd34a49A377A02ac8",
    name: "OxdSolidlyLP SOLIDSEX/SOLID",
    link: "https://solidly.exchange/liquidity/0x62E2819Dd417F3b430B6fa5Fd34a49A377A02ac8",
    components: ["solidsex", "solid"],
  },
  rewardTokens: ["oxd", "solid"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.OXD,
  details: {
    apiKey: "OXDSOLIDLYLP-SOLIDSEX-SOLID",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xB1698A97b497c998b2B2291bb5C48D1d6075836a",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pOxdSolidlyLP SOLIDSEX/SOLID",
    farmDepositTokenName: "pOxdSolidlyLP SOLIDSEX/SOLID",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_OXD_SOLIDLY_STABLE_SOLIDSEX_SOLID);

export const JAR_FANTOM_OXD_SOLIDLY_VOLATILE_FXS_FRAX: JarDefinition = {
  type: AssetType.JAR,
  id: "fantomJar 8l",
  contract: "0xa8f03b2f5f1CDA5E0ac2AD4c0cF68348a6e975B9",
  startBlock: 35257074, startTimestamp: 1649120942,
  depositToken: {
    addr: "0x4bBd8467ccd49D5360648CE14830f43a7fEB6e45",
    name: "OxdSolidlyLP FXS/FRAX",
    link: "https://solidly.exchange/liquidity/0x4bBd8467ccd49D5360648CE14830f43a7fEB6e45",
    components: ["fxs", "frax"],
  },
  rewardTokens: ["oxd", "solid"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.OXD,
  details: {
    apiKey: "OXDSOLIDLYLP-FXS-FRAX",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xB1698A97b497c998b2B2291bb5C48D1d6075836a",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pOxdSolidlyLP FXS/FRAX",
    farmDepositTokenName: "pOxdSolidlyLP FXS/FRAX",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_OXD_SOLIDLY_VOLATILE_FXS_FRAX);

export const JAR_FANTOM_OXD_SOLIDLY_VOLATILE_OXD_DEI: JarDefinition = {
  type: AssetType.JAR,
  id: "fantomJar 8m",
  contract: "0x72dBd7AA336Af0aB210ba963A040567863C327B2",
  startBlock: 35257396, startTimestamp: 1649121254,
  depositToken: {
    addr: "0x4303eDB91d23FC648bFEEb65349596bcf4DF0742",
    name: "OxdSolidlyLP OXD/DEI",
    link: "https://solidly.exchange/liquidity/0x4303eDB91d23FC648bFEEb65349596bcf4DF0742",
    components: ["oxd", "dei"],
  },
  rewardTokens: ["oxd", "solid"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.OXD,
  details: {
    apiKey: "OXDSOLIDLYLP-OXD-DEI",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xB1698A97b497c998b2B2291bb5C48D1d6075836a",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pOxdSolidlyLP OXD/DEI",
    farmDepositTokenName: "pOxdSolidlyLP OXD/DEI",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_OXD_SOLIDLY_VOLATILE_OXD_DEI);

export const JAR_FANTOM_OXD_SOLIDLY_VOLATILE_WFTM_TAROT: JarDefinition = {
  type: AssetType.JAR,
  id: "fantomJar 8n",
  contract: "0x03C70EA1565dfb62D330aa1401b888Ef9fc25477",
  startBlock: 35257995, startTimestamp: 1649121811,
  depositToken: {
    addr: "0x783f1eDBE336981dFCb74Bd0B803655F55AaDF48",
    name: "OxdSolidlyLP WFTM/TAROT",
    link: "https://solidly.exchange/liquidity/0x783f1eDBE336981dFCb74Bd0B803655F55AaDF48",
    components: ["ftm", "tarot"],
  },
  rewardTokens: ["oxd", "solid"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.OXD,
  details: {
    apiKey: "OXDSOLIDLYLP-WFTM-TAROT",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xB1698A97b497c998b2B2291bb5C48D1d6075836a",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pOxdSolidlyLP WFTM/TAROT",
    farmDepositTokenName: "pOxdSolidlyLP WFTM/TAROT",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_OXD_SOLIDLY_VOLATILE_WFTM_TAROT);

export const JAR_FANTOM_OXD_SOLIDLY_VOLATILE_WFTM_YFI: JarDefinition = {
  type: AssetType.JAR,
  id: "fantomJar 8o",
  contract: "0x34dD63032CFE782c42B4Bc6350C6b595B5c8e4EB",
  startBlock: 35262157, startTimestamp: 1649126553,
  depositToken: {
    addr: "0xEa5f4ECf6900833f9B7038e5D8d67142ABb09Dcc",
    name: "OxdSolidlyLP WFTM/YFI",
    link: "https://solidly.exchange/liquidity/0xEa5f4ECf6900833f9B7038e5D8d67142ABb09Dcc",
    components: ["ftm", "yfi"],
  },
  rewardTokens: ["oxd", "solid"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.OXD,
  details: {
    apiKey: "OXDSOLIDLYLP-WFTM-YFI",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xB1698A97b497c998b2B2291bb5C48D1d6075836a",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pOxdSolidlyLP WFTM/YFI",
    farmDepositTokenName: "pOxdSolidlyLP WFTM/YFI",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_OXD_SOLIDLY_VOLATILE_WFTM_YFI);

export const JAR_FANTOM_OXD_SOLIDLY_VOLATILE_SEX_WFTM: JarDefinition = {
  type: AssetType.JAR,
  id: "fantomJar 8p",
  contract: "0x538fD6cfA483230D8c447A0A125742f62b162128",
  startBlock: 35262872, startTimestamp: 1649127213,
  depositToken: {
    addr: "0xFCEC86aF8774d69e2e4412B8De3f4aBf1f671ecC",
    name: "OxdSolidlyLP SEX/WFTM",
    link: "https://solidly.exchange/liquidity/0xFCEC86aF8774d69e2e4412B8De3f4aBf1f671ecC",
    components: ["sex", "ftm"],
  },
  rewardTokens: ["oxd", "solid"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.OXD,
  details: {
    apiKey: "OXDSOLIDLYLP-SEX-WFTM",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xB1698A97b497c998b2B2291bb5C48D1d6075836a",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pOxdSolidlyLP SEX/WFTM",
    farmDepositTokenName: "pOxdSolidlyLP SEX/WFTM",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_OXD_SOLIDLY_VOLATILE_SEX_WFTM);

export const JAR_FANTOM_OXD_SOLIDLY_VOLATILE_DEI_DEUS: JarDefinition = {
  type: AssetType.JAR,
  id: "fantomJar 8q",
  contract: "0x05534FcaDD778A4e3B529680E07E7EFDF9cdfEb2",
  startBlock: 35269742, startTimestamp: 1649133928,
  depositToken: {
    addr: "0xF42dBcf004a93ae6D5922282B304E2aEFDd50058",
    name: "OxdSolidlyLP DEI/DEUS",
    link: "https://solidly.exchange/liquidity/0xF42dBcf004a93ae6D5922282B304E2aEFDd50058",
    components: ["dei", "deus"],
  },
  rewardTokens: ["oxd", "solid"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.OXD,
  details: {
    apiKey: "OXDSOLIDLYLP-DEI-DEUS",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xB1698A97b497c998b2B2291bb5C48D1d6075836a",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pOxdSolidlyLP DEI/DEUS",
    farmDepositTokenName: "pOxdSolidlyLP DEI/DEUS",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_OXD_SOLIDLY_VOLATILE_DEI_DEUS);

export const JAR_FANTOM_OXD_SOLIDLY_VOLATILE_USDC_WEVE: JarDefinition = {
  type: AssetType.JAR,
  id: "fantomJar 8s",
  contract: "0xa98A7F97ed07a5FD1Fe1b712f9c32b9136fDeEF7",
  startBlock: 35270373, startTimestamp: 1649134584,
  depositToken: {
    addr: "0xbF1c168fd5cb65C6A3c31d3d48b222104258ba70",
    name: "OxdSolidlyLP USDC/WEVE",
    link: "https://solidly.exchange/liquidity/0xbF1c168fd5cb65C6A3c31d3d48b222104258ba70",
    components: ["usdc", "weve"],
  },
  rewardTokens: ["oxd", "solid"],
  enablement: AssetEnablement.PERMANENTLY_DISABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.OXD,
  details: {
    apiKey: "OXDSOLIDLYLP-USDC-WEVE",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xB1698A97b497c998b2B2291bb5C48D1d6075836a",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pOxdSolidlyLP USDC/WEVE",
    farmDepositTokenName: "pOxdSolidlyLP USDC/WEVE",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_OXD_SOLIDLY_VOLATILE_USDC_WEVE);

export const JAR_FANTOM_OXD_SOLIDLY_VOLATILE_USDC_SYN: JarDefinition = {
  type: AssetType.JAR,
  id: "fantomJar 8t",
  contract: "0x32481DB7BDc9c733959f1b93033e99e6AB329c8D",
  startBlock: 35270702, startTimestamp: 1649134913,
  depositToken: {
    addr: "0xB1b3B96cf35435b2518093acD50E02fe03A0131f",
    name: "OxdSolidlyLP USDC/SYN",
    link: "https://solidly.exchange/liquidity/0xB1b3B96cf35435b2518093acD50E02fe03A0131f",
    components: ["usdc", "syn"],
  },
  rewardTokens: ["oxd", "solid"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.OXD,
  details: {
    apiKey: "OXDSOLIDLYLP-USDC-SYN",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xB1698A97b497c998b2B2291bb5C48D1d6075836a",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pOxdSolidlyLP USDC/SYN",
    farmDepositTokenName: "pOxdSolidlyLP USDC/SYN",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_OXD_SOLIDLY_VOLATILE_USDC_SYN);

export const JAR_FANTOM_OXD_SOLIDLY_VOLATILE_WFTM_SOLIDSEX: JarDefinition = {
  type: AssetType.JAR,
  id: "fantomJar 8u",
  contract: "0xF8C7392B3C38F4572159cDA9e34E16621B593F8B",
  startBlock: 35271544, startTimestamp: 1649135783,
  depositToken: {
    addr: "0xa66901D1965F5410dEeB4d0Bb43f7c1B628Cb20b",
    name: "OxdSolidlyLP WFTM/SOLIDSEX",
    link: "https://solidly.exchange/liquidity/0xa66901D1965F5410dEeB4d0Bb43f7c1B628Cb20b",
    components: ["ftm", "solidsex"],
  },
  rewardTokens: ["oxd", "solid"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.OXD,
  details: {
    apiKey: "OXDSOLIDLYLP-WFTM-SOLIDSEX",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xB1698A97b497c998b2B2291bb5C48D1d6075836a",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pOxdSolidlyLP WFTM/SOLIDSEX",
    farmDepositTokenName: "pOxdSolidlyLP WFTM/SOLIDSEX",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_OXD_SOLIDLY_VOLATILE_WFTM_SOLIDSEX);

export const JAR_FANTOM_OXD_SOLIDLY_STABLE_USDC_MIM: JarDefinition = {
  type: AssetType.JAR,
  id: "fantomJar 8v",
  contract: "0xC02EE6e0117F31275b59bdF9915150683D1e3ef6",
  startBlock: 35273767, startTimestamp: 1649137944,
  depositToken: {
    addr: "0xbcab7d083Cf6a01e0DdA9ed7F8a02b47d125e682",
    name: "OxdSolidlyLP USDC/MIM",
    link: "https://solidly.exchange/liquidity/0xbcab7d083Cf6a01e0DdA9ed7F8a02b47d125e682",
    components: ["usdc", "mim"],
  },
  rewardTokens: ["oxd", "solid"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.OXD,
  details: {
    apiKey: "OXDSOLIDLYLP-USDC-MIM",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xB1698A97b497c998b2B2291bb5C48D1d6075836a",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pOxdSolidlyLP USDC/MIM",
    farmDepositTokenName: "pOxdSolidlyLP USDC/MIM",
  },
  tags: ["stablecoins"],
};
JAR_DEFINITIONS.push(JAR_FANTOM_OXD_SOLIDLY_STABLE_USDC_MIM);

export const JAR_FANTOM_OXD_SOLIDLY_STABLE_USDC_DEI: JarDefinition = {
  type: AssetType.JAR,
  id: "fantomJar 8w",
  contract: "0x36ace3B965185B2f0b52769E8E05ebaBe961ea3D",
  startBlock: 35274138, startTimestamp: 1649138311,
  depositToken: {
    addr: "0x5821573d8F04947952e76d94f3ABC6d7b43bF8d0",
    name: "OxdSolidlyLP USDC/DEI",
    link: "https://solidly.exchange/liquidity/0x5821573d8F04947952e76d94f3ABC6d7b43bF8d0",
    components: ["usdc", "dei"],
  },
  rewardTokens: ["oxd", "solid"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.OXD,
  details: {
    apiKey: "OXDSOLIDLYLP-USDC-DEI",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xB1698A97b497c998b2B2291bb5C48D1d6075836a",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pOxdSolidlyLP USDC/DEI",
    farmDepositTokenName: "pOxdSolidlyLP USDC/DEI",
  },
  tags: ["stablecoins"],
};
JAR_DEFINITIONS.push(JAR_FANTOM_OXD_SOLIDLY_STABLE_USDC_DEI);

export const JAR_FANTOM_OXD_SOLIDLY_VOLATILE_WFTM_OXD2: JarDefinition = {
  type: AssetType.JAR,
  id: "fantomJar 8x",
  contract: "0xa1ba0535cbb99A97747B52717f6d454Fd86AAB65",
  startBlock: 34990610, startTimestamp: 1648847133, 
  depositToken: {
    addr: "0xcB6eAB779780c7FD6d014ab90d8b10e97A1227E2",
    name: "OxdSolidlyLP WFTM/OXD",
    link: "https://solidly.exchange/liquidity/0xcB6eAB779780c7FD6d014ab90d8b10e97A1227E2",
    components: ["ftm", "oxd"],
  },
  rewardTokens: ["oxd", "solid"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.OXD,
  details: {
    apiKey: "OXDSOLIDLYLP-WFTM-OXD2",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xB1698A97b497c998b2B2291bb5C48D1d6075836a",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pOxdSolidlyLP WFTM/OXD2",
    farmDepositTokenName: "pOxdSolidlyLP WFTM/OXD2",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_OXD_SOLIDLY_VOLATILE_WFTM_OXD2);

export const JAR_FANTOM_OXD_SOLIDLY_STABLE_SPIRIT_SINSPIRIT: JarDefinition = {
  type: AssetType.JAR,
  id: "fantomJar 8y",
  contract: "0x336E8E0a9B52c3d39744c3c2D41a0C8303b55c14",
  startBlock: 34990610, startTimestamp: 1648847133,
  depositToken: {
    addr: "0x742C384D6EDeC91466042ba84E5e751c4eAFf962",
    name: "OxdSolidlyLP SPIRIT/SINSPIRIT",
    link: "https://solidly.exchange/liquidity/0x742C384D6EDeC91466042ba84E5e751c4eAFf962",
    components: ["spirit", "sinspirit"],
  },
  rewardTokens: ["oxd", "solid"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.OXD,
  details: {
    apiKey: "OXDSOLIDLYLP-SPIRIT-SINSPIRIT",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xB1698A97b497c998b2B2291bb5C48D1d6075836a",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pOxdSolidlyLP SPIRIT/SINSPIRIT",
    farmDepositTokenName: "pOxdSolidlyLP SPIRIT/SINSPIRIT",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_OXD_SOLIDLY_STABLE_SPIRIT_SINSPIRIT);

export const JAR_FANTOM_OXD_SOLIDLY_STABLE_SPIRIT_RAINSPIRIT: JarDefinition = {
  type: AssetType.JAR,
  id: "fantomJar 8z",
  contract: "0x7dc94678224e047961Ee07c6Ac62e225f20E3523",
  startBlock: 35161588, startTimestamp: 1649025665,
  depositToken: {
    addr: "0xCa395560B6003D921D9408aF011C6C61399F66cA",
    name: "OxdSolidlyLP SPIRIT/RAINSPIRIT",
    link: "https://solidly.exchange/liquidity/0xCa395560B6003D921D9408aF011C6C61399F66cA",
    components: ["spirit", "rainspirit"],
  },
  rewardTokens: ["oxd", "solid"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.OXD,
  details: {
    apiKey: "OXDSOLIDLYLP-SPIRIT-RAINSPIRIT",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xB1698A97b497c998b2B2291bb5C48D1d6075836a",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pOxdSolidlyLP SPIRIT/RAINSPIRIT",
    farmDepositTokenName: "pOxdSolidlyLP SPIRIT/RAINSPIRIT",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_OXD_SOLIDLY_STABLE_SPIRIT_RAINSPIRIT);

export const JAR_FANTOM_OXD_SOLIDLY_STABLE_SPIRIT_BINSPIRIT: JarDefinition = {
  type: AssetType.JAR,
  id: "fantomJar 8aa",
  contract: "0xaC7c330fBeAb825d4260Ea904a99911FCb86c202",
  startBlock: 35161588, startTimestamp: 1649025665,
  depositToken: {
    addr: "0xCa395560B6003D921D9408aF011C6C61399F66cA",
    name: "OxdSolidlyLP SPIRIT/BINSPIRIT",
    link: "https://solidly.exchange/liquidity/0xCa395560B6003D921D9408aF011C6C61399F66cA",
    components: ["spirit", "binspirit"],
  },
  rewardTokens: ["oxd", "solid"],
  enablement: AssetEnablement.PERMANENTLY_DISABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.OXD,
  details: {
    apiKey: "OXDSOLIDLYLP-SPIRIT-BINSPIRIT",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xB1698A97b497c998b2B2291bb5C48D1d6075836a",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pOxdSolidlyLP SPIRIT/BINSPIRIT",
    farmDepositTokenName: "pOxdSolidlyLP SPIRIT/BINSPIRIT",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_OXD_SOLIDLY_STABLE_SPIRIT_BINSPIRIT);

export const JAR_FANTOM_OXD_SOLIDLY_STABLE_SPIRIT_LINSPIRIT: JarDefinition = {
  type: AssetType.JAR,
  id: "fantomJar 8ab",
  contract: "0x11889EEc2b9f42A5817ef4104b97f4680B1C3be8",
  startBlock: 35162503, startTimestamp: 1649026617,
  depositToken: {
    addr: "0xd6be7592E5C424623c8C9557738970aE19ab5de2",
    name: "OxdSolidlyLP SPIRIT/LINSPIRIT",
    link: "https://solidly.exchange/liquidity/0xd6be7592E5C424623c8C9557738970aE19ab5de2",
    components: ["spirit", "linspirit"],
  },
  rewardTokens: ["oxd", "solid"],
  enablement: AssetEnablement.PERMANENTLY_DISABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.OXD,
  details: {
    apiKey: "OXDSOLIDLYLP-SPIRIT-LINSPIRIT",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xB1698A97b497c998b2B2291bb5C48D1d6075836a",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pOxdSolidlyLP SPIRIT/LINSPIRIT",
    farmDepositTokenName: "pOxdSolidlyLP SPIRIT/LINSPIRIT",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_OXD_SOLIDLY_STABLE_SPIRIT_LINSPIRIT);

export const JAR_FANTOM_OXD_SOLIDLY_VOLATILE_WFTM_GEIST: JarDefinition = {
  type: AssetType.JAR,
  id: "fantomJar 8ac",
  contract: "0x1C52EC9cd329395c9cA91F1E30486ded9485B012",
  startBlock: 35162503, startTimestamp: 1649026617, 
  depositToken: {
    addr: "0xAe885ef155F2835Dce9c66b0A7a3A0c8c0622aa1",
    name: "OxdSolidlyLP WFTM/GEIST",
    link: "https://solidly.exchange/liquidity/0xAe885ef155F2835Dce9c66b0A7a3A0c8c0622aa1",
    components: ["ftm", "geist"],
  },
  rewardTokens: ["oxd", "solid"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.OXD,
  details: {
    apiKey: "OXDSOLIDLYLP-WFTM-GEIST",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xB1698A97b497c998b2B2291bb5C48D1d6075836a",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pOxdSolidlyLP WFTM/GEIST",
    farmDepositTokenName: "pOxdSolidlyLP WFTM/GEIST",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_OXD_SOLIDLY_VOLATILE_WFTM_GEIST);

export const JAR_FANTOM_OXD_SOLIDLY_VOLATILE_HND_WFTM: JarDefinition = {
  type: AssetType.JAR,
  id: "fantomJar 8ad",
  contract: "0xcaE9e0d82FC271F111d03395d9A917C364805780",
  startBlock: 35188273, startTimestamp: 1649052287,
  depositToken: {
    addr: "0x6aAE93f2915b899e87b49a9254434D36ac9570d8",
    name: "OxdSolidlyLP HND/WFTM",
    link: "https://solidly.exchange/liquidity/0x6aAE93f2915b899e87b49a9254434D36ac9570d8",
    components: ["ftm", "hnd"],
  },
  rewardTokens: ["oxd", "solid"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.OXD,
  details: {
    apiKey: "OXDSOLIDLYLP-WFTM-HND",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xB1698A97b497c998b2B2291bb5C48D1d6075836a",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pOxdSolidlyLP WFTM/HND",
    farmDepositTokenName: "pOxdSolidlyLP WFTM/HND",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_OXD_SOLIDLY_VOLATILE_HND_WFTM);

export const JAR_FANTOM_OXD_SOLIDLY_VOLATILE_SOLID_OXSOLID: JarDefinition = {
  type: AssetType.JAR,
  id: "fantomJar 8ae",
  contract: "0x5E00788eC8c58F33B2C7c0cD1CfD7DF594A76f88",
  startBlock: 35190359, startTimestamp: 1649054259, 
  depositToken: {
    addr: "0xa3bf7336FDbCe054c4B5Bad4FF8d79539dB2a2b3",
    name: "OxdSolidlyLP SOLID/OXSOLID",
    link: "https://solidly.exchange/liquidity/0xa3bf7336FDbCe054c4B5Bad4FF8d79539dB2a2b3",
    components: ["solid", "oxsolid"],
  },
  rewardTokens: ["oxd", "solid"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.OXD,
  details: {
    apiKey: "OXDSOLIDLYLP-SOLID-OXSOLID",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xB1698A97b497c998b2B2291bb5C48D1d6075836a",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pOxdSolidlyLP SOLID/OXSOLID",
    farmDepositTokenName: "pOxdSolidlyLP SOLID/OXSOLID",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_OXD_SOLIDLY_VOLATILE_SOLID_OXSOLID);

export const JAR_FANTOM_OXD_SOLIDLY_VOLATILE_WFTM_RDL: JarDefinition = {
  type: AssetType.JAR,
  id: "fantomJar 8af",
  contract: "0xAA59f7eB6A53638F877f22Efb86650794cc7d6A8",
  startBlock: 35190359, startTimestamp: 1649054259,
  depositToken: {
    addr: "0x5ef8f0bd4F071B0199603a28ec9343F3651999c0",
    name: "OxdSolidlyLP FTM/RDL",
    link: "https://solidly.exchange/liquidity/0x5ef8f0bd4F071B0199603a28ec9343F3651999c0",
    components: ["ftm", "rdl"],
  },
  rewardTokens: ["oxd", "solid"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.OXD,
  details: {
    apiKey: "OXDSOLIDLYLP-WFTM-RDL",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xB1698A97b497c998b2B2291bb5C48D1d6075836a",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pOxdSolidlyLP WFTM/RDL",
    farmDepositTokenName: "pOxdSolidlyLP WFTM/RDL",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_OXD_SOLIDLY_VOLATILE_WFTM_RDL);

export const JAR_FANTOM_OXD_SOLIDLY_VOLATILE_SEX_G3CRV: JarDefinition = {
  type: AssetType.JAR,
  id: "fantomJar 8ag",
  contract: "0x9C849226382860E6D41d2254D3AF06A0a2E9bed5",
  startBlock: 35582675, startTimestamp: 1649459978,
  depositToken: {
    addr: "0x966F6dfDfdC7FEF3271287a88cb53C77d8901C19",
    name: "OxdSolidlyLP SEX/G3CRV",
    link: "https://solidly.exchange/liquidity/0x966F6dfDfdC7FEF3271287a88cb53C77d8901C19",
    components: ["sex", "g3crv"],
  },
  rewardTokens: ["oxd", "solid"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.OXD,
  details: {
    apiKey: "OXDSOLIDLYLP-SEX-G3CRV",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xB1698A97b497c998b2B2291bb5C48D1d6075836a",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pOxdSolidlyLP SEX/G3CRV",
    farmDepositTokenName: "pOxdSolidlyLP SEX/G3CRV",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_OXD_SOLIDLY_VOLATILE_SEX_G3CRV);

export const JAR_FANTOM_OXD_SOLIDLY_VOLATILE_CRV_WFTM: JarDefinition = {
  type: AssetType.JAR,
  id: "fantomJar 8ah",
  contract: "0x702E4c04c4afc3b812dd808566819A7F584f0Dc8",
  startBlock: 35201316, startTimestamp: 1649064813,
  depositToken: {
    addr: "0xED7Fd242ce91a541ABcaE52f3d617dacA7fe6e34",
    name: "OxdSolidlyLP CRV/WFTM",
    link: "https://solidly.exchange/liquidity/0xED7Fd242ce91a541ABcaE52f3d617dacA7fe6e34",
    components: ["crv", "ftm"],
  },
  rewardTokens: ["oxd", "solid"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.OXD,
  details: {
    apiKey: "OXDSOLIDLYLP-CRV-WFTM",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xB1698A97b497c998b2B2291bb5C48D1d6075836a",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pOxdSolidlyLP CRV/WFTM",
    farmDepositTokenName: "pOxdSolidlyLP CRV/WFTM",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_OXD_SOLIDLY_VOLATILE_CRV_WFTM);

export const JAR_FANTOM_OXD_SOLIDLY_VOLATILE_BIFI_MAI: JarDefinition = {
  type: AssetType.JAR,
  id: "fantomJar 8ai",
  contract: "0xB82729385F24149Be59ed9D45b1c7c2e476d45c8",
  startBlock: 35241469, startTimestamp: 1649105886,
  depositToken: {
    addr: "0x8aeB0503E13F7bea02F80986a8FDb2AccE5C6b6C",
    name: "OxdSolidlyLP BIFI/MAI",
    link: "https://solidly.exchange/liquidity/0x8aeB0503E13F7bea02F80986a8FDb2AccE5C6b6C",
    components: ["bifi", "mimatic"],
  },
  rewardTokens: ["oxd", "solid"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.OXD,
  details: {
    apiKey: "OXDSOLIDLYLP-BIFI-MAI",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xB1698A97b497c998b2B2291bb5C48D1d6075836a",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pOxdSolidlyLP BIFI/MAI",
    farmDepositTokenName: "pOxdSolidlyLP BIFI/MAI",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_OXD_SOLIDLY_VOLATILE_BIFI_MAI);

export const JAR_FANTOM_OXD_SOLIDLY_VOLATILE_WFTM_SCREAM: JarDefinition = {
  type: AssetType.JAR,
  id: "fantomJar 8aj",
  contract: "0x93f6C9262Fb98299D54EA67180B56fbDe57a9044",
  startBlock: 35249600, startTimestamp: 1649113744,
  depositToken: {
    addr: "0x86dD79265814756713e631Dde7E162bdD538b7B1",
    name: "OxdSolidlyLP WFTM/SCREAM",
    link: "https://solidly.exchange/liquidity/0x86dD79265814756713e631Dde7E162bdD538b7B1",
    components: ["ftm", "scream"],
  },
  rewardTokens: ["oxd", "solid"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.OXD,
  details: {
    apiKey: "OXDSOLIDLYLP-WFTM-SCREAM",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xB1698A97b497c998b2B2291bb5C48D1d6075836a",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pOxdSolidlyLP WFTM/SCREAM",
    farmDepositTokenName: "pOxdSolidlyLP WFTM/SCREAM",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_OXD_SOLIDLY_VOLATILE_WFTM_SCREAM);

export const JAR_FANTOM_OXD_SOLIDLY_VOLATILE_BEETS_FBEETS: JarDefinition = {
  type: AssetType.JAR,
  id: "fantomJar 8ak",
  contract: "0xcB2Fd1F031183142B8086431e8b4a162b8b36A2f",
  startBlock: 35162503, startTimestamp: 1649026617,
  depositToken: {
    addr: "0x5A3AA3284EE642152D4a2B55BE1160051c5eB932",
    name: "OxdSolidlyLP BEETS/FBEETS",
    link: "https://solidly.exchange/liquidity/0x5A3AA3284EE642152D4a2B55BE1160051c5eB932",
    components: ["beets", "fbeets"],
  },
  rewardTokens: ["oxd", "solid"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Fantom,
  protocol: AssetProtocol.SOLID,
  stakingProtocol: AssetProtocol.OXD,
  details: {
    apiKey: "OXDSOLIDLYLP-BEETS-FBEETS",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xB1698A97b497c998b2B2291bb5C48D1d6075836a",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pOxdSolidlyLP BEETS/FBEETS",
    farmDepositTokenName: "pOxdSolidlyLP BEETS/FBEETS",
  },
};
JAR_DEFINITIONS.push(JAR_FANTOM_OXD_SOLIDLY_VOLATILE_BEETS_FBEETS);

// Gnosis

export const JAR_GNOSIS_SUSHI_XDAI_GNO: JarDefinition = {
  type: AssetType.JAR,
  id: "gnosisJar 1a",
  contract: "0x64574f47A59722862aF13be8375E4D0008c407dD",
  startBlock: 22013009, startTimestamp: 1651883925,
  depositToken: {
    addr: "0x0f9D54D9eE044220A3925f9b97509811924fD269",
    name: "Sushi XDAI/GNO",
    link: "https://app.sushi.com/add/ETH/0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb?tokens=ETH&tokens=0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb&chainId=100",
    components: ["xdai", "gno"],
  },
  rewardTokens: ["gno", "sushi"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Gnosis,
  protocol: AssetProtocol.SUSHISWAP,
  details: {
    apiKey: "SUSHISWAP-XDAI-GNO",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xe5E231De20C68AabB8D669f87971aE57E2AbF680",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSushi XDAI/GNO",
    farmDepositTokenName: "pSushi XDAI/GNO",
  },
};
JAR_DEFINITIONS.push(JAR_GNOSIS_SUSHI_XDAI_GNO);

export const JAR_GNOSIS_SUSHI_LINK_XDAI: JarDefinition = {
  type: AssetType.JAR,
  id: "gnosisJar 1b",
  contract: "0xfA09E6CE60c02eB0D6F333Fc6aA6A3595A4Acc2a",
  startBlock: 22042322, startTimestamp: 1652033680,
  depositToken: {
    addr: "0xB320609F2Bf3ca98754c14Db717307c6d6794d8b",
    name: "Sushi LINK/XDAI",
    link: "https://app.sushi.com/add/ETH/0xE2e73A1c69ecF83F464EFCE6A5be353a37cA09b2?tokens=ETH&tokens=0xE2e73A1c69ecF83F464EFCE6A5be353a37cA09b2&chainId=100",
    components: ["xdai", "link"],
  },
  rewardTokens: ["sushi", "gno"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Gnosis,
  protocol: AssetProtocol.SUSHISWAP,
  details: {
    apiKey: "SUSHISWAP-LINK-XDAI",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xe5E231De20C68AabB8D669f87971aE57E2AbF680",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSushi LINK/XDAI",
    farmDepositTokenName: "pSushi LINK/XDAI",
  },
};
JAR_DEFINITIONS.push(JAR_GNOSIS_SUSHI_LINK_XDAI);

export const JAR_GNOSIS_SUSHI_SUSHI_GNO: JarDefinition = {
  type: AssetType.JAR,
  id: "gnosisJar 1c",
  contract: "0xcD59f36bfeFFC5B38FeE585e20E2E32052b679d9",
  startBlock: 22044084, startTimestamp: 1652042500,
  depositToken: {
    addr: "0xF38c5b39F29600765849cA38712F302b1522C9B8",
    name: "Sushi SUSHI/GNO",
    link: "https://app.sushi.com/add/0x2995D1317DcD4f0aB89f4AE60F3f020A4F17C7CE/0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb?tokens=0x2995D1317DcD4f0aB89f4AE60F3f020A4F17C7CE&tokens=0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb&chainId=100",
    components: ["sushi", "gno"],
  },
  rewardTokens: ["sushi", "gno"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Gnosis,
  protocol: AssetProtocol.SUSHISWAP,
  details: {
    apiKey: "SUSHISWAP-SUSHI-GNO",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xe5E231De20C68AabB8D669f87971aE57E2AbF680",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSushi SUSHI/GNO",
    farmDepositTokenName: "pSushi SUSHI/GNO",
  },
};
JAR_DEFINITIONS.push(JAR_GNOSIS_SUSHI_SUSHI_GNO);

export const JAR_GNOSIS_SUSHI_USDC_XDAI: JarDefinition = {
  type: AssetType.JAR,
  id: "gnosisJar 1d",
  contract: "0x59A04fB987a55Ef6a4d95B3C369eBb6dC91dcdC0",
  startBlock: 22044609, startTimestamp: 1652045125,
  depositToken: {
    addr: "0xA227c72a4055A9DC949cAE24f54535fe890d3663",
    name: "Sushi USDC/XDAI",
    link: "https://app.sushi.com/add/0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83/0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d?tokens=0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83&tokens=0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d&chainId=100",
    components: ["usdc", "xdai"],
  },
  rewardTokens: ["sushi", "gno"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Gnosis,
  protocol: AssetProtocol.SUSHISWAP,
  details: {
    apiKey: "SUSHISWAP-USDC-XDAI",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xe5E231De20C68AabB8D669f87971aE57E2AbF680",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSushi USDC/XDAI",
    farmDepositTokenName: "pSushi USDC/XDAI",
  },
};
JAR_DEFINITIONS.push(JAR_GNOSIS_SUSHI_USDC_XDAI);

export const JAR_GNOSIS_SUSHI_USDC_USDT: JarDefinition = {
  type: AssetType.JAR,
  id: "gnosisJar 1e",
  contract: "0xB4dE8612Ee2AaC8646a6FeaB8CEaB04BF8a908aB",
  startBlock: 22044681, startTimestamp: 1652045485,
  depositToken: {
    addr: "0x74c2EFA722010Ad7C142476F525A051084dA2C42",
    name: "Sushi USDC/USDT",
    link: "https://app.sushi.com/add/0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83/0x4ECaBa5870353805a9F068101A40E0f32ed605C6?tokens=0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83&tokens=0x4ECaBa5870353805a9F068101A40E0f32ed605C6&chainId=100",
    components: ["usdc", "usdt"],
  },
  rewardTokens: ["sushi", "gno"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Gnosis,
  protocol: AssetProtocol.SUSHISWAP,
  details: {
    apiKey: "SUSHISWAP-USDC-USDT",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xe5E231De20C68AabB8D669f87971aE57E2AbF680",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSushi USDC/USDT",
    farmDepositTokenName: "pSushi USDC/USDT",
  },
};
JAR_DEFINITIONS.push(JAR_GNOSIS_SUSHI_USDC_USDT);

export const JAR_GNOSIS_SUSHI_XDAI_USDT: JarDefinition = {
  type: AssetType.JAR,
  id: "gnosisJar 1f",
  contract: "0xF81eDA759b0F07A88B5D3E497090C4272C194166",
  startBlock: 22044757, startTimestamp: 1652045865,
  depositToken: {
    addr: "0x6685C047EAB042297e659bFAa7423E94b4A14b9E",
    name: "Sushi XDAI/USDT",
    link: "https://app.sushi.com/add/0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d/0x4ECaBa5870353805a9F068101A40E0f32ed605C6?tokens=0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d&tokens=0x4ECaBa5870353805a9F068101A40E0f32ed605C6&chainId=100",
    components: ["xdai", "usdt"],
  },
  rewardTokens: ["sushi", "gno"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Gnosis,
  protocol: AssetProtocol.SUSHISWAP,
  details: {
    apiKey: "SUSHISWAP-XDAI-USDT",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xe5E231De20C68AabB8D669f87971aE57E2AbF680",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSushi XDAI/USDT",
    farmDepositTokenName: "pSushi XDAI/USDT",
  },
};
JAR_DEFINITIONS.push(JAR_GNOSIS_SUSHI_XDAI_USDT);

export const JAR_GNOSIS_SUSHI_WETH_GNO: JarDefinition = {
  type: AssetType.JAR,
  id: "gnosisJar 1g",
  contract: "0xBC84dfF55e6847Ca4e6C2D2519aeA1539839E284",
  startBlock: 22044836, startTimestamp: 1652046260,
  depositToken: {
    addr: "0x15f9EEdeEBD121FBb238a8A0caE38f4b4A07A585",
    name: "Sushi WETH/GNO",
    link: "https://app.sushi.com/add/0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1/0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb?tokens=0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1&tokens=0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb&chainId=100",
    components: ["weth", "gno"],
  },
  rewardTokens: ["sushi", "gno"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Gnosis,
  protocol: AssetProtocol.SUSHISWAP,
  details: {
    apiKey: "SUSHISWAP-WETH-GNO",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xe5E231De20C68AabB8D669f87971aE57E2AbF680",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSushi WETH/GNO",
    farmDepositTokenName: "pSushi WETH/GNO",
  },
};
JAR_DEFINITIONS.push(JAR_GNOSIS_SUSHI_WETH_GNO);

export const JAR_GNOSIS_SUSHI_WETH_BTC: JarDefinition = {
  type: AssetType.JAR,
  id: "gnosisJar 1h",
  contract: "0x0f11806f2D186D4a88002F89ee3Cb5aD58E383B3",
  startBlock: 22044904, startTimestamp: 1652046600,
  depositToken: {
    addr: "0xe21F631f47bFB2bC53ED134E83B8cff00e0EC054",
    name: "Sushi WETH/WBTC",
    link: "https://app.sushi.com/add/0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1/0x8e5bBbb09Ed1ebdE8674Cda39A0c169401db4252?tokens=0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1&tokens=0x8e5bBbb09Ed1ebdE8674Cda39A0c169401db4252&chainId=100",
    components: ["weth", "wbtc"],
  },
  rewardTokens: ["sushi", "gno"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Gnosis,
  protocol: AssetProtocol.SUSHISWAP,
  details: {
    apiKey: "SUSHISWAP-WETH-WBTC",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xe5E231De20C68AabB8D669f87971aE57E2AbF680",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSushi WETH/WBTC",
    farmDepositTokenName: "pSushi WETH/WBTC",
  },
};
JAR_DEFINITIONS.push(JAR_GNOSIS_SUSHI_WETH_BTC);

export const JAR_GNOSIS_SUSHI_WETH_XDAI: JarDefinition = {
  type: AssetType.JAR,
  id: "gnosisJar 1i",
  contract: "0x648159Fd32340108762F256bB5c739Ec4E12F797",
  startBlock: 22044980, startTimestamp: 1652046980,
  depositToken: {
    addr: "0x8C0C36c85192204c8d782F763fF5a30f5bA0192F",
    name: "Sushi WETH/XDAI",
    link: "https://app.sushi.com/add/0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1/0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d?tokens=0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1&tokens=0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d&chainId=100",
    components: ["weth", "xdai"],
  },
  rewardTokens: ["sushi", "gno"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Gnosis,
  protocol: AssetProtocol.SUSHISWAP,
  details: {
    apiKey: "SUSHISWAP-WETH-XDAI",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xe5E231De20C68AabB8D669f87971aE57E2AbF680",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSushi WETH/XDAI",
    farmDepositTokenName: "pSushi WETH/XDAI",
  },
};
JAR_DEFINITIONS.push(JAR_GNOSIS_SUSHI_WETH_XDAI);

export const JAR_GNOSIS_SWAPR_GNO_XDAI: JarDefinition = {
  type: AssetType.JAR,
  id: "gnosisJar 2a",
  contract: "0x1aAb05ea242B3d34ACEf4F844f4EE035D781aE6f",
  startBlock: 22152300, startTimestamp: 1652588350, 
  depositToken: {
    addr: "0xD7b118271B1B7d26C9e044Fc927CA31DccB22a5a",
    name: "Swapr GNO/XDAI",
    link: "https://swapr.eth.link/#/add/0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb/XDAI?chainId=100",
    components: ["gno", "xdai"],
  },
  rewardTokens: ["swapr", "gno"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Gnosis,
  protocol: AssetProtocol.SWAPR,
  details: {
    apiKey: "SWAPR-GNO-XDAI",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xe5E231De20C68AabB8D669f87971aE57E2AbF680",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSushi GNO/XDAI",
    farmDepositTokenName: "pSushi GNO/XDAI",
  },
};
JAR_DEFINITIONS.push(JAR_GNOSIS_SWAPR_GNO_XDAI);

export const JAR_GNOSIS_SWAPR_BTC_WETH: JarDefinition = {
  type: AssetType.JAR,
  id: "gnosisJar 2b",
  contract: "0x77e2bd7Efc5CdC96D808EB89A8af71669F5B67E2",
  startBlock: 22152300, startTimestamp: 1652588350,
  depositToken: {
    addr: "0xf6Be7AD58F4BAA454666b0027839a01BcD721Ac3",
    name: "Swapr WBTC/WETH",
    link: "https://swapr.eth.link/#/add/0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1/0x8e5bBbb09Ed1ebdE8674Cda39A0c169401db4252?chainId=100",
    components: ["wbtc", "weth"],
  },
  rewardTokens: ["swapr", "gno"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Gnosis,
  protocol: AssetProtocol.SWAPR,
  details: {
    apiKey: "SWAPR-WBTC-WETH",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xe5E231De20C68AabB8D669f87971aE57E2AbF680",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSushi WBTC/WETH",
    farmDepositTokenName: "pSushi WBTC/WETH",
  },
};
JAR_DEFINITIONS.push(JAR_GNOSIS_SWAPR_BTC_WETH);

export const JAR_GNOSIS_SWAPR_COW_WETH: JarDefinition = {
  type: AssetType.JAR,
  id: "gnosisJar 2c",
  contract: "0x7B446c0c5574e58488e015760B4e0ABA282C3591",
  startBlock: 22185226, startTimestamp: 1652754830,
  depositToken: {
    addr: "0x8028457E452D7221dB69B1e0563AA600A059fab1",
    name: "Swapr COW/WETH",
    link: "https://swapr.eth.link/#/add/0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1/0x177127622c4A00F3d409B75571e12cB3c8973d3c?chainId=100",
    components: ["cow", "weth"],
  },
  rewardTokens: ["swapr", "gno", "cow"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Gnosis,
  protocol: AssetProtocol.SWAPR,
  details: {
    apiKey: "SWAPR-COW-WETH",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xe5E231De20C68AabB8D669f87971aE57E2AbF680",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSushi COW/WETH",
    farmDepositTokenName: "pSushi COW/WETH",
  },
};
JAR_DEFINITIONS.push(JAR_GNOSIS_SWAPR_COW_WETH);

export const JAR_GNOSIS_SWAPR_GNO_WETH: JarDefinition = {
  type: AssetType.JAR,
  id: "gnosisJar 2d",
  contract: "0x01955A0b5eF0Ac5b87D086e3A62fC1777D45fA79",
  startBlock: 22184942, startTimestamp: 1652753330,
  depositToken: {
    addr: "0x5fCA4cBdC182e40aeFBCb91AFBDE7AD8d3Dc18a8",
    name: "Swapr GNO/WETH",
    link: "https://swapr.eth.link/#/add/0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1/0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb?chainId=100",
    components: ["gno", "weth"],
  },
  rewardTokens: ["swapr", "gno"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Gnosis,
  protocol: AssetProtocol.SWAPR,
  details: {
    apiKey: "SWAPR-GNO-WETH",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xe5E231De20C68AabB8D669f87971aE57E2AbF680",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSushi GNO/WETH",
    farmDepositTokenName: "pSushi GNO/WETH",
  },
};
JAR_DEFINITIONS.push(JAR_GNOSIS_SWAPR_GNO_WETH);

export const JAR_GNOSIS_SWAPR_DXD_GNO: JarDefinition = {
  type: AssetType.JAR,
  id: "gnosisJar 2e",
  contract: "0x13d59A941b8753Aea44c98b2f46fd92Db2aEc938",
  startBlock: 22201328, startTimestamp: 1652836575,
  depositToken: {
    addr: "0x558d777B24366f011E35A9f59114D1b45110d67B",
    name: "Swapr DXD/GNO",
    link: "https://swapr.eth.link/#/add/0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb/0xb90D6bec20993Be5d72A5ab353343f7a0281f158?chainId=100",
    components: ["gno", "dxd"],
  },
  rewardTokens: ["swapr", "gno"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Gnosis,
  protocol: AssetProtocol.SWAPR,
  details: {
    apiKey: "SWAPR-DXD-GNO",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xe5E231De20C68AabB8D669f87971aE57E2AbF680",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSushi DXD/GNO",
    farmDepositTokenName: "pSushi DXD/GNO",
  },
};
JAR_DEFINITIONS.push(JAR_GNOSIS_SWAPR_DXD_GNO);

export const JAR_GNOSIS_SWAPR_XDAI_WETH: JarDefinition = {
  type: AssetType.JAR,
  id: "gnosisJar 2f",
  contract: "0x9aae1e32d2b8A8F872c8a0593597D31bb27eAe48",
  startBlock: 22183275, startTimestamp: 1652744725,
  depositToken: {
    addr: "0x1865d5445010E0baf8Be2eB410d3Eae4A68683c2",
    name: "Swapr XDAI/WETH",
    link: "https://swapr.eth.link/#/add/XDAI/0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1?chainId=100",
    components: ["weth", "xdai"],
  },
  rewardTokens: ["swapr", "gno"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Gnosis,
  protocol: AssetProtocol.SWAPR,
  details: {
    apiKey: "SWAPR-XDAI-WETH",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xe5E231De20C68AabB8D669f87971aE57E2AbF680",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSushi XDAI/WETH",
    farmDepositTokenName: "pSushi XDAI/WETH",
  },
};
JAR_DEFINITIONS.push(JAR_GNOSIS_SWAPR_XDAI_WETH);

export const JAR_GNOSIS_SWAPR_COW_GNO: JarDefinition = {
  type: AssetType.JAR,
  id: "gnosisJar 2g",
  contract: "0x0ba5150815bC9F97BB33FD176Fd3deeB31Db563a",
  startBlock: 22267495, startTimestamp: 1653174185,
  depositToken: {
    addr: "0xDBF14bce36F661B29F6c8318a1D8944650c73F38",
    name: "Swapr COW/GNO",
    link: "https://swapr.eth.link/#/add/0x177127622c4A00F3d409B75571e12cB3c8973d3c/0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb?chainId=100",
    components: ["cow", "gno"],
  },
  rewardTokens: ["swapr", "gno", "cow"],
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Gnosis,
  protocol: AssetProtocol.SWAPR,
  details: {
    apiKey: "SWAPR-COW-GNO",
    harvestStyle: HarvestStyle.PASSIVE,
    controller: "0xe5E231De20C68AabB8D669f87971aE57E2AbF680",
  },
  farm: {
    farmAddress: NULL_ADDRESS,
    farmNickname: "pSushi COW/GNO",
    farmDepositTokenName: "pSushi COW/GNO",
  },
};
JAR_DEFINITIONS.push(JAR_GNOSIS_SWAPR_COW_GNO);

// ADD_ASSET  add jars above this line,  standalone farms or external somewhere below

// External Assets
export const EXTERNAL_DEFINITIONS: ExternalAssetDefinition[] = [];
export const ASSET_PBAMM: ExternalAssetDefinition = {
  type: AssetType.EXTERNAL,
  id: "B.Protocol BAMM",
  contract: "0x54bC9113f1f55cdBDf221daf798dc73614f6D972",
  startBlock: 12787025, startTimestamp: 1625751617,
  depositToken: {
    addr: "0x5f98805a4e8be255a32880fdec7f6728c6568ba0",
    name: "LUSD",
    link: "https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x5f98805A4E8be255a32880FDeC7F6728C6568bA0",
    components: ["lusd"],
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
  startBlock: 11021240, startTimestamp: 1602246341,
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
  tags: ["pool2"],
};
EXTERNAL_DEFINITIONS.push(EXTERNAL_SUSHI_PICKLE_ETH);

export const BRINERY_DEFINITIONS: BrineryDefinition[] = [];

export const BRINERY_VEFXS: BrineryDefinition = {
  type: AssetType.BRINERY,
  id: "veFXS Brinery",
  contract: "0x62826760CC53AE076a7523Fd9dCF4f8Dbb1dA140",
  startBlock: 14195314, startTimestamp: 1644722737,
  depositToken: {
    addr: "0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0",
    name: "FXS",
    link: "https://app.sushi.com/swap?inputCurrency=ETH&outputCurrency=0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0&chainId=1",
    components: ["fxs"],
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.FRAX,
  details: {
    apiKey: "BRINERY_VEFXS",
    veAddr: "0xc8418aF6358FFddA74e09Ca9CC3Fe03Ca6aDC5b0",
    distributionAddr: "0xc6764e58b36e26b08Fd1d2AeD4538c02171fA872",
    strategyAddr: "0x552D92Ad2bb3Aba00872491ea2DC5d6EC3B8A31D",
    lockerAddr: "0xd639C2eA4eEFfAD39b599410d00252E6c80008DF",
    rewardToken: "fxs",
  },
};

BRINERY_DEFINITIONS.push(BRINERY_VEFXS);

export const ALL_ASSETS: PickleAsset[] = []
  .concat(JAR_DEFINITIONS)
  .concat(STANDALONE_FARM_DEFINITIONS)
  .concat(EXTERNAL_DEFINITIONS)
  .concat(BRINERY_DEFINITIONS);
