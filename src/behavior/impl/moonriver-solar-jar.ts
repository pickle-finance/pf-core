import {
  AssetAprComponent,
  AssetProjectedApr,
  JarDefinition,
} from "../../model/PickleModelJson";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { PickleModel } from "../../model/PickleModel";
import {
  calculateSolarFarmsAPY,
  SolarbeamPairManager,
  SOLAR_FARMS,
  SOLAR_V2_FARMS,
  SOLAR_V3_FARMS,
} from "../../protocols/SolarUtil";
import solarV2Abi from "../../Contracts/ABIs/solarv2-farms.json";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import { Contract } from "ethers-multiprovider";
import { BigNumber, ethers } from "ethers";
import { ExternalTokenModelSingleton } from "../../price/ExternalTokenModel";
import { Chains } from "../..";

export abstract class MoonriverSolarJar extends AbstractJarBehavior {
  strategyAbi: any;
  constructor(strategyAbi: any) {
    super();
    this.strategyAbi = strategyAbi;
  }

  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    const stratAbi = [
      {
        inputs: [],
        name: "solarChef",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "poolId",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
    ];
    const multiProvider = model.multiproviderFor(jar.chain);
    const strategyContract = new Contract(jar.details.strategyAddr, stratAbi);
    const [chefAddress, poolId] = await multiProvider.all([
      strategyContract.solarChef(),
      strategyContract.poolId(),
    ]);
    switch (chefAddress) {
      case SOLAR_FARMS:
        return this.getHarvestableUSDMasterchefImplementation(
          jar,
          model,
          ["solar"],
          SOLAR_FARMS,
          "pendingSolar",
          poolId.toNumber(),
        );

      case SOLAR_V2_FARMS:
      case SOLAR_V3_FARMS:
        return this.getHarvestableUSDV2Chef(
          jar,
          model,
          chefAddress,
          poolId.toNumber(),
        );

      default:
        model.logError(
          `getHarvestableUSD [${jar.details.apiKey}]`,
          `Strategy solarChef address unknown [${chefAddress}]`,
        );
        break;
    }
  }

  // required because the strategy's getHarvestable is broken for multi-rewards jars.
  async getHarvestableUSDV2Chef(
    jar: JarDefinition,
    model: PickleModel,
    chefAddress: string,
    poolId: number,
  ): Promise<number> {
    const multiProvider = model.multiproviderFor(jar.chain);
    const chefContract = new Contract(chefAddress, solarV2Abi);
    const [rewardTokens] = await multiProvider.all([
      chefContract.pendingTokens(poolId, jar.details.strategyAddr),
    ]);

    const pendingHarvests: {
      [address: string]: {
        address: string;
        id: string;
        value: number;
        decimals: number;
        price: number;
      };
    } = {};
    rewardTokens.addresses.forEach((address, idx) => {
      const amount = parseFloat(
        ethers.utils.formatUnits(
          rewardTokens.amounts[idx],
          rewardTokens.decimals[idx],
        ),
      );
      const price = model.priceOfSync(address, jar.chain);
      const rewardValueUSD = amount * price;
      let tokenId: string;
      try {
        tokenId = ExternalTokenModelSingleton.getToken(address, jar.chain).id;
      } catch (error) {
        model.logError(
          `getHarvestableUSD [${jar.details.apiKey}]`,
          error,
          `
          Token: ${rewardTokens.symbols[idx]}, Address: ${address}, is not known to PF-Core.
          Consider adding it to ExternalTokenModel
          `,
        );
        return; // ignore this reward token
      }

      /*
        eth-movr pool pendingTokens list has duplicate WMOVR,
        we don't want the strategy balance queried twice for those duplicates.
      */
      pendingHarvests[address]
        ? (pendingHarvests[address].value += rewardValueUSD)
        : (pendingHarvests[address] = {
            address: address,
            id: tokenId,
            value: rewardValueUSD,
            decimals: rewardTokens.decimals[idx],
            price: price,
          });
    });

    const rewardTokensAddresses = Object.keys(pendingHarvests);
    const stratBalancesBN: BigNumber[] = await multiProvider.all(
      rewardTokensAddresses.map((address) =>
        new Contract(address, erc20Abi).balanceOf(jar.details.strategyAddr),
      ),
    );

    const stratBalances = stratBalancesBN.map((bal, idx) => {
      const balance = parseFloat(
        ethers.utils.formatUnits(
          bal,
          pendingHarvests[rewardTokensAddresses[idx]].decimals,
        ),
      );
      const balanceUSD =
        balance * pendingHarvests[rewardTokensAddresses[idx]].price;
      return balanceUSD;
    });

    let runningTotal = 0;
    rewardTokensAddresses.forEach(
      (addr) => (runningTotal += pendingHarvests[addr].value),
    );
    stratBalances.forEach((bal) => (runningTotal += bal));

    return runningTotal;
  }

  async getProjectedAprStats(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const chefComponent: AssetAprComponent[] = await calculateSolarFarmsAPY(
      definition,
      model,
    );

    const lpApr: number = await new SolarbeamPairManager().calculateLpApr(
      model,
      definition.depositToken.addr,
    );
    return this.aprComponentsToProjectedApr([
      this.createAprComponent("lp", lpApr, false),
      ...chefComponent.map((x) =>
        this.createAprComponent(
          x.name,
          x.apr,
          x.compoundable,
          1 - Chains.get(definition.chain).defaultPerformanceFee,
        ),
      ),
    ]);
  }
}
