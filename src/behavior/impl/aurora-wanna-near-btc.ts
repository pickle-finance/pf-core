import { sushiStrategyAbi } from "../../Contracts/ABIs/sushi-strategy.abi";
import { AuroraWannaJar } from "./aurora-wanna-jar";

export class WannaNearBtc extends AuroraWannaJar {
  constructor() {
    super(sushiStrategyAbi);
  }
}
