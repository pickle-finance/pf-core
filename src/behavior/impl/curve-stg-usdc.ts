import {
  AssetAprComponent,
  AssetProjectedApr,
  JarDefinition,
} from "../../model/PickleModelJson";
import { PickleModel } from "../../model/PickleModel";
import { BigNumber } from "ethers";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import { formatEther } from "ethers/lib/utils";
import { Contract } from "ethers-multiprovider";
import strategyABI from "../../Contracts/ABIs/strategy.json";
import { CurveJar, getCurveRawStats } from "./curve-jar";

const pool = "0x3211C6cBeF1429da3D0d58494938299C92Ad5860";
const gauge = "0x95d16646311fDe101Eb9F897fE06AC881B7Db802";

export class CurveStgUsdc extends CurveJar {
  constructor() {
    super(gauge);
  }

  async getDepositTokenPrice(
    asset: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    const multiProvider = model.multiproviderFor(asset.chain);
    const stgToken = new Contract(model.address("stg", asset.chain), erc20Abi);
    const poolToken = new Contract(asset.depositToken.addr, erc20Abi);
    const [poolCvx, totalSupply] = await multiProvider.all([
      stgToken.balanceOf(pool),
      poolToken.totalSupply(),
    ]);
    const stgPrice = model.priceOfSync("stg", asset.chain);

    const depositTokenPrice = poolCvx
      .mul(BigNumber.from((stgPrice * 1e6).toFixed()))
      .mul(2)
      .div(totalSupply)
      .mul((1e18).toFixed())
      .div((1e6).toFixed());

    return parseFloat(formatEther(depositTokenPrice));
  }

  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    return this.getHarvestableUSDDefaultImplementation(
      jar,
      model,
      ["stg"],
      strategyABI,
    );
  }

  async getProjectedAprStats(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const crvApy: AssetAprComponent = await this.getCurveCrvAPY(
      definition,
      model,
      model.priceOfSync(definition.depositToken.addr, definition.chain),
      gauge,
      pool,
    );

    const curveRawStats: any = await getCurveRawStats(
      model,
      definition.chain,
      true,
    );
    const lp: AssetAprComponent = this.createAprComponent(
      "lp",
      curveRawStats ? curveRawStats[pool] : 0,
      false,
    );

    return this.aprComponentsToProjectedApr([lp, crvApy]);
  }
}
