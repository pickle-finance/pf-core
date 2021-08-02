import { Chain } from "../chain/ChainModel";
import { ActiveJarHarvestStats, JarHarvestStats } from "../harvest/JarHarvestResolver";

// TODO move these out i guess?
export const PROTOCOL_TYPE_UNISWAP = "uniswap";
export const PROTOCOL_TYPE_SUSHISWAP = "sushiswap";
export const PROTOCOL_TYPE_SUSHISWAP_POLYGON = "sushiswap_polygon";
export const PROTOCOL_TYPE_COMETHSWAP = "comethswap";
export const PROTOCOL_TYPE_QUICKSWAP_POLYGON = "quickswap_polygon";
export const PROTOCOL_TYPE_AAVE_POLYGON = "aave_polygon";
export const PROTOCOL_TYPE_YEARN = "yearn";
export const PROTOCOL_TYPE_SADDLE = "saddle";
export const PROTOCOL_TYPE_CURVE = "curve";
export const PROTOCOL_TYPE_COMPOUND = "compound";
export const PROTOCOL_TYPE_TOKENPRICE = "tokenprice"


export enum AssetEnablement {
    DISABLED = 1,
    ENABLED,
    DEV
}


export enum HarvestStyle {
    ACTIVE = 1,
    PASSIVE = 2
}
export interface AssetDefinition {
    id: string,
    contract: string,
    depositToken: string,
    depositTokenName: string,
    depositTokenLink: string,
    enablement: AssetEnablement,
    chain: Chain,
    protocol: string,
    // TODO add docs here
    //docs?: AssetDocumentation
}

export interface JarDefinition extends AssetDefinition {
    jarDetails: JarDetails,
    farmDetails: FarmDetails,
}

export interface JarDetails {
    apiKey: string,
    harvestStyle: HarvestStyle
    strategyName?: string,
    strategyAddr?: string,
    ratio?: number,
    harvestStats?: JarHarvestStats | ActiveJarHarvestStats
}

export interface FarmDetails {
    farmAddress: string,
    farmDepositTokenName: string,
    farmNickname: string,    
}

// tslint:disable-next-line:no-empty-interface
export interface StandaloneFarmDefinition extends AssetDefinition {
    farmNickname: string
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
    isProjected: boolean,
    distributionTime: Date
}

export interface PickleModelJson {
    jarsAndFarms: {
        jars: JarDefinition[],
        standaloneFarms: StandaloneFarmDefinition[],
    },
    dill: DillDetails,
    prices: any
}