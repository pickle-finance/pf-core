import { BigNumber, ethers, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import { AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { ChainNetwork } from "../../chain/Chains";
import { PickleModel } from "../../model/PickleModel";
import { calculateCherryAPY } from "../../protocols/CherryJswapUtil";

export abstract class OkexCherryJar extends AbstractJarBehavior {
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
    const cherryToken = new ethers.Contract(
      model.address("cherry", ChainNetwork.OKEx),
      erc20Abi,
      resolver,
    );

    const [walletCherry, cherryPrice]: [BigNumber, number] = await Promise.all([
      cherryToken.balanceOf(jar.details.strategyAddr),
      await model.priceOf("cherry"),
    ]);
    const pendingCherry = await strategy.getHarvestable().catch(() => BigNumber.from("0"));

    const harvestable = pendingCherry
      .add(walletCherry)
      .mul(cherryPrice.toFixed());
    return parseFloat(ethers.utils.formatEther(harvestable));
  }

  async getProjectedAprStats(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    return this.aprComponentsToProjectedApr(
      await calculateCherryAPY(definition, model),
    );
  }
}
