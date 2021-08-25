import { RESOLVER_DEPOSIT_TOKEN } from '../price/PriceCache';
import { BigNumber, ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { AssetAprComponent, AssetProjectedApr, JarDefinition } from '../model/PickleModelJson';
import { JarBehavior, JarHarvestData } from './JarBehaviorResolver';
import { PickleModel } from '../model/PickleModel';

export const ONE_YEAR_IN_SECONDS : number = 365*24*60*60

export abstract class AbstractJarBehavior implements JarBehavior {

    async getProjectedAprStats(_definition: JarDefinition, _model: PickleModel) : Promise<AssetProjectedApr> {
        return undefined;
    }

    // TODO we can eventually get rid of the RESOLVER_DEPOSIT_TOKEN thingie
    // and put this functionality right here or in the subclasses
    async getDepositTokenPrice(definition: JarDefinition, model: PickleModel): Promise<number> {
        if( definition && definition.depositToken && definition.depositToken.addr) {
            return model.prices.getPrice(definition.depositToken.addr, RESOLVER_DEPOSIT_TOKEN);

        }
        return undefined;
    }

    /**
     * All apr components should arrive with percentages as apr values, 
     * so for example an APR of 50% should arrive as "50" and not "0.50"
     * 
     * All components should arrive post-fee (if applicable). 
     * It's best to use  `createAprComponent` for this purpose unless
     * you require custom logic. 
     */
    aprComponentsToProjectedApr(components: AssetAprComponent[]) : AssetProjectedApr {
        let compoundableApr = 0;
        let nonCompoundableApr = 0;
        for( let i = 0; i < components.length; i++ ) {
            if( components[i].compoundable ) {
                compoundableApr += components[i].apr;
            } else {
                nonCompoundableApr += components[i].apr;
            }
        }
        let totalApr = compoundableApr + nonCompoundableApr;
        let totalApy = getCompoundingAPY(compoundableApr/100) + nonCompoundableApr;
        return {
          components: components, 
          apr: totalApr,
          apy: totalApy
        }
    }

    createAprComponent(id: string, aprPreFee: number, compoundable: boolean) : AssetAprComponent {
        return {
            name: id,
            apr: compoundable ? aprPreFee * 0.8 : aprPreFee,
            compoundable: compoundable
        };
    }
    async getJarHarvestData(definition: JarDefinition, model: PickleModel,
        balance: BigNumber, available: BigNumber, resolver: Signer | Provider): Promise<JarHarvestData> {

        const balanceWithAvailable = balance.add(available);
        const depositTokenDecimals = (definition.depositToken.decimals ? definition.depositToken.decimals : 18);
        const depositTokenPrice: number = await model.prices.getPrice(definition.depositToken.addr, RESOLVER_DEPOSIT_TOKEN);
        const balanceUSD: number = parseFloat(ethers.utils.formatUnits(balanceWithAvailable, depositTokenDecimals)) * depositTokenPrice;
        const availUSD: number = parseFloat(ethers.utils.formatUnits(available, depositTokenDecimals)) * depositTokenPrice;

        const harvestableUSD: number = await this.getHarvestableUSD(definition, model, resolver);
        return {
            name: definition.id,
            jarAddr: definition.contract,
            strategyName: definition.details.strategyName,
            strategyAddr: definition.details.strategyAddr,
            stats: {
                balanceUSD: balanceUSD,
                earnableUSD: availUSD,
                harvestableUSD: harvestableUSD
            }
        };
    }
    abstract getHarvestableUSD(jar: JarDefinition, model: PickleModel, resolver: Signer | Provider): Promise<number>;
}


// TODO move to math utility or something?
export function getCompoundingAPY(apr: number) {
    return 100 * (Math.pow(1 + apr / 365, 365) - 1);
};

