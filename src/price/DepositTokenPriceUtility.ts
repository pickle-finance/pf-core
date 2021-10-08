import { JAR_USDC, JAR_lusdCRV, JAR_fraxCRV, JAR_SADDLE_D4, JAR_ALETH, JAR_steCRV, JAR_AM3CRV, JAR_MIM3CRV, JAR_CRV_IB, JAR_sCRV, JAR_renCRV, JAR_CURVE_CVXCRVLP, JAR_CVXCRV } from "../model/JarsAndFarms";
import { PickleModel } from "../model/PickleModel";
import { AssetProtocol, PickleAsset, SWAP_PROTOCOLS } from "../model/PickleModelJson";
import { getLivePairDataFromContracts } from "../protocols/GenericSwapUtil";
import CurvePoolABI from "../Contracts/ABIs/curve-pool.json";
import MetaPoolABI from "../Contracts/ABIs/meta-pool.json";
import { ethers } from 'ethers';
import { Provider } from '@ethersproject/providers';

/*
    Most of this class has been moved into the jar behavior classes directly. 
    What remains are either generic functions that cover wide swaths of jars 
    (sushi, uni, curve, etc) or the few leftovers with no home. 
*/
function isGenericSwapProtocol(protocol: string) : boolean {
    return SWAP_PROTOCOLS.filter((x)=>x.toString() === protocol).length > 0;
}

export async function getDepositTokenPriceForSwap(asset: PickleAsset, model: PickleModel) : Promise<number> {
    return (await getLivePairDataFromContracts(asset, model, 18)).pricePerToken;
}

/*
    Use the deposit token itself (instead of some staking location) as the stableswap address
*/
export async function getStableswapPrice(asset: PickleAsset, model: PickleModel) {
    return getStableswapPriceAddress(asset.depositToken.addr, asset, model);
}

/*
    This function only returns the virtual price!
    It is important for callers to multiply the result by the 
    lowest value asset in the pool!

    ie, for eth-steth, you should multiply this result by min(weth, steth)
    and for crv/cvxcrv you should multiply this result by min(cvx, cvxcrv)
    and so on... 
*/
export async function getStableswapPriceAddress(addr: string, asset: PickleAsset, model: PickleModel) {
    const curveStyle = asset.protocol === AssetProtocol.CURVE || asset.protocol === AssetProtocol.YEARN;
    const provider : Provider = model.providerFor(asset.chain);
    const PoolABI = curveStyle ? CurvePoolABI : MetaPoolABI;
  
    const pool = new ethers.Contract(addr, PoolABI, provider);
    let virtualPrice = 0;
    try {
        virtualPrice =  await (curveStyle ? pool.get_virtual_price() : pool.getVirtualPrice());
    } catch(e) {
    }
    /* TODO explore if this is necessary
    let lowest : number | undefined = undefined;
    const components = asset.depositToken.components;
    for( let i = 0; i < components.length; i++ ) {
        const p = model.priceOfSync(components[i]);
        if( p !== undefined ) {
            if(lowest === undefined || p < lowest) {
                lowest = p;
            }
        }
    }
    const virtPrice = parseFloat(ethers.utils.formatEther(virtualPrice));
    if( lowest !== undefined ) {
        return lowest * virtPrice;
    }
    return virtPrice;
    */

    return parseFloat(ethers.utils.formatEther(virtualPrice));
  };


    /*
     Most of this has been moved to the actual jar behavior classes. 
     What remains here is mostly junk with no home or generic methods 
     in use by many that I haven't had a chance to move yet. 
    */
    export async function getDepositTokenPrice(asset: PickleAsset, model: PickleModel): Promise<number> {
        // first, always check the cache or generic tokens for deposit
        const depTokenAddr = asset.depositToken.addr;
        const checkCache = model.priceOfSync(depTokenAddr);
        if( checkCache )
            return checkCache;
        if( asset.protocol === AssetProtocol.TOKENPRICE )
            return model.priceOfSync(depTokenAddr);

        // Next check if its a common swap utility
        const isSwapUtil : boolean = isGenericSwapProtocol(asset.protocol);        
        if( isSwapUtil ) {
            return getDepositTokenPriceForSwap(asset, model);
        }

        // The rest of this is leftover. 
        // The jars below don't have a behavior class currently.
        if( depTokenAddr === JAR_sCRV.depositToken.addr) {
            return (await getStableswapPriceAddress(
                "0xA5407eAE9Ba41422680e2e00537571bcC53efBfD",asset, model));
        }
        
        if( depTokenAddr === JAR_AM3CRV.depositToken.addr) {
            return getStableswapPriceAddress("0x445fe580ef8d70ff569ab36e80c647af338db351", asset, model);
        }
        if( depTokenAddr === JAR_SADDLE_D4.depositToken.addr) {
            return getStableswapPriceAddress("0xc69ddcd4dfef25d8a793241834d4cc4b3668ead6", asset, model);
        } 
        if( depTokenAddr === JAR_MIM3CRV.depositToken.addr) {
            return getStableswapPrice(asset, model);
        }
        if( asset.protocol === AssetProtocol.IRON_POLYGON) {
            return getStableswapPriceAddress("0x837503e8a8753ae17fb8c8151b8e6f586defcb57", asset, model);
        }
        if( depTokenAddr === JAR_steCRV.depositToken.addr) {
            return (await getStableswapPriceAddress("0xdc24316b9ae028f1497c275eb9192a3ea0f67022", asset, model)) 
                    * (model.priceOfSync("weth"));
        }
        if( depTokenAddr === JAR_CURVE_CVXCRVLP.depositToken.addr) {
            const r = (await getStableswapPriceAddress("0x9D0464996170c6B9e75eED71c68B99dDEDf279e8", asset, model)) 
                    * (model.priceOfSync("cvxcrv"));
            return r;
        }
        if(depTokenAddr === JAR_CVXCRV.depositToken.addr) {
            return model.priceOfSync("cvxcrv")
        }
        
        if( asset.protocol === AssetProtocol.AAVE_POLYGON) {
            return model.priceOfSync("dai");
        } 
        if( depTokenAddr === JAR_ALETH.depositToken.addr ) {
            return model.priceOfSync("weth");
        }

        return undefined;
    }