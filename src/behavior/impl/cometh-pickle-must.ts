import { sushiStrategyAbi } from "../../Contracts/ABIs/sushi-strategy.abi";
import { ComethJar } from "./cometh-jar";
export const COMETH_PICKLE_MUST_REWARDS =
  "0x52f68a09aee9503367bc0cda0748c4d81807ae9a";
export class ComethPickleMust extends ComethJar {
  constructor() {
    super(sushiStrategyAbi, COMETH_PICKLE_MUST_REWARDS);
  }
}
