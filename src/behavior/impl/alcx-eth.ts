import { BigNumber, ethers } from "ethers";
import { AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import { alcxStrategyAbi } from "../../Contracts/ABIs/alcx-strategy.abi";
import { PickleModel } from "../../model/PickleModel";
import { SushiJar } from "./sushi-jar";
import { Contract } from "ethers-multiprovider";

export class AlcxEth extends SushiJar {
  constructor() {
    super(alcxStrategyAbi);
  }
  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    const multiProvider = model.multiproviderFor(jar.chain);
    const strategy = new Contract(jar.details.strategyAddr, alcxStrategyAbi);
    const alcxToken = new Contract(model.addr("alcx"), erc20Abi);
    const [alcx, sushi, alcxWallet]: [BigNumber, BigNumber, BigNumber] =
      await Promise.all([
        multiProvider
          .all([strategy.getHarvestableAlcx()])
          .then((x) => x[0])
          .catch(() => BigNumber.from("0")),
        multiProvider
          .all([strategy.getHarvestableSushi()])
          .then((x) => x[0])
          .catch(() => BigNumber.from("0")),
        multiProvider
          .all([alcxToken.balanceOf(jar.details.strategyAddr)])
          .then((x) => x[0])
          .catch(() => BigNumber.from("0")),
      ]);
    const alcxPrice = model.priceOfSync("alcx", jar.chain);
    const sushiPrice = model.priceOfSync("sushi", jar.chain);
    const alcxValue = alcx.add(alcxWallet).mul(alcxPrice.toFixed());
    const sushiValue = sushi.mul(sushiPrice.toFixed());
    const harvestable = alcxValue.add(sushiValue);
    return parseFloat(ethers.utils.formatEther(harvestable));
  }

  async getProjectedAprStats(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    return await this.chefV2AprStats(definition, model, "alcx");
  }
}
