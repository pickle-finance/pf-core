import { JarDefinition } from "../../model/PickleModelJson";
import { PickleModel } from "../../model/PickleModel";
import { ConvexDualReward } from "./convex-dual-reward";
import { BigNumber } from "ethers";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import { formatEther } from "ethers/lib/utils";
import { Contract } from "ethers-multiprovider";

const pool = "0xe07bde9eb53deffa979dae36882014b758111a78";
export class CurveCadcUsdc extends ConvexDualReward {
  constructor() {
    super();
  }

  async getDepositTokenPrice(
    asset: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    const multiProvider = model.multiproviderFor(asset.chain);
    const cadcToken = new Contract(
      model.address("cadc", asset.chain),
      erc20Abi,
    );
    const usdcToken = new Contract(
      model.address("usdc", asset.chain),
      erc20Abi,
    );
    const poolToken = new Contract(asset.depositToken.addr, erc20Abi);
    const [poolCadc, poolUsdc, totalSupply] = await multiProvider.all([
      cadcToken.balanceOf(pool),
      usdcToken.balanceOf(pool),
      poolToken.totalSupply(),
    ]);
    const cadcPrice = model.priceOfSync("cadc", asset.chain);
    const usdcPrice = model.priceOfSync("usdc", asset.chain);

    const depositTokenPrice = poolCadc
      .mul(BigNumber.from((cadcPrice * 1e6).toFixed()))
      .add(poolUsdc.mul(1e12).mul(BigNumber.from((usdcPrice * 1e6).toFixed())))
      .div(totalSupply)
      .mul((1e18).toFixed())
      .div((1e6).toFixed());

    return parseFloat(formatEther(depositTokenPrice));
  }
}
