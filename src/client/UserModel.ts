import { Provider } from "@ethersproject/abstract-provider";
import { Signer } from "@ethersproject/abstract-signer";
import { Provider as MulticallProvider, Contract as MulticallContract} from 'ethers-multicall';
import { BigNumber } from "@ethersproject/bignumber";
import { ChainNetwork, Chains, PickleModelJson } from "..";
import { getUserJarSummary, IUserEarningsSummary } from "./UserEarnings";
import { JAR_DEFINITIONS, NULL_ADDRESS } from '../model/JarsAndFarms';
import erc20Abi from '../Contracts/ABIs/erc20.json';
import gaugeAbi from '../Contracts/ABIs/gauge.json';
import gaugeProxyAbi from '../Contracts/ABIs/gauge-proxy.json';
import minichefAbi from '../Contracts/ABIs/minichef.json';
import { AssetEnablement, JarDefinition } from '../model/PickleModelJson';
import { ADDRESSES } from '../model/PickleModel';
import { Contract } from '@ethersproject/contracts';
import { Dill, Dill__factory, FeeDistributor, FeeDistributor__factory } from "../Contracts/ContractsImpl";

export interface UserTokenData {
    assetKey: string,
    depositTokenBalance: string,
    pAssetBalance: string,
    pStakedBalance: string,
    picklePending: string,
}
export interface UserData {
    tokens: UserTokenData[],
    earnings: IUserEarningsSummary,
    votes: IUserVote[],
    dill: IUserDillStats,
    pickles: UserPickles,
}

export interface UserPickles {
    [key: string]: string;
}

export interface IUserDillStats {
    pickleLocked: string,
    lockEnd: string,
    balance: string,
    claimable: string,
};
export interface IUserVote {
    farmDepositToken: string,
    weight: string,
}
export class UserModel {
    model: PickleModelJson.PickleModelJson;
    walletId: string;
    constructor(model: PickleModelJson.PickleModelJson, walletId: string, rpcs: Map<ChainNetwork, Provider | Signer>) {
        this.model = model;
        this.walletId = walletId;
        Chains.globalInitialize(rpcs);
    }

    async generateUserModel(): Promise<UserData> {
        const [tokens, earnings,votes, dill, pickles] = await Promise.all([
            this.getUserTokens(),
            this.getUserEarningsSummary(),
            this.getUserGaugeVotes(),
            this.getUserDillStats(),
            this.getUserPickles(),
        ]);
        return {
            pickles: pickles,
            tokens: tokens,
            earnings: earnings,
            votes: votes,
            dill: dill,
        }
    }


    async getUserPickles(): Promise<UserPickles> {
        try {
            const ret : UserPickles = {};
            await Promise.all(Chains.list().map(async (x)=> {
                let r : BigNumber = BigNumber.from(0);
                if( ADDRESSES.get(x) && ADDRESSES.get(x).pickle !== undefined && ADDRESSES.get(x).pickle !== NULL_ADDRESS) {
                    const contract = new Contract(ADDRESSES.get(x).pickle, erc20Abi, this.providerFor(x));
                    r = await contract.balanceOf(this.walletId).catch(() => BigNumber.from("0"));
                }
                ret[x.toString()] = r.toString();
            }));
            return ret;
        } catch( err ) {
            console.log("getUserPickles failed: " + err);
            throw err;
        }
    }

    async getUserTokens(): Promise<UserTokenData[]> {
        try {
            const ret : UserTokenData[] = [];
            const result = await Promise.all(Chains.list().map((x)=>this.getUserTokensSingleChain(x)));
            for( let i = 0; i < result.length; i++ ) {
                ret.push(...result[i]);
            }
            return ret;
        } catch( err ) {
            console.log("getUserTokens failed: " + err);
            throw err;
        }
    }

    isErc20Underlying(asset: JarDefinition) : boolean {
        return asset.depositToken.style === undefined || 
            asset.depositToken.style.erc20 === true;
    }

    async getUserTokensSingleChain(chain: ChainNetwork) : Promise<UserTokenData[]> {
        const ret = [];
        const chainAssets = JAR_DEFINITIONS.filter((x)=>x.chain===chain 
            && x.enablement !== AssetEnablement.PERMANENTLY_DISABLED
            && this.isErc20Underlying(x));
        
        const provider : MulticallProvider = this.multicallProviderFor(chain);
        const depositTokenBalancesPromise : Promise<BigNumber[]> = provider.all(
            chainAssets.map((x)=>{
                const mcContract = new MulticallContract(x.depositToken.addr, erc20Abi);
                return mcContract.balanceOf(this.walletId);
            })
        );

        const provider2 : MulticallProvider = this.multicallProviderFor(chain);
        const pTokenBalancesPromise : Promise<BigNumber[]> = provider2.all(
            chainAssets.map((x)=>{
                const mcContract = new MulticallContract(x.contract, erc20Abi);
                return mcContract.balanceOf(this.walletId);
            })
        );

        let stakedInFarmPromise : Promise<BigNumber[]> = undefined;
        let picklePendingPromise : Promise<BigNumber[]> = undefined;
        if( chain === ChainNetwork.Ethereum) {
            stakedInFarmPromise = this.getStakedInFarmEth(chain, chainAssets);
            picklePendingPromise = this.getPicklePendingEth(chain, chainAssets);
        } else {
            const chef = ADDRESSES.get(chain).minichef;
            const skip : boolean = chef === null || chef === undefined || chef === NULL_ADDRESS;
            if( skip ) {
                stakedInFarmPromise = Promise.resolve(chainAssets.map(()=>(BigNumber.from(0))));
                picklePendingPromise = Promise.resolve(chainAssets.map(()=>(BigNumber.from(0))));
            } else {
                const poolLengthBN : BigNumber = skip ? BigNumber.from(0) : await (new Contract(chef, minichefAbi, this.providerFor(chain))).poolLength();
                const poolLength = parseFloat(poolLengthBN.toString());
                const poolIds: number[] = Array.from(Array(poolLength).keys());
                const multicallProvider = new MulticallProvider(this.providerFor(chain));
                await multicallProvider.init();    
                const miniChefMulticall : MulticallContract = new MulticallContract(chef, minichefAbi);
                const lpTokens: string[] = await multicallProvider.all(
                    poolIds.map((id) => {
                        return miniChefMulticall.lpToken(id);
                    })
                );
                const lpLower : string[] = lpTokens.map((x)=>x.toLowerCase());
                stakedInFarmPromise = this.getStakedInFarmMinichef(chain, chainAssets, poolIds, lpLower);
                picklePendingPromise = this.getPicklePendingMinichef(chain, chainAssets, poolIds, lpLower);
            }
        }

        const [depositTokenBalances, pTokenBalances, stakedInFarm, picklePending] 
            = await Promise.all([depositTokenBalancesPromise, pTokenBalancesPromise, stakedInFarmPromise, picklePendingPromise]);

        for( let j = 0; j < chainAssets.length; j++ ) {
            const toAdd = {
                assetKey: chainAssets[j].details.apiKey,
                depositTokenBalance: depositTokenBalances[j]?.toString() ||"0",
                pAssetBalance: pTokenBalances[j]?.toString() || "0",
                pStakedBalance: stakedInFarm[j]?.toString() || "0",
                picklePending: picklePending[j]?.toString() || "0",
            };
            const allZeros : boolean = toAdd.depositTokenBalance === "0" &&
                toAdd.pAssetBalance === "0" &&
                toAdd.pStakedBalance === "0" &&
                toAdd.picklePending === "0";
                
            if( !allZeros )
                ret.push(toAdd);
        }
        return ret;
    }

    async getStakedInFarmEth(chain: ChainNetwork, chainAssets: JarDefinition[]) : Promise<BigNumber[]> {
        const filteredChainAssets = chainAssets.filter((x)=>x.farm && x.farm.farmAddress);
        const provider : MulticallProvider = this.multicallProviderFor(chain);
        const stakedBalances : BigNumber[] = await provider.all(
            filteredChainAssets.map((x)=>{
                const mcContract = new MulticallContract(x.farm.farmAddress, gaugeAbi);
                return mcContract.balanceOf(this.walletId);
            })
        );

        // return an array with the same indexes as in the input jar
        // since we filtered them, they don't exactly match up right now
        return this.normalizeIndexes(chainAssets, filteredChainAssets, stakedBalances, BigNumber.from(0));
    }

    async getStakedInFarmMinichef(chain: ChainNetwork, chainAssets: JarDefinition[],
        poolIds: number[], lpLower: string[]) : Promise<BigNumber[]> {
        const chef = ADDRESSES.get(chain).minichef;
        const multicallProvider = new MulticallProvider(this.providerFor(chain));
        await multicallProvider.init();    
        const miniChefMulticall : MulticallContract = new MulticallContract(chef, minichefAbi);

        const userInfos: any[] = await multicallProvider.all(
            poolIds.map((id) => {
            return miniChefMulticall.userInfo(id, this.walletId);
            })
        );
        const ret : BigNumber[] = [];
        for( let i = 0; i < chainAssets.length; i++ ) {
            const ind : number = lpLower.indexOf(chainAssets[i].contract.toLowerCase());
            if( ind === -1 ) {
                ret.push(BigNumber.from(0));
            } else {
                ret.push(userInfos[ind][1].toString());
            }
        }
        return ret;
    }

    async getPicklePendingEth(chain: ChainNetwork, chainAssets: JarDefinition[]) : Promise<BigNumber[]> {
        const filteredChainAssets = chainAssets.filter((x)=>x.farm && x.farm.farmAddress);
        const provider : MulticallProvider = this.multicallProviderFor(chain);
        const pending : BigNumber[] = await provider.all(
            filteredChainAssets.map((x)=>{
                const mcContract = new MulticallContract(x.farm.farmAddress, gaugeAbi);
                return mcContract.earned(this.walletId);
            })
        );

        // return an array with the same indexes as in the input jar
        // since we filtered them, they don't exactly match up right now
        return this.normalizeIndexes(chainAssets, filteredChainAssets, pending, BigNumber.from(0));
 
    }

    async getPicklePendingMinichef(chain: ChainNetwork, chainAssets: JarDefinition[],
        poolIds: number[], lpLower: string[]) : Promise<BigNumber[]> {
        const chef = ADDRESSES.get(chain).minichef;
        const multicallProvider = new MulticallProvider(this.providerFor(chain));
        await multicallProvider.init();    
        const miniChefMulticall : MulticallContract = new MulticallContract(chef, minichefAbi);
        const picklePending: BigNumber[] = await multicallProvider.all(
            poolIds.map((id) => {
            return miniChefMulticall.pendingPickle(id, this.walletId);
            })
        );
        const ret : BigNumber[] = [];
        for( let i = 0; i < chainAssets.length; i++ ) {
            const ind : number = lpLower.indexOf(chainAssets[i].contract.toLowerCase());
            if( ind === -1 ) {
                ret.push(BigNumber.from(0));
            } else {
                ret.push(picklePending[ind]);
            }
        }
        return ret;
    }

    async getUserGaugeVotes(): Promise<IUserVote[]> {
        const gaugeProxy = ADDRESSES.get(ChainNetwork.Ethereum).gaugeProxy;
        const gaugeProxyContract = new Contract(gaugeProxy, gaugeProxyAbi, this.providerFor(ChainNetwork.Ethereum));
        const eligibleTokens : string[] = await gaugeProxyContract.tokens();
        const provider : MulticallProvider = this.multicallProviderFor(ChainNetwork.Ethereum);
        const gaugeProxyMC = new MulticallContract(gaugeProxy, gaugeProxyAbi);
        const userVotes : BigNumber[] = await provider.all(
            eligibleTokens.map((x)=>{
                return gaugeProxyMC.votes(this.walletId, x);
            })
        );
        const ret: IUserVote[] = [];
        for( let i = 0; i < userVotes.length; i++ ) {
            const voteString = userVotes[i].toString();
            if( voteString !== BigNumber.from(0).toString())
                ret.push({farmDepositToken: eligibleTokens[i], weight: voteString})
        }
        return ret;
    }


    async getUserEarningsSummary(): Promise<IUserEarningsSummary> {
        try {
            return getUserJarSummary(this.walletId.toLowerCase(), this.model);
        } catch(error ) {
            console.log("Error in getUserEarningsSummary: " + error);
            throw error;
        }
    }

    async getUserDillStats(): Promise<IUserDillStats> {
        const provider : MulticallProvider = this.multicallProviderFor(ChainNetwork.Ethereum);
        const dillContractAddr : string = ADDRESSES.get(ChainNetwork.Ethereum).dill;
        const feeDistributorAddr : string = ADDRESSES.get(ChainNetwork.Ethereum).feeDistributor;
        const dillContract : Dill = Dill__factory.connect(dillContractAddr, this.providerFor(ChainNetwork.Ethereum));
        const feeDistributorContract : FeeDistributor = FeeDistributor__factory.connect(feeDistributorAddr, this.providerFor(ChainNetwork.Ethereum));

        const [
          lockStats,
          balance,
          userClaimable,
        ] = await Promise.all([
          dillContract.locked(this.walletId, { gasLimit: 1000000 }),
          dillContract["balanceOf(address)"](this.walletId, { gasLimit: 1000000 }),
          feeDistributorContract.callStatic["claim(address)"](this.walletId, {
            gasLimit: 1000000,
          }),
        ]);

        return {
            pickleLocked: lockStats[0].toString(),
            lockEnd: lockStats[1].toString(),
            balance: balance.toString(),
            claimable: userClaimable.toString(),
        }
    }

    normalizeIndexes(original: JarDefinition[], filtered: JarDefinition[], results: any[], def: any) : any[] {
        let destIndex = 0;
        const retval = [];
        for( let sourceIndex = 0; sourceIndex < original.length; sourceIndex++ ) {
            if(original[sourceIndex] === filtered[destIndex]) {
                retval.push(results[destIndex]);
                destIndex++;
            } else {
                retval.push(def);
            }
        }
        return retval;
    }

    providerFor(network: ChainNetwork) : Provider {
        return Chains.get(network).getPreferredWeb3Provider();
    }
    multicallProviderFor(chain: ChainNetwork) : MulticallProvider {
        return new MulticallProvider(this.providerFor(chain), Chains.get(chain).id);
    }

}

