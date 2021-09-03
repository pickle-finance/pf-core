import { ChainNetwork } from "..";
import { Chains } from "../chain/Chains";
import { ADDRESSES, PickleModel } from "../model/PickleModel";
import { Provider } from '@ethersproject/providers';
import { Provider as MulticallProvider, Contract as MulticallContract} from 'ethers-multicall';
import MasterchefAbi from '../Contracts/ABIs/masterchef.json';
import { BigNumber, Contract } from "ethers";
import gaugeAbi from '../Contracts/ABIs/gauge.json';
import gaugeProxyAbi from '../Contracts/ABIs/gauge-proxy.json';
import { ONE_YEAR_IN_SECONDS } from "../behavior/AbstractJarBehavior";
import { JarDefinition, StandaloneFarmDefinition } from "../model/PickleModelJson";

export async function loadGaugeData(model: PickleModel, chain: ChainNetwork) {
    if( chain === ChainNetwork.Ethereum) {
        const ret : IRawGaugeData[] = await loadGaugeDataEth();
        let acc = 0;
        for( let z = 0; z < ret.length; z++ ) {
            acc += ret[z].allocPoint;
        }
        for( let i = 0; i < ret.length; i++ ) {
            setAssetGaugeApr(ret[i], model)
        }
        return ret;
    }
}

function findJarForGauge(gauge:IRawGaugeData, model: PickleModel) : JarDefinition {
    const matchingJars = model.getJars().filter((x)=>
        x.farm !== undefined && x.farm.farmAddress !== undefined &&
        x.farm.farmAddress.toLowerCase() === gauge.gaugeAddress.toLowerCase());
    if( matchingJars.length > 0 ) {
        if( !matchingJars[0].farm.details) {
            matchingJars[0].farm.details = {};
        }
        return matchingJars[0];
    }
    return undefined;
}


function findStandaloneFarmForGauge(gauge:IRawGaugeData, model: PickleModel) : StandaloneFarmDefinition {
    const matchingStandaloneFarms = model.getStandaloneFarms().filter(
        (x)=>x.contract !== undefined && 
        x.contract.toLowerCase() === gauge.gaugeAddress.toLowerCase());
    if( matchingStandaloneFarms.length > 0 ) {
        if( !matchingStandaloneFarms[0].details) {
            matchingStandaloneFarms[0].details = {};
        }
        return matchingStandaloneFarms[0];
    }
    return undefined;
}

export function setAssetGaugeApr(gauge: IRawGaugeData, model: PickleModel) {
    const rewardRatePerYear : number = gauge.derivedSupply ? 
        (gauge.rewardRate / gauge.derivedSupply) * ONE_YEAR_IN_SECONDS
        : Number.POSITIVE_INFINITY;


    // Check if it's a normal jar
    const jar : JarDefinition = findJarForGauge(gauge, model);
    if( jar !== undefined ) {
        const pricePerPToken = jar.details.ratio * jar.depositToken.price;
        const fullApy =
          (rewardRatePerYear * model.priceOfSync("pickle")) / pricePerPToken;
        const component = {name: "pickle", maxApr: fullApy, apr: 0.4 * fullApy, compoundable: false};
        jar.farm.details.farmApyComponents = [component];
        jar.farm.details.allocShare = gauge.allocPoint;
        return;
    }



    // Chek standalone farms
    const saFarm : StandaloneFarmDefinition = findStandaloneFarmForGauge(gauge, model);
    if( saFarm !== undefined ) {
        const pricePerPToken = saFarm.depositToken.price;
        const fullApy =
          (rewardRatePerYear * model.priceOfSync("pickle")) / pricePerPToken;
        const component = {name: "pickle", maxApr: fullApy, apr: 0.4 * fullApy, compoundable: false};
        saFarm.details.farmApyComponents = [component];
        saFarm.details.allocShare = gauge.allocPoint;
        return;
    }
}

const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

export async function loadGaugeDataEth(): Promise<IRawGaugeData[]> {
    const resolver: Provider = Chains.get(ChainNetwork.Ethereum).getPreferredWeb3Provider();
    const multicallProvider = new MulticallProvider(resolver);
    await multicallProvider.init();

    const proxy : Contract = new Contract(ADDRESSES.Ethereum.gaugeProxy, gaugeProxyAbi, Chains.get(ChainNetwork.Ethereum).getPreferredWeb3Provider());
    const [tokens, totalWeight] = await Promise.all([
        proxy.tokens(),
        proxy.totalWeight()
    ]);

    const mcGaugeProxy = new MulticallContract(
      ADDRESSES.Ethereum.gaugeProxy,
      gaugeProxyAbi,
    );

    const gaugeAddresses = await multicallProvider.all(
      tokens.map((token) => {
        return mcGaugeProxy.getGauge(token);
      })
    );
    await sleep(500);
    const gaugeWeights = await multicallProvider.all(
      tokens.map((token) => {
        return mcGaugeProxy.weights(token);
      }),
    );
    await sleep(500);

    const gaugeRewardRates = await multicallProvider.all(
      tokens.map((_token, index) => {
        return new MulticallContract(
          gaugeAddresses[index],
          gaugeAbi,
        ).rewardRate();
      }),
    );
    await sleep(500);

    const derivedSupplies = await multicallProvider.all(
      tokens.map((_token, index) => {
        return new MulticallContract(
          gaugeAddresses[index],
          gaugeAbi,
        ).derivedSupply();
      }),
    );
    await sleep(500);

    const totalSupplies = await multicallProvider.all(
      tokens.map((_token, index) => {
        return new MulticallContract(
          gaugeAddresses[index],
          gaugeAbi,
        ).totalSupply();
      }),
    );

    // extract response and convert to something we can use
    const gauges : IRawGaugeData[] = tokens.map((token, idx) => {
      return {
        allocPoint: +gaugeWeights[idx].toString() / +totalWeight.toString() || 0,
        token: token,
        gaugeAddress: gaugeAddresses[idx],
        gaugeWeight: +gaugeWeights[idx].toString(),
        totalWeight: +totalWeight.toString(),
        rewardRate: +gaugeRewardRates[idx].toString(),
        derivedSupply: +derivedSupplies[idx].toString(),
        totalSupply: +totalSupplies[idx].toString(),
      };
    });
    return gauges;
}

export interface IRawGaugeData {
    allocPoint: number,
    token: string,
    gaugeAddress: string,
    gaugeWeight: number,
    totalWeight: number,
    rewardRate: number,
    derivedSupply: number,
    totalSupply: number
}