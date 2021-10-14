export interface PoolId {
  [key: string]: number;
}

export interface PoolInfo {
  [key: string]: {
    poolId: number;
    tokenName: string;
    tokenPriceLookup: string;
    rewardName: string;
    rewardPriceLookup: string;
    rewarder?: string;
  };
}
