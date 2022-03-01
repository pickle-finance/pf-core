import { Signer } from "ethers";
import fetch from "cross-fetch";
import { Provider } from "@ethersproject/providers";
import { Chains, PickleModel } from "../..";
import { JarDefinition, AssetProjectedApr } from "../../model/PickleModelJson";
import { multiSushiStrategyAbi } from "../../Contracts/ABIs/multi-sushi-strategy.abi";
import { AbstractJarBehavior } from "../AbstractJarBehavior";

export class NetswapJar extends AbstractJarBehavior {
  constructor() {
    super();
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
      ["nett", "metis"],
      multiSushiStrategyAbi,
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
    const components = [];
    if (poolStats && poolStats.length > 0 && poolStats[0]) {
      const nettApy = poolStats[0].nettApy || 0;
      const rewarderApy = poolStats[0].rewarderApy || 0;
      const retained = 1 - Chains.get(jar.chain).defaultPerformanceFee;
      components.push(
        this.createAprComponent("lp", poolStats[0]?.lpApy, false),
      );
      if (nettApy) {
        components.push(
          this.createAprComponent("nett", nettApy, true, retained),
        );
      }
      if (rewarderApy) {
        const rewarderToken =
          poolStats[0].rewarder?.rewardToken?.symbol || "Reward Token";
        components.push(
          this.createAprComponent(rewarderToken, rewarderApy, true, retained),
        );
      }
    }
    return this.aprComponentsToProjectedApr(components);
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
