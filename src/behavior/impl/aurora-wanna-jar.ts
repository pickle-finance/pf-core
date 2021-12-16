import { BigNumber, ethers, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import { AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import { ChainNetwork } from "../../chain/Chains";
import { PickleModel } from "../../model/PickleModel";
import {
  calculateWannaFarmsAPY,
  wannaPoolIds,
  WANNA_FARMS,
} from "../../protocols/WannaUtil";
import wannaChefAbi from "../../Contracts/ABIs/wanna-farms.json";
import { AuroraMultistepHarvestJar } from "./aurora-multistep-harvest-jar";

export abstract class AuroraWannaJar extends AuroraMultistepHarvestJar {
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
    const wannaToken = new ethers.Contract(
      model.address("wanna", ChainNetwork.Aurora),
      erc20Abi,
      resolver,
    );
    const [walletWanna, wannaPrice]: [BigNumber, number] = await Promise.all([
      wannaToken.balanceOf(jar.details.strategyAddr),
      await model.priceOf("wanna"),
    ]);

    const poolId = wannaPoolIds[jar.depositToken.addr];
    const wannaFarms = new ethers.Contract(WANNA_FARMS, wannaChefAbi, resolver);
    const pendingWanna = await wannaFarms
      .pendingWanna(poolId, jar.details.strategyAddr)
      .catch(() => BigNumber.from("0"));

    const harvestable = pendingWanna
      .add(walletWanna)
      .mul((wannaPrice * 1e18).toFixed())
      .div((1e18).toFixed());
    return parseFloat(ethers.utils.formatEther(harvestable));
  }

  async getProjectedAprStats(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    return this.aprComponentsToProjectedApr(
      await calculateWannaFarmsAPY(definition, model),
    );
  }
}
