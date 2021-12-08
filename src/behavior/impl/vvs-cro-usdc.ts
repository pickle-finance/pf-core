import { sushiStrategyAbi } from "../../Contracts/ABIs/sushi-strategy.abi";
import { CronosVVSJar } from "./cronos-vvs-jar";

export class VVSCroUsdc extends CronosVVSJar {
  constructor() {
    super(sushiStrategyAbi);
  }
}