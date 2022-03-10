import { sushiStrategyAbi } from "../../Contracts/ABIs/sushi-strategy.abi";
import { AuroraPadJar } from "./aurora-nearpad-jar";

export class PadPadDai extends AuroraPadJar {
  constructor() {
    super(sushiStrategyAbi);
  }
}