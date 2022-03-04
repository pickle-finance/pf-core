import { JarDefinition } from "../../model/PickleModelJson";
import { PickleModel } from "../../model/PickleModel";
import { ConvexDualReward } from "./convex-dual-reward";
import { BigNumber, ethers } from "ethers";
import { Provider } from "@ethersproject/providers";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import { formatEther } from "ethers/lib/utils";

const pool = "0xb576491f1e6e5e62f1d8f26062ee822b40b0e0d4";
export class CurveCvxEth extends ConvexDualReward {
  constructor() {
    super();
  }

  async getDepositTokenPrice(
    asset: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    const provider: Provider = model.providerFor(asset.chain);
    const cvxToken = new ethers.Contract(
      model.address("cvx", asset.chain),
      erc20Abi,
      provider,
    );
    const poolToken = new ethers.Contract(
      asset.depositToken.addr,
      erc20Abi,
      provider,
    );
    const [poolCvx, cvxPrice, totalSupply] = await Promise.all([
      cvxToken.balanceOf(pool),
      model.priceOfSync("cvx", asset.chain),
      poolToken.totalSupply(),
    ]);

    const depositTokenPrice = poolCvx
      .mul("2")
      .mul(BigNumber.from((cvxPrice * 1e6).toFixed()))
      .div(totalSupply)
      .mul((1e18).toFixed())
      .div((1e6).toFixed());

    return parseFloat(formatEther(depositTokenPrice));
  }
}
