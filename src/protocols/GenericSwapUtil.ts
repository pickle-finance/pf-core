import { ChainNetwork, PickleModel } from "..";
import { Contract } from "ethers-multiprovider";
import {
  AssetProtocol,
  HistoricalYield,
  PickleAsset,
} from "../model/PickleModelJson";
import erc20Abi from "../Contracts/ABIs/erc20.json";
import { graphUrlFromDetails, readQueryFromGraph } from "../graph/TheGraph";

export abstract class GenericSwapUtility {
  cacheKey: string;
  whereKey: string;
  queryFields: string[];
  protocol: AssetProtocol;
  chain: ChainNetwork;
  lpFee: number;
  constructor(
    cacheKey: string,
    whereKey: string,
    queryFields: string[],
    protocol: AssetProtocol,
    chain: ChainNetwork,
    lpFee: number,
  ) {
    this.cacheKey = cacheKey;
    this.whereKey = whereKey;
    this.queryFields = queryFields;
    this.protocol = protocol;
    this.chain = chain;
    this.lpFee = lpFee;
  }

  async runThirtyDaysSingleJar(depositToken: string): Promise<HistoricalYield> {
    const qFields = this.queryFields.join("\n");
    // Better to request a few extra rows to avoid having to make an additional request
    const numResults = 30;
    const query = `{
            pairDayDatas(first: ${numResults}, orderBy: date, orderDirection: desc, 
            where: {
                ${this.whereKey}: "${depositToken.toLowerCase()}"
            }
            ) {
                ${qFields}
            }
        }`;
    const resp = await readQueryFromGraph(
      query,
      graphUrlFromDetails(this.protocol, this.chain),
    );
    const ret: IExtendedPairData[] = [];
    if (resp && resp.data && resp.data.pairDayDatas) {
      for (let i = 0; i < resp.data.pairDayDatas.length; i++) {
        ret.push(this.toExtendedPairData(resp.data.pairDayDatas[i]));
      }
    }
    const r: number[] = [];
    let totalApy = 0;
    for (let i = 0; i < ret.length; i++) {
      const volume = ret[i].dailyVolumeUSD;
      const poolReserve = ret[i].reserveUSD;
      const fees = volume * this.lpFee;
      totalApy += (fees / poolReserve) * 365 * 100;
      if (i === 1 || i === 3 || i === 7 || i === 30) {
        r.push(totalApy);
      }
    }
    if (r.length === 0) return undefined;
    const d1 = r[0];
    const d3 = r.length > 1 ? r[1] : d1;
    const d7 = r.length > 2 ? r[2] : d3;
    const d30 = r.length > 3 ? r[3] : d7;
    return {
      d1: d1,
      d3: d3,
      d7: d7,
      d30: d30,
    };
  }

  async runPairDataQueryOnce(allDepositTokens: string[]) {
    const asString = '"' + allDepositTokens.join('","') + '"';
    const qFields = this.queryFields.join("\n");
    // Better to request a few extra rows to avoid having to make an additional request
    const numResults =
      allDepositTokens.length < 10 ? 20 : 2 * allDepositTokens.length;
    const query = `{
            pairDayDatas(first: ${numResults}, orderBy: date, orderDirection: desc, 
            where: {
                ${this.whereKey}_in: [${asString}]
            }
            ) {
                ${qFields}
            }
        }`;
    return await readQueryFromGraph(
      query,
      graphUrlFromDetails(this.protocol, this.chain),
    );
  }

  // Find any pairs that don't have two unique results
  findMissingPairDayDatas(allDepositTokens: string[], result: any): string[] {
    const missing: string[] = [];
    if (!result)
      //|| !result.data || !result.data.pairDayDatas)
      return allDepositTokens;

    for (let i = 0; i < allDepositTokens.length; i++) {
      const matchesToken: any[] = result.filter(
        (x) =>
          this.pairAddressFromDayData(x) === allDepositTokens[i].toLowerCase(),
      );
      const uniqueItems: any[] = [...new Set(matchesToken)];
      let found = false;
      if (uniqueItems.length > 1) {
        found = true;
      }
      if (!found) {
        missing.push(allDepositTokens[i]);
      }
    }
    return missing;
  }

  async getOrLoadAllPairDataIntoCache(model: PickleModel): Promise<any> {
    if (model.getResourceCache().get(this.cacheKey))
      return model.getResourceCache().get(this.cacheKey);

    const jars: PickleAsset[] = model
      .getAllAssets()
      .filter((x) => x.protocol === this.protocol);
    const allDepositTokens: string[] = jars.map((x) =>
      x.depositToken.addr.toLowerCase(),
    );
    let missing: string[] = [].concat(allDepositTokens);
    const maxLoops = 3;
    let result;
    for (let loop = 0; loop < maxLoops && missing.length > 0; loop++) {
      const tmp = await this.runPairDataQueryOnce(missing);
      if (!result && tmp && tmp.data && tmp.data.pairDayDatas) {
        result = tmp.data.pairDayDatas;
      } else if (result && tmp?.data?.pairDayDatas) {
        result = [...new Set(result.concat(tmp.data.pairDayDatas))];
      }
      missing = this.findMissingPairDayDatas(allDepositTokens, result);
    }

    if (result) {
      const pairs = [...new Set(result.map((x) => x.pairAddress))];
      result = pairs.reduce((acc: Array<any>, curr: any): Array<any> => {
        return acc.concat(result.filter((x) => x.pairAddress === curr));
      }, []);
    }

    model.getResourceCache().set(this.cacheKey, result);
    return result;
  }

  async getPairData(
    model: PickleModel,
    pairToken: string,
  ): Promise<IExtendedPairData> {
    const result: any = await this.getOrLoadAllPairDataIntoCache(model);
    if (result) {
      const matchesPair = result.filter(
        (x) =>
          pairToken.toLowerCase() ===
          this.pairAddressFromDayData(x).toLowerCase(),
      );
      if (matchesPair.length > 1) {
        return this.toExtendedPairData(matchesPair[1]);
      }
      if (matchesPair.length == 1) {
        return this.toExtendedPairData(matchesPair[0]);
      }
    }
    //console.log("Unable to find " + pairToken);
    return undefined;
  }

  async calculateLpApr(model: PickleModel, pair: string): Promise<number> {
    const pairData: IExtendedPairData = await this.getPairData(model, pair);
    if (pairData) {
      const apy =
        (pairData.dailyVolumeUSD / pairData.reserveUSD) *
        this.lpFee *
        365 *
        100;
      return apy;
    }
    return 0;
  }

  abstract pairAddressFromDayData(dayData: any): string;
  abstract toExtendedPairData(pair: any): IExtendedPairData;
}

export interface IPairData {
  reserveUSD: number;
  totalSupply: number;
  pricePerToken: number;
}

export interface IExtendedPairData extends IPairData {
  pairAddress: string;
  reserveUSD: number;
  dailyVolumeUSD: number;
  reserve0: number;
  reserve1: number;
  token0Id: string;
  token1Id: string;
  totalSupply: number;
  pricePerToken: number;
}

export async function getLivePairDataFromContracts(
  jar: PickleAsset,
  model: PickleModel,
  depositTokenDecimals: number,
): Promise<IPairData> {
  const pairAddress: string = jar.depositToken.addr;

  const componentA = jar.depositToken.components[0];
  const componentB = jar.depositToken.components[1];
  const addressA = model.address(componentA, jar.chain);
  const addressB = model.address(componentB, jar.chain);

  // setup contracts
  const multiProvider = model.multiproviderFor(jar.chain);
  const tokenA = new Contract(addressA, erc20Abi);
  const tokenB = new Contract(addressB, erc20Abi);
  const pair = new Contract(pairAddress, erc20Abi);

  const [numAInPairBN, numBInPairBN, totalSupplyBN] = await multiProvider.all([
    tokenA.balanceOf(pairAddress),
    tokenB.balanceOf(pairAddress),
    pair.totalSupply(),
  ]);
  // get num of tokens
  const numAInPair =
    numAInPairBN / Math.pow(10, model.tokenDecimals(componentA, jar.chain));
  const numBInPair =
    numBInPairBN / Math.pow(10, model.tokenDecimals(componentB, jar.chain));

  // get prices
  const priceA = model.priceOfSync(addressA, jar.chain);
  const priceB = model.priceOfSync(addressB, jar.chain);

  let reserveUSD;
  // In case price one token is not listed on coingecko
  if (priceA && priceB) {
    reserveUSD = priceA * numAInPair + priceB * numBInPair;
  } else if (priceA) {
    reserveUSD = 2 * priceA * numAInPair;
  } else {
    reserveUSD = 2 * priceB * numBInPair;
  }

  const totalSupply = totalSupplyBN / Math.pow(10, depositTokenDecimals);
  const pricePerToken = reserveUSD / totalSupply;

  return { reserveUSD, totalSupply, pricePerToken };
}
