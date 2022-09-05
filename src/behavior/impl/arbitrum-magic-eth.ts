import { BigNumber } from "ethers";
import { ChainNetwork, PickleModel } from "../..";
import { JarDefinition } from "../../model/PickleModelJson";
import { ArbitrumSushiJar } from "./arbitrum-sushi-jar";
import { Contract } from "ethers-multiprovider";
import erc20Abi from "../../Contracts/ABIs/erc20.json";

export class ArbitrumMagicEth extends ArbitrumSushiJar {
  constructor() {
    super("magic");
  }


  async getIsHarvestBlocked(
    jar: JarDefinition,
    model: PickleModel,
    harvestableUsd: number
  ): Promise<boolean> {
    const rewarder = "0x1a9c20e2b0aC11EBECbDCA626BBA566c4ce8e606";
    const magic = model.address("magic", ChainNetwork.Arbitrum);
    const magicDecimals = model.tokenDecimals("magic", ChainNetwork.Arbitrum);
    const magicPrice = model.priceOfSync("magic", ChainNetwork.Arbitrum);
    const expectedTokens = BigNumber.from(Math.floor((harvestableUsd / magicPrice) * 1e9)).mul(Math.pow(10, magicDecimals - 9));
    const multiProvider = model.multiproviderFor(jar.chain);
    const [tok] = await multiProvider.all([
      new Contract(magic, erc20Abi).balanceOf(rewarder),
    ]);
    const tokensInRewarder: BigNumber = tok;
    if( tokensInRewarder.lt(expectedTokens))
      return true;
    return false;
  };
}
