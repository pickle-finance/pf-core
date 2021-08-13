import { sushiStrategyAbi } from '../Contracts/ABIs/sushi-strategy.abi';
import { ComethJar } from './cometh-jar';

export class ComethMaticMust extends ComethJar {
  constructor() {
    super(sushiStrategyAbi);
  }
}
