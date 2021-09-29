import { Provider as MulticallProvider, Contract as MulticallContract} from 'ethers-multicall';
import { formatEther } from "ethers/lib/utils";
import { Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import CurvePoolABI from '../Contracts/ABIs/pool.json';
import { ChainNetwork, PickleModel } from '..';

export async function getCurveLpPriceData(tokenAddress: string, model: PickleModel, chain: ChainNetwork) : Promise<number> {
    const multicallProvider = model.multicallProviderFor(chain);
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
