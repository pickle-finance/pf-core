import { MIRROR_MSLV_UST_STAKING_REWARDS } from '../../protocols/UniswapUtil';
import { MirJar } from './mir-jar';

export class MslvUst extends MirJar {
  constructor() {
    super(MIRROR_MSLV_UST_STAKING_REWARDS);
  }
}
