import { sushiStrategyAbi } from "../../Contracts/ABIs/sushi-strategy.abi";
import { FantomLqdrSpiritJar } from "./fantom-lqdr-spirit-jar";

export class LqdrSpiritFraxFtm extends FantomLqdrSpiritJar {
  constructor() {
    super(sushiStrategyAbi);
  }
}
