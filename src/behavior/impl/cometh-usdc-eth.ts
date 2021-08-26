import { sushiStrategyAbi } from '../../Contracts/ABIs/sushi-strategy.abi';
import { ComethJar } from './cometh-jar';

export const COMETH_USDC_WETH_REWARDS = "0x1c30Cfe08506BA215c02bc2723C6D310671BAb62";
export class ComethUsdcEth extends ComethJar {
  constructor() {
    super(sushiStrategyAbi, COMETH_USDC_WETH_REWARDS);
  }
}
