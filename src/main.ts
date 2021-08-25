import { ethers } from "ethers";
import { ALL_ASSETS, JAR_3CRV, JAR_FOXETH, JAR_LQTY, JAR_MIM3CRV, JAR_MIMETH, JAR_renCRV, JAR_SPELLETH, JAR_steCRV, JAR_SUSHI_CVX_ETH, JAR_SUSHI_ETH, JAR_SUSHI_ETH_ALCX, JAR_SUSHI_ETH_DAI, JAR_SUSHI_ETH_TRU, JAR_SUSHI_ETH_USDC, JAR_SUSHI_ETH_USDT, JAR_SUSHI_ETH_WBTC, JAR_SUSHI_ETH_YFI, JAR_SUSHI_ETH_YVBOOST, JAR_SUSHI_ETH_YVECRV, JAR_UNIV2_FEI_TRIBE, JAR_UNIV2_MAAPL_UST, JAR_UNIV2_MBABA_UST, JAR_UNIV2_MIR_UST, JAR_UNIV2_MQQQ_UST, JAR_UNIV2_MSLV_UST, JAR_UNIV2_MTSLA_UST } from "./model/JarsAndFarms";
import { PickleModel } from "./model/PickleModel";
import fetch from 'cross-fetch';
import { CoinGeckoPriceResolver } from "./price/CoinGeckoPriceResolver";
import { getOrLoadAllSushiSwapPairDataIntoCache } from "./protocols/SushiSwapUtil";
// This is an example of the code you'd want to run in dashboard
async function generateFullApi() {
  const toTest = [
    /*
      JAR_steCRV,
      JAR_3CRV,
      JAR_renCRV,
      JAR_SUSHI_ETH_DAI,
      JAR_SUSHI_ETH,
      JAR_SUSHI_ETH_USDC,
      JAR_SUSHI_ETH_USDT,
      JAR_SUSHI_ETH_WBTC,
      JAR_SUSHI_ETH_YFI, JAR_SUSHI_ETH_ALCX, 
      JAR_SUSHI_ETH_TRU,
      JAR_SUSHI_ETH_YVBOOST,
      JAR_SUSHI_ETH_YVECRV,
      JAR_SUSHI_CVX_ETH,
      JAR_SUSHI_ETH_ALCX,
      JAR_MIM3CRV,
      JAR_MIMETH,
      JAR_SPELLETH,
      JAR_UNIV2_MBABA_UST,
      JAR_UNIV2_MAAPL_UST,
      JAR_UNIV2_MSLV_UST,
      JAR_UNIV2_MTSLA_UST,
      JAR_UNIV2_MQQQ_UST,
      JAR_UNIV2_MIR_UST,
      JAR_FOXETH,
      JAR_UNIV2_FEI_TRIBE,
      */
     JAR_LQTY
    ];
  const model : PickleModel = new PickleModel(toTest, new ethers.providers.InfuraProvider(), 
                new ethers.providers.JsonRpcProvider('https://rpc-mainnet.maticvigil.com/'));
  const result = await model.generateFullApi();
  const resultString = JSON.stringify(result, null, 2);
  process.stdout.write(resultString);
}

generateFullApi();
