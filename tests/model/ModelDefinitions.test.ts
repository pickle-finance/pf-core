import { isBuffer } from "util";
import { JarBehaviorDiscovery } from "../../src/behavior/JarBehaviorDiscovery";
import { ALL_ASSETS} from "../../src/model/JarsAndFarms";
import { AssetEnablement, AssetType, PickleAsset } from "../../src/model/PickleModelJson";
import { ExternalTokenModelSingleton } from "../../src/price/ExternalTokenModel";

describe('Testing defined model', () => {

  test('Ensure no duplicate ids', async () => {
    const err = [];
    const tmp = [];
    for( let i = 0; i < ALL_ASSETS.length; i++ ) {
      if( tmp.includes(ALL_ASSETS[i].id)) {
        err.push("Duplicate ID: " + ALL_ASSETS[i].id);
      }
      tmp.push(ALL_ASSETS[i].id);
    }
    console.log("Errors: " + JSON.stringify(err));
    expect(err.length).toBe(0);
  }); 


  test('Ensure no duplicate contracts', async () => {
    const err = [];
    const tmp = [];
    for( let i = 0; i < ALL_ASSETS.length; i++ ) {
      if( tmp.includes(ALL_ASSETS[i].contract)) {
        err.push("Duplicate ID: " + ALL_ASSETS[i].contract);
      }
      tmp.push(ALL_ASSETS[i].contract);
    }
    console.log("Errors: " + JSON.stringify(err));
    expect(err.length).toBe(0);
  }); 

  test('Ensure all active assets have a protocol', async () => {
    const err = [];
    const usedKeys = [];
    for( let i = 0; i < ALL_ASSETS.length; i++ ) {
      if( ALL_ASSETS[i].enablement !== AssetEnablement.PERMANENTLY_DISABLED) {
        if( ALL_ASSETS[i].details.apiKey === undefined ) {
          err.push("Asset " + ALL_ASSETS[i].id + " has no api key");
        }
        if( usedKeys.includes(ALL_ASSETS[i].details.apiKey)) {
          err.push("Asset " + ALL_ASSETS[i].id + " has a duplicate API key");
        }
        usedKeys.push(ALL_ASSETS[i].details.apiKey);
      }
    }
    console.log("Errors: " + JSON.stringify(err));
    expect(err.length).toBe(0);
  }); 

  test('Ensure all active assets have a behavior', async () => {
    const err = [];
    const discovery : JarBehaviorDiscovery = new JarBehaviorDiscovery();
    for( let i = 0; i < ALL_ASSETS.length; i++ ) {

      // TODO farms need to be brought into the fold here
      if( ALL_ASSETS[i].enablement !== AssetEnablement.PERMANENTLY_DISABLED
         && ALL_ASSETS[i].type !== AssetType.STANDALONE_FARM) {
        const behavior = discovery.findAssetBehavior(ALL_ASSETS[i]);
        if( behavior === undefined || behavior === null ) {
          err.push("Asset " + ALL_ASSETS[i].id + " has no associated behavior file");
        }
      }
    }
    console.log("Errors: " + JSON.stringify(err));
    expect(err.length).toBe(0);
  }); 


  test('Ensure all deposit token components are in the external token model', async () => {
    const err = [];
    for( let i = 0; i < ALL_ASSETS.length; i++ ) {
      const components = ALL_ASSETS[i].depositToken.components;
      if( components ) {
        for( let j = 0; j < components.length; j++ ) {
          const token = ExternalTokenModelSingleton.getToken(components[j], ALL_ASSETS[i].chain);
          if( token === undefined || token === null ) {
            err.push("Token " + components[j] + " on chain " + ALL_ASSETS[i].chain + " is not found in the ExternalTokenModel");
          }
        }
      }
    }
    console.log("Errors: " + JSON.stringify(err));
    expect(err.length).toBe(0);
  }); 
});
