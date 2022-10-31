import { Contract } from "ethers-multiprovider";
import { PickleModel } from "../..";
import { JarDefinition, AssetProjectedApr } from "../../model/PickleModelJson";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { Chains } from "../../chain/Chains";
import { formatEther } from "ethers/lib/utils";
import { toError } from "../../model/PickleModel";
import { ErrorSeverity } from "../../core/platform/PlatformInterfaces";
import fetch from "cross-fetch";
import { BigNumber } from "ethers";

const HOP_API = "https://assets.hop.exchange/v1-pool-stats.json";

const hop_token_abi = ["function swap() view returns(address)"];
const swap_abi = [
  "function getVirtualPrice() view returns (uint256)",
  "function getToken(uint8) view returns (address)",
];

export class HopJar extends AbstractJarBehavior {
  static apiLpDetails: any[];

  async getDepositTokenPrice(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    const multiProvider = model.multiproviderFor(jar.chain);

    const hopTokenContract = new Contract(jar.depositToken.addr, hop_token_abi);

    const [swapAddress] = await multiProvider.all([hopTokenContract.swap()]);

    const swapContract = new Contract(swapAddress, swap_abi);

    const [virtualPrice, underlying] = await multiProvider.all([
      swapContract.getVirtualPrice(),
      swapContract.getToken(BigNumber.from(0)),
    ]);

    const underlyingPrice = model.priceOfSync(underlying, jar.chain);
    return underlyingPrice * +formatEther(virtualPrice);
  }

  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    return this.getHarvestableUSDDefaultImplementationV2(jar, model);
  }

  async getProjectedAprStats(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    await this.getApiLpDetails(jar, model);

    if (!!HopJar.apiLpDetails) {
      const depositTokenAllChains =
        HopJar.apiLpDetails[jar.depositToken.components[0].toUpperCase()];

      const depositTokenStats = depositTokenAllChains?.[jar.chain];

      if (depositTokenStats)
        return this.aprComponentsToProjectedApr([
          this.createAprComponent("lp", depositTokenStats.apr * 100, false, 1),
          this.createAprComponent(
            "hop",
            depositTokenStats.stakingApr * 100,
            true,
            1 - Chains.get(jar.chain).defaultPerformanceFee,
          ),
        ]);
    }
    return this.aprComponentsToProjectedApr([]);
  }
  async getApiLpDetails(jar: JarDefinition, model: PickleModel): Promise<void> {
    if (!HopJar.apiLpDetails) {
      try {
        const resp = await fetch(HOP_API);
        const data = await resp.json();
        HopJar.apiLpDetails = data.data;
      } catch (error) {
        model.logPlatformError(
          toError(
            301102,
            jar.chain,
            jar.details.apiKey,
            "getApiLpDetails",
            "error fetching hop API",
            "" + error,
            ErrorSeverity.ERROR_3,
          ),
        );
      }
    }
  }
}
