import { sushiStrategyAbi } from "../../Contracts/ABIs/sushi-strategy.abi";
import { OkexCherryJar } from "./okex-cherry-jar";

export class CherryCheOkt extends OkexCherryJar {
  constructor() {
    super(sushiStrategyAbi);
  }
}
