import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import { Provider as MulticallProvider, Contract as MulticallContract } from "ethers-multicall";
import { Chains, PickleModel } from "../..";
import { JarDefinition, AssetProjectedApr } from "../../model/PickleModelJson";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import mcdodoAbi from "../../Contracts/ABIs/mcdodo-rewards.json";
import { multiSushiStrategyAbi } from "../../Contracts/ABIs/multi-sushi-strategy.abi";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { formatEther } from "ethers/lib/utils";
import { ONE_YEAR_SECONDS } from "../JarBehaviorResolver";

export class ArbitrumHndEth extends AbstractJarBehavior {
  protected strategyAbi: any;
  
  constructor() {
    super();
    this.strategyAbi = multiSushiStrategyAbi;
  }

  async getDepositTokenPrice(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    return super.getDepositTokenPrice(definition, model);
  }

  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
    resolver: Signer | Provider,
  ): Promise<number> {
    return this.getHarvestableUSDDefaultImplementation(jar, model, resolver, 
      ["hnd","dodo"], this.strategyAbi);
  }

  async getProjectedAprStats(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const multicallProvider : MulticallProvider = model.multicallProviderFor(jar.chain);
    const rewardsAddr = "0x06633cd8E46C3048621A517D6bb5f0A84b4919c6"; // HND-ETH
    const mcDodoRewards = new MulticallContract(rewardsAddr, mcdodoAbi);
    
    const lpToken = new MulticallContract(jar.depositToken.addr, erc20Abi);
    const [ hndInfo, dodoInfo, totalSupplyBN ] = await multicallProvider.all([
      mcDodoRewards.rewardTokenInfos(0),
      mcDodoRewards.rewardTokenInfos(1),
      lpToken.balanceOf(rewardsAddr),
    ]);

    const HND_PER_BLOCK = +formatEther(hndInfo.rewardPerBlock);
    const DODO_PER_BLOCK = +formatEther(dodoInfo.rewardPerBlock);
    const totalSupply = +formatEther(totalSupplyBN);
    const pricePerToken = model.priceOfSync(jar.depositToken.addr);

    const blocksPerYear = ONE_YEAR_SECONDS / Chains.get(jar.chain).secondsPerBlock;
    const hndValueRewardedPerYear =
      (model.priceOfSync("hnd")) * HND_PER_BLOCK * blocksPerYear;
    const dodoValueRewardedPerYear =
      (model.priceOfSync("dodo")) * DODO_PER_BLOCK * blocksPerYear;

    const totalValueStaked = totalSupply * pricePerToken;
    const hndAPY = hndValueRewardedPerYear / totalValueStaked;
    const dodoApy = dodoValueRewardedPerYear / totalValueStaked;

    return this.aprComponentsToProjectedApr([
      this.createAprComponent("hnd", hndAPY * 100, true),
      this.createAprComponent("dodo", dodoApy * 100, true),
    ]);
  }
}
