import { ChainNetwork } from "../chain/Chains";
import { StandaloneFarmDefinition, AssetEnablement, JarDefinition, HarvestStyle, AssetType, PickleAsset, ExternalAssetDefinition, AssetProtocol } from "./PickleModelJson";

/**
 * Now the actual implementations
 */
export const STANDALONE_FARM_DEFINITIONS: StandaloneFarmDefinition[] = []
export const FARM_SUSHI_PICKLE_ETH : StandaloneFarmDefinition = {
    type: AssetType.STANDALONE_FARM,
    id: 'Sushi Pickle/Eth',
    farmNickname: 'SushiSwap MasterChefv2',
    contract: '0xEF0881eC094552b2e128Cf945EF17a6752B4Ec5d', // sushi masterchef v2
    depositToken: {
      addr: '0x269db91fc3c7fcc275c2e6f22e5552504512811c',
      name: 'PICKLE/ETH SLP',
      link: 'https://app.sushi.com/add/0x429881672B9AE42b8EbA0E26cD9C73711b891Ca5/ETH',
      components: ["pickle", "weth"]
    },
    enablement: AssetEnablement.ENABLED,
    chain: ChainNetwork.Ethereum,
    protocol: AssetProtocol.SUSHISWAP,
}
STANDALONE_FARM_DEFINITIONS.push(FARM_SUSHI_PICKLE_ETH);

export const FARM_UNI_PICKLE_ETH : StandaloneFarmDefinition = {
    type: AssetType.STANDALONE_FARM,
    id: 'Uniswap Pickle/Eth',
    farmNickname: 'Pickle Power',
    contract: '0xfAA267C3Bb25a82CFDB604136a29895D30fd3fd8',
    depositToken: {
      addr: '0xdc98556ce24f007a5ef6dc1ce96322d65832a819',
      name: 'UNI PICKLE/ETH',
      link: 'https://app.uniswap.org/#/add/v2/0x429881672B9AE42b8EbA0E26cD9C73711b891Ca5/ETH',
      components: ["pickle", "weth"]
    },
   enablement: AssetEnablement.ENABLED,
   chain: ChainNetwork.Ethereum,
   protocol: AssetProtocol.UNISWAP,
}
STANDALONE_FARM_DEFINITIONS.push(FARM_UNI_PICKLE_ETH);

 export const JAR_DEFINITIONS : JarDefinition[] = []
 export const JAR_sCRV: JarDefinition =
 {
  type: AssetType.JAR,
  id: 'pJar 0a',
   contract: '0x68d14d66B2B0d6E157c06Dc8Fefa3D8ba0e66a89',
   depositToken: {
      addr: '0xC25a3A3b969415c80451098fa907EC722572917F',
      name: 'sCRV',
      link: 'https://www.curve.fi/susdv2/deposit',
   },
   enablement: AssetEnablement.DISABLED,
   chain: ChainNetwork.Ethereum,
   protocol: AssetProtocol.CURVE,
   details: {
     apiKey: 'sCRV',
     harvestStyle: HarvestStyle.PASSIVE,
   },
   farm: undefined
 }
 JAR_DEFINITIONS.push(JAR_sCRV);
 
 
 export const JAR_renCRV: JarDefinition =
 {
  type: AssetType.JAR,
   id: 'pJar 0b',
   contract: '0x2E35392F4c36EBa7eCAFE4de34199b2373Af22ec',
   depositToken: {
      addr: '0x49849C98ae39Fff122806C06791Fa73784FB3675',
      name: 'renBTCCRV',
      link: 'https://www.curve.fi/ren/deposit',
   },
   enablement: AssetEnablement.ENABLED,
   chain: ChainNetwork.Ethereum,
   protocol: AssetProtocol.CURVE,
   details: {
     apiKey: 'renBTCCRV',
     harvestStyle: HarvestStyle.PASSIVE,
   },
   farm: undefined
 }
 JAR_DEFINITIONS.push(JAR_renCRV);
 
 
 export const JAR_3CRV: JarDefinition =
 {
  type: AssetType.JAR,
   id: 'pJar 0c',
   contract: '0x1BB74b5DdC1f4fC91D6f9E7906cf68bc93538e33',
   depositToken: {
      addr: '0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490',
      name: '3poolCRV',
      link: 'https://www.curve.fi/3pool/deposit',
   },
   enablement: AssetEnablement.ENABLED,
   chain: ChainNetwork.Ethereum,
   protocol: AssetProtocol.CURVE,
   details: {
     apiKey: '3poolCRV',
     harvestStyle: HarvestStyle.PASSIVE,
   },
   farm: {
     farmAddress: '0xf5bD1A4894a6ac1D786c7820bC1f36b1535147F6',
     farmNickname: 'p3CRV',
     farmDepositTokenName: 'p3CRV'
   }
 }
 JAR_DEFINITIONS.push(JAR_3CRV);
 
 
 export const JAR_steCRV: JarDefinition =
 {
  type: AssetType.JAR,
   id: 'pJar 0d',
   contract: '0x77C8A58D940a322Aea02dBc8EE4A30350D4239AD',
   depositToken: {
      addr: '0x06325440D014e39736583c165C2963BA99fAf14E',
      name: 'steCRV (ETH-stETH)',
      link: 'https://www.curve.fi/steth/deposit',
   },
   enablement: AssetEnablement.ENABLED,
   chain: ChainNetwork.Ethereum,
   protocol: AssetProtocol.CURVE,
   details: {
     apiKey: 'steCRV',
     harvestStyle: HarvestStyle.PASSIVE,
   },
   farm: {
     farmAddress: '0x4731CD18fFfF2C2A43f72eAe1B598dC3c0C16912',
     farmNickname: 'stETH-ETH',
     farmDepositTokenName: 'stEthCrv'
   }
 }
 JAR_DEFINITIONS.push(JAR_steCRV);
 
 
 export const JAR_UNIV2_ETH_DAI: JarDefinition =
 {
  type: AssetType.JAR,
   id: 'pJar 0.69a (inactive)',
   contract: '0xCffA068F1E44D98D3753966eBd58D4CFe3BB5162',
   depositToken: {
      addr: '0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11',
      name: 'UNI DAI/ETH',
      link: 'https://app.uniswap.org/#/add/v2/0x6b175474e89094c44da98b954eedeac495271d0f/ETH',
      components: ["dai", "weth"],
   },
   enablement: AssetEnablement.PERMANENTLY_DISABLED,
   chain: ChainNetwork.Ethereum,
   protocol: AssetProtocol.UNISWAP,
   details: undefined,
   farm: undefined
 }
 JAR_DEFINITIONS.push(JAR_UNIV2_ETH_DAI);
 
 
 export const JAR_UNIV2_ETH_USDC: JarDefinition =
 {
  type: AssetType.JAR,
   id: 'pJar 0.69b (inactive)',
   contract: '0x53Bf2E62fA20e2b4522f05de3597890Ec1b352C6',
   depositToken: {
      addr: '0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc',
      name: 'UNI USDC/ETH',
      link: 'https://app.uniswap.org/#/add/v2/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48/ETH',
      components: ["usdc", "weth"],
   },
   enablement: AssetEnablement.PERMANENTLY_DISABLED,
   chain: ChainNetwork.Ethereum,
   protocol: AssetProtocol.UNISWAP,
   details: undefined,
   farm: undefined
 }
 JAR_DEFINITIONS.push(JAR_UNIV2_ETH_USDC);
 
 
 export const JAR_UNIV2_ETH_USDT: JarDefinition =
 {
  type: AssetType.JAR,
   id: 'pJar 0.69c (inactive)',
   contract: '0x09FC573c502037B149ba87782ACC81cF093EC6ef',
   depositToken: {
      addr: '0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852',
      name: 'UNI USDT/ETH',
      link: 'https://app.uniswap.org/#/add/v2/ETH/0xdac17f958d2ee523a2206206994597c13d831ec7',
      components: ["usdt", "weth"],
   },
   enablement: AssetEnablement.PERMANENTLY_DISABLED,
   chain: ChainNetwork.Ethereum,
   protocol: AssetProtocol.UNISWAP,
   details: undefined,
   farm: undefined
 }
 JAR_DEFINITIONS.push(JAR_UNIV2_ETH_USDT);
 
 
 export const JAR_UNIV2_ETH_WBTC: JarDefinition =
 {
  type: AssetType.JAR,
   id: 'pJar 0.69d (inactive)',
   contract: '0xc80090AA05374d336875907372EE4ee636CBC562',
   depositToken: {
      addr: '0xBb2b8038a1640196FbE3e38816F3e67Cba72D940',
      name: 'UNI WBTC/ETH',
      link: 'https://app.uniswap.org/#/add/v2/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599/ETH',
      components: ["wbtc", "weth"],
   },
   enablement: AssetEnablement.PERMANENTLY_DISABLED,
   chain: ChainNetwork.Ethereum,
   protocol: AssetProtocol.UNISWAP,
   details: undefined,
   farm: undefined
 }
 JAR_DEFINITIONS.push(JAR_UNIV2_ETH_WBTC);
 
 
 export const JAR_pDAI: JarDefinition =
 {
  type: AssetType.JAR,
   id: 'pJar 0.88a (inactive)',
   contract: '0x6949Bb624E8e8A90F87cD2058139fcd77D2F3F87',
   depositToken: {
      addr: '0x6b175474e89094c44da98b954eedeac495271d0f',
      name: 'DAI',
      link: 'https://etherscan.io/token/0x6b175474e89094c44da98b954eedeac495271d0f',
   },
   enablement: AssetEnablement.PERMANENTLY_DISABLED,
   chain: ChainNetwork.Ethereum,
   protocol: AssetProtocol.COMPOUND,
   details: undefined,
   farm: undefined
 }
 JAR_DEFINITIONS.push(JAR_pDAI);
 
 
 export const JAR_ALETH: JarDefinition =
 {
  type: AssetType.JAR,
   id: 'pJar 0.98s',
   contract: '0xCbA1FE4Fdbd90531EFD929F1A1831F38e91cff1e',
   depositToken: {
      addr: '0xc9da65931ABf0Ed1b74Ce5ad8c041C4220940368',
      name: 'SADDLE-ETH-alETH',
      link: 'https://saddle.exchange/#/pools/aleth/deposit',
   },
   enablement: AssetEnablement.PERMANENTLY_DISABLED,
   chain: ChainNetwork.Ethereum,
   protocol: AssetProtocol.SADDLE,
   details: {
     apiKey: 'ALETH',
     harvestStyle: HarvestStyle.PASSIVE,
   },
   farm: {
     farmAddress: '0x042650a573f3d62d91C36E08045d7d0fd9E63759',
     farmNickname: 'Pickled alEth',
     farmDepositTokenName: 'pSaddleAlEth'
   }
 }
 JAR_DEFINITIONS.push(JAR_ALETH);
 
 
 
 export const JAR_LQTY: JarDefinition =
 {
  type: AssetType.JAR,
   id: 'pJar 0.98l',
   contract: '0x65B2532474f717D5A8ba38078B78106D56118bbb',
   depositToken: {
      addr: '0x6DEA81C8171D0bA574754EF6F8b412F2Ed88c54D',
      name: 'LQTY',
      link: 'https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x6dea81c8171d0ba574754ef6f8b412f2ed88c54d',
   },
   enablement: AssetEnablement.ENABLED,
   chain: ChainNetwork.Ethereum,
   protocol: AssetProtocol.TOKENPRICE,
   details: {
     apiKey: 'LQTY',
     harvestStyle: HarvestStyle.PASSIVE,
   },
   farm: {
     farmAddress: '0xA7BC844a76e727Ec5250f3849148c21F4b43CeEA',
     farmNickname: 'Pickled LQTY',
     farmDepositTokenName: 'pLQTY'
   }
 }
 JAR_DEFINITIONS.push(JAR_LQTY);
 
 
 export const JAR_SUSHI_ETH_DAI: JarDefinition =
 {
  type: AssetType.JAR,
   id: 'pJar 0.99a',
   contract: '0x55282dA27a3a02ffe599f6D11314D239dAC89135',
   depositToken: {
      addr: '0xC3D03e4F041Fd4cD388c549Ee2A29a9E5075882f',
      name: 'SLP DAI/ETH',
      link: 'https://app.sushi.com/add/0x6b175474e89094c44da98b954eedeac495271d0f/ETH',
      components: ["dai", "weth"],
   },
   enablement: AssetEnablement.ENABLED,
   chain: ChainNetwork.Ethereum,
   protocol: AssetProtocol.SUSHISWAP,
   details: {
     apiKey: 'SLP-DAI',
     harvestStyle: HarvestStyle.PASSIVE,
   },
   farm: {
     farmAddress: '0x6092c7084821057060ce2030F9CC11B22605955F',
     farmNickname: 'pSLP DAI',
     farmDepositTokenName: 'pSLP DAI'
   }
 }
 JAR_DEFINITIONS.push(JAR_SUSHI_ETH_DAI);
 
 
 export const JAR_SUSHI_ETH_USDC: JarDefinition =
 {
  type: AssetType.JAR,
   id: 'pJar 0.99b',
   contract: '0x8c2D16B7F6D3F989eb4878EcF13D695A7d504E43',
   depositToken: {
      addr: '0x397FF1542f962076d0BFE58eA045FfA2d347ACa0',
      name: 'SLP USDC/ETH',
      link: 'https://app.sushi.com/add/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48/ETH',
      components: ["usdc", "weth"],
   },
   enablement: AssetEnablement.ENABLED,
   chain: ChainNetwork.Ethereum,
   protocol: AssetProtocol.SUSHISWAP,
   details: {
     apiKey: 'SLP-USDC',
     harvestStyle: HarvestStyle.PASSIVE,
   },
   farm: {
     farmAddress: '0x8F720715d34Ff1FDa1342963EF6372d1557dB3A7',
     farmNickname: 'pSLP USDC',
     farmDepositTokenName: 'pSLP USDC'
   }
 }
 JAR_DEFINITIONS.push(JAR_SUSHI_ETH_USDC);
 
 
 export const JAR_SUSHI_ETH_USDT: JarDefinition =
 {
  type: AssetType.JAR,
   id: 'pJar 0.99c',
   contract: '0xa7a37aE5Cb163a3147DE83F15e15D8E5f94D6bCE',
   depositToken: {
      addr: '0x06da0fd433C1A5d7a4faa01111c044910A184553',
      name: 'SLP USDT/ETH',
      link: 'https://app.sushi.com/add/ETH/0xdac17f958d2ee523a2206206994597c13d831ec7',
      components: ["weth", "usdt"],
   },
   enablement: AssetEnablement.ENABLED,
   chain: ChainNetwork.Ethereum,
   protocol: AssetProtocol.SUSHISWAP,
   details: {
     apiKey: 'SLP-USDT',
     harvestStyle: HarvestStyle.PASSIVE,
   },
   farm: {
     farmAddress: '0x421476a3c0338E929cf9B77f7D087533bc9d2a2d',
     farmNickname: 'pSLP USDT',
     farmDepositTokenName: 'pSLP USDT'
   }
 }
 JAR_DEFINITIONS.push(JAR_SUSHI_ETH_USDT);
 
 
 export const JAR_SUSHI_ETH_WBTC: JarDefinition =
 {
  type: AssetType.JAR,
   id: 'pJar 0.99d',
   contract: '0xde74b6c547bd574c3527316a2eE30cd8F6041525',
   depositToken: {
      addr: '0xCEfF51756c56CeFFCA006cD410B03FFC46dd3a58',
      name: 'SLP WBTC/ETH',
      link: 'https://app.sushi.com/add/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599/ETH',
      components: ["wbtc", "weth"],
   },
   enablement: AssetEnablement.ENABLED,
   chain: ChainNetwork.Ethereum,
   protocol: AssetProtocol.SUSHISWAP,
   details: {
     apiKey: 'SLP-WBTC',
     harvestStyle: HarvestStyle.PASSIVE,
   },
   farm: {
     farmAddress: '0xD55331E7bCE14709d825557E5Bca75C73ad89bFb',
     farmNickname: 'pSLP WBTC',
     farmDepositTokenName: 'pSLP WBTC'
   }
 }
 JAR_DEFINITIONS.push(JAR_SUSHI_ETH_WBTC);
 
 
 export const JAR_SUSHI_ETH_YFI: JarDefinition =
 {
  type: AssetType.JAR,
   id: 'pJar 0.99e',
   contract: '0x3261D9408604CC8607b687980D40135aFA26FfED',
   depositToken: {
      addr: '0x088ee5007C98a9677165D78dD2109AE4a3D04d0C',
      name: 'SLP YFI/ETH',
      link: 'https://app.sushi.com/add/0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e/ETH',
      components: ["yfi", "weth"],
   },
   enablement: AssetEnablement.ENABLED,
   chain: ChainNetwork.Ethereum,
   protocol: AssetProtocol.SUSHISWAP,
   details: {
     apiKey: 'SLP-YFI',
     harvestStyle: HarvestStyle.PASSIVE,
   },
   farm: {
     farmAddress: '0x2E32b1c2D7086DB1620F4586E09BaC7147640838',
     farmNickname: 'pSLP YFI',
     farmDepositTokenName: 'pSLP YFI'
   }
 }
 JAR_DEFINITIONS.push(JAR_SUSHI_ETH_YFI);
 
 
 export const JAR_UNI_BAC_DAI: JarDefinition =
 {
  type: AssetType.JAR,
   id: 'pJar 0.99f (inactive)',
   contract: '0x4Cac56929B98d4C52dDfDF998329622013Fed2a5',
   depositToken: {
      addr: '0xd4405F0704621DBe9d4dEA60E128E0C3b26bddbD',
      name: 'UNI BAC/DAI',
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
     farmNickname: 'Back Scratcher',
     farmDepositTokenName: 'pUNIv2-BAC-DAI LP'
   }
 }
 JAR_DEFINITIONS.push(JAR_UNI_BAC_DAI);
 


 export const JAR_SUSHI_MIC_USDT: JarDefinition =
 {
  type: AssetType.JAR,
   id: 'pJar 0.99g (inactive)',
   contract: '0xC66583Dd4E25b3cfc8D881F6DbaD8288C7f5Fd30',
   depositToken: {
      addr: '0xC9cB53B48A2f3A9e75982685644c1870F1405CCb',
      name: 'SLP MIC/USDT',
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
     farmNickname: 'Back Scratcher',
     farmDepositTokenName: 'pSLP MIC/USDT LP'
   }
 }
 JAR_DEFINITIONS.push(JAR_SUSHI_MIC_USDT);
 


 export const JAR_SUSHI_MIS_USDT: JarDefinition =
 {
  type: AssetType.JAR,
   id: 'pJar 0.99h (inactive)',
   contract: '0x0faa189afe8ae97de1d2f01e471297678842146d',
   depositToken: {
      addr: '0x066f3a3b7c8fa077c71b9184d862ed0a4d5cf3e0',
      name: 'SLP MIS/USDT',
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
     farmNickname: 'Back Scratcher',
     farmDepositTokenName: 'pSLP MIS/USDT'
   }
 }
 JAR_DEFINITIONS.push(JAR_SUSHI_MIS_USDT);
 


 export const JAR_SUSHI_ETH_YVECRV: JarDefinition =
 {
  type: AssetType.JAR,
   id: 'pJar 0.99i (inactive)',
   contract: '0x5Eff6d166D66BacBC1BF52E2C54dD391AE6b1f48',
   depositToken: {
      addr: '0x10B47177E92Ef9D5C6059055d92DdF6290848991',
      name: 'SLP YVECRV/ETH',
      link: 'https://app.sushi.com/add/0xc5bddf9843308380375a611c18b50fb9341f502a/ETH',
      components: ["weth", "yvecrv"],
   },
   enablement: AssetEnablement.DISABLED,
   chain: ChainNetwork.Ethereum,
   protocol: AssetProtocol.SUSHISWAP,
   details: {
     apiKey: 'yveCRV-ETH',
     harvestStyle: HarvestStyle.PASSIVE,
   },
   farm: {
     farmAddress: '0xd3F6732D758008E59e740B2bc2C1b5E420b752c2',
     farmNickname: 'Back Scratcher',
     farmDepositTokenName: 'pSLP yveCRV'
   }
 }
 JAR_DEFINITIONS.push(JAR_SUSHI_ETH_YVECRV);
 

 export const JAR_UNI_BAS_DAI: JarDefinition =
 {
  type: AssetType.JAR,
   id: 'pJar 0.99j (inactive)',
   contract: '0xcF45563514a24b10563aC0c9fECCd3476b00DF45',
   depositToken: {
      addr: '0x3E78F2E7daDe07ea685F8612F00477FD97162F1e',
      name: 'UNI BAS/DAI',
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
     farmNickname: 'Back Scratcher',
     farmDepositTokenName: 'UNI BAS/DAI'
   }
 }
 JAR_DEFINITIONS.push(JAR_UNI_BAS_DAI);
 
 
 export const JAR_UNIV2_MIR_UST: JarDefinition =
 {
  type: AssetType.JAR,
   id: 'pJar 0.99k',
   contract: '0x3Bcd97dCA7b1CED292687c97702725F37af01CaC',
   depositToken: {
      addr: '0x87dA823B6fC8EB8575a235A824690fda94674c88',
      name: 'UNI MIR/UST',
      link: 'https://app.uniswap.org/#/add/v2/0x09a3ecafa817268f77be1283176b946c4ff2e608/0xa47c8bf37f92aBed4A126BDA807A7b7498661acD',
      components: ["mir", "ust"],
   },
   enablement: AssetEnablement.ENABLED,
   chain: ChainNetwork.Ethereum,
   protocol: AssetProtocol.UNISWAP,
   details: {
     apiKey: 'MIR-UST',
     harvestStyle: HarvestStyle.PASSIVE,
   },
   farm: {
     farmAddress: '0x02c9420467a22ad6067ef0CB4459752F45266C07',
     farmNickname: 'pUNIV2 MIR/UST',
     farmDepositTokenName: 'pUNIV2 MIR/UST'
   }
 }
 JAR_DEFINITIONS.push(JAR_UNIV2_MIR_UST);
 
 
 export const JAR_UNIV2_MTSLA_UST: JarDefinition =
 {
  type: AssetType.JAR,
   id: 'pJar 0.99l',
   contract: '0xaFB2FE266c215B5aAe9c4a9DaDC325cC7a497230',
   depositToken: {
      addr: '0x5233349957586A8207c52693A959483F9aeAA50C',
      name: 'UNI MTSLA/UST',
      link: 'https://app.uniswap.org/#/add/v2/0x21cA39943E91d704678F5D00b6616650F066fD63/0xa47c8bf37f92aBed4A126BDA807A7b7498661acD',
      components: ["mtsla", "ust"],
   },
   enablement: AssetEnablement.ENABLED,
   chain: ChainNetwork.Ethereum,
   protocol: AssetProtocol.UNISWAP,
   details: {
     apiKey: 'MTSLA-UST',
     harvestStyle: HarvestStyle.PASSIVE,
   },
   farm: {
     farmAddress: '0xd7513F24B4D3672ADD9AF6C739Eb6EeBB85D8dD5',
     farmNickname: 'pUNIV2 MTSLA/UST',
     farmDepositTokenName: 'pUNIV2 MTSLA/UST'
   }
 }
 JAR_DEFINITIONS.push(JAR_UNIV2_MTSLA_UST);
 
 
 export const JAR_UNIV2_MAAPL_UST: JarDefinition =
 {
  type: AssetType.JAR,
   id: 'pJar 0.99m',
   contract: '0xF303B35D5bCb4d9ED20fB122F5E268211dEc0EBd',
   depositToken: {
      addr: '0xB022e08aDc8bA2dE6bA4fECb59C6D502f66e953B',
      name: 'UNI MAAPL/UST',
      link: 'https://app.uniswap.org/#/add/v2/0xd36932143F6eBDEDD872D5Fb0651f4B72Fd15a84/0xa47c8bf37f92aBed4A126BDA807A7b7498661acD',
      components: ["maapl", "ust"],
   },
   enablement: AssetEnablement.ENABLED,
   chain: ChainNetwork.Ethereum,
   protocol: AssetProtocol.UNISWAP,
   details: {
     apiKey: 'MAAPL-UST',
     harvestStyle: HarvestStyle.PASSIVE,
   },
   farm: {
     farmAddress: '0x2Df015B117343e24AEC9AC99909A4c097a2828Ab',
     farmNickname: 'pUNIV2 MAAPL/UST',
     farmDepositTokenName: 'pUNIV2 MAAPL/UST'
   }
 }
 JAR_DEFINITIONS.push(JAR_UNIV2_MAAPL_UST);
 
 
 export const JAR_UNIV2_MQQQ_UST: JarDefinition =
 {
  type: AssetType.JAR,
   id: 'pJar 0.99n',
   contract: '0x7C8de3eE2244207A54b57f45286c9eE1465fee9f',
   depositToken: {
      addr: '0x9E3B47B861B451879d43BBA404c35bdFb99F0a6c',
      name: 'UNI MQQQ/UST',
      link: 'https://app.uniswap.org/#/add/v2/0x13B02c8dE71680e71F0820c996E4bE43c2F57d15/0xa47c8bf37f92aBed4A126BDA807A7b7498661acD',
      components: ["mqqq", "ust"],
   },
   enablement: AssetEnablement.ENABLED,
   chain: ChainNetwork.Ethereum,
   protocol: AssetProtocol.UNISWAP,
   details: {
     apiKey: 'MQQQ-UST',
     harvestStyle: HarvestStyle.PASSIVE,
   },
   farm: {
     farmAddress: '0x3D24b7693A0a5Bf13977b19C81460aEd3f60C150',
     farmNickname: 'pUNIV2 MQQQ/UST',
     farmDepositTokenName: 'pUNIV2 MQQQ/UST'
   }
 }
 JAR_DEFINITIONS.push(JAR_UNIV2_MQQQ_UST);
 
 
 export const JAR_UNIV2_MSLV_UST: JarDefinition =
 {
  type: AssetType.JAR,
   id: 'pJar 0.99o',
   contract: '0x1ed1fD33b62bEa268e527A622108fe0eE0104C07',
   depositToken: {
      addr: '0x860425bE6ad1345DC7a3e287faCBF32B18bc4fAe',
      name: 'UNI MSLV/UST',
      link: 'https://app.uniswap.org/#/add/v2/0x9d1555d8cB3C846Bb4f7D5B1B1080872c3166676/0xa47c8bf37f92aBed4A126BDA807A7b7498661acD',
      components: ["mslv", "ust"],
   },
   enablement: AssetEnablement.ENABLED,
   chain: ChainNetwork.Ethereum,
   protocol: AssetProtocol.UNISWAP,
   details: {
     apiKey: 'MSLV-UST',
     harvestStyle: HarvestStyle.PASSIVE,
   },
   farm: {
     farmAddress: '0x1456846B5A7d3c7F9Ea643a4847376fB19fC1aB1',
     farmNickname: 'pUNIV2 MSLV/UST',
     farmDepositTokenName: 'pUNIV2 MSLV/UST'
   }
 }
 JAR_DEFINITIONS.push(JAR_UNIV2_MSLV_UST);
 
 
 export const JAR_UNIV2_MBABA_UST: JarDefinition =
 {
  type: AssetType.JAR,
   id: 'pJar 0.99p',
   contract: '0x1CF137F651D8f0A4009deD168B442ea2E870323A',
   depositToken: {
      addr: '0x676Ce85f66aDB8D7b8323AeEfe17087A3b8CB363',
      name: 'UNI MBABA/UST',
      link: 'https://app.uniswap.org/#/add/v2/0x56aA298a19C93c6801FDde870fA63EF75Cc0aF72/0xa47c8bf37f92aBed4A126BDA807A7b7498661acD',
      components: ["mbaba", "ust"],
   },
   enablement: AssetEnablement.ENABLED,
   chain: ChainNetwork.Ethereum,
   protocol: AssetProtocol.UNISWAP,
   details: {
     apiKey: 'MBABA-UST',
     harvestStyle: HarvestStyle.PASSIVE,
   },
   farm: {
     farmAddress: '0x6Ea17c249f6cFD434A01c54701A8694766b76594',
     farmNickname: 'pUNIV2 MBABA/UST',
     farmDepositTokenName: 'pUNIV2 MBABA/UST'
   }
 }
 JAR_DEFINITIONS.push(JAR_UNIV2_MBABA_UST);
 
 
 export const JAR_SUSHI_ETH: JarDefinition =
 {
  type: AssetType.JAR,
   id: 'pJar 0.99q',
   contract: '0xECb520217DccC712448338B0BB9b08Ce75AD61AE',
   depositToken: {
      addr: '0x795065dCc9f64b5614C407a6EFDC400DA6221FB0',
      name: 'SLP SUSHI/ETH',
      link: 'https://app.sushi.com/add/0x6b3595068778dd592e39a122f4f5a5cf09c90fe2/ETH',
      components: ["sushi", "weth"],
   },
   enablement: AssetEnablement.ENABLED,
   chain: ChainNetwork.Ethereum,
   protocol: AssetProtocol.SUSHISWAP,
   details: {
     apiKey: 'SUSHI-ETH',
     harvestStyle: HarvestStyle.PASSIVE,
   },
   farm: {
     farmAddress: '0xdaf08622Ce348fdEA09709F279B6F5673B1e0dad',
     farmNickname: 'pSLP SUSHI',
     farmDepositTokenName: 'pSLP SUSHI'
   }
 }
 JAR_DEFINITIONS.push(JAR_SUSHI_ETH);
 
 
 export const JAR_UNIV2_FEI_TRIBE: JarDefinition =
 {
  type: AssetType.JAR,
   id: 'pJar 0.99r',
   contract: '0xC1513C1b0B359Bc5aCF7b772100061217838768B',
   depositToken: {
      addr: '0x9928e4046d7c6513326cCeA028cD3e7a91c7590A',
      name: 'UNI FEI/TRIBE',
      link: 'https://app.uniswap.org/#/add/v2/0x956f47f50a910163d8bf957cf5846d573e7f87ca/0xc7283b66eb1eb5fb86327f08e1b5816b0720212b',
      components: ["fei", "tribe"],
   },
   enablement: AssetEnablement.ENABLED,
   chain: ChainNetwork.Ethereum,
   protocol: AssetProtocol.UNISWAP,
   details: {
     apiKey: 'FEI-TRIBE',
     harvestStyle: HarvestStyle.PASSIVE,
   },
   farm: {
     farmAddress: '0xeA5b46877E2d131405DB7e5155CC15B8e55fbD27',
     farmNickname: 'pUNIV2 FEI/TRIBE',
     farmDepositTokenName: 'pUNIV2 FEI/TRIBE'
   }
 }
 JAR_DEFINITIONS.push(JAR_UNIV2_FEI_TRIBE);
 

 export const JAR_SADDLE_D4: JarDefinition =
 {
  type: AssetType.JAR,
   id: 'pJar 0.99s4',
   contract: '0xe6487033F5C8e2b4726AF54CA1449FEC18Bd1484',
   depositToken: {
      addr: '0xd48cf4d7fb0824cc8bae055df3092584d0a1726a',
      name: 'SADDLE-D4',
      link: 'https://saddle.exchange/#/pools/d4/deposit',
      components: ["alusd", "fei", "frax", "lusd"],
   },
   enablement: AssetEnablement.ENABLED,
   chain: ChainNetwork.Ethereum,
   protocol: AssetProtocol.SADDLE,
   details: {
     apiKey: 'saddled4',
     harvestStyle: HarvestStyle.PASSIVE,
   },
   farm: {
     farmAddress: '0x08cb0a0ba8e4f143e4e6f7bed65e02b6dfb9a16c',
     farmNickname: 'Saddle D4',
     farmDepositTokenName: 'pSADDLED4'
   }
 }
 JAR_DEFINITIONS.push(JAR_SADDLE_D4);
 
 
 export const JAR_UNIV2_LUSD_ETH: JarDefinition =
 {
  type: AssetType.JAR,
   id: 'pJar 0.99u (inactive)',
   contract: '0x927e3bCBD329e89A8765B52950861482f0B227c4',
   depositToken: {
      addr: '0xF20EF17b889b437C151eB5bA15A47bFc62bfF469',
      name: 'UNI ETH/LUSD',
      link: 'https://app.uniswap.org/#/add/v2/0x5f98805A4E8be255a32880FDeC7F6728C6568bA0/ETH',
      components: ["lusd", "weth"],
   },
   enablement: AssetEnablement.PERMANENTLY_DISABLED,
   chain: ChainNetwork.Ethereum,
   protocol: AssetProtocol.UNISWAP,
   details: {
     apiKey: 'LUSD-ETH',
     harvestStyle: HarvestStyle.PASSIVE,
   },
   farm: {
     farmAddress: '0xbc9d68f38881a9c161da18881e21b2ac9df87b55',
     farmNickname: 'pUNIV2 LUSD/ETH',
     farmDepositTokenName: 'pUNIV2 LUSD/ETH'
   }
 }
 JAR_DEFINITIONS.push(JAR_UNIV2_LUSD_ETH);
 
 
 export const JAR_SUSHI_ETH_ALCX: JarDefinition =
 {
  type: AssetType.JAR,
   id: 'pJar 0.99x',
   contract: '0x9eb0aAd5Bb943D3b2F7603Deb772faa35f60aDF9',
   depositToken: {
      addr: '0xC3f279090a47e80990Fe3a9c30d24Cb117EF91a8',
      name: 'SLP ALCX/ETH',
      link: 'https://app.sushi.com/add/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2/0xdbdb4d16eda451d0503b854cf79d55697f90c8df',
      components: ["weth", "alcx"],
   },
   enablement: AssetEnablement.ENABLED,
   chain: ChainNetwork.Ethereum,
   protocol: AssetProtocol.SUSHISWAP,
   details: {
     apiKey: 'ALCX-ETH',
     harvestStyle: HarvestStyle.PASSIVE,
   },
   farm: {
     farmAddress: '0xE9bEAd1d3e3A25E8AF7a6B40e48de469a9613EDe',
     farmNickname: 'pSLP ALCX/ETH',
     farmDepositTokenName: 'pSLP ALCX/ETH'
   }
 }
 JAR_DEFINITIONS.push(JAR_SUSHI_ETH_ALCX);
 
 
 export const JAR_SUSHI_ETH_YVBOOST: JarDefinition =
 {
  type: AssetType.JAR,
   id: 'pJar 0.99y',
   contract: '0xCeD67a187b923F0E5ebcc77C7f2F7da20099e378',
   depositToken: {
      addr: '0x9461173740D27311b176476FA27e94C681b1Ea6b',
      name: 'SLP YVBOOST/ETH',
      link: 'https://app.sushi.com/add/0x9d409a0A012CFbA9B15F6D4B36Ac57A46966Ab9a/ETH',
      components: ["weth", "yvboost"],
   },
   enablement: AssetEnablement.ENABLED,
   chain: ChainNetwork.Ethereum,
   protocol: AssetProtocol.SUSHISWAP,
   details: {
     apiKey: 'yvBOOST-ETH',
     harvestStyle: HarvestStyle.PASSIVE,
   },
   farm: {
     farmAddress: '0xDA481b277dCe305B97F4091bD66595d57CF31634',
     farmNickname: 'Back Scratcher',
     farmDepositTokenName: 'pSLP yvBOOST'
   }
 }
 JAR_DEFINITIONS.push(JAR_SUSHI_ETH_YVBOOST);
 
 
 export const JAR_SUSHI_CVX_ETH: JarDefinition =
 {
  type: AssetType.JAR,
   id: 'pJar 0.99z',
   contract: '0xDCfAE44244B3fABb5b351b01Dc9f050E589cF24F',
   depositToken: {
      addr: '0x05767d9EF41dC40689678fFca0608878fb3dE906',
      name: 'SLP CVX/ETH',
      link: 'https://app.sushi.com/add/0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b/ETH',
      components: ["cvx", "weth"],
   },
   enablement: AssetEnablement.ENABLED,
   chain: ChainNetwork.Ethereum,
   protocol: AssetProtocol.SUSHISWAP,
   details: {
     apiKey: 'CVX-ETH',
     harvestStyle: HarvestStyle.PASSIVE,
   },
   farm: {
     farmAddress: '0x62e558cda4619e31af8c84cd8f345fa474afe1b9',
     farmNickname: 'pSUSHICVXETH',
     farmDepositTokenName: 'pSUSHICVXETH'
   }
 }
 JAR_DEFINITIONS.push(JAR_SUSHI_CVX_ETH);
 
 
 export const JAR_USDC: JarDefinition =
 {
  type: AssetType.JAR,
   id: 'pJar Y-1',
   contract: '0xEB801AB73E9A2A482aA48CaCA13B1954028F4c94',
   depositToken: {
      addr: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      name: 'USDC',
      link: 'https://etherscan.io/token/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      components: ["usdc"],
      decimals: 6
   },
   enablement: AssetEnablement.ENABLED,
   chain: ChainNetwork.Ethereum,
   protocol: AssetProtocol.YEARN,
   details: {
     apiKey: 'USDC',
     harvestStyle: HarvestStyle.PASSIVE,
   },
   farm: {
     farmAddress: '0x9e1126c51c319A1d31d928DC498c9988C094e793',
     farmNickname: 'Pickled Yearn USDC',
     farmDepositTokenName: 'pYearnUSDCv2'
   }
 }
 JAR_DEFINITIONS.push(JAR_USDC);
 
 
 export const JAR_lusdCRV: JarDefinition =
 {
  type: AssetType.JAR,
   id: 'pJar Y-2',
   contract: '0x4fFe73Cf2EEf5E8C8E0E10160bCe440a029166D2',
   depositToken: {
      addr: '0xEd279fDD11cA84bEef15AF5D39BB4d4bEE23F0cA',
      name: 'lusdCRV',
      link: 'https://curve.fi/lusd/deposit',
      components: ["lusd", "3crv"],
   },
   enablement: AssetEnablement.ENABLED,
   chain: ChainNetwork.Ethereum,
   protocol: AssetProtocol.YEARN,
   details: {
     apiKey: 'lusdCRV',
     harvestStyle: HarvestStyle.PASSIVE,
   },
   farm: {
     farmAddress: '0x2040c856d53d5CbB111c81D5A85ccc10829c5783',
     farmNickname: 'Pickled Yearn LUSD',
     farmDepositTokenName: 'pYearnLusdCRV'
   }
 }
 JAR_DEFINITIONS.push(JAR_lusdCRV);
 
 
 export const JAR_fraxCRV: JarDefinition =
 {
  type: AssetType.JAR,
   id: 'pJar Y-3',
   contract: '0x729C6248f9B1Ce62B3d5e31D4eE7EE95cAB32dfD',
   depositToken: {
      addr: '0xd632f22692FaC7611d2AA1C0D552930D43CAEd3B',
      name: 'fraxCRV',
      link: 'https://curve.fi/frax/deposit',
      components: ["frax", "3crv"],
   },
   enablement: AssetEnablement.ENABLED,
   chain: ChainNetwork.Ethereum,
   protocol: AssetProtocol.YEARN,
   details: {
     apiKey: 'FRAXCRV',
     harvestStyle: HarvestStyle.PASSIVE,
   },
   farm: {
     farmAddress: '0xCAbdCB680fC0E477bbB0aC77b2a278cA54D0E6Ff',
     farmNickname: 'Pickled Yearn FRAX',
     farmDepositTokenName: 'pYearnFraxCRV'
   }
 }
 JAR_DEFINITIONS.push(JAR_fraxCRV);

 
 export const JAR_CRV_IB: JarDefinition =
 {
  type: AssetType.JAR,
   id: 'pJar Y-4',
   contract: '0x4E9806345fb39FFebd70A01f177A675805019ba8',
   depositToken: {
      addr: '0x5282a4ef67d9c33135340fb3289cc1711c13638c',
      name: 'crvIB',
      link: 'https://curve.fi/ib/deposit',
      components: ["dai", "usdc", "usdt"],
   },
   enablement: AssetEnablement.DEV,
   chain: ChainNetwork.Ethereum,
   protocol: AssetProtocol.YEARN,
   details: {
     apiKey: 'IBCRV',
     harvestStyle: HarvestStyle.PASSIVE,
   },
   farm: undefined
 }
 JAR_DEFINITIONS.push(JAR_CRV_IB);



 export const JAR_MIM3CRV: JarDefinition =
 {
  type: AssetType.JAR,
   id: 'pjar 0.99m1',
   contract: '0x1Bf62aCb8603Ef7F3A0DFAF79b25202fe1FAEE06',
   depositToken: {
      addr: '0x5a6a4d54456819380173272a5e8e9b9904bdf41b',
      name: 'mim3CRV',
      link: 'https://curve.fi/mim/deposit',
      components: ["mim", "3crv"], // TODO
   },
   enablement: AssetEnablement.ENABLED,
   chain: ChainNetwork.Ethereum,
   protocol: AssetProtocol.CURVE,
   details: {
     apiKey: 'MIM3CRV',
     harvestStyle: HarvestStyle.PASSIVE,
   },
   farm: {
     farmAddress: '0xE58f2F41D586803615fAdfc423a41c148fd1D949',
     farmNickname: 'mim3CRV',
     farmDepositTokenName: 'pAbraMim3CRV'
   }
 }
 JAR_DEFINITIONS.push(JAR_MIM3CRV);
 


 export const JAR_SPELLETH: JarDefinition =
 {
  type: AssetType.JAR,
   id: 'pjar 0.99m2',
   contract: '0xdB84a6A48881545E8595218b7a2A3c9bd28498aE',
   depositToken: {
      addr: '0xb5de0c3753b6e1b4dba616db82767f17513e6d4e',
      name: 'SpellEth',
      link: 'https://app.sushi.com/add/ETH/0x090185f2135308BaD17527004364eBcC2D37e5F6',
      components: ["spell", "weth"], // TODO
   },
   enablement: AssetEnablement.ENABLED,
   chain: ChainNetwork.Ethereum,
   protocol: AssetProtocol.SUSHISWAP,
   details: {
     apiKey: 'SPELL-ETH',
     harvestStyle: HarvestStyle.PASSIVE,
   },
   farm: {
     farmAddress: '0xF7eECA3C5B0A01D051690E0cF082AE5006c7e073',
     farmNickname: 'AbraSpellEth',
     farmDepositTokenName: 'pAbraSpellEth'
   }
 }
 JAR_DEFINITIONS.push(JAR_SPELLETH);


 export const JAR_MIMETH: JarDefinition =
 {
  type: AssetType.JAR,
   id: 'pjar 0.99m3',
   contract: '0x993f35FaF4AEA39e1dfF28f45098429E0c87126C',
   depositToken: {
      addr: '0x07d5695a24904cc1b6e3bd57cc7780b90618e3c4',
      name: 'MimEth',
      link: 'https://app.sushi.com/add/ETH/0x99D8a9C45b2ecA8864373A26D1459e3Dff1e17F3',
      components: ["mim", "weth"], // TODO
   },
   enablement: AssetEnablement.ENABLED,
   chain: ChainNetwork.Ethereum,
   protocol: AssetProtocol.SUSHISWAP,
   details: {
     apiKey: 'MIM-ETH',
     harvestStyle: HarvestStyle.PASSIVE,
   },
   farm: {
     farmAddress: '0xF7eECA3C5B0A01D051690E0cF082AE5006c7e073',
     farmNickname: 'AbraSpellEth',
     farmDepositTokenName: 'pAbraSpellEth'
   }
 }
 JAR_DEFINITIONS.push(JAR_MIMETH);
 

 export const JAR_FOXETH: JarDefinition =
 {
  type: AssetType.JAR,
   id: 'pjar 0.99f1',
   contract: '0xeb8174F94FDAcCB099422d9A816B8E17d5e393E3',
   depositToken: {
      addr: '0x470e8de2eBaef52014A47Cb5E6aF86884947F08c',
      name: 'UNIv2-FOX-ETH LP',
      link: 'https://app.uniswap.org/#/add/v2/0xc770eefad204b5180df6a14ee197d99d808ee52d/ETH',
      components: ["fox", "weth"],
   },
   enablement: AssetEnablement.ENABLED,
   chain: ChainNetwork.Ethereum,
   protocol: AssetProtocol.UNISWAP,
   details: {
     apiKey: 'FOX-ETH',
     harvestStyle: HarvestStyle.PASSIVE,
   },
   farm: {
     farmAddress: '0x58675Af6001e8785e69CE82746a74a37f824EBAE',
     farmNickname: 'pFoxEth',
     farmDepositTokenName: 'pUNI-FoxEth'
   }
 }
 JAR_DEFINITIONS.push(JAR_FOXETH);

 export const JAR_TRUETH: JarDefinition =
 {
  type: AssetType.JAR,
   id: 'pjar 0.99t',
   contract: '0x1d92e1702D7054f74eAC3a9569AeB87FC93e101D',
   depositToken: {
      addr: '0xfCEAAf9792139BF714a694f868A215493461446D',
      name: 'SUSHI-TRU-ETH LP',
      link: 'https://app.sushi.com/add/ETH/0x4C19596f5aAfF459fA38B0f7eD92F11AE6543784',
      components: ["tru", "weth"],
   },
   enablement: AssetEnablement.ENABLED,
   chain: ChainNetwork.Ethereum,
   protocol: AssetProtocol.SUSHISWAP,
   details: {
     apiKey: 'TRU-ETH',
     harvestStyle: HarvestStyle.PASSIVE,
   },
   farm: {
     farmAddress: '0x9fec5e5d75274f8cfa4261f8e97138920e142470',
     farmNickname: 'pSUSHITRUETH',
     farmDepositTokenName: 'pSLP-TRU-ETH'
   }
 }
 JAR_DEFINITIONS.push(JAR_TRUETH);
 

 // Polygon
 
 export const JAR_COMETH_USDC_WETH: JarDefinition =
 {
  type: AssetType.JAR,
   id: 'polyJar 1a',
   contract: '0x9eD7e3590F2fB9EEE382dfC55c71F9d3DF12556c',
   depositToken: {
      addr: '0x1Edb2D8f791D2a51D56979bf3A25673D6E783232',
      name: 'COMETH USDC/WETH',
      link: 'https://swap.cometh.io/#/add/0x2791bca1f2de4661ed88a30c99a7a9449aa84174/0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
      components:  ["usdc", "weth"],
   },
   enablement: AssetEnablement.ENABLED,
   chain: ChainNetwork.Polygon,
   protocol: AssetProtocol.COMETHSWAP,
   details: {
     apiKey: 'COMETH-USDC',
     harvestStyle: HarvestStyle.PASSIVE,

   },
   farm: {
     farmAddress: '0x20b2a3fc7b13ca0ccf7af81a68a14cb3116e8749',
     farmNickname: 'pCLP USDC/WETH',
     farmDepositTokenName: 'pCLP USDC/WETH'
   }
 }
 JAR_DEFINITIONS.push(JAR_COMETH_USDC_WETH);
 
 
 export const JAR_COMETH_PICKLE_MUST: JarDefinition =
 {
  type: AssetType.JAR,
   id: 'polyJar 1b',
   contract: '0x7512105DBb4C0E0432844070a45B7EA0D83a23fD',
   depositToken: {
      addr: '0xb0b5e3bd18eb1e316bcd0bba876570b3c1779c55',
      name: 'COMETH PICKLE/MUST',
      link: 'https://swap.cometh.io/#/add/0x9c78ee466d6cb57a4d01fd887d2b5dfb2d46288f/0x2b88ad57897a8b496595925f43048301c37615da',
      components: ["pickle", "must"],
   },
   enablement: AssetEnablement.ENABLED,
   chain: ChainNetwork.Polygon,
   protocol: AssetProtocol.COMETHSWAP,
   details: {
     apiKey: 'COMETH-PICKLE',
     harvestStyle: HarvestStyle.PASSIVE,
   },
   farm: {
     farmAddress: '0x20b2a3fc7b13ca0ccf7af81a68a14cb3116e8749',
     farmNickname: 'pCLP PICKLE/MUST',
     farmDepositTokenName: 'pCLP PICKLE/MUST'
   }
 }
 JAR_DEFINITIONS.push(JAR_COMETH_PICKLE_MUST);
 
 
 export const JAR_COMETH_MATIC_MUST: JarDefinition =
 {
  type: AssetType.JAR,
   id: 'polyJar 1c',
   contract: '0x91bcc0BBC2ecA760e3b8A79903CbA53483A7012C',
   depositToken: {
      addr: '0x80676b414a905de269d0ac593322af821b683b92',
      name: 'COMETH MATIC/MUST',
      link: 'https://swap.cometh.io/#/add/0x9c78ee466d6cb57a4d01fd887d2b5dfb2d46288f/0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
      components: ["matic", "must"],
   },
   enablement: AssetEnablement.ENABLED,
   chain: ChainNetwork.Polygon,
   protocol: AssetProtocol.COMETHSWAP,
   details: {
     apiKey: 'COMETH-MATIC',
     harvestStyle: HarvestStyle.PASSIVE,
   },
   farm: {
     farmAddress: '0x20b2a3fc7b13ca0ccf7af81a68a14cb3116e8749',
     farmNickname: 'pCLP MATIC/MUST',
     farmDepositTokenName: 'pCLP MATIC/MUST'
   }
 }
 JAR_DEFINITIONS.push(JAR_COMETH_MATIC_MUST);
 
 
 export const JAR_AAVEDAI: JarDefinition =
 {
  type: AssetType.JAR,
   id: 'polyJar 2a',
   contract: '0x0519848e57Ba0469AA5275283ec0712c91e20D8E',
   depositToken: {
      addr: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
      name: 'DAI',
      link: 'https://polygonscan.com/token/0x8f3cf7ad23cd3cadbd9735aff958023239c6a063?a=0x5143e71982a2d5dc63a77f0a5611685cf13c5aaf',
      components: ["dai"]
   },
   enablement: AssetEnablement.ENABLED,
   chain: ChainNetwork.Polygon,
   protocol: AssetProtocol.AAVE_POLYGON,
   details: {
     apiKey: 'DAI',
     harvestStyle: HarvestStyle.PASSIVE,
   },
   farm: {
     farmAddress: '0x20b2a3fc7b13ca0ccf7af81a68a14cb3116e8749',
     farmNickname: 'pAaveDAI',
     farmDepositTokenName: 'pAaveDAI'
   }
 }
 JAR_DEFINITIONS.push(JAR_AAVEDAI);
 
 
 export const JAR_AM3CRV: JarDefinition =
 {
  type: AssetType.JAR,
   id: 'polyJar 3a',
   contract: '0x261b5619d85B710f1c2570b65ee945975E2cC221',
   depositToken: {
      addr: '0xE7a24EF0C5e95Ffb0f6684b813A78F2a3AD7D171',
      name: 'am3CRV',
      link: 'https://polygon.curve.fi/aave/deposit',
      components: [], // TODO
   },
   enablement: AssetEnablement.ENABLED,
   chain: ChainNetwork.Polygon,
   protocol: AssetProtocol.CURVE,
   details: {
     apiKey: 'am3CRV',
     harvestStyle: HarvestStyle.PASSIVE,
   },
   farm: {
     farmAddress: '0x20b2a3fc7b13ca0ccf7af81a68a14cb3116e8749',
     farmNickname: 'am3CRV',
     farmDepositTokenName: 'am3CRV'
   }
 }
 JAR_DEFINITIONS.push(JAR_AM3CRV);
 
 
 export const JAR_POLY_SUSHI_ETH_USDT: JarDefinition =
 {
  type: AssetType.JAR,
   id: 'polyJar 4a',
   contract: '0x80aB65b1525816Ffe4222607EDa73F86D211AC95',
   depositToken: {
      addr: '0xc2755915a85c6f6c1c0f3a86ac8c058f11caa9c9',
      name: 'SLP USDT/ETH',
      link: 'https://app.sushi.com/#/add/0x7ceb23fd6bc0add59e62ac25578270cff1b9f619/0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
      components: ["mweth", "musdt"],
   },
   enablement: AssetEnablement.ENABLED,
   chain: ChainNetwork.Polygon,
   protocol: AssetProtocol.SUSHISWAP_POLYGON,
   details: {
     apiKey: 'PSLP-USDT',
     harvestStyle: HarvestStyle.PASSIVE,
   },
   farm: {
     farmAddress: '0x20b2a3fc7b13ca0ccf7af81a68a14cb3116e8749',
     farmNickname: 'pSLP ETH/USDT',
     farmDepositTokenName: 'pSLP ETH/USDT'
   }
 }
 JAR_DEFINITIONS.push(JAR_POLY_SUSHI_ETH_USDT);
 
 
 export const JAR_POLY_SUSHI_MATIC_ETH: JarDefinition =
 {
  type: AssetType.JAR,
   id: 'polyJar 4b',
   contract: '0xd438Ba7217240a378238AcE3f44EFaaaF8aaC75A',
   depositToken: {
      addr: '0xc4e595acdd7d12fec385e5da5d43160e8a0bac0e',
      name: 'SLP MATIC/ETH',
      link: 'https://app.sushi.com/add/0x7ceb23fd6bc0add59e62ac25578270cff1b9f619/0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
      components: ["mweth", "matic"],
   },
   enablement: AssetEnablement.ENABLED,
   chain: ChainNetwork.Polygon,
   protocol: AssetProtocol.SUSHISWAP_POLYGON,
   details: {
     apiKey: 'PSLP-MATIC',
     harvestStyle: HarvestStyle.PASSIVE,
   },
   farm: {
     farmAddress: '0x20b2a3fc7b13ca0ccf7af81a68a14cb3116e8749',
     farmNickname: 'pSLP ETH/MATIC',
     farmDepositTokenName: 'pSLP ETH/MATIC'
   }
 }
 JAR_DEFINITIONS.push(JAR_POLY_SUSHI_MATIC_ETH);
 

 export const JAR_SUSHI_DINO_USDC: JarDefinition =
 {
  type: AssetType.JAR,
   id: 'polyJar 4c',
   contract: '0xC8450922d18793AD97C401D65BaE8A83aE5353a8',
   depositToken: {
      addr: '0x3324af8417844e70b81555A6D1568d78f4D4Bf1f',
      name: 'SushiDinoUsdc',
      link: 'https://app.sushi.com/add/0x2791bca1f2de4661ed88a30c99a7a9449aa84174/0xAa9654BECca45B5BDFA5ac646c939C62b527D394',
      components: ["dino", "usdc"],
   },
   enablement: AssetEnablement.ENABLED,
   chain: ChainNetwork.Polygon,
   protocol: AssetProtocol.SUSHISWAP_POLYGON,
   details: {
     apiKey: 'DINO-USDC',
     harvestStyle: HarvestStyle.PASSIVE,
   },
   farm: {
     farmAddress: '0x20b2a3fc7b13ca0ccf7af81a68a14cb3116e8749',
     farmNickname: 'pSLPDinoUsdc',
     farmDepositTokenName: 'pSLPDinoUsdc'
   }
 }
 JAR_DEFINITIONS.push(JAR_SUSHI_DINO_USDC);

 
 export const JAR_QUICK_DINO_ETH: JarDefinition =
 {
  type: AssetType.JAR,
   id: 'polyJar 4d',
   contract: '0x1cCDB8152Bb12aa34e5E7F6C9c7870cd6C45E37F',
   depositToken: {
      addr: '0x9f03309A588e33A239Bf49ed8D68b2D45C7A1F11',
      name: 'QuickDinoEth',
      link: 'https://app.sushi.com/add/0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619/0xAa9654BECca45B5BDFA5ac646c939C62b527D394',
      components: ["dino", "usdc"],
   },
   enablement: AssetEnablement.ENABLED,
   chain: ChainNetwork.Polygon,
   protocol: AssetProtocol.QUICKSWAP_POLYGON,
   details: {
     apiKey: 'DINO-USDC',
     harvestStyle: HarvestStyle.PASSIVE,
   },
   farm: {
     farmAddress: '0x20b2a3fc7b13ca0ccf7af81a68a14cb3116e8749',
     farmNickname: 'pSLPDinoEth',
     farmDepositTokenName: 'pSLPDinoEth'
   }
 }
 JAR_DEFINITIONS.push(JAR_QUICK_DINO_ETH);


 export const JAR_QUICKmiMATICUSDC_old: JarDefinition =
 {
  type: AssetType.JAR,
   id: 'polyJar 5a_old (inactive)',
   contract: '0xf12BB9dcD40201b5A110e11E38DcddF4d11E6f83',
   depositToken: {
      addr: '0x160532d2536175d65c03b97b0630a9802c274dad',
      name: 'QUICK MAI/USDC',
      link: 'https://quickswap.exchange/#/add/0xa3Fa99A148fA48D14Ed51d610c367C61876997F1/0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      components: ["musdc", "mimatic"],
   },
   enablement: AssetEnablement.PERMANENTLY_DISABLED,
   chain: ChainNetwork.Polygon,
   protocol: AssetProtocol.QUICKSWAP_POLYGON,
   details: {
     apiKey: undefined,
     harvestStyle: HarvestStyle.PASSIVE,
   },
   farm: {
     farmAddress: '0x20b2a3fc7b13ca0ccf7af81a68a14cb3116e8749',
     farmNickname: 'pQLP MAI (old)',
     farmDepositTokenName: 'pQLP MAI (old)'
   }
 }
 JAR_DEFINITIONS.push(JAR_QUICKmiMATICUSDC_old);
 
 
 export const JAR_QUICK_MIMATIC_USDC: JarDefinition =
 {
  type: AssetType.JAR,
   id: 'polyJar 5a',
   contract: '0x74dC9cdCa9a96Fd0B7900e6eb953d1EA8567c3Ce',
   depositToken: {
      addr: '0x160532d2536175d65c03b97b0630a9802c274dad',
      name: 'QUICK MAI/USDC',
      link: 'https://quickswap.exchange/#/add/0xa3Fa99A148fA48D14Ed51d610c367C61876997F1/0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      components: ["musdc", "mimatic"],
   },
   enablement: AssetEnablement.ENABLED,
   chain: ChainNetwork.Polygon,
   protocol: AssetProtocol.QUICKSWAP_POLYGON,
   details: {
     apiKey: 'QLP-MIMATIC',
     harvestStyle: HarvestStyle.PASSIVE,
   },
   farm: {
     farmAddress: '0x20b2a3fc7b13ca0ccf7af81a68a14cb3116e8749',
     farmNickname: 'pQLP MAI',
     farmDepositTokenName: 'pQLP MAI'
   }
 }
 JAR_DEFINITIONS.push(JAR_QUICK_MIMATIC_USDC);

 export const JAR_QUICK_QI_MIMATIC: JarDefinition =
 {
  type: AssetType.JAR,
   id: 'polyJar 5b',
   contract: '0xd06a56c864C80e4cC76A2eF778183104BF0c848d',
   depositToken: {
      addr: '0x7AfcF11F3e2f01e71B7Cc6b8B5e707E42e6Ea397',
      name: 'QUICK QI/MIMATIC',
      link: 'https://quickswap.exchange/#/add/0xa3Fa99A148fA48D14Ed51d610c367C61876997F1/0x580A84C73811E1839F75d86d75d88cCa0c241fF4',
      components: ["qi", "mimatic"],
   },
   enablement: AssetEnablement.ENABLED,
   chain: ChainNetwork.Polygon,
   protocol: AssetProtocol.QUICKSWAP_POLYGON,
   details: {
     apiKey: 'QLP-QI',
     harvestStyle: HarvestStyle.PASSIVE,
     controller: "0x7749fbd85f388f4a186b1d339c2fd270dd0aa647",
   },
   farm: {
     farmAddress: '0x20b2a3fc7b13ca0ccf7af81a68a14cb3116e8749',
     farmNickname: 'qQLP QI',
     farmDepositTokenName: 'pQLP QI'
   }
 }
 JAR_DEFINITIONS.push(JAR_QUICK_QI_MIMATIC);

 export const JAR_IRON3USD: JarDefinition =
 {
  type: AssetType.JAR,
   id: 'polyJar 6a',
   contract: '0xE484Ed97E19F6B649E78db0F37D173C392F7A1D9',
   depositToken: {
      addr: '0xb4d09ff3dA7f9e9A2BA029cb0A81A989fd7B8f17',
      name: 'Iron3USD',
      link: 'https://app.iron.finance/swap/pools/is3usd/deposit',
      components: ["usdc", "usdt", "dai"],
   },
   enablement: AssetEnablement.ENABLED,
   chain: ChainNetwork.Polygon,
   protocol: AssetProtocol.IRON_POLYGON,
   details: {
     apiKey: 'IS3USD',
     harvestStyle: HarvestStyle.PASSIVE,
   },
   farm: {
     farmAddress: '0x20b2a3fc7b13ca0ccf7af81a68a14cb3116e8749',
     farmNickname: 'pIS3USD',
     farmDepositTokenName: 'pIS3USD'
   }
 }
 JAR_DEFINITIONS.push(JAR_IRON3USD);


// External Assets
export const EXTERNAL_DEFINITIONS : ExternalAssetDefinition[] = []

export const ASSET_PBAMM: ExternalAssetDefinition =
{
 type: AssetType.EXTERNAL,
  id: 'B.Protocol BAMM',
  contract: '0x54bC9113f1f55cdBDf221daf798dc73614f6D972',
  depositToken: {
     addr: '0x5f98805a4e8be255a32880fdec7f6728c6568ba0',
     name: 'LUSD',
     link: 'https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x5f98805A4E8be255a32880FDeC7F6728C6568bA0',
  },
  enablement: AssetEnablement.ENABLED,
  chain: ChainNetwork.Ethereum,
  protocol: AssetProtocol.BPROTOCOL,
  details: {
    apiKey: 'PBAMM',
    includeInTvl: false
  }
}
EXTERNAL_DEFINITIONS.push(ASSET_PBAMM);

export const ALL_ASSETS : PickleAsset[] = [].concat(JAR_DEFINITIONS).concat(STANDALONE_FARM_DEFINITIONS).concat(EXTERNAL_DEFINITIONS);
