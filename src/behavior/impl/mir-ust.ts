import { MIRROR_MIR_UST_STAKING_REWARDS } from '../../protocols/UniswapUtil';
import { MirJar } from './mir-jar';

export class MirUst extends MirJar {
  constructor() {
    super(MIRROR_MIR_UST_STAKING_REWARDS);
  }
}
