import { ChainNetwork, RawChain } from "../chain/Chains";
import {
  ActiveJarHarvestStats,
  JarHarvestStats,
} from "../behavior/JarBehaviorResolver";

// TODO move these out i guess?
export enum AssetProtocol {
  UNISWAP = "Uniswap V2",
  UNISWAP_V3 = "Uniswap V3",
  SUSHISWAP = "SushiSwap",
  COMETHSWAP = "ComethSwap",
  DODOSWAP = "DODO",
  QUICKSWAP = "QuickSwap",
  AAVE = "Aave",
  IRON = "IRON",
  YEARN = "Yearn",
  SADDLE = "Saddle",
  CURVE = "Curve",
  COMPOUND = "Compound",
  BPROTOCOL = "B.Protocol",
  LQTY = "Liquity",
  CHERRYSWAP = "CherrySwap",
  BXH = "BXH",
  JSWAP = "JSwap",
  SOLARSWAP = "SolarSwap",
  BALANCER = "Balancer",
  VVS = "VVS",
  TRISOLARIS = "Trisolaris",
  NEARPAD = "NearPad",
  WANNASWAP = "WannaSwap",
  ROSE = "rose",
  AURORASWAP = "auroraswap",
  TETHYS = "tethys",
  NETSWAP = "netswap",
  LOOKS = "LooksRare",
  STELLA = "StellaSwap",
  ZIPSWAP = "ZipSwap",
  BEAM = "Beamswap",
  FLARE = "Solarflare",
  FINN = "Finn"
  // ADD_PROTOCOL
}

export const SWAP_PROTOCOLS: SwapProtocol[] = [
  {
    protocol: AssetProtocol.SUSHISWAP,
    chain: ChainNetwork.Polygon,
    zappable: true,
    router: "0x93bcDc45f7e62f89a8e901DC4A0E2c6C427D9F25",
  },
  {
    protocol: AssetProtocol.SUSHISWAP,
    chain: ChainNetwork.Arbitrum,
    zappable: true,
    router: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
  },
  {
    protocol: AssetProtocol.SUSHISWAP,
    chain: ChainNetwork.Harmony,
    zappable: true,
    router: "one17qf8q2jlpe2qz5mze09zdgn0ey92sv4r323k20",
  },
  {
    protocol: AssetProtocol.UNISWAP,
    chain: ChainNetwork.Ethereum,
    zappable: true,
    router: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
  },
  {
    protocol: AssetProtocol.COMETHSWAP,
    chain: ChainNetwork.Polygon,
    zappable: false,
    router: "",
  },
  {
    protocol: AssetProtocol.QUICKSWAP,
    chain: ChainNetwork.Polygon,
    zappable: true,
    router: "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
  },
  {
    protocol: AssetProtocol.DODOSWAP,
    chain: ChainNetwork.Arbitrum,
    zappable: false,
    router: "",
  },
  {
    protocol: AssetProtocol.CHERRYSWAP,
    chain: ChainNetwork.OKEx,
    zappable: true,
    router: "0x865bfde337C8aFBffF144Ff4C29f9404EBb22b15",
  },
  {
    protocol: AssetProtocol.BXH,
    chain: ChainNetwork.OKEx,
    zappable: false,
    router: "",
  },
  {
    protocol: AssetProtocol.JSWAP,
    chain: ChainNetwork.OKEx,
    zappable: true,
    router: "0x069A306A638ac9d3a68a6BD8BE898774C073DCb3",
  },
  {
    protocol: AssetProtocol.SOLARSWAP,
    chain: ChainNetwork.Moonriver,
    zappable: false,
    router: "",
  },
  {
    protocol: AssetProtocol.VVS,
    chain: ChainNetwork.Cronos,
    zappable: true,
    router: "0x145863Eb42Cf62847A6Ca784e6416C1682b1b2Ae",
  },
  {
    protocol: AssetProtocol.TRISOLARIS,
    chain: ChainNetwork.Aurora,
    zappable: true,
    router: "0x2CB45Edb4517d5947aFdE3BEAbF95A582506858B",
  },
  {
    protocol: AssetProtocol.NEARPAD,
    chain: ChainNetwork.Aurora,
    zappable: false,
    router: "",
  },
  {
    protocol: AssetProtocol.WANNASWAP,
    chain: ChainNetwork.Aurora,
    zappable: true,
    router: "0xa3a1eF5Ae6561572023363862e238aFA84C72ef5",
  },
  {
    protocol: AssetProtocol.ROSE,
    chain: ChainNetwork.Aurora,
    zappable: false,
    router: "",
  },
  {
    protocol: AssetProtocol.AURORASWAP,
    chain: ChainNetwork.Aurora,
    zappable: true,
    router: "0xA1B1742e9c32C7cAa9726d8204bD5715e3419861",
  },
  {
    protocol: AssetProtocol.NETSWAP,
    chain: ChainNetwork.Metis,
    zappable: true,
    router: "0x1E876cCe41B7b844FDe09E38Fa1cf00f213bFf56",
  },
  {
    protocol: AssetProtocol.TETHYS,
    chain: ChainNetwork.Metis,
    zappable: true,
    router: "0x81b9FA50D5f5155Ee17817C21702C3AE4780AD09",
  },
  {
    protocol: AssetProtocol.STELLA,
    chain: ChainNetwork.Moonbeam,
    zappable: true,
    router: "0xd0A01ec574D1fC6652eDF79cb2F880fd47D34Ab1",
  },
  {
    protocol: AssetProtocol.ZIPSWAP,
    chain: ChainNetwork.Optimism,
    zappable: true,
    router: "0xE6Df0BB08e5A97b40B21950a0A51b94c4DbA0Ff6",
  },
  {
    protocol: AssetProtocol.BEAM,
    chain: ChainNetwork.Moonbeam,
    zappable: true,
    router: "0x96b244391D98B62D19aE89b1A4dCcf0fc56970C7",
  },
  {
    protocol: AssetProtocol.FLARE,
    chain: ChainNetwork.Moonbeam,
    zappable: true,
    router: "0xd3B02Ff30c218c7f7756BA14bcA075Bf7C2C951e",
  },
  {
    protocol: AssetProtocol.FINN,
    chain: ChainNetwork.Moonriver,
    zappable: true,
    router: "0x2d4e873f9Ab279da9f1bb2c532d4F06f67755b77",
  },
  // ADD_PROTOCOL
];

export enum AssetEnablement {
  // A jar that is in development mode, should have pfcore run against it,
  // But should only be shown in the UI during local testing
  DEV = "dev",
  // An active jar
  ENABLED = "enabled",
  // To be used when a jar is being deprecated but should still appear in the main jar section
  WITHDRAW_ONLY = "withdraw_only",
  // To be used when a jar should be in a deprecated / closed down jar section
  DISABLED = "disabled",
  // To be used when a jar should be essentially ignored by core and UI
  PERMANENTLY_DISABLED = "permanently_disabled",
}

export enum HarvestStyle {
  ACTIVE = "active",
  PASSIVE = "passive",
  EARN_BEFORE_HARVEST = "earnBeforeHarvest",
  CUSTOM = "custom",
  NONE = "none",
}

export enum AssetType {
  JAR = "jar",
  STANDALONE_FARM = "standalone_farm",
  EXTERNAL = "external",
}

export interface SwapProtocol {
  chain: ChainNetwork;
  protocol: AssetProtocol;
  zappable: boolean;
  router: string;
}

export interface DepositTokenStyle {
  erc20: boolean;
}

export interface IExternalToken {
  chain: ChainNetwork;
  id: string;
  contractAddr: string;
  decimals: number;
}

export interface DepositToken {
  addr: string;
  name: string;
  link: string;
  decimals?: number;
  totalSupply?: number;
  components?: string[];
  componentTokens?: number[];
  componentAddresses?: string[];
  style?: DepositTokenStyle;
  price?: number;
  nativePaths?: {
    path: string[];
    target: string;
  }[]
}

export interface PickleAsset {
  type: AssetType;
  id: string;
  contract: string;
  depositToken: DepositToken;
  enablement: AssetEnablement;
  chain: ChainNetwork;
  protocol: AssetProtocol;
  swapProtocol?: SwapProtocol; 
  aprStats?: AssetProjectedApr;
  details: AssetDetails;
  tags?: string[];
}

export interface ExternalAssetDefinition extends PickleAsset {
  details: ExternalDetails;
  farm?: NestedFarm;
}

export interface JarDefinition extends PickleAsset {
  details: JarDetails;
  farm?: NestedFarm;
}
export interface StandaloneFarmDefinition extends PickleAsset {
  details: StandaloneFarmDetails;
  farmNickname: string;
}

export interface HistoricalYield {
  d1?: number;
  d3?: number;
  d7?: number;
  d30?: number;
}

export interface JarDetails extends AssetDetails {
  decimals?: number;
  harvestStyle: HarvestStyle;
  controller?: string;
  strategyName?: string;
  strategyAddr?: string;
  ratio?: number;
  totalSupply?: number;
  tokenBalance?: number;
  protocolApr?: HistoricalYield;
}

export interface AssetDetails {
  apiKey: string;
  harvestStats?: JarHarvestStats | ActiveJarHarvestStats;
}
export interface StandaloneFarmDetails extends AssetDetails, FarmDetails { }

export interface FarmDetails {
  allocShare?: number;
  tokenBalance?: number;
  valueBalance?: number;
  picklePerBlock?: number;
  picklePerDay?: number;
  farmApyComponents?: AssetAprComponent[];
  historicalApr?: HistoricalYield;
}

export interface ExternalDetails extends AssetDetails {
  includeInTvl?: boolean;
}

export interface NestedFarm {
  farmAddress: string;
  farmDepositTokenName: string;
  farmNickname: string;
  details?: FarmDetails;
}

export interface DillDetails {
  pickleLocked: number;
  totalDill: number;
  dillWeeks: DillWeek[];
}

export interface DillWeek {
  weeklyPickleAmount: number;
  totalPickleAmount: number;
  weeklyDillAmount: number;
  totalDillAmount: number;
  pickleDillRatio: number;
  picklePriceUsd: number;
  buybackUsd: number;
  isProjected: boolean;
  distributionTime: Date;
}
export interface PlatformData {
  platformTVL: number;
  platformBlendedRate: number;
  harvestPending: number;
}
export interface PickleModelJson {
  assets: {
    jars: JarDefinition[];
    standaloneFarms: StandaloneFarmDefinition[];
    external: ExternalAssetDefinition[];
  };
  dill: DillDetails;
  tokens: IExternalToken[];
  prices: { [key: string]: number };
  platform: PlatformData;
  chains: RawChain[];
  timestamp: number;
}

export interface AssetProjectedApr {
  components: AssetAprComponent[];
  apr: number;
  apy: number;
}

export interface AssetAprComponent {
  name: string;
  apr: number;
  maxApr?: number;
  compoundable: boolean;
}
