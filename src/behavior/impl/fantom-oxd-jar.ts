import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import { Chains, PickleModel } from "../..";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import { JarDefinition, AssetProjectedApr } from "../../model/PickleModelJson";
import strategyABI from "../../Contracts/ABIs/strategy.json";
import oxdFarmsAbi from "../../Contracts/ABIs/oxd-farm.json";
import {
  AbstractJarBehavior,
  ONE_YEAR_IN_SECONDS,
} from "../AbstractJarBehavior";
import { PoolId } from "../../protocols/ProtocolUtil";
import { formatEther } from "ethers/lib/utils";
import {
  Provider as MulticallProvider,
  Contract as MulticallContract,
} from "ethers-multicall";

const OXD_FARMS = "0xa7821C3e9fC1bF961e280510c471031120716c3d";

const poolIds: PoolId = {
  "0xD5fa400a24EB2EA55BC5Bd29c989E70fbC626FfF": 0, // 0XD-USDC
  "0xa48d959AE2E88f1dAA7D5F611E01908106dE7598": 7, // XBOO
  "0xe3D17C7e840ec140a7A51ACA351a482231760824": 8, // XSCREAM
  "0x10b620b2dbAC4Faa7D7FFD71Da486f5D44cd86f9": 9, // LQDR
  "0x74D1D2A851e339B8cB953716445Be7E8aBdf92F4": 10, // XTAROT
  "0xd9e28749e80D867d5d14217416BFf0e668C10645": 11, // XCREDIT
  "0x6c021Ae822BEa943b2E66552bDe1D2696a53fbB7": 12, // TOMB
  "0xc165d941481e68696f43EE6E99BFB2B23E0E3114": 14, // 0XD
};

export class OxdJar extends AbstractJarBehavior {
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
    resolver: Signer | Provider,
  ): Promise<number> {
    return this.getHarvestableUSDDefaultImplementation(
      jar,
      model,
      resolver,
      ["oxd"],
      this.strategyAbi,
    );
  }

  async getProjectedAprStats(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const pricePerToken = model.priceOfSync(jar.depositToken.addr, jar.chain);
    const multicallProvider = model.multicallProviderFor(jar.chain);
    await multicallProvider.init();
    const poolId = poolIds[jar.depositToken.addr];

    const multicallFarms = new MulticallContract(OXD_FARMS, oxdFarmsAbi);
    const lpToken = new MulticallContract(jar.depositToken.addr, erc20Abi);

    const [oxdPerSecondBN, totalAllocPointBN, poolInfo, totalSupplyBN] =
      await multicallProvider.all([
        multicallFarms.oxdPerSecond(),
        multicallFarms.totalAllocPoint(),
        multicallFarms.poolInfo(poolId),
        lpToken.balanceOf(OXD_FARMS),
      ]);
    const rewardsPerYear =
      (parseFloat(formatEther(oxdPerSecondBN)) *
        ONE_YEAR_IN_SECONDS *
        poolInfo.allocPoint.toNumber()) /
      totalAllocPointBN.toNumber();

    const totalSupply = parseFloat(formatEther(totalSupplyBN));
    const oxdRewardedPerYear = (model.priceOfSync("oxd", jar.chain)) * rewardsPerYear;
    const totalValueStaked = totalSupply * pricePerToken;
    const oxdAPY = oxdRewardedPerYear / totalValueStaked;

    return this.aprComponentsToProjectedApr([
      this.createAprComponent(
        "oxd",
        oxdAPY * 100,
        true,
        1 - Chains.get(jar.chain).defaultPerformanceFee,
      ),
    ]);
  }

  async getXTokenPrice(
    jar: JarDefinition,
    model: PickleModel,
    baseToken: string,
  ): Promise<number> {
    const multicallProvider: MulticallProvider = model.multicallProviderFor(
      jar.chain,
    );
    await multicallProvider.init();

    const baseTokenPrice = model.priceOfSync(baseToken, jar.chain);
    const baseTokenAddress = model.address(baseToken, jar.chain);

    const multicallxToken = new MulticallContract(
      jar.depositToken.addr,
      erc20Abi,
    );
    const multicallBaseToken = new MulticallContract(
      baseTokenAddress,
      erc20Abi,
    );

    const [xTokenSupplyBN, baseTokenBalanceBN] = await multicallProvider.all([
      multicallxToken.totalSupply(),
      multicallBaseToken.balanceOf(jar.depositToken.addr),
    ]);

    const ratioNum = parseFloat(
      formatEther(baseTokenBalanceBN.mul((1e18).toFixed()).div(xTokenSupplyBN)),
    );

    const xTokenPrice = baseTokenPrice * ratioNum;
    return xTokenPrice;
  }
}
