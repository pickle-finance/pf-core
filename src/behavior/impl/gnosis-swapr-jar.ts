import { JarDefinition, AssetAprComponent } from "../../model/PickleModelJson";
import { createAprComponentImpl } from "../AbstractJarBehavior";
import { Contract as MultiContract } from "ethers-multicall";
import { PickleModel } from "../../model/PickleModel";
import swaprRewarderAbi from "../../Contracts/ABIs/swapr-rewarder.json";
import { formatEther } from "ethers/lib/utils";
import { ONE_YEAR_IN_SECONDS } from "../../behavior/AbstractJarBehavior";

// Info for individual rewarder contracts
const swaprRewarders = {
  "0xD7b118271B1B7d26C9e044Fc927CA31DccB22a5a": {
    name: "GNO-XDAI",
    rewarder: "0x070386C4d038FE96ECC9D7fB722b3378Aace4863",
    rewards: ["0x532801ed6f82fffd2dab70a19fc2d7b2772c4f4b", "0x9c58bacc331c9aa871afd802db6379a98e80cedb"],
  }
}

// All reward tokens available on the swapr platform
const swaprRewardTokens = {
  "0x532801ed6f82fffd2dab70a19fc2d7b2772c4f4b": "swapr",
  "0x9c58bacc331c9aa871afd802db6379a98e80cedb": "gnosis",
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
    const rewardTokenName = swaprRewardTokens[rewardTokenAddress];

    if (swaprRewarders[jar.depositToken.addr].rewards.includes(rewardTokenAddress)) {

      const amount = rewardData[i][1];
      const rewardPerSecondBN = amount / duration;
      const rewardPerSecond = (parseFloat(formatEther(rewardPerSecondBN)));
      const rewardPerYear = rewardPerSecond * ONE_YEAR_IN_SECONDS;
      const valueRewardedPerYear = model.priceOfSync(rewardTokenName, jar.chain) * rewardPerYear;
      const rewardAPY = (valueRewardedPerYear / totalValueStaked) * 100;

      rewardsReturn.push([
        createAprComponentImpl(rewardTokenName, rewardAPY, true, 0.958)
      ])
    }
  }

  return rewardsReturn;
}