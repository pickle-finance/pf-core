import { AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import { PickleModel } from "../../model/PickleModel";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import aurigamiAbi from "../../Contracts/ABIs/aurigami.json";
import strategyABI from "../../Contracts/ABIs/strategy.json";
import { Contract as MultiContract } from "ethers-multicall";
import { AuroraMultistepHarvestJar } from "./aurora-multistep-harvest-jar";
import { PoolId } from "../../protocols/ProtocolUtil";
import { formatEther } from "ethers/lib/utils";
import {
  createAprComponentImpl,
  ONE_YEAR_IN_SECONDS,
} from "../AbstractJarBehavior";
import { Chains } from "../../chain/Chains";

const REWARDS = "0xC9A848AC73e378516B16E4EeBBa5ef6aFbC0BBc2";

const auriPoolIds: PoolId = {
  "0x044b6B0CD3Bb13D2b9057781Df4459C66781dCe7": 0,
};

export class AuroraAurigamiJar extends AuroraMultistepHarvestJar {
  strategyAbi: any;
  constructor() {
    super(4, 2);
    this.strategyAbi = strategyABI;
  }
  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    return this.getHarvestableUSDCommsMgrImplementation(
      jar,
      model,
      ["ply"],
      this.strategyAbi,
    );
  }

  async getProjectedAprStats(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const pricePerToken = model.priceOfSync(jar.depositToken.addr, jar.chain);

    const poolId = auriPoolIds[jar.depositToken.addr];
    const multicallAuriFarms = new MultiContract(REWARDS, aurigamiAbi);

    const [poolInfo] = await model.callMulti(
      [() => multicallAuriFarms.getPoolInfo(poolId)],
      jar.chain,
    );

    const { totalStake, rewardPerSeconds } = poolInfo;

    // only 5% vests immediately
    const rewardsPerYear =
      parseFloat(formatEther(rewardPerSeconds[0])) * ONE_YEAR_IN_SECONDS * 0.05;

    const totalSupply = parseFloat(formatEther(totalStake));
    const plyRewardedPerYear =
      model.priceOfSync("ply", jar.chain) * rewardsPerYear;
    const totalValueStaked = totalSupply * pricePerToken;
    const plyAPY = plyRewardedPerYear / totalValueStaked;

    return this.aprComponentsToProjectedApr([
      createAprComponentImpl(
        "ply",
        plyAPY * 100,
        true,
        1 - Chains.get(jar.chain).defaultPerformanceFee,
      ),
    ]);
  }
}
