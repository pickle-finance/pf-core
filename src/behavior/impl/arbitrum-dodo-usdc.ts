import { PickleModel } from "../..";
import { JarDefinition, AssetProjectedApr } from "../../model/PickleModelJson";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import strategyABI from "../../Contracts/ABIs/strategy.json";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { formatEther } from "ethers/lib/utils";
import { getLivePairDataFromContracts } from "../../protocols/GenericSwapUtil";
import { ONE_YEAR_SECONDS } from "../JarBehaviorResolver";
import { Contract as MultiContract } from "ethers-multicall";

export class ArbitrumDodoUsdc extends AbstractJarBehavior {
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
  ): Promise<number> {
    return this.getHarvestableUSDComManImplementation(
      jar,
      model,
      ["dodo"],
      this.strategyAbi,
    );
  }

  async getProjectedAprStats(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const rewards = "0x38Dbb42C4972116c88E27edFacD2451cf1b14255"; // DODO-USDC
    const DODO_PER_BLOCK = 0.51321;

    const lpToken = new MultiContract(jar.depositToken.addr, erc20Abi);
    const totalSupplyBN = await model.callMulti(
      () => lpToken.balanceOf(rewards),
      jar.chain,
    );
    const totalSupply = +formatEther(totalSupplyBN);
    const { pricePerToken } = await getLivePairDataFromContracts(
      jar,
      model,
      18,
    );
    const dodoValueRewardedPerYear =
      (model.priceOfSync("dodo", jar.chain) *
        DODO_PER_BLOCK *
        ONE_YEAR_SECONDS) /
      13.3;

    const totalValueStaked = totalSupply * pricePerToken;
    const dodoApy = dodoValueRewardedPerYear / totalValueStaked;

    return this.aprComponentsToProjectedApr([
      this.createAprComponent("dodo", dodoApy * 100, true),
    ]);
  }
}
