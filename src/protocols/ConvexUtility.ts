import { Contract as MulticallContract } from "ethers-multicall";
import { Signer, Contract as ethersContract } from "ethers";
import { Provider } from "@ethersproject/providers";
import { formatEther } from "ethers/lib/utils";
import { JarBehaviorDiscovery, PickleModel } from "..";
import { ONE_YEAR_SECONDS } from "../behavior/JarBehaviorResolver";
import { Chains } from "../chain/Chains";
import {
  Erc20__factory,
  CvxBooster__factory,
} from "../Contracts/ContractsImpl";
import { AssetAprComponent, JarDefinition } from "../model/PickleModelJson";
import fetch from "cross-fetch";
import CrvRewardsABI from "../Contracts/ABIs/crv-rewards.json";
import ExtraRewardsABI from "../Contracts/ABIs/extra-rewards.json";
import { PoolInfo } from "./ProtocolUtil";
import { createAprComponentImpl } from "../behavior/AbstractJarBehavior";

const CVX_BOOSTER = "0xF403C135812408BFbE8713b5A23a04b3D48AAE31";

const convexPools: PoolInfo = {
  "0x06325440D014e39736583c165C2963BA99fAf14E": {
    poolId: 25,
    tokenName: "steth",
    rewardName: "ldo",
    tokenPriceLookup: "weth",
    rewardPriceLookup: "ldo",
  },
  "0x5a6A4D54456819380173272A5E8E9B9904BdF41B": {
    poolId: 40,
    tokenName: "mim",
    rewardName: "spell",
    tokenPriceLookup: "dai",
    rewardPriceLookup: "spell",
  },
  "0x9D0464996170c6B9e75eED71c68B99dDEDf279e8": {
    poolId: 41,
    tokenName: "cvxcrv",
    rewardName: "cvx",
    tokenPriceLookup: "crv",
    rewardPriceLookup: "cvx",
  },
  "0x62B9c7356A2Dc64a1969e19C23e4f579F9810Aa7": {
    poolId: null, // not used
    tokenName: "cvxcrv",
    rewardName: "3crv",
    tokenPriceLookup: "cvxcrv",
    rewardPriceLookup: "3crv",
    rewarder: "0x3Fe65692bfCD0e6CF84cB1E7d24108E434A7587e",
  },
  "0xEd4064f376cB8d68F770FB1Ff088a3d0F3FF5c4d": {
    poolId: 61,
    tokenName: "crveth",
    rewardName: "",
    tokenPriceLookup: "crveth",
    rewardPriceLookup: "",
  },
  "0x3A283D9c08E8b55966afb64C515f5143cf907611": {
    poolId: 64,
    tokenName: "cvxeth",
    rewardName: "cvx",
    tokenPriceLookup: "cvxeth",
    rewardPriceLookup: "cvx",
  },
};

export async function getCvxMint(
  crvEarned: number,
  model: PickleModel,
  provider: Provider | Signer,
): Promise<number> {
  /* Adapted from https://docs.convexfinance.com/convexfinanceintegration/cvx-minting */

  const cliffSize = 100000; // new cliff every 100,000 tokens
  const cliffCount = 1000; // 1,000 cliffs
  const maxSupply = 100000000; // 100 mil max supply

  const cvx = Erc20__factory.connect(model.addr("cvx"), provider);

  // first get total supply
  const cvxTotalSupply = parseFloat(formatEther(await cvx.totalSupply()));

  // get current cliff
  const currentCliff = cvxTotalSupply / cliffSize;

  // if current cliff is under the max
  if (currentCliff < cliffCount) {
    // get remaining cliffs
    const remaining = cliffCount - currentCliff;

    // multiply ratio of remaining cliffs to total cliffs against amount CRV received
    let cvxEarned = (crvEarned * remaining) / cliffCount;

    // double check we have not gone over the max supply
    const amountTillMax = maxSupply - cvxTotalSupply;
    if (cvxEarned > amountTillMax) {
      cvxEarned = amountTillMax;
    }
    return cvxEarned;
  }
  return 0;
}

export async function getProjectedConvexAprStats(
  this: any,
  definition: JarDefinition,
  model: PickleModel,
): Promise<AssetAprComponent[]> {
  const resolver: Provider | Signer = Chains.get(
    definition.chain,
  ).getPreferredWeb3Provider();
  let fetchPromise = undefined;
  try {
    fetchPromise = fetch("https://www.convexfinance.com/api/curve-apys", {
      method: "GET",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    })
      .then((x) => x.json())
      .catch(() => {
        return undefined;
      });
  } catch (error) {
    // do nothing
  }
  const fetchResult = await fetchPromise;
  if (!fetchResult) return [];
  const curveAPY = fetchResult?.apys;

  // Component 1
  const multicallProvider = model.multicallProviderFor(definition.chain);
  await multicallProvider.init();

  const cvxPool = convexPools[definition.depositToken.addr];
  if (curveAPY && multicallProvider) {
    const lpApr = parseFloat(curveAPY[cvxPool.tokenName]?.baseApy);
    const crvApr = parseFloat(curveAPY[cvxPool.tokenName]?.crvApy);

    const rewarder =
      cvxPool.rewarder ||
      (
        await CvxBooster__factory.connect(CVX_BOOSTER, resolver).poolInfo(
          cvxPool.poolId,
        )
      ).crvRewards;

    const crvRewardsMC = new MulticallContract(rewarder, CrvRewardsABI);

    const [depositLocked, duration, extraRewardsAddress] =
      await multicallProvider.all([
        crvRewardsMC.totalSupply(),
        crvRewardsMC.duration(),
        crvRewardsMC.extraRewards(0),
      ]);

    const poolValue =
      parseFloat(formatEther(depositLocked)) *
      (model.priceOfSync(cvxPool.tokenPriceLookup) ||
        (await new JarBehaviorDiscovery()
          .findAssetBehavior(definition)
          .getDepositTokenPrice(definition, model)));

    const crvRewardPerDuration =
      (crvApr * poolValue) / (duration.toNumber() * model.priceOfSync("crv"));
    const cvxReward = await getCvxMint(
      crvRewardPerDuration * 100,
      model,
      resolver,
    );
    const cvxValuePerYear =
      (cvxReward * model.priceOfSync("cvx") * ONE_YEAR_SECONDS) /
      duration.toNumber();
    const cvxApr = cvxValuePerYear / poolValue;

    // component 2
    const extraRewardsContract = new ethersContract(
      extraRewardsAddress,
      ExtraRewardsABI,
      resolver,
    );
    const extraRewardAmount = +formatEther(
      await extraRewardsContract.currentRewards(),
    );
    const extraRewardValuePerYear =
      (extraRewardAmount *
        (model.priceOfSync(cvxPool.rewardPriceLookup) || 0) *
        ONE_YEAR_SECONDS) /
      duration.toNumber();
    let extraRewardApr = extraRewardValuePerYear / poolValue;

    const isExtraCvx = cvxPool.rewardName === "cvx"; // extraReward token is CVX
    if (isExtraCvx) extraRewardApr += cvxApr;

    const components: AssetAprComponent[] = [
      createAprComponentImpl("lp", lpApr, false),
      createAprComponentImpl("crv", crvApr, true),
      ...(isExtraCvx
        ? []
        : [createAprComponentImpl("cvx", cvxApr * 100, true)]),
      ...(cvxPool.rewardName
        ? [
            createAprComponentImpl(
              cvxPool.rewardName,
              extraRewardApr * 100,
              true,
            ),
          ]
        : []),
    ];

    return components;
  }
  return undefined;
}
