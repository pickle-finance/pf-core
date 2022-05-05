import { RoseJar } from "./rose-jar";
import { PickleModel } from "../../model/PickleModel";
import { JarDefinition } from "../../model/PickleModelJson";
import { getStableswapPriceAddress } from "../../price/DepositTokenPriceUtility";

const rewarderAddress = "0x226991aADeEfDe03bF557eF067da95fc613aBfFc";
const poolAddress = "0x65a761136815B45A9d78d9781d22d47247B49D23";


export class RoseMaipool extends RoseJar {
  constructor() {
    super(rewarderAddress);
  }

  async getDepositTokenPrice(
    asset: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    return getStableswapPriceAddress(poolAddress, asset, model);
  }
}
