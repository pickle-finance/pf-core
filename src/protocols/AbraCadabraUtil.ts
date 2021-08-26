import { PickleModel } from "..";
import { AVERAGE_BLOCK_TIME, ONE_YEAR_SECONDS } from "../behavior/JarBehaviorResolver";
import { PoolId } from "./ProtocolUtil";
import { Provider as MulticallProvider, Contract as MulticallContract} from 'ethers-multicall';
import erc20Abi from '../Contracts/ABIs/erc20.json';
import { formatEther, formatUnits } from "ethers/lib/utils";
import { BigNumber, Contract, ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { JAR_MIM3CRV } from "../model/JarsAndFarms";
import { getSushiSwapPairData } from "./SushiSwapUtil";
import { getCurveLpPriceData } from "./CurveUtil";
import {sorbettiereAbi} from "../Contracts/ABIs/sorbettiere.abi";
import { JarDefinition } from "../model/PickleModelJson";
const abracadabraIds: PoolId = {
    "0xb5De0C3753b6E1B4dBA616Db82767F17513E6d4E": 0,
    "0x5a6A4D54456819380173272A5E8E9B9904BdF41B": 1,
    "0x07D5695a24904CC1B6e3bd57cC7780B90618e3c4": 2,
  };
  export const SORBETTIERE_REWARDS = "0xF43480afE9863da4AcBD4419A47D9Cc7d25A647F";

  
  export async function calculateAbradabraApy(definition: JarDefinition, model: PickleModel,
     resolver : Signer | Provider) : Promise<number> {

    const multicallProvider = new MulticallProvider((resolver as Signer).provider === undefined ? (resolver as Provider) : (resolver as Signer).provider);
    await multicallProvider.init();
    
    

    const poolId = abracadabraIds[definition.depositToken.addr];

    const multicallSorbettiereFarm = new MulticallContract(
        SORBETTIERE_REWARDS, sorbettiereAbi);
    const lpToken = new MulticallContract(definition.depositToken.addr, erc20Abi);

    const [
        icePerSecondBN,
        totalAllocPointBN,
        poolInfo,
        supplyInRewarderBN,
    ] = await multicallProvider.all([
        multicallSorbettiereFarm.icePerSecond(),
        multicallSorbettiereFarm.totalAllocPoint(),
        multicallSorbettiereFarm.poolInfo(poolId),
        lpToken.balanceOf(multicallSorbettiereFarm.address),
    ]);

    const supplyInRewarder = parseFloat(formatEther(supplyInRewarderBN));
    const icePerSec : number = parseFloat(formatEther(icePerSecondBN));
    const totalAllocPoint = totalAllocPointBN.toNumber();
    const icePerSecond =
        icePerSec * poolInfo.allocPoint /
        totalAllocPoint;
    let tokenPrice: number = definition.depositToken.price;

    const iceRewardsPerYear = icePerSecond * ONE_YEAR_SECONDS;
    const valueRewardedPerYear = await model.priceOf("spell") * iceRewardsPerYear;

    const totalValueStaked = supplyInRewarder * tokenPrice;
    const spellAPY = valueRewardedPerYear / totalValueStaked;

    console.log(JSON.stringify([
        definition.depositToken.addr, poolId, icePerSecond, tokenPrice, iceRewardsPerYear, valueRewardedPerYear, totalValueStaked, spellAPY
    ]));

    return spellAPY * 100;
    }