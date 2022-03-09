import { Contract as MultiContract } from "ethers-multicall";
import { BigNumber, ethers } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { JarBehaviorDiscovery, PickleModel } from "..";
import { ONE_YEAR_SECONDS } from "../behavior/JarBehaviorResolver";
import { ChainNetwork } from "../chain/Chains";
import { AssetAprComponent, JarDefinition } from "../model/PickleModelJson";
import fetch from "cross-fetch";
import CrvRewardsABI from "../Contracts/ABIs/crv-rewards.json";
import ExtraRewardsABI from "../Contracts/ABIs/extra-rewards.json";
import fxsPoolABI from "../Contracts/ABIs/fxs-pool.json";
import curvePoolAbi from "../Contracts/ABIs/curve-pool.json";
import cvxBoosterAbi from "../Contracts/ABIs/cvx-booster.json";
import erc20Abi from "../Contracts/ABIs/erc20.json";
import { PoolInfo } from "./ProtocolUtil";
import { createAprComponentImpl } from "../behavior/AbstractJarBehavior";
import { JAR_CVXCRV } from "../model/JarsAndFarms";

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
  "0xF3A43307DcAFa93275993862Aae628fCB50dC768": {
    poolId: 72,
    tokenName: "cvxfxs",
    rewardName: "cvx",
    tokenPriceLookup: "fxs",
    rewardPriceLookup: "cvx",
    extraReward: "fxs",
    extraRewardPriceLookup: "fxs",
  },
};

export async function getCvxMint(
  crvEarned: number,
  model: PickleModel,
): Promise<number> {
  /* Adapted from https://docs.convexfinance.com/convexfinanceintegration/cvx-minting */

  const cliffSize = 100000; // new cliff every 100,000 tokens
  const cliffCount = 1000; // 1,000 cliffs
  const maxSupply = 100000000; // 100 mil max supply

  const cvxContract = new MultiContract(model.addr("cvx"), erc20Abi);
  const cvxTotalSupplyBN = await model.comMan.call(
    () => cvxContract.totalSupply(),
    ChainNetwork.Ethereum,
  );

  // first get total supply
  const cvxTotalSupply = parseFloat(formatEther(cvxTotalSupplyBN));

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
  const cvxPool = convexPools[definition.depositToken.addr];
  if (curveAPY) {
    const lpApr = parseFloat(curveAPY[cvxPool.tokenName]?.baseApy);
    let crvApr = parseFloat(curveAPY[cvxPool.tokenName]?.crvApy);

    const cvxBoosterContract = new MultiContract(CVX_BOOSTER, cvxBoosterAbi);
    const rewarder =
      cvxPool.rewarder ||
      (
        await model.comMan.call(
          () => cvxBoosterContract.poolInfo(cvxPool.poolId),
          definition.chain,
        )
      ).crvRewards;

    const crvRewardsMC = new MultiContract(rewarder, CrvRewardsABI);
    const [depositLocked, duration, extraRewardsAddress, mcRewardRate]: [
      BigNumber,
      BigNumber,
      string,
      BigNumber,
    ] = await model.comMan.call(
      [
        () => crvRewardsMC.totalSupply(),
        () => crvRewardsMC.duration(),
        () => crvRewardsMC.extraRewards(0),
        () => crvRewardsMC.rewardRate(),
      ],
      definition.chain,
    );

    let priceMultiplier = 1;

    // See if there's 1) a linked minter contract; and 2) a price multiplier
    try {
      const crvPool = new ethers.Contract(
        definition.depositToken.addr,
        curvePoolAbi,
        model.providerFor(definition.chain),
      );

      const minterAddr = await crvPool.minter(); // if this call fails, then there is no linked minter contract

      const minter = new MultiContract(minterAddr, fxsPoolABI);
      const lpPriceBN = await model.comMan.call(
        () => minter.lp_price(),
        definition.chain,
      );
      priceMultiplier = +formatEther(lpPriceBN);
    } catch (e) {
      // TODO do something here??
      console.log(
        "Unknown error in ConvexUtility.getProjectedConvexAprStats(): " + e,
      );
    }

    const poolValue =
      parseFloat(formatEther(depositLocked)) *
      priceMultiplier *
      (model.priceOfSync(cvxPool.tokenPriceLookup, definition.chain) ||
        (await new JarBehaviorDiscovery()
          .findAssetBehavior(definition)
          .getDepositTokenPrice(definition, model)));

    const isCvxCrvStaker =
      JAR_CVXCRV.details.apiKey === definition.details.apiKey;
    if (isCvxCrvStaker) {
      const rewardRateUSD =
        (model.priceOfSync("crv", definition.chain) *
          mcRewardRate.div(1e10).toNumber()) /
        1e8;
      crvApr = rewardRateUSD * (ONE_YEAR_SECONDS / poolValue) * 100;
    }
    const crvRewardPerDuration =
      (crvApr * poolValue) /
      (duration.toNumber() * model.priceOfSync("crv", definition.chain));

    const cvxReward = await getCvxMint(crvRewardPerDuration * 100, model);
    const cvxValuePerYear =
      (cvxReward *
        model.priceOfSync("cvx", definition.chain) *
        ONE_YEAR_SECONDS) /
      duration.toNumber();
    const cvxApr = cvxValuePerYear / poolValue;

    // component 2
    const extraRewardsContract = new MultiContract(
      extraRewardsAddress,
      ExtraRewardsABI,
    );
    const extraRewardCurrentRewards = await model.comMan.call(
      () => extraRewardsContract.currentRewards(),
      definition.chain,
    );
    const extraRewardAmount = +formatEther(extraRewardCurrentRewards);
    const extraRewardValuePerYear =
      (extraRewardAmount *
        (model.priceOfSync(cvxPool.rewardPriceLookup, definition.chain) || 0) *
        ONE_YEAR_SECONDS) /
      duration.toNumber();
    let extraRewardApr = extraRewardValuePerYear / poolValue;

    const isExtraCvx = cvxPool.rewardName === "cvx"; // extraReward token is CVX
    if (isExtraCvx) extraRewardApr += cvxApr;

    // component 3
    let extraRewardApr2;
    if (cvxPool.extraReward) {
      const extraRewardsAddress2: string = await model.comMan.call(
        () => crvRewardsMC.extraRewards(1),
        definition.chain,
      );
      const extraRewardsContract2 = new MultiContract(
        extraRewardsAddress2,
        ExtraRewardsABI,
      );
      const extraReward2CurrentRewards = await model.comMan.call(
        () => extraRewardsContract2.currentRewards(),
        definition.chain,
      );
      const extraRewardAmount2 = +formatEther(extraReward2CurrentRewards);
      const extraRewardValuePerYear2 =
        (extraRewardAmount2 *
          (model.priceOfSync(
            cvxPool.extraRewardPriceLookup,
            definition.chain,
          ) || 0) *
          ONE_YEAR_SECONDS) /
        duration.toNumber();
      extraRewardApr2 = extraRewardValuePerYear2 / poolValue;
    }
    const components: AssetAprComponent[] = [
      ...(isCvxCrvStaker ? [] : [createAprComponentImpl("lp", lpApr, false)]),
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
      ...(cvxPool.extraReward
        ? [
            createAprComponentImpl(
              cvxPool.extraReward,
              extraRewardApr2 * 100,
              true,
            ),
          ]
        : []),
    ];

    return components;
  }
  return undefined;
}
