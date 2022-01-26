import { multiSushiStrategyAbi } from "../../Contracts/ABIs/multi-sushi-strategy.abi";
import { AuroraTriDualJar } from "./aurora-tri-dual-jar";

export class TriTriUsdt extends AuroraTriDualJar {
  constructor() {
    super(multiSushiStrategyAbi, 6, 2);
  }
}
