import { BigNumber } from "ethers";
import { Lot, PnlRollingDataWithLots, PnlTransactionWrapper, UserJarHistory, UserTx } from "../../src/client/pnl/UserHistoryInterfaces";
import { generatePnL, weiToTokensWithPrecission } from "../../src/client/pnl/UserHistoryPnlGenerator";

const SIMPLE_DEPOSIT_AND_WITHDRAW_NO_PROFIT: UserJarHistory = {
  "test": [
    {
      "hash": "0xcd30cae79fb6c2db4482e9fac6e3027bdaa01f5efa950df83f949aad366d1361",
      "transaction_type": "DEPOSIT",
      "chain_id": 1,
      "timestamp": 1618217351,
      "blocknumber": 12224268,
      "indexInBlock": 230,
      "transfers": [
        {
          "amount": "979137826705457838969",
          "decimals": 18,
          "transfer_type": "WANT_DEPOSIT",
          "log_index": 267,
          "fromAddress": "0xfeedc450742ac0d9bb38341d9939449e3270f76f",
          "toAddress": "0x1ed1fd33b62bea268e527a622108fe0ee0104c07",
          "tokenAddress": "0x860425be6ad1345dc7a3e287facbf32b18bc4fae",
          "price": "5.220625732490907",
          "value": 5111.716312233314
        },
        {
          "amount": "979137826705457838969",
          "decimals": 18,
          "transfer_type": "DEPOSIT",
          "log_index": 268,
          "fromAddress": "0x0000000000000000000000000000000000000000",
          "toAddress": "0xfeedc450742ac0d9bb38341d9939449e3270f76f",
          "tokenAddress": "0x1ed1fd33b62bea268e527a622108fe0ee0104c07",
          "price": "5.220625732490907",
          "value": 5111.716312233314
        }
      ]
    },
    {
      "hash": "0x522b282bb682b83c69cf0107a3e17f99fd801df75c5c4d297e0c7aeb2daee6ce",
      "transaction_type": "WITHDRAW",
      "chain_id": 1,
      "timestamp": 1618352033,
      "blocknumber": 12234386,
      "indexInBlock": 119,
      "transfers": [
        {
        "amount": "979137826705457838969",
        "decimals": 18,
        "transfer_type": "WITHDRAW",
        "log_index": 128,
        "fromAddress": "0xfeedc450742ac0d9bb38341d9939449e3270f76f",
        "toAddress": "0x0000000000000000000000000000000000000000",
        "tokenAddress": "0x1ed1fd33b62bea268e527a622108fe0ee0104c07",
        "price": "5.220627756953674",
        "value": 5111.716312233314
        },
        {
        "amount": "979137826705457838969",
        "decimals": 18,
        "transfer_type": "WANT_WITHDRAW",
        "log_index": 134,
        "fromAddress": "0x1ed1fd33b62bea268e527a622108fe0ee0104c07",
        "toAddress": "0xfeedc450742ac0d9bb38341d9939449e3270f76f",
        "tokenAddress": "0x860425be6ad1345dc7a3e287facbf32b18bc4fae",
        "price": "5.220627756953674",
        "value": 5111.716312233314
        }
      ]
    }
  ]
};


const SIMPLE_DEPOSIT_ONLY_NO_RATIO_CHANGE: UserJarHistory = {
  "test": [
    {
      "hash": "0xcd30cae79fb6c2db4482e9fac6e3027bdaa01f5efa950df83f949aad366d1361",
      "transaction_type": "DEPOSIT",
      "chain_id": 1,
      "timestamp": 1618217351,
      "blocknumber": 12224268,
      "indexInBlock": 230,
      "transfers": [
        {
          "amount": "979137826705457838969",
          "decimals": 18,
          "transfer_type": "WANT_DEPOSIT",
          "log_index": 267,
          "fromAddress": "0xfeedc450742ac0d9bb38341d9939449e3270f76f",
          "toAddress": "0x1ed1fd33b62bea268e527a622108fe0ee0104c07",
          "tokenAddress": "0x860425be6ad1345dc7a3e287facbf32b18bc4fae",
          "price": "5.220625732490907",
          "value": 5111.716312233314
        },
        {
          "amount": "979137826705457838969",
          "decimals": 18,
          "transfer_type": "DEPOSIT",
          "log_index": 268,
          "fromAddress": "0x0000000000000000000000000000000000000000",
          "toAddress": "0xfeedc450742ac0d9bb38341d9939449e3270f76f",
          "tokenAddress": "0x1ed1fd33b62bea268e527a622108fe0ee0104c07",
          "price": "5.220625732490907",
          "value": 5111.716312233314
        }
      ]
    }
  ]
};

const generateAddresses = (count: number): string[] => {
  const collector: string[] = [];
  for (let i = 10000; i < 10000 + count; i++ ) {
    collector.push("0x00000000000000000000000000000000000" + (""+i));
  }
  return collector;
}

const generateHash = (count: number): string => {
  const hashNum = 1000000 + count;
  const prefix = "0x000000000000000000000000000000000000000000000000000000000";
  return prefix + ("" + hashNum);
}

enum ADDRESS_KEYS {
  WANT_TOKEN = 0,
  JAR = 1,
  FARM = 2,
  USER = 3,
  ZAP_CONTRACT = 4,
  REWARD_1 = 5,
  REWARD_2 = 6,
}
const ADDRESS_ARRAY = generateAddresses(10);

const generateJarDeposit = (txNum: number, wantAmt: number, wantDecimals: number, wantPrice: number, ratio: number): UserTx => {
  const wantBN = BigNumber.from(wantAmt * 1e6).mul(Math.pow(10, wantDecimals - 6));
  const ind = Math.floor(Math.random() * 300);
  const wantTransfer = {
    "amount": wantBN.toString(),
    "decimals": wantDecimals,
    "transfer_type": "WANT_DEPOSIT",
    "log_index": ind,
    "fromAddress": ADDRESS_ARRAY[ADDRESS_KEYS.USER],
    "toAddress": ADDRESS_ARRAY[ADDRESS_KEYS.JAR],
    "tokenAddress": ADDRESS_ARRAY[ADDRESS_KEYS.WANT_TOKEN],
    "price": wantPrice.toString(),
    "value": wantPrice * wantAmt
  };

  const ptokenBN = BigNumber.from(Math.floor((wantAmt * 1e6) / ratio)).mul(Math.pow(10, wantDecimals - 6));
  const ptokenTransfer =         {
    "amount": ptokenBN.toString(),
    "decimals": 18,
    "transfer_type": "DEPOSIT",
    "log_index": ind + 1,
    "fromAddress": "0x0000000000000000000000000000000000000000",
    "toAddress": ADDRESS_ARRAY[ADDRESS_KEYS.USER],
    "tokenAddress": ADDRESS_ARRAY[ADDRESS_KEYS.JAR],
    "price": (wantPrice * ratio).toString(),
    "value": wantPrice * wantAmt * ratio,
  }
  const tx: UserTx = {
    "hash": generateHash(txNum),
    "transaction_type": "DEPOSIT",
    "chain_id": 1,
    "timestamp": 1000000000 * txNum,
    "blocknumber": 10000000 * txNum,
    "indexInBlock": 230,
    "transfers": [wantTransfer, ptokenTransfer],
  };
  return tx;
}


const generateJarWithdraw = (txNum: number, wantAmt: number, wantDecimals: number, wantPrice: number, ratio: number): UserTx => {
  // todo add precission
  const totalValue = wantAmt * wantPrice;
  const ind = Math.floor(Math.random() * 300);
  const ptokenBN = BigNumber.from(Math.floor((wantAmt * 1e6) / ratio)).mul(Math.pow(10, wantDecimals - 6));
  const ptokenTransfer =         {
    "amount": ptokenBN.toString(),
    "decimals": 18,
    "transfer_type": "WITHDRAW",
    "log_index": ind,
    "fromAddress": ADDRESS_ARRAY[ADDRESS_KEYS.USER],
    "toAddress": "0x0000000000000000000000000000000000000000",
    "tokenAddress": ADDRESS_ARRAY[ADDRESS_KEYS.JAR],
    "price": (wantPrice * ratio).toString(),
    "value": totalValue,
  }

  const wantBN = BigNumber.from(wantAmt * 1e6).mul(Math.pow(10, wantDecimals - 6));
  const wantTransfer = {
    "amount": wantBN.toString(),
    "decimals": wantDecimals,
    "transfer_type": "WANT_WITHDRAW",
    "log_index": ind + 1,
    "fromAddress": ADDRESS_ARRAY[ADDRESS_KEYS.JAR],
    "toAddress": ADDRESS_ARRAY[ADDRESS_KEYS.USER],
    "tokenAddress": ADDRESS_ARRAY[ADDRESS_KEYS.WANT_TOKEN],
    "price": wantPrice.toString(),
    "value": totalValue,
  };

  const tx: UserTx = {
    "hash": generateHash(txNum),
    "transaction_type": "WITHDRAW",
    "chain_id": 1,
    "timestamp": 1000000000 * txNum,
    "blocknumber": 10000000 * txNum,
    "indexInBlock": 230,
    "transfers": [ptokenTransfer, wantTransfer],
  };
  return tx;
}


const generateStakeTx = (txNum: number, ptokenAmt: number, ptokenDecimals: number, wantPrice: number, ratio: number): UserTx => {
  const ind = Math.floor(Math.random() * 300);
  const ptokenBN = BigNumber.from(Math.floor((ptokenAmt * 1e6))).mul(Math.pow(10, ptokenDecimals - 6));
  const stakeTransfer =         {
    "amount": ptokenBN.toString(),
    "decimals": ptokenDecimals,
    "transfer_type": "STAKE",
    "log_index": ind,
    "fromAddress": ADDRESS_ARRAY[ADDRESS_KEYS.USER],
    "toAddress": ADDRESS_ARRAY[ADDRESS_KEYS.FARM],
    "tokenAddress": ADDRESS_ARRAY[ADDRESS_KEYS.JAR],
    "price": (wantPrice * ratio).toString(),
    "value": wantPrice * ptokenAmt,
  }

  const tx: UserTx = {
    "hash": generateHash(txNum),
    "transaction_type": "STAKE",
    "chain_id": 1,
    "timestamp": 1000000000 * txNum,
    "blocknumber": 10000000 * txNum,
    "indexInBlock": 230,
    "transfers": [stakeTransfer],
  };
  return tx;
}

const generateUnstakeTx = (txNum: number, ptokenAmt: number, ptokenDecimals: number, wantPrice: number, ratio: number,
  rewardAmt: number, rewardDecimals: number, rewardPrice: number): UserTx => {
  const ind = Math.floor(Math.random() * 300);
  const ptokenBN = BigNumber.from(Math.floor((ptokenAmt * 1e6))).mul(Math.pow(10, ptokenDecimals - 6));
  const unstakeTransfer =         {
    "amount": ptokenBN.toString(),
    "decimals": ptokenDecimals,
    "transfer_type": "UNSTAKE",
    "log_index": ind,
    "fromAddress": ADDRESS_ARRAY[ADDRESS_KEYS.FARM],
    "toAddress": ADDRESS_ARRAY[ADDRESS_KEYS.USER],
    "tokenAddress": ADDRESS_ARRAY[ADDRESS_KEYS.JAR],
    "price": (wantPrice * ratio).toString(),
    "value": wantPrice * ptokenAmt,
  }

  const rewardBN = BigNumber.from(Math.floor((rewardAmt * 1e6))).mul(Math.pow(10, rewardDecimals - 6));
  const rewardTransfer =         {
    "amount": rewardBN.toString(),
    "decimals": rewardDecimals,
    "transfer_type": "STAKE_REWARD",
    "log_index": ind,
    "fromAddress": ADDRESS_ARRAY[ADDRESS_KEYS.FARM],
    "toAddress": ADDRESS_ARRAY[ADDRESS_KEYS.USER],
    "tokenAddress": ADDRESS_ARRAY[ADDRESS_KEYS.REWARD_1],
    "price": rewardPrice.toString(),
    "value": rewardPrice * rewardAmt,
  }

  const tx: UserTx = {
    "hash": generateHash(txNum),
    "transaction_type": "UNSTAKE",
    "chain_id": 1,
    "timestamp": 1000000000 * txNum,
    "blocknumber": 10000000 * txNum,
    "indexInBlock": 230,
    "transfers": [unstakeTransfer, rewardTransfer],
  };
  return tx;
}

const assertLot = (lot: Lot, status: string, wei: string, weiRemain: string, weiLocked: string, basis: number) => {
  expect(lot.status).toBe(status);
  expect(lot.wei.toString()).toBe(wei);
  expect(lot.weiRemaining.toString()).toBe(weiRemain);
  expect(lot.weiLocked.toString()).toBe(weiLocked);
  // we sometimes lose a tiny tiny bit of precission bc of floating point numbers and math
  // so round to the nearest $0.000001
  expect(Math.round(lot.costBasisUSD*1000000)/1000000).toBe(basis);
}


describe("Testing Single Deposit", () => {
  test("basic", async () => {
    const summarized: PnlTransactionWrapper[] = generatePnL("0xfeedc450742ac0d9bb38341d9939449e3270f76f", SIMPLE_DEPOSIT_ONLY_NO_RATIO_CHANGE.test);
    expect(summarized.length).toBe(1);
    expect(summarized[0].pnlRollingDataWithLots.lots.length).toBe(1);
    expect(summarized[0].pnlRollingDataWithLots.lots[0].status).toBe('open');
    expect(summarized[0].pnlRollingDataWithLots.lots[0].wei.toString()).toBe("979137826705457838969");
    expect(summarized[0].pnlRollingDataWithLots.lots[0].weiRemaining.toString()).toBe("979137826705457838969");
    expect(summarized[0].pnlRollingDataWithLots.lots[0].weiLocked.toString()).toBe("0");
    expect(summarized[0].pnlRollingDataWithLots.lots[0].costBasisUSD).toBe(5.220625732490907);
  });
});

describe("Testing Single Generated Deposit", () => {
  test("basic", async () => {
    const tx = generateJarDeposit(1, 2, 18, 5, 1);
    const summarized2: PnlTransactionWrapper[] = generatePnL(ADDRESS_ARRAY[ADDRESS_KEYS.USER], [tx]);
    const summarized: PnlRollingDataWithLots[] = summarized2.map((x) => x.pnlRollingDataWithLots);
    expect(summarized.length).toBe(1);
    expect(summarized[0].lots.length).toBe(1);
    assertLot(summarized[0].lots[0], 'open', "2000000000000000000", "2000000000000000000", "0", 5);
  });
});


describe("Testing Two Deposits Same Price", () => {
  test("basic", async () => {
    const tx = generateJarDeposit(1, 2, 18, 5, 1);
    const tx2 = generateJarDeposit(2, 2, 18, 5, 1);
    const summarized2: PnlTransactionWrapper[] = generatePnL(ADDRESS_ARRAY[ADDRESS_KEYS.USER], [tx, tx2]);
    const summarized: PnlRollingDataWithLots[] = summarized2.map((x) => x.pnlRollingDataWithLots);

    expect(summarized.length).toBe(2);
    expect(summarized[0].lots.length).toBe(1);
    assertLot(summarized[0].lots[0], 'open', "2000000000000000000", "2000000000000000000", "0", 5);

    expect(summarized[1].lots.length).toBe(2);
    assertLot(summarized[1].lots[0], 'open', "2000000000000000000", "2000000000000000000", "0", 5);
    assertLot(summarized[1].lots[1], 'open', "2000000000000000000", "2000000000000000000", "0", 5);

    expect(summarized[0].rollingCostBasis).toBe(5);
    expect(summarized[1].rollingCostBasis).toBe(5);
  });
});



describe("Testing Two Deposits Different Price", () => {
  test("basic", async () => {
    const tx = generateJarDeposit(1, 2, 18, 5, 1);
    const tx2 = generateJarDeposit(2, 2, 18, 7, 1);
    const summarized2: PnlTransactionWrapper[] = generatePnL(ADDRESS_ARRAY[ADDRESS_KEYS.USER], [tx, tx2]);
    const summarized: PnlRollingDataWithLots[] = summarized2.map((x) => x.pnlRollingDataWithLots);
    expect(summarized.length).toBe(2);
    expect(summarized[0].lots.length).toBe(1);
    assertLot(summarized[0].lots[0], 'open', "2000000000000000000", "2000000000000000000", "0", 5);

    expect(summarized[1].lots.length).toBe(2);
    assertLot(summarized[1].lots[0], 'open', "2000000000000000000", "2000000000000000000", "0", 5);
    assertLot(summarized[1].lots[1], 'open', "2000000000000000000", "2000000000000000000", "0", 7);

    expect(summarized[0].lots[0].costBasisUSD).toBe(5);
    expect(summarized[1].lots[0].costBasisUSD).toBe(5);
    expect(summarized[1].lots[1].costBasisUSD).toBe(7);

    expect(summarized[0].rollingCostBasis).toBe(5);
    expect(summarized[1].rollingCostBasis).toBe(6);
  });
});



describe("Testing One Deposit One Withdraw-All Same Price", () => {
  test("basic", async () => {
    const tx = generateJarDeposit(1, 2, 18, 5, 1);
    const tx2 = generateJarWithdraw(2, 2, 18, 5, 1);
    const summarized2: PnlTransactionWrapper[] = generatePnL(ADDRESS_ARRAY[ADDRESS_KEYS.USER], [tx, tx2]);
    const summarized: PnlRollingDataWithLots[] = summarized2.map((x) => x.pnlRollingDataWithLots);

    expect(summarized.length).toBe(2);
    expect(summarized[0].lots.length).toBe(1);
    assertLot(summarized[0].lots[0], 'open', "2000000000000000000", "2000000000000000000", "0", 5);
    expect(summarized[0].lots[0].saleProceedsUSD).toBe(0);

    expect(summarized[1].lots.length).toBe(1);
    assertLot(summarized[1].lots[0], 'closed', "2000000000000000000", "0", "0", 5);
    expect(summarized[1].lots[0].saleProceedsUSD).toBe(10);
  });
});


describe("Testing One Deposit One Withdraw Half Same Price", () => {
  test("basic", async () => {
    const tx = generateJarDeposit(1, 2, 18, 5, 1);
    const tx2 = generateJarWithdraw(2, 1, 18, 5, 1);
    const summarized2: PnlTransactionWrapper[] = generatePnL(ADDRESS_ARRAY[ADDRESS_KEYS.USER], [tx, tx2]);
    const summarized: PnlRollingDataWithLots[] = summarized2.map((x) => x.pnlRollingDataWithLots);
    expect(summarized.length).toBe(2);
    expect(summarized[0].lots.length).toBe(1);
    assertLot(summarized[0].lots[0], 'open', "2000000000000000000", "2000000000000000000", "0", 5);
    assertLot(summarized[1].lots[0], 'open', "2000000000000000000", "1000000000000000000", "0", 5);
    expect(summarized[0].lots[0].saleProceedsUSD).toBe(0);
    expect(summarized[1].lots[0].saleProceedsUSD).toBe(5);
  });
});


describe("Testing One Deposit Two Withdraws Same Price", () => {
  test("basic", async () => {
    const tx = generateJarDeposit(1, 2, 18, 5, 1);
    const tx2 = generateJarWithdraw(2, 1, 18, 5, 1);
    const tx3 = generateJarWithdraw(2, 1, 18, 5, 1);
    const summarized2: PnlTransactionWrapper[] = generatePnL(ADDRESS_ARRAY[ADDRESS_KEYS.USER],[tx, tx2, tx3]);
    const summarized: PnlRollingDataWithLots[] = summarized2.map((x) => x.pnlRollingDataWithLots);

    expect(summarized.length).toBe(3);
    expect(summarized[0].lots.length).toBe(1);
    assertLot(summarized[0].lots[0], 'open', "2000000000000000000", "2000000000000000000", "0", 5);

    expect(summarized[1].lots.length).toBe(1);
    assertLot(summarized[1].lots[0], 'open', "2000000000000000000", "1000000000000000000", "0", 5);

    expect(summarized[2].lots.length).toBe(1);
    assertLot(summarized[2].lots[0], 'closed', "2000000000000000000", "0", "0", 5);

    expect(summarized[0].lots[0].saleProceedsUSD).toBe(0);
    expect(summarized[1].lots[0].saleProceedsUSD).toBe(5);
    expect(summarized[2].lots[0].saleProceedsUSD).toBe(10);

  });
});


describe("Testing Two Deposits One Withdraw-All Same Price", () => {
  test("basic", async () => {
    const tx = generateJarDeposit(1, 2, 18, 5, 1);
    const tx2 = generateJarDeposit(2, 2, 18, 5, 1);
    const tx3 = generateJarWithdraw(3, 4, 18, 5, 1);
    const summarized2: PnlTransactionWrapper[] = generatePnL(ADDRESS_ARRAY[ADDRESS_KEYS.USER],[tx, tx2, tx3]);
    const summarized: PnlRollingDataWithLots[] = summarized2.map((x) => x.pnlRollingDataWithLots);

    expect(summarized.length).toBe(3);
    expect(summarized[0].lots.length).toBe(1);
    assertLot(summarized[0].lots[0], 'open', "2000000000000000000", "2000000000000000000", "0", 5);

    expect(summarized[1].lots.length).toBe(2);
    assertLot(summarized[1].lots[0], 'open', "2000000000000000000", "2000000000000000000", "0", 5);
    assertLot(summarized[1].lots[1], 'open', "2000000000000000000", "2000000000000000000", "0", 5);


    expect(summarized[2].lots.length).toBe(2);
    assertLot(summarized[2].lots[0], 'closed', "2000000000000000000", "0", "0", 5);
    assertLot(summarized[2].lots[1], 'closed', "2000000000000000000", "0", "0", 5);

    expect(summarized[0].lots[0].saleProceedsUSD).toBe(0);
    expect(summarized[1].lots[0].saleProceedsUSD).toBe(0);
    expect(summarized[2].lots[0].saleProceedsUSD).toBe(10);
    expect(summarized[2].lots[1].saleProceedsUSD).toBe(10);

  });
});

describe("Testing Two Deposits Two Withdraws Same Price Unmatched Lots", () => {
  test("basic", async () => {
    const tx = generateJarDeposit(1, 2, 18, 5, 1);
    const tx2 = generateJarDeposit(2, 2, 18, 5, 1);
    const tx3 = generateJarWithdraw(3, 3, 18, 5, 1);
    const tx4 = generateJarWithdraw(4, 1, 18, 5, 1);
    const summarized2: PnlTransactionWrapper[] = generatePnL(ADDRESS_ARRAY[ADDRESS_KEYS.USER],[tx, tx2, tx3, tx4]);
    const summarized: PnlRollingDataWithLots[] = summarized2.map((x) => x.pnlRollingDataWithLots);

    expect(summarized.length).toBe(4);
    expect(summarized[0].lots.length).toBe(1);
    assertLot(summarized[0].lots[0], 'open', "2000000000000000000", "2000000000000000000", "0", 5);

    expect(summarized[1].lots.length).toBe(2);
    assertLot(summarized[1].lots[0], 'open', "2000000000000000000", "2000000000000000000", "0", 5);
    assertLot(summarized[1].lots[1], 'open', "2000000000000000000", "2000000000000000000", "0", 5);

    expect(summarized[2].lots.length).toBe(2);
    assertLot(summarized[2].lots[0], 'closed', "2000000000000000000", "0", "0", 5);
    assertLot(summarized[2].lots[1], 'open', "2000000000000000000", "1000000000000000000", "0", 5); 

    expect(summarized[3].lots.length).toBe(2);
    assertLot(summarized[3].lots[0], 'closed', "2000000000000000000", "0", "0", 5);
    assertLot(summarized[3].lots[1], 'closed', "2000000000000000000", "0", "0", 5);

    expect(summarized[0].lots[0].saleProceedsUSD).toBe(0);
    expect(summarized[1].lots[0].saleProceedsUSD).toBe(0);
    expect(summarized[1].lots[1].saleProceedsUSD).toBe(0);
    expect(summarized[2].lots[0].saleProceedsUSD).toBe(10);
    expect(summarized[2].lots[1].saleProceedsUSD).toBe(5);
    expect(summarized[3].lots[0].saleProceedsUSD).toBe(10);
    expect(summarized[3].lots[1].saleProceedsUSD).toBe(10);
  });
});



describe("Testing Two Deposits Different Prices Two Withdraws", () => {
  test("basic", async () => {
    const tx = generateJarDeposit(1, 2, 18, 5, 1);
    const tx2 = generateJarDeposit(2, 2, 18, 7, 1);
    const tx3 = generateJarWithdraw(3, 3, 18, 7, 1);
    const tx4 = generateJarWithdraw(4, 1, 18, 7, 1);
    const summarized2: PnlTransactionWrapper[] = generatePnL(ADDRESS_ARRAY[ADDRESS_KEYS.USER],[tx, tx2, tx3, tx4]);
    const summarized: PnlRollingDataWithLots[] = summarized2.map((x) => x.pnlRollingDataWithLots);

    expect(summarized.length).toBe(4);
    expect(summarized[0].lots.length).toBe(1);
    assertLot(summarized[0].lots[0], 'open', "2000000000000000000", "2000000000000000000", "0", 5);

    expect(summarized[1].lots.length).toBe(2);
    expect(summarized[1].rollingCostBasis).toBe(6);
    assertLot(summarized[1].lots[0], 'open', "2000000000000000000", "2000000000000000000", "0", 5);
    assertLot(summarized[1].lots[1], 'open', "2000000000000000000", "2000000000000000000", "0", 7);

    expect(summarized[2].lots.length).toBe(2);
    expect(summarized[2].rollingCostBasis).toBe(7);
    expect(summarized[2].rollingWeiCount.toString()).toBe("1000000000000000000");
    assertLot(summarized[2].lots[0], 'closed', "2000000000000000000", "0", "0", 5);
    assertLot(summarized[2].lots[1], 'open', "2000000000000000000", "1000000000000000000", "0", 7); 

    expect(summarized[3].lots.length).toBe(2);
    expect(summarized[3].rollingCostBasis).toBe(0);
    expect(summarized[3].rollingWeiCount.toString()).toBe("0");
    assertLot(summarized[3].lots[0], 'closed', "2000000000000000000", "0", "0", 5);
    assertLot(summarized[3].lots[1], 'closed', "2000000000000000000", "0", "0", 7);

    expect(summarized[0].lots[0].saleProceedsUSD).toBe(0);
    expect(summarized[1].lots[0].saleProceedsUSD).toBe(0);
    expect(summarized[1].lots[1].saleProceedsUSD).toBe(0);
    expect(summarized[2].lots[0].saleProceedsUSD).toBe(14);
    expect(summarized[2].lots[1].saleProceedsUSD).toBe(7);
    expect(summarized[3].lots[0].saleProceedsUSD).toBe(14);
    expect(summarized[3].lots[1].saleProceedsUSD).toBe(14);
  });
});

describe("Testing One Deposit One Withdraw-All Same Price Different Ratio", () => {
  test("basic", async () => {
    const tx = generateJarDeposit(1, 2, 18, 5, 1);
    const tx2 = generateJarWithdraw(2, 3, 18, 5, 1.5);
    const summarized2: PnlTransactionWrapper[] = generatePnL(ADDRESS_ARRAY[ADDRESS_KEYS.USER],[tx, tx2]);
    const summarized: PnlRollingDataWithLots[] = summarized2.map((x) => x.pnlRollingDataWithLots);

    expect(summarized.length).toBe(2);
    expect(summarized[0].lots.length).toBe(1);
    assertLot(summarized[0].lots[0], 'open', "2000000000000000000", "2000000000000000000", "0", 5);
    expect(summarized[0].lots[0].saleProceedsUSD).toBe(0);

    expect(summarized[1].lots.length).toBe(1);
    assertLot(summarized[1].lots[0], 'closed', "2000000000000000000", "0", "0", 5);
    expect(summarized[1].lots[0].saleProceedsUSD).toBe(15);
    expect(summarized[1].lots[0].saleProceedsWant).toStrictEqual(BigNumber.from(3).mul(1e9).mul(1e9));
  });
});



describe("Testing One Deposit And Stake All With Exit Same Price Same Ratio", () => {
  test("basic", async () => {
    const tx = generateJarDeposit(1, 2, 18, 5, 1);
    const tx2 = generateStakeTx(2, 2, 18, 5, 1);
    const tx3 = generateUnstakeTx(3, 2, 18, 5, 1, 3, 18, 10);
    const tx4 = generateJarWithdraw(4, 2, 18, 5, 1);
    
    const summarized2: PnlTransactionWrapper[] = generatePnL(ADDRESS_ARRAY[ADDRESS_KEYS.USER],[tx, tx2, tx3, tx4]);
    const summarized: PnlRollingDataWithLots[] = summarized2.map((x) => x.pnlRollingDataWithLots);

    expect(summarized.length).toBe(4);
    expect(summarized[0].lots.length).toBe(1);
    assertLot(summarized[0].lots[0], 'open', "2000000000000000000", "2000000000000000000", "0", 5);
    expect(summarized[0].lots[0].saleProceedsUSD).toBe(0);

    expect(summarized[1].lots.length).toBe(1);
    assertLot(summarized[1].lots[0], 'open', "2000000000000000000", "2000000000000000000", "2000000000000000000", 5);
    expect(summarized[1].lots[0].saleProceedsUSD).toBe(0);

    expect(summarized[2].lots.length).toBe(1);
    assertLot(summarized[2].lots[0], 'open', "2000000000000000000", "2000000000000000000", "0", 5);
    expect(summarized[2].lots[0].saleProceedsUSD).toBe(0);

    expect(summarized[3].lots.length).toBe(1);
    assertLot(summarized[3].lots[0], 'closed', "2000000000000000000", "0", "0", 5);
    expect(summarized[3].lots[0].saleProceedsUSD).toBe(10);
  });
});


describe("Testing Two Deposit One Stake Three Unstake One Withdraw Same Price Same Ratio", () => {
  test("basic", async () => {
    const tx1 = generateJarDeposit(1, 2, 18, 5, 1);
    const tx1a = generateJarDeposit(2, 2, 18, 5, 1);
    const tx2 = generateStakeTx(3, 4, 18, 5, 1);
    const tx3 = generateUnstakeTx(4, 1, 18, 5, 1, 3, 18, 10);
    const tx3a = generateUnstakeTx(5, 2, 18, 5, 1, 3, 18, 10);
    const tx3b = generateUnstakeTx(6, 1, 18, 5, 1, 3, 18, 10);
    const tx4 = generateJarWithdraw(7, 4, 18, 5, 1);
    
    const summarized2: PnlTransactionWrapper[] = generatePnL(ADDRESS_ARRAY[ADDRESS_KEYS.USER],[tx1, tx1a, tx2, tx3, tx3a, tx3b, tx4]);
    const summarized: PnlRollingDataWithLots[] = summarized2.map((x) => x.pnlRollingDataWithLots);

    expect(summarized.length).toBe(7);
    expect(summarized[0].lots.length).toBe(1);
    assertLot(summarized[0].lots[0], 'open', "2000000000000000000", "2000000000000000000", "0", 5);
    expect(summarized2[0].transactionRewards[ADDRESS_ARRAY[ADDRESS_KEYS.REWARD_1]]).toBeFalsy();

    expect(summarized[1].lots.length).toBe(2);
    assertLot(summarized[1].lots[0], 'open', "2000000000000000000", "2000000000000000000", "0", 5);
    assertLot(summarized[1].lots[1], 'open', "2000000000000000000", "2000000000000000000", "0", 5);
    expect(summarized2[1].transactionRewards[ADDRESS_ARRAY[ADDRESS_KEYS.REWARD_1]]).toBeFalsy();

    // stake all 4
    expect(summarized[2].lots.length).toBe(2);
    assertLot(summarized[2].lots[0], 'open', "2000000000000000000", "2000000000000000000", "2000000000000000000", 5);
    assertLot(summarized[2].lots[1], 'open', "2000000000000000000", "2000000000000000000", "2000000000000000000", 5);
    expect(summarized2[2].transactionRewards[ADDRESS_ARRAY[ADDRESS_KEYS.REWARD_1]]).toBeFalsy();

    // Unstake 1
    expect(summarized[3].lots.length).toBe(2);
    assertLot(summarized[3].lots[0], 'open', "2000000000000000000", "2000000000000000000", "1000000000000000000", 5);
    assertLot(summarized[3].lots[1], 'open', "2000000000000000000", "2000000000000000000", "2000000000000000000", 5);
    expect(summarized2[3].transactionRewards[ADDRESS_ARRAY[ADDRESS_KEYS.REWARD_1]]).toBeTruthy();
    expect(summarized2[3].transactionRewards[ADDRESS_ARRAY[ADDRESS_KEYS.REWARD_1]].length).toBe(1);
    expect(summarized2[3].pnlRollingDataWithLots.rollingRewards[ADDRESS_ARRAY[ADDRESS_KEYS.REWARD_1]].length).toBe(1);

    // Unstake 2
    expect(summarized[4].lots.length).toBe(2);
    assertLot(summarized[4].lots[0], 'open', "2000000000000000000", "2000000000000000000", "0", 5);
    assertLot(summarized[4].lots[1], 'open', "2000000000000000000", "2000000000000000000", "1000000000000000000", 5);
    expect(summarized2[4].transactionRewards[ADDRESS_ARRAY[ADDRESS_KEYS.REWARD_1]]).toBeTruthy();
    expect(summarized2[4].transactionRewards[ADDRESS_ARRAY[ADDRESS_KEYS.REWARD_1]].length).toBe(1);
    expect(summarized2[4].pnlRollingDataWithLots.rollingRewards[ADDRESS_ARRAY[ADDRESS_KEYS.REWARD_1]].length).toBe(2);

    // unstake 1
    expect(summarized[5].lots.length).toBe(2);
    assertLot(summarized[5].lots[0], 'open', "2000000000000000000", "2000000000000000000", "0", 5);
    assertLot(summarized[5].lots[1], 'open', "2000000000000000000", "2000000000000000000", "0", 5);
    expect(summarized2[5].transactionRewards[ADDRESS_ARRAY[ADDRESS_KEYS.REWARD_1]]).toBeTruthy();
    expect(summarized2[5].transactionRewards[ADDRESS_ARRAY[ADDRESS_KEYS.REWARD_1]].length).toBe(1);
    expect(summarized2[5].pnlRollingDataWithLots.rollingRewards[ADDRESS_ARRAY[ADDRESS_KEYS.REWARD_1]].length).toBe(3);

    // withdraw all 4
    expect(summarized[6].lots.length).toBe(2);
    assertLot(summarized[6].lots[0], 'closed', "2000000000000000000", "0", "0", 5);
    assertLot(summarized[6].lots[1], 'closed', "2000000000000000000", "0", "0", 5);
    expect(summarized2[6].transactionRewards[ADDRESS_ARRAY[ADDRESS_KEYS.REWARD_1]]).toBeFalsy();
    expect(summarized2[6].pnlRollingDataWithLots.rollingRewards[ADDRESS_ARRAY[ADDRESS_KEYS.REWARD_1]].length).toBe(3);

  });
});


describe("Testing Two Deposit One Withdraw Different Prices Different Ratios", () => {
  test("basic", async () => {
    const tx1 = generateJarDeposit(1, 2, 18, 5, 1); // 2 ptokens
    const tx1a = generateJarDeposit(2, 3, 18, 6, 1.2); // 2.5 new ptokens, total 4.5 ptokens, 5.4 wants
    // 4.5 ptokens, 5.625 want, withdraw 4 wants or 3.2 ptokens, 1.3 ptokens left
    const tx4 = generateJarWithdraw(7, 4, 18, 7, 1.25); 
    const tx4a = generateJarWithdraw(7, 1.69, 18, 7, 1.3); // 1.3 ptokens left @ 1.3 = 1.69 wants left
    
    const summarized2: PnlTransactionWrapper[] = generatePnL(ADDRESS_ARRAY[ADDRESS_KEYS.USER],[tx1, tx1a, tx4, tx4a]);
    const summarized: PnlRollingDataWithLots[] = summarized2.map((x) => x.pnlRollingDataWithLots);

    expect(summarized.length).toBe(4);
    expect(summarized[0].lots.length).toBe(1);
    // 2 tokens open, 2 tokens available and not locked
    assertLot(summarized[0].lots[0], 'open', "2000000000000000000", "2000000000000000000", "0", 5);
    expect(summarized[0].lots[0].totalCostUsd).toBe(10);
    expect(summarized[0].lots[0].totalCostWant).toStrictEqual(BigNumber.from(2).mul(1e9).mul(1e9));
    
    expect(summarized[1].lots.length).toBe(2);
    assertLot(summarized[1].lots[0], 'open', "2000000000000000000", "2000000000000000000", "0", 5);
    // spent 18 to buy 2.5 ptokens
    assertLot(summarized[1].lots[1], 'open', "2500000000000000000", "2500000000000000000", "0", 7.2);
    expect(summarized[1].lots[1].totalCostUsd).toBe(18);
    expect(summarized[1].lots[1].totalCostWant).toStrictEqual(BigNumber.from(3).mul(1e9).mul(1e9));

    /*
     * Closing first lot and part of second lot
     */
    // 4.5 ptokens, 5.625 want, withdraw 4 wants = $35, or 3.2 ptokens, 1.3 ptokens left
    expect(summarized[2].lots.length).toBe(2);
    // withdrawing 3.2p
    // lot 0 was 2 ptokens @ 1.25w/p = 2.5 wants @ 7usd = $17.5, so this is closed,
    assertLot(summarized[2].lots[0], 'closed', "2000000000000000000", "0", "0", 5);
    expect(summarized[2].lots[0].totalCostUsd).toBe(10);
    expect(summarized[2].lots[0].totalCostWant).toStrictEqual(BigNumber.from(2).mul(1e9).mul(1e9));
    expect(summarized[2].lots[0].saleProceedsUSD).toBe(17.5);
    expect(summarized[2].lots[0].saleProceedsWant).toStrictEqual(BigNumber.from(25).mul(1e8).mul(1e9));

    // 1.2 ptokens left
    // lot 1 was 2.5 ptokens, withdrawing 1.2, so 1.3 left available
    assertLot(summarized[2].lots[1], 'open', "2500000000000000000", "1300000000000000000", "0", 7.2);
    expect(summarized[2].lots[1].totalCostUsd).toBe(18);
    expect(summarized[2].lots[1].totalCostWant).toStrictEqual(BigNumber.from(3).mul(1e9).mul(1e9));
    expect(summarized[2].lots[1].saleProceedsUSD).toBe(1.25 * 1.2 * 7);
    expect(summarized[2].lots[1].saleProceedsWant).toStrictEqual(BigNumber.from(15).mul(1e8).mul(1e9));

    /*
     * Closing remainder of second lot
     */

    // 1.3 ptokens @ 1.3 want/ptoken = 1.69 want, withdrawing all
    expect(summarized[3].lots.length).toBe(2);
    // lot 1 was 2.5 ptokens, withdrawing 1.2, so 1.3 left available
    assertLot(summarized[3].lots[1], 'closed', "2500000000000000000", "0", "0", 7.2);
    expect(summarized[3].lots[1].totalCostUsd).toBe(18);
    expect(summarized[3].lots[1].totalCostWant).toStrictEqual(BigNumber.from(3).mul(1e9).mul(1e9));
    const withdraw1Lot1Wants = BigNumber.from(15).mul(1e8).mul(1e9);
    const withdraw2Lot1Wants = BigNumber.from(169).mul(1e7).mul(1e9);
    const expectedLotProceeds = Math.round(((1.25*1.2*7) + (1.3*1.3*7))*1000000) / 1000000;
    expect(summarized[3].lots[1].saleProceedsUSD).toBe(expectedLotProceeds);
    expect(summarized[3].lots[1].saleProceedsWant).toStrictEqual(withdraw1Lot1Wants.add(withdraw2Lot1Wants));

    const wantProfitResultLot0 = summarized[3].lots[0].saleProceedsWant.sub(summarized[3].lots[0].totalCostWant);
    const wantProfitResultLot1 = summarized[3].lots[1].saleProceedsWant.sub(summarized[3].lots[1].totalCostWant);
    const wantProfitExpected = BigNumber.from(69).mul(1e7).mul(1e9);
    expect(wantProfitResultLot0.add(wantProfitResultLot1)).toStrictEqual(wantProfitExpected);

    const profitUSDLot0 = summarized[3].lots[0].saleProceedsUSD - summarized[3].lots[0].totalCostUsd;
    const profitUSDLot1 = summarized[3].lots[1].saleProceedsUSD - summarized[3].lots[1].totalCostUsd;
    expect(Math.round((profitUSDLot0 + profitUSDLot1)*1000000)/1000000).toBe(11.83);
  });
});

describe("Testing weiToTokensWithPrecission assumptions", () => {
  test("basic", async () => {
    expect(weiToTokensWithPrecission(BigNumber.from("1000000000000000000"), 18, 4)).toBe(1);
    expect(weiToTokensWithPrecission(BigNumber.from("1000000000000000000"), 19, 4)).toBe(0.1);
    expect(weiToTokensWithPrecission(BigNumber.from("1000000000000000000"), 20, 4)).toBe(.01);
    expect(weiToTokensWithPrecission(BigNumber.from("1000000000000000000"), 21, 4)).toBe(.001);
    expect(weiToTokensWithPrecission(BigNumber.from("1000000000000000000"), 25, 4)).toBe(.0000001);
    expect(weiToTokensWithPrecission(BigNumber.from("1000"), 3, 4)).toBe(1);
    expect(weiToTokensWithPrecission(BigNumber.from("1000"), 4, 4)).toBe(.1);
    expect(weiToTokensWithPrecission(BigNumber.from("1000"), 5, 4)).toBe(.01);
    expect(weiToTokensWithPrecission(BigNumber.from("1000"), 6, 4)).toBe(.001);
    expect(weiToTokensWithPrecission(BigNumber.from("1"), 18, 4)).toBe(.000000000000000001);
  });
});
