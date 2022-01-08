import { sushiStrategyAbi } from "../../Contracts/ABIs/sushi-strategy.abi";
import { AuroraTriJar } from "./aurora-tri-jar";

export class TriNearLuna extends AuroraTriJar {
  constructor() {
    super(sushiStrategyAbi);
  }
}
