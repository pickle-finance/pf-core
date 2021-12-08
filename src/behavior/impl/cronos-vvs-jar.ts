import { BigNumber, ethers, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import { AssetAprComponent, AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { ChainNetwork } from "../../chain/Chains";
import { PickleModel } from "../../model/PickleModel";
import { calculateVvsFarmsAPY, VvsswapPairManager } from "../../protocols/VvsUtil";
import { vvsPoolIds, VVS_FARMS } from "../../protocols/VvsUtil";
import vvsFarmsAbi from "../../Contracts/ABIs/vvs-farms.json";

export abstract class CronosVvsJar extends AbstractJarBehavior {
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
    const strategy = new ethers.Contract(
      jar.details.strategyAddr,
      this.strategyAbi,
      resolver,
    );
    const vvsToken = new ethers.Contract(
      model.address("vvs", ChainNetwork.Cronos),
      erc20Abi,
      resolver,
    );

    const [walletVvs, vvsPrice]: [BigNumber, number] = await Promise.all([
      vvsToken.balanceOf(jar.details.strategyAddr),
      await model.priceOf("vvs"),
    ]);

  const poolId = vvsPoolIds[jar.depositToken.addr];
  const vvsFarms = new ethers.Contract(VVS_FARMS, vvsFarmsAbi);
    const pendingVvs = await vvsFarms.pendingVVS(poolId, jar.details.strategyAddr).catch(() => BigNumber.from("0"));

    const harvestable = pendingVvs
      .add(walletVvs)
      .mul((vvsPrice * 1e18).toFixed())
      .div((1e18).toFixed());
    return parseFloat(ethers.utils.formatEther(harvestable));
  }

  async getProjectedAprStats(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {

    const chefComponent: AssetAprComponent =
    await calculateVvsFarmsAPY(definition, model);
    
    const lpApr: number = await new VvsswapPairManager().calculateLpApr(
      model,
      definition.depositToken.addr,
    );
    return this.aprComponentsToProjectedApr([
      this.createAprComponent("lp", lpApr, false),
      this.createAprComponent(chefComponent.name, chefComponent.apr, chefComponent.compoundable, 0.9),
    ]);
  }
}
