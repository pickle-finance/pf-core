import { MIRROR_MTSLA_UST_STAKING_REWARDS } from '../../protocols/UniswapUtil';
import { MirJar } from './mir-jar';

export class MtslaUst extends MirJar {
  constructor() {
    super(MIRROR_MTSLA_UST_STAKING_REWARDS);
  }
}
