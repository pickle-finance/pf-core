import { sushiStrategyAbi } from "../../Contracts/ABIs/sushi-strategy.abi";
import { MoonriverSolarJar } from "./moonriver-solar-jar";

export class SolarMovr extends MoonriverSolarJar {
  constructor() {
    super(sushiStrategyAbi);
  }
}
