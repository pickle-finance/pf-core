import { JarBehavior } from "../../src/harvest/JarBehavior";
import { JarBehaviorDiscovery } from "../../src/harvest/JarBehaviorDiscovery";
import { JAR_DEFINITIONS, JAR_sCRV } from "../../src/model/JarsAndFarms";
import { AssetEnablement } from "../../src/model/PickleModelJson";

describe('Discovery for jar harvest data', () => {

  test('Check all enabled jars have a resolver', async () => {
    const jars2 = JAR_DEFINITIONS.filter((element) => { 
      return element.enablement !== AssetEnablement.PERMANENTLY_DISABLED && element.id !== JAR_sCRV.id});
    const errors : string[] = [];
    for( let i = 0; i < jars2.length; i++ ) {
      const resolver : JarBehavior = new JarBehaviorDiscovery().findHarvestResolver(jars2[i]);
      if( resolver === undefined ) {
        errors.push("Jar " + jars2[i].id + " should have a jar harvest resolver in JarBehaviorDiscovery");
      }
    }
    console.log(errors);
    expect(errors.length).toBe(0);
  }); 
});
