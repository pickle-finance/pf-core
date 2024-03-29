import { ethers } from "ethers";
import { AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import {
  AbstractJarBehavior,
  createAprComponentImpl,
} from "../AbstractJarBehavior";
import AaveStrategyAbi from "../../Contracts/ABIs/aave-strategy.json";
import TonictrollerAbi from "../../Contracts/ABIs/tonictroller.json";
import { PickleModel } from "../../model/PickleModel";
import { Contract } from "ethers-multiprovider";
import { ChainNetwork, Chains } from "../../chain/Chains";
import { formatEther, parseEther } from "ethers/lib/utils";
import { ONE_YEAR_SECONDS } from "../JarBehaviorResolver";

const CTOKEN_MAPPING = {
  "0xe44Fd7fCb2b1581822D0c862B68222998a0c299a":
    "0x543F4Db9BD26C9Eb6aD4DD1C33522c966C625774",
  "0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23":
    "0xeAdf7c01DA7E93FdB5f16B0aa9ee85f978e89E95",
};

const COMPTROLLER = "0xb3831584acb95ED9cCb0C11f677B5AD01DeaeEc0";

export class TectonicJar extends AbstractJarBehavior {
  async getDepositTokenPrice(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    return super.getDepositTokenPrice(definition, model);
  }
  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    return this.getHarvestableUSDDefaultImplementation(
      jar,
      model,
      ["tonic"],
      AaveStrategyAbi,
    );
  }

  async getProjectedAprStats(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const pricePerToken = model.priceOfSync(jar.depositToken.addr, jar.chain);
    const multiProvider = model.multiproviderFor(jar.chain);

    const blockNum = await multiProvider.getBlockNumber();

    const ctokenAddress = CTOKEN_MAPPING[jar.depositToken.addr];
    const CTokenAbi = [
      {
        inputs: [],
        name: "borrowIndex",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "totalBorrows",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "supplyRatePerBlock",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "borrowRatePerBlock",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "exchangeRateStored",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "totalSupply",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
    ];

    const multicallCToken = new Contract(ctokenAddress, CTokenAbi);

    const mutlicallComptroller = new Contract(COMPTROLLER, TonictrollerAbi);

    const multicallStrategy = new Contract(
      jar.details.strategyAddr,
      AaveStrategyAbi,
    );

    const [
      supplyState,
      supplySpeed,
      exchangeRate,
      supplyTokens,
      borrowState,
      borrowSpeed,
      supplied,
      principal,
      marketBorrowIndex,
      totalBorrows,
      newSupplyRate,
      newBorrowRate,
    ] = await multiProvider.all([
      mutlicallComptroller.tonicSupplyState(ctokenAddress),
      mutlicallComptroller.tonicSpeeds(ctokenAddress),
      multicallCToken.exchangeRateStored(),
      multicallCToken.totalSupply(),
      mutlicallComptroller.tonicBorrowState(ctokenAddress),
      mutlicallComptroller.tonicSpeeds(ctokenAddress),
      multicallStrategy.getSuppliedView(),
      multicallStrategy.balanceOf(),
      multicallCToken.borrowIndex(),
      multicallCToken.totalBorrows(),
      multicallCToken.supplyRatePerBlock(),
      multicallCToken.borrowRatePerBlock(),
    ]);

    const tonicSupplyAPY = getSupplyAPY({
      supplyState,
      supplySpeed,
      exchangeRate,
      supplyTokens,
      blockNum,
      model,
      pricePerToken,
    });

    const tonicBorrowAPY = getBorrowAPY({
      borrowState,
      marketBorrowIndex,
      totalBorrows,
      borrowSpeed,
      blockNum,
      model,
      pricePerToken,
    });
    const secondsPerBlock = await Chains.getAccurateSecondsPerBlock(jar.chain, model);

    const supplyRate =
      (parseFloat(formatEther(newSupplyRate)) / secondsPerBlock) *
      ONE_YEAR_SECONDS;

    const borrowRate =
      (parseFloat(formatEther(newBorrowRate)) / secondsPerBlock) *
      ONE_YEAR_SECONDS;

    const fee = 1 - Chains.get(jar.chain).defaultPerformanceFee;

    const multiplier = +formatEther(supplied) / +formatEther(principal);
    return this.aprComponentsToProjectedApr([
      createAprComponentImpl(
        "tonic (supply)",
        tonicSupplyAPY * multiplier,
        true,
        fee,
      ),
      createAprComponentImpl(
        "tonic (borrow)",
        tonicBorrowAPY * multiplier,
        true,
        fee,
      ),
      createAprComponentImpl(
        "borrow",
        -borrowRate * 100 * multiplier,
        false,
        fee,
      ),
      createAprComponentImpl(
        "supply",
        supplyRate * 100 * multiplier,
        false,
        fee,
      ),
    ]);
  }
}

const getSupplyAPY = ({
  supplyState,
  supplySpeed,
  exchangeRate,
  supplyTokens,
  blockNum,
  model,
  pricePerToken,
}: {
  supplyState: [ethers.BigNumber, number];
  supplySpeed: ethers.BigNumber;
  exchangeRate: ethers.BigNumber;
  supplyTokens: ethers.BigNumber;
  blockNum: number;
  model: PickleModel;
  pricePerToken: number;
}): number => {
  const EXP_SCALE = ethers.utils.parseUnits("1", 18);

  // https://github.com/compound-finance/compound-protocol/blob/master/contracts/Comptroller.sol#L1194
  // Supply
  const supplyTokensUnderlying = supplyTokens.mul(exchangeRate).div(EXP_SCALE);

  const supplyStateBlock = supplyState[1];
  const deltaBlocks = ethers.BigNumber.from(blockNum - supplyStateBlock);

  const tonicAccrued = deltaBlocks.mul(supplySpeed);

  const timeAccrued = deltaBlocks.mul(ethers.BigNumber.from(6));

  if (timeAccrued.gt(ethers.constants.Zero)) {
    const tonicSupplyApyBN = tonicAccrued
      .mul(parseEther("1"))
      .div(supplyTokensUnderlying)
      .div(timeAccrued)
      .mul(ethers.BigNumber.from(60 * 60 * 24 * 365));

    const newtonicSupplyApy =
      (parseFloat(formatEther(tonicSupplyApyBN)) *
        model.priceOfSync("tonic", ChainNetwork.Cronos) *
        100) /
      pricePerToken;

    return newtonicSupplyApy;
  }
};

const getBorrowAPY = ({
  borrowState,
  marketBorrowIndex,
  totalBorrows,
  borrowSpeed,
  blockNum,
  model,
  pricePerToken,
}: {
  borrowState: [ethers.BigNumber, number];
  marketBorrowIndex: ethers.BigNumber;
  totalBorrows: ethers.BigNumber;
  borrowSpeed: ethers.BigNumber;
  blockNum: number;
  model: PickleModel;
  pricePerToken: number;
}): number => {
  const EXP_SCALE = ethers.utils.parseUnits("1", 18);

  // https://github.com/compound-finance/compound-protocol/blob/master/contracts/Comptroller.sol#L1217
  // Borrow
  const borrowStateBlock = borrowState[1];
  const deltaBlocks = ethers.BigNumber.from(blockNum - borrowStateBlock);

  const borrowAmount = totalBorrows.mul(EXP_SCALE).div(marketBorrowIndex);

  const compAccrued = deltaBlocks.mul(borrowSpeed);

  // Assume 13 seconds per block
  const timeAccrued = deltaBlocks.mul(ethers.BigNumber.from(6));

  if (timeAccrued.gt(ethers.constants.Zero)) {
    const compBorrowApyBN = compAccrued
      .mul(parseEther("1"))
      .div(borrowAmount)
      .div(timeAccrued)
      .mul(ethers.BigNumber.from(60 * 60 * 24 * 365));

    const newCompBorrowApy =
      (parseFloat(formatEther(compBorrowApyBN)) *
        model.priceOfSync("tonic", ChainNetwork.Cronos) *
        100) /
      pricePerToken;

    return newCompBorrowApy;
  }
};
