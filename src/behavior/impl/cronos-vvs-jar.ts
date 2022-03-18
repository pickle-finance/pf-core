import { BigNumber, ethers, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import {
  AssetAprComponent,
  AssetProjectedApr,
  JarDefinition,
} from "../../model/PickleModelJson";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { PickleModel } from "../../model/PickleModel";
import {
  calculateVvsFarmsAPY,
  vvsPoolIdsV2,
  VvsswapPairManager,
  VVS_FARMS_V2,
} from "../../protocols/VvsUtil";
import { vvsPoolIds, VVS_FARMS } from "../../protocols/VvsUtil";
import { Contract as MulticallContract } from "ethers-multicall";
import { ExternalTokenModelSingleton } from "../../price/ExternalTokenModel";
import erc20Abi from "../../Contracts/ABIs/erc20.json";

export abstract class CronosVvsJar extends AbstractJarBehavior {
  strategyAbi: any;
  constructor(strategyAbi: any) {
    super();
    this.strategyAbi = strategyAbi;
  }
  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
    resolver: Signer | Provider,
  ): Promise<number> {
    const isDualRewards = Number.isInteger(vvsPoolIdsV2[jar.depositToken.addr]);
    if (!isDualRewards) {
      return this.getHarvestableUSDMasterchefImplementation(
        jar,
        model,
        resolver,
        ["vvs"],
        VVS_FARMS,
        "pendingVVS",
        vvsPoolIds[jar.depositToken.addr],
      );
    } else {
      const chefAbi = [
        {
          type: "function",
          stateMutability: "view",
          outputs: [
            { type: "address[]", name: "", internalType: "address[]" },
            { type: "uint256[]", name: "", internalType: "uint256[]" },
          ],
          name: "pendingTokens",
          inputs: [
            { type: "uint256", name: "_pid", internalType: "uint256" },
            { type: "address", name: "_user", internalType: "address" },
          ],
        },
      ];
      const chefContract = new MulticallContract(VVS_FARMS_V2, chefAbi);
      const multiProvider = model.multicallProviderFor(jar.chain);
      const [[rewardsAddresses, pendingRewardsAmounts]]: [
        [string[], BigNumber[]],
      ] = await multiProvider.all([
        chefContract.pendingTokens(
          vvsPoolIdsV2[jar.depositToken.addr],
          jar.details.strategyAddr,
        ),
      ]);
      const rewardTokens = rewardsAddresses.map((x: string) =>
        ExternalTokenModelSingleton.getToken(x, jar.chain),
      );
      const rewardsValues = pendingRewardsAmounts.map((x, idx) => {
        const amount = parseFloat(
          ethers.utils.formatUnits(x, rewardTokens[idx].decimals),
        );
        return amount * rewardTokens[idx].price;
      });
      const rewardContracts: MulticallContract[] = rewardsAddresses.map(
        (x) => new MulticallContract(model.address(x, jar.chain), erc20Abi),
      );
      const strategyBalances = await multiProvider
        .all(rewardContracts.map((x) => x.balanceOf(jar.details.strategyAddr)))
        .then((x) =>
          x.map(
            (y, idx) =>
              parseFloat(
                ethers.utils.formatUnits(y, rewardTokens[idx].decimals),
              ) * rewardTokens[idx].price,
          ),
        );
      const totalStratsBalances = strategyBalances.reduce(
        (curr, acc) => (acc += curr),
        0,
      );
      const totalPending = rewardsValues.reduce(
        (curr, acc) => (acc += curr),
        0,
      );
      return totalPending + totalStratsBalances;
    }
  }

  async getProjectedAprStats(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const chefComponents: AssetAprComponent[] = await calculateVvsFarmsAPY(
      definition,
      model,
    );

    const lpApr: number = await new VvsswapPairManager().calculateLpApr(
      model,
      definition.depositToken.addr,
    );
    return this.aprComponentsToProjectedApr([
      this.createAprComponent("lp", lpApr, false),
      ...chefComponents.map((chefComponent) =>
        this.createAprComponent(
          chefComponent.name,
          chefComponent.apr,
          chefComponent.compoundable,
          0.9,
        ),
      ),
    ]);
  }
}
