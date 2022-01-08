import { sushiStrategyAbi } from "../../Contracts/ABIs/sushi-strategy.abi";
import { AuroraBrlJar } from "./aurora-auroraswap-jar";

export class BrlUstNear extends AuroraBrlJar {
  constructor() {
    super(sushiStrategyAbi);
  }
}