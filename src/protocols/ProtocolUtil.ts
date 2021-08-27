import { Provider as MulticallProvider, Contract as MulticallContract} from 'ethers-multicall';
import { PickleModel } from '..';
import { JarDefinition } from '../model/PickleModelJson';
import erc20Abi from '../Contracts/ABIs/erc20.json';
import { Chains } from '../chain/Chains';

export interface PoolId {
    [key: string]: number;
  }
  
export interface PoolInfo {
    [key: string]: {
      poolId: number;
      tokenName: string;
    };
  }
  