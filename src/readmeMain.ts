import fs from "fs";
import fetch from "cross-fetch";
import { Signer } from "@ethersproject/abstract-signer";
import { PickleModelJson, PickleModelAssets } from "./model/PickleModelJson";
import { ADDRESSES } from "./model/PickleModel";
import { ethers } from "ethers";
import { Provider } from "@ethersproject/providers";
import MinichefAbi from "./Contracts/ABIs/minichef.json";
import MasterchefAbi from "./Contracts/ABIs/masterchef.json";
import erc20abi from "./Contracts/ABIs/erc20.json";
import { ChainNetwork } from ".";
import {
  Contract as MulticallContract,
  Provider as MulticallProvider,
  setMulticallAddress,
} from "ethers-multicall";
import { Chains } from "./chain/Chains";

const apiURL = "https://api.pickle.finance/prod/protocol/pfcore";

interface AllocPoints {
  name: string;
  lpToken: string;
  allocPoints: string;
  totalAllocPoints: string;
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

const pickleEthInfo = (assets: PickleModelAssets): string => {
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

const gaugesTable = (assets: PickleModelAssets, chain: string): string => {
  const url: string = Chains.get(ChainNetwork.Ethereum).explorer + "/address/";
  const header = `| Deposit Token | Gauge Address |\n` + `| ---  | --- |\n`;
  const body =
    assets.standaloneFarms
      .filter((farm) => farm.details.allocShare && farm.chain === chain) // chain check just in case a standalone farm gets added on other chains in the future
      .map((farm) => {
        const row = `| ${farm.depositToken.name} | [${farm.contract}](${
          url + farm.contract
        }) |\n`;
        return row;
      })
      .join("") +
    assets.jars
      .filter((jar) => jar.chain === chain && jar.farm && jar.farm.farmAddress) // some permanently disabled farms missing farmAddress (BAC & MIC)
      .map((jar) => {
        const row = `| ${jar.farm.farmDepositTokenName} | [${
          jar.farm.farmAddress
        }](${url + jar.farm.farmAddress}) |\n`;
        return row;
      })
      .join("");
  return header + body;
};

const pickleJarsEth = (
  assets: PickleModelAssets,
  allocPoints: AllocPoints[],
): string => {
  const url: string = Chains.get(ChainNetwork.Ethereum).explorer + "/address/";
  const body =
    `\n` +
    contractsList(ChainNetwork.Ethereum) +
    jarsTableNoIndex(assets, ChainNetwork.Ethereum) +
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

const contractsList = (chain: ChainNetwork) => {
  const url: string = Chains.get(chain).explorer + "/address/";
  const addresses = ADDRESSES.get(chain);
  const chainName = Object.keys(ChainNetwork).filter(
    (key) => ChainNetwork[key] === chain,
  );
  const body =
    `## Pickle Jars Contracts (${chainName})\n\n` +
    Object.keys(addresses)
      .map((addressName) => {
        const line = `${addressName}: [${addresses[addressName]}](${
          url + addresses[addressName]
        })\n\n`;
        return line;
      })
      .join("") +
    `---\n\n`;
  return body;
};

const emissionsTable = (allocPoints: AllocPoints[]): string => {
  const url = Chains.get(ChainNetwork.Ethereum).explorer + "/address/";
  const chainsList = Object.keys(ChainNetwork).slice(1).join("+");
  const body =
    `## PICKLE Emissions Allocation\n\n` +
    `| Chain | Token | AllocPoint | % |\n` +
    `| --- | --- | --- | --- |\n` +
    allocPoints
      .map((token, i) => {
        const row = `| ${i ? chainsList : "Ethereum"} |  [${token.name}](${
          url + token.lpToken
        }) | ${token.allocPoints} | ${(
          (Number.parseInt(token.allocPoints) /
            Number.parseInt(token.totalAllocPoints)) *
          100
        ).toFixed(1)}% |\n`;
        return row;
      })
      .join("") +
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
    const totalAllocPoints: string = await (
      await multiProvider.all([chefMulticall.totalAllocPoint()])
    )[0].toString();
    const poolLength = (
      await multiProvider.all([chefMulticall.poolLength()])
    )[0].toNumber();
    const poolIds = Array.from(Array(poolLength).keys());
    const resps = await multiProvider.all(
      poolIds.map((id) => chefMulticall.poolInfo(id)),
    );
    const ordered: AllocPoints[] = await Promise.all(
      resps
        .filter((resp) => resp.allocPoint != 0)
        .map(async (resp) => {
          const tokenName = await (
            await new ethers.Contract(
              resp.lpToken,
              erc20abi,
              provider,
            ).functions.symbol()
          ).toString();
          return {
            lpToken: <string>resp.lpToken,
            allocPoints: <string>resp.allocPoint.toString(),
            name: <string>tokenName,
            totalAllocPoints: totalAllocPoints,
          };
        }),
    );
    return ordered;
  } catch (error) {
    console.log(error);
  }
};

const jarsTable = (assets: PickleModelAssets, chain: ChainNetwork) => {
  const url: string = Chains.get(chain).explorer + "/address/";
  const chainName = Object.keys(ChainNetwork).filter(
    (key) => ChainNetwork[key] === chain,
  );
  const header =
    `## Pickle Jars (pJars - ${chainName})\n\n` +
    `| Index | Name | Want | PickleJar | Strategy |\n` +
    `| --- | ---  | --- | --- | --- |\n`;
  const body = assets.jars
    .filter((jar) => jar.chain === chain)
    .map((jar) => {
      const row =
        `| ${(jar as any).chefPID ? (jar as any).chefPID : "-"} ` +
        `| ${jar.id} | [${jar.depositToken.name}](${
          // some old jars are registered in the masterchef contract by their wants
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

const jarsTableNoIndex = (assets: PickleModelAssets, chain: ChainNetwork) => {
  const url: string = Chains.get(chain).explorer + "/address/";
  const chainName = Object.keys(ChainNetwork).filter(
    (key) => ChainNetwork[key] === chain,
  );
  const header =
    `## Pickle Jars (pJars - ${chainName})\n\n` +
    `| Name | Want | PickleJar | Strategy |\n` +
    `| --- | --- | --- | --- |\n`;
  const body = assets.jars
    .filter((jar) => jar.chain === chain)
    .map((jar) => {
      const row =
        `| ${jar.id} | [${jar.depositToken.name}](${
          // some old jars are registered in the masterchef contract by their wants
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

const pickleJars = (assets: PickleModelAssets, chain: ChainNetwork): string => {
  const body =
    `\n` + contractsList(chain) + jarsTable(assets, chain) + `\n` + `---\n\n`;

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
  assets: PickleModelAssets,
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
          (assets.jars[i] as any).chefPID = orderedObject[orderedJarAddr];
        }
      });
      // TODO: Add a loop for standalone farms/external
    });
  });
};

const main = async () => {
  // ADD_CHAIN
  Chains.globalInitialize(new Map<ChainNetwork, Provider | Signer>());
  setMulticallAddress(42161, "0x813715eF627B01f4931d8C6F8D2459F26E19137E"); // provider address for Arbitrum

  const stringArr: string[] = [];
  const pickleModel: PickleModelJson = await getPfcoreApiData();
  const assets: PickleModelAssets = pickleModel.assets;
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
  const nonMainnetNetworks = Chains.list().filter(
    (x) => x !== ChainNetwork.Ethereum,
  );
  for (let i = 0; i < nonMainnetNetworks.length; i++) {
    stringArr.push(pickleJars(assets, nonMainnetNetworks[i]));
  }

  const readme: string = stringArr.join("\n");

  fs.writeFile("../contracts/README.md", readme, (err) =>
    err
      ? console.log(err)
      : console.log(
          "../contracts/README.md generated! Remember to go commit it and push it!",
        ),
  );
};

main();
