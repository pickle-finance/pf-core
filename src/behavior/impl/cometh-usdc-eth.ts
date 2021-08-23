import { sushiStrategyAbi } from '../../Contracts/ABIs/sushi-strategy.abi';
import { ComethJar } from './cometh-jar';

export class ComethUsdcEth extends ComethJar {
  constructor() {
    super(sushiStrategyAbi);
  }
}
