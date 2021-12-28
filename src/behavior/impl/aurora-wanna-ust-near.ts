import { sushiStrategyAbi } from "../../Contracts/ABIs/sushi-strategy.abi";
import { AuroraWannaJar } from "./aurora-wanna-jar";

export class WannaUstNear extends AuroraWannaJar {
  constructor() {
    super(sushiStrategyAbi);
  }
}
