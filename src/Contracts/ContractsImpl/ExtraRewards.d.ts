/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  Contract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import { TypedEventFilter, TypedEvent, TypedListener } from "./commons";

interface ExtraRewardsInterface extends ethers.utils.Interface {
  functions: {
    "balanceOf(address)": FunctionFragment;
    "currentRewards()": FunctionFragment;
    "deposits()": FunctionFragment;
    "donate(uint256)": FunctionFragment;
    "duration()": FunctionFragment;
    "earned(address)": FunctionFragment;
    "getReward()": FunctionFragment;
    "historicalRewards()": FunctionFragment;
    "lastTimeRewardApplicable()": FunctionFragment;
    "lastUpdateTime()": FunctionFragment;
    "newRewardRatio()": FunctionFragment;
    "operator()": FunctionFragment;
    "periodFinish()": FunctionFragment;
    "queueNewRewards(uint256)": FunctionFragment;
    "queuedRewards()": FunctionFragment;
    "rewardPerToken()": FunctionFragment;
    "rewardPerTokenStored()": FunctionFragment;
    "rewardRate()": FunctionFragment;
    "rewardToken()": FunctionFragment;
    "rewards(address)": FunctionFragment;
    "stake(address,uint256)": FunctionFragment;
    "totalSupply()": FunctionFragment;
    "userRewardPerTokenPaid(address)": FunctionFragment;
    "withdraw(address,uint256)": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "balanceOf", values: [string]): string;
  encodeFunctionData(
    functionFragment: "currentRewards",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "deposits", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "donate",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "duration", values?: undefined): string;
  encodeFunctionData(functionFragment: "earned", values: [string]): string;
  encodeFunctionData(functionFragment: "getReward", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "historicalRewards",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "lastTimeRewardApplicable",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "lastUpdateTime",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "newRewardRatio",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "operator", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "periodFinish",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "queueNewRewards",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "queuedRewards",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "rewardPerToken",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "rewardPerTokenStored",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "rewardRate",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "rewardToken",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "rewards", values: [string]): string;
  encodeFunctionData(
    functionFragment: "stake",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "totalSupply",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "userRewardPerTokenPaid",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "withdraw",
    values: [string, BigNumberish]
  ): string;

  decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "currentRewards",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "deposits", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "donate", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "duration", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "earned", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getReward", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "historicalRewards",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "lastTimeRewardApplicable",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "lastUpdateTime",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "newRewardRatio",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "operator", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "periodFinish",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "queueNewRewards",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "queuedRewards",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "rewardPerToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "rewardPerTokenStored",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "rewardRate", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "rewardToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "rewards", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "stake", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "totalSupply",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "userRewardPerTokenPaid",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;

  events: {
    "RewardAdded(uint256)": EventFragment;
    "RewardPaid(address,uint256)": EventFragment;
    "Staked(address,uint256)": EventFragment;
    "Withdrawn(address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "RewardAdded"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RewardPaid"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Staked"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Withdrawn"): EventFragment;
}

export class ExtraRewards extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: ExtraRewardsInterface;

  functions: {
    balanceOf(account: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    "balanceOf(address)"(
      account: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    currentRewards(overrides?: CallOverrides): Promise<[BigNumber]>;

    "currentRewards()"(overrides?: CallOverrides): Promise<[BigNumber]>;

    deposits(overrides?: CallOverrides): Promise<[string]>;

    "deposits()"(overrides?: CallOverrides): Promise<[string]>;

    donate(
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "donate(uint256)"(
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    duration(overrides?: CallOverrides): Promise<[BigNumber]>;

    "duration()"(overrides?: CallOverrides): Promise<[BigNumber]>;

    earned(account: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    "earned(address)"(
      account: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    "getReward()"(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "getReward(address)"(
      _account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    historicalRewards(overrides?: CallOverrides): Promise<[BigNumber]>;

    "historicalRewards()"(overrides?: CallOverrides): Promise<[BigNumber]>;

    lastTimeRewardApplicable(overrides?: CallOverrides): Promise<[BigNumber]>;

    "lastTimeRewardApplicable()"(
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    lastUpdateTime(overrides?: CallOverrides): Promise<[BigNumber]>;

    "lastUpdateTime()"(overrides?: CallOverrides): Promise<[BigNumber]>;

    newRewardRatio(overrides?: CallOverrides): Promise<[BigNumber]>;

    "newRewardRatio()"(overrides?: CallOverrides): Promise<[BigNumber]>;

    operator(overrides?: CallOverrides): Promise<[string]>;

    "operator()"(overrides?: CallOverrides): Promise<[string]>;

    periodFinish(overrides?: CallOverrides): Promise<[BigNumber]>;

    "periodFinish()"(overrides?: CallOverrides): Promise<[BigNumber]>;

    queueNewRewards(
      _rewards: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "queueNewRewards(uint256)"(
      _rewards: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    queuedRewards(overrides?: CallOverrides): Promise<[BigNumber]>;

    "queuedRewards()"(overrides?: CallOverrides): Promise<[BigNumber]>;

    rewardPerToken(overrides?: CallOverrides): Promise<[BigNumber]>;

    "rewardPerToken()"(overrides?: CallOverrides): Promise<[BigNumber]>;

    rewardPerTokenStored(overrides?: CallOverrides): Promise<[BigNumber]>;

    "rewardPerTokenStored()"(overrides?: CallOverrides): Promise<[BigNumber]>;

    rewardRate(overrides?: CallOverrides): Promise<[BigNumber]>;

    "rewardRate()"(overrides?: CallOverrides): Promise<[BigNumber]>;

    rewardToken(overrides?: CallOverrides): Promise<[string]>;

    "rewardToken()"(overrides?: CallOverrides): Promise<[string]>;

    rewards(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    "rewards(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    stake(
      _account: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "stake(address,uint256)"(
      _account: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    totalSupply(overrides?: CallOverrides): Promise<[BigNumber]>;

    "totalSupply()"(overrides?: CallOverrides): Promise<[BigNumber]>;

    userRewardPerTokenPaid(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    "userRewardPerTokenPaid(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    withdraw(
      _account: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "withdraw(address,uint256)"(
      _account: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  balanceOf(account: string, overrides?: CallOverrides): Promise<BigNumber>;

  "balanceOf(address)"(
    account: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  currentRewards(overrides?: CallOverrides): Promise<BigNumber>;

  "currentRewards()"(overrides?: CallOverrides): Promise<BigNumber>;

  deposits(overrides?: CallOverrides): Promise<string>;

  "deposits()"(overrides?: CallOverrides): Promise<string>;

  donate(
    _amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "donate(uint256)"(
    _amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  duration(overrides?: CallOverrides): Promise<BigNumber>;

  "duration()"(overrides?: CallOverrides): Promise<BigNumber>;

  earned(account: string, overrides?: CallOverrides): Promise<BigNumber>;

  "earned(address)"(
    account: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "getReward()"(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "getReward(address)"(
    _account: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  historicalRewards(overrides?: CallOverrides): Promise<BigNumber>;

  "historicalRewards()"(overrides?: CallOverrides): Promise<BigNumber>;

  lastTimeRewardApplicable(overrides?: CallOverrides): Promise<BigNumber>;

  "lastTimeRewardApplicable()"(overrides?: CallOverrides): Promise<BigNumber>;

  lastUpdateTime(overrides?: CallOverrides): Promise<BigNumber>;

  "lastUpdateTime()"(overrides?: CallOverrides): Promise<BigNumber>;

  newRewardRatio(overrides?: CallOverrides): Promise<BigNumber>;

  "newRewardRatio()"(overrides?: CallOverrides): Promise<BigNumber>;

  operator(overrides?: CallOverrides): Promise<string>;

  "operator()"(overrides?: CallOverrides): Promise<string>;

  periodFinish(overrides?: CallOverrides): Promise<BigNumber>;

  "periodFinish()"(overrides?: CallOverrides): Promise<BigNumber>;

  queueNewRewards(
    _rewards: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "queueNewRewards(uint256)"(
    _rewards: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  queuedRewards(overrides?: CallOverrides): Promise<BigNumber>;

  "queuedRewards()"(overrides?: CallOverrides): Promise<BigNumber>;

  rewardPerToken(overrides?: CallOverrides): Promise<BigNumber>;

  "rewardPerToken()"(overrides?: CallOverrides): Promise<BigNumber>;

  rewardPerTokenStored(overrides?: CallOverrides): Promise<BigNumber>;

  "rewardPerTokenStored()"(overrides?: CallOverrides): Promise<BigNumber>;

  rewardRate(overrides?: CallOverrides): Promise<BigNumber>;

  "rewardRate()"(overrides?: CallOverrides): Promise<BigNumber>;

  rewardToken(overrides?: CallOverrides): Promise<string>;

  "rewardToken()"(overrides?: CallOverrides): Promise<string>;

  rewards(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  "rewards(address)"(
    arg0: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  stake(
    _account: string,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "stake(address,uint256)"(
    _account: string,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

  "totalSupply()"(overrides?: CallOverrides): Promise<BigNumber>;

  userRewardPerTokenPaid(
    arg0: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "userRewardPerTokenPaid(address)"(
    arg0: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  withdraw(
    _account: string,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "withdraw(address,uint256)"(
    _account: string,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    balanceOf(account: string, overrides?: CallOverrides): Promise<BigNumber>;

    "balanceOf(address)"(
      account: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    currentRewards(overrides?: CallOverrides): Promise<BigNumber>;

    "currentRewards()"(overrides?: CallOverrides): Promise<BigNumber>;

    deposits(overrides?: CallOverrides): Promise<string>;

    "deposits()"(overrides?: CallOverrides): Promise<string>;

    donate(_amount: BigNumberish, overrides?: CallOverrides): Promise<boolean>;

    "donate(uint256)"(
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    duration(overrides?: CallOverrides): Promise<BigNumber>;

    "duration()"(overrides?: CallOverrides): Promise<BigNumber>;

    earned(account: string, overrides?: CallOverrides): Promise<BigNumber>;

    "earned(address)"(
      account: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getReward()"(overrides?: CallOverrides): Promise<void>;

    "getReward(address)"(
      _account: string,
      overrides?: CallOverrides
    ): Promise<void>;

    historicalRewards(overrides?: CallOverrides): Promise<BigNumber>;

    "historicalRewards()"(overrides?: CallOverrides): Promise<BigNumber>;

    lastTimeRewardApplicable(overrides?: CallOverrides): Promise<BigNumber>;

    "lastTimeRewardApplicable()"(overrides?: CallOverrides): Promise<BigNumber>;

    lastUpdateTime(overrides?: CallOverrides): Promise<BigNumber>;

    "lastUpdateTime()"(overrides?: CallOverrides): Promise<BigNumber>;

    newRewardRatio(overrides?: CallOverrides): Promise<BigNumber>;

    "newRewardRatio()"(overrides?: CallOverrides): Promise<BigNumber>;

    operator(overrides?: CallOverrides): Promise<string>;

    "operator()"(overrides?: CallOverrides): Promise<string>;

    periodFinish(overrides?: CallOverrides): Promise<BigNumber>;

    "periodFinish()"(overrides?: CallOverrides): Promise<BigNumber>;

    queueNewRewards(
      _rewards: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    "queueNewRewards(uint256)"(
      _rewards: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    queuedRewards(overrides?: CallOverrides): Promise<BigNumber>;

    "queuedRewards()"(overrides?: CallOverrides): Promise<BigNumber>;

    rewardPerToken(overrides?: CallOverrides): Promise<BigNumber>;

    "rewardPerToken()"(overrides?: CallOverrides): Promise<BigNumber>;

    rewardPerTokenStored(overrides?: CallOverrides): Promise<BigNumber>;

    "rewardPerTokenStored()"(overrides?: CallOverrides): Promise<BigNumber>;

    rewardRate(overrides?: CallOverrides): Promise<BigNumber>;

    "rewardRate()"(overrides?: CallOverrides): Promise<BigNumber>;

    rewardToken(overrides?: CallOverrides): Promise<string>;

    "rewardToken()"(overrides?: CallOverrides): Promise<string>;

    rewards(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    "rewards(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    stake(
      _account: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    "stake(address,uint256)"(
      _account: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

    "totalSupply()"(overrides?: CallOverrides): Promise<BigNumber>;

    userRewardPerTokenPaid(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "userRewardPerTokenPaid(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    withdraw(
      _account: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    "withdraw(address,uint256)"(
      _account: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    RewardAdded(
      reward: null
    ): TypedEventFilter<[BigNumber], { reward: BigNumber }>;

    RewardPaid(
      user: string | null,
      reward: null
    ): TypedEventFilter<
      [string, BigNumber],
      { user: string; reward: BigNumber }
    >;

    Staked(
      user: string | null,
      amount: null
    ): TypedEventFilter<
      [string, BigNumber],
      { user: string; amount: BigNumber }
    >;

    Withdrawn(
      user: string | null,
      amount: null
    ): TypedEventFilter<
      [string, BigNumber],
      { user: string; amount: BigNumber }
    >;
  };

  estimateGas: {
    balanceOf(account: string, overrides?: CallOverrides): Promise<BigNumber>;

    "balanceOf(address)"(
      account: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    currentRewards(overrides?: CallOverrides): Promise<BigNumber>;

    "currentRewards()"(overrides?: CallOverrides): Promise<BigNumber>;

    deposits(overrides?: CallOverrides): Promise<BigNumber>;

    "deposits()"(overrides?: CallOverrides): Promise<BigNumber>;

    donate(
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "donate(uint256)"(
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    duration(overrides?: CallOverrides): Promise<BigNumber>;

    "duration()"(overrides?: CallOverrides): Promise<BigNumber>;

    earned(account: string, overrides?: CallOverrides): Promise<BigNumber>;

    "earned(address)"(
      account: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getReward()"(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "getReward(address)"(
      _account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    historicalRewards(overrides?: CallOverrides): Promise<BigNumber>;

    "historicalRewards()"(overrides?: CallOverrides): Promise<BigNumber>;

    lastTimeRewardApplicable(overrides?: CallOverrides): Promise<BigNumber>;

    "lastTimeRewardApplicable()"(overrides?: CallOverrides): Promise<BigNumber>;

    lastUpdateTime(overrides?: CallOverrides): Promise<BigNumber>;

    "lastUpdateTime()"(overrides?: CallOverrides): Promise<BigNumber>;

    newRewardRatio(overrides?: CallOverrides): Promise<BigNumber>;

    "newRewardRatio()"(overrides?: CallOverrides): Promise<BigNumber>;

    operator(overrides?: CallOverrides): Promise<BigNumber>;

    "operator()"(overrides?: CallOverrides): Promise<BigNumber>;

    periodFinish(overrides?: CallOverrides): Promise<BigNumber>;

    "periodFinish()"(overrides?: CallOverrides): Promise<BigNumber>;

    queueNewRewards(
      _rewards: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "queueNewRewards(uint256)"(
      _rewards: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    queuedRewards(overrides?: CallOverrides): Promise<BigNumber>;

    "queuedRewards()"(overrides?: CallOverrides): Promise<BigNumber>;

    rewardPerToken(overrides?: CallOverrides): Promise<BigNumber>;

    "rewardPerToken()"(overrides?: CallOverrides): Promise<BigNumber>;

    rewardPerTokenStored(overrides?: CallOverrides): Promise<BigNumber>;

    "rewardPerTokenStored()"(overrides?: CallOverrides): Promise<BigNumber>;

    rewardRate(overrides?: CallOverrides): Promise<BigNumber>;

    "rewardRate()"(overrides?: CallOverrides): Promise<BigNumber>;

    rewardToken(overrides?: CallOverrides): Promise<BigNumber>;

    "rewardToken()"(overrides?: CallOverrides): Promise<BigNumber>;

    rewards(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    "rewards(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    stake(
      _account: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "stake(address,uint256)"(
      _account: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

    "totalSupply()"(overrides?: CallOverrides): Promise<BigNumber>;

    userRewardPerTokenPaid(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "userRewardPerTokenPaid(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    withdraw(
      _account: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "withdraw(address,uint256)"(
      _account: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    balanceOf(
      account: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "balanceOf(address)"(
      account: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    currentRewards(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "currentRewards()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    deposits(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "deposits()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    donate(
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "donate(uint256)"(
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    duration(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "duration()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    earned(
      account: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "earned(address)"(
      account: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getReward()"(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "getReward(address)"(
      _account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    historicalRewards(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "historicalRewards()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    lastTimeRewardApplicable(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "lastTimeRewardApplicable()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    lastUpdateTime(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "lastUpdateTime()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    newRewardRatio(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "newRewardRatio()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    operator(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "operator()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    periodFinish(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "periodFinish()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    queueNewRewards(
      _rewards: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "queueNewRewards(uint256)"(
      _rewards: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    queuedRewards(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "queuedRewards()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    rewardPerToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "rewardPerToken()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    rewardPerTokenStored(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "rewardPerTokenStored()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    rewardRate(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "rewardRate()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    rewardToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "rewardToken()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    rewards(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "rewards(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    stake(
      _account: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "stake(address,uint256)"(
      _account: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    totalSupply(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "totalSupply()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    userRewardPerTokenPaid(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "userRewardPerTokenPaid(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    withdraw(
      _account: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "withdraw(address,uint256)"(
      _account: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
