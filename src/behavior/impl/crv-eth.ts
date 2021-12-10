import { JarDefinition } from "../../model/PickleModelJson";
import { PickleModel } from "../../model/PickleModel";
import { ConvexDualReward } from "./convex-dual-reward";
import { BigNumber, ethers } from "ethers";
import { Provider } from "@ethersproject/providers";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import { formatEther } from "ethers/lib/utils";

const pool = "0x8301AE4fc9c624d1D396cbDAa1ed877821D7C511";
export class CurveCrvEth extends ConvexDualReward {
  constructor() {
    super();
  }

  async getDepositTokenPrice(
    asset: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    const provider: Provider = model.providerFor(asset.chain);
    const crvToken = new ethers.Contract(
      model.address("crv", asset.chain),
      erc20Abi,
      provider,
    );
    const poolToken = new ethers.Contract(
      asset.depositToken.addr,
      erc20Abi,
      provider,
    );
    const [poolCrv, crvPrice, totalSupply] = await Promise.all([
      crvToken.balanceOf(pool),
      model.priceOfSync("crv"),
      poolToken.totalSupply(),
    ]);

    const depositTokenPrice = poolCrv
      .mul("2")
      .mul(BigNumber.from((crvPrice * 1e6).toFixed()))
      .div(totalSupply)
      .mul((1e18).toFixed())
      .div((1e6).toFixed());

    return parseFloat(formatEther(depositTokenPrice));
  }
}
