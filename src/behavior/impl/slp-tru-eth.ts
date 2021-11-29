import { BigNumber, ethers, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import { AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import { parseUnits } from "ethers/lib/utils";
import { multiSushiStrategyAbi } from "../../Contracts/ABIs/multi-sushi-strategy.abi";
import { PickleModel } from "../../model/PickleModel";
import { SushiJar } from "./sushi-jar";

export class SlpTruEth extends SushiJar {
  constructor() {
    super(multiSushiStrategyAbi);
  }
  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
    resolver: Signer | Provider,
  ): Promise<number> {
    const strategy = new ethers.Contract(
      jar.details.strategyAddr,
      multiSushiStrategyAbi,
      resolver,
    );
    const truToken = new ethers.Contract(model.addr("tru"), erc20Abi, resolver);
    const [res, truWallet, truPrice, sushiPrice]: [
      BigNumber[],
      BigNumber,
      number,
      number,
    ] = await Promise.all([
      strategy.getHarvestable().catch(() => BigNumber.from("0")),
      truToken
        .balanceOf(jar.details.strategyAddr)
        .catch(() => BigNumber.from("0")),
      await model.priceOf("tru"),
      await model.priceOf("sushi"),
    ]);

    const sushiValue = res[0].mul(sushiPrice.toFixed());
    const truValue = parseUnits(res[1].add(truWallet).toString(), 8).mul(
      truPrice.toFixed(),
    );
    const harvestable = truValue.add(sushiValue);
    return parseFloat(ethers.utils.formatEther(harvestable));
  }
  async getProjectedAprStats(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    return await this.chefV2AprStats(definition, model, "tru");
  }
}
