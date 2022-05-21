import swaprRewarderAbi from "../../Contracts/ABIs/swapr-rewarder.json";
import { GnosisSwaprJar } from "./gnosis-swapr-jar";

export class GnosisSwaprCowGno extends GnosisSwaprJar {
  constructor() {
    super(swaprRewarderAbi);
  }
}
