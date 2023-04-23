import { PickleModel } from "../..";
import { JarDefinition } from "../../model/PickleModelJson";
import { Contract } from "ethers-multiprovider";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import { CurveJar } from "./curve-jar";
import { BigNumber, utils } from "ethers";
import { formatEther } from "ethers/lib/utils";

const strategyABI = ["function getHarvestable() external returns (uint256, uint256)"];
const GEAR_GAUGE_ADDR = "0x37Efc3f05D659B30A83cf0B07522C9d08513Ca9d";
const GEAR_POOL_ADDR = "0x0E9B5B092caD6F1c5E6bc7f89Ffe1abb5c95F1C2";

export class CurveGearEth extends CurveJar {
  constructor() {
    super(GEAR_GAUGE_ADDR);
  }

  async getDepositTokenPrice(jar: JarDefinition, model: PickleModel): Promise<number> {
    let tokenPrice: number;

    try {
      tokenPrice = await super.getDepositTokenPrice(jar, model);
    } catch {
      // ignore
    }
    if (tokenPrice !== undefined) return tokenPrice;

    const multiProvider = model.multiproviderFor(jar.chain);
    const gearToken = new Contract(model.address("gear", jar.chain), erc20Abi);
    const poolToken = new Contract(jar.depositToken.addr, erc20Abi);
    const [poolCvx, totalSupply] = await multiProvider.all([
      gearToken.balanceOf(GEAR_POOL_ADDR),
      poolToken.totalSupply(),
    ]);
    const gearPrice = model.priceOfSync("gear", jar.chain);

    const depositTokenPrice = poolCvx
      .mul(BigNumber.from((gearPrice * 1e8).toFixed()))
      .mul(2)
      .div(totalSupply)
      .mul((1e18).toFixed())
      .div((1e8).toFixed());

    tokenPrice = parseFloat(formatEther(depositTokenPrice));

    return tokenPrice;
  }

  async getHarvestableUSD(jar: JarDefinition, model: PickleModel): Promise<number> {
    const multiProvider = model.multiproviderFor(jar.chain);
    const strategy = new Contract(jar.details.strategyAddr, strategyABI, multiProvider);

    const [gearHarvestable, crvHarvestable] = await strategy.callStatic.getHarvestable();
    const gearPrice = model.priceOfSync("gear", jar.chain);
    const crvPrice = model.priceOfSync("crv", jar.chain);
    const harvestableUSD =
      +utils.formatEther(gearHarvestable) * gearPrice + +utils.formatEther(crvHarvestable) * crvPrice;
    return harvestableUSD;
  }
}
