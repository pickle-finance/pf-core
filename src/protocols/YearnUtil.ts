import { PickleModel } from "../model/PickleModel";
import { Provider } from '@ethersproject/providers';
import { Contract } from "@ethersproject/contracts";
import yearnRegistryAbi from '../Contracts/ABIs/yearn-registry.json';

import fetch from 'cross-fetch';
import { ChainNetwork } from "../chain/Chains";

const YEARN_API = "https://vaults.finance/all";
const YEARN_REG_ADDR = "0x50c1a2ea0a861a967d9d0ffe2ae4012c2e053804";

const YEARN_DATA_CACHE_KEY = "yearn.data.cache.key";
export async function getYearnData(model: PickleModel) : Promise<any> {
    if( model.resourceCache.get(YEARN_DATA_CACHE_KEY))
        return model.resourceCache.get(YEARN_DATA_CACHE_KEY);

    const result = await fetch(YEARN_API).then((x) => x.json())
    model.resourceCache.set(YEARN_DATA_CACHE_KEY, result);
    return result;
}

export async function calculateYearnAPY(model: PickleModel, depositToken: string) : Promise<number> {
    const yearnRegistry = new Contract(YEARN_REG_ADDR, yearnRegistryAbi, model.providerFor(ChainNetwork.Ethereum));
    const yearnData = await getYearnData(model);
    if (yearnRegistry && yearnData) {
      const vault = await yearnRegistry.latestVault(depositToken, {
        gasLimit: 1000000,
      });
      const vaultData = yearnData.find(
        (x) => x.address.toLowerCase() === vault.toLowerCase(),
      );
      if (vaultData) {
        const apr = vaultData?.apy?.data?.netApy || 0;
        return apr * 100;
      }
    }
    return undefined;
  };
