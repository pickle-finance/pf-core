import { AssetAprComponent, JarDefinition } from "../../model/PickleModelJson";
import { PickleModel } from "../../model/PickleModel";
import { ConvexDualReward } from "./convex-dual-reward";
import { BigNumber } from "ethers";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import { formatEther } from "ethers/lib/utils";
import { Contract } from "ethers-multiprovider";
import { getCurveRawStats } from "./curve-jar";

const pool = "0x8301AE4fc9c624d1D396cbDAa1ed877821D7C511";
export class CurveCrvEth extends ConvexDualReward {
  constructor() {
    super();
  }

  async getLpApr(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<AssetAprComponent> {
    const curveRawStats: any = await getCurveRawStats(
      model,
      definition.chain,
      false,
    );

    return this.createAprComponent(
      "lp",
      curveRawStats ? curveRawStats["crveth"] : 0,
      false,
    );
  }

  async getDepositTokenPrice(
    asset: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    const multiProvider = model.multiproviderFor(asset.chain);
    const crvToken = new Contract(model.address("crv", asset.chain), erc20Abi);
    const poolToken = new Contract(asset.depositToken.addr, erc20Abi);
    const [poolCrv, totalSupply] = await multiProvider.all([
      crvToken.balanceOf(pool),
      poolToken.totalSupply(),
    ]);
    const crvPrice = model.priceOfSync("crv", asset.chain);

    const depositTokenPrice = poolCrv
      .mul("2")
      .mul(BigNumber.from((crvPrice * 1e6).toFixed()))
      .div(totalSupply)
      .mul((1e18).toFixed())
      .div((1e6).toFixed());

    return parseFloat(formatEther(depositTokenPrice));
  }
}
