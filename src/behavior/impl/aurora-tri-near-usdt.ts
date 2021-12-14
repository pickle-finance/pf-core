import { sushiStrategyAbi } from "../../Contracts/ABIs/sushi-strategy.abi";
import { AuroraTriJar } from "./aurora-tri-jar";

export class TriNearUsdt extends AuroraTriJar {
  constructor() {
    super(sushiStrategyAbi);
  }
}
