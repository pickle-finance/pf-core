import { multiSushiStrategyAbi } from "../../Contracts/ABIs/multi-sushi-strategy.abi";
import { AuroraTriDualJar } from "./aurora-tri-dual-jar";

export class TriNearLuna extends AuroraTriDualJar {
  constructor() {
    super(multiSushiStrategyAbi, 6, 2);
  }
}
