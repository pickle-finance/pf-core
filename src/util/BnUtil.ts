import { BigNumber } from "@ethersproject/bignumber";

export function oneEParam(exponent: number) : BigNumber {
    const str : string = "1" + new Array(exponent).fill(0).join('');
    return BigNumber.from(str);
}