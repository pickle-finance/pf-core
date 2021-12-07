import { BigNumber, ethers, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import { PickleModel } from "../..";
import { JarDefinition, AssetProjectedApr } from "../../model/PickleModelJson";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import strategyABI from "../../Contracts/ABIs/strategy.json"
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { formatEther } from "ethers/lib/utils";
import { getLivePairDataFromContracts } from "../../protocols/GenericSwapUtil";
import { ONE_YEAR_SECONDS } from "../JarBehaviorResolver";

export class ArbitrumDodoUsdc extends AbstractJarBehavior {
  constructor() {
    super();
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
    const strategy = new ethers.Contract(
      jar.details.strategyAddr,
      strategyABI,
      resolver,
    );
    const dodoToken = new ethers.Contract(
      model.address("dodo", jar.chain),
      erc20Abi,
      resolver,
    );
    const [res, dodoWallet, dodoPrice]: [
      BigNumber,
      BigNumber,
      number,
    ] = await Promise.all([
      strategy.getHarvestable().catch(() => BigNumber.from("0")),
      dodoToken
        .balanceOf(jar.details.strategyAddr)
        .catch(() => BigNumber.from("0")),
      model.priceOfSync("dodo"),
    ]);

    const harvestable = res.add(dodoWallet).mul(dodoPrice.toFixed());
    
    return parseFloat(ethers.utils.formatEther(harvestable));
  }

  async getProjectedAprStats(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const rewards = "0x38Dbb42C4972116c88E27edFacD2451cf1b14255"; // DODO-USDC
    const DODO_PER_BLOCK = 0.51321;

    const lpToken = new ethers.Contract(
      jar.depositToken.addr,
      erc20Abi,
      model.providerFor(jar.chain),
    );
    const totalSupplyBN = await lpToken.balanceOf(rewards);
    const totalSupply = +formatEther(totalSupplyBN);
    const { pricePerToken } = await getLivePairDataFromContracts(
      jar,
      model,
      18,
    );
    const dodoValueRewardedPerYear =
      ((await model.priceOf("dodo")) * DODO_PER_BLOCK * ONE_YEAR_SECONDS) /
      13.3;

    const totalValueStaked = totalSupply * pricePerToken;
    const dodoApy = dodoValueRewardedPerYear / totalValueStaked;

    return this.aprComponentsToProjectedApr([
      this.createAprComponent("dodo", dodoApy * 100, true),
    ]);
  }
}
