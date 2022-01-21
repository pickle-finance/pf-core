import { ethers } from "ethers";
import { toWei, soliditySha3 } from "web3-utils";

import MerkleTree from "./MerkleTree";
import { multicallProvider, multicallContract } from "./config";
import {
  AmountsByWeek,
  ClaimProof,
  ClaimsByWeek,
  ClaimStatusByWeek,
  DistributionRootByWeek,
  Snapshot,
  TokenClaimInfo,
} from "./types";
import fetch from "cross-fetch";
import { PfDataStore } from "../../model/PickleModel";
import { fulfillWithRetries } from "../../util/PromiseTimeout";

export class BalancerTokenClaim {
  /**
   * All the data we have fetched from IPFS in the
   * following format:
   * {
   *   [weekNumber]: {
   *     [address1]: "balance1",
   *     [address2]: "balance2"
   *   }
   * }
   */
  public claimsByWeek: ClaimsByWeek = {};

  /**
   * Specific amounts (values) we can claim for this signer
   * for specific weeks (keys).
   * E.g. { 2: "7.91", 3: "9.08" }
   */
  public unclaimedAmounts: AmountsByWeek = {};

  constructor(
    public tokenClaimInfo: TokenClaimInfo,
    private tokenIndex: number,
    private address: string,
    private dataStore: PfDataStore,
  ) {}

  fetchData = async (): Promise<void> => {
    const snapshot = await this.getSnapshot();
    this.claimsByWeek = await this.getClaimsByWeek(snapshot);

    const claimStatusByWeek = await this.getClaimStatusByWeek();
    const distributionRootByWeek = await this.getDistributionRootByWeek();

    this.unclaimedAmounts = await this.getUnclaimedAmountsByWeek(
      claimStatusByWeek,
      distributionRootByWeek,
    );
  };

  get claimableAmount(): number {
    return Object.values(this.unclaimedAmounts).reduce(
      (a, b) => a + parseFloat(b),
      0,
    );
  }

  get claims(): ClaimProof[] {
    const weeks = Object.keys(this.unclaimedAmounts);

    return weeks.map((week) => this.generateClaim(week));
  }

  private generateClaim = (week: string): ClaimProof => {
    const weeklyBalances = this.claimsByWeek[week];
    const balance = weeklyBalances[this.address];
    const merkleTree = this.generateMerkleTree(week);
    const proof = merkleTree.getHexProof(
      soliditySha3(this.address, toWei(balance))!,
    );

    return {
      distributionId: parseInt(week),
      balance: toWei(balance),
      distributor: this.tokenClaimInfo.distributor,
      tokenIndex: this.tokenIndex,
      merkleProof: proof,
    };
  };

  /**
   * Utility function for debugging, not required by the harvester.
   *
   * @param claim Claim tuple
   * @returns validation result as boolean
   */
  verifyClaim = async (claim: ClaimProof): Promise<boolean> => {
    const calls = [
      multicallContract.verifyClaim(
        this.tokenClaimInfo.token,
        this.tokenClaimInfo.distributor,
        claim.distributionId,
        this.address,
        claim.balance,
        claim.merkleProof,
      ),
    ];

    const [result] = await multicallProvider.all<boolean[]>(calls);

    return result;
  };

  // E.g. { 2: "7.91", 3: "9.08" }
  private getUnclaimedAmountsByWeek = async (
    claimStatusByWeek: ClaimStatusByWeek,
    distributionRootByWeek: DistributionRootByWeek,
  ): Promise<AmountsByWeek> => {
    const result: AmountsByWeek = {};

    for (const [week, claims] of Object.entries(this.claimsByWeek)) {
      // Already claimed, skip.
      if (claimStatusByWeek[week]) continue;

      // Distribution does not exist yet, skip.
      if (distributionRootByWeek[week] === ethers.constants.HashZero) continue;

      // Anything to claim?
      if (claims[this.address]) result[week] = claims[this.address];
    }

    return result;
  };

  /**
   * It is important to check that a distribution has an existing
   * distribution root. This keeps us covered in scenarios when
   * Balancer team uploads reports to Github but a distribution hasn't
   * been created in MerkleOrchard yet. Consequently, claiming rewards
   * for that week will fail.
   *
   * E.g. { 6: 'roothash', 7: 'roothash', 8: '0x00000...' }
   */
  private getDistributionRootByWeek =
    async (): Promise<DistributionRootByWeek> => {
      const weeks = Object.keys(this.claimsByWeek);

      const distributionRootCalls = weeks.map((week) =>
        multicallContract.getDistributionRoot(
          this.tokenClaimInfo.token,
          this.tokenClaimInfo.distributor,
          parseInt(week),
        ),
      );

      const roots = await multicallProvider.all<string[]>(
        distributionRootCalls,
      );

      return Object.fromEntries(
        weeks.map((week, i) => [parseInt(week), roots[i]]),
      );
    };

  // E.g. { 6: true, 7: false, 8: false }
  private getClaimStatusByWeek = async (): Promise<ClaimStatusByWeek> => {
    const weeks = Object.keys(this.claimsByWeek);

    const claimStatusCalls = weeks.map((week) =>
      multicallContract.isClaimed(
        this.tokenClaimInfo.token,
        this.tokenClaimInfo.distributor,
        parseInt(week),
        this.address,
      ),
    );

    const statuses = await multicallProvider.all<boolean[]>(claimStatusCalls);

    return Object.fromEntries(
      weeks.map((week, i) => [parseInt(week), statuses[i]]),
    );
  };

  private getClaimsByWeek = async (
    snapshot: Snapshot,
  ): Promise<ClaimsByWeek> => {
    const claimsByWeek: ClaimsByWeek = {};

    for (const [week, hash] of Object.entries(snapshot)) {
      // Ignore distributions managed by the old contract (not MerkleOrchard).
      if (parseInt(week) < this.tokenClaimInfo.weekStart) continue;

      const t = Date.now();
      const c1 = await fulfillWithRetries([this.fetchFromIpfs, hash], 5000, 3);
      if( c1 ) {
        claimsByWeek[week] = c1;
      }
    }

    return claimsByWeek;
  };

  private getSnapshot = async (): Promise<Snapshot> => {
    const url = this.tokenClaimInfo.manifest;
    const snapshot = await fetch(url);

    return await snapshot.json();
  };

  private fetchFromIpfs = async (hash: string): Promise<Snapshot> => {
    const url = `https://ipfs.io/ipfs/${hash}`;
    const res: string = await this.dataStoreFetchWrapper(url);

    try {
      const ret = await JSON.parse(res);
      return ret;
    } catch (error) {
      console.log(
        "[BalancerTokenClaim]: " +
          error +
          "\n\nresponse from " +
          url +
          " was:\n" +
          res,
      );
    }
  };

  private generateMerkleTree = (week: string): MerkleTree => {
    const balances = this.claimsByWeek[week];
    const elements = Object.keys(balances).map((address) => {
      const balance = toWei(balances[address]);

      return soliditySha3(address, balance)!;
    });

    return new MerkleTree(elements);
  };

  async dataStoreFetchWrapper(url: string): Promise<string> {
    const data: string = await this.dataStore.readData(url);
    if (data) {
      return data;
    }

    let response = undefined;
    try {
      response = await fetch(url);
    } catch (err) {
      // Ignore, error later
    }

    if (response === undefined) return undefined;

    let text = undefined;
    try {
      text = await response.text();
    } catch (error) {
      // Ignore, error later
    }

    if (text === undefined) return undefined;

    try {
      await this.dataStore.writeData(url, text);
    } catch (error) {
      // Ignore, error later
    }
    return text;
  }
}
