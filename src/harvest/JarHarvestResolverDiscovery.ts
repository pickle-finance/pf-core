import { AlchemixHarvestResolver } from "./AlchemixHarvestResolver";
import { CurveHarvestResolver } from "./CurveHarvestResolver";
import { CvxHarvestResolver } from "./CvxHarvestResolver";
import { JarHarvestResolver } from "./JarHarvestResolver";
import { LqtyHarvestResolver } from "./LqtyHarvestResolver";
import { MithHarvestResolver } from "./MithHarvestResolver";
import { SaddleD4HarvestResolver } from "./SaddleD4HarvestResolver";
import { StandardHarvestResolver } from "./StandardHarvestResolver";
import { SushiHarvestResolver } from "./SushiHarvestResolver";
import { YearnHarvestResolver } from "./YearnHarvestResolver";
import { UniHarvestResolver } from "./UniHarvestResolver";
import { JAR_UNIV2_MAAPL_UST, JAR_UNIV2_MBABA_UST, JAR_UNIV2_MIR_UST, JAR_UNIV2_MQQQ_UST, JAR_UNIV2_MSLV_UST, JAR_UNIV2_MTSLA_UST, JAR_UNIV2_ETH_DAI, JAR_UNIV2_ETH_USDC, JAR_UNIV2_ETH_USDT, JAR_UNIV2_ETH_WBTC, JAR_SUSHI_ETH_DAI, JAR_SUSHI_ETH, JAR_SUSHI_ETH_USDC, JAR_SUSHI_ETH_USDT, JAR_SUSHI_ETH_WBTC, JAR_SUSHI_ETH_YVECRV, JAR_SUSHI_ETH_YFI, JAR_SUSHI_ETH_YVBOOST, JAR_SUSHI_MIC_USDT, JAR_SUSHI_MIS_USDT, JAR_UNIV2_FEI_TRIBE, JAR_UNIV2_LUSD_ETH, JAR_SUSHI_ETH_ALCX, JAR_SUSHI_CVX_ETH, JAR_LQTY, JAR_SADDLE_D4 } from "../model/JarsAndFarms";
import { JarDefinition } from "../model/PickleModelJson";

export class JarHarvestResolverDiscovery {
    findHarvestResolver(definition: JarDefinition) : JarHarvestResolver {
        if( definition.protocol === 'curve') {
            return new CurveHarvestResolver();
        }

        if( definition.protocol === 'yearn' ) {
            return new YearnHarvestResolver();
        }

        if (isUniswapJar(definition.contract)) {
            return new UniHarvestResolver();
        }

        /*
        if (isBasisJar(definition.contract)) {
            return new StandardHarvestResolver("bas");
        }
        */

        if (isMithJar(definition.contract)) {
            return new MithHarvestResolver();
        }
        
        if (isSushiJar(definition.contract)) {
            return new SushiHarvestResolver();
        }

        if (isFeiJar(definition.contract)) {
            return new StandardHarvestResolver("tribe");
        }

        if (isAlchemixJar(definition.contract)) {
            return new AlchemixHarvestResolver();
        }
        
        if (isCvxJar(definition.contract)) {
            return new CvxHarvestResolver();
        }

        if (isLiquityJar(definition.contract)) {
            return new StandardHarvestResolver("lqty");
        }

        if (isLqtyJar(definition.contract)) {
            return new LqtyHarvestResolver();
        }

        if( isMirrorJar(definition.contract)) {
            return new StandardHarvestResolver("mir");
        }

        if( isSaddleD4Jar(definition.contract)) {
            return new SaddleD4HarvestResolver();
        }
        // TODO - alusd maybe?
        
        return undefined;
    }
  }
/*
export const isalUSDJar = (jarAddress) => {
    return jarAddress.toLowerCase() === JAR_UNIV2_FEI_TRIBE.contract.toLowerCase();
};
*/

function addressInJars (jarAddressLowerCase: string, arr: JarDefinition[]) : boolean {
    for( let i = 0; i < arr.length; i++ ) {
        if( arr[i].contract.toLowerCase() === jarAddressLowerCase )
            return true;
    }
    return false;
}


const isMirrorJar = (jarAddress) => {
    return addressInJars(jarAddress.toLowerCase(), [
        JAR_UNIV2_MAAPL_UST, JAR_UNIV2_MBABA_UST, JAR_UNIV2_MIR_UST,
        JAR_UNIV2_MQQQ_UST, JAR_UNIV2_MSLV_UST, JAR_UNIV2_MTSLA_UST
    ]);
};


const isUniswapJar = (jarAddress) => {
    return addressInJars(jarAddress.toLowerCase(), [
        JAR_UNIV2_ETH_DAI, JAR_UNIV2_ETH_USDC, 
        JAR_UNIV2_ETH_USDT, JAR_UNIV2_ETH_WBTC
    ]);
};

const isSushiJar = (jarAddress) => {
    return addressInJars(jarAddress.toLowerCase(), [
        JAR_SUSHI_ETH_DAI, JAR_SUSHI_ETH,
        JAR_SUSHI_ETH_USDC, JAR_SUSHI_ETH_USDT,
        JAR_SUSHI_ETH_WBTC, JAR_SUSHI_ETH_YVECRV, JAR_SUSHI_ETH_YFI, 
        JAR_SUSHI_ETH_YVBOOST
    ]);
};

/*
const isBasisJar = (jarAddress) => {
  return false;
};
*/

const isMithJar = (jarAddress) => {
    const lc = jarAddress.toLowerCase();
    return lc === JAR_SUSHI_MIC_USDT.contract.toLowerCase() || 
            lc === JAR_SUSHI_MIS_USDT.contract.toLowerCase();
};

const isFeiJar = (jarAddress) => {
    return jarAddress.toLowerCase() === JAR_UNIV2_FEI_TRIBE.contract.toLowerCase();
};

const isLiquityJar = (jarAddress) => {
    return jarAddress.toLowerCase() === JAR_UNIV2_LUSD_ETH.contract.toLowerCase();
};

const isAlchemixJar = (jarAddress) => {
    return jarAddress.toLowerCase() === JAR_SUSHI_ETH_ALCX.contract.toLowerCase();
};

const isCvxJar = (jarAddress) => {
    return jarAddress.toLowerCase() === JAR_SUSHI_CVX_ETH.contract.toLowerCase();
};

const isLqtyJar = (jarAddress) => {
    return jarAddress.toLowerCase() === JAR_LQTY.contract.toLowerCase();
  };

const isSaddleD4Jar = (jarAddress) => {
    return jarAddress.toLowerCase() === JAR_SADDLE_D4.contract.toLowerCase();
  };
