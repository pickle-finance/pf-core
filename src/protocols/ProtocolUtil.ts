
export interface PoolId {
    [key: string]: number;
  }
  
export interface PoolInfo {
    [key: string]: {
      poolId: number;
      tokenName: string;
    };
  }
  
export const sushiPoolIds: PoolId = {
    "0xC3D03e4F041Fd4cD388c549Ee2A29a9E5075882f": 2,
    "0x397FF1542f962076d0BFE58eA045FfA2d347ACa0": 1,
    "0x06da0fd433C1A5d7a4faa01111c044910A184553": 0,
    "0xCEfF51756c56CeFFCA006cD410B03FFC46dd3a58": 21,
    "0x088ee5007C98a9677165D78dD2109AE4a3D04d0C": 11,
    "0x10B47177E92Ef9D5C6059055d92DdF6290848991": 132,
    "0x795065dCc9f64b5614C407a6EFDC400DA6221FB0": 12,
    "0x9461173740D27311b176476FA27e94C681b1Ea6b": 230,
  };
  
export const sushiPoolV2Ids: PoolId = {
    "0xC3f279090a47e80990Fe3a9c30d24Cb117EF91a8": 0,
    "0x05767d9EF41dC40689678fFca0608878fb3dE906": 1,
    "0xfCEAAf9792139BF714a694f868A215493461446D": 8,
  };
  
export const abracadabraIds: PoolId = {
    "0xb5De0C3753b6E1B4dBA616Db82767F17513E6d4E": 0,
    "0x5a6A4D54456819380173272A5E8E9B9904BdF41B": 1,
    "0x07D5695a24904CC1B6e3bd57cC7780B90618e3c4": 2,
  };
  
  
export const CVX_BOOSTER = "0xF403C135812408BFbE8713b5A23a04b3D48AAE31";
export const convexPools: PoolInfo = {
    "0x06325440D014e39736583c165C2963BA99fAf14E": {
      poolId: 25,
      tokenName: "steth",
    },
  };