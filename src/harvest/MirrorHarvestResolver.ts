import { StandardHarvestResolver } from './StandardHarvestResolver';

export class MirrorHarvestResolver extends StandardHarvestResolver {
  constructor(rewardToken: string) {
    super(rewardToken);
  }

  getBaseTokenName() : string {
    return "ust";
  }
}