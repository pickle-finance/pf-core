import { BigNumber, ethers, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import { PickleModel } from "../..";
import { JarDefinition, AssetProjectedApr } from "../../model/PickleModelJson";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import { multiSushiStrategyAbi } from "../../Contracts/ABIs/multi-sushi-strategy.abi";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import {
  calculateMCv2ApyArbitrum,
  calculateSushiApyArbitrum,
} from "../../protocols/SushiSwapUtil";

export class ArbitrumSpellEth extends AbstractJarBehavior {
  constructor() {
    super();
  }

  async getDepositTokenPrice(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    return super.getDepositTokenPrice(definition, model);
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
    const spellToken = new ethers.Contract(
      model.address("spell", jar.chain),
      erc20Abi,
      resolver,
    );
    const [res, spellWallet, spellPrice, sushiPrice]: [
      BigNumber[],
      BigNumber,
      number,
      number,
    ] = await Promise.all([
      strategy.getHarvestable().catch(() => BigNumber.from("0")),
      spellToken
        .balanceOf(jar.details.strategyAddr)
        .catch(() => BigNumber.from("0")),
      model.priceOfSync("spell"),
      model.priceOfSync("sushi"),
    ]);

    const sushiValue = res[0].mul(sushiPrice.toFixed());
    const spellValue = res[1]
      .add(spellWallet)
      .mul((spellPrice * 1e6).toFixed())
      .div(1e6);
    const harvestable = spellValue.add(sushiValue);
    return parseFloat(ethers.utils.formatEther(harvestable));
  }

  async getProjectedAprStats(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const [sushiSpellEthApy, spellEthApy] = await Promise.all([
      calculateSushiApyArbitrum(jar, model),
      calculateMCv2ApyArbitrum(jar, model, "spell"),
    ]);

    return this.aprComponentsToProjectedApr([
      this.createAprComponent("sushi", sushiSpellEthApy * 100, true),
      this.createAprComponent("spell", spellEthApy * 100, true),
    ]);
  }
}
