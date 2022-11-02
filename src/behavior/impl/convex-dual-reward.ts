import {
  AssetAprComponent,
  AssetProjectedApr,
  JarDefinition,
} from "../../model/PickleModelJson";
import { AbstractJarBehavior } from "../AbstractJarBehavior";
import { PickleModel } from "../../model/PickleModel";
import { getProjectedConvexAprStats } from "../../protocols/ConvexUtility";

export class ConvexDualReward extends AbstractJarBehavior {
  protected strategyAbi: any;

  constructor() {
    super();
    this.strategyAbi = twoRewardAbi;
  }

  async getLpApr(
    _definition: JarDefinition,
    _model: PickleModel,
  ): Promise<AssetAprComponent> {
    return this.createAprComponent("lp", 0, false);
  }

  async getProjectedAprStats(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    return this.aprComponentsToProjectedApr([
      await this.getLpApr(definition, model),
      ...(await getProjectedConvexAprStats(definition, model)),
    ]);
  }

  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    return this.getHarvestableUSDDefaultImplementation(
      jar,
      model,
      ["crv", "cvx"],
      this.strategyAbi,
    );
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
