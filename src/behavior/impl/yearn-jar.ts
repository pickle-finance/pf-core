import {
  AssetProjectedApr,
  HistoricalYield,
  JarDefinition,
} from "../../model/PickleModelJson";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { PickleModel } from "../../model/PickleModel";
import { calculateYearnAPY, getYearnData } from "../../protocols/YearnUtil";
import YearnRegistryABI from "../../Contracts/ABIs/yearn-registry.json";
import {
  JAR_CRV_IB,
  JAR_fraxCRV,
  JAR_lusdCRV,
  JAR_USDC,
} from "../../model/JarsAndFarms";
import { getStableswapPrice } from "../../price/DepositTokenPriceUtility";
import { Contract } from "ethers-multiprovider";
import { BigNumber } from "@ethersproject/bignumber";
import { ethers } from "ethers";

export class YearnJar extends AbstractJarBehavior {
  constructor() {
    super();
  }

  async getProtocolApy(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<HistoricalYield> {
    const yearnData = await getYearnData(model);
    const multiProvider = model.multiproviderFor(definition.chain);
    const yearnRegistry = new Contract(
      "0x50c1a2ea0a861a967d9d0ffe2ae4012c2e053804",
      YearnRegistryABI,
    );
    const [vaultAddress] = await multiProvider.all([
      yearnRegistry.latestVault(definition.depositToken.addr),
    ]);
    const vaultData = yearnData.find(
      (vault) => vault.address.toLowerCase() == vaultAddress.toLowerCase(),
    );
    if (vaultData) {
      const v = vaultData
        ? Math.floor(vaultData.apy.net_apy * 100 * 100) / 100
        : 0;
      return {
        d1: v,
        d3: v,
        d7: v,
        d30: v,
      };
    }
  }

  async getDepositTokenPrice(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    const depTokenAddr = definition.depositToken.addr;
    // Remember to break this up / move out if these jars get their own class
    if (depTokenAddr === JAR_USDC.depositToken.addr) {
      return model.priceOfSync(depTokenAddr, definition.chain);
    }
    if (depTokenAddr === JAR_CRV_IB.depositToken.addr) {
      const abi = ["function minter() view returns (address)"];
      const minterAbi = ["function get_virtual_price() view returns (uint256)"];
      const multiprovider = model.multiproviderFor(definition.chain);
      const wantContract = new Contract(definition.depositToken.addr, abi);
      const [minterAddr]: string[] = await multiprovider.all([wantContract.minter()]);
      const minterContract = new Contract(minterAddr, minterAbi);
      const [priceBN]: BigNumber[] = await multiprovider.all([minterContract.get_virtual_price()]);
      const price = parseFloat(ethers.utils.formatEther(priceBN));

      return price ?? 1.05;
    }

    if (
      depTokenAddr === JAR_lusdCRV.depositToken.addr ||
      depTokenAddr === JAR_fraxCRV.depositToken.addr
    ) {
      return getStableswapPrice(definition, model);
    }
  }

  async getHarvestableUSD(
    _jar: JarDefinition,
    _model: PickleModel,
  ): Promise<number> {
    return 0;
  }
  async getProjectedAprStats(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const apr: number = await calculateYearnAPY(
      model,
      definition.depositToken.addr,
    );
    if (apr !== undefined) {
      return this.aprComponentsToProjectedApr([
        this.createAprComponent("yearn", apr, false),
      ]);
    } else {
      return this.aprComponentsToProjectedApr([]);
    }
  }
}
