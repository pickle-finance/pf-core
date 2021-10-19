import erc20Abi from "../Contracts/ABIs/erc20.json";
import { Contract as MulticallContract } from "ethers-multicall";
import { formatEther } from "ethers/lib/utils";
import { Chains, PickleModel } from "..";
import { JarDefinition } from "../model/PickleModelJson";
import { PoolId } from "./ProtocolUtil";
import cherryChefAbi from '../Contracts/ABIs/cherrychef.json';
import bxhChefAbi from '../Contracts/ABIs/bxhchef.json';
import { Contract } from "ethers";

export const CHERRYCHEF = "0x8cddB4CD757048C4380ae6A69Db8cD5597442f7b";
export const BXHCHEF = "0x006854D77b0710859Ba68b98d2c992ea2837c382";
const cherryPoolIds: PoolId = {
    "0x8E68C0216562BCEA5523b27ec6B9B6e1cCcBbf88": 1,
    "0x089dedbFD12F2aD990c55A2F1061b8Ad986bFF88": 2,
    "0x94E01843825eF85Ee183A711Fa7AE0C5701A731a": 4,
    "0x407F7a2F61E5bAB199F7b9de0Ca330527175Da93": 5, // Gone for now
    "0xF3098211d012fF5380A03D80f150Ac6E5753caA8": 3,
    "0xb6fCc8CE3389Aa239B2A5450283aE9ea5df9d1A9": 23, // Gone for now
  };
  
  const bxhPoolIds: PoolId = {
    "0x04b2C23Ca7e29B71fd17655eb9Bd79953fA79faF": 12,
    "0x3799Fb39b7fA01E23338C1C3d652FB1AB6E7D5BC": 9,
  };
  
export async function calculateCherryAPY( jar: JarDefinition, model: PickleModel) {
        const multicallProvider = model.multicallProviderFor(jar.chain);
        await multicallProvider.init();
        const poolId = cherryPoolIds[jar.depositToken.addr];
        const multicallCherrychef = new MulticallContract(CHERRYCHEF, cherryChefAbi);
        const lpToken = new MulticallContract(jar.depositToken.addr, erc20Abi);
        const [
            cherryPerBlockBN,
            totalAllocPointBN,
            poolInfo,
            bonusMultiplierBN,
            totalSupplyBN,
        ] = await multicallProvider.all([
            multicallCherrychef.cherryPerBlock(),
            multicallCherrychef.totalAllocPoint(),
            multicallCherrychef.poolInfo(poolId),
            multicallCherrychef.BONUS_MULTIPLIER(),
            lpToken.balanceOf(CHERRYCHEF),
        ]);
        const totalSupply = parseFloat(formatEther(totalSupplyBN));
        const rewardsPerBlock =
          (parseFloat(formatEther(cherryPerBlockBN)) *
            poolInfo.allocPoint.toNumber() *
            parseFloat(bonusMultiplierBN.toString())) /
          totalAllocPointBN.toNumber();
        const pricePerToken = await model.priceOf(jar.depositToken.addr);
        const rewardsPerYear = rewardsPerBlock * ((360 * 24 * 60 * 60) / Chains.get(jar.chain).secondsPerBlock);

      const valueRewardedPerYear = model.priceOfSync("cherry") * rewardsPerYear;

      const totalValueStaked = totalSupply * pricePerToken;
      const cherryAPY = valueRewardedPerYear / totalValueStaked;
      return cherryAPY * 100;
    }

export async function calculateBxhAPY(jar: JarDefinition, model: PickleModel) {
    const multicallProvider = model.multicallProviderFor(jar.chain);
    await multicallProvider.init();
    const poolId = bxhPoolIds[jar.depositToken.addr];
    const poolInfo = await (new Contract(BXHCHEF, bxhChefAbi, model.providerFor(jar.chain))).poolInfo(poolId);
    const lpToken = new Contract(jar.depositToken.addr, erc20Abi);

    const multicallBxhChef = new MulticallContract(BXHCHEF, bxhChefAbi);
    const [
        bxhPerBlockBN,
        totalAllocPointBN,
        totalSupplyBN,
      ] = await Promise.all([
        multicallBxhChef.rewardV(poolInfo.lastRewardBlock),
        multicallBxhChef.totalAllocPoint(),
        lpToken.balanceOf(BXHCHEF),
    ]);
    const totalSupply = parseFloat(formatEther(totalSupplyBN));
    const rewardsPerBlock =
      (parseFloat(formatEther(bxhPerBlockBN)) *
        poolInfo.allocPoint.toNumber()) /
      totalAllocPointBN.toNumber();

      const pricePerToken = await model.priceOf(jar.depositToken.addr);
      const rewardsPerYear =
        rewardsPerBlock * ((360 * 24 * 60 * 60) / Chains.get(jar.chain).secondsPerBlock);

      const valueRewardedPerYear = model.priceOfSync("bxh") * rewardsPerYear;

      const totalValueStaked = totalSupply * pricePerToken;
      const bxhAPY = valueRewardedPerYear / totalValueStaked;

    return bxhAPY * 100;
  };

