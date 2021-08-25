import { MIRROR_MAAPL_UST_STAKING_REWARDS } from '../../protocols/UniswapUtil';
import { MirJar } from './mir-jar';

export class MaaplUst extends MirJar {
  constructor() {
    super(MIRROR_MAAPL_UST_STAKING_REWARDS);
  }
}
