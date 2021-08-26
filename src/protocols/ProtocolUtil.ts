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
  
export interface IGenericPairData {
  totalValueOfPair: number,
  totalSupply: number,
  pricePerToken: number
}

export async function getGenericPairData(jar: JarDefinition, model: PickleModel,
  depositTokenDecimals: number) : Promise<IGenericPairData> {
  const multicallProvider = new MulticallProvider(Chains.get(jar.chain).getPreferredWeb3Provider());
  await multicallProvider.init();
  const pairAddress:string = jar.depositToken.addr;

  const componentA = jar.depositToken.components[0];
  const componentB = jar.depositToken.components[1];
  const addressA = model.address(componentA, jar.chain);
  const addressB = model.address(componentB, jar.chain);
  
  // setup contracts
  const tokenA = new MulticallContract(addressA, erc20Abi);
  const tokenB = new MulticallContract(addressB, erc20Abi);
  const pair = new MulticallContract(pairAddress, erc20Abi);

  const [
    numAInPairBN,
    numBInPairBN,
    totalSupplyBN,
  ] = await multicallProvider?.all([
    tokenA.balanceOf(pairAddress),
    tokenB.balanceOf(pairAddress),
    pair.totalSupply(),
  ]);

  // get num of tokens
  const numAInPair = numAInPairBN / Math.pow(10, model.tokenDecimals(componentA, jar.chain));
  const numBInPair = numBInPairBN / Math.pow(10, model.tokenDecimals(componentB, jar.chain));

  // get prices
  const priceA = await model.priceOf(componentA);
  const priceB = await model.priceOf(componentB);

  let totalValueOfPair;
  // In case price one token is not listed on coingecko
  if( priceA && priceB ) {
    totalValueOfPair = priceA * numAInPair + priceB * numBInPair;
  } else if (priceA) {
    totalValueOfPair = 2 * priceA * numAInPair;
  } else {
    totalValueOfPair = 2 * priceB * numBInPair;
  }

  const totalSupply = totalSupplyBN / Math.pow(10, depositTokenDecimals);
  const pricePerToken = totalValueOfPair / totalSupply;

  return { totalValueOfPair, totalSupply, pricePerToken };
};
