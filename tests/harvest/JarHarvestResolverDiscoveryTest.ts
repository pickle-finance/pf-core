import { Chain } from "../../src/chain/ChainModel";
import { JarHarvestResolver } from "../../src/harvest/JarHarvestResolver";
import { JarHarvestResolverDiscovery } from "../../src/harvest/JarHarvestResolverDiscovery";
import { jars } from "../../src/model/JarsAndFarms";
import { AssetEnablement } from "../../src/model/PickleModelJson";

describe('Discovery for jar harvest data', () => {

  test('Check all enabled jars have a resolver', async () => {
    const jars2 = jars.filter((element) => { 
      return element.enablement === AssetEnablement.ENABLED && element.chain === Chain.Ethereum
    });
    for( let i = 0; i < jars2.length; i++ ) {
      const resolver : JarHarvestResolver = new JarHarvestResolverDiscovery().findHarvestResolver(jars2[i]);
      expect(resolver).toBeDefined();
    }
  }); 
});
