import { sushiStrategyAbi } from '../Contracts/ABIs/sushi-strategy.abi';
import { SushiJar } from './sushi-jar';

export class SlpYfiEth extends SushiJar {
  constructor() {
    super(sushiStrategyAbi);
  }
}
