import { BigNumber } from "ethers";

export interface UserJarHistory {
    [apiKey: string]: UserTx[];
  }
  
  export interface UserTx {
    hash: string;
    transaction_type: string;
    chain_id: number;
    timestamp: number;
    blocknumber: number;
    indexInBlock: number;
    transfers: UserTransfer[];
  }
  
  export interface UserTransfer {
    amount: string;
    transfer_type: string;
    log_index: number;
    fromAddress: string;
    toAddress: string;
    tokenAddress: string;
    price: string;
    value: number;
    decimals: number;
  }

export interface PnlTransactionWrapper {
  userTransaction: UserTx,
  pnlRollingDataWithLots: PnlRollingDataWithLots,
  transactionRewards: StakingRewards,
}
export interface PnlTxn {
    action: string;
    valueUSD: number;
    wantWei: BigNumber;
    ptokenWei: BigNumber;
    decimals: number;
    wantDecimals: number;
    costBasisUsdPerPToken: number;
    costBasisWantPerPToken: number;
    hash: string;
    timestamp: number;
  }

  export interface StakingReward {
    amount: string,
    price: string,
    value: number,
  }
  export interface StakingRewards {
    [key: string]: StakingReward[];
  }
  export interface PnlRollingDataWithLots {
    rollingWeiCount: BigNumber;
    rollingCostBasis: number;
    totalCost: number;
    lots: Lot[];
    rollingRewards: StakingRewards,
  }
  export interface Lot {
    wei: BigNumber;
    weiRemaining: BigNumber;
    weiLocked: BigNumber;
    totalCostUsd: number;
    totalCostWant: BigNumber;
    saleProceedsUSD: number;
    saleProceedsWant: BigNumber;
    costBasisUSD: number;
    costBasisWant: number;
    status: "open" | "closed";
    timestamp: number;
  }
  