import fs from "fs";
import fetch from "cross-fetch";
import {
  PickleModelJson,
  JarDefinition,
  ExternalAssetDefinition,
  StandaloneFarmDefinition,
} from "./model/PickleModelJson";
import { ADDRESSES } from "./model/PickleModel";
import { ethers } from "ethers";
import { Provider } from "@ethersproject/providers";
import MinichefAbi from "./Contracts/ABIs/minichef.json";
import MasterchefAbi from "./Contracts/ABIs/masterchef.json";
import erc20abi from "./Contracts/ABIs/erc20.json";
import { Chains } from ".";
import { ChainNetwork } from ".";
import {
  Contract as MulticallContract,
  Provider as MulticallProvider,
  setMulticallAddress,
} from "ethers-multicall";

const apiURL = "https://api.pickle.finance/prod/protocol/pfcore";

interface JarDefinition1 extends JarDefinition {
  chefPID?: string;
}

interface AssetDefinition {
  jars: JarDefinition1[];
  standaloneFarms: StandaloneFarmDefinition[];
  external: ExternalAssetDefinition[];
}

interface AllocPoints {
  name: string,
  lpToken: string,
  allocPoints: string,
  totalAllocPoints: string
}

const getPfcoreApiData = async () => {
  try {
    const promise = await fetch(apiURL);
    const resp = await promise.json();
    return resp;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const pickleEthInfo = (assets: AssetDefinition): string => {
  const url: string = Chains.get(ChainNetwork.Ethereum).explorer + "/address/";
  const addresses = ADDRESSES.get(ChainNetwork.Ethereum);
  const body =
    `\n` +
    `## Pickle.finance Contracts (Ethereum)\n\n` +
    `PickleToken: [${addresses.pickle}](${url + addresses.pickle}))\n\n` +
    `Timelock (48 hours): [0xc2d82a3e2bae0a50f4aeb438285804354b467bc0](${url}0xc2d82a3e2bae0a50f4aeb438285804354b467bc0)\n\n` +
    `Timelock (24 hours): [0x0040E05CE9A5fc9C0aBF89889f7b60c2fC278416](${url}0x0040E05CE9A5fc9C0aBF89889f7b60c2fC278416)\n\n` +
    `Masterchef: [${addresses.masterChef}](${url + addresses.masterChef})\n\n` + // This is
    `Masterchef v2: [0xEF0881eC094552b2e128Cf945EF17a6752B4Ec5d](${url}0xef0881ec094552b2e128cf945ef17a6752b4ec5d)\n\n` +
    `PickleRewarder (For MCv2): [0x7512105dbb4c0e0432844070a45b7ea0d83a23fd](${url}0x7512105dbb4c0e0432844070a45b7ea0d83a23fd)\n\n` +
    `Governance-DAO (multi-sig): [0x9d074E37d408542FD38be78848e8814AFB38db17](${url}0x9d074E37d408542FD38be78848e8814AFB38db17)\n\n` +
    `Dev Wallet (multi-sig): [0x2fee17F575fa65C06F10eA2e63DBBc50730F145D](${url}0x2fee17F575fa65C06F10eA2e63DBBc50730F145D)\n\n` +
    `Treasury-DAO (multi-sig): [0x066419EaEf5DE53cc5da0d8702b990c5bc7D1AB3](${url}0x066419EaEf5DE53cc5da0d8702b990c5bc7D1AB3)\n\n` +
    `Vault Registry: [0xF7C2DCFF5E947a617288792e289984a2721C4671](${url}0xF7C2DCFF5E947a617288792e289984a2721C4671)\n\n` +
    `---\n\n` +
    `## DILL Contracts\n\n` +
    `### Main Contracts\n\n` +
    `DILL: [${addresses.dill}](${url + addresses.dill})\n\n` +
    `GaugeProxy: [${addresses.gaugeProxy}](${url + addresses.gaugeProxy})\n\n` +
    `mDILL: [0x45F7fa97BD0e0C212A844BAea35876C7560F465B](${url}0x45f7fa97bd0e0c212a844baea35876c7560f465b)\n\n` +
    `FeeDistributor: [0x74C6CadE3eF61d64dcc9b97490d9FbB231e4BdCc](${url}0x74c6cade3ef61d64dcc9b97490d9fbb231e4bdcc)\n\n` +
    `SmartWalletChecker: [0x2ff4f44f86f49d45a1c3626bab9d222e84e9e78f](${url}0x2ff4f44f86f49d45a1c3626bab9d222e84e9e78f)\n\n` +
    `### Gauges\n\n` +
    gaugesTable(assets, "eth") +
    `\n` +
    `\n---\n`;

  return body;
};

const gaugesTable = (assets: AssetDefinition, chain: string): string => {
  const url: string = Chains.get(ChainNetwork.Ethereum).explorer;
  const header = `| Deposit Token | Gauge Address |\n` + `| ---  | --- |\n`;
  const body =
    assets.standaloneFarms
      .filter((farm) => farm.details.allocShare && farm.chain === chain) // chain check just in case a standalone farm gets added on other chains in the future
      .map((farm) => {
        var row = `| ${farm.depositToken.name} | [${farm.contract}](${
          url + farm.contract
        }) |\n`;
        return row;
      })
      .join("") +
    assets.jars
      .filter((jar) => jar.chain === chain && jar.farm && jar.farm.farmAddress) // some permanently disabled farms missing farmAddress (BAC & MIC)
      .map((jar) => {
        var row = `| ${jar.farm.farmDepositTokenName} | [${
          jar.farm.farmAddress
        }](${url + jar.farm.farmAddress}) |\n`;
        return row;
      })
      .join("");
  return header + body;
};

const pickleJarsEth = (assets: AssetDefinition, allocPoints: AllocPoints[]): string => {
  const url: string = Chains.get(ChainNetwork.Ethereum).explorer + "/address/";
  const addresses = ADDRESSES.get(ChainNetwork.Ethereum);
  const body =
    `\n` +
    `## Pickle Jars Contracts (Ethereum)\n\n` +
    `Controller v4: [${addresses.controller}](${
      url + addresses.controller
    })\n\n` +
    `Upgradeable Controller: [0x7B5916C61bCEeaa2646cf49D9541ac6F5DCe3637](${url}0x7B5916C61bCEeaa2646cf49D9541ac6F5DCe3637)\n\n` +
    `Strategist: [0xacfe4511ce883c14c4ea40563f176c3c09b4c47c](${url}0xacfe4511ce883c14c4ea40563f176c3c09b4c47c)\n\n` +
    `Governance: [0xD92c7fAa0Ca0e6AE4918f3a83d9832d9CAEAA0d3](${url}0xD92c7fAa0Ca0e6AE4918f3a83d9832d9CAEAA0d3)\n\n` +
    `Treasury: [0x066419EaEf5DE53cc5da0d8702b990c5bc7D1AB3](${url}0x066419EaEf5DE53cc5da0d8702b990c5bc7D1AB3)\n\n` +
    `CRVLocker: [0xb5208a3754a8592e2e934d4e1e7b985ed3ae78a1](${url}0xb5208a3754a8592e2e934d4e1e7b985ed3ae78a1)\n\n` +
    `Instabrine: [0x8F9676bfa268E94A2480352cC5296A943D5A2809](${url}0x8F9676bfa268E94A2480352cC5296A943D5A2809)\n\n` +
    `Timelock (12 hours): [0xD92c7fAa0Ca0e6AE4918f3a83d9832d9CAEAA0d3](${url}0xD92c7fAa0Ca0e6AE4918f3a83d9832d9CAEAA0d3)\n\n` +
    jarsTable(assets, "eth") +
    `\n` +
    `---\n\n` +
    `## Tools Contracts\n\n` +
    `PickleSwap: [0x7C0D8598560Cb19d46bFF6a41CECD80E7Ef3a15a](${url}0x7C0D8598560Cb19d46bFF6a41CECD80E7Ef3a15a)\n\n` +
    `PickleMigrator: [0xC0CF2CbD0c6bB1da4c671FBb07D40E88676DBe82](${url}0xC0CF2CbD0c6bB1da4c671FBb07D40E88676DBe82)\n\n` +
    `UniCurveConverter: [0x8EfAFBD731d779390e4F2392315eea42c14E2B69](${url}0x8EfAFBD731d779390e4F2392315eea42c14E2B69)\n\n` +
    `Harvester Bot: [0x0f571d2625b503bb7c1d2b5655b483a2fa696fef](${url}0x0f571d2625b503bb7c1d2b5655b483a2fa696fef)\n\n` +
    `---\n\n` +
    emissionsTable(allocPoints); // Should Pools be omitted?

  return body;
};

const emissionsTable = (allocPoints: AllocPoints[]): string => {
  const url = Chains.get(ChainNetwork.Ethereum).explorer + "/address/";
  const allo = allocPoints;
  const chainsList = Object.keys(ChainNetwork).slice(1).join("+");
  const body =
    `## PICKLE Emissions Allocation\n\n` +
    `| Chain | Token | AllocPoint | % |\n` +
    `| --- | --- | --- | --- |\n` +
    allocPoints.map( (token, i) => {
      var row =
      `| ${i? chainsList:"Ethereum"} |  [${token.name}](${url+token.lpToken}) | ${token.allocPoints} | ${(Number.parseInt(token.allocPoints)/Number.parseInt(token.totalAllocPoints)*100).toFixed(1)}% |\n`
      return row;
    }).join("") +
    `---\n\n`;

  return body;
};

const getAllocPoints = async (): Promise<AllocPoints[]> => {
  const rpcProviderUrl = Chains.get(ChainNetwork.Ethereum).rpcProviderUrls[0];
  const networkId = Chains.get(ChainNetwork.Ethereum).id;
  const provider: Provider = new ethers.providers.JsonRpcProvider(
    rpcProviderUrl,
    networkId,
  );
  const multiProvider = new MulticallProvider(provider, networkId);
  const chefMulticall = new MulticallContract(
    ADDRESSES.get(ChainNetwork.Ethereum).masterChef,
    MasterchefAbi,
  );
  try {
    const totalAllocPoints: string = await (await multiProvider.all([chefMulticall.totalAllocPoint()]))[0].toString();
    const poolLength = (
      await multiProvider.all([chefMulticall.poolLength()])
    )[0].toNumber();
    const poolIds = Array.from(Array(poolLength).keys());
    const resps = await multiProvider.all(
      poolIds.map((id) => chefMulticall.poolInfo(id)),
    );
    let ordered: AllocPoints[];
    ordered = await Promise.all(resps
      .filter((resp) => resp.allocPoint != 0)
      .map(async(resp) => {
          const tokenName = await (await new ethers.Contract(resp.lpToken, erc20abi, provider).functions.symbol()).toString();
        return {lpToken: <string>resp.lpToken, allocPoints: <string>resp.allocPoint.toString(), name: <string>tokenName, totalAllocPoints: totalAllocPoints};
      }))
    return ordered;
  } catch (error) {
    console.log(error);
  }
};

const jarsTable = (assets: AssetDefinition, chain: string) => {
  const url: string = Chains.get(<ChainNetwork>chain).explorer; // issue?

  const header =
    `## Pickle Jars (pJars - ${Object.keys(ChainNetwork).filter(
      (key) => ChainNetwork[key] === chain,
    )})\n\n` +
    `| Index | Name | Want | PickleJar | Strategy |\n` +
    `| --- | ---  | --- | --- | --- |\n`;
  const body = assets.jars
    .filter((jar) => jar.chain === chain)
    .map((jar) => {
      var row =
        `| ${jar.chefPID ? jar.chefPID : "-"} ` + // some old jars are registered in the masterchef contract by their wants
        `| ${jar.id} | [${jar.depositToken.name}](${
          url + jar.depositToken.addr
        }) ` +
        `| [p${jar.depositToken.name}](${url + jar.contract}) ` +
        `| [${
          jar.details.strategyName
            ? jar.details.strategyName
            : "Strategy-" + jar.depositToken.name
        }](${url + jar.details.strategyAddr}) |\n`;
      return row;
    })
    .join("");
  return header + body;
};

const pickleJarsPoly = (assets: AssetDefinition): string => {
  const url: string = Chains.get(ChainNetwork.Polygon).explorer + "/address/";
  const addresses = ADDRESSES.get(ChainNetwork.Polygon);
  const body =
    `\n` +
    `## Pickle.Finance Contracts (Polygon)\n\n` +
    `Pickle Token (POS): [${addresses.pickle}](${url + addresses.pickle})\n\n` +
    `MiniChefV2: [${addresses.minichef}](${url + addresses.minichef})\n\n` +
    `Rewarder: [0xE28287544005094be096301E5eE6E2A6E6Ef5749](${url}0xE28287544005094be096301E5eE6E2A6E6Ef5749)\n\n` +
    `Timelock: [0x63A991b9c34D2590A411584799B030414C9b0D6F](${url}0x63A991b9c34D2590A411584799B030414C9b0D6F)\n\n` +
    `Controller: [${addresses.controller}](${url + addresses.controller})\n\n` +
    `Strategist: [0xacfe4511ce883c14c4ea40563f176c3c09b4c47c](${url}0xacfe4511ce883c14c4ea40563f176c3c09b4c47c)\n\n` +
    `Multi-sig Treasury & Governance: [0xEae55893cC8637c16CF93D43B38aa022d689Fa62](${url}0xEae55893cC8637c16CF93D43B38aa022d689Fa62)\n\n` +
    `Vault Registry: [0x3419D74F5909e7579C1259f6638F82143bd536B1](${url}0x3419D74F5909e7579C1259f6638F82143bd536B1)\n\n` +
    `---\n\n` +
    jarsTable(assets, "polygon") +
    `\n` +
    `---\n\n`;

  return body;
};

const pickleJarsArb = (assets: AssetDefinition): string => {
  const url: string = Chains.get(ChainNetwork.Arbitrum).explorer + "/address/";
  const addresses = ADDRESSES.get(ChainNetwork.Arbitrum);
  const body =
    `\n` +
    `## Pickle.Finance Contracts (Arbitrum Mainnet)\n\n` +
    `Controller: [${addresses.controller}](${url + addresses.controller})\n\n` +
    `MiniChef: [${addresses.minichef}](${url + addresses.minichef})\n\n` +
    `Strategist/Governance: [0xacfe4511ce883c14c4ea40563f176c3c09b4c47c](${url}0xacfe4511ce883c14c4ea40563f176c3c09b4c47c)\n\n` +
    `Pickle Token: [${addresses.pickle}](${url + addresses.pickle})\n\n` +
    `Multi-sig Treasury & Governance: [0xf02CeB58d549E4b403e8F85FBBaEe4c5dfA47c01](${url}0xf02CeB58d549E4b403e8F85FBBaEe4c5dfA47c01)\n\n` +
    `Vault Registry: [0x63292afc5567c19738e2ed6aedc840e5abca910c](${url}0x63292afc5567c19738e2ed6aedc840e5abca910c)\n\n` +
    `---\n\n` +
    jarsTable(assets, "arbitrum") +
    `\n` +
    `---\n\n`;

  return body;
};

const pickleJarsOkex = (assets: AssetDefinition): string => {
  const url: string = Chains.get(ChainNetwork.OKEx).explorer + "/address/";
  const addresses = ADDRESSES.get(ChainNetwork.OKEx);
  const body =
    `\n` +
    `## Pickle.Finance Contracts (OKExChain Mainnet)\n\n` +
    `ControllerV4: [0xcf05d96b4c6c5a87b73f5f274dce1085bc7fdcc4](${url}0xcf05d96b4c6c5a87b73f5f274dce1085bc7fdcc4)\n\n` +
    `MiniChef: [0x7446BF003b98B7B0D90CE84810AC12d6b8114B62](${url}0x7446BF003b98B7B0D90CE84810AC12d6b8114B62)\n\n` +
    `Rewarder: [0x48394297ed0a9e9edcc556faaf4222a932605c56](${url}0x48394297ed0a9e9edcc556faaf4222a932605c56)\n\n` +
    `Strategist/Governance: [0xacfe4511ce883c14c4ea40563f176c3c09b4c47c](${url}0xacfe4511ce883c14c4ea40563f176c3c09b4c47c)\n\n` +
    `---\n\n` +
    jarsTable(assets, "okex") +
    `\n` +
    `---\n\n`;

  return body;
};

const getMasterChefIds = async (chefAddr: string, network: ChainNetwork) => {
  const rpcProviderUrl = Chains.get(network).rpcProviderUrls[0];
  const networkId = Chains.get(network).id;
  const provider: Provider = new ethers.providers.JsonRpcProvider(
    rpcProviderUrl,
    networkId,
  );
  const multiProvider = new MulticallProvider(provider, networkId);
  const chefMulticall = new MulticallContract(chefAddr, MasterchefAbi);
  try {
    const poolLength = (
      await multiProvider.all([chefMulticall.poolLength()])
    )[0].toNumber();
    const poolIds = Array.from(Array(poolLength).keys());
    const resps = await multiProvider.all(
      poolIds.map((id) => chefMulticall.poolInfo(id)),
    );
    const ordered: Record<string, string> = {};
    resps.forEach((resp, i) => (ordered[resp.lpToken] = i.toString()));
    return ordered;
  } catch (error) {
    console.log(error);
  }
};

const getMiniChefIds = async (chefAddr: string, network: ChainNetwork) => {
  const rpcProviderUrl = Chains.get(network).rpcProviderUrls[0];
  const networkId = Chains.get(network).id;
  const provider: Provider = new ethers.providers.JsonRpcProvider(
    rpcProviderUrl,
    networkId,
  );
  const multiProvider = new MulticallProvider(provider, networkId);
  const chefMulticall = new MulticallContract(chefAddr, MinichefAbi);
  try {
    const poolLength = (
      await multiProvider.all([chefMulticall.poolLength()])
    )[0].toNumber();
    const poolIds = Array.from(Array(poolLength).keys());
    const resps = await multiProvider.all(
      poolIds.map((id) => chefMulticall.lpToken(id)),
    );
    const ordered: Record<string, string> = {};
    resps.forEach((resp, i) => (ordered[resp] = i.toString()));
    return ordered;
  } catch (error) {
    console.log(error);
  }
};

const updateModelIndices = (
  assets: AssetDefinition,
  orderedList: Record<string, string>[],
) => {
  orderedList.forEach((orderedObject) => {
    Object.keys(orderedObject).forEach((orderedJarAddr) => {
      assets.jars.forEach((jar, i) => {
        // Some jars are registered in the masterchef with their want token, others with the jar's
        if (
          jar.contract.toLowerCase() === orderedJarAddr.toLowerCase() ||
          jar.depositToken.addr.toLowerCase() === orderedJarAddr.toLowerCase()
        ) {
          assets.jars[i].chefPID = orderedObject[orderedJarAddr];
        }
      });
      // TODO: Add a loop for standalone farms/external
    });
  });
};
const main = async () => {
  // ADD_CHAIN
  // Chains.globalInitialize();
  setMulticallAddress(42161, "0x813715eF627B01f4931d8C6F8D2459F26E19137E"); // provider address for Arbitrum

  const stringArr: string[] = [];
  const pickleModel: PickleModelJson = await getPfcoreApiData();
  const assets: AssetDefinition = pickleModel.assets;
  const orderedList: Record<string, string>[] = [
    await getMiniChefIds(
      ADDRESSES.get(ChainNetwork.Arbitrum).minichef,
      ChainNetwork.Arbitrum,
    ),
    await getMiniChefIds(
      ADDRESSES.get(ChainNetwork.Polygon).minichef,
      ChainNetwork.Polygon,
    ),
    await getMasterChefIds(
      ADDRESSES.get(ChainNetwork.Ethereum).masterChef,
      ChainNetwork.Ethereum,
    ),
    // TODO add okex
  ];
  updateModelIndices(assets, orderedList);

  stringArr.push(pickleEthInfo(assets));
  stringArr.push(pickleJarsEth(assets, await getAllocPoints()));
  stringArr.push(pickleJarsPoly(assets));
  stringArr.push(pickleJarsArb(assets));
  // stringArr.push(pickleJarsOkex(assets));  // TODO uncomment once Okex is added to pf-core

  const readme: string = stringArr.join("\n");

  fs.writeFile("README.md", readme, (err) =>
    err ? console.log(err) : console.log("README.md generated!"),
  );
};

main();