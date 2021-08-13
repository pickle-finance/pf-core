import { sushiStrategyAbi } from '../Contracts/ABIs/sushi-strategy.abi';
import { SushiJar } from './sushi-jar';

export class SlpSushiEth extends SushiJar {
  constructor() {
    super(sushiStrategyAbi);
  }
}
