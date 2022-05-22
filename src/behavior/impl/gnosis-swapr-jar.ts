import {
  JarDefinition,
  AssetAprComponent,
  AssetProjectedApr,
} from "../../model/PickleModelJson";
import {
  createAprComponentImpl,
  AbstractJarBehavior,
} from "../AbstractJarBehavior";
import { Contract as MultiContract } from "ethers-multicall";
import { PickleModel } from "../../model/PickleModel";
import swaprRewarderAbi from "../../Contracts/ABIs/swapr-rewarder.json";
import { formatEther } from "ethers/lib/utils";
import { ONE_YEAR_IN_SECONDS } from "../../behavior/AbstractJarBehavior";
import { Chains } from "../../chain/Chains";

// Info for individual rewarder contracts
const swaprRewarders = {
  "0xD7b118271B1B7d26C9e044Fc927CA31DccB22a5a": {
    name: "GNO-XDAI",
    rewarder: "0x070386C4d038FE96ECC9D7fB722b3378Aace4863",
    rewards: ["swapr", "gno"],
  },
  "0x8028457E452D7221dB69B1e0563AA600A059fab1": {
    name: "COW-WETH",
    rewarder: "0xDa72E71f84DC15c80941D70494D6BD8a623DCBB4",
    rewards: ["swapr", "gno", "cow"],
  },
  "0x5fCA4cBdC182e40aeFBCb91AFBDE7AD8d3Dc18a8": {
    name: "GNO-WETH",
    rewarder: "0x40b37ba95f9BCf8930E6f8A65e5B4534518c3EAB",
    rewards: ["swapr", "gno"],
  },
  "0xf6Be7AD58F4BAA454666b0027839a01BcD721Ac3": {
    name: "BTC-WETH",
    rewarder: "0x60eC5c7Ddfe17203c706D7082224f67d0e005fcC",
    rewards: ["swapr", "gno"],
  },
  "0x558d777B24366f011E35A9f59114D1b45110d67B": {
    name: "DXD-GNO",
    rewarder: "0x6148399F63c3dfdDf33A77c63A87C54e597D80E5",
    rewards: ["swapr", "gno"],
  },
  "0x1865d5445010E0baf8Be2eB410d3Eae4A68683c2": {
    name: "XDAI-WETH",
    rewarder: "0xCB3aAba65599341B5beb24b6001611077c5979E6",
    rewards: ["swapr", "gno"],
  },
  "0xDBF14bce36F661B29F6c8318a1D8944650c73F38": {
    name: "COW-GNO",
    rewarder: "0x95DBc58bCBB3Bc866EdFFC107d65D479d83799E5",
    rewards: ["swapr", "gno", "cow"],
  },
};

export async function calculateGnosisSwaprAPY(
  jar: JarDefinition,
  model: PickleModel,
): Promise<AssetAprComponent[]> {
  const rewarder = swaprRewarders[jar.depositToken.addr].rewarder;
  const multicallRewarder = new MultiContract(rewarder, swaprRewarderAbi);

  const [rewardTokens, duration, totalSupplyBN] = await model.callMulti(
    [
      () => multicallRewarder.getRewardTokens(),
      () => multicallRewarder.secondsDuration(),
      () => multicallRewarder.totalStakedTokensAmount(),
    ],
    jar.chain,
  );

  const pricePerToken = model.priceOfSync(jar.depositToken.addr, jar.chain);
  const totalSupply = parseFloat(formatEther(totalSupplyBN));
  const totalValueStaked = totalSupply * pricePerToken;

  const rewardData = [];
  for (let i = 0; i < rewardTokens.length; i++) {
    rewardData.push(
      await model.callMulti(() => multicallRewarder.rewards(i), jar.chain),
    );
  }

  const rewardsReturn = [];
  for (let i = 0; i < rewardData.length; i++) {
    const rewardTokenAddress = rewardData[i][0];
    const rewardTokenName = swaprRewarders[jar.depositToken.addr].rewards[i];
    const price = model.priceOfSync(rewardTokenAddress, jar.chain);

    if (price) {
      const amountBN = rewardData[i][1];
      const amount = parseFloat(formatEther(amountBN));
      const rewardPerSecond = amount / duration;
      const rewardPerYear = rewardPerSecond * ONE_YEAR_IN_SECONDS;
      const valueRewardedPerYear =
        model.priceOfSync(rewardTokenName, jar.chain) * rewardPerYear;
      const rewardAPY = (valueRewardedPerYear / totalValueStaked) * 100;

      rewardsReturn.push(
        createAprComponentImpl(
          rewardTokenName,
          rewardAPY,
          true,
          1 - Chains.get(jar.chain).defaultPerformanceFee,
        ),
      );
    }
  }
  return rewardsReturn;
}

export abstract class GnosisSwaprJar extends AbstractJarBehavior {
  strategyAbi: any;
  constructor(strategyAbi: any) {
    super();
    this.strategyAbi = strategyAbi;
  }
  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    const rewarder = swaprRewarders[jar.depositToken.addr].rewarder;
    const multicallRewarder = new MultiContract(rewarder, swaprRewarderAbi);

    const harvestableReturn = await model.callMulti(
      () => multicallRewarder.claimableRewards(jar.contract),
      jar.chain,
    );

    return harvestableReturn.reduce((x, y) => x + y);
  }

  async getProjectedAprStats(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    return this.aprComponentsToProjectedApr(
      await calculateGnosisSwaprAPY(definition, model),
    );
  }
}
