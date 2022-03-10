import { sushiStrategyAbi } from "../../Contracts/ABIs/sushi-strategy.abi";
import { AuroraPadJar } from "./aurora-nearpad-jar";

export class PadNearEth extends AuroraPadJar {
  constructor() {
    super(sushiStrategyAbi);
  }
}