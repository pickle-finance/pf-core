import { MIRROR_MQQQ_UST_STAKING_REWARDS } from '../../protocols/UniswapUtil';
import { MirJar } from './mir-jar';

export class MqqqUst extends MirJar {
  constructor() {
    super(MIRROR_MQQQ_UST_STAKING_REWARDS);
  }
}
