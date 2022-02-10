import { sushiStrategyAbi } from "../../Contracts/ABIs/sushi-strategy.abi";
import { MoonriverFinnJar } from "./moonriver-finn-jar";

export class FinnMovrFinn extends MoonriverFinnJar {
  constructor() {
    super(sushiStrategyAbi);
  }
}
