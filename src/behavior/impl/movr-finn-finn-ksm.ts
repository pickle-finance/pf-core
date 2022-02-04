import { sushiStrategyAbi } from "../../Contracts/ABIs/sushi-strategy.abi";
import { MoonriverFinnJar } from "./moonriver-finn-jar";

export class FinnFinnKsm extends MoonriverFinnJar {
  constructor() {
    super(sushiStrategyAbi);
  }
}
