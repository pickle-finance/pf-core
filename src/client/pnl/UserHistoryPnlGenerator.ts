import { BigNumber } from "ethers";
import { HistoryAssetType, Lot, PnlRollingDataWithLots, PnlTxn, PnlTransactionWrapper, UserTx, StakingRewards, UserTransfer } from "./UserHistoryInterfaces";
export class UserJarHistoryPnlGenerator {
  private userWallet: string;
  private userJarHistory: UserTx[];
  private assetType: HistoryAssetType;
  public constructor(userWallet: string, userJarHistory: UserTx[], assetType: HistoryAssetType) {
    this.userWallet = userWallet;
    this.userJarHistory = userJarHistory;
    this.assetType = assetType;
  }

  generatePnL(): PnlTransactionWrapper[] {
    if( this.assetType === HistoryAssetType.JAR) {
      return this.generatePnlJar();
    }
    return [];
  }

  generatePnlJar(): PnlTransactionWrapper[] {
    const ret: PnlTransactionWrapper[] = [];
    for (let i = 0; i < this.userJarHistory.length; i++ ) {
      const rollingData: PnlRollingDataWithLots = this.getRollingData(this.userJarHistory[i], ret);
      const currentRewards: StakingRewards = this.getRewardsFromUserTx(this.userJarHistory[i]);
      const rewardProps = Object.getOwnPropertyNames(currentRewards);
      for( let j = 0; j < rewardProps.length; j++ ) {
        const prev = rollingData.rollingRewards[rewardProps[j]] || [];
        rollingData.rollingRewards[rewardProps[j]] = prev.concat(currentRewards[rewardProps[j]]);
      }
      ret.push({
        userTransaction: this.userJarHistory[i],
        pnlRollingDataWithLots: rollingData,
        transactionRewards: currentRewards
      });
    }
    return ret;
  };


  private getRollingData(userTx: UserTx, wrappers: PnlTransactionWrapper[]): PnlRollingDataWithLots | undefined {
    if (userTx.transaction_type === "DEPOSIT") {
      return this.getDepositPnlEntry(userTx, wrappers);
    }
    if (userTx.transaction_type === "WITHDRAW") {
      return this.getWithdrawPnlEntry(userTx, wrappers, false);
    }
    if (userTx.transaction_type === "ZAPIN") {
      const r = this.getDepositPnlEntry(userTx, wrappers);
      r.lots = this.applyStakeToRollingTotals(userTx, r.lots);
      return r;
    }
    if (userTx.transaction_type === "ZAPOUT") {
      const r = this.getWithdrawPnlEntry(userTx, wrappers, true);
      return r;
    }
    if (userTx.transaction_type === "STAKE") {
      // lock tokens from earliest lots
      return this.getStakePnlEntry(userTx, wrappers);
    }
    if (userTx.transaction_type === "UNSTAKE") {
      // unlock tokens from earliest lots
      return this.getUnstakePnlEntry(userTx, wrappers);
    }
    if (userTx.transaction_type === "TRANSFER") {
      // unlock tokens from earliest lots
      return this.getTransferPnlEntry(this.userWallet, userTx, wrappers);
    }
    if (userTx.transaction_type === "AIRDROP") {
      // unlock tokens from earliest lots
      return this.getTransferPnlEntry(this.userWallet, userTx, wrappers);
    }
    if( userTx.transaction_type === 'STAKE_REWARD') {
      const previousRolling = this.getPreviousRollingDataOrStub(wrappers);
      const prevLots = (previousRolling ? previousRolling.lots : []);
      const prevRewards = previousRolling ? previousRolling.rollingRewards : {};
      const lots = prevLots.map((x) => {return {...x}});
      const rewards = userTx.transfers.filter((x) => x.transfer_type === 'STAKE_REWARD').map((x) => x.value);
      const runningVal = rewards.reduce((accumulator, current) => {
        return accumulator + current;
      }, 0);
      return this.createRollingDataFromLots(runningVal, lots, 18, prevRewards);
    }
    return undefined;
  };


  private getInternalPnlTxn(txn: UserTx): PnlTxn {
    if (txn.transaction_type === "ZAPIN") {
      return this.getZapInPnlTx(txn);
    }
    if (txn.transaction_type === "DEPOSIT") {
      return this.getDepositPnlTx(txn);
    }
    if (txn.transaction_type === "ZAPOUT") {
      return this.getZapOutPnlTx(txn);
    }
    if (txn.transaction_type === "WITHDRAW") {
      return this.getWithdrawPnlTx(txn);
    }
    return undefined;
  };

  private getRewardsFromUserTx(userTx: UserTx): StakingRewards {
    const filtered: UserTransfer[] = userTx.transfers.filter((x) => x.transfer_type === 'STAKE_REWARD');
    const ret: StakingRewards = {};
    for( let i = 0; i < filtered.length; i++ ) {
      if( ret[filtered[i].tokenAddress] === undefined) {
        ret[filtered[i].tokenAddress] = [];
      }
      ret[filtered[i].tokenAddress].push({
        amount: filtered[i].amount,
        price: filtered[i].price,
        value: filtered[i].value
      });
    }
    return ret;
  }
    
  private getZapInPnlTx(txn: UserTx): PnlTxn {
    const r = this.getDepositPnlTx(txn);
    r.action = "ZAPIN";
    return r;
  };


  private getZapOutPnlTx(txn: UserTx): PnlTxn {
    const r = this.getWithdrawPnlTx(txn);
    r.action = "ZAPOUT";
    return r;
  };

  private getDepositPnlTx(txn: UserTx): PnlTxn {
    let usdValue = 0;
    let txCostBasis = 0;
    let ptokenWeiCount = BigNumber.from(0);
    let wantWeiCount = BigNumber.from(0);
    let tokenDecimals = 18;
    let wantDecimals = 18;

    const filterUnique = (value: any, index: number, self: any[]): boolean => self.indexOf(value) === index;
    const wantTransferTokens = txn.transfers.filter((x) => x.transfer_type === 'WANT_DEPOSIT').map((x) => x.tokenAddress.toLowerCase());
    const unique = wantTransferTokens.filter(filterUnique);
    let trackWantBasis = true;
    if( unique.length > 1 ) {
      trackWantBasis = false;
    }
    txn.transfers.forEach((transfer) => {
      if (transfer.transfer_type === "WANT_DEPOSIT") {
        usdValue += +transfer.value.toFixed(2);
        if( trackWantBasis ) {
          wantWeiCount = BigNumber.from(transfer.amount);
          wantDecimals = transfer.decimals;
        }
      }
      // this is wrong
      // if (transfer.transfer_type === 'FROM_CALLER') {
      //   usdValue = +transfer.value.toFixed(2);
      // }
      if (transfer.transfer_type === "DEPOSIT") {
        ptokenWeiCount = BigNumber.from(transfer.amount);
        tokenDecimals = transfer.decimals;
        txCostBasis = parseFloat(transfer.price);
      }
    });
    const wantCostBasis = trackWantBasis ? wantWeiCount.mul(1e9).div(ptokenWeiCount).toNumber() / 1e9 : 0;
    const ret: PnlTxn = {
      action: "DEPOSIT",
      valueUSD: usdValue,
      wantWei: wantWeiCount,
      ptokenWei: ptokenWeiCount,
      decimals: tokenDecimals,
      wantDecimals: wantDecimals,
      costBasisUsdPerPToken: txCostBasis,
      costBasisWantPerPToken: wantCostBasis,
      hash: txn.hash,
      timestamp: txn.timestamp,
    };

    return ret;
  };

  private oneEn(decimals: number): BigNumber {
    let working: BigNumber = BigNumber.from(1);
    let toAdd = decimals;
    while( toAdd > 8 ) {
      working = working.mul(1e8);
      toAdd -= 8;
    }
    return working.mul(Math.pow(10, toAdd));
  }


  private getWithdrawPnlTx(txn: UserTx): PnlTxn {
    let ptokenValueUSD = 0;
    let wantValueUSD = 0;
    let ptokenWeiCount = BigNumber.from(0);
    let wantWeiCount = BigNumber.from(0);
    let tokenDecimals = 18;
    let wantDecimals = 18;
    let txCostBasis = 0;
    txn.transfers.forEach((transfer) => {
      if (transfer.transfer_type === "WITHDRAW") {
        ptokenValueUSD = +transfer.value.toFixed(3);
        ptokenWeiCount = BigNumber.from(transfer.amount);
        txCostBasis = parseFloat(transfer.price);
        tokenDecimals = transfer.decimals;
      }
      if (transfer.transfer_type === "WANT_WITHDRAW") {
        wantValueUSD += +transfer.value.toFixed(3);
        wantWeiCount = BigNumber.from(transfer.amount);
        wantDecimals = transfer.decimals;
      }
    });
    const valueUSD = wantValueUSD ? wantValueUSD : ptokenValueUSD;
    const wantCostBasis = wantWeiCount.mul(1e9).div(ptokenWeiCount).toNumber() / 1e9;
    const ret: PnlTxn = {
      action: "WITHDRAW",
      valueUSD: valueUSD,
      wantWei: wantWeiCount,
      ptokenWei: ptokenWeiCount,
      decimals: tokenDecimals,
      wantDecimals: wantDecimals,
      costBasisUsdPerPToken: txCostBasis,
      costBasisWantPerPToken: wantCostBasis,
      hash: txn.hash,
      timestamp: txn.timestamp,
    };
    return ret;
  };

  private getPreviousRollingDataOrStub(pnlWithTotals: PnlTransactionWrapper[]): PnlRollingDataWithLots {
    const w = this.getPreviousWrapperOrUndefined(pnlWithTotals);
    if( !w ) {
      return {
        rollingWeiCount: BigNumber.from(0),
        rollingCostBasis: 0,
        costOfOpenPositions: 0,
        txValue: 0,
        lots: [],
        rollingRewards: {},
      };
    }
    return w.pnlRollingDataWithLots;
  };

  private getPreviousWrapperOrUndefined(pnlWithTotals: PnlTransactionWrapper[]): PnlTransactionWrapper {
    if( pnlWithTotals.length === 0 ) {
      return undefined;
    }
    return pnlWithTotals[pnlWithTotals.length - 1];
  };

  private getDepositPnlEntry(
    utxn: UserTx,
    pnlWithTotals: PnlTransactionWrapper[]
  ): PnlRollingDataWithLots {
    const txn: PnlTxn | undefined = this.getInternalPnlTxn(utxn);
    const previousRolling = this.getPreviousRollingDataOrStub(pnlWithTotals);
    const prevLots = (previousRolling ? previousRolling.lots : []);
    const prevRewards = previousRolling ? previousRolling.rollingRewards : {};
    const lots = prevLots.map((x) => {return {...x}});
    lots.push({
      wei: txn?.ptokenWei,
      weiRemaining: txn?.ptokenWei,
      weiLocked: BigNumber.from(0),
      costBasisUSD: txn.costBasisUsdPerPToken,
      saleProceedsUSD: 0,
      totalCostUsd: txn.valueUSD,
      totalCostWant: txn.wantWei,
      costBasisWant: txn.costBasisWantPerPToken,
      saleProceedsWant: BigNumber.from(0), // TODO
      status: "open",
      timestamp: txn.timestamp,
    });
    return this.createRollingDataFromLots(txn.valueUSD, lots, txn.decimals, prevRewards);
  };

  private getWithdrawPnlEntry(
    utxn: UserTx,
    pnlWithTotals: PnlTransactionWrapper[],
    checkUnstake: boolean,
  ): PnlRollingDataWithLots {
    const txn: PnlTxn | undefined = this.getInternalPnlTxn(utxn);
    const decimals = txn.decimals;
    const previousRolling = this.getPreviousRollingDataOrStub(pnlWithTotals);
    // deep clone the lots
    const prevLots = (previousRolling ? previousRolling.lots : []);
    const prevRewards = previousRolling ? previousRolling.rollingRewards : {};
    let previousLots: Lot[] = prevLots.map((x) => {return {...x}});
    if( checkUnstake ) {
      previousLots = this.applyUnstakeToRollingTotals(utxn, previousLots);
    }
    const valueBeingClosed = txn.valueUSD;
    const newLots = this.applyWithdrawToLots(txn.ptokenWei, txn.wantWei, previousLots, valueBeingClosed);
    return this.createRollingDataFromLots(txn.valueUSD, newLots, decimals, prevRewards);
  };

  private applyWithdrawToLots(ptokenWei: BigNumber, wantWei: BigNumber, previousLots: Lot[], valueBeingClosed: number) {
    // TODO replace with for loop? easier for debugging
    let weiLeftToClose = ptokenWei;
    const tmpPrecision = 100000000;
    const newLots = previousLots.map((oneLot) => {
      if (weiLeftToClose === BigNumber.from(0) || oneLot.status === "closed") {
        return oneLot;
      }
      if (oneLot.weiRemaining.sub(weiLeftToClose).gt(BigNumber.from(0))) {
        // this lot has 300 left to close but we are only closing 100 of it
        const dollarsClosing = Math.round((weiLeftToClose.mul(tmpPrecision).div(ptokenWei).toNumber()) * valueBeingClosed) / tmpPrecision;
        const wantWeiClosing = weiLeftToClose.mul(wantWei).mul(this.oneEn(30)).div(ptokenWei).div(this.oneEn(30));
        const ret: Lot = { ...oneLot, weiRemaining: oneLot.weiRemaining.sub(weiLeftToClose) } as Lot;
        ret.saleProceedsUSD += Math.round(dollarsClosing*1000)/1000;
        ret.saleProceedsWant = ret.saleProceedsWant.add(wantWeiClosing);
        weiLeftToClose = BigNumber.from(0);
        return ret;
      } else {
        // this lot has 300 left to close and we are closing all or more, so use all of this lot
        const dollarsClosing = Math.round((oneLot.weiRemaining.mul(tmpPrecision).div(ptokenWei).toNumber()) * valueBeingClosed) / tmpPrecision;
        const wantWeiClosing = oneLot.weiRemaining.mul(wantWei).mul(this.oneEn(30)).div(ptokenWei).div(this.oneEn(30)); //.div(oneEn(txn.wantDecimals));
        weiLeftToClose = weiLeftToClose.sub(oneLot.weiRemaining);
        const ret: Lot = { ...oneLot, weiRemaining: BigNumber.from(0), status: "closed" } as Lot;
        ret.saleProceedsUSD += Math.round(dollarsClosing*1000)/1000;
        ret.saleProceedsWant = ret.saleProceedsWant.add(wantWeiClosing);
        return ret;
      }
    });
    return newLots;
  }


  private getTransferPnlEntry(
    userWallet: string,
    txn: UserTx,
    pnlWithTotals: PnlTransactionWrapper[]
  ): PnlRollingDataWithLots {
    const transfers: UserTransfer[] = txn.transfers.filter((x) => x.transfer_type === 'PTRANSFER');
    const previousRolling = this.getPreviousRollingDataOrStub(pnlWithTotals);
    let rollingTokenCountBN = previousRolling ? previousRolling.rollingWeiCount : BigNumber.from(0);
    const prevLots = (previousRolling ? previousRolling.lots : []);
    const prevRewards = previousRolling ? previousRolling.rollingRewards : {};
    let lots = prevLots.map((x) => {return {...x}});
    let decimals = 18;
    let runningVal = 0;
    for (let i = 0; i < transfers.length; i++ ) {
      if( transfers[i].toAddress.toLowerCase() === userWallet.toLowerCase()) {
        // this is a deposit. We received free ptokens
        runningVal += transfers[i].value;
        decimals = transfers[i].decimals;
        rollingTokenCountBN = rollingTokenCountBN.add(transfers[i].amount);
        lots.push({
          wei: BigNumber.from(transfers[i].amount),
          weiRemaining: BigNumber.from(transfers[i].amount),
          weiLocked: BigNumber.from(0),
          costBasisUSD: 0,
          saleProceedsUSD: 0,
          totalCostUsd: 0,
          totalCostWant: BigNumber.from(0),
          costBasisWant: 0,
          saleProceedsWant: BigNumber.from(0), // TODO
          status: "open",
          timestamp: txn.timestamp,
        });
      } else if (transfers[i].fromAddress.toLowerCase() === userWallet.toLowerCase()) {
        // This is a withdraw
        runningVal += transfers[i].value;
        decimals = transfers[i].decimals;
        lots = this.applyWithdrawToLots(BigNumber.from(transfers[i].amount), BigNumber.from(0), lots, transfers[i].value);
      }
    }
    return this.createRollingDataFromLots(runningVal, lots, decimals, prevRewards);
  };

  private createRollingDataFromLots(txVal: number, lots: Lot[], decimals: number, prevStake: StakingRewards): PnlRollingDataWithLots {
    const tmpPrecision = 1e8;
    let runningCostUSD = 0;
    let rollingTokenCountBN = BigNumber.from(0);
    for (let i = 0; i < lots.length; i++ ) {
      if( lots[i].status === 'open') {
        // We only care about open
        const fraction = lots[i].weiRemaining.mul(tmpPrecision).div(lots[i].wei).toNumber() / tmpPrecision;
        const fractionOfCost = fraction * lots[i].totalCostUsd;
        runningCostUSD += fractionOfCost;
        rollingTokenCountBN = rollingTokenCountBN.add(lots[i].weiRemaining);
      }
    }
    const rollingTokenCountNum = weiToTokens(rollingTokenCountBN, decimals);
    const rollingCostBasis = rollingTokenCountNum === 0 ? 0 : runningCostUSD / rollingTokenCountNum;
    
    return {
      rollingWeiCount: rollingTokenCountBN,
      rollingCostBasis: rollingCostBasis,
      costOfOpenPositions: runningCostUSD,
      txValue: txVal,
      lots: lots,
      rollingRewards: JSON.parse(JSON.stringify(prevStake)),
    };
  }

  private getStakePnlEntry(
    txn: UserTx,
    pnlWithTotals: PnlTransactionWrapper[]
  ): PnlRollingDataWithLots {
    const previousRolling = this.getPreviousRollingDataOrStub(pnlWithTotals);
    const prevLots = (previousRolling ? previousRolling.lots : []);
    const prevRewards = previousRolling ? previousRolling.rollingRewards : {};
    let lots = prevLots.map((x) => {return {...x}});
    lots = this.applyStakeToRollingTotals(txn, lots);
    const unstakeTransfer = txn.transfers.find((x) => x.transfer_type === 'STAKE');
    const val = unstakeTransfer ? unstakeTransfer.value : 0;
    const decimals = unstakeTransfer ? unstakeTransfer.decimals : 18;
    return this.createRollingDataFromLots(val, lots, decimals, prevRewards);
  };

  private applyStakeToRollingTotals(txn: UserTx, lots: Lot[]): Lot[] {
    const stakeTransfer = txn.transfers.find((x) => x.transfer_type === 'STAKE');
    if( stakeTransfer ) {
      let leftToStake = BigNumber.from(stakeTransfer.amount);
      for (let i = 0; i < lots.length && leftToStake.gt(0); i++ ) {
        if (lots[i].status !== 'closed') {
          const remaining = lots[i].weiRemaining;
          const locked = lots[i].weiLocked;
          const availableToLock = remaining.sub(locked);
          if( availableToLock.gt(leftToStake)) {
            // We want to lock 100, there are 300 available to lock. Lock 100, 0 are left to stake
            lots[i].weiLocked = lots[i].weiLocked.add(leftToStake);
            leftToStake = BigNumber.from(0);
          } else {
            // We want to lock 100, there are 50 available to lock. Lock 50. There are still more to lock
            lots[i].weiLocked = lots[i].weiLocked.add(availableToLock);
            leftToStake = leftToStake.sub(availableToLock);
          }
        }
      }
    }
    return lots;
  }

  private getUnstakePnlEntry(
    txn: UserTx,
    pnlWithTotals: PnlTransactionWrapper[]
  ): PnlRollingDataWithLots {
    const previousRolling = this.getPreviousRollingDataOrStub(pnlWithTotals);
    const prevLots = (previousRolling ? previousRolling.lots : []);
    const prevRewards = previousRolling ? previousRolling.rollingRewards : {};
    let lots = prevLots.map((x) => {return {...x}});
    lots = this.applyUnstakeToRollingTotals(txn, lots);
    const unstakeTransfer = txn.transfers.find((x) => x.transfer_type === 'UNSTAKE');
    const val = unstakeTransfer ? unstakeTransfer.value : 0;
    const decimals = unstakeTransfer ? unstakeTransfer.decimals : 18;
    return this.createRollingDataFromLots(val, lots, decimals, prevRewards);
  };


  private applyUnstakeToRollingTotals(txn: UserTx, lots: Lot[]): Lot[] {
    const unstakeTransfer = txn.transfers.find((x) => x.transfer_type === 'UNSTAKE');
    if( unstakeTransfer ) {
      let leftToUnlock = BigNumber.from(unstakeTransfer.amount);
      for (let i = 0; i < lots.length && leftToUnlock.gt(0); i++ ) {
        if (lots[i].status !== 'closed') {
          const locked = lots[i].weiLocked;
          if( locked.gt(leftToUnlock)) {
            // we want to unlock 100, there are 200 locked. Unlock the 100
            lots[i].weiLocked = lots[i].weiLocked.sub(leftToUnlock);
            leftToUnlock = BigNumber.from(0);
          } else {
            // we want to unlock 100, there are 50 locked. Unlock the 50 and continue
            lots[i].weiLocked = lots[i].weiLocked.sub(locked);
            leftToUnlock = leftToUnlock.sub(locked);
          }
        }
      }
    }
    return lots;
  }
}


export const weiToTokens = (wei: BigNumber, decimals: number): number => {
  return weiToTokensWithPrecission(wei, decimals, 8);
}
export const weiToTokensWithPrecission = (wei: BigNumber, decimals: number, precission: number): number => {
  const digits = wei.toString().length;
  const safelyRemove = Math.max(0, digits - precission);
  const toRemove = Math.min(safelyRemove, Math.max(0,decimals - precission));
  let toRemoveWorking = toRemove;
  let working = wei;
  while( toRemoveWorking > precission ) {
    working = working.div(Math.floor(Math.pow(10,precission)));
    toRemoveWorking -= precission;
  }
  if( toRemoveWorking > 0 ) {
    working = working.div(Math.floor(Math.pow(10, toRemoveWorking)));
    toRemoveWorking = 0;
  }
  return working.toNumber() / Math.pow(10, decimals - toRemove);
};