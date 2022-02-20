import { Contract, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import { Chains, PickleModel } from "../..";
import { JarDefinition, AssetProjectedApr } from "../../model/PickleModelJson";
import strategyABI from "../../Contracts/ABIs/strategy.json";
import lqdrFarmsAbi from "../../Contracts/ABIs/lqdr-farm.json";
import lqdrStrategyAbi from "../../Contracts/ABIs/lqdr-strategy.json";
import lqdrRewarderAbi from "../../Contracts/ABIs/lqdr-strategy-rewarder.json";
import {
  AbstractJarBehavior,
  ONE_YEAR_IN_SECONDS,
} from "../AbstractJarBehavior";
import { PoolId } from "../../protocols/ProtocolUtil";
import { formatEther, formatUnits } from "ethers/lib/utils";
import { Contract as MulticallContract } from "ethers-multicall";
import { ExternalTokenModelSingleton } from "../../price/ExternalTokenModel";

const LQDR_FARMS = "0x6e2ad6527901c9664f016466b8DA1357a004db0f";

const poolIds: PoolId = {
  "0xf84E313B36E86315af7a06ff26C8b20e9EB443C3": 13, // BOO SUSHI-FTM
  "0x4Fe6f19031239F105F753D1DF8A0d24857D0cAA2": 0, // SPIRIT LQDR-FTM
  "0x613BF4E46b4817015c01c6Bb31C7ae9edAadc26e": 6, // SPIRIT ETH-FTM
  "0xe7E90f5a767406efF87Fdad7EB07ef407922EC1D": 5, // SPIRIT USDC-FTM
  "0x30748322B6E34545DBe0788C421886AEB5297789": 28, // SPIRIT SPIRIT-FTM
  "0x9C775D3D66167685B2A3F4567B548567D2875350": 35, // SPIRIT PILLS-FTM
  "0xB32b31DfAfbD53E310390F641C7119b5B9Ea0488": 7, // SPIRIT MIM-FTM
  "0x7ed0cdDB9BB6c6dfEa6fB63E117c8305479B8D7D": 33, // SPIRIT FRAX-FTM
  "0x2599Eba5fD1e49F294C76D034557948034d6C96E": 37, // SPIRIT DEUS-FTM
  "0x8eFD36aA4Afa9F4E157bec759F1744A7FeBaEA0e": 36, // SPIRIT DEI-USDC
};

const rewarderTotalAlloc = {
  "0x90De614815C1e550213974C2f004C5e56C4a4be0": 300, // DEUS rewarder (pools:36,37)
  "0x1d028122deEfcfB859426F3B957DdF82459A7C2A": 100, // PILLS rewarder (pool:35)
  // "0xC8F0C688568193bf2A40d7831D306c550423450d": 9999, // SPIRIT rewarder (pool:0)
};

const rewardTokens = ["lqdr", "deus"];

export class LqdrJar extends AbstractJarBehavior {
  protected strategyAbi: any;

  constructor() {
    super();
    this.strategyAbi = strategyABI;
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
    return this.getHarvestableUSDDefaultImplementation(
      jar,
      model,
      resolver,
      ["lqdr"],
      this.strategyAbi,
    );
  }

  async getProjectedAprStats(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const pricePerToken = await model.priceOf(jar.depositToken.addr);
    const multicallProvider = model.multicallProviderFor(jar.chain);
    await multicallProvider.init();
    const poolId = poolIds[jar.depositToken.addr];

    const multicallFarms = new MulticallContract(LQDR_FARMS, lqdrFarmsAbi);
    const [lqdrStrategyAddress, rewarderAddress] = await multicallProvider.all([
      multicallFarms.strategies(poolId),
      multicallFarms.rewarder(poolId),
    ]);
    const lqdrStrategyContract = new MulticallContract(
      lqdrStrategyAddress,
      lqdrStrategyAbi,
    );

    const [lqdrPerBlockBN, totalAllocPointBN, poolInfo, totalSupplyBN] =
      await multicallProvider.all([
        multicallFarms.lqdrPerBlock(),
        multicallFarms.totalAllocPoint(),
        multicallFarms.poolInfo(poolId),
        lqdrStrategyContract.balanceOfPool(),
      ]);
    const lqdrPerYear =
      (parseFloat(formatEther(lqdrPerBlockBN)) *
        ONE_YEAR_IN_SECONDS *
        poolInfo.allocPoint.toNumber()) /
      totalAllocPointBN.toNumber();

    const totalSupply = parseFloat(formatEther(totalSupplyBN));
    const lqdrValuePerYear = (await model.priceOf("lqdr")) * lqdrPerYear;
    const totalValueStaked = totalSupply * pricePerToken;
    const lqdrAPY = lqdrValuePerYear / totalValueStaked;

    const aprComponents = [
      this.createAprComponent(
        "lqdr",
        lqdrAPY * 100,
        true,
        1 - Chains.get(jar.chain).defaultPerformanceFee,
      ),
    ];
    
    if (Object.keys(rewarderTotalAlloc).includes(rewarderAddress)/* rewarderAddress != "0x0000000000000000000000000000000000000000" */) {
      const multicallRewarder = new MulticallContract(
        rewarderAddress,
        lqdrRewarderAbi,
      );
      const [rewardTokenAddr, tokenPerBlockBN, rewardPoolInfo] =
        await multicallProvider.all([
          multicallRewarder.rewardToken(),
          multicallRewarder.tokenPerBlock(),
          multicallRewarder.poolInfo(poolId),
        ]);
      const rewardToken = ExternalTokenModelSingleton.getToken(
        rewardTokenAddr,
        jar.chain,
      );
      const rewardTotalAlloc = rewarderTotalAlloc[rewarderAddress];
      const rewardsPerYear =
        (parseFloat(formatUnits(tokenPerBlockBN, rewardToken.decimals)) *
          ONE_YEAR_IN_SECONDS *
          rewardPoolInfo.allocPoint.toNumber()) /
        rewardTotalAlloc;
      const rewardValuePerYear =
        (await model.priceOf(rewardTokenAddr)) * rewardsPerYear;
      const rewardAPY = rewardValuePerYear / totalValueStaked;
      const rewardAprComponent = this.createAprComponent(
        rewardToken.id,
        rewardAPY * 100,
        true,
        1 - Chains.get(jar.chain).defaultPerformanceFee,
      );
      aprComponents.push(rewardAprComponent);
    }

    return this.aprComponentsToProjectedApr(aprComponents);
  }
}
