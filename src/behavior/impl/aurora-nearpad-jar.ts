import { BigNumber, ethers, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import {
  AssetProjectedApr,
  JarDefinition,
} from "../../model/PickleModelJson";
import { ChainNetwork } from "../../chain/Chains";
import { PickleModel } from "../../model/PickleModel";
import { calculatePadFarmsAPY, padPoolIds, PAD_FARMS } from "../../protocols/NearpadUtil";
import sushiChefAbi from "../../Contracts/ABIs/sushi-chef.json";
import { AuroraMultistepHarvestJar } from "./aurora-multistep-harvest-jar";

export abstract class AuroraPadJar extends AuroraMultistepHarvestJar {
  strategyAbi: any;
  constructor(strategyAbi: any) {
    super(5,1);
    this.strategyAbi = strategyAbi;
  }
  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
    resolver: Signer | Provider,
  ): Promise<number> {
    const padToken = new ethers.Contract(
      model.address("pad", ChainNetwork.Aurora),
      erc20Abi,
      resolver,
    );
    const [walletPad, padPrice]: [BigNumber, number] = await Promise.all([
      padToken.balanceOf(jar.details.strategyAddr),
      await model.priceOf("pad"),
    ]);

    const poolId = padPoolIds[jar.depositToken.addr];
    const padFarms = new ethers.Contract(PAD_FARMS, sushiChefAbi, resolver);
    const pendingPad = await padFarms
      .pendingSushi(poolId, jar.details.strategyAddr)
      .catch(() => BigNumber.from("0"));

    const harvestable = pendingPad
      .add(walletPad)
      .mul((padPrice * 1e18).toFixed())
      .div((1e18).toFixed());
    return parseFloat(ethers.utils.formatEther(harvestable));
  }

  async getProjectedAprStats(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    return this.aprComponentsToProjectedApr(
      await calculatePadFarmsAPY(definition, model),
    );
  }
}
