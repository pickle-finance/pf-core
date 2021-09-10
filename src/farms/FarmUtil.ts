import { ChainNetwork } from "..";
import { Chains } from "../chain/Chains";
import { ADDRESSES, PickleModel } from "../model/PickleModel";
import { Provider } from '@ethersproject/providers';
import { Provider as MulticallProvider, Contract as MulticallContract} from 'ethers-multicall';
import MasterchefAbi from '../Contracts/ABIs/masterchef.json';
import MinichefAbi from '../Contracts/ABIs/minichef.json';
import { BigNumber, Contract, ethers } from "ethers";
import gaugeAbi from '../Contracts/ABIs/gauge.json';
import gaugeProxyAbi from '../Contracts/ABIs/gauge-proxy.json';
import { ONE_YEAR_IN_SECONDS } from "../behavior/AbstractJarBehavior";
import { AssetAprComponent, JarDefinition, StandaloneFarmDefinition } from "../model/PickleModelJson";

export async function loadGaugeAprData(model: PickleModel, chain: ChainNetwork) {
    if( chain === ChainNetwork.Ethereum) {
        let rawGaugeData = await loadGaugeDataEth();
        if( rawGaugeData && rawGaugeData.length > 0 ) {
            for( let i = 0; i < rawGaugeData.length; i++ ) {
                setAssetGaugeAprEth(rawGaugeData[i], model)
            }
        }
    } else if( chain === ChainNetwork.Polygon) {
        let rawGaugeData = await loadPolygonGaugeData();
        if( rawGaugeData && rawGaugeData.length > 0 ) {
            for( let i = 0; i < rawGaugeData.length; i++ ) {
                setAssetGaugeAprPoly(rawGaugeData[i], model)
            }
        }
    }
}

function findJarForGauge(gauge:IRawGaugeData, model: PickleModel) : JarDefinition {
    const matchingJars = model.getJars().filter((x)=>
        x.farm !== undefined && x.farm.farmAddress !== undefined &&
        x.farm.farmAddress.toLowerCase() === gauge.gaugeAddress.toLowerCase() &&
        gauge.token.toLowerCase() === x.contract.toLowerCase());
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
function createAprRange(jarRatio: number, depositTokenPrice: number, 
    rewardRatePY: number, picklePrice: number, dec: number ) : AssetAprComponent {
    const pricePerPToken = jarRatio * depositTokenPrice;
    const dec2 = 18-dec;
    const fullApy =
      (rewardRatePY * picklePrice) / (pricePerPToken * Math.pow(10,dec2));
    const component = {name: "pickle", maxApr: fullApy, apr: 0.4 * fullApy, compoundable: false};
    return component;

}

export function setAssetGaugeAprEth(gauge: IRawGaugeData, model: PickleModel) {
    // Check if it's a normal jar
    const jar : JarDefinition = findJarForGauge(gauge, model);
    if( jar !== undefined ) {
        const c : AssetAprComponent = createAprRange(jar.details.ratio, jar.depositToken.price, 
            gauge.rewardRatePerYear*100, model.priceOfSync("pickle"), 
            jar.details.decimals ? jar.details.decimals : 18);
        if( c && c.apr ) {
            jar.farm.details.farmApyComponents = [c];
        }
        jar.farm.details.allocShare = gauge.allocPoint;
        return;
    }

    // Chek standalone farms
    const saFarm : StandaloneFarmDefinition = findStandaloneFarmForGauge(gauge, model);
    if( saFarm !== undefined ) {
        const c : AssetAprComponent = createAprRange(1, saFarm.depositToken.price, 
            gauge.rewardRatePerYear*100, model.priceOfSync("pickle"), 18);
        if( c && c.apr ) {
            saFarm.details.farmApyComponents = [c];
        }
        saFarm.details.allocShare = gauge.allocPoint;
        return;
    }
}


export function setAssetGaugeAprPoly(gauge: IRawGaugeData, model: PickleModel) {
    // Check if it's a normal jar
    const jar : JarDefinition = findJarForGauge(gauge, model);
    if( jar !== undefined ) {
        const apr = 100*gauge.rewardRatePerYear * model.priceOfSync("pickle") / (jar.farm.details.valueBalance);
        const c : AssetAprComponent = {
            name: "pickle", apr: apr, compoundable: false
        };
        if( c && c.apr ) {
            jar.farm.details.farmApyComponents = [c];
        }
        jar.farm.details.allocShare = gauge.allocPoint;
        return;
    }

    // Chek standalone farms
    const saFarm : StandaloneFarmDefinition = findStandaloneFarmForGauge(gauge, model);
    if( saFarm !== undefined ) {
        const c : AssetAprComponent = createAprRange(1, saFarm.depositToken.price, 
            gauge.rewardRatePerYear, model.priceOfSync("pickle"), 18);
        if( c && c.apr ) {
            saFarm.details.farmApyComponents = [c];
        }
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

    /*
    const totalSupplies = await multicallProvider.all(
      tokens.map((_token, index) => {
        return new MulticallContract(
          gaugeAddresses[index],
          gaugeAbi,
        ).totalSupply();
      }),
    );
*/
    // extract response and convert to something we can use
    const gauges : IRawGaugeData[] = tokens.map((token, idx) => {
        const rrpy = +derivedSupplies[idx].toString() ? 
        (+gaugeRewardRates[idx].toString() / +derivedSupplies[idx].toString()) * ONE_YEAR_IN_SECONDS
        : Number.POSITIVE_INFINITY;
        
      return {
        allocPoint: +gaugeWeights[idx].toString() / +totalWeight.toString() || 0,
        token: token,
        gaugeAddress: gaugeAddresses[idx],
        rewardRate: +gaugeRewardRates[idx].toString(),
        rewardRatePerYear: rrpy,
        //derivedSupply: +derivedSupplies[idx].toString(),
        //totalSupply: +totalSupplies[idx].toString(),
      };
    });
    
    return gauges;
}

export async function loadPolygonGaugeData() : 
    Promise<IRawGaugeData[]> {

    const provider : Provider = Chains.get(ChainNetwork.Polygon).getPreferredWeb3Provider();
    const minichefAddr = ADDRESSES.Polygon.minichef;
    const minichef = new Contract(minichefAddr, MinichefAbi, provider);
    const [ppsBN, poolLengthBN] = await Promise.all([
        minichef.picklePerSecond()
            .catch(() => ethers.BigNumber.from(0)),
        minichef.poolLength()
            .catch(() => ethers.BigNumber.from(0)),
    ]);
    const poolLength = parseFloat(poolLengthBN.toString());
    const picklePerSecond = parseFloat(ethers.utils.formatEther(ppsBN));

    // load pool infos
    const multicallProvider = new MulticallProvider(provider);
    await multicallProvider.init();

    const miniChefMulticall = new MulticallContract(
        minichefAddr, MinichefAbi);
    const poolIds: number[] = Array.from(Array(poolLength).keys())
    const lpTokens: any[] = await multicallProvider.all(
        poolIds.map((id) => {
        return miniChefMulticall.lpToken(id);
        })
    );
    const poolInfo: any[] = await multicallProvider.all(
        poolIds.map((id) => {
        return miniChefMulticall.poolInfo(id);
        })
    );
    const totalAllocPoints = poolInfo.reduce((acc, curr) => {
        return acc + curr.allocPoint.toNumber();
    }, 0);

    const ret : IRawGaugeData[] = [];
    for( let i = 0; i < poolInfo.length; i++ ) {
        const poolShareOfPickles = (poolInfo[i].allocPoint.toNumber() / totalAllocPoints);
        const poolPicklesPerYear = poolShareOfPickles * ONE_YEAR_IN_SECONDS * picklePerSecond;
        ret.push({
            allocPoint: poolShareOfPickles,
            token: lpTokens[i],
            gaugeAddress: minichefAddr,
            rewardRatePerYear: poolPicklesPerYear
        });
    }
    return ret;
}

export interface IRawGaugeData {
    allocPoint: number,
    token: string,
    gaugeAddress: string,
    rewardRatePerYear: number,
    //rewardRate: number,
    //derivedSupply: number,
    //totalSupply: number
}