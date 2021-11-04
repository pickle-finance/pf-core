import { sushiStrategyAbi } from "../../Contracts/ABIs/sushi-strategy.abi";
import { OkexJswapJar } from "./okex-jswap-jar";

export class JswapEthkUsdt extends OkexJswapJar {
  constructor() {
    super(sushiStrategyAbi);
  }
}
