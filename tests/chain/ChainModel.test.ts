/*
import Web3 from "web3";
import HttpProvider from "web3";
*/
import { Chain, ChainModel } from '../../src/chain/ChainModel';

describe('Testing ChainModel', () => {

  test('Chain Model Preferred Providers', async () => {
    const cm : ChainModel = new ChainModel();
    const ethArr : Set<string> = new Set<string>();
    for( let i = 0; i < 10; i++ ) {
      ethArr.add((cm.getPreferredWeb3Provider(Chain.Ethereum).currentProvider as any).host);
    }
    expect(ethArr.size).toBe(1);

    const polyArr : Set<string> = new Set<string>();
    for( let i = 0; i < 10; i++ ) {
      polyArr.add((cm.getPreferredWeb3Provider(Chain.Polygon).currentProvider as any).host);
    }
    expect(polyArr.size).toBe(1);

  });


  test('Chain Model Random Providers', async () => {
    const cm : ChainModel = new ChainModel();
    const ethArr : Set<string> = new Set<string>();
    for( let i = 0; i < 20; i++ ) {
      ethArr.add((cm.getRandomWeb3Provider(Chain.Ethereum).currentProvider as any).host);
    }
    expect(ethArr.size).toBe(1);

    const polyArr : Set<string> = new Set<string>();
    for( let i = 0; i < 20; i++ ) {
      polyArr.add((cm.getRandomWeb3Provider(Chain.Polygon).currentProvider as any).host);
    }
    expect(polyArr.size).toBe(3);

  });


});