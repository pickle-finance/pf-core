import { PickleModel } from "..";
import { ONE_YEAR_SECONDS } from "../behavior/JarBehaviorResolver";
import { PoolId } from "./ProtocolUtil";
import { Contract } from "ethers-multiprovider";
import erc20Abi from "../Contracts/ABIs/erc20.json";
import { formatEther } from "ethers/lib/utils";
import { sorbettiereAbi } from "../Contracts/ABIs/sorbettiere.abi";
import { JarDefinition } from "../model/PickleModelJson";
import { JAR_ARBITRUM_MIM2CRV } from "../model/JarsAndFarms";
import { getCurvePoolData } from "./CurveUtil";
import { ErrorSeverity } from "../core/platform/PlatformInterfaces";
import { toError } from "../model/PickleModel";

const abracadabraIds: PoolId = {
  "0xb5De0C3753b6E1B4dBA616Db82767F17513E6d4E": 0,
  "0x5a6A4D54456819380173272A5E8E9B9904BdF41B": 1,
  "0x07D5695a24904CC1B6e3bd57cC7780B90618e3c4": 2,
};

const abracadabraIdsArbitrum: PoolId = {
  "0x30dF229cefa463e991e29D42DB0bae2e122B2AC7": 0,
};

export const SORBETTIERE_REWARDS = "0xF43480afE9863da4AcBD4419A47D9Cc7d25A647F";
export const SORBETTIERE_ARBITRUM = "0x839De324a1ab773F76a53900D70Ac1B913d2B387";

export async function calculateAbradabraApy(definition: JarDefinition, model: PickleModel): Promise<number> {
  const poolId = abracadabraIds[definition.depositToken.addr];

  const multiProvider = model.multiproviderFor(definition.chain);
  const multicallSorbettiereFarm = new Contract(SORBETTIERE_REWARDS, sorbettiereAbi);
  const lpToken = new Contract(definition.depositToken.addr, erc20Abi);

  const [icePerSecondBN, totalAllocPointBN, poolInfo, supplyInRewarderBN] = await multiProvider.all([
    multicallSorbettiereFarm.icePerSecond(),
    multicallSorbettiereFarm.totalAllocPoint(),
    multicallSorbettiereFarm.poolInfo(poolId),
    lpToken.balanceOf(multicallSorbettiereFarm.address),
  ]);

  const supplyInRewarder = parseFloat(formatEther(supplyInRewarderBN));
  const icePerSec: number = parseFloat(formatEther(icePerSecondBN));
  const totalAllocPoint = totalAllocPointBN.toNumber();
  const icePerSecond = (icePerSec * poolInfo.allocPoint) / totalAllocPoint;
  const tokenPrice: number = definition.depositToken.price;

  const iceRewardsPerYear = icePerSecond * ONE_YEAR_SECONDS;
  const valueRewardedPerYear = model.priceOfSync("spell", definition.chain) * iceRewardsPerYear;

  const totalValueStaked = supplyInRewarder * tokenPrice;
  const spellAPY = valueRewardedPerYear / totalValueStaked;

  return spellAPY * 100;
}

export async function calculateAbracadabraApyArbitrum(jar: JarDefinition, model: PickleModel) {
  const lpTokenAddress: string = jar.depositToken.addr;
  const poolId = abracadabraIdsArbitrum[lpTokenAddress];
  const multiProvider = model.multiproviderFor(jar.chain);
  const multicallSorbettiereFarm = new Contract(SORBETTIERE_ARBITRUM, sorbettiereAbi);
  const lpToken = new Contract(lpTokenAddress, erc20Abi);

  const [icePerSecondBN, totalAllocPointBN, poolInfo, totalSupplyBN] = await multiProvider.all([
    multicallSorbettiereFarm.icePerSecond(),
    multicallSorbettiereFarm.totalAllocPoint(),
    multicallSorbettiereFarm.poolInfo(poolId),
    lpToken.balanceOf(multicallSorbettiereFarm.address),
  ]);

  const totalSupply = parseFloat(formatEther(totalSupplyBN));
  const icePerSecond = (parseFloat(formatEther(icePerSecondBN)) * poolInfo.allocPoint) / totalAllocPointBN.toNumber();
  let tokenPrice: number = jar.depositToken.price;
  if (!tokenPrice && lpTokenAddress.toLowerCase() === JAR_ARBITRUM_MIM2CRV.depositToken.addr.toLowerCase()) {
    const poolData = await getCurvePoolData(jar, model);
    if (poolData && poolData.price !== undefined) {
      tokenPrice = poolData.price;
    }
  }

  if (tokenPrice === undefined) {
    // prettier-ignore
    model.logPlatformError(toError(305000, jar.chain, jar.details.apiKey, "AbraCadabraUtil/calculateAbradabraApy/tokenPrice", 'tokenPrice is undefined' , '', ErrorSeverity.ERROR_3));
  }

  const iceRewardsPerYear = icePerSecond * ONE_YEAR_SECONDS;
  const valueRewardedPerYear = model.priceOfSync("spell", jar.chain) * iceRewardsPerYear;

  const totalValueStaked = totalSupply * tokenPrice;
  const spellAPY = valueRewardedPerYear / totalValueStaked;
  return spellAPY;
}
