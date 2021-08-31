import { ethers } from "ethers";
import { JarDefinition } from "../model/PickleModelJson";

/**
 * This file is not used currently. Might be deleted. 
 */
export const CURRENT = 0;
export const ONE_DAY = 48;
export const THREE_DAYS = ONE_DAY * 3;
export const SEVEN_DAYS = ONE_DAY * 7;
export const THIRTY_DAYS = ONE_DAY * 30;
export const SAMPLE_DAYS = THIRTY_DAYS + 1;
export const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

export interface AssetDatabaseEntry {
  asset:string,
	balance:number,
	height:number,
	ratio:number,
	supply:number,
	timestamp:number,
	value:number,
}

export interface FarmDatabaseEntry {
  apy: number,
  valuePerHour: number
  address: string,
  valueBalance: number,
  valuePerBlock: number,
  tokenAddress: string,
  allocShare: number,
  gaugeAddress: string,
  valuePerDay: number,
  tokenBalance: number,
  picklePerBlock: number,
  picklePerHour: number,
  picklePerDay: number,
}

export interface XY {
  x: number,
  y: number,
}
/*

export async function getJarAssetSingleDataSingle(asset: JarDefinition, before: number) : Promise<AssetDatabaseEntry> {
  let params : any;
  if( before ) {
    params = {
      TableName: "asset",
      KeyConditionExpression: "asset = :asset",
      FilterExpression : '#tskey <> :tsval',
      ExpressionAttributeValues: {
        ":asset": asset.details.apiKey.toLowerCase(),
        ":tsval": before,
      },
      ExpressionAttributeNames: {
        "#tskey": "timestamp"
      },
      Limit: SAMPLE_DAYS,
      PageSize: 1,
      ScanIndexForward: false
    };  
  } else {
    params = {
      TableName: "asset",
      KeyConditionExpression: "asset = :asset",
      ExpressionAttributeValues: {
        ":asset": asset.details.apiKey.toLowerCase()
      },
      Limit: 1,
      ScanIndexForward: false,
    };  
  } 

  const data = await ddb.query(params).promise();
  // @ts-ignore
  return data.Items;
};


export async function getJarAssetData(asset: JarDefinition, count: number = SAMPLE_DAYS) : Promise<AssetDatabaseEntry[]> {
    let params : any;
    if( count ) {
      params = {
        TableName: "asset",
        KeyConditionExpression: "asset = :asset",
        ExpressionAttributeValues: {
          ":asset": asset.details.apiKey.toLowerCase()
        },
        Limit: count,
        ScanIndexForward: false
      };  
    } else {
      params = {
        TableName: "asset",
        KeyConditionExpression: "asset = :asset",
        ExpressionAttributeValues: {
          ":asset": asset.details.apiKey.toLowerCase()
        }
      };
    } 
  
    const data = await ddb.query(params).promise();
    // @ts-ignore
    return count ? data.Items.reverse() : data.Items;
  };
  
  export async function getFarmDatabaseEntry (definition: JarDefinition) : Promise<FarmDatabaseEntry> {
    let params = {
      TableName: "farm",
      KeyConditionExpression: "address = :address",
      ExpressionAttributeValues: {
        ":address": ethers.utils.getAddress(definition.contract.toLowerCase())
      },
      Limit: 1,
      ScanIndexForward: false
    };
  
    const data = await ddb.query(params).promise();
    // @ts-ignore
    return data.Items.reverse()[0];
  };
  
  export async function getIndexedBlock(table: string, asset : string, createdBlock: number) : Promise<number> {
    const params = {
      TableName: table,
      KeyConditionExpression: "asset = :asset",
      ExpressionAttributeValues: {
        ":asset": asset
      },
      ScanIndexForward: false,
      Limit: 1
    };
    let result = await ddb.query(params).promise();
    return result.Items.length > 0 ? result.Items[0].height : createdBlock;
  };

  export async function getJarPerformance(asset: JarDefinition, count?: number ) : Promise<XY[]> {
    let data : any[] = await getJarAssetData(asset, count);
    // Is this code valid? 
    if (asset.details.apiKey === "cdai") {
      const diffRatio = data[0].ratio - 1;
      data = data.map(d => {
        d.ratio -= diffRatio;
        return d;
      });
    }
    return data.map(item => ({x: item.timestamp, y: parseFloat(item.ratio)}));
  }
  */