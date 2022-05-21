import { JarDefinition, AssetAprComponent, AssetProjectedApr } from "../../model/PickleModelJson";
import { createAprComponentImpl, AbstractJarBehavior } from "../AbstractJarBehavior";
import { Contract as MultiContract } from "ethers-multicall";
import { PickleModel } from "../../model/PickleModel";
import swaprRewarderAbi from "../../Contracts/ABIs/swapr-rewarder.json";
import { formatEther } from "ethers/lib/utils";
import { ONE_YEAR_IN_SECONDS } from "../../behavior/AbstractJarBehavior";
import { Chains } from "../../chain/Chains";

// Info for individual rewarder contracts
const swaprRewarders = {
  "0xD7b118271B1B7d26C9e044Fc927CA31DccB22a5a": {
    name: "GNO-XDAI",
    rewarder: "0x070386C4d038FE96ECC9D7fB722b3378Aace4863",
    rewards: ["swapr", "gno"],
  }
}

export async function calculateGnosisSwaprAPY(
  jar: JarDefinition,
  model: PickleModel,
): Promise<AssetAprComponent[]> {
  const rewarder = swaprRewarders[jar.depositToken.addr].rewarder;
  const multicallRewarder = new MultiContract(
    rewarder,
    swaprRewarderAbi,
  );

  const [rewardTokens, duration, totalSupplyBN] =
    await model.callMulti(
      [
        () => multicallRewarder.getRewardTokens(),
        () => multicallRewarder.secondsDuration(),
        () => multicallRewarder.totalStakedTokensAmount(),
      ],
      jar.chain,
    );

  const pricePerToken = model.priceOfSync(jar.depositToken.addr, jar.chain);
  const totalSupply = parseFloat(formatEther(totalSupplyBN));
  const totalValueStaked = totalSupply * pricePerToken;

  const rewardData = [];
  for (let i = 0; i < rewardTokens.length; i++) {
    rewardData.push(
      await model.callMulti(
        () => multicallRewarder.rewards(i),
        jar.chain
      )
    )
  }

  const rewardsReturn = [];
  for (let i = 0; i < rewardData.length; i++) {
    const rewardTokenAddress = rewardData[i][0];
    const rewardTokenName = swaprRewarders[jar.depositToken.addr].rewards[i];
    const price = model.priceOfSync(rewardTokenAddress, jar.chain);

    if (price) {
      const amountBN = rewardData[i][1];
      const amount = (parseFloat(formatEther(amountBN)));
      const rewardPerSecond = amount / duration;
      const rewardPerYear = rewardPerSecond * ONE_YEAR_IN_SECONDS;
      const valueRewardedPerYear = model.priceOfSync(rewardTokenName, jar.chain) * rewardPerYear;
      const rewardAPY = (valueRewardedPerYear / totalValueStaked) * 100;

      rewardsReturn.push(
        createAprComponentImpl(rewardTokenName, rewardAPY, true, 1 - Chains.get(jar.chain).defaultPerformanceFee)
      )
    }
  }
  return rewardsReturn;
}

export abstract class GnosisSwaprJar extends AbstractJarBehavior {
  strategyAbi: any;
  constructor(strategyAbi: any) {
    super();
    this.strategyAbi = strategyAbi;
  }
  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    const rewarder = swaprRewarders[jar.depositToken.addr].rewarder;
    const multicallRewarder = new MultiContract(
      rewarder,
      swaprRewarderAbi,
    );

    const harvestableReturn = await model.callMulti(
      () => multicallRewarder.claimableRewards(jar.contract),
      jar.chain
    )

    return harvestableReturn.reduce((x, y) => x + y);
  }

  async getProjectedAprStats(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    return this.aprComponentsToProjectedApr(
      await calculateGnosisSwaprAPY(definition, model),
    );
  }
}