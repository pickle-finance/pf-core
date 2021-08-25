import { MIRROR_MBABA_UST_STAKING_REWARDS } from '../../protocols/UniswapUtil';
import { MirJar } from './mir-jar';

export class MBabaUst extends MirJar {
  constructor() {
    super(MIRROR_MBABA_UST_STAKING_REWARDS);
  }
}
