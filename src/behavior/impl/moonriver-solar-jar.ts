import { BigNumber, ethers, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import { AssetAprComponent, AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { ChainNetwork } from "../../chain/Chains";
import { PickleModel } from "../../model/PickleModel";
import { calculateSolarFarmsAPY, SolarswapPairManager } from "../../protocols/SolarUtil";

export abstract class MoonriverSolarJar extends AbstractJarBehavior {
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
    const solarToken = new ethers.Contract(
      model.address("solar", ChainNetwork.Moonriver),
      erc20Abi,
      resolver,
    );

    const [walletSolar, solarPrice]: [BigNumber, number] = await Promise.all([
      solarToken.balanceOf(jar.details.strategyAddr),
      await model.priceOf("jswap"),
    ]);
    const pendingJswap = await strategy.getHarvestable().catch(() => BigNumber.from("0"));

    const harvestable = pendingJswap
      .add(walletSolar)
      .mul(solarPrice.toFixed());
    return parseFloat(ethers.utils.formatEther(harvestable));
  }

  async getProjectedAprStats(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {

    const chefComponent: AssetAprComponent =
    await calculateSolarFarmsAPY(definition, model);
    
    const lpApr: number = await new SolarswapPairManager().calculateLpApr(
      model,
      definition.depositToken.addr,
    );
    return this.aprComponentsToProjectedApr([
      this.createAprComponent("lp", lpApr, false),
      this.createAprComponent(chefComponent.name, chefComponent.apr, chefComponent.compoundable),
    ]);
  }
}
