import { sushiStrategyAbi } from "../../Contracts/ABIs/sushi-strategy.abi";
import { FantomLqdrSpiritJar } from "./fantom-lqdr-spirit-jar";

export class LqdrSpiritLqdrFtm extends FantomLqdrSpiritJar {
  constructor() {
    super(sushiStrategyAbi);
  }
}
