import { sushiStrategyAbi } from "../../Contracts/ABIs/sushi-strategy.abi";
import { CronosVvsJar } from "./cronos-vvs-jar";

export class VvsUsdcSingle extends CronosVvsJar {
  constructor() {
    super(sushiStrategyAbi);
  }
}
