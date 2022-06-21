import { multiSushiStrategyAbi } from "../../Contracts/ABIs/multi-sushi-strategy.abi";
import { AuroraTriDualJar } from "./aurora-tri-dual-jar";

export class TriStnearNear extends AuroraTriDualJar {
  constructor() {
    super(multiSushiStrategyAbi, 4, 2);
  }
}
