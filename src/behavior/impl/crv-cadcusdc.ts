import { JarDefinition } from "../../model/PickleModelJson";
import { PickleModel } from "../../model/PickleModel";
import { ConvexDualReward } from "./convex-dual-reward";
import { BigNumber } from "ethers";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import { formatEther } from "ethers/lib/utils";
import { Contract as MultiContract } from "ethers-multicall";

const pool = "0xe07bde9eb53deffa979dae36882014b758111a78";
export class CurveCadcUsdc extends ConvexDualReward {
  constructor() {
    super();
  }

  async getDepositTokenPrice(
    asset: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    const cadcToken = new MultiContract(
      model.address("cadc", asset.chain),
      erc20Abi,
    );
    const usdcToken = new MultiContract(
      model.address("usdc", asset.chain),
      erc20Abi,
    );
    const poolToken = new MultiContract(asset.depositToken.addr, erc20Abi);
    const [poolCadc, poolUsdc, totalSupply] = await model.callMulti(
      [
        () => cadcToken.balanceOf(pool),
        () => usdcToken.balanceOf(pool),
        () => poolToken.totalSupply(),
      ],
      asset.chain,
    );
    const cadcPrice = model.priceOfSync("cadc", asset.chain);
    const usdcPrice = model.priceOfSync("usdc", asset.chain);

    const depositTokenPrice = poolCadc
      .mul(BigNumber.from((cadcPrice * 1e6).toFixed()))
      .add(poolUsdc.mul(BigNumber.from((usdcPrice * 1e6).toFixed())))
      .div(totalSupply)
      .mul((1e18).toFixed())
      .div((1e6).toFixed());

    return parseFloat(formatEther(depositTokenPrice));
  }
}
