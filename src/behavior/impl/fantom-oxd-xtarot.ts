import { OxdJar } from "./fantom-oxd-jar";
import { PickleModel } from "../..";
import { JarDefinition } from "../../model/PickleModelJson";
import xtarotAbi from "../../Contracts/ABIs/xtarot.json";
import { formatEther } from "ethers/lib/utils";
import { ethers } from "ethers";

export class OxdXtarot extends OxdJar {
  constructor() {
    super();
  }

  async getDepositTokenPrice(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    const provider = model.providerFor(definition.chain);

    const baseTokenPrice = model.priceOfSync("tarot", definition.chain);

    const xTarot = new ethers.Contract(
      definition.depositToken.addr,
      xtarotAbi,
      provider,
    );

    const [xTokenSupplyBN, totalUnderlyingBN] = await Promise.all([
      xTarot.totalSupply(),
      xTarot.callStatic["getTotalUnderlying"](),
    ]);

    const ratioNum = parseFloat(
      formatEther(totalUnderlyingBN.mul((1e18).toFixed()).div(xTokenSupplyBN)),
    );
    return baseTokenPrice * ratioNum;
  }
}
