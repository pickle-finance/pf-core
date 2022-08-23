import { BigNumber, ethers } from "ethers";
import { Contract } from "ethers-multiprovider";
import { PickleModel } from "..";
import { AssetAprComponent, JarDefinition } from "../model/PickleModelJson";
import { ExternalTokenModelSingleton } from "../price/ExternalTokenModel";

//prettier-ignore
const gaugeAbi = ["function reward_data(address _token) view returns((address token, address distributor, uint256 period_finish, uint256 rate, uint256 last_update, uint256 integral))"]

export const getRewardOnlyGaugeTokensApr = async (
  jar: JarDefinition,
  model: PickleModel,
  rewardOnlyGauge: string,
  rewardTokensAddresses: string[],
): Promise<AssetAprComponent[]> => {
  //prettier-ignore
  const erc20Abi = ["function balanceOf(address) view returns(uint256)", "function decimals() view returns(uint8)"];
  const multiProvider = model.multiproviderFor(jar.chain);
  const gaugeContract = new Contract(rewardOnlyGauge, gaugeAbi);
  const rewardsRatesProms: Promise<BigNumber>[] = rewardTokensAddresses.map(
    async (reward: string) => {
      const [[, , period_finish, rate]] = await multiProvider.all([
        gaugeContract.reward_data(reward),
      ]);
      const periodFinish: number = period_finish.toNumber();
      if (Date.now() / 1000 >= periodFinish) return BigNumber.from(0);
      return rate;
    },
  );
  const depositTokenContract = new Contract(jar.depositToken.addr, erc20Abi);
  const [totalStakedBN, depositDecimals] = await multiProvider.all([
    depositTokenContract.balanceOf(rewardOnlyGauge),
    depositTokenContract.decimals(),
  ]);
  const totalStaked = parseFloat(
    ethers.utils.formatUnits(totalStakedBN, depositDecimals),
  );
  const totalStakedUsd = totalStaked * jar.depositToken.price;
  const rewardsRates = await Promise.all(rewardsRatesProms);
  const secondsInYear = BigNumber.from(60 * 60 * 24 * 365);
  const rewardsAprs: AssetAprComponent[] = rewardTokensAddresses.map(
    (tokenAddr, idx) => {
      const token = ExternalTokenModelSingleton.getToken(tokenAddr, jar.chain);
      const name = token.id;
      const decimals = token.decimals;
      const price = token.price ?? 0;
      const yearlyRateBN = rewardsRates[idx].mul(secondsInYear);
      const yearlyRateUSD =
        parseFloat(ethers.utils.formatUnits(yearlyRateBN, decimals)) * price;

      let apr = yearlyRateUSD * 100;
      if (yearlyRateUSD !== 0) apr = (yearlyRateUSD / totalStakedUsd) * 100;

      const aprComponent: AssetAprComponent = {
        name,
        apr,
        compoundable: true,
      };
      return aprComponent;
    },
  );

  return rewardsAprs;
};
