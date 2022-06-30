export enum ErrorSeverity {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR_1 = 3,
    ERROR_2 = 4,
    ERROR_3 = 5,
    ERROR_4 = 6,
    ERROR_5 = 7,
}
export enum PickleProduct {
    PFCORE = 0,
    API = 100,
    API_JOB = 200,
    TSUKE = 300,
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