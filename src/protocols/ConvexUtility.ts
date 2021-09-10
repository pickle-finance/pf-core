import { Provider as MulticallProvider, Contract as MulticallContract} from 'ethers-multicall';
import { BigNumber, ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { formatEther } from "ethers/lib/utils";
import { PickleModel } from "..";
import { ONE_YEAR_SECONDS } from "../behavior/JarBehaviorResolver";
import { Chains } from "../chain/Chains";
import { Erc20__factory, CvxBooster__factory } from "../Contracts/ContractsImpl";
import { AssetAprComponent, AssetProjectedApr, JarDefinition } from "../model/PickleModelJson";
import fetch from "cross-fetch";
import CrvRewardsABI from '../Contracts/ABIs/crv-rewards.json';
import { PoolInfo } from './ProtocolUtil';
import { createAprComponentImpl } from '../behavior/AbstractJarBehavior';

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
};

  export async function getCvxMint (crvEarned: number, model: PickleModel, provider: Provider|Signer ): Promise<number> {
    /* Adapted from https://docs.convexfinance.com/convexfinanceintegration/cvx-minting */
  
    const cliffSize = 100000; // new cliff every 100,000 tokens
      const cliffCount = 1000; // 1,000 cliffs
      const maxSupply = 100000000; // 100 mil max supply
    
      const cvx = Erc20__factory.connect(model.addr("cvx"), provider)
    
      // first get total supply
      const cvxTotalSupply = parseFloat(formatEther((await cvx.totalSupply())))
    
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

  export async function getProjectedConvexAprStats(definition: JarDefinition, 
    model: PickleModel) : Promise<AssetAprComponent[]> {
    const resolver : Provider | Signer = Chains.get(definition.chain).getPreferredWeb3Provider();
    const curveFetched = await fetch(
      "https://cors.bridged.cc/https://www.convexfinance.com/api/curve-apys",
      {
        method: "GET",
        headers: {
          "X-Requested-With": "XMLHttpRequest"
        },
      },
    )
    const asJson = await curveFetched.json();
    const curveAPY = asJson.apys;
    
    // Component 1
    const multicallProvider = new MulticallProvider(resolver);
    await multicallProvider.init();

    const cvxPool = convexPools[definition.depositToken.addr];
    if (curveAPY && multicallProvider ) {
      const lpApy = parseFloat(curveAPY[cvxPool.tokenName]?.baseApy);
      const crvApy = parseFloat(curveAPY[cvxPool.tokenName]?.crvApy);
      const rewardApy = parseFloat(curveAPY[cvxPool.tokenName]?.additionalRewards[0].apy);

      const poolInfo = await CvxBooster__factory.connect(CVX_BOOSTER, resolver).poolInfo(cvxPool.poolId)

      const crvRewardsMC = new MulticallContract(
        poolInfo.crvRewards,
        CrvRewardsABI,
      );

      const [crvReward, depositLocked, duration] = await multicallProvider.all([
        crvRewardsMC.currentRewards(),
        crvRewardsMC.totalSupply(),
        crvRewardsMC.duration()
      ])

      const poolValue = parseFloat(formatEther(depositLocked)) * 
        model.priceOfSync(cvxPool.tokenPriceLookup);
      
      const crvRewardPerDuration =
        (crvApy * poolValue) / (duration.toNumber() * model.priceOfSync("crv"));
      const cvxReward = await getCvxMint(crvRewardPerDuration * 100, model, resolver);
      const cvxValuePerYear =
          (cvxReward * model.priceOfSync("cvx") * ONE_YEAR_SECONDS) / duration.toNumber();
  
      const cvxApy = cvxValuePerYear / poolValue;

      const components: AssetAprComponent[] = [
        createAprComponentImpl("LP", lpApy, false),
        createAprComponentImpl("CRV", crvApy, true),
        createAprComponentImpl("CVX", cvxApy*100, true),
        createAprComponentImpl(cvxPool.rewardName, rewardApy, true)
      ];
      return components;
    }
    return undefined;
  }
