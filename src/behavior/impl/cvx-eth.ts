import { AssetAprComponent, JarDefinition } from "../../model/PickleModelJson";
import { PickleModel } from "../../model/PickleModel";
import { ConvexDualReward } from "./convex-dual-reward";
import { BigNumber } from "ethers";
import { getCurveRawStats } from "./curve-jar";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import { formatEther } from "ethers/lib/utils";
import { Contract } from "ethers-multiprovider";

const pool = "0xb576491f1e6e5e62f1d8f26062ee822b40b0e0d4";
export class CurveCvxEth extends ConvexDualReward {
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
      curveRawStats ? curveRawStats["cvxeth"] : 0,
      false,
    );
  }

  async getDepositTokenPrice(
    asset: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    const multiProvider = model.multiproviderFor(asset.chain);
    const cvxToken = new Contract(model.address("cvx", asset.chain), erc20Abi);
    const poolToken = new Contract(asset.depositToken.addr, erc20Abi);
    const [poolCvx, totalSupply] = await multiProvider.all([
      cvxToken.balanceOf(pool),
      poolToken.totalSupply(),
    ]);

    const cvxPrice = model.priceOfSync("cvx", asset.chain);
    const depositTokenPrice = poolCvx
      .mul("2")
      .mul(BigNumber.from((cvxPrice * 1e6).toFixed()))
      .div(totalSupply)
      .mul((1e18).toFixed())
      .div((1e6).toFixed());

    return parseFloat(formatEther(depositTokenPrice));
  }
}
