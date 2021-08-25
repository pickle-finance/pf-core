import { Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { JAR_UNIV2_MAAPL_UST, JAR_UNIV2_MBABA_UST, JAR_UNIV2_MIR_UST, JAR_UNIV2_MQQQ_UST, 
    JAR_UNIV2_MSLV_UST, JAR_UNIV2_MTSLA_UST, 
    JAR_SUSHI_ETH_DAI, JAR_SUSHI_ETH, JAR_SUSHI_ETH_USDC, JAR_SUSHI_ETH_USDT, JAR_SUSHI_ETH_WBTC, 
    JAR_SUSHI_ETH_YVECRV, JAR_SUSHI_ETH_YFI, JAR_SUSHI_ETH_YVBOOST,  
    JAR_UNIV2_FEI_TRIBE, JAR_SUSHI_ETH_ALCX, JAR_SUSHI_CVX_ETH, JAR_LQTY, JAR_SADDLE_D4,
     JAR_3CRV, JAR_steCRV, JAR_renCRV, JAR_AAVEDAI, JAR_POLY_SUSHI_MATIC_ETH, JAR_POLY_SUSHI_ETH_USDT,
      JAR_COMETH_USDC_WETH, JAR_COMETH_PICKLE_MUST, JAR_COMETH_MATIC_MUST, JAR_QUICK_MIMATIC_USDC, 
      JAR_fraxCRV, JAR_USDC, JAR_lusdCRV, JAR_AM3CRV, JAR_sCRV, JAR_MIM3CRV, JAR_SPELLETH, JAR_MIMETH, JAR_FOXETH, 
    JAR_SUSHI_DINO_USDC, JAR_QUICK_DINO_ETH, JAR_QUICK_QI_MIMATIC, JAR_IRON3USD, JAR_SUSHI_ETH_TRU } from "../model/JarsAndFarms";
import { JarDefinition, PickleAsset } from "../model/PickleModelJson";

import { JarBehavior } from './JarBehaviorResolver';
import { AbstractJarBehavior } from "./AbstractJarBehavior";
import { DinoEth } from './impl/dino-eth';
import { AlcxEth } from './impl/alcx-eth';
import { ComethMaticMust } from './impl/cometh-matic-must';
import { ComethPickleMust } from './impl/cometh-pickle-must';
import { ComethUsdcEth } from './impl/cometh-usdc-eth';
import { ThreeCrv } from './impl/crv-3crv';
import { RenBtcCRV } from './impl/crv-renbtc';
import { SteCrv } from './impl/crv-stecrv';
import { DaiJar } from './impl/dai';
import { DinoUsdc } from './impl/dino-usdc';
import { FeiTribe } from './impl/fei-tribe';
import { FoxEth } from './impl/fox-eth';
import { Is3Usd } from './impl/is3usd';
import { pLqty } from './impl/lqty';
import { MaaplUst } from './impl/maapl-ust';
import { MBabaUst } from './impl/mbaba-ust';
import { MimEth } from './impl/mim-eth';
import { Mim3Crv } from './impl/mim3crv';
import { MimaticQi } from './impl/mimatic-qi';
import { MimaticUSDC } from './impl/mimatic-usdc';
import { MirUst } from './impl/mir-ust';
import { MqqqUst } from './impl/mqqq-ust';
import { MslvUst } from './impl/mslv-ust';
import { MtslaUst } from './impl/mtsla-ust';
import { PThreeCrv } from './impl/p3crv';
import { PSlpMaticEth } from './impl/pslp-matic-eth';
import { PSlpUsdtEth } from './impl/pslp-usdt-eth';
import { SaddleD4 } from './impl/saddled4';
import { SlpCvxEth } from './impl/slp-cvx-eth';
import { SlpDaiEth } from './impl/slp-dai-eth';
import { SlpSushiEth } from './impl/slp-sushi-eth';
import { SlpTruEth } from './impl/slp-tru-eth';
import { SlpUsdcEth } from './impl/slp-usdc-eth';
import { SlpUsdtEth } from './impl/slp-usdt-eth';
import { SlpWbtcEth } from './impl/slp-wbtc-eth';
import { SlpYfiEth } from './impl/slp-yfi-eth';
import { SlpYvboostEth } from './impl/slp-yvboost-eth';
import { SlpYvecrvEth } from './impl/slp-yvecrv-eth';
import { SpellEth } from './impl/spell-eth';
import { PickleModel } from '../model/PickleModel';

export class noOpJarBehavior extends AbstractJarBehavior {
    async getHarvestableUSD( _jar: JarDefinition, _model: PickleModel, _resolver: Signer | Provider): Promise<number> {
        return 0;
    }
}
const jarToBehavior : Map<string,JarBehavior> = new Map<string, JarBehavior>();
// Converted
jarToBehavior.set( JAR_steCRV.id, new SteCrv());
jarToBehavior.set( JAR_3CRV.id, new ThreeCrv());
jarToBehavior.set( JAR_renCRV.id, new RenBtcCRV());
jarToBehavior.set( JAR_SUSHI_ETH_DAI.id, new SlpDaiEth());
jarToBehavior.set( JAR_SUSHI_ETH.id, new SlpSushiEth());
jarToBehavior.set( JAR_SUSHI_ETH_USDC.id, new SlpUsdcEth());
jarToBehavior.set( JAR_SUSHI_ETH_USDT.id, new SlpUsdtEth());
jarToBehavior.set( JAR_SUSHI_ETH_WBTC.id, new SlpWbtcEth());
jarToBehavior.set( JAR_SUSHI_ETH_YFI.id, new SlpYfiEth());
jarToBehavior.set( JAR_SUSHI_ETH_TRU.id, new SlpTruEth());
jarToBehavior.set( JAR_SUSHI_ETH_YVBOOST.id, new SlpYvboostEth());
jarToBehavior.set( JAR_SUSHI_ETH_YVECRV.id, new SlpYvecrvEth());
jarToBehavior.set( JAR_SUSHI_CVX_ETH.id, new SlpCvxEth());
jarToBehavior.set( JAR_SUSHI_ETH_ALCX.id, new AlcxEth());
jarToBehavior.set( JAR_SPELLETH.id, new SpellEth());
jarToBehavior.set( JAR_MIMETH.id, new MimEth());
jarToBehavior.set( JAR_MIM3CRV.id, new Mim3Crv());
jarToBehavior.set( JAR_UNIV2_MBABA_UST.id, new MBabaUst());
jarToBehavior.set( JAR_UNIV2_MIR_UST.id, new MirUst());
jarToBehavior.set( JAR_UNIV2_MAAPL_UST.id, new MaaplUst());
jarToBehavior.set( JAR_UNIV2_MQQQ_UST.id, new MqqqUst());
jarToBehavior.set( JAR_UNIV2_MSLV_UST.id, new MslvUst());
jarToBehavior.set( JAR_UNIV2_MTSLA_UST.id, new MtslaUst());
jarToBehavior.set( JAR_FOXETH.id, new FoxEth());
jarToBehavior.set( JAR_UNIV2_FEI_TRIBE.id, new FeiTribe());

// Yet to convert


jarToBehavior.set( JAR_LQTY.id, new pLqty());
jarToBehavior.set( JAR_SADDLE_D4.id, new SaddleD4());

// deprecated
jarToBehavior.set( JAR_USDC.id, new noOpJarBehavior());
jarToBehavior.set( JAR_lusdCRV.id, new noOpJarBehavior());
jarToBehavior.set( JAR_fraxCRV.id, new noOpJarBehavior());
jarToBehavior.set( JAR_sCRV.id, new noOpJarBehavior());

// Polygon
jarToBehavior.set( JAR_AAVEDAI.id, new DaiJar());
jarToBehavior.set( JAR_POLY_SUSHI_MATIC_ETH.id, new PSlpMaticEth());
jarToBehavior.set( JAR_POLY_SUSHI_ETH_USDT.id, new PSlpUsdtEth());
jarToBehavior.set( JAR_COMETH_USDC_WETH.id, new ComethUsdcEth());
jarToBehavior.set( JAR_COMETH_PICKLE_MUST.id, new ComethPickleMust());
jarToBehavior.set( JAR_COMETH_MATIC_MUST.id, new ComethMaticMust());
jarToBehavior.set( JAR_AM3CRV.id, new PThreeCrv());
jarToBehavior.set( JAR_QUICK_MIMATIC_USDC.id, new MimaticUSDC());
jarToBehavior.set( JAR_QUICK_QI_MIMATIC.id, new MimaticQi());
jarToBehavior.set( JAR_IRON3USD.id, new Is3Usd());
jarToBehavior.set( JAR_QUICK_DINO_ETH.id, new DinoEth());
jarToBehavior.set( JAR_SUSHI_DINO_USDC.id, new DinoUsdc());

export class JarBehaviorDiscovery {
    findAssetBehavior(definition: PickleAsset) : JarBehavior {
        return jarToBehavior.get(definition.id);
    }
  }