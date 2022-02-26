import {
  AssetEnablement,
  AssetProjectedApr,
  AssetProtocol,
  AssetType,
  DillDetails,
  ExternalAssetDefinition,
  HarvestStyle,
  HistoricalYield,
  JarDefinition,
  PickleAsset,
  PickleModelJson,
  PlatformData,
  StandaloneFarmDefinition,
  XYK_SWAP_PROTOCOLS,
} from "./PickleModelJson";
import { BigNumber, BigNumberish, ethers, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import {
  Provider as MulticallProvider,
  Contract as MulticallContract,
} from "ethers-multicall";
import controllerAbi from "../Contracts/ABIs/controller.json";
import strategyAbi from "../Contracts/ABIs/strategy.json";
import jarAbi from "../Contracts/ABIs/jar.json";
import erc20Abi from "../Contracts/ABIs/erc20.json";
import univ3PoolAbi from "../Contracts/ABIs/univ3Pool.json";
import { ChainNetwork, Chains, RAW_CHAIN_BUNDLED_DEF } from "../chain/Chains";
import { PriceCache } from "../price/PriceCache";
import {
  ExternalToken,
  ExternalTokenFetchStyle,
  ExternalTokenModelSingleton,
} from "../price/ExternalTokenModel";
import { CoinGeckoPriceResolver } from "../price/CoinGeckoPriceResolver";
import { getDillDetails, getWeeklyDistribution } from "../dill/DillUtility";
import { JarBehaviorDiscovery } from "../behavior/JarBehaviorDiscovery";
import {
  AssetBehavior,
  JarBehavior,
  JarHarvestStats,
} from "../behavior/JarBehaviorResolver";
import { loadGaugeAprData } from "../farms/FarmUtil";
import { getDepositTokenPrice } from "../price/DepositTokenPriceUtility";
import { CoinMarketCapPriceResolver } from "../price/CoinMarketCapPriceResolver";
import { SwapPriceResolver } from "../price/SwapPriceResolver";

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
      gaugeProxy: "0x2e57627ACf6c1812F99e274d0ac61B786c19E74f",
    },
  ],
  [
    ChainNetwork.Polygon,
    {
      pickle: "0x2b88ad57897a8b496595925f43048301c37615da",
      masterChef: "0x20B2a3fc7B13cA0cCf7AF81A68a14CB3116E8749",
      controller: "0x83074F0aB8EDD2c1508D3F657CeB5F27f6092d09",
      minichef: "0x20B2a3fc7B13cA0cCf7AF81A68a14CB3116E8749",
    },
  ],
  [
    ChainNetwork.Arbitrum,
    {
      pickle: "0x965772e0E9c84b6f359c8597C891108DcF1c5B1A",
      masterChef: "0x7ecc7163469f37b777d7b8f45a667314030ace24",
      controller: "0x55d5bcef2bfd4921b8790525ff87919c2e26bd03",
      minichef: "0x7ecc7163469f37b777d7b8f45a667314030ace24",
    },
  ],
  [
    ChainNetwork.OKEx,
    {
      pickle: NULL_ADDRESS,
      masterChef: NULL_ADDRESS,
      controller: "0xcf05d96b4c6c5a87b73f5f274dce1085bc7fdcc4",
      minichef: NULL_ADDRESS,
    },
  ],
  [
    ChainNetwork.Harmony,
    {
      pickle: NULL_ADDRESS,
      masterChef: NULL_ADDRESS,
      controller: "0xf4396dca6201e0ca120073acda087b53f7159e24",
      minichef: NULL_ADDRESS,
    },
  ],
  [
    ChainNetwork.Moonriver,
    {
      pickle: NULL_ADDRESS,
      masterChef: NULL_ADDRESS,
      controller: "0xc3f393fb40f8cc499c1fe7fa5781495dc6fac9e9",
      minichef: NULL_ADDRESS,
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
    },
  ],
  [
    ChainNetwork.Metis,
    {
      pickle: NULL_ADDRESS,
      masterChef: NULL_ADDRESS,
      controller: "0xD556018E7b37e66f618A65737144A2ae2B98127f",
      minichef: NULL_ADDRESS,
    },
  ],
  [
    ChainNetwork.Moonbeam,
    {
      pickle: NULL_ADDRESS,
      masterChef: NULL_ADDRESS,
      controller: "0x95ca4584eA2007D578fa2693CCC76D930a96d165",
      minichef: NULL_ADDRESS,
    },
  ],
  [
    ChainNetwork.Optimism,
    {
      pickle: NULL_ADDRESS,
      masterChef: NULL_ADDRESS,
      controller: "0xa1d43d97fc5f1026597c67805aa02aae558e0fef",
      minichef: NULL_ADDRESS,
    },
  ],
  [
    ChainNetwork.Fantom,
    {
      pickle: NULL_ADDRESS,
      masterChef: NULL_ADDRESS,
      controller: "0xc335740c951F45200b38C5Ca84F0A9663b51AEC6",
      minichef: NULL_ADDRESS,
    },
  ],

  // ADD_CHAIN
]);

export class PickleModel {
  private allAssets: PickleAsset[];
  private prices: PriceCache;
  private dillDetails: DillDetails;
  private platformData: PlatformData;
  // A persistent data store for sharing data that is common to all executions
  private permanentDataStore: PfDataStore;
  // A non-persistent cache that can share data within a single execution
  resourceCache: Map<string, any>;
  private configuredChains: ChainNetwork[];

  constructor(
    allAssets: PickleAsset[],
    chains: Map<ChainNetwork, Provider | Signer>,
  ) {
    // Make a copy so the original definitions stay unchanged.
    this.allAssets = JSON.parse(JSON.stringify(allAssets));
    this.initializeChains(chains);
    this.initializePriceCache();
    this.resourceCache = new Map<string, any>();
  }

  setDataStore(dataStore: PfDataStore): void {
    this.permanentDataStore = dataStore;
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
    model.setPrices(json.prices);
    return model;
  }

  setPrices(prices: any): void {
    this.prices = new PriceCache(prices);
  }

  getHarvesterForAsset(
    definition: PickleAsset,
    signer: Signer,
    properties: any,
  ) {
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
   * Don't use this. Use the synchronous version instead `priceOfSync()`.
   */
  async priceOf(
    token: string,
    chain: ChainNetwork = undefined,
  ): Promise<number> {
    return this.priceOfSync(token, chain);
  }
  /**
   * @param token The token to look-up the price for. Can be an address, ID, or cgID.
   * @param chain The chain on which the token is. If specified, `token` value has to be an ID (e.g., not an address/cgID) (default=undefined).
   * @returns Returns the token price || `undefined` if token price not found.
   */
  priceOfSync(
    token: string,
    chain: ChainNetwork | undefined = undefined,
  ): number {
    if (chain && !ethers.utils.isAddress(token)) {
      const address = this.address(token, chain);
      return this.prices.priceOf(address);
    }
    return this.prices.priceOf(token);
  }
  providerFor(network: ChainNetwork): Provider {
    return Chains.get(network).getPreferredWeb3Provider();
  }
  multicallProviderFor(chain: ChainNetwork): MulticallProvider {
    return new MulticallProvider(this.providerFor(chain), Chains.get(chain).id);
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
      if (token.isNativeToken) {
        return token;
      }
    }
  }

  loadSwapData() {
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
  }

  async checkConfiguredChainsConnections(): Promise<void> {
    const liveChains: ChainNetwork[] = [];
    await Promise.all(
      this.configuredChains.map(async (chain) => {
        const provider = this.providerFor(chain);
        try {
          await provider.getNetwork();
          liveChains.push(chain);
        } catch (error) {
          this.logError("setConfiguredChains", error, `[${chain}] RPC is dead`);
        }
      }),
    );
    this.setConfiguredChains(liveChains);
  }

  async generateFullApi(): Promise<PickleModelJson> {
    await this.checkConfiguredChainsConnections();
    await this.loadJarAndFarmData();
    this.dillDetails = await getDillDetails(
      getWeeklyDistribution(this.getJars()),
      this.prices,
      this,
      ChainNetwork.Ethereum,
    );
    this.platformData = this.loadPlatformData();
    return this.toJson();
  }
  async loadJarAndFarmData(): Promise<void> {
    this.loadSwapData();

    await Promise.all([
      this.ensurePriceCacheLoaded(),
      this.loadStrategyData(),
      this.loadRatiosData(),
      this.loadJarTotalSupplyData(),
      this.loadDepositTokenTotalSupplyData(),
      this.loadJarBalanceData(),
      this.ensureComponentTokensLoaded(),
    ]);

    await this.ensureDepositTokenPriceLoaded();
    await this.ensureFarmsBalanceLoaded();

    await Promise.all([
      this.loadGaugeAprData(),
      this.ensureExternalAssetBalanceLoaded(),
      this.ensureHarvestDataLoaded(),
      this.loadApyComponents(),
      this.loadProtocolApr(),
    ]);
  }

  toJson(): PickleModelJson {
    const ret: PickleModelJson = {
      chains: RAW_CHAIN_BUNDLED_DEF,
      tokens: ExternalTokenModelSingleton.getAllTokensOutput(),
      prices: Object.fromEntries(this.prices.getCache()),
      dill: this.dillDetails,
      platform: this.platformData,
      xykSwapProtocols: XYK_SWAP_PROTOCOLS,
      assets: {
        jars: this.getJars(),
        standaloneFarms: this.getStandaloneFarms(),
        external: this.getExternalAssets(),
      },
      timestamp: Date.now(),
    };
    return ret;
  }

  initializePriceCache(): void {
    if (this.prices === undefined) {
      this.prices = new PriceCache();
    }
  }

  async initializeChains(
    chains: Map<ChainNetwork, Provider | Signer>,
  ): Promise<void> {
    const allChains: ChainNetwork[] = Chains.list();
    Chains.globalInitialize(chains);
    await this.setConfiguredChains(allChains);
  }

  async setConfiguredChains(chains: ChainNetwork[]): Promise<void> {
    this.configuredChains = chains;
  }

  async ensurePriceCacheLoaded(): Promise<any> {
    if (
      this.prices &&
      this.prices.getCache() &&
      this.prices.getCache().size === 0
    ) {
      const cgResolver = new CoinGeckoPriceResolver(
        ExternalTokenModelSingleton,
      );
      const isCgFetchType = (token: ExternalToken): boolean => {
        return (
          token.fetchType === ExternalTokenFetchStyle.CONTRACT ||
          token.fetchType === ExternalTokenFetchStyle.ID ||
          token.fetchType === ExternalTokenFetchStyle.BOTH
        );
      };
      const cgPromises = Promise.all(
        this.configuredChains.map(async (x) => {
          const r = await this.prices.getPrices(
            ExternalTokenModelSingleton.getTokens(x)
              .filter((val) => isCgFetchType(val))
              .map((a) => a.coingeckoId),
            cgResolver,
          );
          return r;
        }),
      );
      const cmcResolver = new CoinMarketCapPriceResolver(
        ExternalTokenModelSingleton,
      );
      const all = ExternalTokenModelSingleton.getAllTokens();
      const filtered = all.filter(
        (val) => val.fetchType === ExternalTokenFetchStyle.COIN_MARKET_CAP,
      );
      const cmcPromise = this.prices.getPrices(
        filtered.map((a) => a.coingeckoId),
        cmcResolver,
      );
      const swapFiltered = all.filter(
        (val) => val.fetchType === ExternalTokenFetchStyle.SWAP_PAIRS,
      );
      const swapResolver = new SwapPriceResolver(ExternalTokenModelSingleton);
      const swapPromises = Promise.all(
        this.configuredChains.map((chain) =>
          this.prices.getPrices(
            swapFiltered
              .filter((x) => x.chain === chain)
              .map((a) => a.coingeckoId),
            swapResolver,
            chain,
          ),
        ),
      );

      return Promise.all([cgPromises, cmcPromise, swapPromises]);
    }
  }

  async loadStrategyData(): Promise<any> {
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
      this.logError("loadStrategyData", error);
    }
  }

  async loadRatiosData(): Promise<any> {
    await Promise.all(
      this.configuredChains.map((x) =>
        this.addJarRatios(this.semiActiveJars(x), x),
      ),
    );
  }

  async loadJarTotalSupplyData(): Promise<any> {
    return Promise.all(
      this.configuredChains.map((x) =>
        this.addJarTotalSupply(this.semiActiveJars(x), x),
      ),
    );
  }

  async ensureComponentTokensLoaded(): Promise<any> {
    return Promise.all(
      this.configuredChains.map((x) =>
        this.ensureComponentTokensLoadedForChain(x),
      ),
    );
  }

  async ensureComponentTokensLoadedForChain(chain: ChainNetwork) {
    interface requests {
      asset: PickleAsset;
      pool: string;
      token: string;
      tokenName: string;
      result?: BigNumberish;
    }
    const arr: requests[] = [];
    const assets = this.getAllAssets().filter((x) => x.chain === chain);
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

    const ethcallProvider = this.multicallProviderFor(chain);
    try {
      await ethcallProvider.init();
    } catch (error) {
      this.logError(
        "ensureComponentTokensLoadedForChain: ethcallProvider",
        error,
        chain,
      );
    }

    let results: string[] = undefined;
    try {
      results = await ethcallProvider.all<string[]>(
        arr.map((oneArr) =>
          new MulticallContract(oneArr.token, erc20Abi).balanceOf(oneArr.pool),
        ),
      );
    } catch (error) {
      this.logError("ensureComponentTokensLoadedForChain", error, chain);
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
    return Promise.all(
      this.configuredChains.map((x) =>
        this.addDepositTokenTotalSupply(this.semiActiveJars(x), x),
      ),
    );
  }

  async loadJarBalanceData(): Promise<any> {
    return Promise.all(
      this.configuredChains.map((x) =>
        this.addDepositTokenBalance(this.semiActiveJars(x), x),
      ),
    );
  }

  // Could this be moved to the asset behaviors instead??
  async ensureDepositTokenPriceLoaded() {
    const jarBehaviorResolver = new JarBehaviorDiscovery();
    const notDisabled: PickleAsset[] = this.allAssets
      .filter((jar) => {
        return jar.enablement !== AssetEnablement.PERMANENTLY_DISABLED;
      })
      .filter((x) => this.configuredChains.includes(x.chain));
    let prices: number[] = undefined;
    try {
      prices = await Promise.all(
        notDisabled.map(async (x) => {
          const beh = jarBehaviorResolver.findAssetBehavior(x);
          const prom = beh
            ? beh.getDepositTokenPrice(x, this)
            : getDepositTokenPrice(x, this);
          try {
            return await prom;
          } catch (error) {
            this.logError(
              "ensureDepositTokenPriceLoaded",
              error,
              x.details.apiKey,
            );
          }
        }),
      );
    } catch (error) {
      this.logError("ensureDepositTokenPriceLoaded", error);
    }
    for (let i = 0; prices !== undefined && i < notDisabled.length; i++) {
      notDisabled[i].depositToken.price = prices[i];
      this.prices.put(notDisabled[i].depositToken.addr, prices[i]);
    }
  }

  // All jars called here must be on the same chain.
  async addJarStrategies(
    jars: JarDefinition[],
    controllerAddr: string,
    chain: ChainNetwork,
  ) {
    if (!jars || jars.length === 0) return;
    const ethcallProvider = this.multicallProviderFor(chain);
    try {
      await ethcallProvider.init();
    } catch (error) {
      this.logError("addJarStrategies: ethcallProvider", error, chain);
    }
    const controllerContract = new MulticallContract(
      controllerAddr,
      controllerAbi,
    );

    let strategyAddresses: string[] = undefined;
    try {
      strategyAddresses = await ethcallProvider.all<string[]>(
        jars.map((oneJar) => {
          return controllerContract.strategies(oneJar.depositToken.addr);
        }),
      );
    } catch (error) {
      this.logError("addJarStrategies: strategyAddresses", error, chain);
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

    const ethcallProvider2 = this.multicallProviderFor(jars[0].chain);
    try {
      await ethcallProvider2.init();
    } catch (error) {
      this.logError("addJarStrategies: ethcallProvider2", error, chain);
    }
    const withStrategyAddresses = jars.filter(
      (x) =>
        x.details.strategyAddr !== undefined &&
        x.details.strategyAddr !== NULL_ADDRESS &&
        x.enablement !== AssetEnablement.PERMANENTLY_DISABLED,
    );

    let strategyNames: string[] = undefined;
    try {
      strategyNames = await ethcallProvider2.all<string[]>(
        withStrategyAddresses.map((oneJar) =>
          new MulticallContract(
            oneJar.details.strategyAddr,
            strategyAbi,
          ).getName(),
        ),
      );
    } catch (error) {
      this.logError("addJarStrategies: strategyNames", error, chain);
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
  async addJarRatios(jars: JarDefinition[], chain: ChainNetwork) {
    if (jars === undefined || jars.length === 0) return;
    const ethcallProvider = this.multicallProviderFor(chain);
    try {
      await ethcallProvider.init();
    } catch (error) {
      this.logError("addJarRatios: ethcallProvider", error, chain);
    }

    let ratios: string[] = undefined;
    try {
      ratios = await ethcallProvider.all<string[]>(
        jars.map((oneJar) =>
          new MulticallContract(oneJar.contract, jarAbi).getRatio(),
        ),
      );
    } catch (error) {
      this.logError("addJarRatios: ratios", error, chain);
    }
    for (let i = 0; ratios !== undefined && i < jars.length; i++) {
      jars[i].details.ratio = parseFloat(ethers.utils.formatUnits(ratios[i]));
    }
  }

  // All jars must be on same chain
  async addJarTotalSupply(jars: JarDefinition[], chain: ChainNetwork) {
    if (jars === undefined || jars.length === 0) return;

    const ethcallProvider = this.multicallProviderFor(chain);
    try {
      await ethcallProvider.init();
    } catch (error) {
      this.logError("addJarTotalSupply: ethcallProvider", error, chain);
    }

    let supply: string[] = undefined;
    try {
      supply = await ethcallProvider.all<string[]>(
        jars.map((oneJar) =>
          new MulticallContract(oneJar.contract, jarAbi).totalSupply(),
        ),
      );
    } catch (error) {
      console.log("Failed on addJarTotalSupply");
    }
    for (let i = 0; supply !== undefined && i < jars.length; i++) {
      jars[i].details.totalSupply = parseFloat(
        ethers.utils.formatUnits(supply[i]),
      );
    }
  }

  async addDepositTokenBalance(jars: JarDefinition[], chain: ChainNetwork) {
    if (jars === undefined || jars.length === 0) return;

    const ethcallProvider = this.multicallProviderFor(chain);
    try {
      await ethcallProvider.init();
    } catch (error) {
      this.logError("addDepositTokenBalance: ethcallProvider", error, chain);
    }

    let balance: string[] = undefined;
    try {
      balance = await ethcallProvider.all<string[]>(
        jars.map((oneJar) =>
          oneJar.protocol === AssetProtocol.UNISWAP_V3
            ? new MulticallContract(oneJar.contract, jarAbi).totalLiquidity()
            : new MulticallContract(oneJar.contract, jarAbi).balance(),
        ),
      );
    } catch (error) {
      this.logError("addDepositTokenBalance", error, chain);
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

  async addDepositTokenTotalSupply(jars: PickleAsset[], chain: ChainNetwork) {
    if (jars === undefined || jars.length === 0) return;

    const ethcallProvider = this.multicallProviderFor(chain);
    try {
      await ethcallProvider.init(); // error being raised by this
    } catch (error) {
      this.logError(
        "addDepositTokenTotalSupply: ethcallProvider",
        error,
        chain,
      );
    }

    let supply: string[] = undefined;
    try {
      supply = await ethcallProvider.all<string[]>(
        jars.map((oneJar) =>
          oneJar.protocol === AssetProtocol.UNISWAP_V3
            ? new MulticallContract(
                oneJar.depositToken.addr,
                univ3PoolAbi,
              ).liquidity()
            : new MulticallContract(
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
        ethers.utils.formatUnits(
          supply[i],
          this.tokenDecimals(jars[i].depositToken.addr, jars[i].chain),
        ),
      );
    }
  }

  async ensureHarvestDataLoaded(): Promise<any> {
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
    return Promise.all(promises);
  }

  async loadHarvestData(jars: JarDefinition[], chain: ChainNetwork) {
    const univ3Jars: JarDefinition[] = jars.filter(
      (x) => x.protocol === AssetProtocol.UNISWAP_V3,
    );
    const jarV1: JarDefinition[] = jars.filter(
      (x) => x.protocol !== AssetProtocol.UNISWAP_V3,
    );
    await Promise.all([
      this.loadHarvestDataJarAbi(jarV1, chain),
      // TODO this shouldn't just be univ3 jars. Any custom harvesters
      this.loadHarvestDataCustom(univ3Jars, chain),
    ]);
  }
  async loadHarvestDataCustom(
    harvestableJars: JarDefinition[],
    chain: ChainNetwork,
  ) {
    // TODO share code between the two impls
    const resolver = Chains.getResolver(chain);
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
          resolver,
        ),
      );
    }
    let results: JarHarvestStats[] = undefined;
    try {
      results = await Promise.all(harvestArr);
    } catch (e) {
      console.log("Error loading harvest data for jar");
    }

    for (let j = 0; j < harvestableJars.length; j++) {
      if (results[j]) {
        results[j].balanceUSD = toThreeDec(results[j].balanceUSD);
        results[j].earnableUSD = toThreeDec(results[j].earnableUSD);
        results[j].harvestableUSD = toThreeDec(results[j].harvestableUSD);
      }
      harvestableJars[j].details.harvestStats = results[j];
    }
  }

  async loadHarvestDataJarAbi(jars: JarDefinition[], chain: ChainNetwork) {
    if (!jars || jars.length === 0) return;

    const discovery: JarBehaviorDiscovery = new JarBehaviorDiscovery();
    const harvestableJars: JarDefinition[] = jars.filter(
      (x) =>
        discovery.findAssetBehavior(x) !== null &&
        discovery.findAssetBehavior(x) !== undefined,
    );
    if (!harvestableJars || harvestableJars.length === 0) return;

    // Load balances as a group
    const multicallProvider = this.multicallProviderFor(chain);
    const multicallProvider2 = this.multicallProviderFor(chain);
    try {
      await multicallProvider.init();
      await multicallProvider2.init();
    } catch (error) {
      this.logError("loadHarvestDataJarAbi: multicallProvider", error, chain);
    }

    let balanceOfProm: Promise<BigNumber[]> = undefined;
    try {
      balanceOfProm = multicallProvider.all<BigNumber[]>(
        harvestableJars.map((oneJar) =>
          new MulticallContract(oneJar.contract, jarAbi).balance(),
        ),
      );
    } catch (error) {
      this.logError("loadHarvestDataJarAbi: balanceOfProm", error, chain);
    }

    // Just do the want.balanceOf(strategy) but protect against non-erc20 deposit tokens
    let strategyWantProm: Promise<BigNumber[]> = undefined;
    try {
      strategyWantProm = multicallProvider.all<BigNumber[]>(
        harvestableJars.map((oneJar) => {
          const safe = getErc20SafeDepositTokenMulticall(oneJar);
          if (safe) return safe;
          return new MulticallContract(
            oneJar.depositToken.addr,
            erc20Abi,
          ).balanceOf(oneJar.details.strategyAddr);
        }),
      );
    } catch (error) {
      this.logError("loadHarvestDataJarAbi: strategyWantProm", error, chain);
    }

    // Load available as a group
    let availableProm: Promise<BigNumber[]> = undefined;
    try {
      availableProm = multicallProvider2.all<BigNumber[]>(
        harvestableJars.map((oneJar) =>
          new MulticallContract(oneJar.contract, jarAbi).available(),
        ),
      );
    } catch (error) {
      this.logError("loadHarvestDataJarAbi: availableProm", error, chain);
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
      this.logError(
        "loadHarvesDataJarAbi: [balanceOf, available, strategyWant]",
        error,
        chain,
      );
    }

    const resolver = Chains.getResolver(chain);
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
        console.log(
          "Error loading harvest data for jar " +
            harvestableJars[i].id +
            ":  multicall for prereqs failed",
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
            resolver,
          ),
        );
      } catch (e) {
        console.log(
          "Error loading harvest data for jar " +
            harvestableJars[i].id +
            ":  " +
            e,
        );
      }
    }
    const results: JarHarvestStats[] = await Promise.all(harvestArr);
    for (let j = 0; j < harvestableJars.length; j++) {
      if (results && results.length > j && results[j]) {
        results[j].balanceUSD = toThreeDec(results[j].balanceUSD);
        results[j].earnableUSD = toThreeDec(results[j].earnableUSD);
        results[j].harvestableUSD = toThreeDec(results[j].harvestableUSD);
      }
      harvestableJars[j].details.harvestStats = results[j];
    }
  }
  ensureStandaloneFarmsBalanceLoaded(
    farms: StandaloneFarmDefinition[],
    balances: any[],
  ) {
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
    balances: any[],
  ): void {
    for (let i = 0; i < jarsWithFarms.length; i++) {
      if (jarsWithFarms[i].farm.details === undefined) {
        jarsWithFarms[i].farm.details = {};
      }
      if (balances === undefined || balances === null) {
        this.logError(
          "ensureNestedFarmsBalanceLoaded",
          "undefined balance",
          jarsWithFarms[i].id,
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
          this.logError(
            "ensureNestedFarmsBalanceLoaded",
            error,
            jarsWithFarms[i].id,
          );
          jarsWithFarms[i].farm.details.tokenBalance = 0;
          jarsWithFarms[i].farm.details.valueBalance = 0;
        }
      }
    }
  }

  async ensureFarmsBalanceLoadedForProtocol(
    chain: ChainNetwork,
  ): Promise<void> {
    const ethcallProvider = this.multicallProviderFor(chain);
    try {
      await ethcallProvider.init();
    } catch (error) {
      this.logError(
        "ensureFarmsBalanceLoadedForProtocol: ethcallProvider",
        error,
        chain,
      );
    }

    // Run on eth standalone farms
    const chainFarms: StandaloneFarmDefinition[] =
      this.getStandaloneFarms().filter((x) => x.chain === chain);
    let chainFarmResults: string[] = undefined;
    try {
      chainFarmResults = await ethcallProvider.all<string[]>(
        chainFarms.map((oneFarm) =>
          new MulticallContract(oneFarm.depositToken.addr, erc20Abi).balanceOf(
            oneFarm.contract,
          ),
        ),
      );
    } catch (error) {
      this.logError("ensureFarmsBalanceLoadedForProtocol 1", error, chain);
    }
    this.ensureStandaloneFarmsBalanceLoaded(chainFarms, chainFarmResults);

    const protocolJarsWithFarms: JarDefinition[] = this.semiActiveJars(
      chain,
    ).filter((x) => {
      return x.farm !== undefined;
    });
    let protocolJarsWithFarmResults: string[] = undefined;
    try {
      protocolJarsWithFarmResults = await ethcallProvider.all<string[]>(
        protocolJarsWithFarms.map((oneJar) =>
          new MulticallContract(oneJar.contract, erc20Abi).balanceOf(
            oneJar.farm.farmAddress,
          ),
        ),
      );
    } catch (error) {
      this.logError("ensureFarmsBalanceLoadedForProtocol 2", error, chain);
    }
    this.ensureNestedFarmsBalanceLoaded(
      protocolJarsWithFarms,
      protocolJarsWithFarmResults,
    );
  }

  async loadGaugeAprData(): Promise<any> {
    return Promise.all(
      this.configuredChains.map((x) => loadGaugeAprData(this, x)),
    );
  }
  async ensureFarmsBalanceLoaded(): Promise<any> {
    return Promise.all(
      this.configuredChains.map((x) =>
        this.ensureFarmsBalanceLoadedForProtocol(x),
      ),
    );
  }

  async ensureExternalAssetBalanceLoaded(): Promise<void> {
    // This needs to be separated out and unified, seriously.
    let external: ExternalAssetDefinition[] = undefined;
    try {
      external = this.getExternalAssets().filter((x) =>
        this.configuredChains.includes(x.chain),
      );
    } catch (error) {
      this.logError("ensureExternalAssetBalanceLoaded", error);
    }
    for (let i = 0; external !== undefined && i < external.length; i++) {
      const behavior = new JarBehaviorDiscovery().findAssetBehavior(
        external[i],
      );
      if (behavior) {
        let bal: JarHarvestStats = undefined;
        try {
          bal = await behavior.getAssetHarvestData(
            external[i],
            this,
            null,
            null,
            this.providerFor(external[i].chain),
          );
        } catch (error) {
          this.logError("ensureExternalAssetBalanceLoaded: bal", error);
        }
        if (bal !== undefined) {
          external[i].details.harvestStats = bal;
        }
      }
    }
  }

  async loadApyComponents(): Promise<void> {
    const withBehaviors: PickleAsset[] = this.allAssets
      .filter(
        (x) =>
          new JarBehaviorDiscovery().findAssetBehavior(x) !== undefined &&
          x.enablement !== AssetEnablement.PERMANENTLY_DISABLED,
      )
      .filter((x) => this.configuredChains.includes(x.chain));
    let aprStats: AssetProjectedApr[] = undefined;
    try {
      aprStats = await Promise.all(
        withBehaviors.map(async (x) => {
          const ret: Promise<AssetProjectedApr> = new JarBehaviorDiscovery()
            .findAssetBehavior(x)
            .getProjectedAprStats(x as JarDefinition, this);
          try {
            return await ret;
          } catch (error) {
            this.logError("loadApyComponents", error, x.details.apiKey);
          }
        }),
      );
    } catch (error) {
      this.logError("loadApyComponents", error);
    }
    for (let i = 0; aprStats !== undefined && i < withBehaviors.length; i++) {
      withBehaviors[i].aprStats = this.cleanAprStats(aprStats[i]);
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

  async loadProtocolApr() {
    const withBehaviors: JarDefinition[] = this.getJars().filter(
      (x) => new JarBehaviorDiscovery().findAssetBehavior(x) !== undefined,
    );
    let historical: HistoricalYield[] = undefined;
    try {
      historical = await Promise.all(
        withBehaviors.map(async (x) => {
          const ret: Promise<HistoricalYield> = new JarBehaviorDiscovery()
            .findAssetBehavior(x)
            .getProtocolApy(x as JarDefinition, this);
          try {
            return await ret;
          } catch (error) {
            this.logError("loadProtocolApr", error, x.details.apiKey);
          }
        }),
      );
    } catch (error) {
      this.logError("loadApyComponents", error);
    }

    for (let i = 0; historical !== undefined && i < withBehaviors.length; i++) {
      if (historical[i] !== undefined)
        withBehaviors[i].details.protocolApr = historical[i];
    }
  }
  loadPlatformData(): PlatformData {
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
    return {
      platformTVL: tvl,
      platformBlendedRate: tvl === 0 ? 0 : blendedRateSum / tvl,
      harvestPending: harvestPending,
    };
  }

  logError(where: string, error: any, context?: any) {
    // TODO store somewhere?
    console.log(
      "ERROR: Failed at " +
        where +
        (context !== undefined ? " [" + context + "]" : "") +
        "\n" +
        error,
    );
  }
}

/**
 * A safe call to get a zero return for non-erc20 calls when doing bulk multicalls
 * @param jar
 * @returns
 */
const getErc20SafeDepositTokenMulticall = (
  jar: JarDefinition,
): Promise<any> => {
  if (
    jar.depositToken === undefined ||
    (jar.depositToken.style !== undefined &&
      jar.depositToken.style.erc20 !== undefined &&
      jar.depositToken.style.erc20 === false)
  ) {
    // We need a safe multicall
    const randomErc20Token: string = ExternalTokenModelSingleton.getTokens(
      jar.chain,
    )[0].contractAddr;
    return new MulticallContract(randomErc20Token, erc20Abi).balanceOf(
      FICTIONAL_ADDRESS,
    );
  }
  return undefined;
};

const toThreeDec = function (param: number) {
  return Math.floor(param * 1000) / 1000;
};
