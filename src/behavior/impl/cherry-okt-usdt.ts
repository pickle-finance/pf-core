import { sushiStrategyAbi } from "../../Contracts/ABIs/sushi-strategy.abi";
import { OkexCherryJar } from "./okex-cherry-jar";

export class CherryOktUsdt extends OkexCherryJar {
  constructor() {
    super(sushiStrategyAbi);
  }
}
