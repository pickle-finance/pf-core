import {
  AssetDocumentationDefinition,
  OBTAIN_KEY_TWOTOKEN_POOL,
  OBTAIN_KEY_MULTITOKEN_POOL,
  OBTAIN_KEY_ZAPPER,
  RISK_MAINTAIN_PEG,
  RISK_SMART_CONTRACT,
  SOCIAL_KEY_DISCORD,
  SOCIAL_KEY_TELEGRAM,
  SOCIAL_KEY_TWITTER,
  OBTAIN_KEY_ONETOKEN_POOL,
  RISK_PROTOCOL,
} from "./documentationInterfaces";

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
      { key: OBTAIN_KEY_MULTITOKEN_POOL,
          properties: {
            tokens: "USDC, USDT, DAI, sUSD",
            poolName: "sUSD",
            poolUrl: "https://www.curve.fi/susdv2/deposit",
          } 
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
  }, {
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
      { key: OBTAIN_KEY_MULTITOKEN_POOL,
          properties: {
            tokens: "renBTC, wBTC",
            poolName: "renBTC",
            poolUrl: "https://www.curve.fi/ren/deposit",
          } 
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
      { key: RISK_MAINTAIN_PEG, properties: { token: "renBTC", target: "1 BTC" } },
      { key: RISK_MAINTAIN_PEG, properties: { token: "wBTC", target: "1 BTC" } },
    ],
  }, {
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
      { key: OBTAIN_KEY_MULTITOKEN_POOL,
          properties: {
            tokens: "USDC, USDT, DAI",
            poolName: "3pool",
            poolUrl: "https://www.curve.fi/3pool/deposit",
          } 
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
  }, {
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
      { key: OBTAIN_KEY_MULTITOKEN_POOL,
          properties: {
            tokens: "ETH, stETH",
            poolName: "stETH",
            poolUrl: "https://www.curve.fi/steth/deposit",
          } 
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
      { key: RISK_MAINTAIN_PEG, properties: { token: "stETH", target: "1 ETH" } },
    ],
  }, {
    apiKey: "ALETH",
    social: [
      {
        key: SOCIAL_KEY_DISCORD,
        properties: { url: "https://discord.gg/zAd6dzgwaj" },
      },
    ],
    obtain: [
      { key: OBTAIN_KEY_MULTITOKEN_POOL,
          properties: {
            tokens: "ETH, alETH",
            poolName: "alETH",
            poolUrl: "https://saddle.exchange/#/pools/aleth/deposit",
          } 
      },
    ],
    risks: [
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Saddle" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Alchemix" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
      { key: RISK_MAINTAIN_PEG, properties: { token: "alETH", target: "1 ETH" } },
    ],
  }, {
    apiKey: "LQTY",
    social: [
      {
        key: SOCIAL_KEY_DISCORD,
        properties: { url: "https://discord.gg/2up5U32" },
      },
    ],
    obtain: [
      { key: OBTAIN_KEY_MULTITOKEN_POOL,
          properties: {
            tokens: "LQTY",
            poolName: "Pickle jar 0.98l",
            poolUrl: "https://app.pickle.finance/farms",
          } 
      },
    ],
    risks: [
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Liquity" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
    ],
  }, {
    apiKey: "SLP-DAI",
    social: [
      {
        key: SOCIAL_KEY_DISCORD,
        properties: { url: "https://discord.gg/CD2YdZzb7Z" },
      },
    ],
    obtain: [
      { key: OBTAIN_KEY_TWOTOKEN_POOL}, 
      { 
        key: OBTAIN_KEY_ZAPPER,
        properties: {
          poolName: "ETH/DAI",
          poolUrl: "https://zapper.fi/invest?appId=sushiswap&contractAddress=0xc3d03e4f041fd4cd388c549ee2a29a9e5075882f&modal=pool-deposit",
        }
      }
    ],
    risks: [
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Sushiswap" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
      { key: RISK_MAINTAIN_PEG, properties: { token: "DAI", target: "$1" } },
    ],
  }, {
    apiKey: "SLP-USDC",
    social: [
      {
        key: SOCIAL_KEY_DISCORD,
        properties: { url: "https://discord.gg/CD2YdZzb7Z" },
      },
    ],
    obtain: [
      { key: OBTAIN_KEY_TWOTOKEN_POOL}, 
      { 
        key: OBTAIN_KEY_ZAPPER,
        properties: {
          poolName: "ETH/USDC",
          poolUrl: "https://zapper.fi/invest?appId=sushiswap&contractAddress=0x397ff1542f962076d0bfe58ea045ffa2d347aca0&modal=pool-deposit",
        }
      }
    ],
    risks: [
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Sushiswap" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
      { key: RISK_MAINTAIN_PEG, properties: { token: "USDC", target: "$1" } },
    ],
  }, {
    apiKey: "SLP-USDT",
    social: [
      {
        key: SOCIAL_KEY_DISCORD,
        properties: { url: "https://discord.gg/CD2YdZzb7Z" },
      },
    ],
    obtain: [
      { key: OBTAIN_KEY_TWOTOKEN_POOL}, 
      { 
        key: OBTAIN_KEY_ZAPPER,
        properties: {
          poolName: "ETH/USDT",
          poolUrl: "https://zapper.fi/invest?appId=sushiswap&contractAddress=0x06da0fd433c1a5d7a4faa01111c044910a184553&modal=pool-deposit",
        }
      }
    ],
    risks: [
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Sushiswap" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
      { key: RISK_MAINTAIN_PEG, properties: { token: "USDT", target: "$1" } },
    ],
  }, {
    apiKey: "SLP-WBTC",
    social: [
      {
        key: SOCIAL_KEY_DISCORD,
        properties: { url: "https://discord.gg/CD2YdZzb7Z" },
      },
    ],
    obtain: [
      { key: OBTAIN_KEY_TWOTOKEN_POOL}, 
      { 
        key: OBTAIN_KEY_ZAPPER,
        properties: {
          poolName: "ETH/WBTC",
          poolUrl: "https://zapper.fi/invest?appId=sushiswap&contractAddress=0xceff51756c56ceffca006cd410b03ffc46dd3a58&modal=pool-deposit",
        }
      }
    ],
    risks: [
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Sushiswap" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
      { key: RISK_MAINTAIN_PEG, properties: { token: "WBTC", target: "1 BTC" } },
    ],
  }, {
    apiKey: "SLP-YFI",
    social: [
      {
        key: SOCIAL_KEY_DISCORD,
        properties: { url: "https://discord.gg/CD2YdZzb7Z" },
      },
    ],
    obtain: [
      { key: OBTAIN_KEY_TWOTOKEN_POOL}, 
      { 
        key: OBTAIN_KEY_ZAPPER,
        properties: {
          poolName: "ETH/YFI",
          poolUrl: "https://zapper.fi/invest?appId=sushiswap&contractAddress=0x088ee5007c98a9677165d78dd2109ae4a3d04d0c&modal=pool-deposit",
        }
      }
    ],
    risks: [
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Sushiswap" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
    ],
  }, {
    apiKey: "FOX-ETH",
    social: [
      {
        key: SOCIAL_KEY_DISCORD,
        properties: { url: "https://discordapp.com/invite/dVVkMhb" },
      },
      {
        key: SOCIAL_KEY_TELEGRAM,
        properties: { url: "https://t.me/shapeshiftofficial" },
      }
    ],
    obtain: [
      { key: OBTAIN_KEY_TWOTOKEN_POOL}, 
      { 
        key: OBTAIN_KEY_ZAPPER,
        properties: {
          poolName: "ETH/FOX",
          poolUrl: "https://zapper.fi/invest?appId=uniswap-v2&contractAddress=0x470e8de2ebaef52014a47cb5e6af86884947f08c&modal=pool-deposit",
        }
      }
    ],
    risks: [
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Uniswap" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
    ],
  }, {
    apiKey: "MIR-UST",
    social: [
      {
        key: SOCIAL_KEY_DISCORD,
        properties: { url: "https://discord.gg/KYC22sngFn" },
      },
      {
        key: SOCIAL_KEY_TELEGRAM,
        properties: { url: "https://t.me/mirror_protocol" },
      }
    ],
    obtain: [
      { key: OBTAIN_KEY_TWOTOKEN_POOL}, 
      { 
        key: OBTAIN_KEY_ZAPPER,
        properties: {
          poolName: "UST/MIR",
          poolUrl: "https://zapper.fi/invest?appId=uniswap-v2&contractAddress=0x87da823b6fc8eb8575a235a824690fda94674c88&modal=pool-deposit",
        }
      }
    ],
    risks: [
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Uniswap" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Mirror" } },
      { key: RISK_MAINTAIN_PEG, properties: { token: "UST", target: "$1" } },
    ],
  }, {
    apiKey: "MTSLA-UST",
    social: [
      {
        key: SOCIAL_KEY_DISCORD,
        properties: { url: "https://discord.gg/KYC22sngFn" },
      },
      {
        key: SOCIAL_KEY_TELEGRAM,
        properties: { url: "https://t.me/mirror_protocol" },
      }
    ],
    obtain: [
      { key: OBTAIN_KEY_TWOTOKEN_POOL}, 
      { 
        key: OBTAIN_KEY_ZAPPER,
        properties: {
          poolName: "UST/MTSLA",
          poolUrl: "https://zapper.fi/invest?appId=uniswap-v2&contractAddress=0x5233349957586a8207c52693a959483f9aeaa50c&modal=pool-deposit",
        }
      }
    ],
    risks: [
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Uniswap" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Mirror" } },
      { key: RISK_MAINTAIN_PEG, properties: { token: "UST", target: "$1" } },
      { key: RISK_MAINTAIN_PEG, properties: { token: "MTSLA", target: "TSLA stock" } },
    ],
  }, {
    apiKey: "MAAPL-UST",
    social: [
      {
        key: SOCIAL_KEY_DISCORD,
        properties: { url: "https://discord.gg/KYC22sngFn" },
      },
      {
        key: SOCIAL_KEY_TELEGRAM,
        properties: { url: "https://t.me/mirror_protocol" },
      }
    ],
    obtain: [
      { key: OBTAIN_KEY_TWOTOKEN_POOL}, 
      { 
        key: OBTAIN_KEY_ZAPPER,
        properties: {
          poolName: "UST/MAAPL",
          poolUrl: "https://zapper.fi/invest?appId=uniswap-v2&contractAddress=0xb022e08adc8ba2de6ba4fecb59c6d502f66e953b&modal=pool-deposit",
        }
      }
    ],
    risks: [
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Uniswap" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Mirror" } },
      { key: RISK_MAINTAIN_PEG, properties: { token: "UST", target: "$1" } },
      { key: RISK_MAINTAIN_PEG, properties: { token: "MAAPL", target: "AAPL stock" } },
    ],
  }, {
    apiKey: "MIM3CRV",
    social: [
      {
        key: SOCIAL_KEY_DISCORD,
        properties: { url: "https://discord.gg/uAwvZfs9qU" },
      },
      {
        key: SOCIAL_KEY_TELEGRAM,
        properties: { url: "https://t.me/convexEthChat" },
      }
    ],
    obtain: [
      { 
        key: OBTAIN_KEY_MULTITOKEN_POOL,
        properties: {
          tokens: "USDC/USDT/DAI/MIM",
          poolName: "MIM",
          poolUrl: "https://www.curve.fi/susdv2/deposit",
        }
      }, 
      { 
        key: OBTAIN_KEY_ZAPPER,
        properties: {
          poolName: "MIM",
          poolUrl: "https://zapper.fi/invest?appId=curve&contractAddress=0x5a6a4d54456819380173272a5e8e9b9904bdf41b&modal=pool-deposit",
        }
      }
    ],
    risks: [
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Curve" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Abracadabra" } },
      { key: RISK_MAINTAIN_PEG, properties: { token: "USDC", target: "$1" } },
      { key: RISK_MAINTAIN_PEG, properties: { token: "USDT", target: "$1" } },
      { key: RISK_MAINTAIN_PEG, properties: { token: "DAI", target: "$1" } },
    ],
  }, {
    apiKey: "SPELL-ETH",
    social: [
      {
        key: SOCIAL_KEY_DISCORD,
        properties: { url: "https://discord.com/invite/wcsUNxYrFM" },
      },
      {
        key: SOCIAL_KEY_TWITTER,
        properties: { url: "https://twitter.com/MIM_Spell" },
      }
    ],
    obtain: [
      { key: OBTAIN_KEY_TWOTOKEN_POOL}, 
      { 
        key: OBTAIN_KEY_ZAPPER,
        properties: {
          poolName: "ETH/SPELL",
          poolUrl: "https://zapper.fi/invest?appId=sushiswap&contractAddress=0xb5de0c3753b6e1b4dba616db82767f17513e6d4e&modal=pool-deposit",
        }
      }
    ],
    risks: [
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Sushiswap" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
    ],
  }, {
    apiKey: "MIM-ETH",
    social: [
      {
        key: SOCIAL_KEY_DISCORD,
        properties: { url: "https://discord.com/invite/wcsUNxYrFM" },
      },
      {
        key: SOCIAL_KEY_TWITTER,
        properties: { url: "https://twitter.com/MIM_Spell" },
      }
    ],
    obtain: [
      { key: OBTAIN_KEY_TWOTOKEN_POOL}, 
      { 
        key: OBTAIN_KEY_ZAPPER,
        properties: {
          poolName: "ETH/MIM",
          poolUrl: "https://zapper.fi/invest?appId=sushiswap&contractAddress=0x07d5695a24904cc1b6e3bd57cc7780b90618e3c4&modal=pool-deposit",
        }
      }
    ],
    risks: [
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Sushiswap" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
    ],
  }, {
    apiKey: "MQQQ-UST",
    social: [
      {
        key: SOCIAL_KEY_DISCORD,
        properties: { url: "https://discord.gg/KYC22sngFn" },
      },
      {
        key: SOCIAL_KEY_TELEGRAM,
        properties: { url: "https://t.me/mirror_protocol" },
      }
    ],
    obtain: [
      { key: OBTAIN_KEY_TWOTOKEN_POOL}, 
      { 
        key: OBTAIN_KEY_ZAPPER,
        properties: {
          poolName: "UST/MQQQ",
          poolUrl: "https://zapper.fi/invest?appId=uniswap-v2&contractAddress=0x9e3b47b861b451879d43bba404c35bdfb99f0a6c&modal=pool-deposit",
        }
      }
    ],
    risks: [
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Uniswap" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Mirror" } },
      { key: RISK_MAINTAIN_PEG, properties: { token: "UST", target: "$1" } },
      { key: RISK_MAINTAIN_PEG, properties: { token: "MQQQ", target: "QQQ stock" } },
    ],
  }, {
    apiKey: "MSLV-UST",
    social: [
      {
        key: SOCIAL_KEY_DISCORD,
        properties: { url: "https://discord.gg/KYC22sngFn" },
      },
      {
        key: SOCIAL_KEY_TELEGRAM,
        properties: { url: "https://t.me/mirror_protocol" },
      }
    ],
    obtain: [
      { key: OBTAIN_KEY_TWOTOKEN_POOL}, 
      { 
        key: OBTAIN_KEY_ZAPPER,
        properties: {
          poolName: "UST/MSLV",
          poolUrl: "https://zapper.fi/invest?appId=uniswap-v2&contractAddress=0x860425be6ad1345dc7a3e287facbf32b18bc4fae&modal=pool-deposit",
        }
      }
    ],
    risks: [
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Uniswap" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Mirror" } },
      { key: RISK_MAINTAIN_PEG, properties: { token: "UST", target: "$1" } },
      { key: RISK_MAINTAIN_PEG, properties: { token: "MSLV", target: "SLV stock" } },
    ],
  }, {
    apiKey: "MBABA-UST",
    social: [
      {
        key: SOCIAL_KEY_DISCORD,
        properties: { url: "https://discord.gg/KYC22sngFn" },
      },
      {
        key: SOCIAL_KEY_TELEGRAM,
        properties: { url: "https://t.me/mirror_protocol" },
      }
    ],
    obtain: [
      { key: OBTAIN_KEY_TWOTOKEN_POOL}, 
      { 
        key: OBTAIN_KEY_ZAPPER,
        properties: {
          poolName: "UST/MBABA",
          poolUrl: "https://zapper.fi/invest?appId=uniswap-v2&contractAddress=0x676ce85f66adb8d7b8323aeefe17087a3b8cb363&modal=pool-deposit",
        }
      }
    ],
    risks: [
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Uniswap" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Mirror" } },
      { key: RISK_MAINTAIN_PEG, properties: { token: "UST", target: "$1" } },
      { key: RISK_MAINTAIN_PEG, properties: { token: "MBABA", target: "BABA stock" } },
    ],
  }, {
    apiKey: "SUSHI-ETH",
    social: [
      {
        key: SOCIAL_KEY_DISCORD,
        properties: { url: "https://discord.gg/CD2YdZzb7Z" },
      },
    ],
    obtain: [
      { key: OBTAIN_KEY_TWOTOKEN_POOL}, 
      { 
        key: OBTAIN_KEY_ZAPPER,
        properties: {
          poolName: "ETH/SUSHI",
          poolUrl: "https://zapper.fi/invest?appId=sushiswap&contractAddress=0x795065dcc9f64b5614c407a6efdc400da6221fb0&modal=pool-deposit",
        }
      }
    ],
    risks: [
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Sushiswap" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
    ],
  }, {
    apiKey: "FEI-TRIBE",
    social: [
      {
        key: SOCIAL_KEY_DISCORD,
        properties: { url: "https://discord.com/invite/2prhYdQ5jP" },
      }, {
        key: SOCIAL_KEY_TELEGRAM,
        properties: { url: "https://t.me/feiprotocol" },
      }
    ],
    obtain: [
      { key: OBTAIN_KEY_TWOTOKEN_POOL}, 
      { 
        key: OBTAIN_KEY_ZAPPER,
        properties: {
          poolName: "FEI/TRIBE",
          poolUrl: "https://zapper.fi/invest?appId=uniswap-v2&contractAddress=0x9928e4046d7c6513326ccea028cd3e7a91c7590a&modal=pool-deposit",
        }
      }
    ],
    risks: [
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Sushiswap" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "FEI" } },
      { key: RISK_MAINTAIN_PEG, properties: { protocol: "FEI", target: "$1" } },
    ],
  }, {
    apiKey: "ALCX-ETH",
    social: [
      {
        key: SOCIAL_KEY_DISCORD,
        properties: { url: "https://discord.gg/zAd6dzgwaj" },
      },
    ],
    obtain: [
      { key: OBTAIN_KEY_TWOTOKEN_POOL}, 
      { 
        key: OBTAIN_KEY_ZAPPER,
        properties: {
          poolName: "ETH/ALCX",
          poolUrl: "https://zapper.fi/invest?appId=sushiswap&contractAddress=0xc3f279090a47e80990fe3a9c30d24cb117ef91a8&modal=pool-deposit",
        }
      }
    ],
    risks: [
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Uniswap" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Alchemix" } },
    ],
  }, {
    apiKey: "yvBOOST-ETH",
    social: [
      {
        key: SOCIAL_KEY_DISCORD,
        properties: { url: "https://discord.com/invite/6PNv2nF" },
      }, {
        key: SOCIAL_KEY_TELEGRAM,
        properties: { url: "https://t.me/yearnfinance" },
      }
    ],
    obtain: [
      { key: OBTAIN_KEY_TWOTOKEN_POOL}, 
      { 
        key: OBTAIN_KEY_ZAPPER,
        properties: {
          poolName: "yveCRV",
          poolUrl: "https://yearn.finance/vaults",
        }
      }, { 
        key: OBTAIN_KEY_ZAPPER,
        properties: {
          poolName: "ETH or CRV",
          poolUrl: "https://app.pickle.finance",
        }
      }, { 
        key: OBTAIN_KEY_ZAPPER,
        properties: {
          poolName: "ETH/YVBOOST",
          poolUrl: "https://zapper.fi/invest?appId=yearn&contractAddress=0x9d409a0a012cfba9b15f6d4b36ac57a46966ab9a&modal=pool-deposit",
        }
      }, 
    ],
    risks: [
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Sushiswap" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Curve" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Yearn" } },
    ],
  }, {
    apiKey: "USDC",
    social: [
      {
        key: SOCIAL_KEY_DISCORD,
        properties: { url: "https://discord.com/invite/6PNv2nF" },
      }, {
        key: SOCIAL_KEY_TELEGRAM,
        properties: { url: "https://t.me/yearnfinance"}
      }
    ],
    obtain: [
      { 
        key: OBTAIN_KEY_ONETOKEN_POOL,
        properties: {
          token: "USDC", 
          protocol: "Yearn",
          link: "",
          poolName: "pJar Y-1"
        }
      },
    ],
    risks: [
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Yearn" } },
    ],
  }, {
    apiKey: "lusdCRV",
    social: [
      {
        key: SOCIAL_KEY_DISCORD,
        properties: { url: "https://discord.com/invite/6PNv2nF" },
      }, {
        key: SOCIAL_KEY_TELEGRAM,
        properties: { url: "https://t.me/yearnfinance"}
      }
    ],
    obtain: [
      { 
        key: OBTAIN_KEY_ONETOKEN_POOL,
        properties: {
          token: "crvLUSD", 
          protocol: "Yearn",
          link: "https://curve.fi/lusd/deposit",
          poolName: "pJar Y-2"
        }
      },
    ],
    risks: [
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Yearn" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Curve" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Liquity" } },
      { key: RISK_MAINTAIN_PEG, properties: {protocol: "LUSD", target: "$1" } },
    ],
  }, {
    apiKey: "FRAXCRV",
    social: [
      {
        key: SOCIAL_KEY_DISCORD,
        properties: { url: "https://discord.com/invite/6PNv2nF" },
      }, {
        key: SOCIAL_KEY_TELEGRAM,
        properties: { url: "https://t.me/yearnfinance"}
      }
    ],
    obtain: [
      { 
        key: OBTAIN_KEY_ONETOKEN_POOL,
        properties: {
          token: "fraxCRV", 
          protocol: "Yearn",
          link: "https://curve.fi/frax/deposit",
          poolName: "pJar Y-3"
        }
      },
    ],
    risks: [
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Yearn" } },
    ],
  }, {
    apiKey: "IBCRV",
    social: [
      {
        key: SOCIAL_KEY_DISCORD,
        properties: { url: "https://discord.com/invite/6PNv2nF" },
      }, {
        key: SOCIAL_KEY_TELEGRAM,
        properties: { url: "https://t.me/yearnfinance"}
      }
    ],
    obtain: [
      { 
        key: OBTAIN_KEY_ONETOKEN_POOL,
        properties: {
          token: "ibCRV", 
          protocol: "Yearn",
          link: "https://curve.fi/ib/deposit",
          poolName: "pJar Y-4"
        }
      },
    ],
    risks: [
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Yearn" } },
    ],
  }, {
    apiKey: "COMETH-USDC",
    social: [
      {
        key: SOCIAL_KEY_DISCORD,
        properties: { url: "https://discord.gg/mcXn2R2QRx" },
      }, {
        key: SOCIAL_KEY_TELEGRAM,
        properties: { url: "https://t.me/cometh_io"}
      }
    ],
    obtain: [
      { key: OBTAIN_KEY_TWOTOKEN_POOL},
    ],
    risks: [
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Cometh" } },
      { key: RISK_PROTOCOL, properties: { protocol: "Polygon" } },
      { key: RISK_MAINTAIN_PEG, properties: { protocol: "USDC", target: "$1" } },
    ],
  }, {
    apiKey: "COMETH-PICKLE",
    social: [
      {
        key: SOCIAL_KEY_DISCORD,
        properties: { url: "https://discord.gg/mcXn2R2QRx" },
      }, {
        key: SOCIAL_KEY_TELEGRAM,
        properties: { url: "https://t.me/cometh_io"}
      }
    ],
    obtain: [
      { key: OBTAIN_KEY_TWOTOKEN_POOL},
    ],
    risks: [
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Cometh" } },
      { key: RISK_PROTOCOL, properties: { protocol: "Polygon" } },
    ],
  }, {
    apiKey: "COMETH-MATIC",
    social: [
      {
        key: SOCIAL_KEY_DISCORD,
        properties: { url: "https://discord.gg/mcXn2R2QRx" },
      }, {
        key: SOCIAL_KEY_TELEGRAM,
        properties: { url: "https://t.me/cometh_io"}
      }
    ],
    obtain: [
      { key: OBTAIN_KEY_TWOTOKEN_POOL },
    ],
    risks: [
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Cometh" } },
      { key: RISK_PROTOCOL, properties: { protocol: "Polygon" } },
    ],
  }, {
    apiKey: "DAI",
    obtain: [
      { 
        key: OBTAIN_KEY_ONETOKEN_POOL,
        properties: {
          token: "DAI", 
          protocol: "Polygon",
          link: "",
          poolName: "polyJar 2a"
        }
      },
    ],
    risks: [
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "AAVE" } },
      { key: RISK_PROTOCOL, properties: { protocol: "Polygon" } },
    ],
  }, {
    apiKey: "am3CRV",
    social: [
      {
        key: SOCIAL_KEY_DISCORD,
        properties: { url: "https://discord.gg/mcXn2R2QRx" },
      }, {
        key: SOCIAL_KEY_TELEGRAM,
        properties: { url: "https://t.me/cometh_io"}
      }
    ],
    obtain: [
      { 
        key: OBTAIN_KEY_MULTITOKEN_POOL,
        properties: {
          tokens: "DAI, USDC, USDT", 
          poolName: "am3CRV",
          poolUrl: "https://polygon.curve.fi/aave/deposit",
        }
      },
    ],
    risks: [
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Curve" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "AAVE" } },
      { key: RISK_PROTOCOL, properties: { protocol: "Polygon" } },
      { key: RISK_MAINTAIN_PEG, properties: { protocol: "DAI", target: "$1" } },
      { key: RISK_MAINTAIN_PEG, properties: { protocol: "USDC", target: "$1" } },
      { key: RISK_MAINTAIN_PEG, properties: { protocol: "USDT", target: "$1" } },
    ],
  }, {
    apiKey: "PSLP-USDT",
    social: [
      {
        key: SOCIAL_KEY_DISCORD,
        properties: { url: "https://discord.com/invite/6PNv2nF" },
      }, {
        key: SOCIAL_KEY_TELEGRAM,
        properties: { url: "https://t.me/yearnfinance"}
      }
    ],
    obtain: [
      { key: OBTAIN_KEY_TWOTOKEN_POOL }
    ],
    risks: [
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Sushi" } },
      { key: RISK_PROTOCOL, properties: { protocol: "Polygon" } },
      { key: RISK_MAINTAIN_PEG, properties: { protocol: "USDT", target: "$1" } },
    ],
  }, {
    apiKey: "PSLP-MATIC",
    social: [
      {
        key: SOCIAL_KEY_DISCORD,
        properties: { url: "https://discord.com/invite/6PNv2nF" },
      }, {
        key: SOCIAL_KEY_TELEGRAM,
        properties: { url: "https://t.me/yearnfinance"}
      }
    ],
    obtain: [
      { key: OBTAIN_KEY_TWOTOKEN_POOL }
    ],
    risks: [
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Sushi" } },
      { key: RISK_PROTOCOL, properties: { protocol: "Polygon" } },
    ],
  }, {
    apiKey: "PSLP-PICKLE",
    social: [
      {
        key: SOCIAL_KEY_DISCORD,
        properties: { url: "https://discord.com/invite/6PNv2nF" },
      }, {
        key: SOCIAL_KEY_TELEGRAM,
        properties: { url: "https://t.me/yearnfinance"}
      }
    ],
    obtain: [
      { key: OBTAIN_KEY_TWOTOKEN_POOL }
    ],
    risks: [
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Sushi" } },
      { key: RISK_PROTOCOL, properties: { protocol: "Polygon" } },
    ],
  }, {
    apiKey: "QLP-MIMATIC",
    social: [
      {
        key: SOCIAL_KEY_DISCORD,
        properties: { url: "https://discord.gg/mQq55j65xJ" },
      }, {
        key: SOCIAL_KEY_TELEGRAM,
        properties: { url: "https://t.me/QiDaoProtocol"}
      }
    ],
    obtain: [
      { key: OBTAIN_KEY_TWOTOKEN_POOL }
    ],
    risks: [
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Quickswap" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Qi Dao" } },
      { key: RISK_PROTOCOL, properties: { protocol: "Polygon" } },
    ],
  }, {
    apiKey: "QLP-QI",
    social: [
      {
        key: SOCIAL_KEY_DISCORD,
        properties: { url: "https://discord.gg/mQq55j65xJ" },
      }, {
        key: SOCIAL_KEY_TELEGRAM,
        properties: { url: "https://t.me/QiDaoProtocol"}
      }
    ],
    obtain: [
      { key: OBTAIN_KEY_TWOTOKEN_POOL }
    ],
    risks: [
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Quickswap" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Qi Dao" } },
      { key: RISK_PROTOCOL, properties: { protocol: "Polygon" } },
    ],
  }, {
    apiKey: "IS3UD",
    social: [
      {
        key: SOCIAL_KEY_DISCORD,
        properties: { url: "https://discord.com/invite/RtA37hgGrK" },
      }, {
        key: SOCIAL_KEY_TELEGRAM,
        properties: { url: "https://t.me/QiDaoProtocol"}
      }
    ],
    obtain: [
      { 
        key: OBTAIN_KEY_MULTITOKEN_POOL,
        properties: {
          tokens: "USDC, USDT, DAI",
          poolName: "IS3USD",
          poolUrl: "https://app.iron.finance/swap/pools/is3usd/deposit"
        } }
    ],
    risks: [
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Iron Finance" } },
      { key: RISK_PROTOCOL, properties: { protocol: "Polygon" } },
      { key: RISK_MAINTAIN_PEG, properties: { protocol: "DAI", target: "$1" } },
      { key: RISK_MAINTAIN_PEG, properties: { protocol: "USDC", target: "$1" } },
      { key: RISK_MAINTAIN_PEG, properties: { protocol: "USDT", target: "$1" } },
    ],
  }, {
    apiKey: "DINO-USDC",
    social: [
      {
        key: SOCIAL_KEY_DISCORD,
        properties: { url: "https://discord.gg/MMcNJJQy4y" },
      }, {
        key: SOCIAL_KEY_TELEGRAM,
        properties: { url: "https://t.me/DinoSwapOfficial"}
      }
    ],
    obtain: [
      { key: OBTAIN_KEY_TWOTOKEN_POOL }
    ],
    risks: [
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Sushi" } },
      { key: RISK_PROTOCOL, properties: { protocol: "Polygon" } },
      { key: RISK_MAINTAIN_PEG, properties: { protocol: "USDC", target: "$1" } },
    ],
  }, {
    apiKey: "DINO-WETH",
    social: [
      {
        key: SOCIAL_KEY_DISCORD,
        properties: { url: "https://discord.gg/MMcNJJQy4y" },
      }, {
        key: SOCIAL_KEY_TELEGRAM,
        properties: { url: "https://t.me/DinoSwapOfficial"}
      }
    ],
    obtain: [
      { key: OBTAIN_KEY_TWOTOKEN_POOL }
    ],
    risks: [
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
      { key: RISK_SMART_CONTRACT, properties: { protocol: "Sushi" } },
      { key: RISK_PROTOCOL, properties: { protocol: "Polygon" } },
    ],
  },
]