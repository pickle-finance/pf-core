import { multiSushiStrategyAbi } from "../../Contracts/ABIs/multi-sushi-strategy.abi";
import { AuroraTriDualJar } from "./aurora-tri-dual-jar";

export class TriAuroraEth extends AuroraTriDualJar {
  constructor() {
    super(multiSushiStrategyAbi);
  }
}
