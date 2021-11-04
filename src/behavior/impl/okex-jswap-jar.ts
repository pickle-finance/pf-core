import { BigNumber, ethers, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import { AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { ChainNetwork } from "../../chain/Chains";
import { PickleModel } from "../../model/PickleModel";
import { calculateJswapAPY } from "../../protocols/CherryJswapUtil";

export abstract class OkexJswapJar extends AbstractJarBehavior {
  strategyAbi: any;
  constructor(strategyAbi: any) {
    super();
    this.strategyAbi = strategyAbi;
  }
  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
    resolver: Signer | Provider,
  ): Promise<number> {
    const strategy = new ethers.Contract(
      jar.details.strategyAddr,
      this.strategyAbi,
      resolver,
    );
    const jswapToken = new ethers.Contract(
      model.address("jswap", ChainNetwork.OKEx),
      erc20Abi,
      resolver,
    );

    const [walletJswap, jswapPrice]: [BigNumber, number] = await Promise.all([
      jswapToken.balanceOf(jar.details.strategyAddr),
      await model.priceOf("jswap"),
    ]);
    const pendingJswap = await strategy.getHarvestable();

    const harvestable = pendingJswap
      .add(walletJswap)
      .mul(jswapPrice.toFixed());
    return parseFloat(ethers.utils.formatEther(harvestable));
  }

  async getProjectedAprStats(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    return this.aprComponentsToProjectedApr(
      await calculateJswapAPY(definition, model),
    );
  }
}
