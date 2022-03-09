import { PickleModel } from "../model/PickleModel";
import yearnRegistryAbi from "../Contracts/ABIs/yearn-registry.json";
import fetch from "cross-fetch";
import { ChainNetwork } from "../chain/Chains";
import { Contract as MultiContract } from "ethers-multicall";

export const YEARN_API = "https://api.yearn.finance/v1/chains/1/vaults/all";
const YEARN_REG_ADDR = "0x50c1a2ea0a861a967d9d0ffe2ae4012c2e053804";

const YEARN_DATA_CACHE_KEY = "yearn.data.cache.key";
export async function getYearnData(model: PickleModel): Promise<any> {
  if (model.resourceCache.get(YEARN_DATA_CACHE_KEY))
    return model.resourceCache.get(YEARN_DATA_CACHE_KEY);

  const result = await loadYearnData();
  model.resourceCache.set(YEARN_DATA_CACHE_KEY, result);
  return result;
}
export async function loadYearnData(): Promise<any> {
  return await fetch(YEARN_API)
    .then((x) => x.json())
    .catch(() => []);
}

export async function calculateYearnAPY(
  model: PickleModel,
  depositToken: string,
): Promise<number> {
  const yearnRegistry = new MultiContract(YEARN_REG_ADDR, yearnRegistryAbi);
  const yearnData = await getYearnData(model);
  if (yearnRegistry && yearnData) {
    const vault = await model.comMan.call(
      () => yearnRegistry.latestVault(depositToken),
      ChainNetwork.Ethereum,
    );
    const vaultData = yearnData.find(
      (x) => x.address.toLowerCase() === vault.toLowerCase(),
    );
    if (vaultData) {
      const apr = vaultData?.apy?.net_apy || 0;
      return apr * 100;
    }
  }
  return undefined;
}

/*
    This is the old calculateYearnAPY implementation, leaving it here for historical reference
*/
// export async function calculateYearnAPY(
//   model: PickleModel,
//   depositToken: string,
// ): Promise<number> {
//   const yearnRegistry = new Contract(
//     YEARN_REG_ADDR,
//     yearnRegistryAbi,
//     model.providerFor(ChainNetwork.Ethereum),
//   );
//   const yearnData = await getYearnData(model);
//   if (yearnRegistry && yearnData) {
//     const vault = await yearnRegistry.latestVault(depositToken, {
//       gasLimit: 1000000,
//     });
//     const vaultData = yearnData.find(
//       (x) => x.address.toLowerCase() === vault.toLowerCase(),
//     );
//     if (vaultData) {
//       const apr = vaultData?.apy?.net_apy || 0;
//       return apr * 100;
//     }
//   }
//   return undefined;
// }
