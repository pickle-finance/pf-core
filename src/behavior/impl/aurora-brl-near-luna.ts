import { sushiStrategyAbi } from "../../Contracts/ABIs/sushi-strategy.abi";
import { AuroraBrlJar } from "./aurora-auroraswap-jar";

export class BrlNearLuna extends AuroraBrlJar {
  constructor() {
    super(sushiStrategyAbi);
  }
}
