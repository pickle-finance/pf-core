import { Contract as MultiContract, MultiProvider } from "ethers-multiprovider";
import fetch from "cross-fetch";
import { PickleModelJson } from "../..";
import { Chains, ChainNetwork } from "../../chain/Chains";
import { JarDefinition, AssetEnablement, AssetProtocol } from "../../model/PickleModelJson";
import { toError1 } from "../../model/PickleModel";
import { ErrorSeverity, PickleProduct, PlatformError } from "../../core/platform/PlatformInterfaces";
import { CommsMgrV2 } from "../../util/CommsMgrV2";

interface IJarWithFees {
  jar: JarDefinition;
  fees: number[];
  setCalls: string[];
  timelock: string;
}

const stableIds = ["dai", "usdc", "usdt", "susd", "frax", "mim"];
const feeCallMap: { [apiKey: string]: string[] } = {
  // ETH
  CURVESTGUSDC: ["CRV"],
  LOOKS: ["WETH"],
  "STG-USDC": ["Reward"],
  "STG-USDT": ["Reward"],
  // POLYGON
  "PSLP-RAIDER-MATIC": ["RAIDER"],
  "PSLP-RAIDER-WETH": ["RAIDER"],
  "PSLP-AURUM-MATIC": ["RAIDER"],
  "PSLP-AURUM-USDC": ["RAIDER"],
  "STG-POLYGON-USDT": ["Reward"],
  "STG-POLYGON-USDC": ["Reward"],
  // ARBITRUM
  "STG-ARBITRUM-USDT": ["Reward"],
  "STG-ARBITRUM-USDC": ["Reward"],
  "BalVstaEth": ["VSTA"],
  "DodoHndEth": ["DODO"],
  "ArbitrumSlpMagicEth": ["SUSHI", "Reward"],
  "ArbitrumSlpGohmEth": ["SUSHI", "Reward"],
  // AURORA
  "TLP-NEAR-USDC": ["TRI"],
  "TLP-NEAR-ETH": ["TRI"],
  "TLP-NEAR-USDT": ["TRI"],
  "TLP-NEAR-TRI": ["TRI"],
  "TLP-USDT-USDC": ["TRI"],
  "TLP-BTC-NEAR": ["TRI"],
  "TLP-AURORA-TRI": ["TRI"],
  "TLP-AURORA-ETH": ["TRI"],
  "TLP-TRI-USDT": ["TRI"],
  "TLP-STNEAR-NEAR": ["TRI"],
  "TLP-STNEAR-XTRI": ["TRI"],
  "TLP-USDO-USDT": ["TRI"],
  "TLP-FLX-NEAR": ["TRI"],
  "TLP-BSTN-NEAR": ["TRI"],
  "TLP-ROSE-NEAR": ["TRI"],
  "TLP-RUSD-NEAR": ["TRI"],
  "TLP-LINEAR-NEAR": ["TRI"],
  "TRISOLARISLP-SOLACE-NEAR": ["TRI"],
  "TRISOLARISLP-USDC-SHITZU": ["TRI"],
  "TRISOLARISLP-AURORA-NEAR": ["TRI"],
  "WLP-WANNA-NEAR": ["WANNA"],
  "WLP-AURORA-NEAR": ["WANNA"],
  "WLP-ETH-BTC": ["WANNA"],
  "WLP-NEAR-BTC": ["WANNA"],
  "WLP-NEAR-DAI": ["WANNA"],
  "WLP-NEAR-ETH": ["WANNA"],
  "WLP-USDC-NEAR": ["WANNA"],
  "WLP-USDT-NEAR": ["WANNA"],
  "WLP-USDT-USDC": ["WANNA"],
  "WLP-WANNA-USDC": ["WANNA"],
  "WLP-USDT-WANNA": ["WANNA"],
  "WANNASWAPLP-WANNAX-STNEAR": ["IGNORE"],
  "NLP-BTC-NEAR": ["PAD"],
  "NLP-PAD-USDT": ["PAD"],
  "NLP-PAD-USDC": ["PAD"],
  "NLP-PAD-ETH": ["PAD"],
  "NLP-PAD-NEAR": ["PAD"],
  "NLP-PAD-FRAX": ["PAD"],
  "ROSELP-3POOL": ["ROSE"],
  "ROSELP-FRAXPOOL": ["ROSE"],
  "ROSELP-BUSDPOOL": ["ROSE"],
  "ROSELP-MAIPOOL": ["ROSE"],
  "ROSELP-RUSDPOOL": ["ROSE"],
  "ALP-AURORA-NEAR": ["BRL"],
  "ALP-AVAX-NEAR": ["BRL"],
  "ALP-BRL-AURORA": ["BRL"],
  "ALP-BRL-ETH": ["BRL"],
  "ALP-BRL-NEAR": ["BRL"],
  "NLP-BUSD-NEAR": ["BRL"],
  "ALP-ETH-BTC": ["BRL"],
  "ALP-NEAR-BTC": ["BRL"],
  "ALP-NEAR-ETH": ["BRL"],
  "ALP-USDC-NEAR": ["BRL"],
  "ALP-USDT-NEAR": ["BRL"],
  "ALP-USDT-USDC": ["BRL"],
  "TRI-PLY-NEAR": ["PLY"],
  "VLP-CRO-ETH": ["VVS"],
  "VLP-CRO-DAI": ["VVS"],
  "VLP-CRO-SHIB": ["VVS"],
  "VLP-CRO-USDC": ["VVS"],
  "VLP-CRO-USDT": ["VVS"],
  "VLP-VVS-USDC": ["VVS"],
  "VLP-VVS-USDT": ["VVS"],
  "VLP-CRO-VVS": ["VVS"],
  "VLP-CRO-BTC": ["VVS"],
  "VLP-USDC-USDT": ["VVS"],
  // FANTOM
  "BOO-FTM-ICE": ["BOO"],
  "BOO-FTM-BOO": ["BOO"],
  "BOO-FTM-SPELL": ["BOO"],
  "BOO-FTM-CRV": ["BOO"],
  "BOO-FTM-AVAX": ["BOO"],
  "BOO-FTM-ETH": ["BOO"],
  "BOO-USDT-FTM": ["BOO"],
  "BOO-FTM-BNB": ["BOO"],
  "BOO-FTM-BTC": ["BOO"],
  "BOO-FTM-MIM": ["BOO"],
  "BOO-FTM-LINK": ["BOO"],
  "BOO-FTM-SUSHI": ["BOO"],
  "BOO-FTM-TREEB": ["BOO"],
  "BOO-FTM-ANY": ["BOO"],
  "BOO-BTC-ETH": ["BOO"],
  "BOO-FTM-DAI": ["BOO"],
  "BOO-YFI-ETH": ["BOO"],
  "BOO-FTM-MATIC": ["BOO"],
  "LQDR-SPIRIT-DEUS-FTM": ["LQDR"],
  "LQDR-SPIRIT-FRAX-FTM": ["LQDR"],
  "LQDR-SPIRIT-MIM-FTM": ["LQDR"],
  "LQDR-SPIRIT-USDC-FTM": ["LQDR"],
  "LQDR-SPIRIT-PILLS-FTM": ["LQDR"],
  "LQDR-SPIRIT-ETH-FTM": ["LQDR"],
  "LQDR-SPIRIT-FTM": ["LQDR"],
  "LQDR-SPIRIT-LQDR-FTM": ["LQDR"],
  "LQDR-SPIRIT-DEI-USDC": ["LQDR"],
  "LQDR-BOO-DAI-FTM": ["LQDR"],
  "LQDR-BOO-FTM": ["LQDR"],
  "LQDR-BOO-ETH-FTM": ["LQDR"],
  "LQDR-BOO-MIM-FTM": ["LQDR"],
  "BOO-USDC-FTM": ["BOO"],
  "LQDR-BOO-LINK-FTM": ["LQDR"],
  "LQDR-BOO-USDC-FTM": ["LQDR"],
  "LQDR-BOO-USDT-FTM": ["LQDR"],
  "LQDR-BOO-SUSHI-FTM": ["LQDR"],
  "BEETX-FBEETS": ["BEETS"],
  "BEETX-FTM-BTC-ETH": ["BEETS"],
  "BEETX-LQDR-FTM": ["BEETS"],
  "BEETX-FTM-USDC": ["BEETS"],
  "BEETX-USDC-DAI-MAI": ["BEETS"],
  "BEETX-USDC-FTM-BTC-ETH": ["BEETS"],
  "SEX-SOLID-vFTM-SEX": ["Reward"],
  "SEX-SOLID-sBTC-RENBTC": ["Reward"],
  "SEX-SOLID-sUSDC-MIM": ["Reward"],
  "SEX-SOLID-vFTM-TOMB": ["Reward"],
  "SEX-SOLID-vFTM-CRV": ["Reward"],
  "SEX-SOLID-vFXS-FRAX": ["Reward"],
  "SEX-SOLID-vUSDC-OXD": ["Reward"],
  "SEX-SOLID-vYFI-WOOFY": ["Reward"],
  "SEX-SOLID-vUSDC-SYN": ["Reward"],
  "SEX-SOLID-vFTM-YFI": ["Reward"],
  "SEX-SOLID-vFTM-OATH": ["Reward"],
  "SEX-SOLID-vFTM-MULTI": ["Reward"],
  "SEX-SOLID-sSOLID-SOLIDSEX": ["Reward"],
  "SEX-SOLID-vFTM-LQDR": ["Reward"],
  "SEX-SOLID-vFTM-HND": ["Reward"],
  "OXDSOLIDLYLP-USDC-DEI": ["Reward"],
  "OXDSOLIDLYLP-WFTM-OXD2": ["Reward"],
  "OXDSOLIDLYLP-SPIRIT-SINSPIRIT": ["Reward"],
  "OXDSOLIDLYLP-SPIRIT-RAINSPIRIT": ["Reward"],
  "OXDSOLIDLYLP-WFTM-GEIST": ["Reward"],
  "OXDSOLIDLYLP-WFTM-HND": ["Reward"],
  "OXDSOLIDLYLP-SOLID-OXSOLID": ["Reward"],
  "OXDSOLIDLYLP-WFTM-RDL": ["Reward"],
  "OXDSOLIDLYLP-SEX-G3CRV": ["Reward"],
  "OXDSOLIDLYLP-CRV-WFTM": ["Reward"],
  "OXDSOLIDLYLP-BIFI-MAI": ["Reward"],
  "OXDSOLIDLYLP-WFTM-SCREAM": ["Reward"],
  "OXDSOLIDLYLP-BEETS-FBEETS": ["Reward"],
  "SEX-SOLID-vFTM-IB": ["Reward"],
  "SEX-SOLID-vFTM-GEIST": ["Reward"],
  "SEX-SOLID-vBIFI-MAI": ["Reward"],
  "SEX-SOLID-vCRV-G3CRV": ["Reward"],
  "SEX-SOLID-sFTM-BEFTM": ["Reward"],
  "SEX-SOLID-vFTM-SOLIDSEX": ["Reward"],
  "SEX-SOLID-sUSDC-DAI": ["Reward"],
  "SEX-SOLID-vFTM-SYN": ["Reward"],
  "SEX-SOLID-vTAROT-XTAROT": ["Reward"],
  "SEX-SOLID-sUSDC-DEI": ["Reward"],
  "SEX-SOLID-vFTM-RDL": ["Reward"],
  "SEX-SOLID-vGEIST-G3CRV": ["Reward"],
  "SEX-SOLID-vSOLIDSEX-G3CRV": ["Reward"],
  "SEX-SOLID-vFTM-USDC": ["Reward"],
  "SEX-SOLID-sSPIRIT-RAINSPIRIT": ["Reward"],
  "SEX-SOLID-sSPIRIT-LINSPIRIT": ["Reward"],
  "SEX-SOLID-vFTM-SOLID": ["Reward"],
  "SEX-SOLID-sSPIRIT-SINSPIRIT": ["Reward"],
  "SEX-SOLID-sSPIRIT-BINSPIRIT": ["Reward"],
  "SEX-SOLID-vUSDC-DAI": ["Reward"],
  "SEX-SOLID-vFTM-TAROT": ["Reward"],
  "SPIRIT-FTM-SPIRIT": ["SPIRIT"],
  "SPIRIT-FTM-TREEB": ["SPIRIT"],
  "SPIRIT-FTM-MAI": ["SPIRIT"],
  "SPIRIT-FTM-LQDR": ["SPIRIT"],
  "SPIRIT-FTM-FRAX": ["SPIRIT"],
  "SPIRIT-FTM-DEUS": ["SPIRIT"],
  "SPIRIT-FTM-CRE8R": ["SPIRIT"],
  "SPIRIT-FTM-BIFI": ["SPIRIT"],
  "SPIRIT-GSCARAB-SCARAB": ["SPIRIT"],
  "STG-FANTOM-USDC": ["Reward"],
  "OXDSOLIDLYLP-CRV-G3CRV": ["Reward"],
  "OXDSOLIDLYLP-WFTM-MULTI": ["Reward"],
  "OXDSOLIDLYLP-LQDR-WFTM": ["Reward"],
  "OXDSOLIDLYLP-IB-WFTM": ["Reward"],
  "OXDSOLIDLYLP-XTAROT-TAROT": ["Reward"],
  "OXDSOLIDLYLP-DEI-SCREAM": ["Reward"],
  "OXDSOLIDLYLP-WFTM-SYN": ["Reward"],
  "OXDSOLIDLYLP-WFTM-SOLID": ["Reward"],
  "OXDSOLIDLYLP-YFI-WOOFY": ["Reward"],
  "OXDSOLIDLYLP-SOLIDSEX-SOLID": ["Reward"],
  "OXDSOLIDLYLP-FXS-FRAX": ["Reward"],
  "OXDSOLIDLYLP-OXD-DEI": ["Reward"],
  "OXDSOLIDLYLP-WFTM-TAROT": ["Reward"],
  "OXDSOLIDLYLP-WFTM-YFI": ["Reward"],
  "OXDSOLIDLYLP-SEX-WFTM": ["Reward"],
  "OXDSOLIDLYLP-DEI-DEUS": ["Reward"],
  "OXDSOLIDLYLP-USDC-SYN": ["Reward"],
  "OXDSOLIDLYLP-WFTM-SOLIDSEX": ["Reward"],
  "OXDSOLIDLYLP-USDC-MIM": ["Reward"],
  // GNOSIS
  "SUSHISWAP-XDAI-GNO": ["REWARD"],
  "SUSHISWAP-SUSHI-GNO": ["REWARD"],
  "SUSHISWAP-USDC-XDAI": ["REWARD"],
  "SUSHISWAP-LINK-XDAI": ["REWARD"],
  "SUSHISWAP-USDC-USDT": ["REWARD"],
  "SUSHISWAP-XDAI-USDT": ["REWARD"],
  "SUSHISWAP-WETH-WBTC": ["REWARD"],
  "SUSHISWAP-WETH-XDAI": ["REWARD"],
  "SUSHISWAP-WETH-GNO": ["REWARD"],
  // METIS
  "NLP-NETT-METIS": ["NETT"],
  "NLP-BNB-NETT": ["NETT"],
  "NLP-ETH-METIS": ["NETT"],
  "NLP-ETH-NETT": ["NETT"],
  "NLP-ETH-USDC": ["NETT"],
  "NLP-ETH-USDT": ["NETT"],
  "NLP-METIS-USDC": ["NETT"],
  "NLP-NETT-USDC": ["NETT"],
  "NLP-NETT-USDT": ["NETT"],
  "NLP-USDT-METIS": ["NETT"],
  "NLP-USDT-USDC": ["NETT"],
  "NLP-WBTC-METIS": ["REWARD"],
  "NLP-WBTC-USDT": ["REWARD"],
  "NLP-BYTE-USDC": ["REWARD"],
  "NLP-BUSD-USDC": ["NETT"],
  "NLP-HERA-USDC": ["REWARD"],
  "TLP-TETHYS-METIS": ["TETHYS"],
  "TLP-ETH-METIS": ["TETHYS"],
  "TLP-METIS-USDC": ["TETHYS"],
  "TLP-USDT-METIS": ["TETHYS"],
  "TLP-WBTC-METIS": ["TETHYS"],
  "TLP-METIS-DAI": ["TETHYS"],
  "TLP-METIS-AVAX": ["TETHYS"],
  "TLP-METIS-FTM": ["TETHYS"],
  "METIS-HUMMUS-USDC": ["Reward"],
  "METIS-HUMMUS-DAI": ["Reward"],
  "METIS-HUMMUS-USDT": ["Reward"],
  "SLP-STELLA-GLMR": ["STELLA"],
  "SLP-USDC-BNB": ["STELLA"],
  "SLP-BUSD-GLMR": ["STELLA"],
  "SLP-USDC-DAI": ["STELLA"],
  "SLP-ETH-GLMR": ["STELLA"],
  "SLP-USDC-GLMR": ["STELLA"],
  "SLP-USDC-USDT": ["STELLA"],
  "BLP-BNB-BUSD": ["GLINT"],
  "BLP-BUSD-USDC": ["GLINT"],
  "BLP-ETH-USDC": ["GLINT"],
  "BLP-GLMR-GLINT": ["GLINT"],
  "BLP-GLMR-USDC": ["GLINT"],
  "BLP-USDC-USDT": ["GLINT"],
  "FLP-FLARE-GLMR": ["FLARE"],
  "FLP-FLARE-USDC": ["FLARE"],
  "FLP-GLMR-MOVR": ["FLARE"],
  "FLP-GLMR-USDC": ["FLARE"],
  "FLP-GLMR-ETH": ["FLARE"],
  "FLP-GLMR-WBTC": ["FLARE"],
  "SLP-STKSM-XCKSM": ["Reward"],
  "FLP-FINN-RMRK": ["FINN"],
  "FLP-FINN-KSM": ["FINN"],
  "FLP-MOVR-FINN": ["FINN"],
  "FLP-USDC-MOVR": ["FINN"],
  "ZLP-ETH-USDC": ["ZIP"],
  "ZLP-ETH-BTC": ["ZIP"],
  "ZLP-ETH-DAI": ["ZIP"],
  "ZLP-ETH-ZIP": ["ZIP"],
  "ZLP-ETH-OP": ["ZIP"],
  "STG-OPTIMISM-USDC": ["Reward"],
};

export const runFeeChecker = async (commsMgr2: CommsMgrV2): Promise<PlatformError[]> => {
  const pfcore: PickleModelJson.PickleModelJson = await fetch(
    "https://api.pickle.finance/prod/protocol/pfcore/"
  ).then(async (x) => await x.json());

  const promises: Promise<PlatformError[]>[] = Chains.list().map(
    async (x) => await handleOneChain(x, pfcore, commsMgr2)
  );
  const z: PlatformError[][] = await Promise.all(promises);
  const ret: PlatformError[] = z.flat();
  return ret;
};

const handleOneChain = async (chain: ChainNetwork, model: PickleModelJson.PickleModelJson, commsMgr2: CommsMgrV2): Promise<PlatformError[]> => {
  const errors: PlatformError[] = [];
  const jars = model.assets.jars.filter(
    (jar) => jar.chain === chain && jar.enablement === AssetEnablement.ENABLED
  );

  jars.filter((j) => !j.details.strategyAddr).forEach((z) => {
    errors.push(toError1(PickleProduct.PFCORE_HEALTH_CHECK, 29911, z.chain, z.details.apiKey,
        'FeeChecker/handleOneChain', 'No strategy for jar', '', ErrorSeverity.ERROR_5 ));
  });

  const provider = commsMgr2.getProvider(chain);
  const promises: Promise<PlatformError[]>[] = jars.map((jar) => handleOneJar(jar, provider));
  const s: PlatformError[][] = await Promise.all(promises);
  const flat = s.flat();
  return errors.concat(flat);
};

const handleOneJar = async (jar: JarDefinition, multiProvider: MultiProvider): Promise<PlatformError[]> => {
  const officialFee = calculateProperFee(jar);
  const ret: PlatformError[] = [];
  //console.log("Starting " + jar.details.apiKey);
  if (jar.protocol === AssetProtocol.YEARN) return;
  const stratAddr = jar.details.strategyAddr;
  if (!stratAddr) {
    return;
  }
  const abiWithCalls = getAbiWithCalls(jar);
  if (!abiWithCalls) {
    return;
  }
  const strat = new MultiContract(stratAddr, abiWithCalls.abi);
  //const [timelock] = await multiProvider.all([strat.timelock()]);
  const promises = abiWithCalls.fee.map(async (_, idx) => {
    const [perf, perfMax] = await multiProvider.all([
      strat[abiWithCalls.fee[idx]](),
      strat[abiWithCalls.max[idx]](),
    ]);
    const fee = perf.mul(100).div(perfMax).toNumber();
    if( fee !== officialFee ) {
      const err = toError1(PickleProduct.PFCORE_HEALTH_CHECK, 29912, jar.chain, jar.details.apiKey,
        'FeeChecker/handleOneJar', 'Incorrect fee for asset', 
        `Expecting ${officialFee} but got ${fee}`, ErrorSeverity.CRITICAL );
      ret.push(err);
      console.log(JSON.stringify(err));
    }
  });
  await Promise.all(promises);
  //console.log("Ending2 " + jar.details.apiKey);
  return ret;
};

const getAbiWithCalls = (jar: JarDefinition) => {
  let stratAbi = [
    "function performanceTreasuryFee() view returns(uint256)",
    "function performanceTreasuryMax() view returns(uint256)",
    "function timelock() view returns(address)",
  ];
  let fee = ["performanceTreasuryFee"];
  let max = ["performanceTreasuryMax"];
  let set = ["setPerformanceTreasuryFee"];
  const keyword = feeCallMap[jar.details.apiKey];
  if (keyword) {
    stratAbi = ["function timelock() view returns(address)"];
    fee = [];
    max = [];
    set = [];
    keyword.forEach((key) => {
      if (key === "IGNORE") return undefined;
      const tFee = `keep${key}`;
      const tMax = keyword.length > 1 ? "keepMax" : `keep${key}Max`;
      fee.push(tFee);
      max.push(tMax);
      set.push(`setKeep${key}`);
      stratAbi.push(
        `function ${tFee}() view returns(uint256)`,
        `function ${tMax}() view returns(uint256)`
      );
    });
  }
  return { abi: stratAbi, fee, max, set };
};

const calculateProperFee = (jar: JarDefinition): number => {
  /*
    Current Fee Structure
    - UniV3: 20% except stables (10%)
    - Folding: 20% 
    - Mainnet: 20%
    - Sidechains: 10%
    - Brineries: 30% (20% treasury, 10% veWrapper flywheel) TODO
  */
  const isV3 = (jar: JarDefinition) =>
    jar.protocol === AssetProtocol.UNISWAP_V3;
  const isFolding = (jar: JarDefinition) =>
    jar.protocol === AssetProtocol.TECTONIC ||
    jar.protocol === AssetProtocol.AAVE;
  const validateV3 = (jar: JarDefinition) => {
    const isStablePair = jar.depositToken.components.reduce((prev, cur) => {
      return stableIds.includes(cur) && prev;
    }, true);
    if (isStablePair) {
      return 10;
    }
    return 20;
  };

  if (isV3(jar)) return validateV3(jar);
  if (isFolding(jar)) return 20;

  switch (jar.chain) {
    case ChainNetwork.Ethereum:
      return 20;

    default:
      return 10;
  }
};