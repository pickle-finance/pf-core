
import fs from 'fs';
import fetch from "cross-fetch";
import { PickleModelJson, JarDefinition, ExternalAssetDefinition, StandaloneFarmDefinition } from './model/PickleModelJson'
import { ADDRESSES } from './model/PickleModel';
import { ethers } from 'ethers';
import { Provider } from '@ethersproject/providers';
import  MinichefAbi from './Contracts/ABIs/minichef.json';
import MasterchefAbi from './Contracts/ABIs/masterchef.json'
import { Chains } from '.';
import { ChainNetwork } from '.';
import { Contract as MulticallContract, Provider as MulticallProvider, setMulticallAddress } from 'ethers-multicall';


const apiURL = 'https://api.pickle.finance/prod/protocol/pfcore'

interface JarDefinition1 extends JarDefinition {
    chefPID?: string
}

interface AssetDefinition {
    jars: JarDefinition1[],
    standaloneFarms: StandaloneFarmDefinition[],
    external: ExternalAssetDefinition[]
}
const getPfcoreApiData = async () => {
    try{
        const promise = await fetch(apiURL);
        const resp = await promise.json();
        return resp;
    } catch(error) {
        console.log(error);
        return null;
    }
}

const pickleEthInfo = (assets: AssetDefinition):string => {
    const url: string = Chains.get(ChainNetwork.Ethereum).explorer + '/address/';
    const body = `\n` +
    `## Pickle.finance Contracts (Ethereum)\n\n` +
    `PickleToken: [${ADDRESSES.Ethereum.pickle}](${url + ADDRESSES.Ethereum.pickle}))\n\n` +
    `Timelock (48 hours): [0xc2d82a3e2bae0a50f4aeb438285804354b467bc0](${url}0xc2d82a3e2bae0a50f4aeb438285804354b467bc0)\n\n` +
    `Timelock (24 hours): [0x0040E05CE9A5fc9C0aBF89889f7b60c2fC278416](${url}0x0040E05CE9A5fc9C0aBF89889f7b60c2fC278416)\n\n` +
    `Masterchef: [${ADDRESSES.Ethereum.masterChef}](${url + ADDRESSES.Ethereum.masterChef})\n\n` +    // This is
    `Masterchef v2: [0xEF0881eC094552b2e128Cf945EF17a6752B4Ec5d](${url}0xef0881ec094552b2e128cf945ef17a6752b4ec5d)\n\n` +
    `PickleRewarder (For MCv2): [0x7512105dbb4c0e0432844070a45b7ea0d83a23fd](${url}0x7512105dbb4c0e0432844070a45b7ea0d83a23fd)\n\n` +
    `Governance-DAO (multi-sig): [0x9d074E37d408542FD38be78848e8814AFB38db17](${url}0x9d074E37d408542FD38be78848e8814AFB38db17)\n\n` +
    `Dev Wallet (multi-sig): [0x2fee17F575fa65C06F10eA2e63DBBc50730F145D](${url}0x2fee17F575fa65C06F10eA2e63DBBc50730F145D)\n\n` +
    `Treasury-DAO (multi-sig): [0x066419EaEf5DE53cc5da0d8702b990c5bc7D1AB3](${url}0x066419EaEf5DE53cc5da0d8702b990c5bc7D1AB3)\n\n` +
    `Vault Registry: [0xF7C2DCFF5E947a617288792e289984a2721C4671](${url}0xF7C2DCFF5E947a617288792e289984a2721C4671)\n\n` +
    `---\n\n` +
    `## DILL Contracts\n\n` +
    `### Main Contracts\n\n` +
    `DILL: [${ADDRESSES.Ethereum.dill}](${url + ADDRESSES.Ethereum.dill})\n\n` +
    `GaugeProxy: [${ADDRESSES.Ethereum.gaugeProxy}](${url + ADDRESSES.Ethereum.gaugeProxy})\n\n` +
    `mDILL: [0x45F7fa97BD0e0C212A844BAea35876C7560F465B](${url}0x45f7fa97bd0e0c212a844baea35876c7560f465b)\n\n` +
    `FeeDistributor: [0x74C6CadE3eF61d64dcc9b97490d9FbB231e4BdCc](${url}0x74c6cade3ef61d64dcc9b97490d9fbb231e4bdcc)\n\n` +
    `SmartWalletChecker: [0x2ff4f44f86f49d45a1c3626bab9d222e84e9e78f](${url}0x2ff4f44f86f49d45a1c3626bab9d222e84e9e78f)\n\n` +
    `### Gauges\n\n` +
    gaugesTable(assets, 'eth') + `\n` +
    `\n---\n`

    return body;
}

const gaugesTable = (assets: AssetDefinition, chain: string): string => {
    const url: string = Chains.get(ChainNetwork.Ethereum).explorer;
    const header =
        `| Deposit Token | Gauge Address |\n` + 
        `| ---  | --- |\n`
    const body = assets.standaloneFarms.filter( (farm) => farm.details.allocShare && farm.chain === chain ) // chain check just in case a standalone farm gets added on other chains in the future
    .map( (farm) => {
        var row =
        `| ${farm.depositToken.name} | [${farm.contract}](${url + farm.contract}) |\n`
        return row;
    }).join('') +
    assets.jars.filter( (jar) => jar.chain === chain && jar.farm && jar.farm.farmAddress ) // some permanently disabled farms missing farmAddress (BAC & MIC)
    .map( (jar) => {
        var row =
        `| ${jar.farm.farmDepositTokenName} | [${jar.farm.farmAddress}](${url + jar.farm.farmAddress}) |\n`
        return row;
    })
    .join('');
    return header + body;    
}

const pickleJarsEth = (assets: AssetDefinition):string => {
    const url: string = Chains.get(ChainNetwork.Ethereum).explorer + '/address/';
    const body = `\n` +
    `## Pickle Jars Contracts (Ethereum)\n\n` +
    `Controller v4: [${ADDRESSES.Ethereum.controller}](${url + ADDRESSES.Ethereum.controller})\n\n` +
    `Upgradeable Controller: [0x7B5916C61bCEeaa2646cf49D9541ac6F5DCe3637](${url}0x7B5916C61bCEeaa2646cf49D9541ac6F5DCe3637)\n\n` +
    `Strategist: [0xacfe4511ce883c14c4ea40563f176c3c09b4c47c](${url}0xacfe4511ce883c14c4ea40563f176c3c09b4c47c)\n\n` +
    `Governance: [0xD92c7fAa0Ca0e6AE4918f3a83d9832d9CAEAA0d3](${url}0xD92c7fAa0Ca0e6AE4918f3a83d9832d9CAEAA0d3)\n\n` +
    `Treasury: [0x066419EaEf5DE53cc5da0d8702b990c5bc7D1AB3](${url}0x066419EaEf5DE53cc5da0d8702b990c5bc7D1AB3)\n\n` +
    `CRVLocker: [0xb5208a3754a8592e2e934d4e1e7b985ed3ae78a1](${url}0xb5208a3754a8592e2e934d4e1e7b985ed3ae78a1)\n\n` +
    `Instabrine: [0x8F9676bfa268E94A2480352cC5296A943D5A2809](${url}0x8F9676bfa268E94A2480352cC5296A943D5A2809)\n\n` +
    `Timelock (12 hours): [0xD92c7fAa0Ca0e6AE4918f3a83d9832d9CAEAA0d3](${url}0xD92c7fAa0Ca0e6AE4918f3a83d9832d9CAEAA0d3)\n\n` +
    jarsTable(assets, 'eth') + `\n` +
    `---\n\n` +
    `## Tools Contracts\n\n` +
    `PickleSwap: [0x7C0D8598560Cb19d46bFF6a41CECD80E7Ef3a15a](${url}0x7C0D8598560Cb19d46bFF6a41CECD80E7Ef3a15a)\n\n` +
    `PickleMigrator: [0xC0CF2CbD0c6bB1da4c671FBb07D40E88676DBe82](${url}0xC0CF2CbD0c6bB1da4c671FBb07D40E88676DBe82)\n\n` +
    `UniCurveConverter: [0x8EfAFBD731d779390e4F2392315eea42c14E2B69](${url}0x8EfAFBD731d779390e4F2392315eea42c14E2B69)\n\n` +
    `Harvester Bot: [0x0f571d2625b503bb7c1d2b5655b483a2fa696fef](${url}0x0f571d2625b503bb7c1d2b5655b483a2fa696fef)\n\n` +
    `---\n\n` +
    poolsTable()    // Should Pools be omitted?
    
    return body;
}

// Probably should be omitted
const poolsTable = ():string => (
`## Pools\n\n` +
`| Index | Active | Token | AllocPoint\n` +
`| --- | --- | --- | ---\n` +
`| 0 | :x: | [PickleToken <> WETH](https://etherscan.io/address/0xdc98556Ce24f007A5eF6dC1CE96322d65832A819) | 0 |\n` +
`| 1 | :x: |  [USDT <> WETH](https://etherscan.io/address/0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852) | 0 |\n` +
`| 2 | :x: |  [USDC <> WETH](https://etherscan.io/address/0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc) | 0 |\n` +
`| 3 | :x: |  [DAI <> WETH](https://etherscan.io/address/0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11) | 0 |\n` +
`| 4 | :x: |  [DAI <> WETH](https://etherscan.io/address/0xf80758aB42C3B07dA84053Fd88804bCB6BAA4b5c) | 0 |\n` +
`| 5 | :x: |  [pUNIDAI](https://etherscan.io/address/0xf79Ae82DCcb71ca3042485c85588a3E0C395D55b) | 0 |\n` +
`| 6 | :x: |  [pUNIUSDC](https://etherscan.io/address/0x46206E9BDaf534d057be5EcF231DaD2A1479258B) | 0 |\n` +
`| 7 | :x: |  [pUNIUSDT](https://etherscan.io/address/0x3a41AB1e362169974132dEa424Fb8079Fd0E94d8) | 0 |\n` +
`| 8 | :x: |  [psCRV](https://etherscan.io/address/0x2385D31f1EB3736bE0C3629E6f03C4b3cd997Ffd) | 0 |\n` +
`| 9 | :x: |  [psCRV v2](https://etherscan.io/address/0x68d14d66B2B0d6E157c06Dc8Fefa3D8ba0e66a89) | 0 |\n` +
`| 10 | :x: |  [pUNIDAI v2](https://etherscan.io/address/0xCffA068F1E44D98D3753966eBd58D4CFe3BB5162) | 0 |\n` +
`| 11 | :x: |  [pUNIUSDC v2](https://etherscan.io/address/0x53Bf2E62fA20e2b4522f05de3597890Ec1b352C6) | 0 |\n` +
`| 12 | :x: |  [pUNIUSDT v2](https://etherscan.io/address/0x09FC573c502037B149ba87782ACC81cF093EC6ef) | 0 |\n` +
`| 13 | :x: |  [prenCRV](https://etherscan.io/address/0x2E35392F4c36EBa7eCAFE4de34199b2373Af22ec) | 0 |\n` +
`| 14 | :x: |  [p3CRV](https://etherscan.io/address/0x1BB74b5DdC1f4fC91D6f9E7906cf68bc93538e33) | 0 |\n` +
`| 15 | :x: |  [pUNIWBTC](https://etherscan.io/address/0xc80090AA05374d336875907372EE4ee636CBC562) | 0 |\n` +
`| 16 | :x: |  [pDAI](https://etherscan.io/address/0x6949Bb624E8e8A90F87cD2058139fcd77D2F3F87) | 0 |\n` +
`| 17 | :x: |  [pSLPDAI](https://etherscan.io/address/0x55282dA27a3a02ffe599f6D11314D239dAC89135) | 0 |\n` +
`| 18 | :x: |  [pSLPUSDC](https://etherscan.io/address/0x8c2D16B7F6D3F989eb4878EcF13D695A7d504E43) | 0 |\n` +
`| 19 | :x: |  [pSLPUSDT](https://etherscan.io/address/0xa7a37aE5Cb163a3147DE83F15e15D8E5f94D6bCE) | 0 |\n` +
`| 20 | :x: |  [pSLPWBTC](https://etherscan.io/address/0xde74b6c547bd574c3527316a2eE30cd8F6041525) | 0 |\n` +
`| 21 | :x: |  [pSLPYFI](https://etherscan.io/address/0x3261D9408604CC8607b687980D40135aFA26FfED) | 0 |\n` +
`| 22 | :x: |  [pUNIBAC](https://etherscan.io/address/0x4Cac56929B98d4C52dDfDF998329622013Fed2a5) | 0 |\n` +
`| 23 | :x: |  [pSLPMIC](https://etherscan.io/address/0xC66583Dd4E25b3cfc8D881F6DbaD8288C7f5Fd30) | 0 |\n` +
`| 24 | :x: |  [pstETHCRV](https://etherscan.io/address/0x77C8A58D940a322Aea02dBc8EE4A30350D4239AD) | 0 |\n` +
`| 25 | :x: |  [pSLPMIS](https://etherscan.io/address/0x0faa189afe8ae97de1d2f01e471297678842146d) | 0 |\n` +
`| 26 | :x: |  [pSLPYVECRV](https://etherscan.io/address/0x5eff6d166d66bacbc1bf52e2c54dd391ae6b1f48) | 0 |\n` +
`| 27 | :x: |  [pUNIBASV2DAI](https://etherscan.io/address/0xcF45563514a24b10563aC0c9fECCd3476b00DF45) | 0 |\n` +
`| 28 | :x: |  [pUNIMIRUST](https://etherscan.io/address/0x3bcd97dca7b1ced292687c97702725f37af01cac) | 0 |\n` +
`| 29 | :x: |  [mDILL](https://etherscan.io/address/0x45f7fa97bd0e0c212a844baea35876c7560f465b) | 0 |\n` +
`| 30 | :x: |  [pUNImTSLAUST](https://etherscan.io/address/0xaFB2FE266c215B5aAe9c4a9DaDC325cC7a497230) | 0 |\n` +
`| 31 | :x: |  [pUNImAAPLUST](https://etherscan.io/address/0xF303B35D5bCb4d9ED20fB122F5E268211dEc0EBd) | 0 |\n` +
`| 32 | :x: |  [pUNImQQQUST](https://etherscan.io/address/0x7C8de3eE2244207A54b57f45286c9eE1465fee9f) | 0 |\n` +
`| 33 | :x: |  [pUNImSLVUST](https://etherscan.io/address/0x1ed1fD33b62bEa268e527A622108fe0eE0104C07) | 0 |\n` +
`| 34 | :x: |  [pUNImBABAUST](https://etherscan.io/address/0x1CF137F651D8f0A4009deD168B442ea2E870323A) | 0 |\n` +
`| 35 | :x: |  [pSUSHIETH](https://etherscan.io/address/0xECb520217DccC712448338B0BB9b08Ce75AD61AE) | 0 |\n` +
`| 36 | :x: |  [pUNIFEITRIBE](https://etherscan.io/address/0xC1513C1b0B359Bc5aCF7b772100061217838768B) | 0 |\n` +
`| 37 | :heavy_check_mark: |  [mDILLv2](https://etherscan.io/address/0x45F7fa97BD0e0C212A844BAea35876C7560F465B) | 2268 |\n` +
`| 38 | :x: |  [pyvBOOSTETH](https://etherscan.io/address/0xCeD67a187b923F0E5ebcc77C7f2F7da20099e378) | 0 |\n` +
`| 39 | :heavy_check_mark: |  [mPOOL2](https://etherscan.io/address/0xD2EFfFDd1b55aaC34F6dd3707cBb7171EabeE51A) | 1732 |\n` +
`---\n\n`)

const jarsTable = (assets: AssetDefinition, chain: string) => {
    const url: string = Chains.get(<ChainNetwork>chain).explorer;   // issue?
    
    const header =
        `## Pickle Jars (pJars - ${Object.keys(ChainNetwork).filter( (key) => ChainNetwork[key] === chain )})\n\n` +
        `| Index | Name | Want | PickleJar | Strategy |\n` + 
        `| --- | ---  | --- | --- | --- |\n`
    const body = assets.jars.filter( (jar) => jar.chain === chain )
    .map((jar) => {
        var row =
        `| ${(jar.chefPID? jar.chefPID: "-")} ` +   // some old jars are registered in the masterchef contract by their wants
        `| ${jar.id} | [${jar.depositToken.name}](${url + jar.depositToken.addr}) ` +
        `| [p${jar.depositToken.name}](${url + jar.contract}) ` +
        `| [${(jar.details.strategyName? jar.details.strategyName : 'Strategy-'+jar.depositToken.name)}](${url + jar.details.strategyAddr}) |\n`
        return row
    })
    .join('');
    return header + body;
}

const pickleJarsPoly = (assets: AssetDefinition): string => {
    const url: string = Chains.get(ChainNetwork.Polygon).explorer + '/address/';
    const body = `\n` +
    `## Pickle.Finance Contracts (Polygon)\n\n` +
    `Pickle Token (POS): [${ADDRESSES.Polygon.pickle}](${url + ADDRESSES.Polygon.pickle})\n\n` +
    `MiniChefV2: [${ADDRESSES.Polygon.minichef}](${url + ADDRESSES.Polygon.minichef})\n\n` +
    `Rewarder: [0xE28287544005094be096301E5eE6E2A6E6Ef5749](${url}0xE28287544005094be096301E5eE6E2A6E6Ef5749)\n\n` +
    `Timelock: [0x63A991b9c34D2590A411584799B030414C9b0D6F](${url}0x63A991b9c34D2590A411584799B030414C9b0D6F)\n\n` +
    `Controller: [${ADDRESSES.Polygon.controller}](${url + ADDRESSES.Polygon.controller})\n\n` +
    `Strategist: [0xacfe4511ce883c14c4ea40563f176c3c09b4c47c](${url}0xacfe4511ce883c14c4ea40563f176c3c09b4c47c)\n\n` +
    `Multi-sig Treasury & Governance: [0xEae55893cC8637c16CF93D43B38aa022d689Fa62](${url}0xEae55893cC8637c16CF93D43B38aa022d689Fa62)\n\n` +
    `Vault Registry: [0x3419D74F5909e7579C1259f6638F82143bd536B1](${url}0x3419D74F5909e7579C1259f6638F82143bd536B1)\n\n` +
    `---\n\n` +
    jarsTable(assets, 'polygon') + `\n` +
    `---\n\n`

    return body;
}

const pickleJarsArb = (assets: AssetDefinition): string => {
    const url: string = Chains.get(ChainNetwork.Arbitrum).explorer + '/address/';
    const body = `\n` +
    `## Pickle.Finance Contracts (Arbitrum Mainnet)\n\n` +
    `Controller: [${ADDRESSES.Arbitrum.controller}](${url + ADDRESSES.Arbitrum.controller})\n\n` +
    `MiniChef: [${ADDRESSES.Arbitrum.minichef}](${url + ADDRESSES.Arbitrum.minichef})\n\n` +
    `Strategist/Governance: [0xacfe4511ce883c14c4ea40563f176c3c09b4c47c](${url}0xacfe4511ce883c14c4ea40563f176c3c09b4c47c)\n\n` +
    `Pickle Token: [${ADDRESSES.Arbitrum.pickle}](${url + ADDRESSES.Arbitrum.pickle})\n\n` +
    `Multi-sig Treasury & Governance: [0xf02CeB58d549E4b403e8F85FBBaEe4c5dfA47c01](${url}0xf02CeB58d549E4b403e8F85FBBaEe4c5dfA47c01)\n\n` +
    `Vault Registry: [0x63292afc5567c19738e2ed6aedc840e5abca910c](${url}0x63292afc5567c19738e2ed6aedc840e5abca910c)\n\n` +
    `---\n\n` +
    jarsTable(assets, 'arbitrum') + `\n` +
    `---\n\n`

    return body;
}

const pickleJarsOkex = (assets: AssetDefinition): string => {
    const url: string = Chains.get(ChainNetwork.OKEx).explorer + '/address/';
    const body = `\n` +
    `## Pickle.Finance Contracts (OKExChain Mainnet)\n\n` +
    `ControllerV4: [0xcf05d96b4c6c5a87b73f5f274dce1085bc7fdcc4](https://www.oklink.com/okexchain/address/0xcf05d96b4c6c5a87b73f5f274dce1085bc7fdcc4)\n\n` +
    `MiniChef: [0x7446BF003b98B7B0D90CE84810AC12d6b8114B62](https://www.oklink.com/okexchain/address/0x7446BF003b98B7B0D90CE84810AC12d6b8114B62)\n\n` +
    `Rewarder: [0x48394297ed0a9e9edcc556faaf4222a932605c56](https://www.oklink.com/okexchain/address/0x48394297ed0a9e9edcc556faaf4222a932605c56)\n\n` +
    `Strategist/Governance: [0xacfe4511ce883c14c4ea40563f176c3c09b4c47c](https://www.oklink.com/okexchain/address/0xacfe4511ce883c14c4ea40563f176c3c09b4c47c)\n\n` +
    `---\n\n` +
    jarsTable(assets, 'okex') + `\n` +
    `---\n\n`

    return body;
}

const getMasterChefIds = async (chefAddr: string, network: ChainNetwork) => {
    const rpcProviderUrl = Chains.get(network).rpcProviderUrls[0];
    const networkId = Chains.get(network).id;
    const provider: Provider = new ethers.providers.JsonRpcProvider(rpcProviderUrl, networkId);
    const multiProvider = new MulticallProvider(provider, networkId);
    const chefMulticall = new MulticallContract(chefAddr,MasterchefAbi);
    try{
        const poolLength = (await multiProvider.all([chefMulticall.poolLength()]))[0].toNumber();
        const poolIds = Array.from(Array(poolLength).keys());
        const resps = await multiProvider.all(poolIds.map( (id) => chefMulticall.poolInfo(id)));
        const ordered: Record<string, string> = {};
        resps.forEach( (resp, i) => ordered[resp.lpToken] = i.toString());
    return ordered;
    } catch (error) { console.log(error) }
}

const getMiniChefIds = async (chefAddr: string, network: ChainNetwork) => {
    const rpcProviderUrl = Chains.get(network).rpcProviderUrls[0];
    const networkId = Chains.get(network).id;
    const provider: Provider = new ethers.providers.JsonRpcProvider(rpcProviderUrl, networkId);
    const multiProvider = new MulticallProvider(provider, networkId);
    const chefMulticall = new MulticallContract(chefAddr,MinichefAbi);
    try{
        const poolLength = (await multiProvider.all([chefMulticall.poolLength()]))[0].toNumber();
        const poolIds = Array.from(Array(poolLength).keys());
        const resps = await multiProvider.all(poolIds.map( (id) => chefMulticall.lpToken(id)));
        const ordered: Record<string, string> = {};
        resps.forEach( (resp, i) => ordered[resp] = i.toString());
    return ordered;
    } catch (error) { console.log(error) }
}

const updateModelIndices = (assets: AssetDefinition, orderedList: Record<string, string>[]) => {
    orderedList.forEach( (orderedObject) => {
        Object.keys(orderedObject).forEach( (orderedJarAddr) => {
            assets.jars.forEach( (jar, i) => {
                // Some jars are registered in the masterchef with their want token, others with the jar's 
                if (jar.contract.toLowerCase() === orderedJarAddr.toLowerCase() || jar.depositToken.addr.toLowerCase() === orderedJarAddr.toLowerCase()) {
                    assets.jars[i].chefPID = orderedObject[orderedJarAddr];
                }
            });
            // TODO: Add a loop for standalone farms/external
        })
    });
}
const main = async() => {

    // ADD_CHAIN
    // Chains.globalInitialize();
    setMulticallAddress(42161, '0x813715eF627B01f4931d8C6F8D2459F26E19137E')    // provider address for Arbitrum

    const stringArr:string[] = [];
    const pickleModel: PickleModelJson = await getPfcoreApiData();
    const assets: AssetDefinition = pickleModel.assets;
    const orderedList: Record<string, string>[] = [
        await getMiniChefIds(ADDRESSES.Arbitrum.minichef, ChainNetwork.Arbitrum),
        await getMiniChefIds(ADDRESSES.Polygon.minichef, ChainNetwork.Polygon),
        await getMasterChefIds(ADDRESSES.Ethereum.masterChef, ChainNetwork.Ethereum),
    ]
    updateModelIndices(assets, orderedList);
    
    stringArr.push(pickleEthInfo(assets));
    stringArr.push(pickleJarsEth(assets));
    stringArr.push(pickleJarsPoly(assets));
    stringArr.push(pickleJarsArb(assets));
    // stringArr.push(pickleJarsOkex(assets));  // TODO uncomment once Okex is added to pf-core

    const readme: string = stringArr.join('\n')

    fs.writeFile('file.md', readme, (err) => (err? console.log(err):console.log('File written!')));
}

main();
