import { sushiStrategyAbi } from "../../Contracts/ABIs/sushi-strategy.abi";
import { GnosisSushiJar } from "./gnosis-sushi-jar";

export class GnosisSushiSushiGno extends GnosisSushiJar {
  constructor() {
    super(sushiStrategyAbi);
  }
}
