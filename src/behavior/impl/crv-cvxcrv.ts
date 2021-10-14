import { BigNumber, ethers, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import { AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { PickleModel } from "../../model/PickleModel";
import { getProjectedConvexAprStats } from "../../protocols/ConvexUtility";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import { getStableswapPriceAddress } from "../../price/DepositTokenPriceUtility";

export class CurveCvxCrv extends AbstractJarBehavior {
  constructor() {
    super();
  }
  async getDepositTokenPrice(
    asset: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    const r =
      (await getStableswapPriceAddress(
        "0x9D0464996170c6B9e75eED71c68B99dDEDf279e8",
        asset,
        model,
      )) * model.priceOfSync("cvxcrv");
    return r;
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
    const cvx = new ethers.Contract(
      model.address("cvx", jar.chain),
      erc20Abi,
      resolver,
    );
    const strategy = new ethers.Contract(
      jar.details.strategyAddr,
      twoRewardAbi,
      resolver,
    );
    const [crvWallet, cvxWallet, crvPrice, cvxPrice, pending]: [
      BigNumber,
      BigNumber,
      number,
      number,
      BigNumber[],
    ] = await Promise.all([
      crv.balanceOf(jar.details.strategyAddr).catch(() => BigNumber.from("0")),
      cvx.balanceOf(jar.details.strategyAddr).catch(() => BigNumber.from("0")),
      model.priceOfSync("crv"),
      model.priceOfSync("cvx"),
      strategy.getHarvestable(),
    ]);
    const harvestable = crvWallet
      .add(pending[0])
      .mul(crvPrice.toFixed())
      .add(cvxWallet.add(pending[1]).mul(cvxPrice.toFixed()));

    return parseFloat(ethers.utils.formatEther(harvestable));
  }
}

const twoRewardAbi: any = [
  {
    inputs: [],
    name: "getHarvestable",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
