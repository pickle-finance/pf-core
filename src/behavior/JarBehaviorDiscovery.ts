import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import {
  JAR_UNIV2_MAAPL_UST,
  JAR_UNIV2_MBABA_UST,
  JAR_UNIV2_MIR_UST,
  JAR_UNIV2_MQQQ_UST,
  JAR_UNIV2_MSLV_UST,
  JAR_UNIV2_MTSLA_UST,
  JAR_SUSHI_ETH_DAI,
  JAR_SUSHI_ETH,
  JAR_SUSHI_ETH_USDC,
  JAR_SUSHI_ETH_USDT,
  JAR_SUSHI_ETH_WBTC,
  JAR_SUSHI_ETH_YVECRV,
  JAR_SUSHI_ETH_YFI,
  JAR_SUSHI_ETH_YVBOOST,
  JAR_UNIV2_FEI_TRIBE,
  JAR_SUSHI_ETH_ALCX,
  JAR_SUSHI_CVX_ETH,
  JAR_LQTY,
  JAR_SADDLE_D4,
  JAR_3CRV,
  JAR_steCRV,
  JAR_renCRV,
  JAR_AAVEDAI,
  JAR_POLY_SUSHI_MATIC_ETH,
  JAR_POLY_SUSHI_ETH_USDT,
  JAR_COMETH_USDC_WETH,
  JAR_COMETH_PICKLE_MUST,
  JAR_COMETH_MATIC_MUST,
  JAR_QUICK_MIMATIC_USDC,
  JAR_fraxCRV,
  JAR_USDC,
  JAR_lusdCRV,
  JAR_AM3CRV,
  JAR_sCRV,
  JAR_MIM3CRV,
  JAR_SPELLETH,
  JAR_MIMETH,
  JAR_FOXETH,
  JAR_SUSHI_DINO_USDC,
  JAR_QUICK_DINO_ETH,
  JAR_QUICK_QI_MIMATIC,
  JAR_IRON3USD,
  JAR_SUSHI_ETH_TRU,
  JAR_CRV_IB,
  JAR_QUICK_QI_MATIC,
  JAR_POLY_SUSHI_PICKLE_DAI,
  JAR_UNI_RLY_ETH,
  ASSET_PBAMM,
  JAR_ARBITRUM_CRV_TRICRYPTO,
  JAR_ARBITRUM_MIM2CRV,
  JAR_ARBITRUM_SLP_MIM_ETH,
  JAR_ARBITRUM_SLP_SPELL_ETH,
  JAR_ARBITRUM_DODO_HND_ETH,
  JAR_ARBITRUM_DODO_USDC,
  JAR_ARBITRUM_BAL_TRICRYPTO,
  JAR_CURVE_CVXCRVLP,
  JAR_POLY_SUSHI_WORK_USDC,
  JAR_CVXCRV,
  JAR_CURVE_CRVETHLP,
  JAR_OKEX_ETHK_USDT,
  JAR_OKEX_OKT_CHE,
  JAR_OKEX_OKT_USDT,
  JAR_OKEX_USDT_CHE,
  JAR_UNIV3_RBN_ETH,
  JAR_OKEX_JSWAP_BTCK_USDT,
  JAR_OKEX_JSWAP_ETHK_USDT,
  JAR_OKEX_JSWAP_JF_USDT,
  JAR_OKEX_JSWAP_USDT_DAIK,
  JAR_OKEX_JSWAP_DAIK_USDC,
  JAR_ONE_SUSHI_ETH_DAI,
  JAR_ONE_SUSHI_ETH_ONE,
  JAR_ONE_SUSHI_WBTC_ETH,
  JAR_MOVR_SOLAR_MOVR,
  JAR_MOVR_SOLAR_DAI_USDC,
  JAR_MOVR_SOLAR_MOVR_USDC,
  JAR_MOVR_SOLAR_SOLAR_USDC,
  JAR_MOVR_SOLAR_USDT_USDC,
  JAR_MOVR_SOLAR_BUSD_USDC,
  JAR_MOVR_SOLAR_ETH_USDC,
  JAR_MOVR_SOLAR_BNB_BUSD,
  JAR_MOVR_SOLAR_WBTC_USDC,
  JAR_MOVR_SOLAR_AVAX_MOVR,
  JAR_MOVR_SOLAR_MAI_USDC,
  JAR_MOVR_SOLAR_MIM_USDC,
  JAR_MOVR_SOLAR_MOVR_FTM,
  JAR_MOVR_SOLAR_MOVR_RIB,
  JAR_MOVR_SOLAR_MOVR_RELAY,
  JAR_MOVR_SOLAR_SOLAR_RIB,
  JAR_MOVR_SOLAR_PETS_MOVR,
  JAR_MOVR_SOLAR_FRAX_MOVR,
  JAR_MOVR_SOLAR_MIM_MOVR,
  JAR_MOVR_SOLAR_BNB_MOVR,
  JAR_MOVR_SOLAR_ETH_MOVR,
  EXTERNAL_SUSHI_PICKLE_ETH,
  JAR_CRO_VVS_CRO_BIFI,
  JAR_CRO_VVS_CRO_DAI,
  JAR_CRO_VVS_CRO_ETH,
  JAR_CRO_VVS_CRO_SHIB,
  JAR_CRO_VVS_CRO_USDC,
  JAR_CRO_VVS_CRO_USDT,
  JAR_CRO_VVS_CRO_VVS,
  JAR_CRO_VVS_VVS_USDC,
  JAR_CRO_VVS_VVS_USDT,
  JAR_CRO_VVS_USDC_USDT,
  JAR_CRO_VVS_CRO_BTC,
  JAR_AURORA_TRI_NEAR_USDC
} from "../model/JarsAndFarms";
import { JarDefinition, PickleAsset } from "../model/PickleModelJson";

import { AssetBehavior, JarBehavior } from "./JarBehaviorResolver";
import { AbstractJarBehavior } from "./AbstractJarBehavior";
import { DinoEth } from "./impl/dino-eth";
import { AlcxEth } from "./impl/alcx-eth";
import { ComethMaticMust } from "./impl/cometh-matic-must";
import { ComethPickleMust } from "./impl/cometh-pickle-must";
import { ComethUsdcEth } from "./impl/cometh-usdc-eth";
import { ThreeCrv } from "./impl/crv-3crv";
import { RenBtcCRV } from "./impl/crv-renbtc";
import { SteCrv } from "./impl/crv-stecrv";
import { DaiJar } from "./impl/dai";
import { DinoUsdc } from "./impl/dino-usdc";
import { FeiTribe } from "./impl/fei-tribe";
import { FoxEth } from "./impl/fox-eth";
import { Is3Usd } from "./impl/is3usd";
import { pLqty } from "./impl/lqty";
import { MaaplUst } from "./impl/maapl-ust";
import { MBabaUst } from "./impl/mbaba-ust";
import { MimEth } from "./impl/mim-eth";
import { Mim3Crv } from "./impl/mim3crv";
import { MimaticQi } from "./impl/mimatic-qi";
import { MimaticUSDC } from "./impl/mimatic-usdc";
import { MirUst } from "./impl/mir-ust";
import { MqqqUst } from "./impl/mqqq-ust";
import { MslvUst } from "./impl/mslv-ust";
import { MtslaUst } from "./impl/mtsla-ust";
import { PThreeCrv } from "./impl/p3crv";
import { PSlpMaticEth } from "./impl/pslp-matic-eth";
import { PSlpUsdtEth } from "./impl/pslp-usdt-eth";
import { PSlpPickleDai } from "./impl/pslp-pickle-dai";
import { SaddleD4 } from "./impl/saddled4";
import { SlpCvxEth } from "./impl/slp-cvx-eth";
import { SlpDaiEth } from "./impl/slp-dai-eth";
import { SlpSushiEth } from "./impl/slp-sushi-eth";
import { SlpTruEth } from "./impl/slp-tru-eth";
import { SlpUsdcEth } from "./impl/slp-usdc-eth";
import { SlpUsdtEth } from "./impl/slp-usdt-eth";
import { SlpWbtcEth } from "./impl/slp-wbtc-eth";
import { SlpYfiEth } from "./impl/slp-yfi-eth";
import { SlpYvboostEth } from "./impl/slp-yvboost-eth";
import { SlpYvecrvEth } from "./impl/slp-yvecrv-eth";
import { SpellEth } from "./impl/spell-eth";
import { PickleModel } from "../model/PickleModel";
import { YearnJar } from "./impl/yearn-jar";
import { MaticQi } from "./impl/matic-qi";
import { RlyEth } from "./impl/rly-eth";
import { PBammAsset } from "./impl/pbamm";
import { CrvTricrypto } from "./impl/crv-tricrypto";
import { Mim2Crv } from "./impl/mim2crv";
import { ArbitrumMimEth } from "./impl/arbitrum-mim-eth";
import { ArbitrumSpellEth } from "./impl/arbitrum-spell-eth";
import { ArbitrumHndEth } from "./impl/arbitrum-hnd-eth";
import { BalTricrypto } from "./impl/bal-tricrypto";
import { CurveCvxCrv } from "./impl/crv-cvxcrv";
import { PSlpWorkUsdc } from "./impl/pslp-work-usdc";
import { CvxCrv } from "./impl/cvxcrv";
import { Uni3RbnEth } from "./impl/uni-rbn-eth";
import { CherryCheOkt } from "./impl/cherry-che-okt";
import { CherryCheUsdt } from "./impl/cherry-che-usdt";
import { CherryEthkUsdt } from "./impl/cherry-ethk-usdt";
import { CherryOktUsdt } from "./impl/cherry-okt-usdt";
import { JswapBtckUsdt } from "./impl/jswap-btck-usdt";
import { JswapEthkUsdt } from "./impl/jswap-ethk-usdt";
import { JswapJfUsdt } from "./impl/jswap-jf-usdt";
import { JswapDaikkUsdc } from "./impl/jswap-daik-usdc";
import { JswapDaikkUsdt } from "./impl/jswap-daik-usdt";
import { HSlpEthDai } from "./impl/hslp-eth-dai";
import { HSlpEthOne } from "./impl/hslp-eth-one";
import { HSlpWbtcEth } from "./impl/hslp-wbtc-eth";
import { SolarMovr } from "./impl/solar-movr";
import { SolarDaiUsdc } from "./impl/solar-dai-usdc";
import { SolarMovrUsdc } from "./impl/solar-movr-usdc";
import { SolarSolarUsdc } from "./impl/solar-solar-usdc";
import { SolarUsdtUsdc } from "./impl/solar-usdt-usdc";
import { SolarBusdUsdc } from "./impl/solar-busd-usdc";
import { SolarEthUsdc } from "./impl/solar-eth-usdc";
import { SolarBnbBusd } from "./impl/solar-bnb-busd";
import { SolarWbtcUsdc } from "./impl/solar-wbtc-usdc";
import { SolarAvaxMovr } from "./impl/solar-avax-movr";
import { SolarMaiUsdc } from "./impl/solar-mai-usdc";
import { SolarMimUsdc } from "./impl/solar-mim-usdc";
import { SolarMovrFtm } from "./impl/solar-movr-ftm";
import { SolarMovrRib } from "./impl/solar-movr-rib";
import { SolarMovrRelay } from "./impl/solar-movr-relay";
import { SolarSolarRib } from "./impl/solar-solar-rib";
import { SolarPetsMovr } from "./impl/solar-pets-movr";
import { SolarFraxMovr } from "./impl/solar-frax-movr";
import { SolarMimMovr } from "./impl/solar-mim-movr";
import { SolarBnbMovr } from "./impl/solar-bnb-movr";
import { SolarEthMovr } from "./impl/solar-eth-movr";
import { CurveCrvEth } from "./impl/crv-eth";
import { MainnetSushiPickleEth } from "./impl/MainnetSushiPickleEth";
import { ArbitrumDodoUsdc } from "./impl/arbitrum-dodo-usdc";
import { VvsCroBifi } from "./impl/vvs-cro-bifi";
import { VvsCroDai } from "./impl/vvs-cro-dai";
import { VvsCroEth } from "./impl/vvs-cro-eth";
import { VvsCroShib } from "./impl/vvs-cro-shib";
import { VvsCroUsdc } from "./impl/vvs-cro-usdc";
import { VvsCroUsdt } from "./impl/vvs-cro-usdt";
import { VvsCroVvs } from "./impl/vvs-cro-vvs";
import { VvsVvsUsdc } from "./impl/vvs-vvs-usdc";
import { VvsVvsUsdt } from "./impl/vvs-vvs-usdt";
import { VvsCroBtc } from "./impl/vvs-cro-btc";
import { VvsUsdcUsdt } from "./impl/vvs-usdc-usdt";
import { TriNearUsdc } from "./impl/aurora-tri-near-usdc";

export class noOpJarBehavior extends AbstractJarBehavior {
  async getHarvestableUSD(
    _jar: JarDefinition,
    _model: PickleModel,
    _resolver: Signer | Provider,
  ): Promise<number> {
    return 0;
  }
}
const jarToBehavior: Map<string, JarBehavior> = new Map<string, JarBehavior>();
// Converted
jarToBehavior.set(JAR_sCRV.id, new noOpJarBehavior());
jarToBehavior.set(JAR_steCRV.id, new SteCrv());
jarToBehavior.set(JAR_3CRV.id, new ThreeCrv());
jarToBehavior.set(JAR_renCRV.id, new RenBtcCRV());
jarToBehavior.set(JAR_SUSHI_ETH_DAI.id, new SlpDaiEth());
jarToBehavior.set(JAR_SUSHI_ETH.id, new SlpSushiEth());
jarToBehavior.set(JAR_SUSHI_ETH_USDC.id, new SlpUsdcEth());
jarToBehavior.set(JAR_SUSHI_ETH_USDT.id, new SlpUsdtEth());
jarToBehavior.set(JAR_SUSHI_ETH_WBTC.id, new SlpWbtcEth());
jarToBehavior.set(JAR_SUSHI_ETH_YFI.id, new SlpYfiEth());
jarToBehavior.set(JAR_SUSHI_ETH_TRU.id, new SlpTruEth());
jarToBehavior.set(JAR_SUSHI_ETH_YVBOOST.id, new SlpYvboostEth());
jarToBehavior.set(JAR_SUSHI_ETH_YVECRV.id, new SlpYvecrvEth());
jarToBehavior.set(JAR_SUSHI_CVX_ETH.id, new SlpCvxEth());
jarToBehavior.set(JAR_SUSHI_ETH_ALCX.id, new AlcxEth());
jarToBehavior.set(JAR_SPELLETH.id, new SpellEth());
jarToBehavior.set(JAR_MIMETH.id, new MimEth());
jarToBehavior.set(JAR_MIM3CRV.id, new Mim3Crv());
jarToBehavior.set(JAR_UNIV2_MBABA_UST.id, new MBabaUst());
jarToBehavior.set(JAR_UNIV2_MIR_UST.id, new MirUst());
jarToBehavior.set(JAR_UNIV2_MAAPL_UST.id, new MaaplUst());
jarToBehavior.set(JAR_UNIV2_MQQQ_UST.id, new MqqqUst());
jarToBehavior.set(JAR_UNIV2_MSLV_UST.id, new MslvUst());
jarToBehavior.set(JAR_UNIV2_MTSLA_UST.id, new MtslaUst());
jarToBehavior.set(JAR_FOXETH.id, new FoxEth());
jarToBehavior.set(JAR_UNIV2_FEI_TRIBE.id, new FeiTribe());
jarToBehavior.set(JAR_LQTY.id, new pLqty());
jarToBehavior.set(JAR_SADDLE_D4.id, new SaddleD4());
jarToBehavior.set(JAR_USDC.id, new YearnJar());
jarToBehavior.set(JAR_lusdCRV.id, new YearnJar());
jarToBehavior.set(JAR_fraxCRV.id, new YearnJar());
jarToBehavior.set(JAR_CRV_IB.id, new YearnJar());
jarToBehavior.set(JAR_UNI_RLY_ETH.id, new RlyEth());
jarToBehavior.set(JAR_CURVE_CVXCRVLP.id, new CurveCvxCrv());
jarToBehavior.set(JAR_CVXCRV.id, new CvxCrv());
jarToBehavior.set(JAR_UNIV3_RBN_ETH.id, new Uni3RbnEth());
jarToBehavior.set(JAR_CURVE_CRVETHLP.id, new CurveCrvEth)

// Polygon
jarToBehavior.set(JAR_AAVEDAI.id, new DaiJar());
jarToBehavior.set(JAR_COMETH_USDC_WETH.id, new ComethUsdcEth());
jarToBehavior.set(JAR_COMETH_PICKLE_MUST.id, new ComethPickleMust());
jarToBehavior.set(JAR_COMETH_MATIC_MUST.id, new ComethMaticMust());
jarToBehavior.set(JAR_POLY_SUSHI_MATIC_ETH.id, new PSlpMaticEth());
jarToBehavior.set(JAR_POLY_SUSHI_ETH_USDT.id, new PSlpUsdtEth());
jarToBehavior.set(JAR_POLY_SUSHI_PICKLE_DAI.id, new PSlpPickleDai());
jarToBehavior.set(JAR_SUSHI_DINO_USDC.id, new DinoUsdc());
jarToBehavior.set(JAR_AM3CRV.id, new PThreeCrv());
jarToBehavior.set(JAR_QUICK_DINO_ETH.id, new DinoEth());
jarToBehavior.set(JAR_QUICK_MIMATIC_USDC.id, new MimaticUSDC());
jarToBehavior.set(JAR_QUICK_QI_MIMATIC.id, new MimaticQi());
jarToBehavior.set(JAR_QUICK_QI_MATIC.id, new MaticQi());
jarToBehavior.set(JAR_IRON3USD.id, new Is3Usd());
jarToBehavior.set(JAR_POLY_SUSHI_WORK_USDC.id, new PSlpWorkUsdc());

// Arbitrum
jarToBehavior.set(JAR_ARBITRUM_SLP_MIM_ETH.id, new ArbitrumMimEth());
jarToBehavior.set(JAR_ARBITRUM_SLP_SPELL_ETH.id, new ArbitrumSpellEth());
jarToBehavior.set(JAR_ARBITRUM_MIM2CRV.id, new Mim2Crv());
jarToBehavior.set(JAR_ARBITRUM_CRV_TRICRYPTO.id, new CrvTricrypto());
jarToBehavior.set(JAR_ARBITRUM_DODO_HND_ETH.id, new ArbitrumHndEth());
jarToBehavior.set(JAR_ARBITRUM_DODO_USDC.id, new ArbitrumDodoUsdc());
jarToBehavior.set(JAR_ARBITRUM_BAL_TRICRYPTO.id, new BalTricrypto());

// OKEx
jarToBehavior.set(JAR_OKEX_OKT_CHE.id, new CherryCheOkt());
jarToBehavior.set(JAR_OKEX_USDT_CHE.id, new CherryCheUsdt());
jarToBehavior.set(JAR_OKEX_OKT_USDT.id, new CherryOktUsdt());
jarToBehavior.set(JAR_OKEX_ETHK_USDT.id, new CherryEthkUsdt());
jarToBehavior.set(JAR_OKEX_JSWAP_JF_USDT.id, new JswapJfUsdt());
jarToBehavior.set(JAR_OKEX_JSWAP_BTCK_USDT.id, new JswapBtckUsdt());
jarToBehavior.set(JAR_OKEX_JSWAP_ETHK_USDT.id, new JswapEthkUsdt());
jarToBehavior.set(JAR_OKEX_JSWAP_DAIK_USDC.id, new JswapDaikkUsdc());
jarToBehavior.set(JAR_OKEX_JSWAP_USDT_DAIK.id, new JswapDaikkUsdt());

// Harmony
jarToBehavior.set(JAR_ONE_SUSHI_ETH_DAI.id, new HSlpEthDai());
jarToBehavior.set(JAR_ONE_SUSHI_ETH_ONE.id, new HSlpEthOne());
jarToBehavior.set(JAR_ONE_SUSHI_WBTC_ETH.id, new HSlpWbtcEth());

// Moonriver
jarToBehavior.set(JAR_MOVR_SOLAR_MOVR.id, new SolarMovr());
jarToBehavior.set(JAR_MOVR_SOLAR_DAI_USDC.id, new SolarDaiUsdc());
jarToBehavior.set(JAR_MOVR_SOLAR_MOVR_USDC.id, new SolarMovrUsdc());
jarToBehavior.set(JAR_MOVR_SOLAR_SOLAR_USDC.id, new SolarSolarUsdc());
jarToBehavior.set(JAR_MOVR_SOLAR_USDT_USDC.id, new SolarUsdtUsdc());
jarToBehavior.set(JAR_MOVR_SOLAR_BUSD_USDC.id, new SolarBusdUsdc());
jarToBehavior.set(JAR_MOVR_SOLAR_ETH_USDC.id, new SolarEthUsdc());
jarToBehavior.set(JAR_MOVR_SOLAR_BNB_BUSD.id, new SolarBnbBusd());
jarToBehavior.set(JAR_MOVR_SOLAR_WBTC_USDC.id, new SolarWbtcUsdc());
jarToBehavior.set(JAR_MOVR_SOLAR_AVAX_MOVR.id, new SolarAvaxMovr());
jarToBehavior.set(JAR_MOVR_SOLAR_MAI_USDC.id, new SolarMaiUsdc());
jarToBehavior.set(JAR_MOVR_SOLAR_MIM_USDC.id, new SolarMimUsdc());
jarToBehavior.set(JAR_MOVR_SOLAR_MOVR_FTM.id, new SolarMovrFtm());
jarToBehavior.set(JAR_MOVR_SOLAR_MOVR_RIB.id, new SolarMovrRib());
jarToBehavior.set(JAR_MOVR_SOLAR_MOVR_RELAY.id, new SolarMovrRelay());
jarToBehavior.set(JAR_MOVR_SOLAR_SOLAR_RIB.id, new SolarSolarRib());
jarToBehavior.set(JAR_MOVR_SOLAR_PETS_MOVR.id, new SolarPetsMovr());
jarToBehavior.set(JAR_MOVR_SOLAR_FRAX_MOVR.id, new SolarFraxMovr());
jarToBehavior.set(JAR_MOVR_SOLAR_MIM_MOVR.id, new SolarMimMovr());
jarToBehavior.set(JAR_MOVR_SOLAR_BNB_MOVR.id, new SolarBnbMovr());
jarToBehavior.set(JAR_MOVR_SOLAR_ETH_MOVR.id, new SolarEthMovr());

// Cronos
jarToBehavior.set(JAR_CRO_VVS_CRO_ETH.id, new VvsCroEth());
jarToBehavior.set(JAR_CRO_VVS_CRO_BIFI.id, new VvsCroBifi());
jarToBehavior.set(JAR_CRO_VVS_CRO_DAI.id, new VvsCroDai());
jarToBehavior.set(JAR_CRO_VVS_CRO_ETH.id, new VvsCroEth());
jarToBehavior.set(JAR_CRO_VVS_CRO_SHIB.id, new VvsCroShib());
jarToBehavior.set(JAR_CRO_VVS_CRO_USDC.id, new VvsCroUsdc());
jarToBehavior.set(JAR_CRO_VVS_CRO_USDT.id, new VvsCroUsdt());
jarToBehavior.set(JAR_CRO_VVS_CRO_VVS.id, new VvsCroVvs());
jarToBehavior.set(JAR_CRO_VVS_VVS_USDC.id, new VvsVvsUsdc());
jarToBehavior.set(JAR_CRO_VVS_VVS_USDT.id, new VvsVvsUsdt());
jarToBehavior.set(JAR_CRO_VVS_CRO_BTC.id, new VvsCroBtc());
jarToBehavior.set(JAR_CRO_VVS_USDC_USDT.id, new VvsUsdcUsdt());

// Aurora
jarToBehavior.set(JAR_AURORA_TRI_NEAR_USDC.id, new TriNearUsdc());

jarToBehavior.set(ASSET_PBAMM.id, new PBammAsset());
jarToBehavior.set(EXTERNAL_SUSHI_PICKLE_ETH.id, new MainnetSushiPickleEth());
// ADD_ASSET token behavior class

// Yet to convert
export class JarBehaviorDiscovery {
  findAssetBehavior(definition: PickleAsset): AssetBehavior<PickleAsset> {
    return jarToBehavior.get(definition.id);
  }
}
