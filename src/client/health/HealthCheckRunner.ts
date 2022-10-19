import { ethers, Signer } from "ethers";
import { ChainNetwork, Chains } from "../../chain/Chains";
import { ErrorSeverity, PlatformError } from "../../core/platform/PlatformInterfaces";
import { toError } from "../../model/PickleModel";
import { CommsMgrV2 } from "../../util/CommsMgrV2";
import { runFeeChecker } from "./FeeChecker";
import { runPermChecker } from "./PermChecker";

const oneHour = 1000 * 60 * 60;
const sixHour = oneHour * 6;
const oneDay = oneHour * 24;
const oneWeek = oneDay * 7;

export class HealthCheckRunner {
    private errors: PlatformError[] = [];
    private commsMgr2: CommsMgrV2 = new CommsMgrV2();
    private configuredChains: ChainNetwork[];

    constructor() {
        // Empty
    }
    
    getErrors(): PlatformError[] {
        return this.errors;
    }

    logPlatformError(err: PlatformError): void {
        this.errors.push(err);
    }

    async initCommsMgr(): Promise<void> {
        try {
          await this.commsMgr2.init(this.configuredChains);
        } catch( err ) {
          this.logPlatformError(toError(100110, undefined, "", "initCommsMgr",  `Unexpected Error`, ""+err, ErrorSeverity.CRITICAL));
        }
    }

    initializeChains(chains: Map<ChainNetwork, ethers.providers.Provider | Signer>): void {
        const allChains: ChainNetwork[] = Chains.list();
        Chains.globalInitialize(chains);
        this.setConfiguredChains(allChains);
    }
    
    setConfiguredChains(chains: ChainNetwork[]): void {
        this.configuredChains = chains;
    }
        
    async runHealthCheck(timeframe: number): Promise<PlatformError[]> {
        const ret: PlatformError[] = [];
        await this.initCommsMgr();
        if( timeframe >= oneWeek) {
            // TODO
        }
        if( timeframe >= oneDay ) {
            // TODO protect?
            ret.push(...(await runFeeChecker(this.commsMgr2)));
            ret.push(...(await runPermChecker(this.commsMgr2)));
        }
        if( timeframe >= sixHour) {
            // TODO
        }
        if( timeframe >= oneHour) {
            // TODO
        }
        await this.commsMgr2.stop()
        return ret;
    }
}