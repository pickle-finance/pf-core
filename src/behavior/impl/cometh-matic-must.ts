import { sushiStrategyAbi } from '../../Contracts/ABIs/sushi-strategy.abi';
import { ComethJar } from './cometh-jar';

export const COMETH_MATIC_MUST_REWARDS = "0x2328c83431a29613b1780706E0Af3679E3D04afd";
export class ComethMaticMust extends ComethJar {
  constructor() {
    super(sushiStrategyAbi, COMETH_MATIC_MUST_REWARDS);
  }
}
