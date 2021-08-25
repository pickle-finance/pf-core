import { Provider as MulticallProvider, Contract as MulticallContract} from 'ethers-multicall';
import { formatEther, formatUnits } from "ethers/lib/utils";
import { BigNumber, Contract, ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import CurvePoolABI from '../Contracts/ABIs/pool.json';

export async function getCurveLpPriceData(tokenAddress: string, resolver: Provider | Signer) : Promise<number> {
    const multicallProvider = new MulticallProvider((resolver as Signer).provider === undefined ? (resolver as Provider) : (resolver as Signer).provider);
    await multicallProvider.init();

    const multicallPoolContract = new MulticallContract(
      tokenAddress,
      CurvePoolABI,
    );

    const [pricePerToken] = (
      await multicallProvider.all([multicallPoolContract.get_virtual_price()])
    ).map((x) => parseFloat(formatEther(x)));

    return pricePerToken;
  };
