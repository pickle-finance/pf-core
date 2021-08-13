import { BigNumber, ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { JAR_UNIV2_MAAPL_UST, JAR_UNIV2_MBABA_UST, JAR_UNIV2_MIR_UST, JAR_UNIV2_MQQQ_UST, JAR_UNIV2_MSLV_UST, JAR_UNIV2_MTSLA_UST, JAR_UNIV2_ETH_DAI, JAR_UNIV2_ETH_USDC, JAR_UNIV2_ETH_USDT, JAR_UNIV2_ETH_WBTC, JAR_SUSHI_ETH_DAI, JAR_SUSHI_ETH, JAR_SUSHI_ETH_USDC, JAR_SUSHI_ETH_USDT, JAR_SUSHI_ETH_WBTC, JAR_SUSHI_ETH_YVECRV, JAR_SUSHI_ETH_YFI, JAR_SUSHI_ETH_YVBOOST, JAR_SUSHI_MIC_USDT, JAR_SUSHI_MIS_USDT, JAR_UNIV2_FEI_TRIBE, JAR_UNIV2_LUSD_ETH, JAR_SUSHI_ETH_ALCX, JAR_SUSHI_CVX_ETH, JAR_LQTY, JAR_SADDLE_D4, JAR_3CRV, JAR_steCRV, JAR_renCRV, JAR_AAVEDAI, JAR_POLY_SUSHI_MATIC_ETH, JAR_POLY_SUSHI_ETH_USDT, JAR_COMETH_USDC_WETH, JAR_COMETH_PICKLE_MUST, JAR_COMETH_MATIC_MUST, JAR_QUICK_MIMATIC_USDC, JAR_fraxCRV, JAR_USDC, JAR_lusdCRV, JAR_AM3CRV, JAR_sCRV, JAR_MIM3CRV, JAR_SPELLETH, JAR_MIMETH, JAR_FOXETH, JAR_TRUETH, JAR_SUSHI_DINO_USDC } from "../model/JarsAndFarms";
import { JarDefinition } from "../model/PickleModelJson";
import { AlcxEth } from "./alcx-eth";
import { ComethMaticMust } from "./cometh-matic-must";
import { ComethPickleMust } from "./cometh-pickle-must";
import { ComethUsdcEth } from "./cometh-usdc-eth";
import { ThreeCrv } from "./crv-3crv";
import { RenBtcCRV } from "./crv-renbtc";
import { SteCrv } from "./crv-stecrv";
import { DaiJar } from "./dai";
import { DinoEth } from "./dino-eth";
import { DinoUsdc } from "./dino-usdc";
import { FeiTribe } from "./fei-tribe";
import { FoxEth } from "./fox-eth";
import { Is3Usd } from "./is3usd";
import { AbstractJarHarvestResolver, JarHarvestResolver } from "./JarHarvestResolver";
import { pLqty } from "./lqty";
import { MaaplUst } from "./maapl-ust";
import { MBabaUst } from "./mbaba-ust";
import { MimEth } from "./mim-eth";
import { Mim3Crv } from "./mim3crv";
import { MimaticQi } from "./mimatic-qi";
import { MimaticUSDC } from "./mimatic-usdc";
import { MirUst } from "./mir-ust";
import { MqqqUst } from "./mqqq-ust";
import { MslvUst } from "./mslv-ust";
import { MtslaUst } from "./mtsla-ust";
import { PThreeCrv } from "./p3crv";
import { PSlpMaticEth } from "./pslp-matic-eth";
import { PSlpUsdtEth } from "./pslp-usdt-eth";
import { SaddleD4 } from "./saddled4";
import { SlpCvxEth } from "./slp-cvx-eth";
import { SlpDaiEth } from "./slp-dai-eth";
import { SlpSushiEth } from "./slp-sushi-eth";
import { SlpTruEth } from "./slp-tru-eth";
import { SlpUsdcEth } from "./slp-usdc-eth";
import { SlpUsdtEth } from "./slp-usdt-eth";
import { SlpWbtcEth } from "./slp-wbtc-eth";
import { SlpYfiEth } from "./slp-yfi-eth";
import { SlpYvboostEth } from "./slp-yvboost-eth";
import { SlpYvecrvEth } from "./slp-yvecrv-eth";
import { SpellEth } from "./spell-eth";
import { PriceCache } from '../price/PriceCache';

export class noOpJarHarvester extends AbstractJarHarvestResolver {
    async getHarvestableUSD( _jar: JarDefinition, _prices: PriceCache, _resolver: Signer | Provider): Promise<number> {
        return 0;
    }
}
const jarToHarvestResolver : Map<string,JarHarvestResolver> = new Map<string, JarHarvestResolver>();
jarToHarvestResolver.set( JAR_SUSHI_ETH_ALCX.details.apiKey, new AlcxEth());
jarToHarvestResolver.set( JAR_SUSHI_ETH_YVBOOST.details.apiKey, new SlpYvboostEth());
jarToHarvestResolver.set( JAR_SUSHI_ETH_YVECRV.details.apiKey, new SlpYvecrvEth());
jarToHarvestResolver.set( JAR_SUSHI_ETH_DAI.details.apiKey, new SlpDaiEth());
jarToHarvestResolver.set( JAR_SUSHI_ETH.details.apiKey, new SlpSushiEth());
jarToHarvestResolver.set( JAR_SUSHI_ETH_USDC.details.apiKey, new SlpUsdcEth());
jarToHarvestResolver.set( JAR_SUSHI_ETH_USDT.details.apiKey, new SlpUsdtEth());
jarToHarvestResolver.set( JAR_SUSHI_ETH_WBTC.details.apiKey, new SlpWbtcEth());
jarToHarvestResolver.set( JAR_SUSHI_ETH_YFI.details.apiKey, new SlpYfiEth());
jarToHarvestResolver.set( JAR_UNIV2_MAAPL_UST.details.apiKey, new MaaplUst());
jarToHarvestResolver.set( JAR_UNIV2_MBABA_UST.details.apiKey, new MBabaUst());
jarToHarvestResolver.set( JAR_UNIV2_MIR_UST.details.apiKey, new MirUst());
jarToHarvestResolver.set( JAR_UNIV2_MQQQ_UST.details.apiKey, new MqqqUst());
jarToHarvestResolver.set( JAR_UNIV2_MSLV_UST.details.apiKey, new MslvUst());
jarToHarvestResolver.set( JAR_UNIV2_MTSLA_UST.details.apiKey, new MtslaUst());
jarToHarvestResolver.set( JAR_UNIV2_FEI_TRIBE.details.apiKey, new FeiTribe());
jarToHarvestResolver.set( JAR_3CRV.details.apiKey, new ThreeCrv());
jarToHarvestResolver.set( JAR_steCRV.details.apiKey, new SteCrv());
jarToHarvestResolver.set( JAR_renCRV.details.apiKey, new RenBtcCRV());
jarToHarvestResolver.set( JAR_SUSHI_CVX_ETH.details.apiKey, new SlpCvxEth());
jarToHarvestResolver.set( JAR_LQTY.details.apiKey, new pLqty());
jarToHarvestResolver.set( JAR_SADDLE_D4.details.apiKey, new SaddleD4());
jarToHarvestResolver.set( JAR_MIM3CRV.details.apiKey, new Mim3Crv());
jarToHarvestResolver.set( JAR_SPELLETH.details.apiKey, new SpellEth());
jarToHarvestResolver.set( JAR_MIMETH.details.apiKey, new MimEth());
jarToHarvestResolver.set( JAR_FOXETH.details.apiKey, new FoxEth());
jarToHarvestResolver.set( JAR_TRUETH.details.apiKey, new SlpTruEth());
jarToHarvestResolver.set( JAR_USDC.details.apiKey, new noOpJarHarvester());
jarToHarvestResolver.set( JAR_lusdCRV.details.apiKey, new noOpJarHarvester());
jarToHarvestResolver.set( JAR_fraxCRV.details.apiKey, new noOpJarHarvester());
jarToHarvestResolver.set( JAR_sCRV.details.apiKey, new noOpJarHarvester());

// Polygon
jarToHarvestResolver.set( JAR_AAVEDAI.details.apiKey, new DaiJar());
jarToHarvestResolver.set( JAR_POLY_SUSHI_MATIC_ETH.details.apiKey, new PSlpMaticEth());
jarToHarvestResolver.set( JAR_POLY_SUSHI_ETH_USDT.details.apiKey, new PSlpUsdtEth());
jarToHarvestResolver.set( JAR_COMETH_USDC_WETH.details.apiKey, new ComethUsdcEth());
jarToHarvestResolver.set( JAR_COMETH_PICKLE_MUST.details.apiKey, new ComethPickleMust());
jarToHarvestResolver.set( JAR_COMETH_MATIC_MUST.details.apiKey, new ComethMaticMust());
jarToHarvestResolver.set( JAR_AM3CRV.details.apiKey, new PThreeCrv());
jarToHarvestResolver.set( JAR_QUICK_MIMATIC_USDC.details.apiKey, new MimaticUSDC());
//jarToHarvestResolver.set( JAR_.details.apiKey, new MimaticQi());
//jarToHarvestResolver.set( JAR_.details.apiKey, new Is3Usd());
//jarToHarvestResolver.set( JAR_SUSHI_DINO_ETH.details.apiKey, new DinoEth());
jarToHarvestResolver.set( JAR_SUSHI_DINO_USDC.details.apiKey, new DinoUsdc());

export class JarHarvestResolverDiscovery {
    findHarvestResolver(definition: JarDefinition) : JarHarvestResolver {
        if( definition.details && definition.details.apiKey) {
            return jarToHarvestResolver.get(definition.details.apiKey);
        }
        return undefined;
    }
  }

function addressInJars (jarAddressLowerCase: string, arr: JarDefinition[]) : boolean {
    for( let i = 0; i < arr.length; i++ ) {
        if( arr[i].contract.toLowerCase() === jarAddressLowerCase )
            return true;
    }
    return false;
}


export const isCvxJar = (jarAddress) => {
    return jarAddress.toLowerCase() === JAR_SUSHI_CVX_ETH.contract.toLowerCase();
};

export const isLqtyJar = (jarAddress) => {
    return jarAddress.toLowerCase() === JAR_LQTY.contract.toLowerCase();
  };