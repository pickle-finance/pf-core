import { StandardHarvestResolver } from './StandardHarvestResolver';

export class FeiHarvestResolver extends StandardHarvestResolver {
  constructor(rewardToken: string) {
    super(rewardToken);
  }

  getBaseTokenName() : string {
    return "fei";
  }
}