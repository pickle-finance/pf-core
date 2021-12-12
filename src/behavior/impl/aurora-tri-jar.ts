import { BigNumber, ethers, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import {
  AssetAprComponent,
  AssetProjectedApr,
  JarDefinition,
} from "../../model/PickleModelJson";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { ChainNetwork } from "../../chain/Chains";
import { PickleModel } from "../../model/PickleModel";
import {
  calculateTriFarmsAPY,
  TriswapPairManager,
} from "../../protocols/TrisolarisUtil";
import { triPoolIds, TRI_FARMS } from "../../protocols/TrisolarisUtil";
import triFarmsAbi from "../../Contracts/ABIs/tri-farms.json";

export abstract class AuroraTriJar extends AbstractJarBehavior {
  strategyAbi: any;
  constructor(strategyAbi: any) {
    super();
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
    const chefComponent: AssetAprComponent = await calculateTriFarmsAPY(
      definition,
      model,
    );

    const lpApr: number = await new TriswapPairManager().calculateLpApr(
      model,
      definition.depositToken.addr,
    );
    return this.aprComponentsToProjectedApr([
      this.createAprComponent("lp", lpApr, false),
      this.createAprComponent(
        chefComponent.name,
        chefComponent.apr,
        chefComponent.compoundable,
        0.9,
      ),
    ]);
  }
}
