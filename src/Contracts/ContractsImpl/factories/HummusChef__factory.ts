/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";

import type { HummusChef } from "../HummusChef";

export class HummusChef__factory {
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): HummusChef {
    return new Contract(address, _abi, signerOrProvider) as HummusChef;
  }
}

const _abi = [
  {
    type: "event",
    name: "Add",
    inputs: [
      {
        type: "uint256",
        name: "pid",
        internalType: "uint256",
        indexed: true,
      },
      {
        type: "uint256",
        name: "baseAllocPoint",
        internalType: "uint256",
        indexed: false,
      },
      {
        type: "address",
        name: "lpToken",
        internalType: "contract IAsset",
        indexed: true,
      },
      {
        type: "address",
        name: "rewarder",
        internalType: "contract IRewarder",
        indexed: true,
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Deposit",
    inputs: [
      {
        type: "address",
        name: "user",
        internalType: "address",
        indexed: true,
      },
      {
        type: "uint256",
        name: "pid",
        internalType: "uint256",
        indexed: true,
      },
      {
        type: "uint256",
        name: "amount",
        internalType: "uint256",
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "DepositFor",
    inputs: [
      {
        type: "address",
        name: "user",
        internalType: "address",
        indexed: true,
      },
      {
        type: "uint256",
        name: "pid",
        internalType: "uint256",
        indexed: true,
      },
      {
        type: "uint256",
        name: "amount",
        internalType: "uint256",
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "EmergencyWithdraw",
    inputs: [
      {
        type: "address",
        name: "user",
        internalType: "address",
        indexed: true,
      },
      {
        type: "uint256",
        name: "pid",
        internalType: "uint256",
        indexed: true,
      },
      {
        type: "uint256",
        name: "amount",
        internalType: "uint256",
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Harvest",
    inputs: [
      {
        type: "address",
        name: "user",
        internalType: "address",
        indexed: true,
      },
      {
        type: "uint256",
        name: "pid",
        internalType: "uint256",
        indexed: true,
      },
      {
        type: "uint256",
        name: "amount",
        internalType: "uint256",
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OwnershipTransferred",
    inputs: [
      {
        type: "address",
        name: "previousOwner",
        internalType: "address",
        indexed: true,
      },
      {
        type: "address",
        name: "newOwner",
        internalType: "address",
        indexed: true,
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Paused",
    inputs: [
      {
        type: "address",
        name: "account",
        internalType: "address",
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Set",
    inputs: [
      {
        type: "uint256",
        name: "pid",
        internalType: "uint256",
        indexed: true,
      },
      {
        type: "uint256",
        name: "baseAllocPoint",
        internalType: "uint256",
        indexed: false,
      },
      {
        type: "address",
        name: "rewarder",
        internalType: "contract IRewarder",
        indexed: true,
      },
      {
        type: "bool",
        name: "overwrite",
        internalType: "bool",
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Unpaused",
    inputs: [
      {
        type: "address",
        name: "account",
        internalType: "address",
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "UpdateEmissionRate",
    inputs: [
      {
        type: "address",
        name: "user",
        internalType: "address",
        indexed: true,
      },
      {
        type: "uint256",
        name: "humPerSec",
        internalType: "uint256",
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "UpdateEmissionRepartition",
    inputs: [
      {
        type: "address",
        name: "user",
        internalType: "address",
        indexed: true,
      },
      {
        type: "uint256",
        name: "dialutingRepartition",
        internalType: "uint256",
        indexed: false,
      },
      {
        type: "uint256",
        name: "nonDialutingRepartition",
        internalType: "uint256",
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "UpdatePool",
    inputs: [
      {
        type: "uint256",
        name: "pid",
        internalType: "uint256",
        indexed: true,
      },
      {
        type: "uint256",
        name: "lastRewardTimestamp",
        internalType: "uint256",
        indexed: false,
      },
      {
        type: "uint256",
        name: "lpSupply",
        internalType: "uint256",
        indexed: false,
      },
      {
        type: "uint256",
        name: "accHumPerShare",
        internalType: "uint256",
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "UpdateVeHUM",
    inputs: [
      {
        type: "address",
        name: "user",
        internalType: "address",
        indexed: true,
      },
      {
        type: "address",
        name: "oldVeHUM",
        internalType: "address",
        indexed: false,
      },
      {
        type: "address",
        name: "newVeHUM",
        internalType: "address",
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Withdraw",
    inputs: [
      {
        type: "address",
        name: "user",
        internalType: "address",
        indexed: true,
      },
      {
        type: "uint256",
        name: "pid",
        internalType: "uint256",
        indexed: true,
      },
      {
        type: "uint256",
        name: "amount",
        internalType: "uint256",
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "acceptOwnership",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "add",
    inputs: [
      {
        type: "uint256",
        name: "_baseAllocPoint",
        internalType: "uint256",
      },
      {
        type: "address",
        name: "_lpToken",
        internalType: "contract IAsset",
      },
      {
        type: "address",
        name: "_rewarder",
        internalType: "contract IRewarder",
      },
    ],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [
      {
        type: "uint256",
        name: "",
        internalType: "uint256",
      },
    ],
    name: "claimableHum",
    inputs: [
      {
        type: "uint256",
        name: "",
        internalType: "uint256",
      },
      {
        type: "address",
        name: "",
        internalType: "address",
      },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [
      {
        type: "uint256",
        name: "",
        internalType: "uint256",
      },
      {
        type: "uint256",
        name: "",
        internalType: "uint256",
      },
    ],
    name: "deposit",
    inputs: [
      {
        type: "uint256",
        name: "_pid",
        internalType: "uint256",
      },
      {
        type: "uint256",
        name: "_amount",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "depositFor",
    inputs: [
      {
        type: "uint256",
        name: "_pid",
        internalType: "uint256",
      },
      {
        type: "uint256",
        name: "_amount",
        internalType: "uint256",
      },
      {
        type: "address",
        name: "_user",
        internalType: "address",
      },
    ],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [
      {
        type: "uint256",
        name: "",
        internalType: "uint256",
      },
    ],
    name: "dialutingRepartition",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "emergencyHumWithdraw",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "emergencyWithdraw",
    inputs: [
      {
        type: "uint256",
        name: "_pid",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [
      {
        type: "address",
        name: "",
        internalType: "contract IERC20",
      },
    ],
    name: "hum",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [
      {
        type: "uint256",
        name: "",
        internalType: "uint256",
      },
    ],
    name: "humPerSec",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "initialize",
    inputs: [
      {
        type: "address",
        name: "_hum",
        internalType: "contract IERC20",
      },
      {
        type: "address",
        name: "_veHum",
        internalType: "contract IVeHum",
      },
      {
        type: "uint256",
        name: "_humPerSec",
        internalType: "uint256",
      },
      {
        type: "uint256",
        name: "_dialutingRepartition",
        internalType: "uint256",
      },
      {
        type: "uint256",
        name: "_startTimestamp",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "massUpdatePools",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [
      {
        type: "uint256",
        name: "",
        internalType: "uint256",
      },
    ],
    name: "maxPoolLength",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "migrate",
    inputs: [
      {
        type: "uint256[]",
        name: "_pids",
        internalType: "uint256[]",
      },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [
      {
        type: "uint256",
        name: "",
        internalType: "uint256",
      },
      {
        type: "uint256[]",
        name: "",
        internalType: "uint256[]",
      },
      {
        type: "uint256[]",
        name: "",
        internalType: "uint256[]",
      },
    ],
    name: "multiClaim",
    inputs: [
      {
        type: "uint256[]",
        name: "_pids",
        internalType: "uint256[]",
      },
    ],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [
      {
        type: "address",
        name: "",
        internalType: "contract IMasterHummusV2",
      },
    ],
    name: "newMasterHummus",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [
      {
        type: "uint256",
        name: "",
        internalType: "uint256",
      },
    ],
    name: "nonDialutingRepartition",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [
      {
        type: "address",
        name: "",
        internalType: "address",
      },
    ],
    name: "owner",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [
      {
        type: "address",
        name: "",
        internalType: "address",
      },
    ],
    name: "ownerCandidate",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "pause",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [
      {
        type: "bool",
        name: "",
        internalType: "bool",
      },
    ],
    name: "paused",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [
      {
        type: "uint256",
        name: "pendingHum",
        internalType: "uint256",
      },
      {
        type: "address",
        name: "bonusTokenAddress",
        internalType: "address",
      },
      {
        type: "string",
        name: "bonusTokenSymbol",
        internalType: "string",
      },
      {
        type: "uint256",
        name: "pendingBonusToken",
        internalType: "uint256",
      },
    ],
    name: "pendingTokens",
    inputs: [
      {
        type: "uint256",
        name: "_pid",
        internalType: "uint256",
      },
      {
        type: "address",
        name: "_user",
        internalType: "address",
      },
    ],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [
      {
        type: "uint256",
        name: "",
        internalType: "uint256",
      },
    ],
    name: "poolAdjustFactor",
    inputs: [
      {
        type: "uint256",
        name: "pid",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [
      {
        type: "address",
        name: "lpToken",
        internalType: "contract IAsset",
      },
      {
        type: "uint256",
        name: "baseAllocPoint",
        internalType: "uint256",
      },
      {
        type: "uint256",
        name: "lastRewardTimestamp",
        internalType: "uint256",
      },
      {
        type: "uint256",
        name: "accHumPerShare",
        internalType: "uint256",
      },
      {
        type: "address",
        name: "rewarder",
        internalType: "contract IRewarder",
      },
      {
        type: "uint256",
        name: "sumOfFactors",
        internalType: "uint256",
      },
      {
        type: "uint256",
        name: "accHumPerFactorShare",
        internalType: "uint256",
      },
      {
        type: "uint256",
        name: "adjustedAllocPoint",
        internalType: "uint256",
      },
    ],
    name: "poolInfo",
    inputs: [
      {
        type: "uint256",
        name: "",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [
      {
        type: "uint256",
        name: "",
        internalType: "uint256",
      },
    ],
    name: "poolLength",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "proposeOwner",
    inputs: [
      {
        type: "address",
        name: "newOwner",
        internalType: "address",
      },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "renounceOwnership",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [
      {
        type: "address",
        name: "bonusTokenAddress",
        internalType: "address",
      },
      {
        type: "string",
        name: "bonusTokenSymbol",
        internalType: "string",
      },
    ],
    name: "rewarderBonusTokenInfo",
    inputs: [
      {
        type: "uint256",
        name: "_pid",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "set",
    inputs: [
      {
        type: "uint256",
        name: "_pid",
        internalType: "uint256",
      },
      {
        type: "uint256",
        name: "_baseAllocPoint",
        internalType: "uint256",
      },
      {
        type: "address",
        name: "_rewarder",
        internalType: "contract IRewarder",
      },
      {
        type: "bool",
        name: "overwrite",
        internalType: "bool",
      },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "setMaxPoolLength",
    inputs: [
      {
        type: "uint256",
        name: "_maxPoolLength",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "setNewMasterHummus",
    inputs: [
      {
        type: "address",
        name: "_newMasterHummus",
        internalType: "contract IMasterHummusV2",
      },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "setVeHum",
    inputs: [
      {
        type: "address",
        name: "_newVeHum",
        internalType: "contract IVeHum",
      },
    ],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [
      {
        type: "uint256",
        name: "",
        internalType: "uint256",
      },
    ],
    name: "startTimestamp",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [
      {
        type: "uint256",
        name: "",
        internalType: "uint256",
      },
    ],
    name: "totalAdjustedAllocPoint",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [
      {
        type: "uint256",
        name: "",
        internalType: "uint256",
      },
    ],
    name: "totalBaseAllocPoint",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "unpause",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "updateEmissionRate",
    inputs: [
      {
        type: "uint256",
        name: "_humPerSec",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "updateEmissionRepartition",
    inputs: [
      {
        type: "uint256",
        name: "_dialutingRepartition",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "updateFactor",
    inputs: [
      {
        type: "address",
        name: "_user",
        internalType: "address",
      },
      {
        type: "uint256",
        name: "_newVeHumBalance",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "updatePool",
    inputs: [
      {
        type: "uint256",
        name: "_pid",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [
      {
        type: "uint256",
        name: "amount",
        internalType: "uint256",
      },
      {
        type: "uint256",
        name: "rewardDebt",
        internalType: "uint256",
      },
      {
        type: "uint256",
        name: "factor",
        internalType: "uint256",
      },
    ],
    name: "userInfo",
    inputs: [
      {
        type: "uint256",
        name: "",
        internalType: "uint256",
      },
      {
        type: "address",
        name: "",
        internalType: "address",
      },
    ],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [
      {
        type: "address",
        name: "",
        internalType: "contract IVeHum",
      },
    ],
    name: "veHum",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [
      {
        type: "uint256",
        name: "",
        internalType: "uint256",
      },
      {
        type: "uint256",
        name: "",
        internalType: "uint256",
      },
    ],
    name: "withdraw",
    inputs: [
      {
        type: "uint256",
        name: "_pid",
        internalType: "uint256",
      },
      {
        type: "uint256",
        name: "_amount",
        internalType: "uint256",
      },
    ],
  },
];
