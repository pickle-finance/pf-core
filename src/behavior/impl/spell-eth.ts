import { BigNumber, ethers, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import { sorbettiereAbi } from "../../Contracts/ABIs/sorbettiere.abi";
import {
  AssetAprComponent,
  AssetProjectedApr,
  JarDefinition,
} from "../../model/PickleModelJson";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { PickleModel } from "../../model/PickleModel";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import { calculateAbradabraApy } from "../../protocols/AbraCadabraUtil";
import { Chains } from "../../chain/Chains";
import { SushiEthPairManager } from "../../protocols/SushiSwapUtil";

export class SpellEth extends AbstractJarBehavior {
  async getProjectedAprStats(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const chainSigner = Chains.get(definition.chain).getProviderOrSigner();
    const [abraApr, lpApr] = await Promise.all([
      calculateAbradabraApy(definition,model,chainSigner),
      new SushiEthPairManager().calculateLpApr(
          model, definition.depositToken.addr)
    ]);

    const abraComp: AssetAprComponent = this.createAprComponent("spell", abraApr, true);
    const lpComp: AssetAprComponent = this.createAprComponent("lp",lpApr,false);
    return this.aprComponentsToProjectedApr([abraComp, lpComp]);
  }

  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
    resolver: Signer | Provider,
  ): Promise<number> {
    const sorbettiere = new ethers.Contract(
      "0xf43480afe9863da4acbd4419a47d9cc7d25a647f",
      sorbettiereAbi,
      resolver,
    );
    const spellToken = new ethers.Contract(
      model.address("spell", jar.chain),
      erc20Abi,
      resolver,
    );

    const [spell, spellWallet, spellPrice] = await Promise.all([
      sorbettiere.pendingIce(0, jar.details.strategyAddr),
      spellToken
        .balanceOf(jar.details.strategyAddr)
        .catch(() => BigNumber.from("0")),
      await model.priceOf("spell-token"),
    ]);

    const harvestable = spell
      .add(spellWallet)
      .mul(BigNumber.from((spellPrice * 1e18).toFixed()))
      .div((1e18).toFixed());
    return parseFloat(ethers.utils.formatEther(harvestable));
  }
}
