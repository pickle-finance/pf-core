import { sushiStrategyAbi } from "../../Contracts/ABIs/sushi-strategy.abi";
import { GnosisSushiJar } from "./gnosis-sushi-jar";

export class GnosisSushiXdaiUsdt extends GnosisSushiJar {
  constructor() {
    super(sushiStrategyAbi);
  }
}
