import { sushiStrategyAbi } from "../../Contracts/ABIs/sushi-strategy.abi";
import { AuroraBrlJar } from "./aurora-auroraswap-jar";

export class BrlUsdcNear extends AuroraBrlJar {
  constructor() {
    super(sushiStrategyAbi);
  }
}