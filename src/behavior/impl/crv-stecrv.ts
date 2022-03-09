import { AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { PickleModel } from "../../model/PickleModel";
import { getProjectedConvexAprStats } from "../../protocols/ConvexUtility";
import { convexStrategyAbi } from "../../Contracts/ABIs/convex-strategy.abi";
import { getStableswapPriceAddress } from "../../price/DepositTokenPriceUtility";

export const lidoAddress = "0x5a98fcbea516cf06857215779fd812ca3bef1b32";

export class SteCrv extends AbstractJarBehavior {
  protected strategyAbi: any;

  constructor() {
    super();
    this.strategyAbi = convexStrategyAbi;
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
      )) * model.priceOfSync("weth", asset.chain)
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
  ): Promise<number> {
    const abi = [
      {
        inputs: [],
        name: "getHarvestable",
        outputs: [
          { internalType: "uint256", name: "", type: "uint256" },
          { internalType: "uint256", name: "", type: "uint256" },
          { internalType: "uint256", name: "", type: "uint256" },
          { internalType: "uint256", name: "", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
      },
    ];
    return this.getHarvestableUSDComManImplementation(
      jar,
      model,
      ["crv", "cvx", "ldo"],
      abi,
    );
  }
}
