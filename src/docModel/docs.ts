import { AssetDocumentationDefinition, OBTAIN_KEY_MULTITOKEN_POOL_ALL, OBTAIN_KEY_MULTITOKEN_POOL_ANY, OBTAIN_KEY_ONETOKEN_JAR, OBTAIN_KEY_ONETOKEN_POOL, OBTAIN_KEY_TWOTOKEN_POOL, OBTAIN_KEY_ZAPPER, RISK_CHAIN, RISK_MAINTAIN_PEG, RISK_SMART_CONTRACT, SocialKeys, SOCIAL_KEY_DISCORD, SOCIAL_KEY_TELEGRAM} from "./DocsInterfaces";


export const ALL_JAR_DOCUMENTATION: AssetDocumentationDefinition[] = [
  {
    apiKey: "sCRV",
    social: [
      {
        key: SOCIAL_KEY_DISCORD,
        properties: { url: "https://discord.gg/9uEHakc" },
      },
      {
        key: SOCIAL_KEY_TELEGRAM,
        properties: { url: "https://t.me/curvefi" },
      },
    ],
    obtain: [
      {
        key: OBTAIN_KEY_MULTITOKEN_POOL_ANY,
        properties: {
          tokens: "USDC, USDT, DAI, sUSD",
          poolName: "sUSD",
          poolUrl: "https://www.curve.fi/susdv2/deposit",
        },
      },
      {
        key: OBTAIN_KEY_ZAPPER,
        properties: {
          poolName: "sUSD",
          poolUrl:
            "https://zapper.fi/invest?appId=curve&contractAddress=0xa5407eae9ba41422680e2e00537571bcc53efbfd&modal=pool-deposit",
        },
      },
    ],
    risks: [
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Curve" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Synthetix" } },
      { key: RISK_MAINTAIN_PEG, properties: { token: "USDC", target: "$1" } },
      { key: RISK_MAINTAIN_PEG, properties: { token: "USDT", target: "$1" } },
      { key: RISK_MAINTAIN_PEG, properties: { token: "DAI", target: "$1" } },
      { key: RISK_MAINTAIN_PEG, properties: { token: "sUSD", target: "$1" } },
    ],
  },
  {
    apiKey: "renBTCCRV",
    social: [
      {
        key: SOCIAL_KEY_DISCORD,
        properties: { url: "https://discord.gg/9uEHakc" },
      },
      {
        key: SOCIAL_KEY_TELEGRAM,
        properties: { url: "https://t.me/curvefi" },
      },
    ],
    obtain: [
      {
        key: OBTAIN_KEY_MULTITOKEN_POOL_ANY,
        properties: {
          tokens: "renBTC, wBTC",
          poolName: "renBTC",
          poolUrl: "https://www.curve.fi/ren/deposit",
        },
      },
      {
        key: OBTAIN_KEY_ZAPPER,
        properties: {
          poolName: "renBTC",
          poolUrl:
            "https://zapper.fi/invest?appId=curve&contractAddress=0x93054188d876f558f4a66b2ef1d97d16edf0895b&modal=pool-deposit",
        },
      },
    ],
    risks: [
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Curve" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
      {
        key: RISK_MAINTAIN_PEG,
        properties: { token: "renBTC", target: "1 BTC" },
      },
      {
        key: RISK_MAINTAIN_PEG,
        properties: { token: "wBTC", target: "1 BTC" },
      },
    ],
  },
  {
    apiKey: "3poolCRV",
    social: [
      {
        key: SOCIAL_KEY_DISCORD,
        properties: { url: "https://discord.gg/9uEHakc" },
      },
      {
        key: SOCIAL_KEY_TELEGRAM,
        properties: { url: "https://t.me/curvefi" },
      },
    ],
    obtain: [
      {
        key: OBTAIN_KEY_MULTITOKEN_POOL_ANY,
        properties: {
          tokens: "USDC, USDT, DAI",
          poolName: "3pool",
          poolUrl: "https://www.curve.fi/3pool/deposit",
        },
      },
      {
        key: OBTAIN_KEY_ZAPPER,
        properties: {
          poolName: "3pool",
          poolUrl:
            "https://zapper.fi/invest?appId=curve&contractAddress=0xbebc44782c7db0a1a60cb6fe97d0b483032ff1c7&modal=pool-deposit",
        },
      },
    ],
    risks: [
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Curve" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
      { key: RISK_MAINTAIN_PEG, properties: { token: "USDC", target: "$1" } },
      { key: RISK_MAINTAIN_PEG, properties: { token: "USDT", target: "$1" } },
      { key: RISK_MAINTAIN_PEG, properties: { token: "DAI", target: "$1" } },
    ],
  },
  {
    apiKey: "steCRV",
    social: [
      {
        key: SOCIAL_KEY_DISCORD,
        properties: { url: "https://discord.gg/uAwvZfs9qU" },
      },
      {
        key: SOCIAL_KEY_TELEGRAM,
        properties: { url: "https://t.me/convexEthChat" },
      },
    ],
    obtain: [
      {
        key: OBTAIN_KEY_MULTITOKEN_POOL_ANY,
        properties: {
          tokens: "ETH, stETH",
          poolName: "stETH",
          poolUrl: "https://www.curve.fi/steth/deposit",
        },
      },
      {
        key: OBTAIN_KEY_ZAPPER,
        properties: {
          poolName: "stETH",
          poolUrl:
            "https://zapper.fi/invest?appId=curve&contractAddress=0xdc24316b9ae028f1497c275eb9192a3ea0f67022&modal=pool-deposit",
        },
      },
    ],
    risks: [
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Curve" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "LIDO" } },
      {
        key: RISK_MAINTAIN_PEG,
        properties: { token: "stETH", target: "1 ETH" },
      },
    ],
  },
  {
    apiKey: "ALETH",
    social: [
      {
        key: SOCIAL_KEY_DISCORD,
        properties: { url: "https://discord.gg/zAd6dzgwaj" },
      },
    ],
    obtain: [
      {
        key: OBTAIN_KEY_MULTITOKEN_POOL_ANY,
        properties: {
          tokens: "ETH, alETH",
          poolName: "alETH",
          poolUrl: "https://saddle.exchange/#/pools/aleth/deposit",
        },
      },
    ],
    risks: [
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Saddle" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Alchemix" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
      {
        key: RISK_MAINTAIN_PEG,
        properties: { token: "alETH", target: "1 ETH" },
      },
    ],
  },
  {
    apiKey: "LQTY",
    social: [
      {
        key: SOCIAL_KEY_DISCORD,
        properties: { url: "https://discord.gg/2up5U32" },
      },
    ],
    obtain: [
      {
        key: OBTAIN_KEY_TWOTOKEN_POOL,
        properties: {
          tokens: "LQTY",
          poolName: "Pickle jar 0.98l",
          poolUrl: "https://app.pickle.finance/farms",
        },
      },
    ],
    risks: [
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Liquity" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
    ],
  },
  {
    apiKey: "MIR-UST",
    social: [
      {
        key: SOCIAL_KEY_DISCORD,
        properties: { url: "https://discord.gg/KYC22sngFn" },
      },
      {
        key: SOCIAL_KEY_TELEGRAM,
        properties: { url: "https://t.me/mirror_protocol" },
      },
    ],
    obtain: [
      { key: OBTAIN_KEY_TWOTOKEN_POOL },
      {
        key: OBTAIN_KEY_ZAPPER,
        properties: {
          poolName: "UST/MIR",
          poolUrl:
            "https://zapper.fi/invest?appId=uniswap-v2&contractAddress=0x87da823b6fc8eb8575a235a824690fda94674c88&modal=pool-deposit",
        },
      },
    ],
    risks: [
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Uniswap" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Mirror" } },
      { key: RISK_MAINTAIN_PEG, properties: { token: "UST", target: "$1" } },
    ],
  },
  {
    apiKey: "MTSLA-UST",
    social: [
      {
        key: SOCIAL_KEY_DISCORD,
        properties: { url: "https://discord.gg/KYC22sngFn" },
      },
      {
        key: SOCIAL_KEY_TELEGRAM,
        properties: { url: "https://t.me/mirror_protocol" },
      },
    ],
    obtain: [
      { key: OBTAIN_KEY_TWOTOKEN_POOL },
      {
        key: OBTAIN_KEY_ZAPPER,
        properties: {
          poolName: "UST/MTSLA",
          poolUrl:
            "https://zapper.fi/invest?appId=uniswap-v2&contractAddress=0x5233349957586a8207c52693a959483f9aeaa50c&modal=pool-deposit",
        },
      },
    ],
    risks: [
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Uniswap" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Mirror" } },
      { key: RISK_MAINTAIN_PEG, properties: { token: "UST", target: "$1" } },
      {
        key: RISK_MAINTAIN_PEG,
        properties: { token: "MTSLA", target: "TSLA stock" },
      },
    ],
  },
  {
    apiKey: "MAAPL-UST",
    social: [
      {
        key: SOCIAL_KEY_DISCORD,
        properties: { url: "https://discord.gg/KYC22sngFn" },
      },
      {
        key: SOCIAL_KEY_TELEGRAM,
        properties: { url: "https://t.me/mirror_protocol" },
      },
    ],
    obtain: [
      { key: OBTAIN_KEY_TWOTOKEN_POOL },
      {
        key: OBTAIN_KEY_ZAPPER,
        properties: {
          poolName: "UST/MAAPL",
          poolUrl:
            "https://zapper.fi/invest?appId=uniswap-v2&contractAddress=0xb022e08adc8ba2de6ba4fecb59c6d502f66e953b&modal=pool-deposit",
        },
      },
    ],
    risks: [
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Uniswap" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Mirror" } },
      { key: RISK_MAINTAIN_PEG, properties: { token: "UST", target: "$1" } },
      {
        key: RISK_MAINTAIN_PEG,
        properties: { token: "MAAPL", target: "AAPL stock" },
      },
    ],
  },
  {
    apiKey: "MIM3CRV",
    social: [
      {
        key: SOCIAL_KEY_DISCORD,
        properties: { url: "https://discord.gg/uAwvZfs9qU" },
      },
      {
        key: SOCIAL_KEY_TELEGRAM,
        properties: { url: "https://t.me/convexEthChat" },
      },
    ],
    obtain: [
      {
        key: OBTAIN_KEY_MULTITOKEN_POOL_ANY,
        properties: {
          tokens: "USDC/USDT/DAI/MIM",
          poolName: "MIM",
          poolUrl: "https://www.curve.fi/susdv2/deposit",
        },
      },
      {
        key: OBTAIN_KEY_ZAPPER,
        properties: {
          poolName: "MIM",
          poolUrl:
            "https://zapper.fi/invest?appId=curve&contractAddress=0x5a6a4d54456819380173272a5e8e9b9904bdf41b&modal=pool-deposit",
        },
      },
    ],
    risks: [
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Curve" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Abracadabra" } },
      { key: RISK_MAINTAIN_PEG, properties: { token: "USDC", target: "$1" } },
      { key: RISK_MAINTAIN_PEG, properties: { token: "USDT", target: "$1" } },
      { key: RISK_MAINTAIN_PEG, properties: { token: "DAI", target: "$1" } },
    ],
  },
  {
    apiKey: "MQQQ-UST",
    social: [
      {
        key: SOCIAL_KEY_DISCORD,
        properties: { url: "https://discord.gg/KYC22sngFn" },
      },
      {
        key: SOCIAL_KEY_TELEGRAM,
        properties: { url: "https://t.me/mirror_protocol" },
      },
    ],
    obtain: [
      { key: OBTAIN_KEY_TWOTOKEN_POOL },
      {
        key: OBTAIN_KEY_ZAPPER,
        properties: {
          poolName: "UST/MQQQ",
          poolUrl:
            "https://zapper.fi/invest?appId=uniswap-v2&contractAddress=0x9e3b47b861b451879d43bba404c35bdfb99f0a6c&modal=pool-deposit",
        },
      },
    ],
    risks: [
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Uniswap" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Mirror" } },
      { key: RISK_MAINTAIN_PEG, properties: { token: "UST", target: "$1" } },
      {
        key: RISK_MAINTAIN_PEG,
        properties: { token: "MQQQ", target: "QQQ stock" },
      },
    ],
  },
  {
    apiKey: "MSLV-UST",
    social: [
      {
        key: SOCIAL_KEY_DISCORD,
        properties: { url: "https://discord.gg/KYC22sngFn" },
      },
      {
        key: SOCIAL_KEY_TELEGRAM,
        properties: { url: "https://t.me/mirror_protocol" },
      },
    ],
    obtain: [
      { key: OBTAIN_KEY_TWOTOKEN_POOL },
      {
        key: OBTAIN_KEY_ZAPPER,
        properties: {
          poolName: "UST/MSLV",
          poolUrl:
            "https://zapper.fi/invest?appId=uniswap-v2&contractAddress=0x860425be6ad1345dc7a3e287facbf32b18bc4fae&modal=pool-deposit",
        },
      },
    ],
    risks: [
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Uniswap" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Mirror" } },
      { key: RISK_MAINTAIN_PEG, properties: { token: "UST", target: "$1" } },
      {
        key: RISK_MAINTAIN_PEG,
        properties: { token: "MSLV", target: "SLV stock" },
      },
    ],
  },
  {
    apiKey: "MBABA-UST",
    social: [
      {
        key: SOCIAL_KEY_DISCORD,
        properties: { url: "https://discord.gg/KYC22sngFn" },
      },
      {
        key: SOCIAL_KEY_TELEGRAM,
        properties: { url: "https://t.me/mirror_protocol" },
      },
    ],
    obtain: [
      { key: OBTAIN_KEY_TWOTOKEN_POOL },
      {
        key: OBTAIN_KEY_ZAPPER,
        properties: {
          poolName: "UST/MBABA",
          poolUrl:
            "https://zapper.fi/invest?appId=uniswap-v2&contractAddress=0x676ce85f66adb8d7b8323aeefe17087a3b8cb363&modal=pool-deposit",
        },
      },
    ],
    risks: [
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Uniswap" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Mirror" } },
      { key: RISK_MAINTAIN_PEG, properties: { token: "UST", target: "$1" } },
      {
        key: RISK_MAINTAIN_PEG,
        properties: { token: "MBABA", target: "BABA stock" },
      },
    ],
  },
  {
    apiKey: "FEI-TRIBE",
    social: [
      {
        key: SOCIAL_KEY_DISCORD,
        properties: { url: "https://discord.com/invite/2prhYdQ5jP" },
      },
      {
        key: SOCIAL_KEY_TELEGRAM,
        properties: { url: "https://t.me/feiprotocol" },
      },
    ],
    obtain: [
      { key: OBTAIN_KEY_TWOTOKEN_POOL },
      {
        key: OBTAIN_KEY_ZAPPER,
        properties: {
          poolName: "FEI/TRIBE",
          poolUrl:
            "https://zapper.fi/invest?appId=uniswap-v2&contractAddress=0x9928e4046d7c6513326ccea028cd3e7a91c7590a&modal=pool-deposit",
        },
      },
    ],
    risks: [
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Sushiswap" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "FEI" } },
      { key: RISK_MAINTAIN_PEG, properties: { token: "FEI", target: "$1" } },
    ],
  },
  {
    apiKey: "ALCX-ETH",
    social: [
      {
        key: SOCIAL_KEY_DISCORD,
        properties: { url: "https://discord.gg/zAd6dzgwaj" },
      },
    ],
    obtain: [
      { key: OBTAIN_KEY_TWOTOKEN_POOL },
      {
        key: OBTAIN_KEY_ZAPPER,
        properties: {
          poolName: "ETH/ALCX",
          poolUrl:
            "https://zapper.fi/invest?appId=sushiswap&contractAddress=0xc3f279090a47e80990fe3a9c30d24cb117ef91a8&modal=pool-deposit",
        },
      },
    ],
    risks: [
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Uniswap" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Alchemix" } },
    ],
  },
  {
    apiKey: "yvBOOST-ETH",
    social: [
      {
        key: SOCIAL_KEY_DISCORD,
        properties: { url: "https://discord.com/invite/6PNv2nF" },
      },
      {
        key: SOCIAL_KEY_TELEGRAM,
        properties: { url: "https://t.me/yearnfinance" },
      },
    ],
    obtain: [
      { key: OBTAIN_KEY_TWOTOKEN_POOL },
      {
        key: OBTAIN_KEY_ZAPPER,
        properties: {
          poolName: "yveCRV",
          poolUrl: "https://yearn.finance/vaults",
        },
      },
      {
        key: OBTAIN_KEY_ZAPPER,
        properties: {
          poolName: "ETH or CRV",
          poolUrl: "https://app.pickle.finance",
        },
      },
      {
        key: OBTAIN_KEY_ZAPPER,
        properties: {
          poolName: "ETH/YVBOOST",
          poolUrl:
            "https://zapper.fi/invest?appId=yearn&contractAddress=0x9d409a0a012cfba9b15f6d4b36ac57a46966ab9a&modal=pool-deposit",
        },
      },
    ],
    risks: [
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Sushiswap" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Curve" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Yearn" } },
    ],
  },
  {
    apiKey: "USDC",
    social: [
      {
        key: SOCIAL_KEY_DISCORD,
        properties: { url: "https://discord.com/invite/6PNv2nF" },
      },
      {
        key: SOCIAL_KEY_TELEGRAM,
        properties: { url: "https://t.me/yearnfinance" },
      },
    ],
    obtain: [
      {
        key: OBTAIN_KEY_ONETOKEN_POOL,
        properties: {
          token: "USDC",
          protocol: "Yearn",
          link: "",
          poolName: "pJar Y-1",
        },
      },
    ],
    risks: [
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Yearn" } },
    ],
  },
  {
    apiKey: "lusdCRV",
    social: [
      {
        key: SOCIAL_KEY_DISCORD,
        properties: { url: "https://discord.com/invite/6PNv2nF" },
      },
      {
        key: SOCIAL_KEY_TELEGRAM,
        properties: { url: "https://t.me/yearnfinance" },
      },
    ],
    obtain: [
      {
        key: OBTAIN_KEY_ONETOKEN_POOL,
        properties: {
          token: "crvLUSD",
          protocol: "Yearn",
          link: "https://curve.fi/lusd/deposit",
          poolName: "pJar Y-2",
        },
      },
    ],
    risks: [
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Yearn" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Curve" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Liquity" } },
      {
        key: RISK_MAINTAIN_PEG,
        properties: { protocol: "LUSD", target: "$1" },
      },
    ],
  },
  {
    apiKey: "FRAXCRV",
    social: [
      {
        key: SOCIAL_KEY_DISCORD,
        properties: { url: "https://discord.com/invite/6PNv2nF" },
      },
      {
        key: SOCIAL_KEY_TELEGRAM,
        properties: { url: "https://t.me/yearnfinance" },
      },
    ],
    obtain: [
      {
        key: OBTAIN_KEY_ONETOKEN_POOL,
        properties: {
          token: "fraxCRV",
          protocol: "Yearn",
          link: "https://curve.fi/frax/deposit",
          poolName: "pJar Y-3",
        },
      },
    ],
    risks: [
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Yearn" } },
    ],
  },
  {
    apiKey: "IBCRV",
    social: [
      {
        key: SOCIAL_KEY_DISCORD,
        properties: { url: "https://discord.com/invite/6PNv2nF" },
      },
      {
        key: SOCIAL_KEY_TELEGRAM,
        properties: { url: "https://t.me/yearnfinance" },
      },
    ],
    obtain: [
      {
        key: OBTAIN_KEY_ONETOKEN_POOL,
        properties: {
          token: "ibCRV",
          protocol: "Yearn",
          link: "https://curve.fi/ib/deposit",
          poolName: "pJar Y-4",
        },
      },
    ],
    risks: [
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Yearn" } },
    ],
  },
  {
    apiKey: "LOOKS",
    social: [
      {
        key: SocialKeys.SOCIAL_KEY_DISCORD_NAME,
        properties: { name: "LOOKSRARE", url: "https://discord.gg/looksrare" },
      },
      {
        key: SocialKeys.SOCIAL_KEY_TWITTER_NAME,
        properties: { name: "LOOKSRARE", url: "https://twitter.com/looksrarenft" },
      },
      {
        key: SocialKeys.SOCIAL_KEY_WEBSITE_NAME,
        properties: { name: "LOOKSRARE", url: "https://looksrare.org/"},
      },
    ],
    obtain: [
      {
        key: OBTAIN_KEY_ONETOKEN_POOL,
        properties: {
          token: "looks",
        },
      },
    ],
    risks: [
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "LooksRare" } },
    ],
  },  
  {
    apiKey: "saddled4",
    social: [
      {
        key: SocialKeys.SOCIAL_KEY_DISCORD_NAME,
        properties: { name: "Saddle", url: "https://discord.gg/saddle" },
      },
      {
        key: SocialKeys.SOCIAL_KEY_TWITTER_NAME,
        properties: { name: "Saddle", url: "https://twitter.com/saddlefinance" },
      },
      {
        key: SocialKeys.SOCIAL_KEY_WEBSITE_NAME,
        properties: { name: "Saddle", url: "https://saddle.finance/#/"},
      },
      {
        key: SocialKeys.SOCIAL_KEY_TELEGRAM_NAME,
        properties: { name: "Saddle", url: "https://t.me/saddle_finance"},
      },
    ],
    obtain: [
      {
        key: OBTAIN_KEY_MULTITOKEN_POOL_ALL,
        properties: {
          tokens: "alusd, fei, frax, and lusd",
          protocol: "Saddle Finance",
          link: "https://saddle.exchange/#/pools/d4/deposit",
          poolName: "D-4",
        },
      },
    ],
    risks: [
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Saddle" } },
      { key: RISK_MAINTAIN_PEG, properties: { token: "AlUSD", target: "$1" } },
      { key: RISK_MAINTAIN_PEG, properties: { token: "Fei", target: "$1" } },
      { key: RISK_MAINTAIN_PEG, properties: { token: "Frax", target: "$1" } },
      { key: RISK_MAINTAIN_PEG, properties: { token: "LUSD", target: "$1" } },
    ],
  },
  {
    apiKey: "DAI",
    obtain: [
      {
        key: OBTAIN_KEY_ONETOKEN_POOL,
        properties: {
          token: "DAI",
          protocol: "Polygon",
          link: "",
          poolName: "polyJar 2a",
        },
      },
    ],
    risks: [
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "AAVE" } },
      { key: RISK_CHAIN, properties: { protocol: "Polygon" } },
    ],
  },    
  {
    apiKey: "am3CRV",
    social: [
      {
        key: SOCIAL_KEY_DISCORD,
        properties: { url: "https://discord.gg/mcXn2R2QRx" },
      },
      {
        key: SOCIAL_KEY_TELEGRAM,
        properties: { url: "https://t.me/cometh_io" },
      },
    ],
    obtain: [
      {
        key: OBTAIN_KEY_MULTITOKEN_POOL_ANY,
        properties: {
          tokens: "DAI, USDC, USDT",
          poolName: "am3CRV",
          poolUrl: "https://polygon.curve.fi/aave/deposit",
        },
      },
    ],
    risks: [
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Curve" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "AAVE" } },
      { key: RISK_CHAIN, properties: { protocol: "Polygon" } },
      { key: RISK_MAINTAIN_PEG, properties: { token: "DAI", target: "$1" } },
      { key: RISK_MAINTAIN_PEG, properties: { token: "USDC", target: "$1" } },
      { key: RISK_MAINTAIN_PEG, properties: { token: "USDT", target: "$1" } },
    ],
  },
  {
    apiKey: "IS3USD",
    social: [
      {
        key: SOCIAL_KEY_DISCORD,
        properties: { url: "https://discord.com/invite/RtA37hgGrK" },
      },
      {
        key: SOCIAL_KEY_TELEGRAM,
        properties: { url: "https://t.me/QiDaoProtocol" },
      },
    ],
    obtain: [
      {
        key: OBTAIN_KEY_MULTITOKEN_POOL_ANY,
        properties: {
          tokens: "USDC, USDT, DAI",
          poolName: "IS3USD",
          poolUrl: "https://app.iron.finance/swap/pools/is3usd/deposit",
        },
      },
    ],
    risks: [
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Iron Finance" } },
      { key: RISK_CHAIN, properties: { protocol: "Polygon" } },
      { key: RISK_MAINTAIN_PEG, properties: { token: "DAI", target: "$1" } },
      { key: RISK_MAINTAIN_PEG, properties: { token: "USDC", target: "$1" } },
      { key: RISK_MAINTAIN_PEG, properties: { token: "USDT", target: "$1" } },
    ],
  },
  {
    apiKey: "Mim2CRV",
    social: [
      {
        key: SOCIAL_KEY_DISCORD,
        properties: { url: "https://discord.gg/uAwvZfs9qU" },
      },
      {
        key: SOCIAL_KEY_TELEGRAM,
        properties: { url: "https://t.me/convexEthChat" },
      },
    ],
    obtain: [
      {
        key: OBTAIN_KEY_MULTITOKEN_POOL_ANY,
        properties: {
          tokens: "USDC, USDT, MIM",
          poolName: "Mim2CRV",
          poolUrl: "https://arbitrum.curve.fi/factory/0/deposit",
        },
      },
    ],
    risks: [
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Curve" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Abracadabra" } },
      { key: RISK_CHAIN, properties: { protocol: "Arbitrum" } },
      { key: RISK_MAINTAIN_PEG, properties: { token: "USDC", target: "$1" } },
      { key: RISK_MAINTAIN_PEG, properties: { token: "USDT", target: "$1" } },
      { key: RISK_MAINTAIN_PEG, properties: { token: "MIM", target: "$1" } },
    ],
  },
  {
    apiKey: "PBAMM",
    social: [
      {
        key: SocialKeys.SOCIAL_KEY_DISCORD_NAME,
        properties: { name: "B.Protocol", url: "https://discord.gg/bJ4guuw" },
      },
      {
        key: SocialKeys.SOCIAL_KEY_TWITTER_NAME,
        properties: { name: "B.Protocol", url: "https://twitter.com/bprotocoleth" },
      },
      {
        key: SocialKeys.SOCIAL_KEY_WEBSITE_NAME,
        properties: { name: "B.Protocol", url: "https://www.bprotocol.org/"},
      },
    ],
    obtain: [
      {
        key: OBTAIN_KEY_ONETOKEN_JAR,
        properties: {
          token: "LUSD",
        },
      },
    ],
    risks: [
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "B.Protocol" } },
    ],
  },
];