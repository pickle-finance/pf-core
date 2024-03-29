import { JarDefinition } from "../../model/PickleModelJson";
import { PickleModel } from "../../model/PickleModel";
import { ConvexDualReward } from "./convex-dual-reward";
import { BigNumber } from "ethers";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import { formatEther } from "ethers/lib/utils";
import { Contract } from "ethers-multiprovider";
import { getCurvePoolData } from "../../protocols/CurveUtil";

const pool = "0xE07BDe9Eb53DEFfa979daE36882014B758111a78";
export class CurveCadcUsdc extends ConvexDualReward {
  constructor() {
    super();
  }

  async getDepositTokenPrice(asset: JarDefinition, model: PickleModel): Promise<number> {
    let tokenPrice: number;

    const poolData = await getCurvePoolData(asset, model);
    if (poolData && poolData.price !== undefined) {
      tokenPrice = poolData.price;
    } else {
      const multiProvider = model.multiproviderFor(asset.chain);
      const cadcToken = new Contract(model.address("cadc", asset.chain), erc20Abi);
      const usdcToken = new Contract(model.address("usdc", asset.chain), erc20Abi);
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

      tokenPrice = parseFloat(formatEther(depositTokenPrice));
    }

    return tokenPrice;
  }
}
