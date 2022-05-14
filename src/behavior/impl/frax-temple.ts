import { AssetProjectedApr, JarDefinition } from "../../model/PickleModelJson";
import {
  AbstractJarBehavior,
  ONE_YEAR_IN_SECONDS,
} from "../AbstractJarBehavior";
import { PickleModel } from "../../model/PickleModel";
import { BigNumber } from "ethers";
import gaugeABI from "../../Contracts/ABIs/frax-gauge.json";
import { Contract as MultiContract } from "ethers-multicall";

const lockerAddress = "0xd639C2eA4eEFfAD39b599410d00252E6c80008DF";
const gaugeAddress = "0x10460d02226d6ef7B2419aE150E6377BdbB7Ef16";


export class FraxTemple extends AbstractJarBehavior {
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
  ): Promise<number> {
    const getHarvestableABI = [
      {
      inputs: [],
      name: "getHarvestable",
      outputs: [
        { internalType: "uint256", name: "", type: "uint256" },
        { internalType: "uint256", name: "", type: "uint256" },
      ],
      stateMutability: "nonpayable",
      type: "function",
      },
    ];
    return this.getHarvestableUSDCommsMgrImplementation(
      jar,
      model,
      ["fxs", "temple"],
      getHarvestableABI,
    );
  }

  async getProjectedAprStats(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const [templeAPY,fxsAPY] = await Promise.all([
      this.calculateTempleAPY(jar, model),
      this.calculateFXSAPY(jar, model),
      //calculateLPAPY(jar,model),
    ]);
    return this.aprComponentsToProjectedApr([
      this.createAprComponent("temple", parseFloat(templeAPY.toString()) / 100, true),
      this.createAprComponent("fxs", parseFloat(fxsAPY.toString()) / 100, true),
    ]);
  }

  //TODO WIP
  async calculateTempleAPY(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<number> {

    const gaugeContract = new MultiContract(gaugeAddress, gaugeABI);
    const [totalCombinedWeight, rewardRate, multiplier] = await model.callMulti(
      [
        () => gaugeContract.totalCombinedWeight(),
        () => gaugeContract.rewardRates(1),
        () => gaugeContract.veFXSMultiplier(lockerAddress),
      ],
      definition.chain,
    );

    const fxsValuePerYearBN = rewardRate
      .mul(
        BigNumber.from(
          (model.priceOfSync("temple", definition.chain) * 1e6).toFixed(),
        ),
      )
      .mul(ONE_YEAR_IN_SECONDS.toFixed())
      .div((1e18).toFixed())
      .div((1e6).toFixed());

    const numerator = multiplier
      .add((1e18).toString())
      .mul(fxsValuePerYearBN)
      .mul((1e10).toFixed());

    const denominator = totalCombinedWeight.mul(
      (definition.depositToken.price * 1e6).toFixed(),
    );

    return numerator.div(denominator);
  }

  async calculateFXSAPY(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<number> {

    const gaugeContract = new MultiContract(gaugeAddress, gaugeABI);
    const [totalCombinedWeight, rewardRate, multiplier] = await model.callMulti(
      [
        () => gaugeContract.totalCombinedWeight(),
        () => gaugeContract.rewardRates(0),
        () => gaugeContract.veFXSMultiplier(lockerAddress),
      ],
      definition.chain,
    );

    const fxsValuePerYearBN = rewardRate
      .mul(
        BigNumber.from(
          (model.priceOfSync("fxs", definition.chain) * 1e6).toFixed(),
        ),
      )
      .mul(ONE_YEAR_IN_SECONDS.toFixed())
      .div((1e18).toFixed())
      .div((1e6).toFixed());

    const numerator = multiplier
      .add((1e18).toString())
      .mul(fxsValuePerYearBN)
      .mul((1e10).toFixed());

    const denominator = totalCombinedWeight.mul(
      (definition.depositToken.price * 1e6).toFixed(),
    );

    return numerator.div(denominator);
  }
}
