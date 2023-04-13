import swapFlashLoanAbi from "../../Contracts/ABIs/swapflashloan.json";
import { saddleStrategyAbi } from "../../Contracts/ABIs/saddle-strategy.abi";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { PickleModel } from "../../model/PickleModel";
import { AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import { Contract } from "ethers-multiprovider";
import { formatEther } from "ethers/lib/utils";
import { ONE_YEAR_SECONDS } from "../JarBehaviorResolver";
import { getStableswapPriceAddress } from "../../price/DepositTokenPriceUtility";
import { utils } from "ethers";

const strategyABI = [
  "function getHarvestable() external returns (uint256)",
  "function gauge() external view returns (address)",
];

const gaugeAbi = [
  "function working_supply() view returns(uint256)",
  "function inflation_rate() view returns(uint256)",
  "function integrate_inv_supply(uint256) view returns(uint256)",
];

export class SaddleD4 extends AbstractJarBehavior {
  protected strategyAbi: any;

  constructor() {
    super();
    this.strategyAbi = saddleStrategyAbi;
  }

  async getDepositTokenPrice(
    asset: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    return getStableswapPriceAddress(
      "0xc69ddcd4dfef25d8a793241834d4cc4b3668ead6",
      asset,
      model,
    );
  }

  async getProjectedAprStats(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    return this.calculateSaddleD4APY(definition, model);
  }

  async calculateSaddleD4APY(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const swapFlashLoanAddress = "0xC69DDcd4DFeF25D8a793241834d4cc4b3668EAD6";
    const gaugeAddress = "0x702c1b8Ec3A77009D5898e18DA8F8959B6dF2093";
    const multiProvider = model.multiproviderFor(jar.chain);
    const gaugeContract = new Contract(gaugeAddress, gaugeAbi);
    const multicallSwapFlashLoan = new Contract(
      swapFlashLoanAddress,
      swapFlashLoanAbi,
    );

    const [workingSupply, virtualPrice, gaugeRate] = await multiProvider.all([
      gaugeContract.working_supply(),
      multicallSwapFlashLoan.getVirtualPrice(),
      gaugeContract.inflation_rate(),
    ]);

    const priceOfSaddle = parseFloat(formatEther(virtualPrice));
    const totalValueStaked =
      parseFloat(formatEther(workingSupply)) * priceOfSaddle;

    const yearlySdlReward = gaugeRate
      .mul(ONE_YEAR_SECONDS)
      .div(workingSupply)
      .mul(1600)
      .mul((model.priceOfSync("sdl", jar.chain) * 1e6).toFixed())
      .div((1e6).toString())
      .toNumber();

    return this.aprComponentsToProjectedApr([
      this.createAprComponent(
        "sdl",
        (yearlySdlReward * 100) / totalValueStaked,
        true,
      ),
    ]);
  }

  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    return this.getHarvestableUSDDefaultImplementationV2(jar, model, true);
  }
}
