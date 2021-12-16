import { sushiStrategyAbi } from "../../Contracts/ABIs/sushi-strategy.abi";
import { AuroraWannaJar } from "./aurora-wanna-jar";

export class WannaWannaUsdc extends AuroraWannaJar {
  constructor() {
    super(sushiStrategyAbi);
  }
}
