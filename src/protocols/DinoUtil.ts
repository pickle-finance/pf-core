import { JarDefinition } from "../model/PickleModelJson";
import erc20Abi from "../Contracts/ABIs/erc20.json";
import fossilFarmsAbi from "../Contracts/ABIs/fossil-farms.json";
import { PickleModel } from "../model/PickleModel";
import { Contract as MulticallContract } from "ethers-multicall";
import { Chains } from "../chain/Chains";
import { formatEther } from "ethers/lib/utils";
import { PoolId } from "./ProtocolUtil";

export const FOSSIL_FARMS = "0x1948abc5400aa1d72223882958da3bec643fb4e5";
export const dinoPoolIds: PoolId = {
  "0x3324af8417844e70b81555A6D1568d78f4D4Bf1f": 10,
  "0x9f03309A588e33A239Bf49ed8D68b2D45C7A1F11": 11,
  "0xab0454b98daf4a02ea29292e6a8882fb2c787dd4": 20,
};

export async function calculateFossilFarmsAPY(
  jar: JarDefinition,
  model: PickleModel,
) {
  const multicallProvider = model.multicallProviderFor(jar.chain);
  await multicallProvider.init();
  const multicallFossilFarms = new MulticallContract(
    FOSSIL_FARMS,
    fossilFarmsAbi,
  );
  const lpToken = new MulticallContract(jar.depositToken.addr, erc20Abi);
  const [dinoPerBlockBN, totalAllocPointBN, poolInfo, totalSupplyBN] =
    await multicallProvider.all([
      multicallFossilFarms.dinoPerBlock(),
      multicallFossilFarms.totalAllocPoint(),
      multicallFossilFarms.poolInfo(dinoPoolIds[jar.depositToken.addr]),
      lpToken.balanceOf(FOSSIL_FARMS),
    ]);

  const totalSupply = parseFloat(formatEther(totalSupplyBN));
  const rewardsPerBlock =
    (parseFloat(formatEther(dinoPerBlockBN)) *
      0.9 *
      poolInfo.allocPoint.toNumber()) /
    totalAllocPointBN.toNumber();

  const pricePerToken = model.priceOfSync(jar.depositToken.addr, jar.chain);

  const rewardsPerYear =
    rewardsPerBlock *
    ((360 * 24 * 60 * 60) / Chains.get(jar.chain).secondsPerBlock);
  const dinoRewardedPerYear =
    model.priceOfSync("dino", jar.chain) * rewardsPerYear;
  const totalValueStaked = totalSupply * pricePerToken;
  const dinoAPY = dinoRewardedPerYear / totalValueStaked;
  return dinoAPY * 100;
}
