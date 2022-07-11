export enum ErrorSeverity {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR_1 = 3,
    ERROR_2 = 4,
    ERROR_3 = 5,
    ERROR_4 = 6,
    ERROR_5 = 7,
    SEVERE = 8,
    CRITICAL = 9,
    OHFUCK = 10,
}
export enum PickleProduct {
    PFCORE = 100,
    API = 200,
    API_JOB = 300,
    TSUKE = 400,
    TSUKEPFCORE = 500,
}

export interface LocalError {
    errorCode: number;
    timestamp: number;
    chain: number;
    asset: string;
    failedCall: string;
    message: string;
    causeMessage: string;
    severity: ErrorSeverity;
}
export interface PlatformError extends LocalError {
    product: PickleProduct;
}

export interface ErrorLogger {
    logPlatformError(err: PlatformError): Promise<void>;
}

/*
100100 through 101300:  pickle model stuff
105000 - loadPlatformData
200100 - preloadRawGaugeData
200201 - getStableswapPriceAddress
200202 - getLivePairDataFromContracts

301000 - getHarvestableUSDComManImplementation
301101 - getHarvestableUSD
301102 - getProjectedAprStats
301105 - getProtocolApy
302000 - Errors for custom harvesting
305000 - utility function for jar behavior

*/