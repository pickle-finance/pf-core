import { BigNumber, ethers, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import { AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { ChainNetwork } from "../../chain/Chains";
import { PickleModel } from "../../model/PickleModel";
import { calculatePolySushiAPY } from "../../protocols/PolySushiUtil";

export abstract class PolySushiJar extends AbstractJarBehavior {
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
    const sushiToken = new ethers.Contract(
      model.address("sushi", ChainNetwork.Polygon),
      erc20Abi,
      resolver,
    );
    const maticToken = new ethers.Contract(
      model.address("matic", ChainNetwork.Polygon),
      erc20Abi,
      resolver,
    );

    const [walletSushi, walletMatic, sushiPrice, maticPrice]: [
      BigNumber,
      BigNumber,
      number,
      number,
    ] = await Promise.all([
      sushiToken.balanceOf(jar.details.strategyAddr),
      maticToken.balanceOf(jar.details.strategyAddr),
      await model.priceOf("sushi"),
      await model.priceOf("matic"),
    ]);
    const res = await strategy.getHarvestable().catch(() => BigNumber.from("0"));
    const pendingSushi = res[0];
    const pendingMatic = res[1];

    const harvestable = pendingSushi
      .add(walletSushi)
      .mul(sushiPrice.toFixed())
      .add(pendingMatic.add(walletMatic).mul(maticPrice.toFixed()));
    return parseFloat(ethers.utils.formatEther(harvestable));
  }

  async getProjectedAprStats(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    return this.aprComponentsToProjectedApr(
      (await calculatePolySushiAPY(definition, model))
      .map( (component) => this.createAprComponent(component.name, component.apr, component.compoundable)),
    );
  }
}
