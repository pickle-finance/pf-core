import { ethers } from "ethers";
import { ChainNetwork, PickleModel } from "../..";
import {
  JarDefinition,
  AssetProjectedApr,
  AssetAprComponent,
} from "../../model/PickleModelJson";
import { CurveJar, getCurveRawStats } from "./curve-jar";
import { formatEther } from "ethers/lib/utils";
import erc20Abi from "../../Contracts/ABIs/erc20.json";
import { calculateCurveApyArbitrum } from "../../protocols/CurveUtil";
import { Contract as MultiContract } from "ethers-multicall";

export class CrvTricrypto extends CurveJar {
  constructor() {
    super("0x97E2768e8E73511cA874545DC5Ff8067eB19B787");
  }

  async getDepositTokenPrice(
    definition: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    const curvePoolAbi = [
      {
        name: "balances",
        outputs: [{ type: "uint256", name: "" }],
        inputs: [{ type: "uint256", name: "arg0" }],
        stateMutability: "view",
        type: "function",
        gas: "2310",
      },
      {
        name: "get_virtual_price",
        outputs: [{ type: "uint256", name: "" }],
        inputs: [],
        stateMutability: "view",
        type: "function",
      },
    ];
    const triPool = "0x960ea3e3C7FB317332d990873d354E18d7645590";
    const triTokenAddress = "0x8e0b8c8bb9db49a46697f3a5bb8a308e744821d2";
    const pool = new MultiContract(triPool, curvePoolAbi);
    const triToken = new MultiContract(triTokenAddress, erc20Abi);

    const [balance0, balance1, balance2, supply, virtualPrice] =
      await model.callMulti(
        [
          () => pool.balances(0),
          () => pool.balances(1),
          () => pool.balances(2),
          () => triToken.totalSupply(),
          () => pool.get_virtual_price(),
        ],
        definition.chain,
      );

    const wbtcPrice = model.priceOfSync("wbtc", definition.chain);
    const ethPrice = model.priceOfSync("weth", definition.chain);

    const scaledBalance0 = balance0 / 1e6;
    const scaledBalance1 = (balance1 / 1e8) * wbtcPrice;
    const scaledBalance2 = (balance2 / 1e18) * ethPrice;
    const totalStakedUsd =
      (scaledBalance0 + scaledBalance1 + scaledBalance2) *
      +formatEther(virtualPrice);
    const price = totalStakedUsd / +formatEther(supply);
    return price;
  }

  async getHarvestableUSD(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<number> {
    // changed stateMutability to view to allow calling the function as constant
    const curveThirdPartyGaugeAbi = [
      {
        stateMutability: "view",
        type: "function",
        name: "claimable_reward_write",
        inputs: [
          { name: "_addr", type: "address" },
          { name: "_token", type: "address" },
        ],
        outputs: [{ name: "", type: "uint256" }],
        // gas: "2067577",
      },
    ];

    const gauge = new MultiContract(this.gaugeAddress, curveThirdPartyGaugeAbi);
    const crv = await model.callMulti(
      () =>
        gauge.claimable_reward_write(
          jar.details.strategyAddr,
          model.address("crv", ChainNetwork.Arbitrum),
        ),
      jar.chain,
    );
    const crvPrice = model.priceOfSync("curve-dao-token", jar.chain);
    const harvestable = crv.mul(crvPrice.toFixed());
    return parseFloat(ethers.utils.formatEther(harvestable));
  }

  async getProjectedAprStats(
    jar: JarDefinition,
    model: PickleModel,
  ): Promise<AssetProjectedApr> {
    const apr = await calculateCurveApyArbitrum(
      jar,
      model,
      "0x960ea3e3C7FB317332d990873d354E18d7645590",
      "0x97E2768e8E73511cA874545DC5Ff8067eB19B787",
      ["usdt", "wbtc", "weth"],
    );
    const crvApy = this.createAprComponent("crv", apr, true);
    const curveRawStats: any = await getCurveRawStats(model, jar.chain);
    const lp: AssetAprComponent = this.createAprComponent(
      "lp",
      curveRawStats?.tricrypto ? curveRawStats.tricrypto : 0,
      false,
    );
    return this.aprComponentsToProjectedApr([lp, crvApy]);
  }
}
