import { BigNumber, ethers, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import {
  AssetProjectedApr,
  JarDefinition,
} from "../../model/PickleModelJson";
import { ChainNetwork } from "../../chain/Chains";
import { PickleModel } from "../../model/PickleModel";
import { calculateBrlFarmsAPY, brlPoolIds, BRL_FARMS } from "../../protocols/AuroraswapUtil";
import sushiChefAbi from "../../Contracts/ABIs/sushi-chef.json";
import { AuroraMultistepHarvestJar } from "./aurora-multistep-harvest-jar";

export abstract class AuroraBrlJar extends AuroraMultistepHarvestJar {
  strategyAbi: any;
  constructor(strategyAbi: any) {
    super(5, 1);
    this.strategyAbi = strategyAbi;
  }
  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
    resolver: Signer | Provider,
  ): Promise<number> {
    const brlToken = new ethers.Contract(
      model.address("brl", ChainNetwork.Aurora),
      erc20Abi,
      resolver,
    );
    const [walletBrl, brlPrice]: [BigNumber, number] = await Promise.all([
      brlToken.balanceOf(jar.details.strategyAddr),
      await model.priceOf("brl"),
    ]);

    const poolId = brlPoolIds[jar.depositToken.addr];
    const brlFarms = new ethers.Contract(BRL_FARMS, sushiChefAbi, resolver);
    const pendingBrl = await brlFarms
      .pendingSushi(poolId, jar.details.strategyAddr)
      .catch(() => BigNumber.from("0"));

    const harvestable = pendingBrl
      .add(walletBrl)
      .mul((brlPrice * 1e18).toFixed())
      .div((1e18).toFixed());
    return parseFloat(ethers.utils.formatEther(harvestable));
  }

  async getProjectedAprStats(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    return this.aprComponentsToProjectedApr(
      await calculateBrlFarmsAPY(definition, model),
    );
  }
}
