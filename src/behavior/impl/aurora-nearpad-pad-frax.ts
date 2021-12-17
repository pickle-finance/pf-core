import { sushiStrategyAbi } from "../../Contracts/ABIs/sushi-strategy.abi";
import { AuroraPadJar } from "./aurora-nearpad-jar";

export class PadPadFrax extends AuroraPadJar {
  constructor() {
    super(sushiStrategyAbi);
  }
}