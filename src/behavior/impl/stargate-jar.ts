import { Contract as MultiContract } from "ethers-multicall";
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
  [ChainNetwork.Ethereum]: {
    router: "0x8731d54E9D02c286767d56ac03e8037C07e01e98",
    farm: "0xB0D502E938ed5f4df2E681fE6E419ff29631d62b",
    poolId: {
      "0xdf0770dF86a8034b3EFEf0A1Bb3c889B8332FF56": 0,
      "0x38EA452219524Bb87e18dE1C24D3bB59510BD783": 1,
    },
  },
  [ChainNetwork.Optimism]: {
    router: "0xB0D502E938ed5f4df2E681fE6E419ff29631d62b",
    farm: "0x4a364f8c717cAAD9A442737Eb7b8A55cc6cf18D8",
    poolId: { "0xDecC0c09c3B5f6e92EF4184125D5648a66E35298": 0 },
  },
  [ChainNetwork.Arbitrum]: {
    router: "0x53Bf833A5d6c4ddA888F69c22C88C9f356a41614",
    farm: "0xeA8DfEE1898a7e0a59f7527F076106d7e44c2176",
    poolId: {
      "0x892785f33CdeE22A30AEF750F285E18c18040c3e": 0,
      "0xb6cfcf89a7b22988bfc96632ac2a9d6dab60d641": 1,
    },
  },
  [ChainNetwork.Polygon]: {
    router: "0x45A01E4e04F14f7A4a6702c74187c5F6222033cd",
    farm: "0x8731d54E9D02c286767d56ac03e8037C07e01e98",
    poolId: {
      "0x1205f31718499dBf1fCa446663B532Ef87481fe1": 0,
      "0x29e38769f23701A2e4A8Ef0492e19dA4604Be62c": 1,
    },
  },
  [ChainNetwork.Fantom]: {
    router: "0xAf5191B0De278C7286d6C7CC6ab6BB8A73bA2Cd6",
    farm: "0x224D8Fd7aB6AD4c6eb4611Ce56EF35Dec2277F03",
    poolId: {
      "0x12edeA9cd262006cC3C4E77c90d2CD2DD4b1eb97": 0,
    },
  },
};

export class StargateJar extends AbstractJarBehavior {
  protected strategyAbi: any;

  async getDepositTokenPrice(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    const strategy = new MultiContract(
      jar.details.strategyAddr,
      stargateStrategyAbi,
    );
    const pool = new MultiContract(jar.depositToken.addr, pool_abi);

    const [underlying, ratio] = await model.callMulti(
      [() => strategy.underlying(), () => pool.convertRate()],
      jar.chain,
    );
    const underlyingPrice = model.priceOfSync(underlying, jar.chain);

    return underlyingPrice * parseFloat(ratio);
  }

  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    return this.getHarvestableUSDCommsMgrImplementation(
      jar,
      model,
      ["stg"],
      stargateStrategyAbi,
    );
  }

  async getProjectedAprStats(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const pricePerToken = model.priceOfSync(jar.depositToken.addr, jar.chain);

    const starAddresses = starMapping[jar.chain];
    const starchefMC = new MultiContract(starAddresses.farm, starchefAbi);

    const lpToken = new MultiContract(jar.depositToken.addr, erc20Abi);

    const [stgPerSecBn, totalAllocPointBN, poolInfo, totalSupplyBN, decimals] =
      await model.callMulti(
        [
          () => starchefMC.stargatePerBlock(),
          () => starchefMC.totalAllocPoint(),
          () =>
            starchefMC.poolInfo(starAddresses.poolId[jar.depositToken.addr]),
          () => lpToken.balanceOf(starAddresses.farm),
          () => lpToken.decimals(),
        ],
        jar.chain,
      );

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
