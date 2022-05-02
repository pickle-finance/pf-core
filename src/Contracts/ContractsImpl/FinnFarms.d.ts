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

interface FinnFarmsInterface extends ethers.utils.Interface {
  functions: {
    "EXTRA_PERCENT()": FunctionFragment;
    "USER_PERCENT()": FunctionFragment;
    "add(uint256,address,bool)": FunctionFragment;
    "allEndTime()": FunctionFragment;
    "deposit(uint256,uint256)": FunctionFragment;
    "dev(address)": FunctionFragment;
    "devaddr()": FunctionFragment;
    "emergencyWithdraw(uint256)": FunctionFragment;
    "finn()": FunctionFragment;
    "finnPerSecond()": FunctionFragment;
    "getMultiplier(uint256,uint256)": FunctionFragment;
    "massUpdatePools()": FunctionFragment;
    "owner()": FunctionFragment;
    "pendingReward(uint256,address)": FunctionFragment;
    "poolInfo(uint256)": FunctionFragment;
    "poolLength()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "set(uint256,uint256,bool)": FunctionFragment;
    "startTime()": FunctionFragment;
    "totalAllocPoint()": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "updatePool(uint256)": FunctionFragment;
    "userInfo(uint256,address)": FunctionFragment;
    "withdraw(uint256,uint256)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "EXTRA_PERCENT",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "USER_PERCENT",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "add",
    values: [BigNumberish, string, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "allEndTime",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "deposit",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "dev", values: [string]): string;
  encodeFunctionData(functionFragment: "devaddr", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "emergencyWithdraw",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "finn", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "finnPerSecond",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getMultiplier",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "massUpdatePools",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "pendingReward",
    values: [BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "poolInfo",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "poolLength",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "set",
    values: [BigNumberish, BigNumberish, boolean]
  ): string;
  encodeFunctionData(functionFragment: "startTime", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "totalAllocPoint",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "updatePool",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "userInfo",
    values: [BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "withdraw",
    values: [BigNumberish, BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "EXTRA_PERCENT",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "USER_PERCENT",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "add", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "allEndTime", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "deposit", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "dev", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "devaddr", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "emergencyWithdraw",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "finn", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "finnPerSecond",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getMultiplier",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "massUpdatePools",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "pendingReward",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "poolInfo", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "poolLength", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "set", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "startTime", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "totalAllocPoint",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "updatePool", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "userInfo", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;

  events: {
    "Deposit(address,uint256,uint256)": EventFragment;
    "EmergencyWithdraw(address,uint256,uint256)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
    "Withdraw(address,uint256,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Deposit"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "EmergencyWithdraw"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Withdraw"): EventFragment;
}

export class FinnFarms extends Contract {
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

  interface: FinnFarmsInterface;

  functions: {
    EXTRA_PERCENT(overrides?: CallOverrides): Promise<[BigNumber]>;

    "EXTRA_PERCENT()"(overrides?: CallOverrides): Promise<[BigNumber]>;

    USER_PERCENT(overrides?: CallOverrides): Promise<[BigNumber]>;

    "USER_PERCENT()"(overrides?: CallOverrides): Promise<[BigNumber]>;

    add(
      _allocPoint: BigNumberish,
      _lpToken: string,
      _withUpdate: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "add(uint256,address,bool)"(
      _allocPoint: BigNumberish,
      _lpToken: string,
      _withUpdate: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    allEndTime(overrides?: CallOverrides): Promise<[BigNumber]>;

    "allEndTime()"(overrides?: CallOverrides): Promise<[BigNumber]>;

    deposit(
      _pid: BigNumberish,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "deposit(uint256,uint256)"(
      _pid: BigNumberish,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    dev(
      _devaddr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "dev(address)"(
      _devaddr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    devaddr(overrides?: CallOverrides): Promise<[string]>;

    "devaddr()"(overrides?: CallOverrides): Promise<[string]>;

    emergencyWithdraw(
      _pid: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "emergencyWithdraw(uint256)"(
      _pid: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    finn(overrides?: CallOverrides): Promise<[string]>;

    "finn()"(overrides?: CallOverrides): Promise<[string]>;

    finnPerSecond(overrides?: CallOverrides): Promise<[BigNumber]>;

    "finnPerSecond()"(overrides?: CallOverrides): Promise<[BigNumber]>;

    getMultiplier(
      _from: BigNumberish,
      _to: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    "getMultiplier(uint256,uint256)"(
      _from: BigNumberish,
      _to: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    massUpdatePools(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "massUpdatePools()"(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    "owner()"(overrides?: CallOverrides): Promise<[string]>;

    pendingReward(
      _pid: BigNumberish,
      _user: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    "pendingReward(uint256,address)"(
      _pid: BigNumberish,
      _user: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    poolInfo(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [string, BigNumber, BigNumber, BigNumber] & {
        lpToken: string;
        allocPoint: BigNumber;
        lastRewardTimestamp: BigNumber;
        accRewardPerShare: BigNumber;
      }
    >;

    "poolInfo(uint256)"(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [string, BigNumber, BigNumber, BigNumber] & {
        lpToken: string;
        allocPoint: BigNumber;
        lastRewardTimestamp: BigNumber;
        accRewardPerShare: BigNumber;
      }
    >;

    poolLength(overrides?: CallOverrides): Promise<[BigNumber]>;

    "poolLength()"(overrides?: CallOverrides): Promise<[BigNumber]>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "renounceOwnership()"(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    set(
      _pid: BigNumberish,
      _allocPoint: BigNumberish,
      _withUpdate: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "set(uint256,uint256,bool)"(
      _pid: BigNumberish,
      _allocPoint: BigNumberish,
      _withUpdate: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    startTime(overrides?: CallOverrides): Promise<[BigNumber]>;

    "startTime()"(overrides?: CallOverrides): Promise<[BigNumber]>;

    totalAllocPoint(overrides?: CallOverrides): Promise<[BigNumber]>;

    "totalAllocPoint()"(overrides?: CallOverrides): Promise<[BigNumber]>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "transferOwnership(address)"(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    updatePool(
      _pid: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "updatePool(uint256)"(
      _pid: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    userInfo(
      arg0: BigNumberish,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { amount: BigNumber; rewardDebt: BigNumber }
    >;

    "userInfo(uint256,address)"(
      arg0: BigNumberish,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { amount: BigNumber; rewardDebt: BigNumber }
    >;

    withdraw(
      _pid: BigNumberish,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "withdraw(uint256,uint256)"(
      _pid: BigNumberish,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  EXTRA_PERCENT(overrides?: CallOverrides): Promise<BigNumber>;

  "EXTRA_PERCENT()"(overrides?: CallOverrides): Promise<BigNumber>;

  USER_PERCENT(overrides?: CallOverrides): Promise<BigNumber>;

  "USER_PERCENT()"(overrides?: CallOverrides): Promise<BigNumber>;

  add(
    _allocPoint: BigNumberish,
    _lpToken: string,
    _withUpdate: boolean,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "add(uint256,address,bool)"(
    _allocPoint: BigNumberish,
    _lpToken: string,
    _withUpdate: boolean,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  allEndTime(overrides?: CallOverrides): Promise<BigNumber>;

  "allEndTime()"(overrides?: CallOverrides): Promise<BigNumber>;

  deposit(
    _pid: BigNumberish,
    _amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "deposit(uint256,uint256)"(
    _pid: BigNumberish,
    _amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  dev(
    _devaddr: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "dev(address)"(
    _devaddr: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  devaddr(overrides?: CallOverrides): Promise<string>;

  "devaddr()"(overrides?: CallOverrides): Promise<string>;

  emergencyWithdraw(
    _pid: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "emergencyWithdraw(uint256)"(
    _pid: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  finn(overrides?: CallOverrides): Promise<string>;

  "finn()"(overrides?: CallOverrides): Promise<string>;

  finnPerSecond(overrides?: CallOverrides): Promise<BigNumber>;

  "finnPerSecond()"(overrides?: CallOverrides): Promise<BigNumber>;

  getMultiplier(
    _from: BigNumberish,
    _to: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "getMultiplier(uint256,uint256)"(
    _from: BigNumberish,
    _to: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  massUpdatePools(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "massUpdatePools()"(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  owner(overrides?: CallOverrides): Promise<string>;

  "owner()"(overrides?: CallOverrides): Promise<string>;

  pendingReward(
    _pid: BigNumberish,
    _user: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "pendingReward(uint256,address)"(
    _pid: BigNumberish,
    _user: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  poolInfo(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [string, BigNumber, BigNumber, BigNumber] & {
      lpToken: string;
      allocPoint: BigNumber;
      lastRewardTimestamp: BigNumber;
      accRewardPerShare: BigNumber;
    }
  >;

  "poolInfo(uint256)"(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [string, BigNumber, BigNumber, BigNumber] & {
      lpToken: string;
      allocPoint: BigNumber;
      lastRewardTimestamp: BigNumber;
      accRewardPerShare: BigNumber;
    }
  >;

  poolLength(overrides?: CallOverrides): Promise<BigNumber>;

  "poolLength()"(overrides?: CallOverrides): Promise<BigNumber>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "renounceOwnership()"(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  set(
    _pid: BigNumberish,
    _allocPoint: BigNumberish,
    _withUpdate: boolean,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "set(uint256,uint256,bool)"(
    _pid: BigNumberish,
    _allocPoint: BigNumberish,
    _withUpdate: boolean,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  startTime(overrides?: CallOverrides): Promise<BigNumber>;

  "startTime()"(overrides?: CallOverrides): Promise<BigNumber>;

  totalAllocPoint(overrides?: CallOverrides): Promise<BigNumber>;

  "totalAllocPoint()"(overrides?: CallOverrides): Promise<BigNumber>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "transferOwnership(address)"(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  updatePool(
    _pid: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "updatePool(uint256)"(
    _pid: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  userInfo(
    arg0: BigNumberish,
    arg1: string,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber] & { amount: BigNumber; rewardDebt: BigNumber }
  >;

  "userInfo(uint256,address)"(
    arg0: BigNumberish,
    arg1: string,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber] & { amount: BigNumber; rewardDebt: BigNumber }
  >;

  withdraw(
    _pid: BigNumberish,
    _amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "withdraw(uint256,uint256)"(
    _pid: BigNumberish,
    _amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    EXTRA_PERCENT(overrides?: CallOverrides): Promise<BigNumber>;

    "EXTRA_PERCENT()"(overrides?: CallOverrides): Promise<BigNumber>;

    USER_PERCENT(overrides?: CallOverrides): Promise<BigNumber>;

    "USER_PERCENT()"(overrides?: CallOverrides): Promise<BigNumber>;

    add(
      _allocPoint: BigNumberish,
      _lpToken: string,
      _withUpdate: boolean,
      overrides?: CallOverrides
    ): Promise<void>;

    "add(uint256,address,bool)"(
      _allocPoint: BigNumberish,
      _lpToken: string,
      _withUpdate: boolean,
      overrides?: CallOverrides
    ): Promise<void>;

    allEndTime(overrides?: CallOverrides): Promise<BigNumber>;

    "allEndTime()"(overrides?: CallOverrides): Promise<BigNumber>;

    deposit(
      _pid: BigNumberish,
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    "deposit(uint256,uint256)"(
      _pid: BigNumberish,
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    dev(_devaddr: string, overrides?: CallOverrides): Promise<void>;

    "dev(address)"(_devaddr: string, overrides?: CallOverrides): Promise<void>;

    devaddr(overrides?: CallOverrides): Promise<string>;

    "devaddr()"(overrides?: CallOverrides): Promise<string>;

    emergencyWithdraw(
      _pid: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    "emergencyWithdraw(uint256)"(
      _pid: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    finn(overrides?: CallOverrides): Promise<string>;

    "finn()"(overrides?: CallOverrides): Promise<string>;

    finnPerSecond(overrides?: CallOverrides): Promise<BigNumber>;

    "finnPerSecond()"(overrides?: CallOverrides): Promise<BigNumber>;

    getMultiplier(
      _from: BigNumberish,
      _to: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getMultiplier(uint256,uint256)"(
      _from: BigNumberish,
      _to: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    massUpdatePools(overrides?: CallOverrides): Promise<void>;

    "massUpdatePools()"(overrides?: CallOverrides): Promise<void>;

    owner(overrides?: CallOverrides): Promise<string>;

    "owner()"(overrides?: CallOverrides): Promise<string>;

    pendingReward(
      _pid: BigNumberish,
      _user: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "pendingReward(uint256,address)"(
      _pid: BigNumberish,
      _user: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    poolInfo(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [string, BigNumber, BigNumber, BigNumber] & {
        lpToken: string;
        allocPoint: BigNumber;
        lastRewardTimestamp: BigNumber;
        accRewardPerShare: BigNumber;
      }
    >;

    "poolInfo(uint256)"(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [string, BigNumber, BigNumber, BigNumber] & {
        lpToken: string;
        allocPoint: BigNumber;
        lastRewardTimestamp: BigNumber;
        accRewardPerShare: BigNumber;
      }
    >;

    poolLength(overrides?: CallOverrides): Promise<BigNumber>;

    "poolLength()"(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    "renounceOwnership()"(overrides?: CallOverrides): Promise<void>;

    set(
      _pid: BigNumberish,
      _allocPoint: BigNumberish,
      _withUpdate: boolean,
      overrides?: CallOverrides
    ): Promise<void>;

    "set(uint256,uint256,bool)"(
      _pid: BigNumberish,
      _allocPoint: BigNumberish,
      _withUpdate: boolean,
      overrides?: CallOverrides
    ): Promise<void>;

    startTime(overrides?: CallOverrides): Promise<BigNumber>;

    "startTime()"(overrides?: CallOverrides): Promise<BigNumber>;

    totalAllocPoint(overrides?: CallOverrides): Promise<BigNumber>;

    "totalAllocPoint()"(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    "transferOwnership(address)"(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    updatePool(_pid: BigNumberish, overrides?: CallOverrides): Promise<void>;

    "updatePool(uint256)"(
      _pid: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    userInfo(
      arg0: BigNumberish,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { amount: BigNumber; rewardDebt: BigNumber }
    >;

    "userInfo(uint256,address)"(
      arg0: BigNumberish,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { amount: BigNumber; rewardDebt: BigNumber }
    >;

    withdraw(
      _pid: BigNumberish,
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    "withdraw(uint256,uint256)"(
      _pid: BigNumberish,
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    Deposit(
      user: string | null,
      pid: BigNumberish | null,
      amount: null
    ): TypedEventFilter<
      [string, BigNumber, BigNumber],
      { user: string; pid: BigNumber; amount: BigNumber }
    >;

    EmergencyWithdraw(
      user: string | null,
      pid: BigNumberish | null,
      amount: null
    ): TypedEventFilter<
      [string, BigNumber, BigNumber],
      { user: string; pid: BigNumber; amount: BigNumber }
    >;

    OwnershipTransferred(
      previousOwner: string | null,
      newOwner: string | null
    ): TypedEventFilter<
      [string, string],
      { previousOwner: string; newOwner: string }
    >;

    Withdraw(
      user: string | null,
      pid: BigNumberish | null,
      amount: null
    ): TypedEventFilter<
      [string, BigNumber, BigNumber],
      { user: string; pid: BigNumber; amount: BigNumber }
    >;
  };

  estimateGas: {
    EXTRA_PERCENT(overrides?: CallOverrides): Promise<BigNumber>;

    "EXTRA_PERCENT()"(overrides?: CallOverrides): Promise<BigNumber>;

    USER_PERCENT(overrides?: CallOverrides): Promise<BigNumber>;

    "USER_PERCENT()"(overrides?: CallOverrides): Promise<BigNumber>;

    add(
      _allocPoint: BigNumberish,
      _lpToken: string,
      _withUpdate: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "add(uint256,address,bool)"(
      _allocPoint: BigNumberish,
      _lpToken: string,
      _withUpdate: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    allEndTime(overrides?: CallOverrides): Promise<BigNumber>;

    "allEndTime()"(overrides?: CallOverrides): Promise<BigNumber>;

    deposit(
      _pid: BigNumberish,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "deposit(uint256,uint256)"(
      _pid: BigNumberish,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    dev(
      _devaddr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "dev(address)"(
      _devaddr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    devaddr(overrides?: CallOverrides): Promise<BigNumber>;

    "devaddr()"(overrides?: CallOverrides): Promise<BigNumber>;

    emergencyWithdraw(
      _pid: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "emergencyWithdraw(uint256)"(
      _pid: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    finn(overrides?: CallOverrides): Promise<BigNumber>;

    "finn()"(overrides?: CallOverrides): Promise<BigNumber>;

    finnPerSecond(overrides?: CallOverrides): Promise<BigNumber>;

    "finnPerSecond()"(overrides?: CallOverrides): Promise<BigNumber>;

    getMultiplier(
      _from: BigNumberish,
      _to: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getMultiplier(uint256,uint256)"(
      _from: BigNumberish,
      _to: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    massUpdatePools(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "massUpdatePools()"(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    "owner()"(overrides?: CallOverrides): Promise<BigNumber>;

    pendingReward(
      _pid: BigNumberish,
      _user: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "pendingReward(uint256,address)"(
      _pid: BigNumberish,
      _user: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    poolInfo(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    "poolInfo(uint256)"(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    poolLength(overrides?: CallOverrides): Promise<BigNumber>;

    "poolLength()"(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "renounceOwnership()"(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    set(
      _pid: BigNumberish,
      _allocPoint: BigNumberish,
      _withUpdate: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "set(uint256,uint256,bool)"(
      _pid: BigNumberish,
      _allocPoint: BigNumberish,
      _withUpdate: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    startTime(overrides?: CallOverrides): Promise<BigNumber>;

    "startTime()"(overrides?: CallOverrides): Promise<BigNumber>;

    totalAllocPoint(overrides?: CallOverrides): Promise<BigNumber>;

    "totalAllocPoint()"(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "transferOwnership(address)"(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    updatePool(
      _pid: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "updatePool(uint256)"(
      _pid: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    userInfo(
      arg0: BigNumberish,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "userInfo(uint256,address)"(
      arg0: BigNumberish,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    withdraw(
      _pid: BigNumberish,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "withdraw(uint256,uint256)"(
      _pid: BigNumberish,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    EXTRA_PERCENT(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "EXTRA_PERCENT()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    USER_PERCENT(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "USER_PERCENT()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    add(
      _allocPoint: BigNumberish,
      _lpToken: string,
      _withUpdate: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "add(uint256,address,bool)"(
      _allocPoint: BigNumberish,
      _lpToken: string,
      _withUpdate: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    allEndTime(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "allEndTime()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    deposit(
      _pid: BigNumberish,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "deposit(uint256,uint256)"(
      _pid: BigNumberish,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    dev(
      _devaddr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "dev(address)"(
      _devaddr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    devaddr(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "devaddr()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    emergencyWithdraw(
      _pid: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "emergencyWithdraw(uint256)"(
      _pid: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    finn(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "finn()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    finnPerSecond(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "finnPerSecond()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getMultiplier(
      _from: BigNumberish,
      _to: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getMultiplier(uint256,uint256)"(
      _from: BigNumberish,
      _to: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    massUpdatePools(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "massUpdatePools()"(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "owner()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    pendingReward(
      _pid: BigNumberish,
      _user: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "pendingReward(uint256,address)"(
      _pid: BigNumberish,
      _user: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    poolInfo(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "poolInfo(uint256)"(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    poolLength(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "poolLength()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "renounceOwnership()"(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    set(
      _pid: BigNumberish,
      _allocPoint: BigNumberish,
      _withUpdate: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "set(uint256,uint256,bool)"(
      _pid: BigNumberish,
      _allocPoint: BigNumberish,
      _withUpdate: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    startTime(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "startTime()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    totalAllocPoint(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "totalAllocPoint()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "transferOwnership(address)"(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    updatePool(
      _pid: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "updatePool(uint256)"(
      _pid: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    userInfo(
      arg0: BigNumberish,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "userInfo(uint256,address)"(
      arg0: BigNumberish,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    withdraw(
      _pid: BigNumberish,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "withdraw(uint256,uint256)"(
      _pid: BigNumberish,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
