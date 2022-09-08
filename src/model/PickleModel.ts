import MasterchefAbi from "../Contracts/ABIs/masterchef.json";
import {
  AssetEnablement,
  AssetProjectedApr,
  AssetProtocol,
  AssetType,
  BrineryDefinition,
  DillDetails,
  ExternalAssetDefinition,
  HarvestStyle,
  HistoricalYield,
  IExternalToken,
  JarDefinition,
  PickleAsset,
  PickleModelJson,
  PlatformData,
  StandaloneFarmDefinition,
  XYK_SWAP_PROTOCOLS,
} from "./PickleModelJson";
import { BigNumber, BigNumberish, ethers, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import controllerAbi from "../Contracts/ABIs/controller.json";
import strategyAbi from "../Contracts/ABIs/strategy.json";
import jarAbi from "../Contracts/ABIs/jar.json";
import erc20Abi from "../Contracts/ABIs/erc20.json";
import univ3PoolAbi from "../Contracts/ABIs/univ3Pool.json";
import { ChainNetwork, Chains, RAW_CHAIN_BUNDLED_DEF } from "../chain/Chains";
import {
  ErrorLogger,
  ErrorSeverity,
  LocalError,
  PickleProduct,
  PlatformError,
} from "../core/platform/PlatformInterfaces";
import {
  ExternalToken,
  ExternalTokenFetchStyle,
  ExternalTokenModelSingleton,
} from "../price/ExternalTokenModel";
import { getDillDetails, getWeeklyDistribution } from "../dill/DillUtility";
import { JarBehaviorDiscovery } from "../behavior/JarBehaviorDiscovery";
import {
  AssetBehavior,
  ICustomHarvester,
  JarBehavior,
  JarHarvestStats,
} from "../behavior/JarBehaviorResolver";
import {
  IRawGaugeData,
  preloadRawGaugeData,
  RawGaugeChainMap,
  setGaugeAprData,
} from "../farms/FarmUtil";
import { getDepositTokenPrice } from "../price/DepositTokenPriceUtility";
import { setAllPricesOnTokens } from "./PriceCacheLoader";
import { timeout } from "../util/PromiseTimeout";
import { CommsMgrV2 } from "../util/CommsMgrV2";
import {
  MultiProvider,
  Contract as MultiContract,
  ContractCall,
} from "ethers-multiprovider";
import { IChain } from "..";

export interface PfDataStore {
  readData(key: string): Promise<string | undefined>;
  writeData(key: string, value: string): Promise<void>;
}

export const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
export const FICTIONAL_ADDRESS = "0x000FEED0BEEF000FEED0BEEF0000000000000000";

export const ADDRESSES = new Map([
  [
    ChainNetwork.Ethereum,
    {
      pickle: "0x429881672B9AE42b8EbA0E26cD9C73711b891Ca5",
      masterChef: "0xbD17B1ce622d73bD438b9E658acA5996dc394b0d",
      controller: "0x6847259b2B3A4c17e7c43C54409810aF48bA5210",
      dill: "0xbBCf169eE191A1Ba7371F30A1C344bFC498b29Cf",
      feeDistributor: "0x74C6CadE3eF61d64dcc9b97490d9FbB231e4BdCc",
      feeDistributorV2: "0x2c6C87E7E6195ab7A4f19d3CF31D867580Bb2a1b",
      gaugeProxy: "0x2e57627ACf6c1812F99e274d0ac61B786c19E74f",
      treasury: "0x066419eaef5de53cc5da0d8702b990c5bc7d1ab3",
    },
  ],
  [
    ChainNetwork.Polygon,
    {
      pickle: "0x2b88ad57897a8b496595925f43048301c37615da",
      masterChef: "0x20B2a3fc7B13cA0cCf7AF81A68a14CB3116E8749",
      controller: "0x83074F0aB8EDD2c1508D3F657CeB5F27f6092d09",
      minichef: "0x20B2a3fc7B13cA0cCf7AF81A68a14CB3116E8749",
      treasury: "0xeae55893cc8637c16cf93d43b38aa022d689fa62",
    },
  ],
  [
    ChainNetwork.Arbitrum,
    {
      pickle: "0x965772e0E9c84b6f359c8597C891108DcF1c5B1A",
      masterChef: "0x7ecc7163469f37b777d7b8f45a667314030ace24",
      controller: "0x55d5bcef2bfd4921b8790525ff87919c2e26bd03",
      minichef: "0x7ecc7163469f37b777d7b8f45a667314030ace24",
      treasury: "0xf02ceb58d549e4b403e8f85fbbaee4c5dfa47c01",
    },
  ],
  [
    ChainNetwork.OKEx,
    {
      pickle: NULL_ADDRESS,
      masterChef: NULL_ADDRESS,
      controller: "0xcf05d96b4c6c5a87b73f5f274dce1085bc7fdcc4",
      minichef: NULL_ADDRESS,
      treasury: "0xaCfE4511CE883C14c4eA40563F176C3C09b4c47C",
    },
  ],
  [
    ChainNetwork.Moonriver,
    {
      pickle: NULL_ADDRESS,
      masterChef: NULL_ADDRESS,
      controller: "0xc3f393fb40f8cc499c1fe7fa5781495dc6fac9e9",
      minichef: NULL_ADDRESS,
      treasury: "0xaCfE4511CE883C14c4eA40563F176C3C09b4c47C",
    },
  ],
  [
    ChainNetwork.Cronos,
    {
      pickle: NULL_ADDRESS,
      masterChef: NULL_ADDRESS,
      controller: "0xFa3Ad976c0bdeAdDe81482F5Fa8191aE1e7d84C0",
      minichef: NULL_ADDRESS,
    },
  ],
  [
    ChainNetwork.Aurora,
    {
      pickle: "0x291c8fceaca3342b29cc36171deb98106f712c66",
      masterChef: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
      controller: "0xdc954e7399e9ADA2661cdddb8D4C19c19E070A8E",
      minichef: "0x13cc0A2644f4f727db23f5B9dB3eBd72134085b7",
      treasury: "0xaCfE4511CE883C14c4eA40563F176C3C09b4c47C",
    },
  ],
  [
    ChainNetwork.Metis,
    {
      pickle: NULL_ADDRESS,
      masterChef: "0x22cE2F89d2efd9d4eFba4E0E51d73720Fa81A150",
      controller: "0xD556018E7b37e66f618A65737144A2ae2B98127f",
      minichef: "0x22cE2F89d2efd9d4eFba4E0E51d73720Fa81A150",
      rewarder: "0x57A319FBE114DC8bb0F1BaAaFB37FA6F308C639F",
      treasury: "0xaCfE4511CE883C14c4eA40563F176C3C09b4c47C",
    },
  ],
  [
    ChainNetwork.Moonbeam,
    {
      pickle: NULL_ADDRESS,
      masterChef: NULL_ADDRESS,
      controller: "0x95ca4584eA2007D578fa2693CCC76D930a96d165",
      minichef: NULL_ADDRESS,
      treasury: "0xaCfE4511CE883C14c4eA40563F176C3C09b4c47C",
    },
  ],
  [
    ChainNetwork.Optimism,
    {
      pickle: "0x0c5b4c92c948691EEBf185C17eeB9c230DC019E9",
      masterChef: "0x849C283375A156A6632E8eE928308Fcb61306b7B",
      controller: "0xa1d43d97fc5f1026597c67805aa02aae558e0fef",
      minichef: "0x849C283375A156A6632E8eE928308Fcb61306b7B",
      rewarder: "0xE039f8102319aF854fe11489a19d6b5d2799ADa7",
      treasury: "0x7A79e2e867d36a91Bb47e0929787305c95E793C5",
    },
  ],
  [
    ChainNetwork.Fantom,
    {
      pickle: NULL_ADDRESS,
      masterChef: NULL_ADDRESS,
      controller: "0xc335740c951F45200b38C5Ca84F0A9663b51AEC6",
      minichef: NULL_ADDRESS,
      treasury: "0xe4ee7edddbebda077975505d11decb16498264fb",
    },
  ],
  [
    ChainNetwork.Gnosis,
    {
      pickle: NULL_ADDRESS,
      masterChef: NULL_ADDRESS,
      controller: "0xe5E231De20C68AabB8D669f87971aE57E2AbF680",
      minichef: NULL_ADDRESS,
      treasury: "0xaCfE4511CE883C14c4eA40563F176C3C09b4c47C",
    },
  ],

  // ADD_CHAIN
]);

export let GLOBAL_DEBUG_FLAG = false;
export const DEBUG_OUT = (str: string): void => {
  if (GLOBAL_DEBUG_FLAG) console.log("[" + Date.now() + "] " + str);
};
export const setDebugMode = (val: boolean): void => {
  GLOBAL_DEBUG_FLAG = val;
}

export class PickleModel implements ErrorLogger {
  private allErrors: PlatformError[] = [];
  private allAssets: PickleAsset[];
  private dillDetails: DillDetails;
  private ppb: BigNumber;
  private platformData: PlatformData;
  private gaugeMap: RawGaugeChainMap;
  // A persistent data store for sharing data that is common to all executions
  private permanentDataStore: PfDataStore;
  private logger: ErrorLogger;
  // A non-persistent cache that can share data within a single execution
  resourceCache: Map<string, any>;
  private configuredChains: ChainNetwork[];
  private minimalMode = false;
  commsMgr2: CommsMgrV2 = new CommsMgrV2();
  private previousPfcore: PickleModelJson | undefined = undefined;

  constructor(
    allAssets: PickleAsset[],
    chains: Map<ChainNetwork, Provider | Signer>,
  ) {
    // Make a copy so the original definitions stay unchanged.
    this.allAssets = JSON.parse(JSON.stringify(allAssets));
    this.initializeChains(chains);
    this.resourceCache = new Map<string, any>();
  }

  /**
   * Set a previous pfcore implementation to use as sensible defaults if
   * critical parts of the run fail
   * @param previous
   */
  setPreviousPFCore(previous: PickleModelJson): void {
    this.previousPfcore = previous;
  }

  setErrorLogger(logger: ErrorLogger): void {
    this.logger = logger;
  }

  setDataStore(dataStore: PfDataStore): void {
    this.permanentDataStore = dataStore;
  }

  getErrors(): PlatformError[] {
    return this.allErrors;
  }

  getDataStore(): PfDataStore {
    return this.permanentDataStore
      ? this.permanentDataStore
      : // Return a no-op data store
        {
          readData(_key: string): Promise<string> {
            return undefined;
          },
          writeData(_key: string, _value: string): Promise<void> {
            // do nothing
            return;
          },
        };
  }

  static fromJson(
    json: PickleModelJson,
    chains: Map<ChainNetwork, Provider | Signer>,
  ): PickleModel {
    const allAssets = json.assets.external
      .concat(json.assets.jars)
      .concat(json.assets.standaloneFarms);
    const model: PickleModel = new PickleModel(allAssets, chains);
    //model.setPrices(json.prices);
    return model;
  }

  getHarvesterForAsset(
    definition: PickleAsset,
    signer: Signer,
    properties: any,
  ): ICustomHarvester | undefined {
    const beh: AssetBehavior<PickleAsset> =
      new JarBehaviorDiscovery().findAssetBehavior(definition);
    if (beh) {
      const ret = beh.getCustomHarvester(definition, this, signer, properties);
      if (ret) return ret;
    }
    return undefined;
  }
  getJars(): JarDefinition[] {
    const arr: PickleAsset[] = this.allAssets.filter(
      (x) => x.type === AssetType.JAR,
    );
    return arr as JarDefinition[];
  }

  getStandaloneFarms(): StandaloneFarmDefinition[] {
    const arr: PickleAsset[] = this.allAssets.filter(
      (x) => x.type === AssetType.STANDALONE_FARM,
    );
    return arr as StandaloneFarmDefinition[];
  }

  getBrineries(): BrineryDefinition[] {
    const arr: PickleAsset[] = this.allAssets.filter(
      (x) => x.type === AssetType.BRINERY,
    );
    return arr as BrineryDefinition[];
  }

  getExternalAssets(): ExternalAssetDefinition[] {
    const arr: PickleAsset[] = this.allAssets.filter(
      (x) => x.type === AssetType.EXTERNAL,
    );
    return arr as ExternalAssetDefinition[];
  }

  semiActiveJars(chain: ChainNetwork): JarDefinition[] {
    return this.getJars().filter(
      (x) =>
        x.chain === chain &&
        x.enablement !== AssetEnablement.PERMANENTLY_DISABLED,
    );
  }

  semiActiveAssets(chain: ChainNetwork): PickleAsset[] {
    return []
      .concat(
        this.getJars().filter(
          (x) =>
            x.chain === chain &&
            x.enablement !== AssetEnablement.PERMANENTLY_DISABLED,
        ),
      )
      .concat(
        this.getStandaloneFarms().filter(
          (x) =>
            x.chain === chain &&
            x.enablement !== AssetEnablement.PERMANENTLY_DISABLED,
        ),
      );
  }

  getAllAssets(): PickleAsset[] {
    return this.allAssets;
  }

  // Results unpredictable if similar token on multiple chains.
  // Please be specific, use address()
  addr(name: string): string {
    for (let i = 0; i < this.configuredChains.length; i++) {
      const t1 = ExternalTokenModelSingleton.getToken(
        name,
        this.configuredChains[i],
      )?.contractAddr;
      if (t1 !== undefined) return t1;
    }
    return undefined;
  }
  address(id: string, chain: ChainNetwork): string {
    return ExternalTokenModelSingleton.getToken(id, chain)?.contractAddr;
  }
  tokenDecimals(id: string, chain: ChainNetwork): number {
    return ExternalTokenModelSingleton.getToken(id, chain)?.decimals;
  }
  /**
   * @param token The token to look-up the price for. Can be an address, ID, or cgID.
   * @param chain The chain on which the token is.
   * @returns Returns the token price || `undefined` if token price not found.
   */
  priceOfSync(token: string, chain: ChainNetwork): number {
    const chainTokens = ExternalTokenModelSingleton.getTokens(chain);
    let tokenObj: ExternalToken = undefined;
    if (chain && !ethers.utils.isAddress(token)) {
      // This is a label, not an address. Find the first one you can with a price
      tokenObj = chainTokens.find(
        (x) =>
          x.id === token || (x.coingeckoId === token && x.price !== undefined),
      );
      if (tokenObj === undefined) {
        // even if it's not on the right chain.
        tokenObj = ExternalTokenModelSingleton.getAllTokens().find(
          (x) =>
            x.id === token ||
            (x.coingeckoId === token && x.price !== undefined),
        );
      }
    } else {
      // It's looking for a contract address. Most of these requests will be in the external tokens.
      tokenObj = chainTokens.find(
        (x) =>
          x.contractAddr.toLowerCase() === token.toLowerCase() &&
          x.price !== undefined,
      );
      if (tokenObj === undefined) {
        // But some of them may be deposit tokens
        const depositTokenMatch = this.allAssets.find(
          (x) =>
            x.depositToken &&
            x.depositToken.addr &&
            x.depositToken.addr.toLowerCase() === token.toLowerCase(),
        );
        if (depositTokenMatch) {
          const p = depositTokenMatch.depositToken?.price;
          return p !== undefined ? p : undefined;
        }
      }
    }
    if (tokenObj && tokenObj.price !== undefined) return tokenObj.price;
    return undefined;
  }

  multiproviderFor(network: ChainNetwork): MultiProvider {
    return this.commsMgr2.getProvider(network);
  }
  getResourceCache(): Map<string, any> {
    return this.resourceCache;
  }

  defaultControllerForChain(chain: ChainNetwork): string | undefined {
    const addrObj = ADDRESSES.get(chain);
    return addrObj ? addrObj.controller : undefined;
  }

  controllerForJar(jar: JarDefinition): string | undefined {
    return jar.details?.controller
      ? jar.details.controller
      : this.defaultControllerForChain(jar.chain);
  }

  findAsset(id: string): PickleAsset {
    for (let i = 0; i < this.allAssets.length; i++) {
      if (this.allAssets[i].id === id) return this.allAssets[i];
    }
    return undefined;
  }

  getNativeComponent(
    components: string[],
    chain: ChainNetwork,
  ): ExternalToken | undefined {
    if (!components) {
      return undefined;
    }
    for (let i = 0; i < components.length; i++) {
      const token = ExternalTokenModelSingleton.getToken(components[i], chain);
      if (!token) {
        console.log(
          "Cannot find token " + components[i] + " on chain " + chain,
        );
      } else if (token.isNativeToken) {
        return token;
      }
    }
  }

  loadSwapData(): void {
    DEBUG_OUT("Begin loadSwapData");
    const start = Date.now();

    for (let i = 0; i < this.allAssets.length; i++) {
      const chain = this.allAssets[i].chain;
      const protocol = this.allAssets[i].protocol;

      const swapProtocol = XYK_SWAP_PROTOCOLS.find((x) => {
        return x.protocol == protocol && x.chain == chain;
      });

      // Add path for native pairs
      const nativeComponent = this.getNativeComponent(
        this.allAssets[i].depositToken.components,
        chain,
      );

      // Guard clause 1
      if (!swapProtocol || !nativeComponent) continue;

      this.allAssets[i].depositToken.nativePath = {
        target: nativeComponent.contractAddr,
        path: [],
      };
    }
    DEBUG_OUT("End loadSwapData: " + (Date.now() - start));
  }

  /**
   * @TODO Let CommsMgr decide on the live chains. It has access to more RPCs
   */
  async checkConfiguredChainsConnections(): Promise<void> {
    const liveChains: ChainNetwork[] = [];
    const promises = this.configuredChains.map(async (chain) => {
      const provider = Chains.get(chain).getPreferredWeb3Provider();
      try {
        await provider.getNetwork();
        liveChains.push(chain);
      } catch (error) {
        this.logPlatformError(
          toError(
            100100,
            chain,
            "",
            "setConfiguredChains",
            `[${chain}] RPC is dead`,
            "" + error,
            ErrorSeverity.ERROR_5,
          ),
        );
      }
    });
    try {
      await Promise.all(promises);
    } catch (err) {
      this.logPlatformError(
        toError(
          100101,
          undefined,
          "",
          "setConfiguredChains",
          `Unexpected Error`,
          "" + err,
          ErrorSeverity.CRITICAL,
        ),
      );
    }
    this.setConfiguredChains(liveChains);
  }

  async initCommsMgr(): Promise<void> {
    try {
      await this.commsMgr2.init(this.configuredChains);
    } catch (err) {
      this.logPlatformError(
        toError(
          100110,
          undefined,
          "",
          "initCommsMgr",
          `Unexpected Error`,
          "" + err,
          ErrorSeverity.CRITICAL,
        ),
      );
    }
  }
  async generateFullApi(): Promise<PickleModelJson> {
    await this.checkConfiguredChainsConnections();
    await this.initCommsMgr();
    await this.loadJarAndFarmDataWrapper();
    this.dillDetails = await getDillDetails(
      getWeeklyDistribution(this.getJars()),
      this.priceOfSync("pickle", ChainNetwork.Ethereum),
      this.priceOfSync("weth", ChainNetwork.Ethereum),
      this.ppb,
      this,
      ChainNetwork.Ethereum,
    );
    this.platformData = await this.loadPlatformData();
    await this.commsMgr2.stop();
    return this.toJson();
  }

  async generateMinimalApi(): Promise<PickleModelJson> {
    await this.checkConfiguredChainsConnections();
    await this.commsMgr2.init(this.configuredChains);
    this.minimalMode = true;
    await this.loadJarAndFarmData();
    await this.commsMgr2.stop();
    return this.toJson();
  }

  async loadJarAndFarmDataWrapper(): Promise<void> {
    try {
      await this.loadJarAndFarmData();
    } catch (err) {
      this.logPlatformError(
        toError(
          100120,
          undefined,
          "",
          "loadJarAndFarmDataWrapper",
          `Unexpected Error`,
          "" + err,
          ErrorSeverity.CRITICAL,
        ),
      );
    }
  }

  async loadJarAndFarmData(): Promise<void> {
    DEBUG_OUT("Begin loadJarAndFarmData");
    const start = Date.now();
    this.loadSwapData();

    await Promise.all([
      this.loadPicklePerBlock(),
      this.ensurePriceCacheLoaded(),
      this.loadStrategyData(),
      this.loadRatiosData(),
      this.loadJarTotalSupplyData(),
      this.loadDepositTokenTotalSupplyData(),
      this.loadJarBalanceData(),
      this.ensureComponentTokensLoaded(),
    ]);

    const asOne = async (): Promise<any> => {
      await this.ensureDepositTokenPriceLoaded();
      await this.ensureFarmsBalanceLoaded();
      await this.ensureExternalAssetBalanceLoaded();
    };
    await Promise.all([asOne(), this.preloadRawGaugeDataJob()]);

    await this.setGaugeAprDataOnAsset();
    await Promise.all([
      this.ensureHarvestDataLoaded(),
      this.loadApyComponents(),
      this.loadProtocolApr(),
    ]);

    await this.loadBrineryData();
    DEBUG_OUT("End loadJarAndFarmData: " + (Date.now() - start));
  }

  brineryFilter(asset: PickleAsset): boolean {
    return (
      new JarBehaviorDiscovery().findAssetBehavior(asset) !== undefined &&
      asset.enablement !== AssetEnablement.PERMANENTLY_DISABLED &&
      asset.type == AssetType.BRINERY
    );
  }

  async loadBrineryData(): Promise<void> {
    DEBUG_OUT("Begin loadBrineryData");
    const start = Date.now();

    const brineriesWithBehaviors: PickleAsset[] = this.allAssets
      .filter((x) => this.brineryFilter(x))
      .filter((x) => this.configuredChains.includes(x.chain));

    try {
      const brineryAprs = await Promise.all(
        brineriesWithBehaviors.map((asset) => {
          const ret: Promise<AssetProjectedApr> = new JarBehaviorDiscovery()
            .findAssetBehavior(asset)
            .getProjectedAprStats(asset as JarDefinition, this);
          return ret;
        }),
      );
      for (let i = 0; i < brineriesWithBehaviors.length; i++) {
        brineriesWithBehaviors[i].aprStats = this.cleanAprStats(brineryAprs[i]);
      }
    } catch (error) {
      this.logPlatformError(
        toError(
          100200,
          undefined,
          "",
          "loadBrineryData",
          `Multiple Assets Affected: Promise.all`,
          "" + error,
          ErrorSeverity.ERROR_5,
        ),
      );
    }

    DEBUG_OUT("End loadBrineryData: " + (Date.now() - start));
  }

  toJson(): PickleModelJson {
    const ret: PickleModelJson = {
      chains: RAW_CHAIN_BUNDLED_DEF,
      tokens: ExternalTokenModelSingleton.getAllTokensOutput(),
      prices: this.createLegacyPriceCacheTemporary(),
      dill: this.dillDetails,
      platform: this.platformData,
      xykSwapProtocols: XYK_SWAP_PROTOCOLS,
      assets: {
        jars: this.getJars(),
        standaloneFarms: this.getStandaloneFarms(),
        brineries: this.getBrineries(),
        external: this.getExternalAssets(),
      },
      timestamp: Date.now(),
    };
    return ret;
  }

  /*
   * Once priceCache is determined not to be used in UI or api or harvestbot,
   * this function can be removed
   * This map will have bugs and collisions. It is not to be trusted.
   */
  createLegacyPriceCacheTemporary(): { [key: string]: number } {
    const ret: { [key: string]: number } = {};
    const tokens: ExternalToken[] = ExternalTokenModelSingleton.getAllTokens();
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].price !== undefined) {
        ret[tokens[i].id] = tokens[i].price;
        ret[tokens[i].coingeckoId] = tokens[i].price;
        ret[tokens[i].contractAddr] = tokens[i].price;
      }
    }
    return ret;
  }

  initializeChains(chains: Map<ChainNetwork, Provider | Signer>) {
    const allChains: ChainNetwork[] = Chains.list();
    Chains.globalInitialize(chains);
    this.setConfiguredChains(allChains);
  }

  setConfiguredChains(chains: ChainNetwork[]) {
    this.configuredChains = chains;
  }

  async loadPicklePerBlock(): Promise<void> {
    const multiProvider = this.multiproviderFor(ChainNetwork.Ethereum);
    const masterChef = ADDRESSES.get(ChainNetwork.Ethereum)?.masterChef;
    let ppb = BigNumber.from(0);
    if (masterChef) {
      const contract = new MultiContract(masterChef, MasterchefAbi);
      try {
        ppb = await multiProvider
          .all([contract.picklePerBlock()])
          .then((x) => x[0]);
      } catch (error) {
        this.logPlatformError(
          toError(
            105000,
            ChainNetwork.Ethereum,
            "",
            "loadPicklePerBlock",
            "",
            "" + error,
            ErrorSeverity.ERROR_4,
          ),
        );
      }
    }
    this.ppb = ppb.mul(3);
  }

  async ensurePriceCacheLoaded(): Promise<any> {
    DEBUG_OUT("Begin ensurePriceCacheLoaded");
    const start = Date.now();
    try {
      await setAllPricesOnTokens(this.configuredChains, this);
    } catch (error) {
      this.logPlatformError(
        toError(
          100130,
          undefined,
          "",
          "setAllPricesOnTokens",
          `Unexpected Error`,
          "" + error,
          ErrorSeverity.CRITICAL,
        ),
      );
      console.log("Error loading prices: " + error);
    }

    // Show errors for missing token prices
    const missingTokenPrice = (t: ExternalToken): boolean =>
      t.fetchType !== ExternalTokenFetchStyle.NONE &&
      (t.price === undefined || t.price === null || isNaN(t.price));
    const prevTokenPrice = (t: ExternalToken): number | undefined => {
      const prevToken: IExternalToken | undefined =
        this.previousPfcore && this.previousPfcore.tokens
          ? this.previousPfcore.tokens.find(
              (x) =>
                x.chain === t.chain &&
                x.contractAddr === t.contractAddr &&
                x.decimals === t.decimals,
            )
          : undefined;
      return prevToken &&
        prevToken.price !== undefined &&
        prevToken.price !== null
        ? prevToken.price
        : undefined;
    };

    const allTokens: ExternalToken[] =
      ExternalTokenModelSingleton.getAllTokens();
    const checkPrevious = this.previousPfcore && this.previousPfcore.tokens;
    for (let i = 0; i < allTokens.length; i++) {
      const t = allTokens[i];
      if (missingTokenPrice(t)) {
        if (checkPrevious) {
          const nPrice = prevTokenPrice(t);
          if (nPrice !== undefined) {
            t.price = nPrice;
          } else {
            const msg =
              "Current price AND previous price for token not found: " +
              JSON.stringify(t);
            this.logPlatformError(
              toError(
                100131,
                undefined,
                "",
                "setAllPricesOnTokens/2",
                `Previous Price Not Found`,
                msg,
                ErrorSeverity.CRITICAL,
              ),
            );
          }
        } else {
          const msg = "Current price for token not found: " + JSON.stringify(t);
          this.logPlatformError(
            toError(
              100131,
              undefined,
              "",
              "setAllPricesOnTokens/2",
              `Current Price Not Found`,
              msg,
              ErrorSeverity.CRITICAL,
            ),
          );
        }
      }
    }
    DEBUG_OUT("End ensurePriceCacheLoaded: " + (Date.now() - start));
  }

  async loadStrategyData(): Promise<any> {
    DEBUG_OUT("Begin loadStrategyData");
    const start = Date.now();
    const jars: JarDefinition[] = this.getJars();
    const promises: Promise<any>[] = [];
    for (let i = 0; i < this.configuredChains.length; i++) {
      const controller = this.defaultControllerForChain(
        this.configuredChains[i],
      );
      const chainJars = jars.filter(
        (x) =>
          x.chain === this.configuredChains[i] &&
          x.details?.controller === undefined &&
          x.enablement !== AssetEnablement.PERMANENTLY_DISABLED,
      );
      promises.push(
        this.addJarStrategies(chainJars, controller, this.configuredChains[i]),
      );
    }

    // Now handle jars with custom controllers on configured chains
    const customControllerJars = jars
      .filter(
        (x) =>
          x.details?.controller !== undefined &&
          x.enablement !== AssetEnablement.PERMANENTLY_DISABLED,
      )
      .filter((x) => this.configuredChains.includes(x.chain));

    for (let i = 0; i < customControllerJars.length; i++) {
      promises.push(
        this.addJarStrategies(
          [customControllerJars[i]],
          customControllerJars[i].details.controller,
          customControllerJars[i].chain,
        ),
      );
    }
    try {
      return Promise.all(promises);
    } catch (error) {
      this.logPlatformError(
        toError(
          100300,
          undefined,
          "",
          "loadStrategyData",
          `Multiple Assets Affected: Promise.all`,
          "" + error,
          ErrorSeverity.ERROR_5,
        ),
      );
    } finally {
      DEBUG_OUT("End loadStrategyData: " + (Date.now() - start));
    }
  }

  async loadRatiosData(): Promise<any> {
    DEBUG_OUT("Begin loadRatiosData");
    const start = Date.now();
    const promises = this.configuredChains.map((x) =>
      this.addJarRatios(this.semiActiveJars(x), x),
    );
    try {
      await Promise.all(promises);
    } catch (err) {
      this.logPlatformError(
        toError(
          100610,
          undefined,
          "",
          "loadRatiosData",
          "Multiple Chains Affected: Promise.all",
          "" + err,
          ErrorSeverity.SEVERE,
        ),
      );
    }

    DEBUG_OUT("End loadRatiosData: " + (Date.now() - start));
  }

  async loadJarTotalSupplyData(): Promise<any> {
    DEBUG_OUT("Begin loadJarTotalSupplyData");
    const start = Date.now();
    const prom = this.configuredChains.map((x) =>
      this.addJarTotalSupply(this.semiActiveJars(x), x),
    );

    try {
      const r = await Promise.all(prom);
      return r;
    } catch (err) {
      this.logPlatformError(
        toError(
          101499,
          undefined,
          "",
          "loadJarTotalSupplyData/1",
          "Multiple Chains Affected: Promise.all",
          "" + err,
          ErrorSeverity.SEVERE,
        ),
      );
    } finally {
      DEBUG_OUT("End loadJarTotalSupplyData: " + (Date.now() - start));
    }
  }

  async ensureComponentTokensLoaded(): Promise<any> {
    DEBUG_OUT("Begin ensureComponentTokensLoaded");
    const start = Date.now();
    const promises = this.configuredChains.map((x) =>
      this.ensureComponentTokensLoadedForChain(x),
    );
    try {
      const r = await Promise.all(promises);
      return r;
    } catch (err) {
      this.logPlatformError(
        toError(
          100499,
          undefined,
          "",
          "ensureComponentTokensLoaded/1",
          "Multiple Chains Affected: Promise.all",
          "" + err,
          ErrorSeverity.SEVERE,
        ),
      );
    } finally {
      DEBUG_OUT("End ensureComponentTokensLoaded: " + (Date.now() - start));
    }
  }

  async ensureComponentTokensLoadedForChain(
    chain: ChainNetwork,
  ): Promise<void> {
    interface requests {
      asset: PickleAsset;
      pool: string;
      token: string;
      tokenName: string;
      result?: BigNumberish;
    }
    const arr: requests[] = [];
    const assets = this.getAllAssets().filter((x) => x.chain === chain);
    if (assets.length === 0) return;

    for (let i = 0; i < assets.length; i++) {
      if (
        assets[i].depositToken &&
        assets[i].depositToken.components &&
        assets[i].depositToken.components.length > 0
      ) {
        for (let j = 0; j < assets[i].depositToken.components.length; j++) {
          arr.push({
            asset: assets[i],
            pool: assets[i].depositToken.addr,
            tokenName: assets[i].depositToken.components[j],
            token: this.address(assets[i].depositToken.components[j], chain),
          });
        }
      }
    }

    const multiProvider = this.multiproviderFor(chain);
    let results: string[] = undefined;
    try {
      results = await multiProvider.all(
        arr.map((oneArr) =>
          new MultiContract(oneArr.token, erc20Abi).balanceOf(oneArr.pool),
        ),
      );
    } catch (error) {
      this.logPlatformError(
        toError(
          100400,
          undefined,
          "",
          "ensureComponentTokensLoadedForChain",
          "Multiple Assets Affected: Promise.all",
          "" + error,
          ErrorSeverity.ERROR_5,
        ),
      );
    }

    for (let i = 0; results !== undefined && i < results.length; i++) {
      if (arr[i].asset.depositToken.componentTokens === undefined) {
        arr[i].asset.depositToken.componentTokens = [];
      }
      const decimals = this.tokenDecimals(arr[i].token, arr[i].asset.chain);
      arr[i].asset.depositToken.componentTokens.push(
        parseFloat(ethers.utils.formatUnits(results[i], decimals)),
      );
    }
  }

  async loadDepositTokenTotalSupplyData(): Promise<any> {
    DEBUG_OUT("Begin loadDepositTokenTotalSupplyData");
    const start = Date.now();
    const promises = this.configuredChains.map((x) =>
      this.addDepositTokenTotalSupply(this.semiActiveJars(x), x),
    );
    try {
      const r = await Promise.all(promises);
      return r;
    } catch (err) {
      this.logPlatformError(
        toError(
          101599,
          undefined,
          "",
          "loadDepositTokenTotalSupplyData/1",
          "Multiple Chains Affected: Promise.all",
          "" + err,
          ErrorSeverity.SEVERE,
        ),
      );
    } finally {
      DEBUG_OUT("End loadDepositTokenTotalSupplyData: " + (Date.now() - start));
    }
  }

  async loadJarBalanceData(): Promise<any> {
    DEBUG_OUT("Begin loadJarBalanceData");
    const start = Date.now();
    const promises = this.configuredChains.map((x) =>
      this.addDepositTokenBalance(this.semiActiveJars(x), x),
    );
    try {
      const r = await Promise.all(promises);
      return r;
    } catch (err) {
      this.logPlatformError(
        toError(
          100799,
          undefined,
          "",
          "loadJarBalanceData/1",
          "Multiple Chains Affected: Promise.all",
          "" + err,
          ErrorSeverity.SEVERE,
        ),
      );
    } finally {
      DEBUG_OUT("End loadJarBalanceData: " + (Date.now() - start));
    }
  }

  // Could this be moved to the asset behaviors instead??
  async ensureDepositTokenPriceLoaded(): Promise<void> {
    DEBUG_OUT("Begin ensureDepositTokenPriceLoaded");
    const start = Date.now();
    const notDisabled: PickleAsset[] = this.allAssets
      .filter((jar) => {
        return jar.enablement !== AssetEnablement.PERMANENTLY_DISABLED;
      })
      .filter((x) => this.configuredChains.includes(x.chain));

    try {
      await Promise.all(
        this.configuredChains.map((x) =>
          this.ensureDepositTokenPriceLoadedOneChain(
            x,
            notDisabled.filter((z) => z.chain === x),
          ),
        ),
      );
    } catch (error) {
      this.logPlatformError(
        toError(
          100500,
          undefined,
          "",
          "ensureDepositTokenPriceLoaded",
          "Multiple Assets Affected: Promise.all",
          "" + error,
          ErrorSeverity.ERROR_5,
        ),
      );
    }
    DEBUG_OUT("End ensureDepositTokenPriceLoaded: " + (Date.now() - start));
  }

  async ensureDepositTokenPriceLoadedOneChain(
    chain: ChainNetwork,
    assets: PickleAsset[],
  ): Promise<void> {
    DEBUG_OUT("Begin ensureDepositTokenPriceLoadedOneChain: " + chain);
    const start = Date.now();

    const tmpArray: Promise<void>[] = [];
    for (let i = 0; i < assets.length; i++) {
      tmpArray.push(
        this.ensureDepositTokenLoadedOneJar(assets[i] as JarDefinition),
      );
    }
    await Promise.all(tmpArray);
    DEBUG_OUT(
      "End ensureDepositTokenPriceLoadedOneChain: " +
        chain +
        ": " +
        (Date.now() - start),
    );
  }

  async ensureDepositTokenLoadedOneJar(asset: PickleAsset): Promise<void> {
    DEBUG_OUT("Begin ensureDepositTokenLoadedOneJar: " + asset.details.apiKey);
    const start = Date.now();
    try {
      const jarBehaviorResolver = new JarBehaviorDiscovery();
      const beh = jarBehaviorResolver.findAssetBehavior(asset);
      const val: number = await (beh
        ? beh.getDepositTokenPrice(asset, this)
        : getDepositTokenPrice(asset, this));
      asset.depositToken.price = val;
      //this.prices.put(asset.depositToken.addr, val);
    } catch (error) {
      this.logPlatformError(
        toError(
          100501,
          asset.chain,
          asset.details.apiKey,
          "ensureDepositTokenPriceLoaded",
          "",
          "" + error,
          ErrorSeverity.ERROR_3,
        ),
      );
    }
    DEBUG_OUT(
      "End ensureDepositTokenLoadedOneJar: " +
        asset.details.apiKey +
        ": " +
        (Date.now() - start),
    );
  }

  // All jars called here must be on the same chain.
  async addJarStrategies(
    jars: JarDefinition[],
    controllerAddr: string,
    chain: ChainNetwork,
  ): Promise<void> {
    if (!jars || jars.length === 0) return;
    const controllerContract = new MultiContract(controllerAddr, controllerAbi);

    const multiProvider = this.multiproviderFor(chain);
    let strategyAddresses: string[] = undefined;
    try {
      strategyAddresses = await multiProvider.all(
        jars.map((oneJar) =>
          controllerContract.strategies(oneJar.depositToken.addr),
        ),
      );
    } catch (error) {
      this.logPlatformError(
        toError(
          100310,
          chain,
          "",
          "addJarStrategies/strategyAddresses/1",
          "Multiple Assets Affected: Promise.all",
          "" + error,
          ErrorSeverity.ERROR_5,
        ),
      );
    }
    for (let i = 0; strategyAddresses !== undefined && i < jars.length; i++) {
      if (jars[i].details === undefined) {
        jars[i].details = {
          apiKey: undefined,
          harvestStyle: HarvestStyle.PASSIVE,
        };
      }
      jars[i].details.strategyAddr = strategyAddresses[i];
    }

    const withStrategyAddresses = jars.filter(
      (x) =>
        x.details.strategyAddr !== undefined &&
        x.details.strategyAddr !== NULL_ADDRESS &&
        x.enablement !== AssetEnablement.PERMANENTLY_DISABLED,
    );

    let strategyNames: string[] = undefined;
    try {
      strategyNames = await multiProvider.all(
        withStrategyAddresses.map((oneJar) =>
          new MultiContract(oneJar.details.strategyAddr, strategyAbi).getName(),
        ),
      );
    } catch (error) {
      this.logPlatformError(
        toError(
          100311,
          chain,
          "",
          "addJarStrategies/strategyAddresses/2",
          "Multiple Assets Affected: Promise.all",
          "" + error,
          ErrorSeverity.ERROR_5,
        ),
      );
    }
    for (
      let i = 0;
      strategyNames !== undefined && i < withStrategyAddresses.length;
      i++
    ) {
      withStrategyAddresses[i].details.strategyName = strategyNames[i];
    }
  }

  // All jars must be on same chain
  async addJarRatios(
    jars: JarDefinition[],
    chain: ChainNetwork,
  ): Promise<void> {
    if (jars === undefined || jars.length === 0) return;

    const multiProvider = this.multiproviderFor(chain);
    let ratios: string[] = undefined;
    try {
      ratios = await multiProvider.all(
        jars.map((oneJar) =>
          new MultiContract(oneJar.contract, jarAbi).getRatio(),
        ),
      );
    } catch (error) {
      this.logPlatformError(
        toError(
          100600,
          chain,
          "",
          "addJarRatios/ratios",
          "Multiple Assets Affected: Promise.all",
          "" + error,
          ErrorSeverity.ERROR_5,
        ),
      );
    }
    for (let i = 0; ratios !== undefined && i < jars.length; i++) {
      jars[i].details.ratio = parseFloat(ethers.utils.formatUnits(ratios[i]));
    }
  }

  // All jars must be on same chain
  async addJarTotalSupply(
    jars: JarDefinition[],
    chain: ChainNetwork,
  ): Promise<void> {
    if (jars === undefined || jars.length === 0) return;

    const multiProvider = this.multiproviderFor(chain);
    let supply: string[] = undefined;
    try {
      supply = await multiProvider.all(
        jars.map((oneJar) =>
          new MultiContract(oneJar.contract, jarAbi).totalSupply(),
        ),
      );
    } catch (error) {
      this.logPlatformError(
        toError(
          101400,
          chain,
          "",
          "addJarTotalSupply/1",
          "Multiple Assets Affected: Promise.all",
          "" + error,
          ErrorSeverity.ERROR_5,
        ),
      );
      console.log("Failed on addJarTotalSupply");
    }
    for (let i = 0; supply !== undefined && i < jars.length; i++) {
      jars[i].details.totalSupply = parseFloat(
        ethers.utils.formatUnits(supply[i], jars[i].details.decimals),
      );
    }
  }

  // All jars must be on same chain
  async addJarTimestamp(
    jars: JarDefinition[],
    chain: ChainNetwork,
  ): Promise<void> {
    if (jars === undefined || jars.length === 0) return;

    let timestamp: number[] = undefined;
    try {
      const multiProvider = this.multiproviderFor(chain);
      timestamp = (
        await Promise.all(
          jars.map((oneJar) => multiProvider.getBlock(oneJar.startBlock)),
        )
      ).map((x) => x.timestamp);
    } catch (error) {
      const e1 =
        "Failed to acquire start blocks and timestamps for chain " + chain;
      this.logPlatformError(
        toError(
          106000,
          chain,
          "",
          "addJarTimestamp",
          e1,
          e1,
          ErrorSeverity.ERROR_2,
        ),
      );
    }
    for (let i = 0; timestamp !== undefined && i < jars.length; i++) {
      jars[i].startTimestamp = timestamp[i];
    }
  }

  async addDepositTokenBalance(
    jars: JarDefinition[],
    chain: ChainNetwork,
  ): Promise<void> {
    if (jars === undefined || jars.length === 0) return;

    const multiProvider = this.multiproviderFor(chain);
    let balance: string[] = undefined;
    try {
      balance = await multiProvider.all(
        jars.map((oneJar) =>
          oneJar.protocol === AssetProtocol.UNISWAP_V3
            ? new MultiContract(oneJar.contract, jarAbi).totalLiquidity()
            : new MultiContract(oneJar.contract, jarAbi).balance(),
        ),
      );
    } catch (error) {
      this.logPlatformError(
        toError(
          100700,
          chain,
          "",
          "addDepositTokenBalance",
          "Multiple Assets Affected: Promise.all",
          "" + error,
          ErrorSeverity.ERROR_5,
        ),
      );
    }
    for (let i = 0; balance !== undefined && i < jars.length; i++) {
      jars[i].details.tokenBalance = parseFloat(
        ethers.utils.formatUnits(
          balance[i],
          jars[i].details.decimals ? jars[i].details.decimals : 18,
        ),
      );
    }
  }

  async addDepositTokenTotalSupply(
    jars: PickleAsset[],
    chain: ChainNetwork,
  ): Promise<void> {
    if (jars === undefined || jars.length === 0) return;

    const multiProvider = this.multiproviderFor(chain);
    let supply: string[] = undefined;
    try {
      supply = await multiProvider.all(
        jars.map((oneJar) =>
          oneJar.protocol === AssetProtocol.UNISWAP_V3
            ? new MultiContract(
                oneJar.depositToken.addr,
                univ3PoolAbi,
              ).liquidity()
            : new MultiContract(
                oneJar.depositToken.addr,
                erc20Abi,
              ).totalSupply(),
        ),
      );
    } catch (error) {
      console.log("Failed on addDepositTokenTotalSupply");
    }
    for (let i = 0; supply !== undefined && i < jars.length; i++) {
      jars[i].depositToken.totalSupply = parseFloat(
        ethers.utils.formatUnits(supply[i], jars[i].depositToken.decimals),
      );
    }
  }

  async ensureHarvestDataLoaded(): Promise<any> {
    DEBUG_OUT("Begin ensureHarvestDataLoaded");
    const start = Date.now();
    const map: Map<ChainNetwork, JarDefinition[]> = new Map();
    for (let i = 0; i < this.configuredChains.length; i++) {
      const missing: JarDefinition[] = [];
      const jars = this.getJars().filter(
        (x) => x.chain === this.configuredChains[i],
      );
      for (let j = 0; j < jars.length; j++) {
        if (
          jars[j].enablement !== AssetEnablement.PERMANENTLY_DISABLED &&
          jars[j].details.harvestStats === undefined &&
          jars[j].details.strategyAddr !== NULL_ADDRESS
        ) {
          missing.push(jars[j]);
        }
      }
      map.set(this.configuredChains[i], missing);
    }

    const promises: Promise<any>[] = [];
    for (let i = 0; i < this.configuredChains.length; i++) {
      promises.push(
        this.loadHarvestData(
          map.get(this.configuredChains[i]),
          this.configuredChains[i],
        ),
      );
    }

    try {
      const r = await Promise.all(promises);
      return r;
    } catch (error) {
      this.logPlatformError(
        toError(
          101600,
          undefined,
          "",
          "ensureHarvestDataLoaded/wrapper",
          "Multiple Chains Affected: Promise.all",
          "" + error,
          ErrorSeverity.SEVERE,
        ),
      );
    } finally {
      DEBUG_OUT("End ensureHarvestDataLoaded: " + (Date.now() - start));
    }
  }

  async loadHarvestData(
    jars: JarDefinition[],
    chain: ChainNetwork,
  ): Promise<void> {
    const univ3Jars: JarDefinition[] = jars.filter(
      (x) => x.protocol === AssetProtocol.UNISWAP_V3,
    );
    const jarV1: JarDefinition[] = jars.filter(
      (x) => x.protocol !== AssetProtocol.UNISWAP_V3,
    );

    const p1 = this.loadHarvestDataJarAbi(jarV1, chain);
    // TODO this shouldn't just be univ3 jars. Any custom harvesters
    const p2 = this.loadHarvestDataCustom(univ3Jars, chain);

    try {
      await p1;
    } catch (error) {
      this.logPlatformError(
        toError(
          100899,
          chain,
          "",
          "loadHarvestData/jars",
          "Multiple Chains Affected: Promise.all",
          "" + error,
          ErrorSeverity.SEVERE,
        ),
      );
    }

    try {
      await p2;
    } catch (error) {
      this.logPlatformError(
        toError(
          100999,
          chain,
          "",
          "loadHarvestData/custom",
          "Multiple Chains Affected: Promise.all",
          "" + error,
          ErrorSeverity.SEVERE,
        ),
      );
    }
  }
  async loadHarvestDataCustom(
    harvestableJars: JarDefinition[],
    chain: ChainNetwork,
  ): Promise<void> {
    // TODO share code between the two impls
    // const resolver = Chains.getResolver(chain);
    const discovery: JarBehaviorDiscovery = new JarBehaviorDiscovery();
    const harvestArr: Promise<JarHarvestStats>[] = [];
    for (let i = 0; i < harvestableJars.length; i++) {
      const harvestResolver: JarBehavior = discovery.findAssetBehavior(
        harvestableJars[i],
      );
      harvestArr.push(
        harvestResolver.getAssetHarvestData(
          harvestableJars[i],
          this,
          BigNumber.from(0),
          BigNumber.from(0),
        ),
      );
    }
    let results: JarHarvestStats[] = undefined;
    try {
      results = await Promise.all(harvestArr);
    } catch (e) {
      this.logPlatformError(
        toError(
          100910,
          chain,
          "",
          "loadHarvestDataJarAbi/balanceOfProm",
          "Multiple Assets Affected: Promise.all",
          "" + e,
          ErrorSeverity.SEVERE,
        ),
      );
      console.log("Error loading harvest data for jar");
    }

    for (let j = 0; j < harvestableJars.length; j++) {
      if (results && results.length > j && results[j]) {
        results[j].balanceUSD = toThreeDec(results[j].balanceUSD);
        results[j].earnableUSD = toThreeDec(results[j].earnableUSD);
        results[j].harvestableUSD = toThreeDec(results[j].harvestableUSD);
        harvestableJars[j].details.harvestStats = results[j];
      }
    }
  }

  async loadHarvestDataJarAbi(
    jars: JarDefinition[],
    chain: ChainNetwork,
  ): Promise<void> {
    if (!jars || jars.length === 0) return;

    const discovery: JarBehaviorDiscovery = new JarBehaviorDiscovery();
    const harvestableJars: JarDefinition[] = jars.filter(
      (x) =>
        discovery.findAssetBehavior(x) !== null &&
        discovery.findAssetBehavior(x) !== undefined,
    );
    if (!harvestableJars || harvestableJars.length === 0) return;

    const multiProvider = this.multiproviderFor(chain);
    let balanceOfProm: Promise<BigNumber[]> = undefined;
    try {
      balanceOfProm = multiProvider.all(
        harvestableJars.map((oneJar) =>
          new MultiContract(oneJar.contract, jarAbi).balance(),
        ),
      );
    } catch (error) {
      this.logPlatformError(
        toError(
          100810,
          chain,
          "",
          "loadHarvestDataJarAbi/balanceOfProm",
          "Multiple Assets Affected: Promise.all",
          "" + error,
          ErrorSeverity.ERROR_5,
        ),
      );
    }

    // Just do the want.balanceOf(strategy) but protect against non-erc20 deposit tokens
    let strategyWantProm: Promise<BigNumber[]> = undefined;
    try {
      strategyWantProm = multiProvider.all(
        harvestableJars.map((oneJar) => {
          const guard = getZeroValueMulticallForNonErc20(oneJar);
          if (guard) return guard;
          return new MultiContract(
            oneJar.depositToken.addr,
            erc20Abi,
          ).balanceOf(oneJar.details.strategyAddr);
        }),
      );
    } catch (error) {
      this.logPlatformError(
        toError(
          100811,
          chain,
          "",
          "loadHarvestDataJarAbi/strategyWantProm",
          "Multiple Assets Affected: Promise.all",
          "" + error,
          ErrorSeverity.ERROR_5,
        ),
      );
    }

    // Load available as a group
    let availableProm: Promise<BigNumber[]> = undefined;
    try {
      availableProm = multiProvider.all(
        harvestableJars.map((oneJar) =>
          new MultiContract(oneJar.contract, jarAbi).available(),
        ),
      );
    } catch (error) {
      this.logPlatformError(
        toError(
          100812,
          chain,
          "",
          "loadHarvestDataJarAbi/availableProm",
          "Multiple Assets Affected: Promise.all",
          "" + error,
          ErrorSeverity.ERROR_5,
        ),
      );
    }

    let [balanceOf, available, strategyWant] = [
      undefined,
      undefined,
      undefined,
    ];
    try {
      [balanceOf, available, strategyWant] = await Promise.all([
        balanceOfProm,
        availableProm,
        strategyWantProm,
      ]);
    } catch (error) {
      this.logPlatformError(
        toError(
          100813,
          chain,
          "",
          "loadHarvestDataJarAbi/balances",
          "Multiple Assets Affected: Promise.all",
          "" + error,
          ErrorSeverity.ERROR_5,
        ),
      );
    }

    const harvestArr: Promise<JarHarvestStats>[] = [];
    for (let i = 0; i < harvestableJars.length; i++) {
      if (
        !balanceOf ||
        !available ||
        !strategyWant ||
        balanceOf.length <= i ||
        available.length <= i ||
        strategyWant.length <= i
      ) {
        this.logPlatformError(
          toError(
            100814,
            chain,
            harvestableJars[i].details.apiKey,
            "loadHarvestDataJarAbi/prereqs",
            "Error loading harvest data",
            "",
            ErrorSeverity.ERROR_4,
          ),
        );
        continue;
      }
      try {
        const harvestResolver: JarBehavior = discovery.findAssetBehavior(
          harvestableJars[i],
        );
        harvestArr.push(
          harvestResolver.getAssetHarvestData(
            harvestableJars[i],
            this,
            balanceOf[i],
            available[i].add(strategyWant[i]),
          ),
        );
      } catch (e) {
        this.logPlatformError(
          toError(
            100815,
            chain,
            harvestableJars[i].details.apiKey,
            "loadHarvestDataJarAbi/getAssetHarvestData",
            "Error loading harvest data",
            "" + e,
            ErrorSeverity.ERROR_3,
          ),
        );
      }
    }
    const results: PromiseSettledResult<JarHarvestStats>[] =
      await Promise.allSettled(harvestArr);
    for (let j = 0; j < harvestableJars.length; j++) {
      if (results && results.length > j && results[j]) {
        const oneSettledResult = results[j];
        const result: JarHarvestStats = {
          balanceUSD: 0,
          earnableUSD: 0,
          harvestableUSD: 0,
        };
        if ("value" in oneSettledResult) {
          const value = oneSettledResult.value;
          result.balanceUSD = toThreeDec(value.balanceUSD);
          result.earnableUSD = toThreeDec(value.earnableUSD);
          result.harvestableUSD = toThreeDec(value.harvestableUSD);
          if( value.harvestBlocked ) result.harvestBlocked = value.harvestBlocked;
        } else {
          this.logPlatformError(
            toError(
              100816,
              chain,
              harvestableJars[j].details.apiKey,
              "loadHarvestDataJarAbi/settled",
              "Error loading harvest data",
              "" + oneSettledResult.reason,
              ErrorSeverity.ERROR_3,
            ),
          );
        }

        harvestableJars[j].details.harvestStats = result;
      }
    }
  }
  async ensureStandaloneFarmsBalanceLoaded(
    farms: StandaloneFarmDefinition[],
    balances: any[],
  ): Promise<void> {
    for (let i = 0; i < farms.length; i++) {
      const tokens = balances[i];
      const depositTokenPrice: number = farms[i].depositToken.price;
      let dec = farms[i].depositToken.decimals
        ? farms[i].depositToken.decimals
        : this.tokenDecimals(farms[i].depositToken.addr, farms[i].chain);
      if (!dec) {
        dec = 18;
      }
      const tokenBalance = parseFloat(ethers.utils.formatUnits(tokens, dec));
      const valueBalance = tokenBalance * depositTokenPrice;
      farms[i].details.tokenBalance = tokenBalance;
      farms[i].details.valueBalance = valueBalance;
      farms[i].details.harvestStats = {
        balanceUSD: valueBalance,
        earnableUSD: 0,
        harvestableUSD: 0,
      };
    }
  }

  ensureNestedFarmsBalanceLoaded(
    jarsWithFarms: JarDefinition[],
    balances: string[],
  ): void {
    for (let i = 0; i < jarsWithFarms.length; i++) {
      if (jarsWithFarms[i].farm.details === undefined) {
        jarsWithFarms[i].farm.details = {};
      }
      if (balances === undefined || balances === null) {
        this.logPlatformError(
          toError(
            101010,
            undefined,
            jarsWithFarms[i].details.apiKey,
            "ensureNestedFarmsBalanceLoaded/1",
            "undefined balance",
            "",
            ErrorSeverity.ERROR_3,
          ),
        );
        jarsWithFarms[i].farm.details.tokenBalance = 0;
        jarsWithFarms[i].farm.details.valueBalance = 0;
      } else {
        try {
          const ptokenPrice: number =
            jarsWithFarms[i].details.ratio *
            jarsWithFarms[i].depositToken.price;
          const ptokens = balances[i];
          const dec = jarsWithFarms[i].details.decimals
            ? jarsWithFarms[i].details.decimals
            : 18;
          const ptokenBalance = parseFloat(
            ethers.utils.formatUnits(ptokens, dec),
          );
          const valueBalance = ptokenBalance * ptokenPrice;
          jarsWithFarms[i].farm.details.tokenBalance = ptokenBalance;
          jarsWithFarms[i].farm.details.valueBalance = valueBalance;
        } catch (error) {
          this.logPlatformError(
            toError(
              101011,
              undefined,
              jarsWithFarms[i].details.apiKey,
              "ensureNestedFarmsBalanceLoaded/2",
              "undefined balance",
              "",
              ErrorSeverity.ERROR_3,
            ),
          );
          jarsWithFarms[i].farm.details.tokenBalance = 0;
          jarsWithFarms[i].farm.details.valueBalance = 0;
        }
      }
    }
  }

  async ensureFarmsBalanceLoadedForChain(chain: ChainNetwork): Promise<void> {
    const multiProvider = this.multiproviderFor(chain);
    // Run on eth standalone farms
    const chainFarms: StandaloneFarmDefinition[] =
      this.getStandaloneFarms().filter((x) => x.chain === chain);
    let chainFarmResultsPromise: Promise<string[]> = undefined;
    if (chainFarms.length !== 0) {
      try {
        chainFarmResultsPromise = multiProvider.all(
          chainFarms.map((oneFarm) =>
            new MultiContract(oneFarm.depositToken.addr, erc20Abi).balanceOf(
              oneFarm.contract,
            ),
          ),
        );
      } catch (error) {
        this.logPlatformError(
          toError(
            101050,
            chain,
            "",
            "ensureFarmsBalanceLoadedForProtocol/1",
            "",
            "" + error,
            ErrorSeverity.ERROR_4,
          ),
        );
      }
    }

    const protocolJarsWithFarms: JarDefinition[] = this.semiActiveJars(
      chain,
    ).filter((x) => {
      return x.farm !== undefined;
    });
    let protocolJarsWithFarmResultsPromise: Promise<string[]> = undefined;
    if (protocolJarsWithFarms.length > 0) {
      try {
        protocolJarsWithFarmResultsPromise = multiProvider.all(
          protocolJarsWithFarms.map((oneJar) =>
            new MultiContract(oneJar.contract, erc20Abi).balanceOf(
              oneJar.farm.farmAddress,
            ),
          ),
        );
      } catch (error) {
        this.logPlatformError(
          toError(
            101051,
            chain,
            "",
            "ensureFarmsBalanceLoadedForProtocol/2",
            "",
            "" + error,
            ErrorSeverity.ERROR_4,
          ),
        );
      }
    }

    try {
      const chainFarmResults = await chainFarmResultsPromise;
      this.ensureStandaloneFarmsBalanceLoaded(
        chainFarms,
        chainFarmResults ? chainFarmResults : [],
      );
    } catch (err) {
      this.logPlatformError(
        toError(
          101075,
          chain,
          "",
          "ensureFarmsBalanceLoadedForProtocol/3",
          "",
          "" + err,
          ErrorSeverity.ERROR_4,
        ),
      );
    }

    try {
      const protocolJarsWithFarmResults =
        await protocolJarsWithFarmResultsPromise;
      this.ensureNestedFarmsBalanceLoaded(
        protocolJarsWithFarms,
        protocolJarsWithFarmResults ? protocolJarsWithFarmResults : [],
      );
    } catch (err) {
      this.logPlatformError(
        toError(
          101076,
          chain,
          "",
          "ensureFarmsBalanceLoadedForProtocol/4",
          "",
          "" + err,
          ErrorSeverity.ERROR_4,
        ),
      );
    }
  }

  /*
  We could probably split out the loading vs the setting here
  */
  async setGaugeAprDataOnAsset(): Promise<any> {
    DEBUG_OUT("Begin setGaugeAprDataOnAsset");
    const map: RawGaugeChainMap = this.gaugeMap || {};
    const start = Date.now();
    const promises = this.configuredChains.map((x) => {
      return setGaugeAprData(this, x, map[x]);
    });
    try {
      const r = await Promise.all(promises);
      return r;
    } catch (error) {
      this.logPlatformError(
        toError(
          101500,
          undefined,
          "",
          "setGaugeAprDataOnAsset/4",
          "Unexpected Error",
          "" + error,
          ErrorSeverity.SEVERE,
        ),
      );
    } finally {
      DEBUG_OUT("End setGaugeAprDataOnAsset: " + (Date.now() - start));
    }
  }

  /*
   * Just do the loading for gauge data
   */
  async preloadRawGaugeDataJob(): Promise<RawGaugeChainMap> {
    DEBUG_OUT("Begin preloadRawGaugeDataJob");
    const retval: RawGaugeChainMap = {};
    const start = Date.now();
    const promises: Promise<IRawGaugeData[]>[] = this.configuredChains.map(
      async (x) => {
        let param = undefined;
        if (this.minimalMode) {
          const jarContracts: string[] = this.allAssets
            .filter((z) => z.type === AssetType.JAR && z.chain === x)
            .map((z) => z.contract);
          const standaloneFarmDepositTokens: string[] = this.allAssets
            .filter(
              (z) => z.type === AssetType.STANDALONE_FARM && z.chain === x,
            )
            .map((z) => z.depositToken.addr);
          param = jarContracts.concat(standaloneFarmDepositTokens);
        }
        const oneChainGaugeData: Promise<IRawGaugeData[]> = preloadRawGaugeData(
          this,
          x,
          param,
        );
        retval[x] = await oneChainGaugeData;
        return oneChainGaugeData;
      },
    );
    try {
      await Promise.all(promises);
    } catch (error) {
      this.logPlatformError(
        toError(
          200199,
          undefined,
          "",
          "preloadRawGaugeDataJob",
          `Unexpected Error, multiple chains affected`,
          "" + error,
          ErrorSeverity.SEVERE,
        ),
      );
    }
    DEBUG_OUT("End preloadRawGaugeDataJob: " + (Date.now() - start));
    this.gaugeMap = retval;
    return retval;
  }

  async ensureFarmsBalanceLoaded(): Promise<any> {
    DEBUG_OUT("Begin ensureFarmsBalanceLoaded");
    const start = Date.now();
    const promises = this.configuredChains.map((x) =>
      this.ensureFarmsBalanceLoadedForChain(x),
    );
    try {
      const r = await Promise.all(promises);
      return r;
    } catch (err) {
      this.logPlatformError(
        toError(
          101099,
          undefined,
          "",
          "ensureFarmsBalanceLoaded/1",
          "",
          "" + err,
          ErrorSeverity.SEVERE,
        ),
      );
    } finally {
      DEBUG_OUT("End ensureFarmsBalanceLoaded: " + (Date.now() - start));
    }
  }

  async ensureExternalAssetBalanceLoaded(): Promise<void> {
    DEBUG_OUT("Begin ensureExternalAssetBalanceLoaded");
    const start = Date.now();

    // This needs to be separated out and unified, seriously.
    let external: ExternalAssetDefinition[] = undefined;
    try {
      external = this.getExternalAssets().filter((x) =>
        this.configuredChains.includes(x.chain),
      );
    } catch (error) {
      this.logPlatformError(
        toError(
          101100,
          undefined,
          "",
          "ensureExternalAssetBalanceLoaded",
          "",
          "" + error,
          ErrorSeverity.ERROR_4,
        ),
      );
    }
    const promises: Promise<any>[] = [];
    for (let i = 0; external !== undefined && i < external.length; i++) {
      const behavior = new JarBehaviorDiscovery().findAssetBehavior(
        external[i],
      );
      if (behavior) {
        const callAndSet = async (): Promise<void> => {
          let bal: JarHarvestStats = undefined;
          try {
            bal = await behavior.getAssetHarvestData(
              external[i],
              this,
              null,
              null,
            );
          } catch (error) {
            this.logPlatformError(
              toError(
                101101,
                undefined,
                "",
                "ensureExternalAssetBalanceLoaded/bal",
                "",
                "" + error,
                ErrorSeverity.ERROR_4,
              ),
            );
          }
          if (bal !== undefined) {
            external[i].details.harvestStats = bal;
          }
        };
        promises.push(callAndSet());
      }
    }
    try {
      await Promise.all(promises);
    } catch (error) {
      this.logPlatformError(
        toError(
          101105,
          undefined,
          "",
          "ensureExternalAssetBalanceLoaded/promiseall",
          "Unexpected Error",
          "" + error,
          ErrorSeverity.ERROR_5,
        ),
      );
    }
    DEBUG_OUT("End ensureExternalAssetBalanceLoaded: " + (Date.now() - start));
  }

  async loadApyComponents(): Promise<void> {
    DEBUG_OUT("Begin loadApyComponents");
    const start = Date.now();
    const withBehaviors: PickleAsset[] = this.allAssets
      .filter(
        (x) =>
          new JarBehaviorDiscovery().findAssetBehavior(x) !== undefined &&
          x.enablement !== AssetEnablement.PERMANENTLY_DISABLED &&
          x.type !== AssetType.BRINERY,
      )
      .filter((x) => this.configuredChains.includes(x.chain));
    try {
      await Promise.all(
        this.configuredChains.map((x) =>
          this.loadApyComponentsOneChain(
            // x,
            withBehaviors.filter((z) => z.chain === x),
          ),
        ),
      );
    } catch (error) {
      this.logPlatformError(
        toError(
          101200,
          undefined,
          "",
          "loadApyComponents",
          `Multiple Assets Affected: Promise.all`,
          "" + error,
          ErrorSeverity.ERROR_5,
        ),
      );
    }
    DEBUG_OUT("End loadApyComponents: " + (Date.now() - start));
  }

  async loadApyComponentsOneChain(
    // chain: ChainNetwork,
    assets: PickleAsset[],
  ): Promise<void> {
    const tmpArray: Promise<void>[] = [];
    for (let i = 0; i < assets.length; i++) {
      const prom1 = this.singleJarLoadApyComponents(assets[i] as JarDefinition);
      tmpArray.push(prom1);
      // if (tmpArray.length === 5) {
      //   try {
      //     DEBUG_OUT("loadApyComponentsOneChain waiting");
      //     await Promise.all(tmpArray);
      //     DEBUG_OUT("loadApyComponentsOneChain Done waiting");
      //     DEBUG_OUT("loadApyComponentsOneChain 4-second delay");
      //     await new Promise((resolve) => setTimeout(resolve, 4000));
      //     DEBUG_OUT("loadApyComponentsOneChain 4-second delay end");
      //   } catch (error) {
      //     const start = Math.floor(i / 10) * 10;
      //     this.logError(
      //       "loadApyComponents ",
      //       error,
      //       chain + " items " + start + " to " + (start + 9),
      //     );
      //   }
      //   tmpArray = [];
      // }
    }
    await Promise.all(tmpArray);
  }

  // TODO is this necessary? The server will kill the run if it takes too long to run anyways
  async singleJarLoadApyComponents(asset: JarDefinition): Promise<void> {
    DEBUG_OUT("Begin loadApyComponents for " + asset.details.apiKey);
    const start = Date.now();
    const ret: Promise<AssetProjectedApr> = new JarBehaviorDiscovery()
      .findAssetBehavior(asset)
      .getProjectedAprStats(asset as JarDefinition, this);
    try {
      const timeoutResult = new Error(
        "PfCoreTimeoutError_singleJarLoadApyComponents",
      );
      const r = await timeout(ret, 18000000, timeoutResult);
      if (r && r !== timeoutResult) {
        asset.aprStats = this.cleanAprStats(r);
      } else {
        this.logPlatformError(
          toError(
            101201,
            asset.chain,
            asset.details.apiKey,
            "singleJarLoadApyComponents/1",
            "timeout 18000000ms for " + asset.details.apiKey,
            "",
            ErrorSeverity.ERROR_3,
          ),
        );
      }
    } catch (error) {
      this.logPlatformError(
        toError(
          101202,
          asset.chain,
          asset.details.apiKey,
          "singleJarLoadApyComponents/2",
          "Error loading yield for jar",
          "" + error,
          ErrorSeverity.ERROR_3,
        ),
      );
    } finally {
      DEBUG_OUT(
        "end loadApyComponents for " +
          asset.details.apiKey +
          ": " +
          (Date.now() - start),
      );
    }
  }

  cleanAprStats(stats: AssetProjectedApr): AssetProjectedApr {
    if (stats) {
      if (stats.components) {
        for (let i = 0; i < stats.components.length; i++) {
          stats.components[i].apr = toThreeDec(
            stats.components[i].apr ? stats.components[i].apr : 0,
          );
          if (stats.components[i].maxApr)
            stats.components[i].maxApr = toThreeDec(
              stats.components[i].maxApr ? stats.components[i].maxApr : 0,
            );
        }
      }
      stats.apr = toThreeDec(stats.apr ? stats.apr : 0);
      stats.apy = toThreeDec(stats.apy ? stats.apy : 0);
    }
    return stats;
  }

  async loadProtocolApr(): Promise<void> {
    DEBUG_OUT("Begin loadProtocolApr");
    const start = Date.now();
    const withBehaviors: JarDefinition[] = this.getJars().filter(
      (x) => new JarBehaviorDiscovery().findAssetBehavior(x) !== undefined,
    );
    try {
      await Promise.all(
        withBehaviors.map(async (x) => {
          const ret: Promise<HistoricalYield> = new JarBehaviorDiscovery()
            .findAssetBehavior(x)
            .getProtocolApy(x as JarDefinition, this);
          try {
            x.details.protocolApr = await ret;
          } catch (error) {
            this.logPlatformError(
              toError(
                101300,
                x.chain,
                x.details.apiKey,
                "loadProtocolApr/2",
                "",
                "" + error,
                ErrorSeverity.ERROR_3,
              ),
            );
            return {
              d1: 0,
              d3: 0,
              d7: 0,
              d30: 0,
            };
          }
        }),
      );
    } catch (error) {
      toError(
        101301,
        undefined,
        "",
        "loadProtocolApr/3",
        `Multiple Assets Affected: Promise.all`,
        "" + error,
        ErrorSeverity.ERROR_5,
      );
    }
    DEBUG_OUT("End loadProtocolApr: " + (Date.now() - start));
  }

  async loadPlatformData(): Promise<PlatformData> {
    DEBUG_OUT("Begin loadPlatformData");
    const start = Date.now();
    const farms: StandaloneFarmDefinition[] = this.getStandaloneFarms();
    let tvl = 0;
    let blendedRateSum = 0;
    let harvestPending = 0;
    for (let i = 0; i < farms.length; i++) {
      if (farms[i].details?.valueBalance) {
        tvl += farms[i].details?.valueBalance;
        // TODO standalone farms don't generate fees at all
        // They also don't increase AUM much at all other than emitted pickle
        //blendedRateSum += 0;
      }
    }
    const jars: JarDefinition[] = this.getJars();
    for (let i = 0; i < jars.length; i++) {
      if (jars[i].details?.harvestStats?.balanceUSD) {
        const jarApr = jars[i].aprStats?.apr ? jars[i].aprStats?.apr : 0;
        const bal = jars[i].details?.harvestStats?.balanceUSD
          ? jars[i].details.harvestStats.balanceUSD
          : 0;
        const pending = jars[i].details?.harvestStats?.harvestableUSD
          ? jars[i].details?.harvestStats?.harvestableUSD
          : 0;
        tvl += bal;
        blendedRateSum += bal * jarApr;
        harvestPending += pending;
      }
    }

    DEBUG_OUT("End loadPlatformData: " + (Date.now() - start));
    if( this.dillDetails ) {
      try {
        return {
          pickleTotalSupply: this.dillDetails.totalPickle,
          pickleCirculatingSupply:
            this.dillDetails.totalPickle - this.dillDetails.pickleLocked,
          pickleMarketCap:
            this.dillDetails.totalPickle *
            this.priceOfSync("pickle", ChainNetwork.Ethereum),
          picklePerBlock: this.ppb ? this.ppb.toString() : "0",
          platformTVL: tvl,
          platformBlendedRate: tvl === 0 ? 0 : blendedRateSum / tvl,
          harvestPending: harvestPending,
        };
      } catch (error) {
        // prettier-ignore
        this.logPlatformError(toError(101700,ChainNetwork.Ethereum,"dillDetails","loadPlatformData/dillDetails","","" + error,ErrorSeverity.ERROR_4));
      }
    }
    // dill details didn't load. Let's pull from previous
    if( this.previousPfcore ) {
      return this.previousPfcore.platform;
    }
  }

  logLocalError(err: LocalError): void {
    this.logPlatformError({ ...err, product: PickleProduct.PFCORE });
  }

  async logPlatformError(err: PlatformError): Promise<void> {
    if (this.logger) {
      await this.logger.logPlatformError(err);
    } else {
      // TODO store somewhere?
      this.allErrors.push(err);
      console.log(
        `[${err.severity}] [${err.chain}] ${err.asset}] ${err.failedCall}: ${err.message}`,
      );
    }
  }
}
export const toError = (
  errorCode: number,
  chain: ChainNetwork | undefined,
  asset: string,
  failedCall: string,
  message: string,
  causeMessage: string,
  severity: ErrorSeverity,
): PlatformError => {
  let chainGot: IChain | undefined = undefined;
  try {
    chainGot = chain ? Chains.get(chain) : undefined;
  } catch (error) {
    // Not found
  }
  return toError2(
    PickleProduct.PFCORE,
    errorCode,
    chainGot ? chainGot.id : -1,
    asset,
    failedCall,
    message,
    causeMessage,
    severity,
  );
};
export const toError1 = (
  product: PickleProduct,
  errorCode: number,
  chain: ChainNetwork | undefined,
  asset: string,
  failedCall: string,
  message: string,
  causeMessage: string,
  severity: ErrorSeverity,
): PlatformError => {
  let chainGot: IChain | undefined = undefined;
  try {
    chainGot = chain ? Chains.get(chain) : undefined;
  } catch (error) {
    // Not found
  }
  return toError2(
    product,
    errorCode,
    chainGot ? chainGot.id : -1,
    asset,
    failedCall,
    message,
    causeMessage,
    severity,
  );
};

export const toError2 = (
  product: PickleProduct,
  errorCode: number,
  chain: number,
  asset: string,
  failedCall: string,
  message: string,
  causeMessage: string,
  severity: ErrorSeverity,
): PlatformError => {
  return {
    product: product,
    timestamp: Date.now(),
    errorCode,
    chain,
    asset: asset || "",
    failedCall: failedCall || "",
    message: message || failedCall || "",
    causeMessage: causeMessage || "",
    severity,
  };
};

/**
 * A safe call to get a zero return for non-erc20 calls when doing bulk multicalls
 * @param jar
 * @returns
 */
export const getZeroValueMulticallForNonErc20 = (
  jar: JarDefinition,
): ContractCall => {
  if (
    jar.depositToken === undefined ||
    (jar.depositToken.style !== undefined &&
      jar.depositToken.style.erc20 !== undefined &&
      jar.depositToken.style.erc20 === false)
  ) {
    return getZeroValueMulticallForChain(jar.chain);
  }
  return undefined;
};

export const getZeroValueMulticallForChain = (chain: ChainNetwork): any => {
  // We need a safe multicall
  const randomErc20Token: string =
    ExternalTokenModelSingleton.getTokens(chain)[0].contractAddr;
  return new MultiContract(randomErc20Token, erc20Abi).balanceOf(
    FICTIONAL_ADDRESS,
  );
};

const toThreeDec = function (param: number) {
  return Math.floor(param * 1000) / 1000;
};
