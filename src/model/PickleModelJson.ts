import { ChainNetwork } from "../chain/Chains";
import { ActiveJarHarvestStats, JarHarvestStats } from "../behavior/JarBehaviorResolver";

// TODO move these out i guess?
export enum AssetProtocol {
    UNISWAP = "uniswap",
    SUSHISWAP = "sushiswap",
    SUSHISWAP_POLYGON = "sushiswap_polygon",
    COMETHSWAP = "comethswap",
    QUICKSWAP_POLYGON = "quickswap_polygon",
    AAVE_POLYGON = "aave_polygon",
    IRON_POLYGON = "iron_polygon",
    YEARN = "yearn",
    SADDLE = "saddle",
    CURVE = "curve",
    COMPOUND = "compound",
    BPROTOCOL = "bprotocol",
    TOKENPRICE = "tokenprice"
}
export const SWAP_PROTOCOLS : AssetProtocol[] = [
    AssetProtocol.SUSHISWAP,
    AssetProtocol.SUSHISWAP_POLYGON,
    AssetProtocol.UNISWAP,
    AssetProtocol.COMETHSWAP,
    AssetProtocol.QUICKSWAP_POLYGON,
];



export enum AssetEnablement {
    DISABLED = 'disabled',
    PERMANENTLY_DISABLED = 'permanently_disabled',
    ENABLED = 'enabled',
    DEV = 'dev'
}


export enum HarvestStyle {
    ACTIVE = 'active',
    PASSIVE = 'passive'
}


export enum AssetType {
    JAR = 'jar',
    STANDALONE_FARM = 'standalone_farm',
    EXTERNAL = 'external'
}

export interface DepositToken {
    addr: string,
    name: string,
    link: string,
    decimals?: number,
    totalSupply?: number,
    components?: string[],
    componentTokens?: number[],
    price?: number
}

export interface PickleAsset {
    type: AssetType, 
    id: string,
    contract: string,
    depositToken: DepositToken,
    enablement: AssetEnablement,
    chain: ChainNetwork,
    protocol: string,
    aprStats?: AssetProjectedApr
}

export interface ExternalAssetDefinition extends PickleAsset {
    details: ExternalDetails,
    farm?: NestedFarm
}


export interface JarDefinition extends PickleAsset {
    details: JarDetails,
    farm?: NestedFarm,
}
export interface StandaloneFarmDefinition extends PickleAsset {
    details?: FarmDetails,
    farmNickname: string,
}

interface HistoricalAPY {
    oneDayApy?: number,
    threeDayApy?: number,
    sevenDayApy?: number,
    thirtyDayApy?: number
}

export interface JarDetails {
    apiKey: string,
    decimals?: number,
    harvestStyle: HarvestStyle
    controller?: string,
    strategyName?: string,
    strategyAddr?: string,
    ratio?: number,
    totalSupply?: number,
    harvestStats?: JarHarvestStats | ActiveJarHarvestStats,
    historicalApy?: HistoricalAPY,
}

export interface FarmDetails {
    allocShare?: number,
    tokenBalance?: number,
    valueBalance?: number,
    picklePerBlock?: number,
    picklePerDay?: number,
    farmApyComponents?: AssetAprComponent[],
    historicalApy?: HistoricalAPY,
}

export interface ExternalDetails {
    apiKey?: string,
    harvestStats?: JarHarvestStats | ActiveJarHarvestStats,
    includeInTvl?: boolean,
}

export interface NestedFarm {
    farmAddress: string,
    farmDepositTokenName: string,
    farmNickname: string,
    details?: FarmDetails,
}

export interface DillDetails {
    pickleLocked: number;
    totalDill: number;
    dillWeeks: DillWeek[]
}

export interface DillWeek {
    weeklyPickleAmount : number,
    totalPickleAmount : number,
    weeklyDillAmount : number,
    totalDillAmount : number,
    pickleDillRatio : number,
    picklePriceUsd : number,
    buybackUsd: number,
    isProjected: boolean,
    distributionTime: Date
}
export interface PlatformData {
    platformTVL: number,
    platformBlendedRate: number,
    harvestPending: number,
}
export interface PickleModelJson {
    assets: {
        jars: JarDefinition[],
        standaloneFarms: StandaloneFarmDefinition[],
        external: ExternalAssetDefinition[]
    },
    dill: DillDetails,
    prices: any,
    platform: PlatformData
}

export interface AssetProjectedApr {
    components: AssetAprComponent[];
    apr: number;
    apy: number;
}

export interface AssetAprComponent {
    name: string,
    apr: number,
    maxApr?: number,
    compoundable: boolean,
}