import { sushiStrategyAbi } from "../../Contracts/ABIs/sushi-strategy.abi";
import { MoonriverSolarJar } from "./moonriver-solar-jar";

export class SolarBnbMovr extends MoonriverSolarJar {
  constructor() {
    super(sushiStrategyAbi);
  }
}
