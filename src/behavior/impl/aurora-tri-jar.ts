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
import { triPoolIds, TRI_FARMS } from "../../protocols/TrisolarisUtil";
import triFarmsAbi from "../../Contracts/ABIs/tri-farms.json";
import { AuroraMultistepHarvestJar } from "./aurora-multistep-harvest-jar";

export abstract class AuroraTriJar extends AuroraMultistepHarvestJar {
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
    const triToken = new ethers.Contract(
      model.address("tri", ChainNetwork.Aurora),
      erc20Abi,
      resolver,
    );
    const [walletTri, triPrice]: [BigNumber, number] = await Promise.all([
      triToken.balanceOf(jar.details.strategyAddr),
      await model.priceOf("tri"),
    ]);

    const poolId = triPoolIds[jar.depositToken.addr];
    const triFarms = new ethers.Contract(TRI_FARMS, triFarmsAbi, resolver);
    const pendingTri = await triFarms
      .pendingTri(poolId, jar.details.strategyAddr)
      .catch(() => BigNumber.from("0"));

    const harvestable = pendingTri
      .add(walletTri)
      .mul((triPrice * 1e18).toFixed())
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
