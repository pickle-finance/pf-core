import { sushiStrategyAbi } from "../../Contracts/ABIs/sushi-strategy.abi";
import { MoonbeamStellaJar } from "./moonbeam-stella-jar";

export class StellaUsdcBnb extends MoonbeamStellaJar {
  constructor() {
    super(sushiStrategyAbi);
  }
}