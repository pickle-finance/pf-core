import { ChainNetwork } from "../../src/chain/Chains";
import { JAR_DEFINITIONS } from "../../src/model/JarsAndFarms";
import { AssetEnablement, JarDefinition } from "../../src/model/PickleModelJson";
import { CoinGeckoPriceResolver } from "../../src/price/CoinGeckoPriceResolver";
import { DepositTokenPriceResolver } from "../../src/price/DepositTokenPriceResolver";
import { ExternalToken, ExternalTokenFetchStyle, ExternalTokenModelSingleton } from "../../src/price/ExternalTokenModel";
import { PriceCache, RESOLVER_COINGECKO, RESOLVER_DEPOSIT_TOKEN} from "../../src/price/PriceCache";

describe('Testing Deposit Token Resolver', () => {

  async function initTest() : Promise<PriceCache> {
    const pc : PriceCache = new PriceCache();
    pc.addResolver(RESOLVER_COINGECKO, new CoinGeckoPriceResolver(ExternalTokenModelSingleton));
    pc.addResolver(RESOLVER_DEPOSIT_TOKEN, new DepositTokenPriceResolver(JAR_DEFINITIONS));
    const arr: string[] = ExternalTokenModelSingleton.getTokens(ChainNetwork.Ethereum).filter(val => val.fetchType != ExternalTokenFetchStyle.NONE).map(a => a.id);
    await pc.getPrices(arr, RESOLVER_COINGECKO);
    const arr2: string[] = ExternalTokenModelSingleton.getTokens(ChainNetwork.Polygon).filter(val => val.fetchType != ExternalTokenFetchStyle.NONE).map(a => a.id);
    await pc.getPrices(arr2, RESOLVER_COINGECKO);
    return pc;
  }

  test('Make sure all jar deposit tokens have a price', async () => {
    const enabled : JarDefinition[] = JAR_DEFINITIONS.filter((x)=> {return x.enablement !== AssetEnablement.PERMANENTLY_DISABLED});
    const errors : string[] = [];
    const pc : PriceCache = await initTest();
    for( let i = 0; i < enabled.length; i++ ) {
      const val : number = await pc.getPrice(enabled[i].depositToken.addr, RESOLVER_DEPOSIT_TOKEN);
      if( val === undefined || val === 0 ) {
        errors.push("Expect deposit token for jar " + enabled[i].id + " to be discovered in DepositTokenPriceResolver");
      }
    }
    console.log(errors);
    expect(errors.length).toBe(0);
}, 60000); 

  test('Make sure all deposit token components are in the external token model', async () => {
    const enabled : JarDefinition[] = JAR_DEFINITIONS.filter((x)=> {return x.enablement !== AssetEnablement.PERMANENTLY_DISABLED});
    const errors : string[] = [];
    for( let i = 0; i < enabled.length; i++ ) {
      if( enabled[i].depositToken.components ) {
        const components : string[] = enabled[i].depositToken.components;
        for( let j = 0; j < components.length; j++ ) {
          const externalToken : ExternalToken = ExternalTokenModelSingleton.getToken(components[j], enabled[i].chain);
          if( externalToken === undefined ) {
            errors.push("Component " + components[j] + " for jar " + enabled[i].id + " should be in the ExternalTokenModel");
          }
        }
      }
    }
    console.log(errors);
    expect(errors.length).toBe(0);
  }); 
});
