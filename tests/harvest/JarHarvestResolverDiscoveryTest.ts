import { JarHarvestResolver } from "../../src/harvest/JarHarvestResolver";
import { JarHarvestResolverDiscovery } from "../../src/harvest/JarHarvestResolverDiscovery";
import { JAR_DEFINITIONS, JAR_sCRV } from "../../src/model/JarsAndFarms";
import { AssetEnablement } from "../../src/model/PickleModelJson";

describe('Discovery for jar harvest data', () => {

  test('Check all enabled jars have a resolver', async () => {
    const jars2 = JAR_DEFINITIONS.filter((element) => { 
      return element.enablement !== AssetEnablement.PERMANENTLY_DISABLED && element.id !== JAR_sCRV.id});
    const errors : string[] = [];
    for( let i = 0; i < jars2.length; i++ ) {
      const resolver : JarHarvestResolver = new JarHarvestResolverDiscovery().findHarvestResolver(jars2[i]);
      if( resolver === undefined ) {
        errors.push("Jar " + jars2[i].id + " should have a jar harvest resolver in JarHarvestResolverDiscovery");
      }
    }
    console.log(errors);
    expect(errors.length).toBe(0);
  }); 
});
