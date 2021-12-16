import { BigNumber, ethers, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import {
  AssetProjectedApr,
  JarDefinition,
} from "../../model/PickleModelJson";
import { ChainNetwork } from "../../chain/Chains";
import { PickleModel } from "../../model/PickleModel";
import { calculateTriFarmsAPY } from "../../protocols/TrisolarisUtil";
import { AuroraMultistepHarvestJar } from "./aurora-multistep-harvest-jar";

export abstract class AuroraTriDualJar extends AuroraMultistepHarvestJar {
  strategyAbi: any;
  constructor(strategyAbi: any, numSteps:number, toTreasury:number) {
    super(numSteps, toTreasury);
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

    const triToken = new ethers.Contract(
      model.address("tri", ChainNetwork.Aurora),
      erc20Abi,
      resolver,
    );

    const auroraToken = new ethers.Contract(
      model.address("aurora", ChainNetwork.Aurora),
      erc20Abi,
      resolver,
    );

    const [walletTri, walletAurora, triPrice, auroraPrice]: [
      BigNumber,
      BigNumber,
      number,
      number,
    ] = await Promise.all([
      triToken.balanceOf(jar.details.strategyAddr),
      auroraToken.balanceOf(jar.details.strategyAddr),
      await model.priceOf("tri"),
      await model.priceOf("aurora"),
    ]);

    const res = await strategy.getHarvestable();
    const pendingTri = res[0];
    const pendingAurora = res[1];

    const harvestable = pendingTri
      .add(walletTri)
      .mul((triPrice * 1e18).toFixed())
      .div((1e18).toFixed())
      .add(pendingAurora.add(walletAurora))
      .mul((auroraPrice * 1e18).toFixed())
      .div((1e18).toFixed());

    return parseFloat(ethers.utils.formatEther(harvestable));
  }

  async getProjectedAprStats(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    return this.aprComponentsToProjectedApr(
      await calculateTriFarmsAPY(definition, model),
    );
  }
}
