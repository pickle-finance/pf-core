import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import { ChainNetwork } from "../chain/Chains";
import { PickleModel } from "../model/PickleModel";
import { PickleAndUserModel, PickleAsset } from "../model/PickleModelJson";
import { ALL_ASSETS } from "../model/JarsAndFarms";
import { UserData, UserModel } from "../client/UserModel";
export class PFCore {
    public static createPickleModel( 
        chains: Map<ChainNetwork, Provider | Signer>,): PickleModel {
        return new PickleModel(ALL_ASSETS, chains);
    }
    public static createPickleModelForAssets(
        assets: PickleAsset[], 
        chains: Map<ChainNetwork, Provider | Signer>,): PickleModel {
        return new PickleModel(assets, chains);
    }
    public static createPickleModelForSingleAsset(
        asset: string, 
        chains: Map<ChainNetwork, Provider | Signer>,): PickleModel | undefined {
        const onePickleAsset: PickleAsset = ALL_ASSETS.find((x) => x.details && x.details.apiKey && x.details.apiKey.toLowerCase() === asset.toLowerCase() );
        if( onePickleAsset === undefined )
            return undefined;

        const ret: PickleModel = new PickleModel([onePickleAsset], chains);
        ret.setConfiguredChains([onePickleAsset.chain]);
        return ret;
    }
    public static async createPickleModelAndUserModelForSingleAsset(
        asset: string, 
        wallet: string,
        chains: Map<ChainNetwork, Provider | Signer>,): Promise<PickleAndUserModel | undefined> {
        const onePickleAsset: PickleAsset = ALL_ASSETS.find((x) => x.details && x.details.apiKey && x.details.apiKey.toLowerCase() === asset.toLowerCase() );
        if( onePickleAsset === undefined )
            return undefined;

        const ret: PickleModel = new PickleModel([onePickleAsset], chains);
        ret.setConfiguredChains([onePickleAsset.chain]);
        const result = await ret.generateMinimalApi();
        const um: UserModel = new UserModel(result, wallet, chains);
        const userResult: UserData = await um.generateMinimalModel();
        const toReturn = {
            pickleModel: result,
            userModel: userResult,
        };
        console.log(JSON.stringify(toReturn, null, 2));
        return toReturn;
    }
}

export const PFCoreSingleton = new PFCore();