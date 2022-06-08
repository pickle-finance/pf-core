import { Contract } from "ethers-multiprovider";
import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { PickleModel } from "..";
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
import { PoolInfo, SinglePoolInfo } from "./ProtocolUtil";
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
  "0x1054Ff2ffA34c055a13DCD9E0b4c0cA5b3aecEB9": {
    poolId: 79,
    tokenName: "cadcusdc",
    rewardName: "",
    tokenPriceLookup: "cadcusdc",
    rewardPriceLookup: "",
  },
};

export async function getCvxTotalSupply(
  model: PickleModel,
): Promise<BigNumber> {
  const multiProvider = model.multiproviderFor(ChainNetwork.Ethereum);
  const cvxContract = new Contract(model.addr("cvx"), erc20Abi);
  const [cvxTotalSupplyBN] = await multiProvider.all([
    cvxContract.totalSupply(),
  ]);
  return cvxTotalSupplyBN;
}

export function getCvxMint(
  crvEarned: number,
  cvxTotalSupplyBN: BigNumber,
): number {
  /* Adapted from https://docs.convexfinance.com/convexfinanceintegration/cvx-minting */

  const cliffSize = 100000; // new cliff every 100,000 tokens
  const cliffCount = 1000; // 1,000 cliffs
  const maxSupply = 100000000; // 100 mil max supply

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

export async function getConvexCurveApi(): Promise<any> {
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
  return fetchPromise;
}
export async function getConvexRewarderPromise(
  cvxPool: SinglePoolInfo,
  model: PickleModel,
  definition: JarDefinition,
): Promise<string> {
  const multiProvider = model.multiproviderFor(definition.chain);
  const cvxBoosterContract = new Contract(CVX_BOOSTER, cvxBoosterAbi);
  const rewarder =
    cvxPool.rewarder ||
    (
      await multiProvider
        .all([cvxBoosterContract.poolInfo(cvxPool.poolId)])
        .then((x) => x[0])
    ).crvRewards;
  return rewarder;
}

export async function getPriceMultiplierFromMinter(
  definition: JarDefinition,
  model: PickleModel,
): Promise<number> {
  let priceMultiplier = 1;
  // See if there's 1) a linked minter contract; and 2) a price multiplier
  try {
    const multiProvider = model.multiproviderFor(definition.chain);
    const crvPool = new Contract(
      definition.depositToken.addr,
      curvePoolAbi,
      multiProvider,
    );

    // if this call fails, then there is no linked minter contract
    const minterAddr = await crvPool.minter();

    const minter = new Contract(minterAddr, fxsPoolABI);
    const [lpPriceBN] = await multiProvider.all([minter.lp_price()]);
    priceMultiplier = +formatEther(lpPriceBN);
  } catch (e) {
    // TODO do something here??
    // console.log(
    //   `[${definition.details?.apiKey}] Unknown error in ConvexUtility.getProjectedConvexAprStats(): ` +
    //     e,
    // );
  }
  return priceMultiplier;
}

export async function getExtraRewards1(
  extraRewardsAddress: string,
  model: PickleModel,
  definition: JarDefinition,
): Promise<BigNumber> {
  const multiProvider = model.multiproviderFor(definition.chain);
  const extraRewardsContract = new Contract(
    extraRewardsAddress,
    ExtraRewardsABI,
  );
  return multiProvider
    .all([extraRewardsContract.currentRewards()])
    .then((x) => x[0]);
}
export async function getProjectedConvexAprStats(
  definition: JarDefinition,
  model: PickleModel,
): Promise<AssetAprComponent[]> {
  const cvxPool = convexPools[definition.depositToken.addr];
  const convexApiPromise = getConvexCurveApi();

  const cvxTotalSupplyPromise = getCvxTotalSupply(model);
  const rewarderPromise = getConvexRewarderPromise(cvxPool, model, definition);

  const crvPrice = model.priceOfSync("crv", definition.chain);
  const cvxPrice = model.priceOfSync("cvx", definition.chain);

  const fetchResult = await convexApiPromise;
  if (!fetchResult) return [];
  const curveAPY = fetchResult?.apys;

  // Component 1
  if (curveAPY) {
    const lpApr = parseFloat(curveAPY[cvxPool.tokenName]?.baseApy);
    let crvApr = parseFloat(curveAPY[cvxPool.tokenName]?.crvApy);

    const multiProvider = model.multiproviderFor(definition.chain);
    const crvRewardsMC = new Contract(await rewarderPromise, CrvRewardsABI);
    let extraRewardsAddress2Promise: Promise<string> | undefined = undefined;
    if (cvxPool.extraReward) {
      extraRewardsAddress2Promise = multiProvider
        .all([crvRewardsMC.extraRewards(1)])
        .then((x) => x[0]);
    }
    const [depositLocked, duration, mcRewardRate]: BigNumber[] =
      await multiProvider.all([
        crvRewardsMC.totalSupply(),
        crvRewardsMC.duration(),
        crvRewardsMC.rewardRate(),
      ]);

    const depositTokenPrice = definition.depositToken.price;
    const poolValue =
      parseFloat(formatEther(depositLocked)) *
      (model.priceOfSync(cvxPool.tokenPriceLookup, definition.chain) ||
        depositTokenPrice);

    const isCvxCrvStaker =
      JAR_CVXCRV.details.apiKey === definition.details.apiKey;
    if (isCvxCrvStaker) {
      const rewardRateUSD =
        (crvPrice * mcRewardRate.div(1e10).toNumber()) / 1e8;
      crvApr = rewardRateUSD * (ONE_YEAR_SECONDS / poolValue) * 100;
    }
    const crvRewardPerDuration =
      (crvApr * poolValue) / (duration.toNumber() * crvPrice);

    const cvxReward = getCvxMint(
      crvRewardPerDuration * 100,
      await cvxTotalSupplyPromise,
    );

    const cvxValuePerYear =
      (cvxReward * cvxPrice * ONE_YEAR_SECONDS) / duration.toNumber();
    const cvxApr = cvxValuePerYear / poolValue;

    const isExtraCvx = cvxPool.rewardName === "cvx"; // extraReward token is CVX
    let extraRewardApr: number;
    if (cvxPool.rewardName) {
      const [extraRewardsAddress]: string[] = await multiProvider.all([
        crvRewardsMC.extraRewards(0),
      ]);
      const extraRewardCurrentRewardsPromise: Promise<BigNumber> =
        getExtraRewards1(extraRewardsAddress, model, definition);
      const extraRewardCurrentRewards = await extraRewardCurrentRewardsPromise;
      const extraRewardAmount = +formatEther(extraRewardCurrentRewards);
      const extraRewardValuePerYear =
        (extraRewardAmount *
          (model.priceOfSync(cvxPool.rewardPriceLookup, definition.chain) ||
            0) *
          ONE_YEAR_SECONDS) /
        duration.toNumber();
      extraRewardApr = extraRewardValuePerYear / poolValue;

      if (isExtraCvx) extraRewardApr += cvxApr;
    }

    // component 3
    let extraRewardApr2 = 0;
    if (cvxPool.extraReward) {
      const extraRewardsAddress2: string = await extraRewardsAddress2Promise;

      const extraRewardsContract2 = new Contract(
        extraRewardsAddress2,
        ExtraRewardsABI,
      );
      const [extraReward2CurrentRewards] = await multiProvider.all([
        extraRewardsContract2.currentRewards(),
      ]);

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

    const components: AssetAprComponent[] = [];
    if (!isCvxCrvStaker) {
      components.push(createAprComponentImpl("lp", lpApr, false));
    }
    components.push(createAprComponentImpl("crv", crvApr, true));
    if (!isExtraCvx) {
      components.push(createAprComponentImpl("cvx", cvxApr * 100, true));
    }
    if (cvxPool.rewardName) {
      components.push(
        createAprComponentImpl(cvxPool.rewardName, extraRewardApr * 100, true),
      );
    }
    if (cvxPool.extraReward) {
      components.push(
        createAprComponentImpl(
          cvxPool.extraReward,
          extraRewardApr2 * 100,
          true,
        ),
      );
    }
    return components;
  }
  return undefined;
}
