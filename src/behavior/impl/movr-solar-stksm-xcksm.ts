import { PickleModel } from "../../model/PickleModel";
import { JarDefinition } from "../../model/PickleModelJson";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import { sushiStrategyAbi } from "../../Contracts/ABIs/sushi-strategy.abi";
import { Contract } from "ethers-multiprovider";
import { MoonriverSolarJar } from "./moonriver-solar-jar";
import { ExternalTokenModelSingleton } from "../../price/ExternalTokenModel";
import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils";

const POOL = "0x77d4b212770a7ca26ee70b1e0f27fc36da191c53";

export class SolarStksmXcksm extends MoonriverSolarJar {
  strategyAbi: any;
  constructor() {
    super(sushiStrategyAbi);
  }
  async getDepositTokenPrice(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    const multiProvider = model.multiproviderFor(definition.chain);
    const stksmMc = new Contract(
      ExternalTokenModelSingleton.getToken(
        "stksm",
        definition.chain,
      ).contractAddr,
      erc20Abi,
    );

    const xcksmMc = new Contract(
      ExternalTokenModelSingleton.getToken(
        "xcksm",
        definition.chain,
      ).contractAddr,
      erc20Abi,
    );

    const lpTokenMc = new Contract(definition.depositToken.addr, erc20Abi);

    const [stSupply, xcSupply, totalSupply] = await multiProvider.all([
      stksmMc.balanceOf(POOL),
      xcksmMc.balanceOf(POOL),
      lpTokenMc.totalSupply(),
    ]);

    const pricePerToken = stSupply
      .add(xcSupply)
      .mul(
        BigNumber.from(
          (model.priceOfSync("stksm", definition.chain) * 1e6).toFixed(),
        ),
      )
      .mul((1e18).toFixed())
      .mul((1e6).toFixed()) // Because wrapped KSM tokens are 12 decimals
      .div(totalSupply)
      .div((1e6).toFixed());

    return parseFloat(formatEther(pricePerToken));
  }
}
