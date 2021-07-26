//import { Chain } from "./chain/ChainModel";
import { Chain } from "./chain/ChainModel";
import { allAssets } from "./model/PickleModel";
import { PriceCache } from "./price/PriceCache";
import { SwapTokenPriceResolver } from "./price/SwapTokenPriceResolver";

const resolver : SwapTokenPriceResolver = new SwapTokenPriceResolver(allAssets);
const ethAssets = allAssets.filter(asset => asset.chain === Chain.Ethereum);
const cache : PriceCache = new PriceCache();
for( let i = 0; i < ethAssets.length; i++ ) {
  resolver.getOrResolve([ethAssets[i].depositToken], cache).then(res => {
      if( res.get(ethAssets[i].depositToken) === undefined ) {
        console.log(ethAssets[i].id + ": " + ethAssets[i].protocol);
        console.log(res);
        }
  });
}
