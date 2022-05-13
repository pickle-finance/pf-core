import { ChainNetwork, RawChain } from "../chain/Chains";
import {
  ActiveJarHarvestStats,
  JarHarvestStats,
} from "../behavior/JarBehaviorResolver";
import { UserData } from "../client/UserModel";

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
  CONVEX = "Convex",
  COMPOUND = "Compound",
  BPROTOCOL = "B.Protocol",
  LQTY = "Liquity",
  CHERRYSWAP = "CherrySwap",
  BXH = "BXH",
  JSWAP = "JSwap",
  SOLARBEAM = "Solarbeam",
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
  FINN = "Finn",
  SPOOKYSWAP = "Spookyswap",
  OXD = "0xDAO",
  BEETHOVENX = "BeethovenX",
  SPIRITSWAP = "SpiritSwap",
  LIQUID = "LiquidDriver",
  SOLID = "Solidly",
  SEX = "Solidex",
  TECTONIC = "Tectonic",
  STARGATE = "Stargate",
  HUMMUS = "Hummus",
  FRAX = "Frax",
  // ADD_PROTOCOL
}

export const XYK_SWAP_PROTOCOLS: XYKSwapProtocol[] = [
  {
    protocol: AssetProtocol.SUSHISWAP,
    chain: ChainNetwork.Polygon,
    zappable: true,
    pickleZapAddress: "0x5c5a1735fb50beff91b41c8d026243e8bb363b3a",
    router: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
  },
  {
    protocol: AssetProtocol.SUSHISWAP,
    chain: ChainNetwork.Arbitrum,
    zappable: true,
    pickleZapAddress: "0x8ee424b02da912c1c9491c6a33cafd5fcbb52edc",
    router: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
  },
  {
    protocol: AssetProtocol.SUSHISWAP,
    chain: ChainNetwork.Harmony,
    zappable: false,
    pickleZapAddress: "",
    router: "one17qf8q2jlpe2qz5mze09zdgn0ey92sv4r323k20",
  },
  {
    protocol: AssetProtocol.UNISWAP,
    chain: ChainNetwork.Ethereum,
    zappable: false,
    pickleZapAddress: "",
    router: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
  },
  {
    protocol: AssetProtocol.COMETHSWAP,
    chain: ChainNetwork.Polygon,
    zappable: true,
    pickleZapAddress: "0x5c5a1735fb50beff91b41c8d026243e8bb363b3a",
    router: "0x93bcDc45f7e62f89a8e901DC4A0E2c6C427D9F25",
  },
  {
    protocol: AssetProtocol.QUICKSWAP,
    chain: ChainNetwork.Polygon,
    zappable: true,
    pickleZapAddress: "0x5c5a1735fb50beff91b41c8d026243e8bb363b3a",
    router: "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
  },
  {
    protocol: AssetProtocol.DODOSWAP,
    chain: ChainNetwork.Arbitrum,
    zappable: false,
    pickleZapAddress: "",
    router: "",
  },
  {
    protocol: AssetProtocol.CHERRYSWAP,
    chain: ChainNetwork.OKEx,
    zappable: true,
    pickleZapAddress: "0x501ee199e02e6b548dc9cc265873a496b196b5a7",
    router: "0x865bfde337C8aFBffF144Ff4C29f9404EBb22b15",
  },
  {
    protocol: AssetProtocol.BXH,
    chain: ChainNetwork.OKEx,
    zappable: false,
    pickleZapAddress: "",
    router: "",
  },
  {
    protocol: AssetProtocol.JSWAP,
    chain: ChainNetwork.OKEx,
    zappable: true,
    pickleZapAddress: "0x501ee199e02e6b548dc9cc265873a496b196b5a7",
    router: "0x069A306A638ac9d3a68a6BD8BE898774C073DCb3",
  },
  {
    protocol: AssetProtocol.SOLARBEAM,
    chain: ChainNetwork.Moonriver,
    zappable: true,
    pickleZapAddress: "0x1ece15911ae3b61594306fcaa45566bfc59b6b23",
    router: "0xAA30eF758139ae4a7f798112902Bf6d65612045f",
  },
  {
    protocol: AssetProtocol.VVS,
    chain: ChainNetwork.Cronos,
    zappable: false,
    pickleZapAddress: "",
    router: "0x145863Eb42Cf62847A6Ca784e6416C1682b1b2Ae",
  },
  {
    protocol: AssetProtocol.TRISOLARIS,
    chain: ChainNetwork.Aurora,
    zappable: true,
    pickleZapAddress: "0xd3F5Aa703C4cd40E5A4fdf701229F6080e160a9E",
    router: "0x2CB45Edb4517d5947aFdE3BEAbF95A582506858B",
  },
  {
    protocol: AssetProtocol.NEARPAD,
    chain: ChainNetwork.Aurora,
    pickleZapAddress: "0xd3F5Aa703C4cd40E5A4fdf701229F6080e160a9E",
    zappable: true,
    router: "0xBaE0d7DFcd03C90EBCe003C58332c1346A72836A",
  },
  {
    protocol: AssetProtocol.WANNASWAP,
    chain: ChainNetwork.Aurora,
    zappable: true,
    pickleZapAddress: "0xd3F5Aa703C4cd40E5A4fdf701229F6080e160a9E",
    router: "0xa3a1eF5Ae6561572023363862e238aFA84C72ef5",
  },
  {
    protocol: AssetProtocol.ROSE,
    chain: ChainNetwork.Aurora,
    zappable: false,
    pickleZapAddress: "",
    router: "",
  },
  {
    protocol: AssetProtocol.AURORASWAP,
    chain: ChainNetwork.Aurora,
    zappable: true,
    pickleZapAddress: "0xd3F5Aa703C4cd40E5A4fdf701229F6080e160a9E",
    router: "0xA1B1742e9c32C7cAa9726d8204bD5715e3419861",
  },
  {
    protocol: AssetProtocol.NETSWAP,
    chain: ChainNetwork.Metis,
    zappable: true,
    pickleZapAddress: "0xaE95d192D545b71FE09fBdE2Bb2E5Cd069441E93",
    router: "0x1E876cCe41B7b844FDe09E38Fa1cf00f213bFf56",
  },
  {
    protocol: AssetProtocol.TETHYS,
    chain: ChainNetwork.Metis,
    zappable: true,
    pickleZapAddress: "0xaE95d192D545b71FE09fBdE2Bb2E5Cd069441E93",
    router: "0x81b9FA50D5f5155Ee17817C21702C3AE4780AD09",
  },
  {
    protocol: AssetProtocol.STELLA,
    chain: ChainNetwork.Moonbeam,
    zappable: true,
    pickleZapAddress: "0x3c42aa7d2a72be36e8009b53ebea769880cfda05",
    router: "0xd0A01ec574D1fC6652eDF79cb2F880fd47D34Ab1",
  },
  {
    protocol: AssetProtocol.ZIPSWAP,
    chain: ChainNetwork.Optimism,
    zappable: true,
    pickleZapAddress: "0xd60514536195573ce4a4a78ce5706e94e9ee7917",
    router: "0xE6Df0BB08e5A97b40B21950a0A51b94c4DbA0Ff6",
  },
  {
    protocol: AssetProtocol.BEAM,
    chain: ChainNetwork.Moonbeam,
    zappable: true,
    pickleZapAddress: "0x3c42aa7d2a72be36e8009b53ebea769880cfda05",
    router: "0x96b244391D98B62D19aE89b1A4dCcf0fc56970C7",
  },
  {
    protocol: AssetProtocol.FLARE,
    chain: ChainNetwork.Moonbeam,
    zappable: true,
    pickleZapAddress: "0x3c42aa7d2a72be36e8009b53ebea769880cfda05",
    router: "0xd3B02Ff30c218c7f7756BA14bcA075Bf7C2C951e",
  },
  {
    protocol: AssetProtocol.FINN,
    chain: ChainNetwork.Moonriver,
    zappable: true,
    pickleZapAddress: "0x1ece15911ae3b61594306fcaa45566bfc59b6b23",
    router: "0x2d4e873f9Ab279da9f1bb2c532d4F06f67755b77",
  },
  {
    protocol: AssetProtocol.SPOOKYSWAP,
    chain: ChainNetwork.Fantom,
    zappable: true,
    pickleZapAddress: "0x403FB2d31722B10aC4d3a05d13532Dd7cF6D2169",
    router: "0xF491e7B69E4244ad4002BC14e878a34207E38c29",
  },
  {
    protocol: AssetProtocol.SPIRITSWAP,
    chain: ChainNetwork.Fantom,
    zappable: true,
    pickleZapAddress: "0x403FB2d31722B10aC4d3a05d13532Dd7cF6D2169",
    router: "0x16327E3FbDaCA3bcF7E38F5Af2599D2DDc33aE52",
  },
  {
    // Note: zaps might be slightly different than uniswapv2
    protocol: AssetProtocol.SOLID,
    chain: ChainNetwork.Fantom,
    zappable: true,
    pickleZapAddress: "0xE9B3E153Ea1277bCD6214DA500126c67Dd9AD32e",
    router: "0xa38cd27185a464914D3046f0AB9d43356B34829D",
  },
  {
    protocol: AssetProtocol.OXD,
    chain: ChainNetwork.Fantom,
    zappable: true,
    pickleZapAddress: "0xE9B3E153Ea1277bCD6214DA500126c67Dd9AD32e",
    router: "0xa38cd27185a464914D3046f0AB9d43356B34829D",
  },
  {
    protocol: AssetProtocol.TECTONIC,
    chain: ChainNetwork.Cronos,
    zappable: false,
    pickleZapAddress: "",
    router: "",
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
  BRINERY = "brinery",
  STANDALONE_FARM = "standalone_farm",
  EXTERNAL = "external",
}

export interface XYKSwapProtocol {
  chain: ChainNetwork;
  protocol: AssetProtocol;
  zappable: boolean;
  pickleZapAddress: string;
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
  name?: string;
  price?: number;
}

export interface DepositToken {
  addr: string;
  name: string;
  link: string;
  decimals?: number;
  totalSupply?: number;
  components?: string[];
  componentTokens?: number[];
  style?: DepositTokenStyle;
  price?: number;
  nativePath?: {
    path: string[];
    target: string;
  };
}

export interface PickleAndUserModel {
  pickleModel: PickleModelJson;
  userModel: UserData;
}

export interface PickleAsset {
  type: AssetType;
  id: string;
  contract: string;
  startBlock: number;
  depositToken: DepositToken;
  enablement: AssetEnablement;
  chain: ChainNetwork;
  protocol: AssetProtocol;
  aprStats?: AssetProjectedApr;
  details: AssetDetails;
  docsKey?: string;
  tags?: string[];
}

export interface ExternalAssetDefinition extends PickleAsset {
  details: ExternalDetails;
  farm?: NestedFarm;
}

export interface JarDefinition extends PickleAsset {
  details: JarDetails;
  rewardTokens: string[];
  farm?: NestedFarm;
  stakingProtocol?: AssetProtocol;
}
export interface StandaloneFarmDefinition extends PickleAsset {
  details: StandaloneFarmDetails;
  farmNickname: string;
}

export interface BrineryDefinition extends PickleAsset {
  details: BrineryDetails;
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

export interface BrineryDetails extends AssetDetails {
  distributionAddr: string;
  strategyAddr: string;
  veAddr: string;
  lockerAddr: string;
  pickleLockedUnderlying?: number;
  totalVeSupply?: number;
  pickleVeBalance?: number;
  weeklyRewards?: number;
  distributorPending?: number;
  rewardToken: string;
}

export interface AssetDetails {
  apiKey: string;
  harvestStats?: JarHarvestStats | ActiveJarHarvestStats;
}
export interface StandaloneFarmDetails extends AssetDetails, FarmDetails {}

export interface FarmDetails {
  allocShare?: number;
  tokenBalance?: number;
  valueBalance?: number;
  picklePerBlock?: number;
  picklePerDay?: number;
  poolId?: number;
  farmApyComponents?: AssetAprComponent[];
  historicalApr?: HistoricalYield;
}

export interface FarmDetails {
  allocShare?: number;
  tokenBalance?: number;
  valueBalance?: number;
  picklePerBlock?: number;
  picklePerDay?: number;
  poolId?: number;
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
  totalPickle: String;
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
  picklePerBlock: string;
}
export interface PickleModelJson {
  assets: PickleModelAssets;
  dill: DillDetails;
  xykSwapProtocols: XYKSwapProtocol[];
  tokens: IExternalToken[];
  prices: { [key: string]: number };
  platform: PlatformData;
  chains: RawChain[];
  timestamp: number;
}

export interface PickleModelAssets {
  jars: JarDefinition[];
  standaloneFarms: StandaloneFarmDefinition[];
  brineries: BrineryDefinition[];
  external: ExternalAssetDefinition[];
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
