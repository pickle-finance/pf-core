import { sushiStrategyAbi } from "../../Contracts/ABIs/sushi-strategy.abi";
import { AuroraWannaJar } from "./aurora-wanna-jar";

export class WannaEthBtc extends AuroraWannaJar {
  constructor() {
    super(sushiStrategyAbi);
  }
}
