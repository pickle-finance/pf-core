import { BigNumber, ethers, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import { AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { PickleModel } from "../../model/PickleModel";
import { getProjectedConvexAprStats } from "../../protocols/ConvexUtility";
import { convexStrategyAbi } from "../../Contracts/ABIs/convex-strategy.abi";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import { getStableswapPriceAddress } from "../../price/DepositTokenPriceUtility";

export const lidoAddress = "0x5a98fcbea516cf06857215779fd812ca3bef1b32";

export class SteCrv extends AbstractJarBehavior {
  constructor() {
    super();
  }
  async getDepositTokenPrice(
    asset: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    return (
      (await getStableswapPriceAddress(
        "0xdc24316b9ae028f1497c275eb9192a3ea0f67022",
        asset,
        model,
      )) * model.priceOfSync("weth")
    );
  }

  async getProjectedAprStats(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    return this.aprComponentsToProjectedApr(
      await getProjectedConvexAprStats(definition, model),
    );
  }

  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
    resolver: Signer | Provider,
  ): Promise<number> {
    const crv = new ethers.Contract(
      model.address("crv", jar.chain),
      erc20Abi,
      resolver,
    );
    const lido = new ethers.Contract(lidoAddress, erc20Abi, resolver);
    const cvx = new ethers.Contract(
      model.address("cvx", jar.chain),
      erc20Abi,
      resolver,
    );
    const strategy = new ethers.Contract(
      jar.details.strategyAddr,
      convexStrategyAbi,
      resolver,
    );
    const [
      crvWallet,
      cvxWallet,
      ldoWallet,
      crvPrice,
      cvxPrice,
      ldoPrice,
      pending,
    ]: [BigNumber, BigNumber, BigNumber, number, number, number, BigNumber[]] =
      await Promise.all([
        crv
          .balanceOf(jar.details.strategyAddr)
          .catch(() => BigNumber.from("0")),
        cvx
          .balanceOf(jar.details.strategyAddr)
          .catch(() => BigNumber.from("0")),
        lido
          .balanceOf(jar.details.strategyAddr)
          .catch(() => BigNumber.from("0")),
        model.priceOfSync("crv"),
        model.priceOfSync("ldo"),
        model.priceOfSync("cvx"),
        strategy.getHarvestable(),
      ]);
    const harvestable = crvWallet
      .add(pending[0])
      .mul(crvPrice.toFixed())
      .add(
        cvxWallet
          .add(pending[1])
          .mul(cvxPrice.toFixed())
          .add(ldoWallet.add(pending[2]).mul(ldoPrice.toFixed())),
      );

    return parseFloat(ethers.utils.formatEther(harvestable));
  }
}
