import { ChainNetwork } from "../chain/Chains";
import {
  ActiveJarHarvestStats,
  JarHarvestStats,
} from "../behavior/JarBehaviorResolver";

// TODO move these out i guess?
export enum AssetProtocol {
  UNISWAP = "uniswap",
  UNISWAP_V3 = "uniswap_v3",
  SUSHISWAP = "sushiswap",
  SUSHISWAP_POLYGON = "sushiswap polygon",
  SUSHISWAP_ARBITRUM = "sushiswap arbitrum",
  SUSHISWAP_HARMONY = "sushiswap harmony",
  COMETHSWAP = "comethswap",
  DODOSWAP = "dodoswap",
  QUICKSWAP_POLYGON = "quickswap polygon",
  AAVE_POLYGON = "aave polygon",
  IRON_POLYGON = "iron polygon",
  YEARN = "yearn",
  SADDLE = "saddle",
  CURVE = "curve",
  COMPOUND = "compound",
  BPROTOCOL = "bprotocol",
  TOKENPRICE = "tokenprice",
  CHERRYSWAP = "cherryswap",
  BXH = "bxh",
  JSWAP = "jswap",
  SOLARSWAP = "solarswap",
  BALANCER_ARBITRUM = "balancer",
  VVS_CRONOS = "vvs",
  TRISOLARIS = "trisolaris",
  NEARPAD = "nearpad",
  WANNASWAP = "wannaswap",
// ADD_PROTOCOL
}

export const SWAP_PROTOCOLS: AssetProtocol[] = [
  AssetProtocol.SUSHISWAP,
  AssetProtocol.SUSHISWAP_POLYGON,
  AssetProtocol.SUSHISWAP_ARBITRUM,
  AssetProtocol.SUSHISWAP_HARMONY,
  AssetProtocol.UNISWAP,
  AssetProtocol.COMETHSWAP,
  AssetProtocol.QUICKSWAP_POLYGON,
  AssetProtocol.DODOSWAP,
  AssetProtocol.CHERRYSWAP,
  AssetProtocol.BXH,
  AssetProtocol.JSWAP,
  AssetProtocol.SOLARSWAP,
  AssetProtocol.VVS_CRONOS,
  AssetProtocol.TRISOLARIS,
  AssetProtocol.NEARPAD,
  AssetProtocol.WANNASWAP,
// ADD_PROTOCOL
];

export enum AssetEnablement {
  DEV = "dev",
  ENABLED = "enabled",
  WITHDRAW_ONLY = "withdraw_only",
  DISABLED = "disabled",
  PERMANENTLY_DISABLED = "permanently_disabled",
}

export enum HarvestStyle {
  ACTIVE = "active",
  PASSIVE = "passive",
  EARN_BEFORE_HARVEST = "earnBeforeHarvest",
  CUSTOM = "custom",
  NONE = 'none'
}

export enum AssetType {
  JAR = "jar",
  STANDALONE_FARM = "standalone_farm",
  EXTERNAL = "external",
}

export interface DepositTokenStyle {
  erc20: boolean
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
  style?: DepositTokenStyle,
  price?: number;
}

export interface PickleAsset {
  type: AssetType;
  id: string;
  contract: string;
  depositToken: DepositToken;
  enablement: AssetEnablement;
  chain: ChainNetwork;
  protocol: AssetProtocol;
  aprStats?: AssetProjectedApr;
  details: AssetDetails;
  tags?: string;
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
export interface StandaloneFarmDetails extends AssetDetails, FarmDetails {}

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
  prices: {[key: string]: number};
  platform: PlatformData;
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
