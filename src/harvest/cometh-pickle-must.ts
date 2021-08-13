import { sushiStrategyAbi } from '../Contracts/ABIs/sushi-strategy.abi';
import { ComethJar } from './cometh-jar';

export class ComethPickleMust extends ComethJar {
  constructor() {
    super(sushiStrategyAbi);
  }
}
