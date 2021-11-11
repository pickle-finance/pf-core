import { multiSushiStrategyAbi } from "../../Contracts/ABIs/multi-sushi-strategy.abi";
import { HarmonySushiJar } from "./harmony-sushi-jar";

export class HSlpEthOne extends HarmonySushiJar {
  constructor() {
    super(multiSushiStrategyAbi);
  }
}
