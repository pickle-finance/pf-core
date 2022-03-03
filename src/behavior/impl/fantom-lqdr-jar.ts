import { Contract, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import { Chains, PickleModel } from "../..";
import {
  JarDefinition,
  AssetProjectedApr,
  AssetProtocol,
} from "../../model/PickleModelJson";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import strategyAbi from "../../Contracts/ABIs/strategy.json";
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
import { SpookyPairManager } from "../../protocols/SpookyUtil";
import { SpiritPairManager } from "../../protocols/SpiritUtil";

const LQDR_FARMS = "0x6e2ad6527901c9664f016466b8DA1357a004db0f";

const poolIds: PoolId = {
  "0xEc7178F4C41f346b2721907F5cF7628E388A7a58": 10, // BOO BOO-FTM
  "0x2b4C76d0dc16BE1C31D4C1DC53bF9B45987Fc75c": 11, // BOO USDC-FTM
  "0xe120ffBDA0d14f3Bb6d6053E90E63c572A66a428": 12, // BOO DAI-FTM
  "0xf84E313B36E86315af7a06ff26C8b20e9EB443C3": 13, // BOO SUSHI-FTM
  "0x89d9bC2F2d091CfBFc31e333D6Dc555dDBc2fd29": 14, // BOO LINK-FTM
  "0xf0702249F4D3A25cD3DED7859a165693685Ab577": 15, // BOO ETH-FTM
  "0x5965E53aa80a0bcF1CD6dbDd72e6A9b2AA047410": 16, // BOO USDT-FTM
  "0x6f86e65b255c9111109d2D2325ca2dFc82456efc": 17, // BOO MIM-FTM
  "0x4Fe6f19031239F105F753D1DF8A0d24857D0cAA2": 0, // SPIRIT LQDR-FTM
  "0xe7E90f5a767406efF87Fdad7EB07ef407922EC1D": 5, // SPIRIT USDC-FTM
  "0x613BF4E46b4817015c01c6Bb31C7ae9edAadc26e": 6, // SPIRIT ETH-FTM
  "0xB32b31DfAfbD53E310390F641C7119b5B9Ea0488": 7, // SPIRIT MIM-FTM
  "0x30748322B6E34545DBe0788C421886AEB5297789": 28, // SPIRIT SPIRIT-FTM
  "0x7ed0cdDB9BB6c6dfEa6fB63E117c8305479B8D7D": 33, // SPIRIT FRAX-FTM
  "0x9C775D3D66167685B2A3F4567B548567D2875350": 35, // SPIRIT PILLS-FTM
  "0x2599Eba5fD1e49F294C76D034557948034d6C96E": 37, // SPIRIT DEUS-FTM
  "0x8eFD36aA4Afa9F4E157bec759F1744A7FeBaEA0e": 36, // SPIRIT DEI-USDC
};

const rewarderTotalAlloc = {
  "0x90De614815C1e550213974C2f004C5e56C4a4be0": 300, // DEUS rewarder (pools:36,37)
  "0x1d028122deEfcfB859426F3B957DdF82459A7C2A": 100, // PILLS rewarder (pool:35)
};

export class LqdrJar extends AbstractJarBehavior {
  protected strategyAbi: any;
  protected rewarderAddr: string;
  protected multicallRewarder: MulticallContract;

  constructor() {
    super();
    this.strategyAbi = strategyAbi;
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
    let runningTotal = await this.getHarvestableUSDDefaultImplementation(
      jar,
      model,
      resolver,
      ["lqdr"],
      this.strategyAbi,
    );

    if (await this.rewarderContractExist(jar, model)) {
      const poolId = poolIds[jar.depositToken.addr];
      const multicallProvider = model.multicallProviderFor(jar.chain);
      const [rewardTokenAddr, pendingTokenBN] = await multicallProvider.all([
        this.multicallRewarder.rewardToken(),
        this.multicallRewarder.pendingToken(poolId, jar.details.strategyAddr),
      ]);
      const rewardTokenContract = new Contract(
        rewardTokenAddr,
        erc20Abi,
        model.providerFor(jar.chain),
      );
      const strategyBalanceBN = await rewardTokenContract.balanceOf(
        jar.details.strategyAddr,
      );
      const rewardToken = ExternalTokenModelSingleton.getToken(
        rewardTokenAddr,
        jar.chain,
      );
      const rewardTokenPrice = model.priceOfSync(rewardToken.id, jar.chain);
      const pendingTokenValue =
        parseFloat(formatUnits(pendingTokenBN, rewardToken.decimals)) *
        rewardTokenPrice;
      const strategyBalanceValue =
        parseFloat(formatUnits(strategyBalanceBN, rewardToken.decimals)) *
        rewardTokenPrice;

      runningTotal += pendingTokenValue + strategyBalanceValue;
    }

    return runningTotal;
  }

  async getProjectedAprStats(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const pricePerToken = model.priceOfSync(jar.depositToken.addr, jar.chain);
    const multicallProvider = model.multicallProviderFor(jar.chain);
    await multicallProvider.init();
    const poolId = poolIds[jar.depositToken.addr];

    const multicallFarms = new MulticallContract(LQDR_FARMS, lqdrFarmsAbi);
    const [lqdrStrategyAddress, rewarderAddress] = await multicallProvider.all([
      multicallFarms.strategies(poolId),
      multicallFarms.rewarder(poolId),
    ]);
    this.rewarderAddr = rewarderAddress;
    const lqdrStrategyContract = new MulticallContract(
      lqdrStrategyAddress,
      lqdrStrategyAbi,
    );

    const [lqdrPerBlockBN, totalAllocPointBN, poolInfo, totalStakedBN] =
      await multicallProvider.all([
        multicallFarms.lqdrPerBlock(),
        multicallFarms.totalAllocPoint(),
        multicallFarms.poolInfo(poolId),
        lqdrStrategyContract.balanceOfPool(),
      ]);
    const blocksPerYear =
      ONE_YEAR_IN_SECONDS / Chains.get(jar.chain).secondsPerBlock;
    const lqdrPerYear =
      (parseFloat(formatEther(lqdrPerBlockBN)) *
        blocksPerYear *
        poolInfo.allocPoint.toNumber()) /
      totalAllocPointBN.toNumber();

    const totalSupply = parseFloat(formatEther(totalStakedBN));
    const lqdrValuePerYear = model.priceOfSync("lqdr", jar.chain) * lqdrPerYear;
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

    if (await this.rewarderContractExist(jar, model)) {
      const [rewardTokenAddr, tokenPerBlockBN, rewardPoolInfo] =
        await multicallProvider.all([
          this.multicallRewarder.rewardToken(),
          this.multicallRewarder.tokenPerBlock(),
          this.multicallRewarder.poolInfo(poolId),
        ]);
      const rewardToken = ExternalTokenModelSingleton.getToken(
        rewardTokenAddr,
        jar.chain,
      );
      const rewardTotalAlloc = rewarderTotalAlloc[rewarderAddress];
      const rewardsPerYear =
        (parseFloat(formatUnits(tokenPerBlockBN, rewardToken.decimals)) *
          blocksPerYear *
          rewardPoolInfo.allocPoint.toNumber()) /
        rewardTotalAlloc;
      const rewardValuePerYear =
        model.priceOfSync(rewardTokenAddr, jar.chain) * rewardsPerYear;
      const rewardAPY = rewardValuePerYear / totalValueStaked;
      const rewardAprComponent = this.createAprComponent(
        rewardToken.id,
        rewardAPY * 100,
        true,
        1 - Chains.get(jar.chain).defaultPerformanceFee,
      );
      aprComponents.push(rewardAprComponent);
    }

    const lp =
      jar.protocol === AssetProtocol.SPOOKYSWAP
        ? await new SpookyPairManager().calculateLpApr(
            model,
            jar.depositToken.addr,
          )
        : jar.protocol === AssetProtocol.SPIRITSWAP
        ? await new SpiritPairManager().calculateLpApr(
            model,
            jar.depositToken.addr,
          )
        : 0;
    aprComponents.push(this.createAprComponent("lp", lp, false));

    return this.aprComponentsToProjectedApr(aprComponents);
  }

  async rewarderContractExist(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<boolean> {
    if (!this.rewarderAddr) {
      const poolId = poolIds[jar.depositToken.addr];
      const provider = model.providerFor(jar.chain);
      const farms = new Contract(LQDR_FARMS, lqdrFarmsAbi, provider);
      const rewarderAddress = await farms.rewarder(poolId);
      this.rewarderAddr = rewarderAddress;
    }
    if (
      !this.multicallRewarder &&
      Object.keys(rewarderTotalAlloc).includes(this.rewarderAddr)
    ) {
      this.multicallRewarder = new MulticallContract(
        this.rewarderAddr,
        lqdrRewarderAbi,
      );
    }

    if (this.multicallRewarder) return true;
    return false;
  }
}
