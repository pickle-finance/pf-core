import { multiSushiStrategyAbi } from "../../Contracts/ABIs/multi-sushi-strategy.abi";
import { AuroraWannaDualJar } from "./aurora-wanna-dual-jar";

export class WannaWannaxStnear extends AuroraWannaDualJar {
  constructor() {
    super(multiSushiStrategyAbi, 5, 3);
  }
}
