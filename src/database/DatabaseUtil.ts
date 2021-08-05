import { ethers } from "ethers";
import AWS from 'aws-sdk';

if( !process.env.AWS_ACCESS_KEY_ID) {
  process.env.AWS_ACCESS_KEY_ID='AKIAWGTBZFDSLCIUVTVF';
}
if( !process.env.AWS_SECRET_ACCESS_KEY) {
  process.env.AWS_SECRET_ACCESS_KEY='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';
}
AWS.config.update({region:'us-west-1'});
const ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });

export async function getAssetData(table: string, asset: string, count: number) : Promise<any> {
    let params : any;
    if( count ) {
      params = {
        TableName: table,
        KeyConditionExpression: "asset = :asset",
        ExpressionAttributeValues: {
          ":asset": asset
        },
        Limit: count,
        ScanIndexForward: false
      };  
    } else {
      params = {
        TableName: table,
        KeyConditionExpression: "asset = :asset",
        ExpressionAttributeValues: {
          ":asset": asset
        }
      };
    } 
  
    const data = await ddb.query(params).promise();
    return count ? data.Items.reverse() : data.Items;
  };
  
  export async function getFarmApy (address:string) : Promise<any> {
    let params = {
      TableName: process.env.FARM_DATA,
      KeyConditionExpression: "address = :address",
      ExpressionAttributeValues: {
        ":address": ethers.utils.getAddress(address)
      },
      Limit: 1,
      ScanIndexForward: false
    };
  
    const data = await ddb.query(params).promise();
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