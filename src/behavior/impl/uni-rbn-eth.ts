import { Provider } from "@ethersproject/abstract-provider";
import { Signer } from "@ethersproject/abstract-signer";
import { BigNumber, Contract } from "ethers";
import { JarHarvestStats, PickleModel } from "../..";
import { AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import {
  AprNamePair,
  calculateUniV3Apy,
  getUniV3Info,
  getUniV3TokenPairData,
  UniV3InfoValue,
} from "../../protocols/Univ3/UniV3";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import univ3StakerAbi from "../../Contracts/ABIs/univ3Staking.json";
import { oneEParam } from "../../util/BnUtil";
import erc20Abi from "../../Contracts/ABIs/erc20.json";

export class Uni3RbnEth extends AbstractJarBehavior {
  async getDepositTokenPrice(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    const test = await getUniV3TokenPairData(model, definition);

    // Let's override some lower-level data for univ3
    // Since the NFT is really unique, let's make our underlying
    // match us exactly.
    definition.depositToken.componentTokens[0] = test.depositedToken0;
    definition.depositToken.componentTokens[1] = test.depositedToken1;
    definition.depositToken.totalSupply = definition.details.tokenBalance;

    const pJarUSD =
      model.priceOfSync("rbn") * test.depositedToken0 +
      model.priceOfSync("weth") * test.depositedToken1;
    const perDepositToken = pJarUSD / definition.details.tokenBalance;
    return perDepositToken;
  }

  async getHarvestableUSD(
    _jar: JarDefinition,
    _model: PickleModel,
    _resolver: Signer | Provider,
  ): Promise<number> {
    // Do not implement.
    return 0;
  }
  async getAssetHarvestData(
    definition: JarDefinition,
    model: PickleModel,
    _balance: BigNumber,
    _available: BigNumber,
    resolver: Signer | Provider,
  ): Promise<JarHarvestStats> {
    // TODO  0x1f98407aab862cddef78ed252d6f557aa5b0f00d  is the reward staking contract
    const rewardStaking = new Contract(
      "0x1f98407aab862cddef78ed252d6f557aa5b0f00d",
      univ3StakerAbi,
      resolver,
    );
    const rbnAddr = "0x6123b0049f904d730db3c36a31167d9d4121fa6b";
    const val: UniV3InfoValue = getUniV3Info(definition.depositToken.addr);
    const result = await rewardStaking.getRewardInfo(
      val.incentiveKey,
      val.nftNumber,
    );
    const rewardTokens: BigNumber = result.reward;
    const decimals: number = model.tokenDecimals("rbn", definition.chain);
    const rbnPrice: number = model.priceOfSync("rbn");
    const harvestable =
      BigNumber.from((rbnPrice * 1e4).toFixed())
        .mul(rewardTokens)
        .div(oneEParam(decimals))
        .toNumber() / 1e4;

    // Earnable
    const wethContract = new Contract(
      model.address("weth", definition.chain),
      erc20Abi,
      resolver,
    );
    const rbnContract = new Contract(
      model.address("rbn", definition.chain),
      erc20Abi,
      resolver,
    );
    const [wethBal, rbnBal] = await Promise.all([
      wethContract.balanceOf(definition.contract),
      rbnContract.balanceOf(definition.contract),
    ]);
    const earnableWeth = wethBal
      .mul((model.priceOfSync("weth") * 100).toFixed())
      .div(100);
    const earnableRbn = rbnBal
      .mul((model.priceOfSync("rbn") * 1000).toFixed())
      .div(1000);

    return {
      balanceUSD:
        definition.details.tokenBalance * definition.depositToken.price,
      earnableUSD: earnableWeth.add(earnableRbn).toNumber(),
      harvestableUSD: harvestable,
    };
  }
  async getProjectedAprStats(
    jar: JarDefinition,
    _model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const ret: AprNamePair = await calculateUniV3Apy(
      jar.depositToken.addr,
      jar.chain,
    );
    return super.aprComponentsToProjectedApr([
      this.createAprComponent(ret.id, ret.apr, true),
    ]);
  }
}
