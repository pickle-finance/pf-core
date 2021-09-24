import { JAR_USDC, JAR_lusdCRV, JAR_fraxCRV, JAR_SADDLE_D4, JAR_ALETH, JAR_steCRV, JAR_AM3CRV, JAR_MIM3CRV, JAR_CRV_IB, JAR_sCRV, JAR_renCRV } from "../model/JarsAndFarms";
import { PickleModel } from "../model/PickleModel";
import { AssetProtocol, PickleAsset, SWAP_PROTOCOLS } from "../model/PickleModelJson";
import { getLivePairDataFromContracts } from "../protocols/GenericSwapUtil";
import CurvePoolABI from "../Contracts/ABIs/curve-pool.json";
import MetaPoolABI from "../Contracts/ABIs/meta-pool.json";
import { ethers } from 'ethers';
import { Provider } from '@ethersproject/providers';

function isGenericSwapProtocol(protocol: string) : boolean {
    return SWAP_PROTOCOLS.filter((x)=>x.toString() === protocol).length > 0;
}

export async function getDepositTokenPriceForSwap(asset: PickleAsset, model: PickleModel) : Promise<number> {
    return (await getLivePairDataFromContracts(asset, model, 18)).pricePerToken;
}

export async function getContractPrice(id: string, model: PickleModel): Promise<number> {
    try {
        return (await model.priceOf(id.toLowerCase()));
    } catch (e) {
        return undefined;
    }
}



export async function getStableswapPrice(asset: PickleAsset, model: PickleModel) {
    return getStableswapPriceAddress(asset.depositToken.addr, asset, model);
}
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
    return parseFloat(ethers.utils.formatEther(virtualPrice));
  };


    /*
    A lot of this is wrong. Don't know which repo I copied it from.
    */
    export async function getDepositTokenPrice(asset: PickleAsset, model: PickleModel): Promise<number> {
        // first, always check the cache
        const depTokenAddr = asset.depositToken.addr;
        const checkCache = model.priceOfSync(depTokenAddr);
        if( checkCache )
            return checkCache;

        // Is this necessary?
        if( depTokenAddr === JAR_USDC.depositToken.addr) {
            return getContractPrice(depTokenAddr, model)
        } 
        if( asset.protocol === AssetProtocol.TOKENPRICE )
            return getContractPrice(depTokenAddr, model);

        const isSwapUtil : boolean = isGenericSwapProtocol(asset.protocol);        
        if( isSwapUtil ) {
            return getDepositTokenPriceForSwap(asset, model);
        }

        if( depTokenAddr === JAR_lusdCRV.depositToken.addr || 
            depTokenAddr === JAR_fraxCRV.depositToken.addr) {
            return getStableswapPrice(asset, model);
        }
        if( depTokenAddr === JAR_renCRV.depositToken.addr) {
            return (await getStableswapPriceAddress("0x93054188d876f558f4a66B2EF1d97d16eDf0895B",
             asset, model)) * model.priceOfSync("wbtc");
        }
        if( depTokenAddr === JAR_sCRV.depositToken.addr) {
            return (await getStableswapPriceAddress("0xA5407eAE9Ba41422680e2e00537571bcC53efBfD",
             asset, model));
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
                    * (await getContractPrice("weth", model));
        }
        
        if( asset.protocol === AssetProtocol.AAVE_POLYGON) {
            return model.priceOfSync("dai");
        } 
        if( depTokenAddr === JAR_ALETH.depositToken.addr ) {
            return getContractPrice("weth", model);
        }
        if( depTokenAddr === JAR_CRV_IB.depositToken.addr) {
            return 1;
        }

        return undefined;
    }