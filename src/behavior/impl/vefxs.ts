import { Provider } from "@ethersproject/abstract-provider";
import { Signer } from "@ethersproject/abstract-signer";
import { BigNumber } from "@ethersproject/bignumber";
import { PickleModel } from "../..";
import {
  JarDefinition,
  AssetProjectedApr,
  HistoricalYield,
  BrineryDefinition,
} from "../../model/PickleModelJson";
import {
  BrineryBehavior,
  ICustomHarvester,
  JarHarvestStats,
} from "../JarBehaviorResolver";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import { formatEther } from "ethers/lib/utils";
import { Contract } from "ethers-multiprovider";

const DISTRUBTOR_ABI = [
  "function getYieldForDuration() view returns(uint256)",
  "function earned(address) view returns(uint256)",
  "function eligibleCurrentVeFXS(address) view returns(uint256)",
];
const VEFXS_ABI = [
  "function totalSupply() view returns(uint256)",
  "function balanceOf(address) view returns(uint256)",
];

export class PveFxsAsset implements BrineryBehavior {
  getProtocolApy(
    _definition: BrineryDefinition,
    _model: PickleModel,
  ): Promise<HistoricalYield> {
    return undefined;
  }
  getCustomHarvester(
    _definition: BrineryDefinition,
    _model: PickleModel,
    _signer: Signer,
    _properties: any,
  ): ICustomHarvester {
    return undefined;
  }

  getAssetHarvestData(
    _definition: BrineryDefinition,
    _model: PickleModel,
    _balance: BigNumber,
    _available: BigNumber,
  ): Promise<JarHarvestStats | undefined> {
    return undefined;
  }

  async getProjectedAprStats(
    definition: BrineryDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    // Contract instantiation
    const multiProvider = model.multiproviderFor(definition.chain);
    const feeDistributor = new Contract(
      definition.details.distributionAddr,
      DISTRUBTOR_ABI,
    );

    const veFxs = new Contract(definition.details.veAddr, VEFXS_ABI);
    const pveFxs = new Contract(definition.contract, erc20Abi);

    const fxsPrice = model.priceOfSync("fxs", definition.chain);

    const [
      weeklyFxs,
      feeDistributorTotalFXS,
      feeDistributorEarnedFxs,
      veFxsTotalSupply,
      pickleVeBalance,
      pickleLockedFxs,
    ] = (
      await multiProvider.all([
        feeDistributor.getYieldForDuration(),
        feeDistributor.eligibleCurrentVeFXS(definition.details.lockerAddr),
        feeDistributor.earned(definition.details.lockerAddr),
        veFxs.totalSupply(),
        veFxs.balanceOf(definition.details.lockerAddr),
        pveFxs.totalSupply(),
      ])
    ).map((x: BigNumber) => parseFloat(formatEther(x)));

    // Set definition properties
    definition.details.weeklyRewards = weeklyFxs * fxsPrice;
    definition.details.totalVeSupply = veFxsTotalSupply;
    definition.details.pickleLockedUnderlying = pickleLockedFxs;
    definition.details.pickleVeBalance = pickleVeBalance;
    definition.details.distributorPending = feeDistributorEarnedFxs;

    // Set harvest data
    definition.details.harvestStats = {
      balanceUSD: pickleLockedFxs * fxsPrice,
      earnableUSD: 0,
      harvestableUSD: feeDistributorEarnedFxs * fxsPrice, // Used to calculate user entitlements
    };

    // Base APR calc
    // 1 FXS = 4 veFXS when locked for 4 years
    const fxsPerVEFXS = (weeklyFxs / veFxsTotalSupply) * 52 * fxsPrice;
    const earnedDollarsPerYear = feeDistributorTotalFXS * fxsPerVEFXS;
    const fxsApr = earnedDollarsPerYear / (pickleLockedFxs * fxsPrice);

    const flywheelProfits = this.getFlywheelProfits(definition, model);
    const flywheelApr = flywheelProfits / (pickleLockedFxs * fxsPrice);

    const total = (fxsApr + flywheelApr) * 100;

    return {
      components: [
        { name: "fxs", apr: fxsApr * 100, compoundable: false },
        {
          name: "flywheel",
          apr: flywheelApr * 100,
          compoundable: false,
        },
      ],
      apr: total,
      apy: total,
    };
  }

  async getDepositTokenPrice(
    definition: BrineryDefinition,
    model: PickleModel,
  ): Promise<number> {
    if (definition && definition.depositToken && definition.depositToken.addr) {
      return model.priceOfSync(definition.depositToken.addr, definition.chain);
    }
    return undefined;
  }

  getFlywheelProfits = (
    definition: BrineryDefinition,
    model: PickleModel,
  ): number => {
    const fraxJars = model.getJars().filter(
      (x) =>
        x.chain === definition.chain &&
        x.details?.apiKey.includes("UNIV3-FRAX"), // To improve by including tag in Frax Jar definition
    );
    const flywheelProfits = fraxJars.reduce((acc, currJar: JarDefinition) => {
      const annualizedRevenueToVault =
        (((currJar.aprStats?.apr || 0) * 0.1) / 0.8) *
        (currJar.details.harvestStats?.balanceUSD || 0) *
        0.01;
      return acc + annualizedRevenueToVault;
    }, 0);
    return flywheelProfits;
  };
}
