import { PickleModel } from "../model/PickleModel";
import yearnRegistryAbi from "../Contracts/ABIs/yearn-registry.json";
import fetch from "cross-fetch";
import { ChainNetwork } from "../chain/Chains";
import { Contract } from "ethers-multiprovider";

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
  const multiProvider = model.multiproviderFor(ChainNetwork.Ethereum);
  const yearnRegistry = new Contract(YEARN_REG_ADDR, yearnRegistryAbi);
  const yearnData = await getYearnData(model);
  if (yearnRegistry && yearnData) {
    const [vault] = await multiProvider.all([
      yearnRegistry.latestVault(depositToken),
    ]);
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
