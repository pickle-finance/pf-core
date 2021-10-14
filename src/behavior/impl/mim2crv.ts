import { BigNumber, ethers, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import { ChainNetwork, PickleModel } from "../..";
import { JarDefinition, AssetProjectedApr } from "../../model/PickleModelJson";
import { CurveJar } from "./curve-jar";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import strategyAbi from "../../Contracts/ABIs/strategy.json";
import { calculateAbracadabraApyArbitrum } from "../../protocols/AbraCadabraUtil";

export class Mim2Crv extends CurveJar {
  constructor() {
    super("0x97E2768e8E73511cA874545DC5Ff8067eB19B787");
  }

  async getDepositTokenPrice(
    _definition: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    // TODO We can approximate the mim2crv token value
    // as mim itself bc mim is likely the weakest of the 3
    return model.priceOfSync("mim");
  }

  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
    _resolver: Signer | Provider,
  ): Promise<number> {
    const spell = new ethers.Contract(
      model.address("spell", ChainNetwork.Arbitrum),
      erc20Abi,
      model.providerFor(jar.chain),
    );
    const strategy = new ethers.Contract(
      jar.details.strategyAddr,
      strategyAbi,
      model.providerFor(jar.chain),
    );
    const [spellWallet, spellPrice, pending]: [BigNumber, number, BigNumber] =
      await Promise.all([
        spell
          .balanceOf(jar.details.strategyAddr)
          .catch(() => BigNumber.from("0")),
        model.priceOfSync("spell"),
        strategy.getHarvestable(),
      ]);
    const harvestable = spellWallet
      .add(pending)
      .mul((spellPrice * 1e6).toFixed())
      .div(1e6);
    return parseFloat(ethers.utils.formatEther(harvestable));
  }

  async getProjectedAprStats(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const apy = await calculateAbracadabraApyArbitrum(jar, model);
    return this.aprComponentsToProjectedApr([
      this.createAprComponent("spell", apy * 100, true),
    ]);
  }
}
