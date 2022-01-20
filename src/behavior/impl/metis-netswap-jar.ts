import { Signer } from "ethers";
import fetch from "cross-fetch";
import { Provider } from "@ethersproject/providers";
import { Chains, PickleModel } from "../..";
import { JarDefinition, AssetProjectedApr } from "../../model/PickleModelJson";
import strategyABI from "../../Contracts/ABIs/strategy.json";
import { AbstractJarBehavior } from "../AbstractJarBehavior";

export class NetswapJar extends AbstractJarBehavior {
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
      ["nett"],
      this.strategyAbi,
    );
  }

  async getProjectedAprStats(
    jar: JarDefinition,
    _model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const resp = await fetch(NETSWAP_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    const json = await resp.json();

    const poolStats = json.data.farmPools.filter(
      (x) => x.pair.id.toLowerCase() === jar.depositToken.addr.toLowerCase(),
    );

    return this.aprComponentsToProjectedApr([
      this.createAprComponent("lp", poolStats[0]?.lpApy, false),
      this.createAprComponent("nett", poolStats[0]?.nettApy, true, 1-Chains.get(jar.chain).defaultPerformanceFee),
    ]);
  }
}

const NETSWAP_URL = "https://api.netswap.io/microservice/api/graphql";

const query = `query {
    farmPools(skip: 0, limit: 100) {
      id
      allocPoint
      pair {
        id
        token0 {
          address
          decimals
          symbol
          name
          __typename
        }
        token1 {
          address
          decimals
          symbol
          name
          __typename
        }
        totalSupply
        reserveUSD
        __typename
      }
      lpApy
      rewarderApy
      nettApy
      totalDepositVolumeUSD
      rewarder {
        id
        endTimestamp
        rewardToken {
          address
          decimals
          symbol
          name
          __typename
        }
        tokenPerSec
        __typename
      }
      nettPerSec
      __typename
    }
  }`;
