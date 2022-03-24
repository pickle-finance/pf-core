import { Contract, Signer } from "ethers";
import { Contract as MulticallContract } from "ethers-multicall";
import { Provider } from "@ethersproject/providers";
import { PickleModel } from "../..";
import { JarDefinition, AssetProjectedApr } from "../../model/PickleModelJson";
import stargateStrategyAbi from "../../Contracts/ABIs/stargate-strategy.json";
import starchefAbi from "../../Contracts/ABIs/starchef.json";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import {
  AbstractJarBehavior,
  ONE_YEAR_IN_SECONDS,
} from "../AbstractJarBehavior";
import { ChainNetwork, Chains } from "../../chain/Chains";
import { formatEther, formatUnits } from "ethers/lib/utils";

const pool_abi = ["function convertRate() view returns(uint256)"];

type AddressMapping = {
  [key in ChainNetwork]?: {
    router: string;
    farm: string;
    poolId: { [key: string]: number };
  };
};

const starMapping: AddressMapping = {
  [ChainNetwork.Optimism]: {
    router: "0xB0D502E938ed5f4df2E681fE6E419ff29631d62b",
    farm: "0x4a364f8c717cAAD9A442737Eb7b8A55cc6cf18D8",
    poolId: { "0xDecC0c09c3B5f6e92EF4184125D5648a66E35298": 0 },
  },
  [ChainNetwork.Polygon]: {
    router: "0x45A01E4e04F14f7A4a6702c74187c5F6222033cd",
    farm: "0x000000000000000000000", // TODO....
    poolId: { "0x000000000000000000000": 1 },
  },
};

export class StargateJar extends AbstractJarBehavior {
  protected strategyAbi: any;

  async getDepositTokenPrice(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    const provider = model.providerFor(jar.chain);
    const strategy = new Contract(
      jar.details.strategyAddr,
      stargateStrategyAbi,
      provider,
    );
    const underlying = await strategy.underlying();
    const underlyingPrice = model.priceOfSync(underlying, jar.chain);

    const pool = new Contract(jar.depositToken.addr, pool_abi, provider);
    const ratio = await pool.convertRate();
    return underlyingPrice * parseFloat(ratio);
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
      ["stg"],
      stargateStrategyAbi,
    );
  }

  async getProjectedAprStats(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const pricePerToken = model.priceOfSync(jar.depositToken.addr, jar.chain);

    const multicallProvider = model.multicallProviderFor(jar.chain);
    await multicallProvider.init();

    const starAddresses = starMapping[jar.chain];
    const starchefMC = new MulticallContract(starAddresses.farm, starchefAbi);

    const lpToken = new MulticallContract(jar.depositToken.addr, erc20Abi);

    const [stgPerSecBn, totalAllocPointBN, poolInfo, totalSupplyBN, decimals] =
      await multicallProvider.all([
        starchefMC.stargatePerBlock(),
        starchefMC.totalAllocPoint(),
        starchefMC.poolInfo(starAddresses.poolId[jar.depositToken.addr]),
        lpToken.balanceOf(starAddresses.farm),
        lpToken.decimals(),
      ]);

    const rewardsPerYear =
      (parseFloat(formatEther(stgPerSecBn)) *
        poolInfo.allocPoint.toNumber() *
        ONE_YEAR_IN_SECONDS) /
      (totalAllocPointBN.toNumber() * Chains.get(jar.chain).secondsPerBlock);
    const totalSupply = parseFloat(formatUnits(totalSupplyBN, decimals));

    const stgRewardedPerYear =
      model.priceOfSync("stg", jar.chain) * rewardsPerYear;
    const totalValueStaked = totalSupply * pricePerToken;
    const stgApy = stgRewardedPerYear / totalValueStaked;

    return this.aprComponentsToProjectedApr([
      this.createAprComponent(
        "stg",
        stgApy * 100,
        true,
        1 - Chains.get(jar.chain).defaultPerformanceFee,
      ),
    ]);
  }
}
