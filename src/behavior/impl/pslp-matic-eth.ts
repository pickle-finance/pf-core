import { multiSushiStrategyAbi } from "../../Contracts/ABIs/multi-sushi-strategy.abi";
import { PolySushiJar } from "./poly-sushi-jar";

export class PSlpMaticEth extends PolySushiJar {
  constructor() {
    super(multiSushiStrategyAbi);
  }
}
