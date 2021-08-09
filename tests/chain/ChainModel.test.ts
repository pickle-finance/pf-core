import { Provider } from '@ethersproject/abstract-provider';
import { ethers } from 'ethers';
import { ChainNetwork, Chains } from '../../src/chain/Chains';
import { IChain } from '../../src/chain/IChain';


describe('Testing ChainModel', () => {

  test('Chain Models Exist', async () => {
    let chain  : IChain = Chains.get(ChainNetwork.Ethereum);
    expect(chain).toBeDefined();
    expect(chain.getPreferredWeb3Provider()).not.toBeDefined();
    expect(chain.getRandomWeb3Provider()).toBeDefined();
    expect(chain.id).toBe(1);
    expect(chain.name).toBe(ChainNetwork.Ethereum);
    expect(chain.rpcProviderUrls).toBeDefined();
    expect(chain.rpcProviderUrls.length).toBeGreaterThan(0);
    
    chain  = Chains.get(ChainNetwork.Polygon);
    expect(chain).toBeDefined();
    expect(chain.getPreferredWeb3Provider()).not.toBeDefined();
    expect(chain.getRandomWeb3Provider()).toBeDefined();
    expect(chain.id).toBe(137);
    expect(chain.name).toBe(ChainNetwork.Polygon);
    expect(chain.rpcProviderUrls).toBeDefined();
    expect(chain.rpcProviderUrls.length).toBeGreaterThan(0);

  });
  test('Test preferred provider', async () => {
    let chain  : IChain = Chains.get(ChainNetwork.Ethereum);
    const infura : Provider = new ethers.providers.InfuraProvider();
    expect(chain).toBeDefined();
    expect(chain.getPreferredWeb3Provider()).not.toBeDefined();
    chain.setPreferredWeb3Provider(infura);
    expect(chain.getPreferredWeb3Provider()).toBeDefined();
  });
});