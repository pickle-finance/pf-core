import { sushiStrategyAbi } from "../../Contracts/ABIs/sushi-strategy.abi";
import { AuroraBrlJar } from "./aurora-auroraswap-jar";

export class BrlAvaxNear extends AuroraBrlJar {
  constructor() {
    super(sushiStrategyAbi);
  }
}