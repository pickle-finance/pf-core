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
    rewarder: "0x3Fe65692bfCD0e6CF84cB1E7d24108E434A7587e"
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
    let fetchPromise = undefined;
    try {
      fetchPromise = fetch(
        "https://www.convexfinance.com/api/curve-apys",
        {
          method: "GET",
          headers: {
            "X-Requested-With": "XMLHttpRequest",
          },
        },
      ).then((x) => x.json())
      .catch(()=>{ return undefined});
    } catch(error) {
      // do nothing
    }
    const fetchResult = await fetchPromise;
    if( !fetchResult )
      return [];
    const curveAPY = fetchResult?.apys;      
    
    // Component 1
    const multicallProvider = model.multicallProviderFor(definition.chain);
    await multicallProvider.init();

    const cvxPool = convexPools[definition.depositToken.addr];
    if (curveAPY && multicallProvider ) {
      const lpApy = parseFloat(curveAPY[cvxPool.tokenName]?.baseApy);
      const crvApy = parseFloat(curveAPY[cvxPool.tokenName]?.crvApy);
      const addtlRewards = curveAPY[cvxPool.tokenName] ? curveAPY[cvxPool.tokenName].additionalRewards : undefined;
      const addtlRewardApy = addtlRewards && addtlRewards.length > 0 && addtlRewards[0] !== undefined  ? addtlRewards[0] : 0;
      const rewardApy = parseFloat(addtlRewardApy);

      const rewarder = cvxPool.rewarder || (await CvxBooster__factory.connect(CVX_BOOSTER, resolver).poolInfo(cvxPool.poolId)).crvRewards

      const crvRewardsMC = new MulticallContract(
        rewarder,
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
      ];
      const rewardToLower = cvxPool.rewardName.toLowerCase();
      if( rewardToLower !== 'cvx' && rewardToLower !== 'crv' ) {
        components.push(createAprComponentImpl(cvxPool.rewardName, rewardApy, true));
      }
      return components;
    }
    return undefined;
  }
