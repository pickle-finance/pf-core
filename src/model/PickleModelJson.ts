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
// ADD_PROTOCOL
}

export const SWAP_PROTOCOLS: AssetProtocol[] = [
  AssetProtocol.SUSHISWAP,
  AssetProtocol.UNISWAP,
  AssetProtocol.COMETHSWAP,
  AssetProtocol.QUICKSWAP,
  AssetProtocol.DODOSWAP,
  AssetProtocol.CHERRYSWAP,
  AssetProtocol.BXH,
  AssetProtocol.JSWAP,
  AssetProtocol.SOLARSWAP,
  AssetProtocol.VVS,
  AssetProtocol.TRISOLARIS,
  AssetProtocol.NEARPAD,
  AssetProtocol.WANNASWAP,
  AssetProtocol.ROSE,
  AssetProtocol.AURORASWAP,
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
  componentAddresses?: string[];
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
